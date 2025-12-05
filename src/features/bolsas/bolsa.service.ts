import { PecaCadastradaService } from "../pecasCadastradas/pecaCadastrada.service";
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
    BolsaGetGroupedByPrazoType,
} from "./bolsa.schema";

export class BolsaService {
    constructor(
        private repository: BolsaRepository,
        private pecaService: PecaCadastradaService
    ) {}

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

            if (bolsaExists) {
                throw new Error(
                    "Já existe uma bolsa cadastrada para essa fornecedora."
                );
            }

            const pecasCadastradas = data.codigosDasPecas;

            for (let i = 0; i < pecasCadastradas.length; i++) {
                const peca = pecasCadastradas[i];
                const pecaExists = await this.pecaService.getByCodigoDaPeca(
                    peca
                );

                if (pecaExists) {
                    throw new Error(
                        "Uma das peças cadastradas já está cadastrada em outra fornecedora, verifique e refaça o cadastro."
                    );
                }
            }

            return await this.repository.create(data);
        } catch (error) {
            throw new Error(
                "Não foi possível criar a bolsa. Verifique os dados." + error
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

    async getBolsasGroupedByPrazo(): Promise<BolsaGetGroupedByPrazoType> {
        const bolsas = await this.repository.getBolsasGroupedByPrazo();

        const bolsasGrouped = bolsas.reduce(
            (accumulator: Record<string, BolsaResponseType[]>, bolsaAtual) => {
                const dataKey = bolsaAtual
                    .dataMensagem!.toISOString()
                    .split("T")[0];

                if (!accumulator[dataKey]) {
                    accumulator[dataKey] = [];
                }

                accumulator[dataKey].push(bolsaAtual);

                return accumulator;
            },
            {}
        );

        const bolsasGroupedObject = Object.entries(bolsasGrouped).map(
            ([date, bolsas]) => ({ date: date, bolsas: bolsas })
        );

        return bolsasGroupedObject;
    }
}
