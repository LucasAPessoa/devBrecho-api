import { FastifyRequest, FastifyReply } from "fastify";
import { BolsaService } from "./bolsa.service";
import {
    BolsaCreateType,
    BolsaSearchQueryType,
    BolsaUpdateType,
    BolsaParamsType,
    BolsaSyncPecasType,
    BolsaSetStatusType,
    BolsaGetAllActiveResponseType,
} from "./bolsa.schema";

export class BolsaController {
    constructor(private bolsaService: BolsaService) {}

    async getAll(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<BolsaGetAllActiveResponseType> {
        const { query } = request.query as BolsaSearchQueryType;

        const bolsas = await this.bolsaService.getAll(query || "");

        return bolsas;
    }

    async getById(
        request: FastifyRequest<{ Params: BolsaParamsType }>,
        reply: FastifyReply
    ) {
        const { bolsaId } = request.params;
        const bolsa = await this.bolsaService.getById({ bolsaId });
        return bolsa;
    }

    async create(
        request: FastifyRequest<{ Body: BolsaCreateType }>,
        reply: FastifyReply
    ) {
        const novaBolsa = await this.bolsaService.create(request.body);
        return reply.status(201).send(novaBolsa);
    }

    async update(
        request: FastifyRequest<{
            Body: BolsaUpdateType;
            Params: BolsaParamsType;
        }>,
        reply: FastifyReply
    ) {
        const bolsaId = request.params.bolsaId;
        const data = request.body;
        const bolsaAtualizada = await this.bolsaService.update(data, bolsaId);
        return bolsaAtualizada;
    }

    async syncPecas(
        request: FastifyRequest<{
            Params: BolsaParamsType;
            Body: BolsaSyncPecasType;
        }>,
        reply: FastifyReply
    ) {
        const { bolsaId } = request.params;
        await this.bolsaService.syncPecas({ bolsaId }, request.body);

        return reply.status(204).send();
    }

    async setStatus(
        request: FastifyRequest<{
            Params: BolsaParamsType;
            Body: BolsaSetStatusType;
        }>,
        reply: FastifyReply
    ) {
        const { bolsaId } = request.params;

        await this.bolsaService.setStatus({ bolsaId }, request.body);

        return reply.status(204).send();
    }

    async getAllDoadasAndDevolvidas(
        request: FastifyRequest<{
            Params: BolsaGetAllDoadasAndDevolvidasType;
        }>,
        reply: FastifyReply
    ) {
        const { fornecedoraId } = request.params;

        const bolsas = await this.bolsaService.getAllDoadasAndDevolvidas({
            fornecedoraId,
        });
        return bolsas;
    }
}
