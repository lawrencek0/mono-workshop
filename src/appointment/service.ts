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

export const findAll = async (req: Request, res: Response) => {
    const slots = await getConnection()
        .getRepository(Slot)
        .find({ order: { start: 'ASC' } });

    res.send(slots);
};

export const findByFacultyId = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const id = (hashids.decode(maskedId) as unknown) as number;
    const appointments = await getConnection()
        .getRepository(Detail)
        .find({ where: { user: id } });

    res.send({ appointments });
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
