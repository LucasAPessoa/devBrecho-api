import { FastifyRequest, FastifyReply } from "fastify";
import { BolsaService } from "./bolsa.service";
import {
    BolsaCreateType,
    BolsaGetAllActiveResponseType,
    BolsaResponseType,
    BolsaUpdateType,
    BolsaParamsType,
    BolsaSyncPecasType,
    BolsaSetStatusType,
    BolsaGetAllDoadasAndDevolvidasType,
    BolsaGetAllDoadasAndDevolvidasResponseType,
} from "./bolsa.schema";

export class BolsaController {
    constructor(private bolsaService: BolsaService) {}

    async getAllActive(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<BolsaGetAllActiveResponseType> {
        const bolsas = await this.bolsaService.getAllActive();
        return bolsas;
    }

    async getById(
        request: FastifyRequest<{ Params: BolsaParamsType }>,
        reply: FastifyReply
    ) {
        try {
            const { bolsaId } = request.params;
            const bolsa = await this.bolsaService.getById({ bolsaId });
            return bolsa;
        } catch (error: any) {
            if (error.message === "Bolsa não encontrada.") {
                return reply.status(404).send({ message: error.message });
            }
            return reply
                .status(500)
                .send({ message: "Erro interno no servidor." });
        }
    }

    async create(
        request: FastifyRequest<{ Body: BolsaCreateType }>,
        reply: FastifyReply
    ) {
        try {
            const novaBolsa = await this.bolsaService.create(request.body);
            return reply.status(201).send(novaBolsa);
        } catch (error: any) {
            return reply.status(400).send({ message: error.message });
        }
    }

    async update(
        request: FastifyRequest<{
            Body: BolsaUpdateType;
            Params: BolsaParamsType;
        }>,
        reply: FastifyReply
    ) {
        try {
            const bolsaId = request.params.bolsaId;
            const data = request.body;
            const bolsaAtualizada = await this.bolsaService.update(
                data,
                bolsaId
            );
            return bolsaAtualizada;
        } catch (error: any) {
            if (error.message === "Bolsa não encontrada.") {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: error.message });
        }
    }

    async delete(
        request: FastifyRequest<{ Params: BolsaParamsType }>,
        reply: FastifyReply
    ) {
        try {
            const { bolsaId } = request.params;
            await this.bolsaService.delete({ bolsaId });
            return reply.status(204).send();
        } catch (error: any) {
            if (error.message === "Bolsa não encontrada.") {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: error.message });
        }
    }

    async syncPecas(
        request: FastifyRequest<{
            Params: BolsaParamsType;
            Body: BolsaSyncPecasType;
        }>,
        reply: FastifyReply
    ) {
        try {
            const { bolsaId } = request.params;
            await this.bolsaService.syncPecas({ bolsaId }, request.body);

            return reply.status(204).send();
        } catch (error: any) {
            if (error.message === "Bolsa não encontrada.") {
                return reply.status(404).send({ message: error.message });
            }
            return reply.status(500).send({ message: error.message });
        }
    }

    async setStatus(
        request: FastifyRequest<{
            Params: BolsaParamsType;
            Body: BolsaSetStatusType;
        }>,
        reply: FastifyReply
    ) {
        try {
            const { bolsaId } = request.params;

            await this.bolsaService.setStatus({ bolsaId }, request.body);

            return reply.status(204).send();
        } catch (error: any) {
            if (error.message === "Bolsa não encontrada.") {
                return reply.status(404).send({ message: error.message });
            }
        }
    }

    async getAllDoadasAndDevolvidas(
        request: FastifyRequest<{
            Params: BolsaGetAllDoadasAndDevolvidasType;
            Body: BolsaGetAllDoadasAndDevolvidasResponseType;
        }>,
        reply: FastifyReply
    ) {
        try {
            const { fornecedoraId } = request.params;

            const bolsas = await this.bolsaService.getAllDoadasAndDevolvidas({
                fornecedoraId,
            });
            return bolsas;
        } catch (error: any) {
            return reply.status(500).send({ message: error.message });
        }
    }
}
