import { JsonController, Post, BodyParam, Body, HttpError, CurrentUser } from 'routing-controllers';
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
}
