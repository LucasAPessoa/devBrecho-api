import { UserService } from "../users/user.service";
import { UserCreateType } from "../users/user.schema";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/tokenHelper";

import { LoginType } from "./auth.schema";

export class AuthService {
    constructor(private userService: UserService) {}

    async login({
        email,
        password,
    }: LoginType): Promise<{ message: string; token: string }> {
        const user = await this.userService.getEmailAndPasswordByEmail(email);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new Error("Senha inválida");
        }

        const token = generateToken(email);

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
