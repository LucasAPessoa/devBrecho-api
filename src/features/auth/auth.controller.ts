import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";
import { UserCreateType } from "../users/user.schema";
import { LoginType } from "./auth.schema";

export class AuthController {
    constructor(private authService: AuthService) {}

    async login(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<{ message: string; token: string }> {
        const login = request.body as LoginType;

        const { token, message } = await this.authService.login(login);
        return reply.status(200).send({ message, token });
    }

    async register(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<{ message: string; token: Promise<string> }> {
        const response = await this.authService.register(
            request.body as UserCreateType
        );

        return reply.status(201).send(response);
    }
}
