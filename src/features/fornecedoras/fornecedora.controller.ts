import { FastifyRequest, FastifyReply } from "fastify";
import { FornecedoraService } from "./fornecedora.service";
import {
    FornecedoraCreateType,
    FornecedoraGetAllResponseType,
    FornecedoraResponseType,
    FornecedoraUpdateType,
    FornecedoraParamsType,
} from "./fornecedora.schema";

export class FornecedoraController {
    constructor(private fornecedoraService: FornecedoraService) {}

    async getAll(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<FornecedoraGetAllResponseType> {
        const fornecedoras = await this.fornecedoraService.getAll();
        return fornecedoras;
    }

    async getById(
        request: FastifyRequest<{ Params: FornecedoraParamsType }>,
        reply: FastifyReply
    ) {
        try {
            const { fornecedoraId } = request.params;
            const fornecedora = await this.fornecedoraService.getById({
                fornecedoraId,
            });
            return fornecedora;
        } catch (error: any) {
            if (error.message === "Fornecedora não encontrada.") {
                return reply.status(404).send({ message: error.message });
            }
            return reply
                .status(500)
                .send({ message: "Erro interno no servidor." });
        }
    }

    async create(
        request: FastifyRequest<{ Body: FornecedoraCreateType }>,
        reply: FastifyReply
    ) {
        try {
            const novaFornecedora = await this.fornecedoraService.create(
                request.body
            );
            return reply.status(201).send(novaFornecedora);
        } catch (error: any) {
            if (
                error.message === "Já existe uma fornecedora com este código."
            ) {
                return reply.status(409).send({ message: error.message });
            }
            return reply.status(500).send({ message: error.message });
        }
    }

    async update(
        request: FastifyRequest<{
            Body: FornecedoraUpdateType;
        }>,
        reply: FastifyReply
    ) {
        try {
            const data = request.body;
            const fornecedoraAtualizada = await this.fornecedoraService.update(
                data
            );
            return fornecedoraAtualizada;
        } catch (error: any) {
            if (error.message === "Fornecedora não encontrada.") {
                return reply.status(404).send({ message: error.message });
            }
            if (
                error.message === "Já existe uma fornecedora com este código."
            ) {
                return reply.status(409).send({ message: error.message });
            }
            return reply.status(500).send({ message: error.message });
        }
    }

    async delete(
        request: FastifyRequest<{ Params: FornecedoraParamsType }>,
        reply: FastifyReply
    ) {
        try {
            const { fornecedoraId } = request.params;
            await this.fornecedoraService.delete({ fornecedoraId });
            return reply.status(204).send();
        } catch (error: any) {
            if (error.message === "Fornecedora não encontrada.") {
                return reply.status(404).send({ message: error.message });
            }
            if (
                error.message.includes(
                    "Não foi possível deletar. A fornecedora pode estar em uso"
                )
            ) {
                return reply.status(409).send({ message: error.message });
            }
            return reply.status(500).send({ message: error.message });
        }
    }
}
