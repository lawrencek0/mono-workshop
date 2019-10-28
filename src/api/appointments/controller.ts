import { JsonController, Post, BodyParam, Body, HttpError, CurrentUser, Get, Patch, Param } from 'routing-controllers';
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
                // title.slots = this.slotRepository.saveSlot(slot);
                slot.forEach(element => {
                    // console.log(element);
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
                const appoint = this.detailRepository.findAllFac(user.id);
                return appoint;
            } else if (user.role === 'student') {
                const appoint = await this.detailRepository.findAllStu(user.id);
                // const output = appoint.map(({ slots, ...rest }) => {
                //     // there will be only one slot associated with a detail for a student
                //     const { id: slotId, ...slot } = slots[0];
                //     return { ...rest, slotId, ...slot };
                // });
                console.log(appoint);
                return { appoint };
            }
        } catch (error) {
            return console.error();
        }
    }

    @Patch('/:id')
    async update(@CurrentUser({ required: true }) user: User, @Param('id') id: number) {
        if (user.role === 'student') {
            const slot = await this.slotRepository.findById(id);
            slot.student = user;
            return this.slotRepository.saveSlot(slot);
        } else {
            return 'You can not do this silly head';
        }
    }
}
