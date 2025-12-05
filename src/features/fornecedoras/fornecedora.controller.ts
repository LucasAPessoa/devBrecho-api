import { FastifyRequest, FastifyReply } from "fastify";
import { FornecedoraService } from "./fornecedora.service";
import {
    FornecedoraCreateType,
    FornecedoraGetAllResponseType,
    FornecedoraUpdateType,
    FornecedoraParamsType,
    FornecedoraSearchQueryType,
} from "./fornecedora.schema";

export class FornecedoraController {
    constructor(private fornecedoraService: FornecedoraService) {}

    async getAll(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<FornecedoraGetAllResponseType> {
        const { query } = request.query as FornecedoraSearchQueryType;

        const fornecedoras = await this.fornecedoraService.getAll(query || "");
        return fornecedoras;
    }

    async getById(
        request: FastifyRequest<{ Params: FornecedoraParamsType }>,
        reply: FastifyReply
    ) {
        const { fornecedoraId } = request.params;
        const fornecedora = await this.fornecedoraService.getById({
            fornecedoraId,
        });
        return fornecedora;
    }

    async create(
        request: FastifyRequest<{ Body: FornecedoraCreateType }>,
        reply: FastifyReply
    ) {
        const novaFornecedora = await this.fornecedoraService.create(
            request.body
        );
        return reply.status(201).send(novaFornecedora);
    }

    async update(
        request: FastifyRequest<{
            Body: FornecedoraUpdateType;
        }>,
        reply: FastifyReply
    ) {
        const data = request.body;
        const fornecedoraAtualizada = await this.fornecedoraService.update(
            data
        );
        return fornecedoraAtualizada;
    }

    async delete(
        request: FastifyRequest<{ Params: FornecedoraParamsType }>,
        reply: FastifyReply
    ) {
        const { fornecedoraId } = request.params;
        await this.fornecedoraService.delete({ fornecedoraId });
        return reply.status(204).send();
    }
}
