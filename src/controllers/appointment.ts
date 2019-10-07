import { Request, Response } from 'express';
import { Detail } from '../entities/Detail';
import { getRepository } from 'typeorm';
import { Slot } from '../entities/Slot';
import { User } from '../entities/User';
import hashids from '../util/hasher';

export const create = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const id = (hashids.decode(maskedId)[0] as unknown) as number;
    const slots = await getRepository(Slot).save(req.body.dates);
    const faculty = await getRepository(User).findOne(id);
    const detail = await getRepository(Detail).save({
        title: req.body.title,
        description: req.body.description,
        slots,
        faculty: faculty,
        students: req.body.students,
    });
    res.send({ detail });
};

export const findByFacultyId = async (id: number) => {
    const appointments: Detail[] = await getRepository(Detail).find({ where: { faculty: id }, relations: ['slots'] });

    return appointments;
};

//This findAll list all appointments for user who is currently login
export const findAll = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const userId = (hashids.decode(maskedId)[0] as unknown) as number;

    // Check if the user is a faculty
    const user: User = await getRepository(User).findOne(userId);

    if (user.role === 'faculty') {
        const appointments = await getRepository(Detail).find({
            where: { faculty: userId },
        });
        res.send({ appointments });
    } else if (user.role === 'student') {
        const appointments = await getRepository(Detail).find({
            where: { studentId: userId },
        });
        res.send({ appointments });
    }
    //res.send(appointments);
};
