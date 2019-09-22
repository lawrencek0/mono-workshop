import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

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

/*
      This part doesn't work yet. You can just comment it out for now
 
export const createAppointment = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
    }
    const appointName = req.body.appointName;
    const availAppointStart = req.body.appointStart;
    const availAppointEnd = req.body.appointEnd;
    const appointLength = req.body.appointmentLength;

    const appointData = {
        AppointName: appointName,
    };
};
 */
