import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Event } from '../entities/Event';
import { User } from '../entities/User';
import hashids from '../util/hasher';

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
    res.send({ event });
};

export const fetchEvents = async (req: Request, res: Response) => {
    try {
        const maskedId = res.locals.user['custom:user_id'];
        const id = (hashids.decode(maskedId)[0] as unknown) as number;

        const events = await getRepository(Event)
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.users', 'user', 'user.id = :userId', { userId: id })
            .getMany();

        res.send({ events });
    } catch (err) {
        res.send('It broke ' + err);
    }
};

export const fetchEvent = async (req: Request, res: Response) => {
    const event = await getRepository(Event).findOne({
        where: { id: req.params.eventId },
        relations: ['owner', 'users'],
    });
    res.send({ event });
};
