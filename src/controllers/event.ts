import { Request, Response } from 'express';
import { getRepository, getManager } from 'typeorm';
import { Event } from '../entities/Event';
import { User } from '../entities/User';
import hashids from '../util/hasher';
import { EventColor } from '../entities/EventColor';

export const create = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const id = (hashids.decode(maskedId)[0] as unknown) as number;
    const creator = await getRepository(User).findOne(id);
    const users = await getRepository(User).findByIds(req.body.users.map(({ id }: { id: number }) => id));
    const event = await getRepository(Event).save({
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        description: req.body.description,
        location: req.body.location,
        owner: creator,
        users,
    });

    const events = await Promise.all(
        users.map(user => {
            const evnt = new EventColor();
            evnt.color = req.body.color;
            evnt.user = user;
            evnt.event = event;
            return evnt;
        }),
    );
    await getRepository(EventColor).insert(events);
    res.send({ event });
};

export const fetchEvents = async (req: Request, res: Response) => {
    try {
        const maskedId = res.locals.user['custom:user_id'];
        const id = (hashids.decode(maskedId)[0] as unknown) as number;

        const events = await getRepository(Event)
            .createQueryBuilder('event')
            .innerJoinAndSelect('event.users', 'user', 'user.id = :userId', { userId: id })
            .innerJoinAndMapOne(
                'event.color',
                'event.colors',
                'colors',
                'colors.user = user.id AND colors.event = event.id',
            )
            .getMany();

        res.send({ events });
    } catch (err) {
        res.send('It broke ' + err);
    }
};

//gets the list of users associated with a certain event
export const fetchEvent = async (req: Request, res: Response) => {
    const event = await getRepository(Event).findOne({
        where: { id: req.params.eventId },
        relations: ['owner', 'users'],
    });
    res.send({ event });
};

export const shareEvent = async (req: Request, res: Response) => {
    //gets the event to be shared
    const event: Event = await getRepository(Event).findOne({ where: { id: req.params.eventId } });
    const shareTo = await getRepository(User).findByIds(req.body.users);

    //shares the event with each user given
    const op = shareTo.map(async user => {
        getManager()
            .createQueryBuilder()
            .relation(Event, 'users')
            .of(event)
            .add(user);
    });
    const done = await Promise.all(op);

    res.send({ done });
};
