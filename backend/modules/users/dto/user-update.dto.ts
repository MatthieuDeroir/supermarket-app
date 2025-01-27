// modules/users/dto/user-update.dto.ts
export interface UserUpdateDto {
    userId: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    // On peut aussi mettre un champ `delete?: boolean` si on veut désactiver
}
