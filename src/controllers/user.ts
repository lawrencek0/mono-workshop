import { Request, Response, NextFunction } from 'express';
import { check, sanitize, validationResult, body } from 'express-validator';
import db from '../database';

export const validateLogin = [
    check('username', 'Invalid username')
        .not()
        .isEmpty(),
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
    const user = await db.query('SELECT * FROM users WHERE `username`= ?', [
        req.body.username
    ]);

    if (user && Array.isArray(user) && user.length == 0) {
        return res
            .status(422)
            .json({ type: 'error', message: 'Invalid username/password' });
    }

    return res
        .status(200)
        .json({ message: 'success', token: 'eferfjdkfdsalkfj', user });
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    const user = await db.query('SELECT * FROM users WHERE `username`= ?', [
        req.body.username
    ]);

    if (user && Array.isArray(user) && user.length > 0) {
        return res
            .status(422)
            .json({ type: 'error', message: 'Username is already taken' });
    }

    // @TODO: hash the password!
    const newUser = await db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [req.body.username, req.body.password]
    );

    return res.status(200).json({ message: 'success', user: newUser });
};
