import { Request, Response } from 'express';
import { Detail } from './detail/models';
import logger from '../util/logger';
import { getConnection } from 'typeorm';

export const create = async (req: Request, res: Response) => {
    const detail = new Detail();
    detail.description = req.body.description;
    logger.debug(detail.description);
    getConnection()
        .getRepository(Detail)
        .save(detail);
    res.send('done');
};
