import { Request, Response, NextFunction } from 'express';
import { check, sanitize, validationResult, body } from 'express-validator';
import User from '../models/User';

export const validateLogin = [
    check('username', 'Invalid username').isEmail(),
    check('password', 'Invalid password')
        .not()
        .isEmpty()
];

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
    }

    // @TODO: connect with aws congito
    return res
        .status(200)
        .json({ message: 'success', token: 'eferfjdkfdsalkfj' });
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    const user = new User(req.body.email, req.body.password);

    //@TODO: save
    return res.status(200).json({ message: 'success', user });
};
