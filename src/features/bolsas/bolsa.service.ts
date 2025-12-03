import { BolsaRepository } from "./bolsa.repository";
import {
    BolsaCreateType,
    BolsaType,
    BolsaParamsType,
    BolsaUpdateType,
    BolsaResponseType,
    BolsaGetAllActiveResponseType,
    BolsaSyncPecasType,
    BolsaSetStatusType,
    BolsaGetAllDoadasAndDevolvidasResponseType,
    BolsaGetAllDoadasAndDevolvidasType,
} from "./bolsa.schema";

export class BolsaService {
    constructor(private repository: BolsaRepository) {}

    async getAll(query: string): Promise<BolsaGetAllActiveResponseType> {
        return this.repository.getAll(query);
    }

    async getById(data: BolsaParamsType): Promise<BolsaResponseType> {
        const bolsa = await this.repository.getById(data);

        if (!bolsa) {
            throw new Error("Bolsa não encontrada.");
        }

        return bolsa;
    }

    async create(data: BolsaCreateType): Promise<BolsaType> {
        try {
            const bolsaExists = await this.repository.getByFornecedoraId(
                data.fornecedoraId
            );

            if (!bolsaExists) {
                return await this.repository.create(data);
            }

            throw new Error(
                "Já existe uma bolsa cadastrada para essa fornecedora."
            );
        } catch (error) {
            throw new Error(
                "Não foi possível criar a bolsa. Verifique os dados."
            );
        }
    }

    async update(data: BolsaUpdateType, bolsaId: number): Promise<BolsaType> {
        await this.getById({ bolsaId: bolsaId });

        const { codigosDasPecas, ...dadosDaBolsa } = data;

        try {
            await this.repository.update(dadosDaBolsa, bolsaId);

            const codigosLimpos = codigosDasPecas || [];

            await this.repository.syncPecas(bolsaId, codigosLimpos);

            return this.getById({ bolsaId: bolsaId });
        } catch (error) {
            console.error("Erro ao atualizar bolsa:", error);
            throw new Error("Erro ao atualizar bolsa.");
        }
    }

    async syncPecas(
        params: BolsaParamsType,
        data: BolsaSyncPecasType
    ): Promise<void> {
        try {
            await this.getById(params);

            await this.repository.syncPecas(
                params.bolsaId,
                data.codigosDasPecas
            );
        } catch (error) {
            throw new Error("Erro ao sincronizar as peças da bolsa.");
        }
    }

    async setStatus(
        params: BolsaParamsType,
        data: BolsaSetStatusType
    ): Promise<void> {
        try {
            await this.getById(params);
            await this.repository.setStatus(params, data);
        } catch (error) {
            throw new Error("Erro ao atualizar o status da bolsa.");
        }
    }

    async getAllDoadasAndDevolvidas(
        fornecedoraId: BolsaGetAllDoadasAndDevolvidasType
    ): Promise<BolsaGetAllDoadasAndDevolvidasResponseType> {
        return this.repository.getAllDoadasAndDevolvidas(fornecedoraId);
    }
}
