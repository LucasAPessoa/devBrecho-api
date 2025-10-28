import { prisma } from "../../lib/prisma";
import {
    FornecedoraCreateType,
    FornecedoraType,
    FornecedoraParamsType, // Usado para getById e delete
    FornecedoraUpdateType,
    FornecedoraResponseType,
    FornecedoraGetAllResponseType,
} from "./fornecedora.schema"; // Certifique-se que o caminho está correto

export class FornecedoraRepository {
    async getAll(): Promise<FornecedoraGetAllResponseType> {
        return prisma.fornecedora.findMany();
    }

    async getById(
        data: FornecedoraParamsType
    ): Promise<FornecedoraResponseType | null> {
        return prisma.fornecedora.findUnique({
            where: { fornecedoraId: data.fornecedoraId },
        });
    }

    async create(data: FornecedoraCreateType): Promise<FornecedoraType> {
        return prisma.fornecedora.create({
            data,
        });
    }

    async update(data: FornecedoraUpdateType): Promise<FornecedoraType> {
        return prisma.fornecedora.update({
            where: { fornecedoraId: data.fornecedoraId },
            data: {
                codigo: data.codigo,
                nome: data.nome,
                telefone: data.telefone,
            },
        });
    }

    async delete(data: FornecedoraParamsType): Promise<boolean> {
        try {
            await prisma.fornecedora.delete({
                where: { fornecedoraId: data.fornecedoraId },
            });
            return true;
        } catch {
            return false;
        }
    }
}
