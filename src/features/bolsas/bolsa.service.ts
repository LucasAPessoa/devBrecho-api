import { BolsaRepository } from "./bolsa.repository";
import {
    BolsaCreateType,
    BolsaType,
    BolsaParamsType,
    BolsaUpdateType,
    BolsaResponseType,
    BolsaGetAllResponseType,
    BolsaSyncPecasType,
} from "./bolsa.schema";

export class BolsaService {
    constructor(private repository: BolsaRepository) {}

    async getAll(): Promise<BolsaGetAllResponseType> {
        return this.repository.getAll();
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
            return await this.repository.create(data);
        } catch (error) {
            throw new Error(
                "Não foi possível criar a bolsa. Verifique os dados."
            );
        }
    }

    async update(data: BolsaUpdateType): Promise<BolsaType> {
        await this.getById({ bolsaId: data.bolsaId });

        try {
            return await this.repository.update(data);
        } catch (error) {
            throw new Error("Erro ao atualizar bolsa.");
        }
    }

    async delete(data: BolsaParamsType): Promise<void> {
        await this.getById(data);

        const success = await this.repository.delete(data);

        if (!success) {
            throw new Error("Não foi possível deletar a bolsa.");
        }
    }

    async syncPecas(
        params: BolsaParamsType,
        data: BolsaSyncPecasType
    ): Promise<void> {
        await this.getById(params);

        try {
            await this.repository.syncPecas(params.bolsaId, data);
        } catch (error) {
            throw new Error("Erro ao sincronizar as peças da bolsa.");
        }
    }
}
