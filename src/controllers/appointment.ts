import { Request, Response } from 'express';
import { Detail } from '../entities/Detail';
import { getRepository } from 'typeorm';
import { Slot } from '../entities/Slot';
import { User } from '../entities/User';
import hashids from '../util/hasher';
import { AppointmentColor } from '../entities/AppointmentColor';

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
            faculty,
            students: req.body.students,
        });

        detail.students.forEach(async (element: any) => {
            await getRepository(AppointmentColor).save({
                hexColor: req.body.color,
                userId: element,
                appDet: detail,
            });
        });

        res.send({ detail });
    } else {
        res.send('You cannot create appointments!');
    }
};

// This findAll list all appointments for user who is currently login
export const findAll = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const userId = (hashids.decode(maskedId)[0] as unknown) as number;

    // Check if the user is a faculty
    const user: User = await getRepository(User).findOne(userId);
    // lists all of the appointments that the faculty has created
    if (user.role === 'faculty') {
        const appointments = await getRepository(Detail).find({
            where: { faculty: userId },
            relations: ['slots', 'slots.student'],
        });

        // add the detail fields to every slot
        const output = appointments.flatMap(({ slots, ...rest }) => {
            return slots.map(({ id: slotId, ...slot }) => ({
                slotId,
                ...slot,
                ...rest,
            }));
        });

        res.send({ appointments: output });
    } else if (user.role === 'student') {
        // Get all the appointment details and slots selected by the user along with the faculty
        const appointments = await getRepository(Detail)
            .createQueryBuilder('detail')
            .innerJoin('detail.students', 'student', 'student.id = :studentId', { studentId: userId })
            .innerJoinAndSelect('detail.slots', 'slot', 'slot.student = student.id')
            .leftJoinAndSelect('detail.faculty', 'faculty')
            .getMany();
        // flattens the slot
        const output = appointments.map(({ slots, ...rest }) => {
            // there will be only one slot associated with a detail for a student
            const { id: slotId, ...slot } = slots[0];
            return { ...rest, slotId, ...slot };
        });
        res.send({ appointments: output });
    }
    // @FIXME: what if they aren't faculty or student
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
            return student ? { ...slot, taken: true } : { ...slot, taken: false };
        });
        res.send({ slots: output, ...detail });
    }
};

// @TODO needs to list the appointments that the student needs to sign up for
export const untaken = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const userId = (hashids.decode(maskedId)[0] as unknown) as number;
    const user = await getRepository(User).findOne(userId);

    if (user.role === 'student') {
        // Subquery that gets all the details' ids that the student has signed up for
        const selectedAppointments = getRepository(Detail)
            .createQueryBuilder('detail')
            .innerJoin('detail.students', 'student', 'student.id = :studentId', { studentId: userId })
            .innerJoin('detail.slots', 'slot', 'slot.student = student.id')
            .select('detail.id');

        // Use the subquery to get all the appointments assigned to the student but haven't been taken
        const unselectedAppointments = await getRepository(Detail)
            .createQueryBuilder('detail')
            .innerJoin('detail.students', 'student', 'student.id = :studentId')
            .where('detail.id NOT IN (' + selectedAppointments.getQuery() + ')')
            .setParameters(selectedAppointments.getParameters())
            .leftJoinAndSelect('detail.faculty', 'faculty')
            .getMany();

        return res.send({ appointments: unselectedAppointments });
    }

    res.send({ msg: "You can't any appointments" });
};

// TODO: Fix this method!
export const detColor = async (req: Request, res: Response) => {
    //     const maskedId = res.locals.user['custom:user_id'];
    //     const id = (hashids.decode(maskedId)[0] as unknown) as number;
    //     const color = await getRepository(AppointmentColor).save({
    //         userId: id,
    //         detailId: Number.parseInt(req.params.id, 10),
    //         hexColor: req.body.color,
    //     });
    //     res.send(color);
};
