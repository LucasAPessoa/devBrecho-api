import {
    UserCreateType,
    UserGetEmailAndPasswordType,
    UserResponseType,
} from "./user.schema";
import { prisma } from "../../lib/prisma";

export class UserRepository {
    async create(data: UserCreateType): Promise<UserResponseType> {
        const newUser = await prisma.user.create({
            data,
        });
        return newUser;
    }

    async findByEmail(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return !!user;
    }

    async getEmailAndPasswordByEmail(
        email: string
    ): Promise<UserGetEmailAndPasswordType | null> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                email: true,
                passwordHash: true,
            },
        });
        return user;
    }
}
