// modules/users/bll/user.service.ts
import userRepository from "../dal/user.repository.ts";
import { User } from "../user.model.ts";

class UserService {
    async getAllUsers(): Promise<User[]> {
        return userRepository.findAll();
    }

    async getUserById(userId: number): Promise<User | null> {
        return userRepository.findById(userId);
    }

    async createUser(data: Omit<User, "userId">): Promise<void> {
        await userRepository.create(data);
    }

    async updateUser(userId: number, data: Partial<User>): Promise<void> {
        await userRepository.update(userId, data);
    }

    async deleteUser(userId: number): Promise<void> {
        await userRepository.deleteById(userId);
    }
}

export const userService = new UserService();
export default userService;
