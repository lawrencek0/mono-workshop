import { Request, Response } from 'express';
import { User } from '../entities/User';
import { getConnection } from 'typeorm';

export const listAllUsers = async (req: Request, res: Response) => {
    const users = await getConnection()
        .getRepository(User)
        .find();

    res.send({ users });
};

export const listAllStudents = async (req: Request, res: Response) => {
    const students = await getConnection()
        .getRepository(User)
        .find({ role: 'student' });
    res.send({ students });
};
