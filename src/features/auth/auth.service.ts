import { UserService } from "../users/user.service";
import { UserCreateType } from "../users/user.schema";
import bcrypt from "bcrypt";
import { decodeToken, generateToken } from "../../utils/tokenHelper";

import { LoginType, ProfileType } from "./auth.schema";

export class AuthService {
    constructor(private userService: UserService) {}

    async login({
        email,
        password,
    }: LoginType): Promise<{ message: string; token: string }> {
        const user = await this.userService.getIdEmailAndPasswordByEmail(email);

        if (!user) {
            throw new Error("Email ou senha incorretos");
        }

        const { userId } = user;

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new Error("Senha inválida");
        }

        const token = generateToken(userId);

        return { message: "Login realizado com sucesso", token };
    }

    async register(data: UserCreateType) {
        const { email } = data;
        const userExists = await this.userService.findByEmail(email);

        if (userExists) {
            throw new Error("Email já cadastrado");
        }

        const { passwordHash } = data;

        data.passwordHash = await bcrypt.hash(passwordHash, 10);

        const newUser = await this.userService.create(data);

        if (!newUser) {
            throw new Error("Erro ao criar usuário");
        }

        const token = generateToken(email);

        return { message: "Usuário registrado com sucesso", token };
    }
}
