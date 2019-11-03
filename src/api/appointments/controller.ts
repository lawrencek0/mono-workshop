import {
    JsonController,
    Post,
    BodyParam,
    Body,
    HttpError,
    CurrentUser,
    Get,
    Patch,
    Param,
    BadRequestError,
    Delete,
} from 'routing-controllers';
import { Inject } from 'typedi';
import { User } from '../users/entity/User';
import { DetailRepository, SlotRepository, ColorRepository } from './repository';
import { Detail } from './entity/Detail';
import { Slot } from './entity/Slot';
import { AppointmentColor } from './entity/AppointmentColor';
import { UserRepository } from '../users/repository';

@JsonController('/appointments')
export class AppointmentControler {
    @Inject() private detailRepository: DetailRepository;
    @Inject() private slotRepository: SlotRepository;
    @Inject() private colorRepository: ColorRepository;
    @Inject() private userRepository: UserRepository;

    // faculty creates appointment
    // slots for that appointment are saved
    // supplies the list of students that can 'see' it
    // @FIXME needs colors
    @Post('/')
    async create(
        @CurrentUser({ required: true }) user: User,
        @Body() detail: Detail,
        @BodyParam('slots') slots: Slot[],
        @BodyParam('colors') color: string,
    ) {
        try {
            console.log('acevgrehtyjukigulk,umnhbgxfvd');
            if (user.role === 'faculty') {
                const students = await this.userRepository.findAllById(detail.students.map(({ id }) => id));
                try {
                    // const newDetail = await this.detailRepository.saveDetail({ ...detail, students, faculty: user });
                } catch (error) {
                    console.log('qwertyuiop[;lkjhgfd', error);
                }

                // return 'xsacdsvfbghnjmnhgbfvdcs';
                const newDetail = await this.detailRepository.saveDetail({ ...detail, students, faculty: user });
                console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!  ', newDetail.id);
                const facultyColor = new AppointmentColor();
                facultyColor.user = user;
                facultyColor.detail = newDetail;
                facultyColor.hexColor = color;
                console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!  ', newDetail.id);

                // await this.detailRepository.saveDetail(newDetail);
                await this.colorRepository.saveColor(facultyColor);
                await Promise.all([
                    slots.map(slot => {
                        slot.detail = newDetail;
                        this.slotRepository.saveSlot(slot);
                    }),
                    students.map(student => {
                        const newColor = new AppointmentColor();
                        newColor.user = student;
                        newColor.detail = newDetail;
                        newColor.hexColor = color;
                        this.colorRepository.saveColor(newColor);
                        return newColor;
                    }),
                ]);

                return { detail, slots };
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
                return this.detailRepository.findAllFac(user.id);
            } else if (user.role === 'student') {
                const appoint = await this.detailRepository.findAllStu(user.id);

                return { appoint };
            }
        } catch (error) {
            return console.error();
        }
    }

    @Get('/untaken/:detailId')
    async untakenByDetail(@CurrentUser({ required: true }) user: User, @Param('detailId') detailId: number) {
        //checks that there isan
        if (user.role === 'student') {
            return this.detailRepository.findUntaken(detailId);
        } else {
            return 'you are not supposed to be here';
        }
    }

    @Get('/:detailId')
    async findTheseSlots(@CurrentUser({ required: true }) user: User, @Param('detailId') detailId: number) {
        if (user.role === 'student') {
            const { slots, ...Detail } = await this.detailRepository.findById(detailId);
            const output = slots.map(({ student, ...slot }) => {
                // If slot has a student replace its information with "taken":true
                // If it doesn't have a student, add "taken":false
                return student ? { ...slot, taken: true } : { ...slot, taken: false };
            });

            return { slots: output, ...Detail };
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
                return this.slotRepository.saveSlot(slot);
            } catch (e) {
                throw new BadRequestError(e);
            }
        } else {
            return 'You can not do this silly head';
        }
    }

    // @FIXME updates color for those who are not owner
    // if owner then they can update color, title, description, or student list
    @Patch('/:detail')
    async updateDetail() {
        return '';
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

    @Delete('/:detailId/:slotId')
    async deleteSlot(
        @CurrentUser({ required: true }) user: User,
        @Param('detailId') detailId: number,
        @Param('slotId') slotId: number,
    ) {
        return this.slotRepository.deleteSlot(slotId, user.id);
    }
}
