import { Request, Response } from 'express';
import { Detail } from '../entities/Detail';
import { getRepository, getManager } from 'typeorm';
import { Slot } from '../entities/Slot';
import { User } from '../entities/User';
import hashids from '../util/hasher';

export const create = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const id = (hashids.decode(maskedId)[0] as unknown) as number;
    const user: User = await getRepository(User).findOne(id);
    if (user.role === 'faculty') {
        const slots = await getRepository(Slot).save(req.body.dates);
        const faculty = await getRepository(User).findOne(id);
        const detail = await getRepository(Detail).save({
            title: req.body.title,
            description: req.body.description,
            slots,
            faculty: faculty,
            users: req.body.users,
        });
        res.send({ detail });
    } else {
        res.send('You cannot create appointments!');
    }
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
    // lists all of the appointments that the faculty has created
    if (user.role === 'faculty') {
        const appointment: Detail[] = await getRepository(Detail).find({
            where: { faculty: userId },
            relations: ['slots', 'slots.student'],
        });

        res.send(appointment);
        // lists all appointments that this student has currently signed up for
    } else if (user.role === 'student') {
        // @FIXME change to typeorm
        const appointments = await getManager().query(
            `SELECT d.id as "DetailId", d.title, d.description, s.id AS "slot id", s.start, s.end FROM Appointment_details d LEFT JOIN Appointment_slots s ON d.id = s.detailId WHERE studentId = ?
             UNION SELECT d.id as "DetailId", d.title, d.description, s.id AS "slot id", s.start, s.end FROM Appointment_details d RIGHT JOIN Appointment_slots s ON s.detailId = d.id WHERE studentId = ?`,
            [userId, userId],
        );
        res.send({ appointments });
    }
    // @FIXME what if they aren't faculty or student
};

export const findSlotsWithDetailId = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const userId = (hashids.decode(maskedId)[0] as unknown) as number;
    const user: User = await getRepository(User).findOne(userId);

    if (user.role === 'faculty') {
        const detail = await getRepository(Detail).findOne({
            where: { id: req.params.id },
            relations: ['slots', 'slots.student'],
        });

        res.send(detail);
    } else if (user.role === 'student') {
        const { slots, ...detail } = await getRepository(Detail).findOne({
            where: { id: req.params.id },
            relations: ['slots', 'slots.student'],
        });
        const output = slots.map(({ student, ...slot }) => {
            // If slot has a student replace its information with "taken":true
            // If it doesn't have a student, add "taken":false
            return student
                ? {
                      ...slot,
                      taken: true,
                  }
                : { ...slot, taken: false };
        });
        res.send({ slots: output, ...detail });
    }
};

export const untaken = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const userId = (hashids.decode(maskedId)[0] as unknown) as number;

    const user: User = await getRepository(User).findOne(userId);

    // const war = await getRepository(User).find({ relations: ['details'] });
    const det = await getManager().query(
        `SELECT d.id, d.title, d.description FROM Appointment_details d WHERE d.id IN 
        (SELECT s.detailId FROM Appointment_slots s LEFT JOIN Appointment_details_users u ON s.detailId = u.appointmentDetailsId WHERE u.userId = ? AND NOT s.studentId)`,
        [userId, userId],
    );

    const dets = await getManager().query(
        `SELECT u.appointmentDetailsId FROM Appointment_details_users u LEFT JOIN Appointment_slots s ON u.userId = s.studentId WHERE u.userId = ?`,
        [userId, userId],
    );
    res.send(dets);
};
