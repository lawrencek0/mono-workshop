import { Request, Response } from 'express';
import { getRepository, getManager, DeleteResult } from 'typeorm';
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

export const deleteOne = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const id = (hashids.decode(maskedId)[0] as unknown) as number;

    const event: Event = await getRepository(Event).findOne(req.params.id, { relations: ['owner'] });

    // Check if the person trying to update is the owner
    // If they aren't the owner just return and send an error message
    if (id !== event.owner.id) {
        res.status(401).send({ msg: 'Unauthorized: You are not the Owner' });
        return;
    }
    await getRepository(EventColor).delete({ event: event });

    const deleted: DeleteResult = await getRepository(Event).delete(event);

    res.send(deleted);
};

// TODO: Fix "color" field not being set.  I think this has to do with how color is set in the event entity
//       It is not under a specific column like everything else and is in the colors association.  Validate it works.
// TODO: Test updating colors association
// Everything else updates!
// TODO: Remove the comments above
export const update = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const id = (hashids.decode(maskedId)[0] as unknown) as number;

    const ownerId: number = await getRepository(Event)
        .findOne(req.params.id, { relations: ['owner'] })
        .then(event => event.owner.id)
        .catch(err => {
            res.status(404).send('Could not find Event');
            return err;
        });

    // Check if the person trying to update is the owner
    // If they aren't the owner just return and send an error message
    if (id !== ownerId) {
        res.status(401).send({ msg: 'You are not the Owner' });
        return;
    }

    let event: Event = new Event();

    // All the possible parameters that can be updated
    event.id = parseInt(req.params.id);
    event.title = req.body.title;
    event.start = req.body.start;
    event.end = req.body.end;
    event.location = req.body.location;
    event.description = req.body.description;
    //event.color = req.body.color;

    // If an association is being updated, set the assocition
    if (req.body.ownerId)
        event.owner = await getRepository(User)
            .findOne(parseInt(req.body.ownerId))
            .catch(err => err);
    if (req.body.users)
        event.users = await getRepository(User)
            .findByIds(req.body.users)
            .catch(err => err);
    if (req.body.colors)
        event.colors = await getRepository(EventColor)
            .findByIds(req.body.colors)
            .catch(err => err);

    event = await getRepository(Event)
        .preload(event)
        .catch(err => err);

    const updated: Event = await getRepository(Event)
        .save(event)
        .catch(err => err);

    res.send(updated);
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
