import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/User';

export const validateLogin = [
    check('username', 'Invalid username')
        .not()
        .isEmpty(),
    check('password', 'Invalid password')
        .not()
        .isEmpty()
];

export const validateSignup = [
    ...validateLogin,
    check('first_name', 'First Name can\'t be empty').exists(),
    check('last_name', 'Last Name can\'t be empty').exists(),
    // @TODO: allow only warhawk.ulm.edu and ulm.edu emails!
    check('email')
        .exists()
        .withMessage('Email can\'t be empty')
        .bail()
        .isEmail()
        .withMessage('Invald Email')
        .bail()
        .normalizeEmail(),
    check('role')
        .exists()
        .withMessage('Role can\'t be empty')
        .bail()
        .isIn(['student', 'faculty', 'admin'])
        .withMessage('Invalid Role'),
    check('cwid', 'Invalid cwid')
        .exists()
        .withMessage('CWID can\'t be empty')
        .bail()
        .isInt()
        .withMessage('Invalid CWID')
        .bail()
        .isLength({ min: 8, max: 8 })
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
    const user = await User.getUserWithUsername(req.body.username);

    // @TODO: move this check to the validators
    if (user && Array.isArray(user) && user.length == 0) {
        return res
            .status(422)
            .json({ type: 'error', message: 'Invalid username/password' });
    }

    // @TODO: use bcrypt/argon2 to compare password hashes

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

    const user = await User.getUserWithUsername(req.body.username);

    if (user && Array.isArray(user) && user.length > 0) {
        return res
            .status(422)
            .json({ type: 'error', message: 'Username is already taken' });
    }

    // @TODO: hash the password!
    try {
        const newUser = await User.save({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            email: req.body.email,
            role: req.body.role,
            cwid: Number.parseInt(req.body.cwid, 10)
        });
        return res.status(200).json({ message: 'success', user: newUser });
    } catch (e) {
        return res
            .status(422)
            .json({ type: 'error', message: e.sqlMessage });
    }
};
