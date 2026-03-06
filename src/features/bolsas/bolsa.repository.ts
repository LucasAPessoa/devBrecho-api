import { prisma } from "../../lib/prisma";
import {
    BolsaGetArchivedByIdResponseType,
    BolsaGetArchivedByIdType,
    BolsaGetGroupedByPrazoType,
    BolsaSetStatusType,
} from "./bolsa.schema";
import {
    BolsaCreateType,
    BolsaType,
    BolsaParamsType,
    BolsaUpdateType,
    BolsaResponseType,
} from "./bolsa.schema";

export class BolsaRepository {
    async getByFornecedoraId(fornecedoraId: number): Promise<BolsaType | null> {
        return prisma.bolsa.findFirst({
            where: {
                fornecedoraId: fornecedoraId,
                isArchived: { not: true },
            },
            include: { pecasCadastradas: true, fornecedora: true, setor: true },
        });
    }

    async getById(data: BolsaParamsType): Promise<BolsaResponseType | null> {
        return prisma.bolsa.findFirst({
            where: { bolsaId: data.bolsaId, isArchived: { not: true } },
            include: { pecasCadastradas: true, fornecedora: true, setor: true },
        });
    }

    async getByIdAny(data: BolsaParamsType): Promise<BolsaResponseType | null> {
        return prisma.bolsa.findUnique({
            where: { bolsaId: data.bolsaId },
            include: { pecasCadastradas: true, fornecedora: true, setor: true },
        });
    }

    async create(data: BolsaCreateType): Promise<BolsaType> {
        const { codigosDasPecas, ...bolsaData } = data;

        const novaBolsaCompleta = await prisma.$transaction(async (tx) => {
            const bolsa = await tx.bolsa.create({
                data: {
                    ...bolsaData,
                },
            });

            const pecasData = codigosDasPecas.map((codigo) => ({
                codigoDaPeca: codigo,
                bolsaId: bolsa.bolsaId,
            }));

            await tx.pecaCadastrada.createMany({
                data: pecasData,
            });

            const bolsaCompleta = await tx.bolsa.findUniqueOrThrow({
                where: { bolsaId: bolsa.bolsaId },
                include: {
                    fornecedora: true,
                    setor: true,
                    pecasCadastradas: true,
                },
            });

            return bolsaCompleta;
        });

        return novaBolsaCompleta;
    }

    async update(data: BolsaUpdateType, bolsaId: number): Promise<BolsaType> {
        const { codigosDasPecas, ...updateData } = data;
        return prisma.bolsa.update({
            where: { bolsaId: bolsaId },
            data: updateData,
            include: { pecasCadastradas: true, fornecedora: true, setor: true },
        });
    }

    async syncPecas(bolsaId: number, codigosDasPecas: string[]): Promise<void> {
        const codigos = codigosDasPecas || [];

        await prisma.bolsa.update({
            where: { bolsaId: bolsaId },
            data: {
                pecasCadastradas: {
                    deleteMany: {},

                    connectOrCreate: codigos.map((codigo: string) => ({
                        where: { codigoDaPeca: codigo },

                        create: { codigoDaPeca: codigo },
                    })),
                },
            },
        });
    }

    async setStatus(
        bolsaId: BolsaParamsType,
        data: BolsaSetStatusType,
    ): Promise<boolean> {
        try {
            console.log(data);

            await prisma.bolsa.update({
                where: { bolsaId: bolsaId.bolsaId },
                data: data,
            });

            return true;
        } catch {
            return false;
        }
    }

    async archive(bolsaId: BolsaParamsType): Promise<void> {
        await prisma.bolsa.update({
            where: { bolsaId: bolsaId.bolsaId },
            data: { isArchived: true },
        });
    }

    async unarchive(bolsaId: BolsaParamsType): Promise<void> {
        await prisma.bolsa.update({
            where: { bolsaId: bolsaId.bolsaId },
            data: { isArchived: false },
        });
    }

    async getAll(query?: string): Promise<BolsaResponseType[]> {
        const term = query?.trim();

        const activeFilters = {
            isArchived: { not: true },
        };

        let textFilter = {};

        if (term) {
            textFilter = {
                OR: [
                    { observacoes: { contains: term, mode: "insensitive" } },

                    {
                        fornecedora: {
                            nome: { contains: term, mode: "insensitive" },
                        },
                    },
                    {
                        fornecedora: {
                            codigo: { contains: term, mode: "insensitive" },
                        },
                    },
                    {
                        fornecedora: {
                            telefone: { contains: term, mode: "insensitive" },
                        },
                    },

                    {
                        setor: {
                            nome: { contains: term, mode: "insensitive" },
                        },
                    },

                    {
                        pecasCadastradas: {
                            some: {
                                codigoDaPeca: {
                                    contains: term,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                ],
            };
        }

        return prisma.bolsa.findMany({
            include: { pecasCadastradas: true, fornecedora: true, setor: true },
            where: {
                AND: [activeFilters, textFilter],
            },
            orderBy: { dataDeEntrada: "desc" },
        });
    }

    async getArchivedById(
        fornecedoraId: BolsaGetArchivedByIdType,
    ): Promise<BolsaGetArchivedByIdResponseType> {
        return prisma.bolsa.findMany({
            include: { pecasCadastradas: true, fornecedora: true, setor: true },
            where: {
                fornecedoraId: fornecedoraId.fornecedoraId,
                isArchived: true,
            },
        });
    }

    async getBolsasGroupedByPrazo(): Promise<BolsaResponseType[]> {
        return await prisma.bolsa.findMany({
            include: { pecasCadastradas: true, fornecedora: true, setor: true },
            where: {
                isArchived: { not: true },
                dataMensagem: { not: null },
            },
        });
    }
}
