// import { Request, Response } from 'express';
// import { User } from '../entities/User';
// import { getConnection } from 'typeorm';

// export const listAllUsers = async (req: Request, res: Response) => {
//     const user = await getConnection()
//         .getRepository(User)
//         .find();

//     res.send(user);
// };

// export const listAllStudents = async (req: Request, res: Response) => {
//     const students = await getConnection()
//         .getRepository(User)
//         .find({ role: 'student' });
//     res.send({ students });
// };
