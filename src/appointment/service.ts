import { Request, Response } from 'express';
import { Detail } from './detail/models';
import { getConnection } from 'typeorm';
import { Slot } from './slot/models';
import { User } from '../user/model';

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

export const findAll = async (req: Request, res: Response) => {
    const slots = await getConnection()
        .getRepository(Slot)
        .find({ order: { start: 'ASC' } });

    res.send(slots);
};
// export const findAll = async (req: Request, res: Response) => {
//     const userWithSlots = await getConnection()
//         .getRepository(User)
//         .findOne(req.body.id, { relations: ['Slot'] });

//     res.send(userWithSlots);
// };

// //doesn't work yet
// export const selectOne = async (req: Request, res: Response) => {
//     const slots = await getConnection()
//         .getRepository(Slot)
//         .find({ order: { start: 'ASC' } });

//     res.send(slots);
// };
