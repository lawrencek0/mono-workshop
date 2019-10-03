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

//This findAll list all appointments for user who is currently login
export const findAll = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const userId = (hashids.decode(maskedId)[0] as unknown) as number;
    const userWithSlots = await getConnection()
        .getRepository(User)
        .findOne(userId, { relations: ['Slot'] });

    res.send(userWithSlots);
};
