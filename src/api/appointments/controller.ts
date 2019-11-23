import {
    JsonController,
    Post,
    BodyParam,
    HttpError,
    CurrentUser,
    Get,
    Patch,
    Param,
    BadRequestError,
    Delete,
    UnauthorizedError,
} from 'routing-controllers';
import { Inject } from 'typedi';
import { IEvent, EventList } from 'strongly-typed-events';
import { User } from '../users/entity/User';
import { DetailRepository, SlotRepository, DetailUsersRepo } from './repository';
import { Slot } from './entity/Slot';
import { UserRepository } from '../users/repository';
import { Detail } from './entity/Detail';

@JsonController('/appointments')
export class AppointmentControler {
    @Inject() private detailRepository: DetailRepository;
    @Inject() private slotRepository: SlotRepository;
    @Inject() private detailUsersRepo: DetailUsersRepo;
    @Inject() private userRepository: UserRepository;
    private events = new EventList<this, Detail>();

    get onCreate(): IEvent<this, Detail> {
        return this.events.get('create').asEvent();
    }

    get onDelete(): IEvent<this, Detail> {
        return this.events.get('delete').asEvent();
    }

    private dispatch(name: 'create' | 'delete', args: Detail) {
        this.events.get(name).dispatchAsync(this, args);
    }

    // faculty creates appointment
    // slots for that appointment are saved
    // supplies the list of students that can 'see' it
    // @FIXME needs colors
    @Post('/')
    async create(
        @BodyParam('students') selectedStudents: User[],
        @CurrentUser({ required: true }) user: User,
        @BodyParam('title') detTitle: string,
        @BodyParam('description') detDesc: string,
        @BodyParam('slots') slots: Slot[],
        @BodyParam('color') color: string,
    ) {
        try {
            if (user.role === 'faculty') {
                const students = await this.userRepository.findAllById(selectedStudents);
                const newDetail = await this.detailRepository.saveDetail({
                    title: detTitle,
                    description: detDesc,
                    slots: undefined,
                    faculty: user,
                    users: undefined,
                    id: undefined,
                });
                const slotsWithDetail = slots.map(slot => ({ ...slot, detail: newDetail }));
                const detailUsers = students.map(student => ({ user: student, detail: newDetail, hexColor: color }));
                const [newSlots, newUsers] = await Promise.all([
                    this.slotRepository.saveSlots(slotsWithDetail),
                    this.detailUsersRepo.saveDetailUsers(detailUsers),
                ]);

                this.dispatch('create', { ...newDetail, slots: newSlots, users: newUsers });

                return { ...newDetail, slots: newSlots };
            }
        } catch (e) {
            throw new HttpError(e);
        }
    }

    // finds all appointments that the user is associated with
    @Get('/')
    async findAll(@CurrentUser({ required: true }) user: User) {
        try {
            if (user.role === 'faculty') {
                return this.detailRepository.findAllForFaculty(user.id);
            } else if (user.role === 'student') {
                return this.detailRepository.findAllForStudent(user.id);
            }
        } catch (e) {
            throw new HttpError(e);
        }
    }

    // @FIXME: bug in routing-controller allows request to '/untaken' to fall through
    // to ':/detailId'
    @Get('/details/untaken')
    async untakenByDetail(@CurrentUser({ required: true }) user: User) {
        // returns the appointment details that the student must still need to sign up for
        if (user.role === 'student') {
            try {
                return this.detailRepository.findUntaken(user);
            } catch (e) {
                throw new HttpError(e);
            }
        }

        throw new UnauthorizedError('you are not supposed to be here');
    }

