import { Request, Response } from 'express';
import { Detail } from './detail/models';
import { getConnection } from 'typeorm';
import { Slot } from './slot/models';

export const create = async (req: Request, res: Response) => {
    const slots = await getConnection()
        .getRepository(Slot)
        .save(req.body.dates);
    const detail = await getConnection()
        .getRepository(Detail)
        .save({ title: req.body.title, description: req.body.description, slots });

    res.send({ detail });
};

export const findAll = async (req: Request, res: Response) => {
    const array = await getConnection().query('SELECT * FROM appointment_slots ORDER BY start');

    res.send({ array });
};
