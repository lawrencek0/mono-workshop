import { apiClient } from 'utils/api-client';
import { User } from 'user/types';

export type Student = User;

const getAllStudents = async (): Promise<Student[]> => {
    try {
        const { students }: { students: Student[] } = await apiClient(`users?role=student`);
        return students;
    } catch (e) {
        throw new Error(e);
    }
};

export { getAllStudents };
