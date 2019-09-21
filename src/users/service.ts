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

export const parseResult = (user: databaseUser): UserModel => ({
    id: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    ...user
});

export const getUser = (id: number) => {
    return db.query('SELECT * FROM User WHERE `user_id` = ?', [id]);
};

export const getUserByEmail = async (email: string): Promise<UserModel> => {
    const rows = ((await db.query('SELECT * FROM User WHERE `email`= ?', [
        email
    ])) as unknown) as databaseUser[];
    return parseResult(rows[0]);
};

export const getUserByUsername = (username: string) => {
    return db.query('SELECT * FROM User WHERE `username`= ?', [username]);
};

export const save = (user: Omit<UserModel, 'id'>) => {
    return db.query(
        'INSERT INTO User (username, first_name, last_name, email, role) VALUES(?, ?, ?, ?, ?)',
        [user.username, user.firstName, user.lastName, user.email, user.role]
    );
};
