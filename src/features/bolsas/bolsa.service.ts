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
    BolsaGetArchivedByIdResponseType,
    BolsaGetArchivedByIdType,
    BolsaGetGroupedByPrazoType,
} from "./bolsa.schema";

export class BolsaService {
    constructor(
        private repository: BolsaRepository,
        private pecaService: PecaCadastradaService,
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
                data.fornecedoraId,
            );

            if (bolsaExists) {
                throw new Error(
                    "Já existe uma bolsa cadastrada para essa fornecedora.",
                );
            }

            const pecasCadastradas = data.codigosDasPecas;

            for (let i = 0; i < pecasCadastradas.length; i++) {
                const peca = pecasCadastradas[i];
                const pecaExists =
                    await this.pecaService.getByCodigoDaPeca(peca);

                if (pecaExists) {
                    throw new Error(
                        "Uma das peças cadastradas já está cadastrada em outra fornecedora, verifique e refaça o cadastro.",
                    );
                }
            }

            return await this.repository.create(data);
        } catch (error) {
            throw new Error(
                "Não foi possível criar a bolsa. Verifique os dados." + error,
            );
        }
    }

    async update(data: BolsaUpdateType, bolsaId: number): Promise<BolsaType> {
        const bolsaAtual = await this.repository.getByIdAny({ bolsaId });

        if (!bolsaAtual) {
            throw new Error("Bolsa não encontrada.");
        }

        const { codigosDasPecas, ...dadosDaBolsa } = data;

        const fornecedoraIdAlvo =
            dadosDaBolsa.fornecedoraId ?? bolsaAtual.fornecedoraId;
        const isArchivedAlvo =
            dadosDaBolsa.isArchived ?? bolsaAtual.isArchived ?? false;

        if (isArchivedAlvo === false) {
            const outraBolsaAtiva =
                await this.repository.getByFornecedoraId(fornecedoraIdAlvo);

            if (
                outraBolsaAtiva &&
                outraBolsaAtiva.bolsaId !== bolsaAtual.bolsaId
            ) {
                throw new Error(
                    "Já existe uma bolsa ativa para essa fornecedora.",
                );
            }
        }

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
        data: BolsaSyncPecasType,
    ): Promise<void> {
        try {
            await this.getById(params);

            await this.repository.syncPecas(
                params.bolsaId,
                data.codigosDasPecas,
            );
        } catch (error) {
            throw new Error("Erro ao sincronizar as peças da bolsa.");
        }
    }

    async setStatus(
        params: BolsaParamsType,
        data: BolsaSetStatusType,
    ): Promise<void> {
        try {
            await this.getById(params);
            await this.repository.setStatus(params, data);
        } catch (error) {
            throw new Error("Erro ao atualizar o status da bolsa.");
        }
    }

    async archive(params: BolsaParamsType): Promise<void> {
        try {
            await this.getById(params);
            await this.repository.archive(params);
        } catch (error) {
            throw new Error("Erro ao arquivar a bolsa.");
        }
    }

    async unarchive(params: BolsaParamsType): Promise<void> {
        try {
            const bolsaAtual = await this.repository.getByIdAny(params);

            if (!bolsaAtual) {
                throw new Error("Bolsa não encontrada.");
            }

            const bolsaAtiva = await this.repository.getByFornecedoraId(
                bolsaAtual.fornecedoraId,
            );

            if (bolsaAtiva && bolsaAtiva.bolsaId !== bolsaAtual.bolsaId) {
                throw new Error(
                    "Já existe uma bolsa ativa para essa fornecedora.",
                );
            }

            await this.repository.unarchive(params);
        } catch (error) {
            throw new Error("Erro ao desarquivar a bolsa.");
        }
    }

    async getArchivedById(
        fornecedoraId: BolsaGetArchivedByIdType,
    ): Promise<BolsaGetArchivedByIdResponseType> {
        return this.repository.getArchivedById(fornecedoraId);
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
            {},
        );

        const bolsasGroupedObject = Object.entries(bolsasGrouped).map(
            ([date, bolsas]) => ({ date: date, bolsas: bolsas }),
        );

        return bolsasGroupedObject;
    }
}
