import { prisma } from "../../lib/prisma";
import {
    BolsaGetAllDoadasAndDevolvidasResponseType,
    BolsaGetAllDoadasAndDevolvidasType,
    BolsaSetStatusType,
} from "./bolsa.schema";
import {
    BolsaCreateType,
    BolsaType,
    BolsaParamsType,
    BolsaUpdateType,
    BolsaGetAllActiveResponseType,
    BolsaResponseType,
    BolsaSyncPecasType,
} from "./bolsa.schema";

export class BolsaRepository {
    async getById(data: BolsaParamsType): Promise<BolsaResponseType | null> {
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
        data: BolsaSetStatusType
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

    async getAll(query?: string): Promise<BolsaResponseType[]> {
        const term = query?.trim();

        const activeFilters = {
            statusDevolvida: { not: true },
            statusDoada: { not: true },
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

    async getAllDoadasAndDevolvidas(
        fornecedoraId: BolsaGetAllDoadasAndDevolvidasType
    ): Promise<BolsaGetAllDoadasAndDevolvidasResponseType> {
        return prisma.bolsa.findMany({
            include: { pecasCadastradas: true, fornecedora: true, setor: true },
            where: {
                fornecedoraId: fornecedoraId.fornecedoraId,
                OR: [{ statusDevolvida: true }, { statusDoada: true }],
            },
        });
    }
}
