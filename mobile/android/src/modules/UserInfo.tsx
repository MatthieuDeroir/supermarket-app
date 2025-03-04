interface UserInfo {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

let user: UserInfo | null = null;

export const setUserInfo = (firstName: string, lastName: string, phoneNumber: string) => {
    user = {
        firstName,
        lastName,
        phoneNumber
    };
};

export const getUserInfo = (): UserInfo | null => {
    return user;
};