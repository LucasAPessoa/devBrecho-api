import { prisma } from "../../lib/prisma";
import {
    BolsaCreateType,
    BolsaType,
    BolsaParamsType,
    BolsaUpdateType,
    BolsaGetAllResponseType,
    BolsaResponseType,
    BolsaSyncPecasType,
} from "./bolsa.schema";

export class BolsaRepository {
    async getAll(): Promise<BolsaGetAllResponseType> {
        return prisma.bolsa.findMany({
            include: { pecasCadastradas: true, fornecedora: true, setor: true },
        });
    }

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
        const { ...updateData } = data;
        return prisma.bolsa.update({
            where: { bolsaId: bolsaId },
            data: updateData,
            include: { pecasCadastradas: true, fornecedora: true, setor: true },
        });
    }

    async delete(data: BolsaParamsType): Promise<boolean> {
        try {
            await prisma.$transaction(async (tx) => {
                await tx.pecaCadastrada.deleteMany({
                    where: { bolsaId: data.bolsaId },
                });

                await tx.bolsa.delete({
                    where: { bolsaId: data.bolsaId },
                });
            });
            return true;
        } catch {
            return false;
        }
    }
    async syncPecas(bolsaId: number, data: BolsaSyncPecasType): Promise<void> {
        await prisma.bolsa.update({
            where: { bolsaId: bolsaId },
            data: {
                pecasCadastradas: {
                    deleteMany: {},

                    create: data.codigosDasPecas.map((codigo) => ({
                        codigoDaPeca: codigo,
                    })),
                },
            },
        });
    }
}
