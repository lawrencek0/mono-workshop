import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import db from '../database';
import { appointmentModel } from './model';
import hashids from '../util/hasher';

export const validateAppointment = [
    check('appointName', 'Invalid appointment name')
        .not()
        .isEmpty(),
    check('startTime', 'Invalid starting time')
        .not()
        .isEmpty()
        .bail(),
    check('endTime', 'Invalid ending time')
        .not()
        .isEmpty(),
];

//   This part doesn't work yet. You can just comment it out for now

export const create = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
    }
    const appointment: Omit<appointmentModel, 'appointId'> = {
        name: req.body.name,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime,
    };
    const result = await db
        .query(
            `INSERT INTO Appointment (name, appoint_date_start, appoint_date_end) VALUES('${appointment.name}', '${appointment.startDateTime}', '${appointment.endDateTime}')`,
        )
        .catch(e => e);
    // Sends a response to the client
    // TODO: FIX THIS -> currently not sending the created appointment
    res.send(result);
};

//
export const findOne = async (req: Request, res: Response) => {
    const result = await db.query(
        `SELECT * FROM Appointment \
        WHERE appoint_id = ${req.params.id}`,
    );
    // Sends the found Appointment to the client
    // Returns an empty array if nothing was found
    // TODO: Add error response if nothing found
    res.send(result);
};

// export const findAllByUser = async (req: Request, res: Response) => {
//     console.log(res.locals.user);
//     const maskedId = res.locals.user['custom:user_id'];
//     const userId = hashids.decode(maskedId);

//     // this gives appointment_ids
//     const appointmentIds = await db.query('SELECT * FROM Appointment_User WHERE `user_id`= ?', [userId]);
//     const appointments = await db.query('SELECT * FROM Appointment WHERE `appoint_id` in ' + `${appointmentIds}`);

//     res.send(appointments);
// };
export const findAll = async (req: Request, res: Response) => {
    const result = await db.query(`SELECT * FROM User WHERE role = 'student'`);

    res.send(result);
};
export const deleteAppointment = async (req: Request, res: Response) => {
    const result = await db.query(`DELETE FROM appointment WHERE appoint_id = ${req.params.id}`).catch(e => e);
    res.send(result);
};
