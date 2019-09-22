import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import db from '../database';
import { appointmentModel } from './model';

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
    const result = await db.query(
        `INSERT INTO Appointment (name, appoint_date_start, appoint_date_end) VALUES(${appointment.name}, ${appointment.startDateTime}, ${appointment.endDateTime})`,
    );
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

export const findAll = async (req: Request, res: Response) => {
    const result = await db.query(`SELECT * FROM Appointment`);
    // Sends the found Appointment to the client
    // Returns an empty array if nothing was found
    res.send(result);
};
