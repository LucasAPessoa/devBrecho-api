import { FornecedoraRepository } from "./fornecedora.repository";
import {
    FornecedoraCreateType,
    FornecedoraType,
    FornecedoraParamsType,
    FornecedoraUpdateType,
    FornecedoraResponseType,
    FornecedoraGetAllResponseType,
} from "./fornecedora.schema";

export class FornecedoraService {
    constructor(private repository: FornecedoraRepository) {}

    async getAll(): Promise<FornecedoraGetAllResponseType> {
        return this.repository.getAll();
    }

    async getById(
        data: FornecedoraParamsType
    ): Promise<FornecedoraResponseType> {
        const fornecedora = await this.repository.getById(data);

        if (!fornecedora) {
            throw new Error("Fornecedora não encontrada.");
        }

        return fornecedora;
    }

    async create(data: FornecedoraCreateType): Promise<FornecedoraType> {
        try {
            return await this.repository.create(data);
        } catch (error) {
            throw new Error("Erro ao criar fornecedora.");
        }
    }

    async update(data: FornecedoraUpdateType): Promise<FornecedoraType> {
        await this.getById({ fornecedoraId: data.fornecedoraId });

        try {
            return await this.repository.update(data);
        } catch (error) {
            throw new Error("Erro ao atualizar fornecedora.");
        }
    }
    async delete(data: FornecedoraParamsType): Promise<void> {
        await this.getById(data);

        const success = await this.repository.delete(data);

        if (!success) {
            throw new Error(
                "Não foi possível deletar. A fornecedora pode estar em uso por uma bolsa."
            );
        }
    }
}
