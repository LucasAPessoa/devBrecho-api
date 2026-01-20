import { UserRepository } from "./user.repository";
import {
    UserCreateType,
    UserGetEmailAndPasswordType,
    UserResponseType,
} from "./user.schema";

export class UserService {
    constructor(private userRepository: UserRepository) {}
    async create({ ...userData }: UserCreateType): Promise<UserResponseType> {
        const newUser = await this.userRepository.create(userData);

        return newUser;
    }

    async findByEmail(email: string): Promise<boolean> {
        const userExists = await this.userRepository.findByEmail(email);
        return userExists;
    }

    async getEmailAndPasswordByEmail(
        email: string
    ): Promise<UserGetEmailAndPasswordType | null> {
        const user = await this.userRepository.getEmailAndPasswordByEmail(
            email
        );
        return user;
    }
}
