import { Request, Response } from 'express';
import { Detail } from '../entities/Detail';
import { getRepository } from 'typeorm';
import { Slot } from '../entities/Slot';
import { User } from '../entities/User';
import hashids from '../util/hasher';

export const update = async (req: Request, res: Response) => {
    // const maskedId = res.locals.user['custom:user_id'];
    // const userId = (hashids.decode(maskedId)[0] as unknown) as number;

    let slot: Slot = new Slot();

    // All the possible parameters that can be updated
    slot.id = parseInt(req.params.id);
    slot.start = req.body.start;
    slot.end = req.body.end;

    // If an association is being updated, set the assocition
    // If null is sent for studentId "deselects" student id
    if (req.body.studentId === null) slot.student = null;
    if (req.body.studentId) {
        const userId = (hashids.decode(req.body.studentId)[0] as unknown) as number;
        slot.student = await getRepository(User).findOne(userId);
    }
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
