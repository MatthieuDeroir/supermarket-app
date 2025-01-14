// modules/users/dto/user-response.dto.ts
export interface UserResponseDto {
    userId: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    // On ne renvoie pas password
}
