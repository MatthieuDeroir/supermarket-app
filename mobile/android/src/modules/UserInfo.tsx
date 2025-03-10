interface UserInfo {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

let user: UserInfo | null = null;

export const setUserInfo = (userId: number, firstName: string, lastName: string, phoneNumber: string, email: string) => {
    user = {
        userId,
        email,
        firstName,
        lastName,
        phoneNumber,
    };
};

export const getUserInfo = (): UserInfo | null => {
    return user;
};