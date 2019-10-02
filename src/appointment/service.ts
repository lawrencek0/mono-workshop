import { Request, Response } from 'express';
import { Detail } from './detail/models';
import logger from '../util/logger';
import { getConnection } from 'typeorm';
import { Slot } from './slot/models';

const detailRepo = getConnection().getRepository(Detail);
const slotRepo = getConnection().getRepository(Slot);

export const create = async (req: Request, res: Response) => {
    const slots = slotRepo.create(req.body.dates);
    const detail = detailRepo.create({ title: req.body.title, description: req.body.description, slots });

    res.send({ slots, detail });
};
