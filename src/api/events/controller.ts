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
} from 'routing-controllers';
import { Inject } from 'typedi';
import { User } from '../users/entity/User';
import { EventRepository } from './repository';
import { Detail } from '../appointments/entity/Detail';
import { Slot } from '../appointments/entity/Slot';
import { EventColor } from '../events/entity/Color';
import { Event } from './entity/Event';

@JsonController('/event')
export class EventController {
    @Inject() private eventRepository: EventRepository;

    @Post('/')
    async create(
        @CurrentUser({ required: true }) user: User, 
        @Body() event: Event,
        ) {
        try {
            event.owner = user;
        } catch (e) {
            throw new HttpError(e);
        }
    // }
}

// export const create = async (req: Request, res: Response) => {
//     const maskedId = res.locals.user['custom:user_id'];
//     const id = (hashids.decode(maskedId)[0] as unknown) as number;
//     const creator = await getRepository(User).findOne(id);
//     const users = await getRepository(User).findByIds(req.body.users.map(({ id }: { id: number }) => id));
//     const event = await getRepository(Event).save({
//         title: req.body.title,
//         start: req.body.start,
//         end: req.body.end,
//         description: req.body.description,
//         location: req.body.location,
//         owner: creator,
//         users,
//     });

//     const events = await Promise.all(
//         users.map(user => {
//             const evnt = new EventColor();
//             evnt.color = req.body.color;
//             evnt.user = user;
//             evnt.event = event;
//             return evnt;
//         }),
//     );
//     await getRepository(EventColor).insert(events);
//     res.send({ event });
// };
