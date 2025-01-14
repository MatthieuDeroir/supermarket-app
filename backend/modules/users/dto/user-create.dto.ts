// modules/users/dto/user-create.dto.ts
export interface UserCreateDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}
