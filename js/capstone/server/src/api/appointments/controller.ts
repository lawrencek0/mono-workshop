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
    NotFoundError,
    Authorized,
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
    @Authorized('faculty')
    @Post('/')
    async create(
        @BodyParam('students') selectedStudents: User[],
        @CurrentUser({ required: true }) user: User,
        @BodyParam('title') detTitle: string,
        @BodyParam('description') detDesc: string,
        @BodyParam('slots') slots: Slot[],
        @BodyParam('color') color: string,
    ) {
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
        detailUsers.push({ user, hexColor: color, detail: newDetail });
        const [newSlots, newUsers] = await Promise.all([
            this.slotRepository.saveSlots(slotsWithDetail),
            this.detailUsersRepo.saveDetailUsers(detailUsers),
        ]);

        this.dispatch('create', { ...newDetail, slots: newSlots, users: newUsers });

        return { ...newDetail, slots: newSlots };
    }

    // finds all appointments that the user is associated with
    @Get('/')
    async findAll(@CurrentUser({ required: true }) user: User) {
        if (user.role === 'admin') {
            return this.detailRepository.findAll();
        }

        if (user.role === 'faculty') {
            return this.detailRepository.findAllForFaculty(user.id);
        }

        if (user.role === 'student') {
            return this.detailRepository.findAllForStudent(user.id);
        }
    }

    // @FIXME: bug in routing-controller allows request to '/untaken' to fall through
    // to ':/detailId'
    @Authorized('student')
    @Get('/details/untaken')
    async untakenByDetail(@CurrentUser({ required: true }) user: User) {
        // returns the appointment details that the student must still need to sign up for
        return this.detailRepository.findUntaken(user);
    }

    @Get('/:detailId')
    async findSlotsForDetail(@CurrentUser({ required: true }) user: User, @Param('detailId') detailId: number) {
        const detail = await this.detailRepository.findById(detailId);
        if (detail) {
            const { slots, users, ...Detail } = detail;
            if (user.role === 'student') {
                const output = slots.map(({ student, ...slot }) => {
                    // If slot is owned by the user include the student information
                    // If slot has a student replace its information with "student":true
                    // If it doesn't have a student, add "student":false
                    return student
                        ? { ...slot, student: student.id === user.id ? student : true }
                        : { ...slot, student: false };
                });

                return { slots: output, ...Detail };
            } else if (user.role === 'faculty' || user.role === 'admin') {
                return {
                    slots,
                    students: users.filter(({ user: { id } }) => id !== user.id).map(({ user }) => user),
                    ...Detail,
                };
            }
        }

        throw new NotFoundError('Invalid appointment');
    }
    // student selects an appointment slot
    // re-selects if they already have one for that detail
    @Authorized('student')
    @Patch('/:detailId/:slotId')
    async update(
        @CurrentUser({ required: true }) user: User,
        @Param('detailId') detailId: number,
        @Param('slotId') slotId: number,
    ) {
        //finds the slot that the user wants
        const slot = await this.slotRepository.findById(slotId);
        //finds the slots for the detail that the user has already taken
        const taken: Slot = await this.slotRepository.findMyTaken(user.id, detailId);
        if (taken) {
            //deselects the old appointment
            taken.student = null;
            await this.slotRepository.saveSlot(taken);
        }

        if (!taken || taken.id !== slotId) {
            //selects the new slot for the student
            slot.student = user;
            await this.slotRepository.saveSlot(slot);
        }

        const { slots, users: _, ...Detail } = await this.detailRepository.findById(detailId);
        const output = slots.map(({ student, ...slot }) => {
            // If slot is owned by the user include the student information
            // If slot has a student replace its information with "student":true
            // If it doesn't have a student, add "student":false
            return student
                ? { ...slot, student: student.id === user.id ? student : true }
                : { ...slot, student: false };
        });

        return { slots: output, ...Detail };
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
        if (user.role === 'student') {
            // if the current is only a student then they can only update the color
            // shown on their calendar
            const detail = await this.detailRepository.findById(detailId);
            const detailUser = await this.detailUsersRepo.getOne(user, detail);
            detailUser.hexColor = newColor;

            return this.detailUsersRepo.saveDetailUser(detailUser);
        } else if (user.role === 'faculty' || user.role === 'admin') {
            // checks that the current user is the owner of the detail
            const detailOwn = await this.detailRepository.isOwner(detailId, user.id);
            if (detailOwn) {
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

                await this.detailUsersRepo.saveDetailUser(detailUser);
                const { slots, users, ...Detail } = await this.detailRepository.findById(newDetail.id);

                // front end expects data smth like this:
                return {
                    slots,
                    students: users.filter(({ user: { id } }) => id !== user.id).map(({ user }) => user),
                    ...Detail,
                };
            }
        }
    }

    // deletes a detail and everything associated with it
    // only the owner of an appointment can delete it
    @Delete('/:detailId')
    async deleteDetail(@CurrentUser({ required: true }) user: User, @Param('detailId') detailId: number) {
        const detail = await this.detailRepository.findDetail(detailId);
        this.dispatch('delete', { ...detail });
        return this.detailRepository.deleteDetail(detailId, user.id);
    }

    // deletes an individual slot
    // @FIXME: assumes that the user has permission to do this
    @Delete('/:detailId/:slotId')
    async deleteSlot(
        @CurrentUser({ required: true }) user: User,
        @Param('detailId') detailId: number,
        @Param('slotId') slotId: number,
    ) {
        const detailOwn = await this.detailRepository.isOwner(detailId, user.id);

        if (detailOwn || user.role === 'admin') {
            await this.slotRepository.deleteSlot(slotId, user.id);
            return this.detailRepository.findById(detailId);
        } else {
            throw new UnauthorizedError("You can't delete this slot");
        }
    }
}
