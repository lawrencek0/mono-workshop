import { Request, Response } from 'express';
import { Detail } from '../entities/Detail';
import { getRepository, getManager } from 'typeorm';
import { Event } from '../entities/Event';
import { User } from '../entities/User';
import hashids from '../util/hasher';

export const create = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const id = (hashids.decode(maskedId)[0] as unknown) as number;
    const creater = await getRepository(User).findOne(id);
    const events = await getRepository(Event).save({
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        description: req.body.description,
        location: req.body.location,
        owner: creater,
        users: req.body.users,
    });
    res.send({ events });
};

export const getUserEvents = async (req: Request, res: Response) => {
    try {
        const maskedId = res.locals.user['custom:user_id'];
        const uId = (hashids.decode(maskedId)[0] as unknown) as number;

        const events = await getRepository(Event)
            .createQueryBuilder('event')
            .innerJoinAndSelect('event.users', 'user', 'user.id = :userId', { userId: uId })
            .getMany();

        res.send({ events });
    } catch (err) {
        res.send('It broke ' + err);
    }
};
