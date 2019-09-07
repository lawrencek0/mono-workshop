import db from '../database';

interface UserProps {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'student' | 'faculty' | 'admin';
    cwid: number;
}

class User {
    public static getUser(id: number) {
        return db.query('SELECT * FROM users WHERE `id` = ?', [id]);
    }

    public static getUserWithUsername(username: string) {
        return db.query('SELECT * FROM users WHERE `username`= ?', [username]);
    }

    public static save(user: UserProps) {
        // @TODO: hash the password before saving!!
        return db.query(
            'INSERT INTO users (username, password, first_name, last_name, email, role, cwid) VALUES(?, ?, ?, ?, ?, ?, ?)',
            [
                user.username,
                user.password,
                user.firstName,
                user.lastName,
                user.email,
                user.role,
                user.cwid
            ]
        );
    }
}

export default User;
