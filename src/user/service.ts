import { Request, Response } from 'express';
import { User } from './model';
import { getConnection } from 'typeorm';

export const listAllUsers = async (req: Request, res: Response) => {
    const user = await getConnection()
        .getRepository(User)
        .query('SELECT * FROM user');

    res.send(user);
};
