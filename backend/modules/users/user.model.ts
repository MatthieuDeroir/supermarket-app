// modules/users/user.model.ts
export interface User {
    userId: number;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    roleId?: number;
}
