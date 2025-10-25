import { FastifyRequest, FastifyReply } from "fastify";
import { SetorService } from "./setor.service";
import {
    SetorCreateType,
    SetorGetAllResponseType,
    SetorResponseType,
    SetorUpdateType,
} from "./setor.schema";
import { SetorParamsType } from "./setor.schema";

export class SetorController {
    constructor(private setorService: SetorService) {}

    async getAll(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<SetorGetAllResponseType> {
        const setores = await this.setorService.getAll();

        return setores;
    }

    async getById(
        request: FastifyRequest<{ Params: SetorParamsType }>,
        reply: FastifyReply
    ): Promise<SetorResponseType | null> {
        const { setorId } = request.params;

        const setor = await this.setorService.getById(setorId);

        if (!setor) {
            return reply.status(404).send({ message: "Setor não encontrado" });
        }

        return setor;
    }

    async create(
        request: FastifyRequest<{ Body: SetorCreateType }>,
        reply: FastifyReply
    ) {
        const novoSetor = await this.setorService.create(request.body);

        return reply.status(201).send(novoSetor);
    }

    async update(
        request: FastifyRequest<{
            Body: SetorUpdateType;
        }>,
        reply: FastifyReply
    ) {
        const data = request.body;

        const setorAtualizado = await this.setorService.update(data);

        return setorAtualizado;
    }

    async delete(
        request: FastifyRequest<{ Params: SetorParamsType }>,
        reply: FastifyReply
    ) {
        const { setorId } = request.params;

        const sucesso = await this.setorService.delete(setorId);

        if (!sucesso) {
            return reply.status(500).send({ message: "Erro ao deletar setor" });
        }

        return reply.status(204).send();
    }
}
