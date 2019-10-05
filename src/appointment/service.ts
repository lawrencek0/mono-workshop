import { Request, Response } from 'express';
import { Detail } from './detail/models';
import { getConnection } from 'typeorm';
import { Slot } from './slot/models';
import { User } from '../user/model';
import hashids from '../util/hasher';

export const create = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const id = (hashids.decode(maskedId)[0] as unknown) as number;
    const slots = await getConnection()
        .getRepository(Slot)
        .save(req.body.dates);
    const user = await getConnection()
        .getRepository(User)
        .findByIds(req.body.students.map((student: User) => student.id));
    user.forEach((user: User) => {
        user.Slot = slots;
        getConnection()
            .getRepository(User)
            .save(user);
    });
    const faculty = await getConnection()
        .getRepository(User)
        .findOne(id);
    const detail = await getConnection()
        .getRepository(Detail)
        .save({ title: req.body.title, description: req.body.description, slots, user: faculty });

    res.send({ detail });
};

export const findByFacultyId = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const id = (hashids.decode(maskedId)[0] as unknown) as number;
    const appointments = await getConnection()
        .getRepository(Detail)
        .find({ where: { user: id } });

    res.send({ appointments });
};

//This findAll list all appointments for user who is currently login
export const findAll = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const userId = (hashids.decode(maskedId)[0] as unknown) as number;
    const userWithSlots = await getConnection()
        .getRepository(User)
        .findOne(userId, { relations: ['Slot'] });

    res.send(userWithSlots);
};

//post this when you test it. { "slotId": 3, "detailId": 1 }
export const selectAppointment = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const userId = (hashids.decode(maskedId)[0] as unknown) as number;
    const slot: Slot = await getConnection()
        .getRepository(Slot)
        .findOne(req.body.slotId);

    const student: User = await getConnection()
        .getRepository(User)
        .findOne(userId);

    slot.student = student;
    const updatedSlot: Slot = await getConnection()
        .getRepository(Slot)
        .save(slot);

    res.send(updatedSlot);
};

//deselect student from an appointment
export const deselectAppointment = async (req: Request, res: Response) => {
    const slot: Slot = await getConnection()
        .getRepository(Slot)
        .findOne(req.body.slotId);

    slot.student = null;
    const updatedSlot: Slot = await getConnection()
        .getRepository(Slot)
        .save(slot);

    res.send(updatedSlot);
};
