export type Role = 'student' | 'faculty' | 'admin';

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
    picUrl?: string;
    bio: string;
};
