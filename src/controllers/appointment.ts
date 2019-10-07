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
    const user = await getRepository(User).findByIds(req.body.students.map((student: User) => student.id));
    user.forEach((user: User) => {
        user.slots = slots;
        getRepository(User).save(user);
    });
    const faculty = await getRepository(User).findOne(id);
    const detail = await getRepository(Detail).save({
        title: req.body.title,
        description: req.body.description,
        slots,
        faculty: faculty,
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
        let appointments: Detail[] = [];
        appointments = await findByFacultyId(userId);
        res.send(appointments);
    } else if (user.role === 'student') {
        let appointments: User[] = [];
        appointments = await getRepository(User).find({ where: { id: userId }, relations: ['slots'] });
        res.send(appointments);
    }
    //res.send(appointments);
};