    @Get('/:detailId')
    async findSlotsForDetail(@CurrentUser({ required: true }) user: User, @Param('detailId') detailId: number) {
        if (user.role === 'student') {
            const { slots, ...Detail } = await this.detailRepository.findById(detailId);
            const output = slots.map(({ student, ...slot }) => {
                // If slot is owned by the user include the student information
                // If slot has a student replace its information with "student":true
                // If it doesn't have a student, add "student":false
                return student
                    ? { ...slot, student: student.id === user.id ? student : true }
                    : { ...slot, student: false };
            });

            return { slots: output, ...Detail };
        } else if (user.role === 'faculty') {
            return this.detailRepository.findById(detailId);
        }
    }
    // student selects an appointment slot
    // re-selects if they already have one for that detail
    @Patch('/:detailId/:slotId')
    async update(
        @CurrentUser({ required: true }) user: User,
        @Param('detailId') detailId: number,
        @Param('slotId') slotId: number,
    ) {
        if (user.role === 'student') {
            try {
                //finds the slot that the user wants
                const slot = await this.slotRepository.findById(slotId);
                //finds the slots for the detail that the user has already taken
                const taken: Slot = await this.slotRepository.findMyTaken(user.id, detailId);
                if (taken) {
                    //deselects the old appointment
                    taken.student = null;
                    this.slotRepository.saveSlot(taken);
                }
                //selects the new slot for the student
                slot.student = user;
                await this.slotRepository.saveSlot(slot);
                return this.detailRepository.findById(detailId);
            } catch (e) {
                throw new BadRequestError(e);
            }
        }

        throw new UnauthorizedError('You can not do this silly head');
    }

    // if owner then they can update color, title, description, or student list
    @Patch('/:detailId')
    async updateDetail(
        @CurrentUser({ required: true }) user: User,
        @Param('detailId') detailId: number,
        @BodyParam('color') newColor: string,
        @BodyParam('title') newTitle: string,
        @BodyParam('description') newDesc: string,
        @BodyParam('users') newUsers: User[],
    ) {
        // checks that the current user is the owner of the detail
        const detailOwn = await this.detailRepository.isOwner(detailId, user.id);
        if (user.role === 'student') {
            // if the current is only a student then they can only update the color
            // shown on their calendar
            const detail = await this.detailRepository.findById(detailId);
            const detailUser = await this.detailUsersRepo.getOne(user, detail);
            detailUser.hexColor = newColor;

            return this.detailUsersRepo.saveDetailUser(detailUser);
        } else if (user.role === 'faculty' && detailOwn) {
            // checks that the user is the owner of the appointment detail
            // if they are the owner then they can add students to the list
            // or change title or description and update their own color

            const detailUser = await this.detailUsersRepo.getOne(user, detailOwn);
            if (newTitle) detailOwn.title = newTitle;
            if (newDesc) detailOwn.description = newDesc;
            if (newColor) detailUser.hexColor = newColor;
            const newDetail = await this.detailRepository.saveDetail(detailOwn);

            if (newUsers) {
                const users = await this.userRepository.findAllById(newUsers);

                // maps the new users to the detail and gives them their color
                await Promise.all(
                    users.map(student => {
                        return this.detailUsersRepo.saveDetailUser({
                            user: student,
                            detail: newDetail,
                            hexColor: newColor,
                        });
                    }),
                );
            }

            return this.detailUsersRepo.saveDetailUser(detailUser);
        }
    }

    // deletes a detail and everything associated with it
    // only the owner of an appointment can delete it
    @Delete('/:detailId')
    async deleteDetail(@CurrentUser({ required: true }) user: User, @Param('detailId') detailId: number) {
        try {
            return this.detailRepository.deleteDetail(detailId, user.id);
        } catch (error) {
            return 'You cannot delete this detail ' + error;
        }
    }

    // deletes an individual slot
    // @FIXME: assumes that the user has permission to do this
    @Delete('/:detailId/:slotId')
    async deleteSlot(
        @CurrentUser({ required: true }) user: User,
        @Param('detailId') detailId: number,
        @Param('slotId') slotId: number,
    ) {
        return this.slotRepository.deleteSlot(slotId, user.id);
    }
}
