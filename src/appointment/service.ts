import { Request, Response } from 'express';
import { Detail } from './detail/models';
import { getConnection } from 'typeorm';
import { Slot } from './slot/models';

export const create = async (req: Request, res: Response) => {
    const slots = getConnection()
        .getRepository(Slot)
        .create(req.body.dates);
    const detail = getConnection()
        .getRepository(Detail)
        .create({ title: req.body.title, description: req.body.description, slots });

    res.send({ detail });
};
