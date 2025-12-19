import { UserService } from "../users/user.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserCreateType } from "./user.schema";

export class UserController {
    constructor(private userService: UserService) {}

    async create(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<UserCreateType> {
        const newUser = await this.userService.create(
            request.body as UserCreateType
        );

        if (!newUser) {
            return reply.status(400).send("Erro ao criar usuário");
        }
        return reply.status(201).send("Usuário criado com sucesso");
    }
}
