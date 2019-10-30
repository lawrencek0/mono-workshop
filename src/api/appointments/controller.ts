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
import { DetailRepository, SlotRepository } from './repository';
import { Detail } from './entity/Detail';
import { Slot } from './entity/Slot';

@JsonController('/appointments')
export class AppointmentControler {
    @Inject() private detailRepository: DetailRepository;
    @Inject() private slotRepository: SlotRepository;

    // faculty creates appointment
    // slots for that appointment are saved
    // supplies the list of students that can 'see' it
    @Post('/')
    async create(
        @CurrentUser({ required: true }) user: User,
        @Body() detail: Detail,
        @BodyParam('slots') slots: Slot[],
    ) {
        try {
            if (user.role === 'faculty') {
                detail.faculty = user;
                await this.detailRepository.saveDetail(detail);

                await Promise.all(
                    slots.map(slot => {
                        slot.detail = detail;
                        this.slotRepository.saveSlot(slot);
                    }),
                );

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

    @Get('/:detailId')
    async untakenByDetail(@CurrentUser({ required: true }) user: User, @Param('detailId') detailId: number) {
        //checks that there isan
        if (user.role === 'student') {
            return this.detailRepository.findUntaken(detailId);
        } else {
            return 'you are not supposed to be here';
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
