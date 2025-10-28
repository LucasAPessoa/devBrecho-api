import { PecaCadastrada } from "@prisma/client";
import { PecaCadastradaService } from "./pecaCadastrada.service";
import { FastifyReply, FastifyRequest } from "fastify";
import {
    PecaCadastradaCreateType,
    PecaCadastradaDeleteType,
    PecaCadastradaGetByBolsaIdType,
} from "./pecaCadastrada.schema";

export class PecaCadastradaController {
    constructor(private pecaCadastradaService: PecaCadastradaService) {}

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const pecas = await this.pecaCadastradaService.getAll();
        return pecas;
    }

    async getByBolsaId(request: FastifyRequest, reply: FastifyReply) {
        const { bolsaId } = request.params as PecaCadastradaGetByBolsaIdType;

        const pecas = await this.pecaCadastradaService.getByBolsaId(bolsaId);

        return pecas;
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const data = request.body as PecaCadastradaCreateType;

        const peca = await this.pecaCadastradaService.create(data);

        return reply.status(201).send(peca);
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { pecaCadastradaId } = request.params as PecaCadastradaDeleteType;

        const sucesso = await this.pecaCadastradaService.delete(
            pecaCadastradaId
        );

        if (!sucesso) {
            return reply
                .status(500)
                .send({ message: "Erro ao deletar peça cadastrada" });
        }

        return reply.status(204).send();
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const data = request.body as PecaCadastrada;
        const pecaAtualizada = await this.pecaCadastradaService.update(data);

        return pecaAtualizada;
    }
}
