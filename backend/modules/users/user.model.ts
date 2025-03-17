// modules/users/user.model.ts
export interface User {
    [key: string]: unknown; // <= index signature
    user_id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | null;
    role_id: number;
}
