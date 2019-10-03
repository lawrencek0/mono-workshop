import { apiClient } from 'utils/api-client';

export type Student = {
    id: string;
    firstName: string;
    lastName: string;
};

const getAllStudents = async (): Promise<Student[]> => {
    try {
        const { students }: { students: Student[] } = await apiClient('users/students');
        return students;
    } catch (e) {
        throw new Error(e);
    }
};

export { getAllStudents };
