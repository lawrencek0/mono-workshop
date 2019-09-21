import db from '../database';
import { UserModel, Role } from './model';

type databaseUser = {
    user_id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    role: Role;
};

export const parseResult = (user: databaseUser): UserModel => {
    const {
        user_id: id,
        first_name: firstName,
        last_name: lastName,
        ...rest
    } = user;

    return { id, firstName, lastName, ...rest };
};

export const findUser = (id: number) => {
    return db.query('SELECT * FROM User WHERE `user_id` = ?', [id]);
};

export const findUserWithEmail = async (email: string): Promise<UserModel> => {
    const rows = await db.query('SELECT * FROM User WHERE `email`= ?', [email]);

    if (Array.isArray(rows) && rows.length > 0) {
        return parseResult(rows[0] as databaseUser);
    }

    throw Error(`User not found ${email}`);
};

export const findUserWithUsername = (username: string) => {
    return db.query('SELECT * FROM User WHERE `username`= ?', [username]);
};

export const saveUser = (user: Omit<UserModel, 'id'>) => {
    return db.query(
        'INSERT INTO User (username, first_name, last_name, email, role) VALUES(?, ?, ?, ?, ?)',
        [user.username, user.firstName, user.lastName, user.email, user.role]
    );
};
