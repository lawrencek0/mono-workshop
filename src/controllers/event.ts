import { Request, Response } from 'express';
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
        ownerId: creater,
        users: req.body.users,
    });
    res.send({ events });
};

//gets the events that the current user is related to
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

//gets the list of users associated with a certain event
export const getEventUsers = async (req: Request, res: Response) => {
    const users = await getRepository(Event).find({ where: { id: req.params.id }, relations: ['users'] });

    res.send(users);
};

export const shareEvent = async (req: Request, res: Response) => {
    //gets the event to be shared
    const evnt: Event = await getRepository(Event).findOne({ where: { id: req.params.id } });
    const shareTo: number[] = req.body.users;

    //shares the event with each user given
    shareTo.forEach(async element => {
        const shareTarget = await getRepository(User).findOne({ where: { id: element } });
        const done = await getManager()
            .createQueryBuilder()
            .relation(Event, 'users')
            .of(evnt)
            .add(shareTarget);
        res.send(done);
    });
};
