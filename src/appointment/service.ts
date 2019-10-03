import { Request, Response } from 'express';
import { Detail } from './detail/models';
import { getConnection } from 'typeorm';
import { Slot } from './slot/models';
import { User } from '../user/model';
import hashids from '../util/hasher';

export const create = async (req: Request, res: Response) => {
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
    const detail = await getConnection()
        .getRepository(Detail)
        .save({ title: req.body.title, description: req.body.description, slots });

    res.send({ detail });
};
// //This findAll list all appointments doesn't care who is user
// export const findAll = async (req: Request, res: Response) => {
//     const slots = await getConnection()
//         .getRepository(Slot)
//         .find({ order: { start: 'ASC' } });

//     res.send(slots);
// };

// testMethod: make appointments with 1,2 student id, signup 123 login as 1
//go to get appointment check if it shows all appointment(should show all). login as 3 and check if it shows
//appointment or not(should not show)
//This findAll list all appointments for user who is currently login
export const findAll = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const userId = (hashids.decode(maskedId)[0] as unknown) as number;
    const userWithSlots = await getConnection()
        .getRepository(User)
        .findOne(userId, { relations: ['Slot'] });

    res.send(userWithSlots);
};

// export const selectAppointment = async (req: Request, res: Response) => {
//     const maskedId = res.locals.user['custom:user_id'];
//     const userId = (hashids.decode(maskedId) as unknown) as number;
//     const user: User = await getConnection()
//         .getRepository(User)
//         .findOne(userId);
//     user.Slot = req.body.slotId;
//     const updatedUser: User = await getConnection()
//         .getRepository(User)
//         .save(user);

//     res.send(updatedUser);
// };
