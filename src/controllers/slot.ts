import { Request, Response } from 'express';
import { Detail } from '../entities/Detail';
import { getRepository, getManager } from 'typeorm';
import { Slot } from '../entities/Slot';
import { User } from '../entities/User';
import hashids from '../util/hasher';

export const update = async (req: Request, res: Response) => {
    const maskedId = res.locals.user['custom:user_id'];
    const userId = (hashids.decode(maskedId)[0] as unknown) as number;

    let slot: Slot = new Slot();

    // All the possible parameters that can be updated
    slot.id = parseInt(req.params.id);
    slot.start = req.body.start;
    slot.end = req.body.end;

    // If an association is being updated, set the assocition
    // If null is sent for studentId "deselects" student id

    //gets the list of appointment that the student has taken for that detail
    const studentSlots: Slot[] = await getManager().query(
        `SELECT * FROM Appointment_slots WHERE detailId = ${req.params.detailId} AND studentId = ${userId}`,
    );

    //if the student already has a slot for the detail it will set the old one to null
    if (studentSlots.length > 0) {
        const oldSlot: Slot = studentSlots[0];
        oldSlot.student = null;

        await getRepository(Slot)
            .save(oldSlot)
            .catch(err => err);
    }
    //saves the studentId to the selected Slot
    slot.student = await getRepository(User).findOne(userId);

    if (req.body.detailId) slot.detail = await getRepository(Detail).findOne(parseInt(req.body.detailId));
    if (req.body.students) slot.students = await getRepository(User).findByIds(req.body.students);

    slot = await getRepository(Slot)
        .preload(slot)
        .catch(err => err);

    const updated: Slot = await getRepository(Slot)
        .save(slot)
        .catch(err => err);

    res.send(updated);
};
