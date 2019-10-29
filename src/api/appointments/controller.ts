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

    @Post('/')
    async create(
        @CurrentUser({ required: true }) user: User,
        @Body() detail: Detail,
        @BodyParam('slots') slot: Slot[],
    ) {
        try {
            if (user.role === 'faculty') {
                detail.faculty = user;
                const title = await this.detailRepository.saveDetail(detail);
                slot.forEach(element => {
                    element.detail = title;
                    this.slotRepository.saveSlot(element);
                });

                return title;
            }
        } catch (e) {
            throw new HttpError(e);
        }
    }

    @Get('/')
    async findAll(@CurrentUser({ required: true }) user: User) {
        try {
            if (user.role === 'faculty') {
                const appoint = await this.detailRepository.findAllFac(user.id);
                return appoint;
            } else if (user.role === 'student') {
                const appoint = await this.detailRepository.findAllStu(user.id);

                return { appoint };
            }
        } catch (error) {
            return console.error();
        }
    }

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

    @Delete('/:detailId')
    async delete() {
        return '';
    }
}
