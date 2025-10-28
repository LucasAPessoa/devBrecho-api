import { prisma } from "../../lib/prisma";
import {
    PecaCadastradaCreateType,
    PecaCadastradaGetAllResponseType,
    PecaCadastradaGetByBolsaIdResponseType,
    PecaCadastradaUpdateResponseType,
    PecaCadastradaUpdateType,
} from "./pecaCadastrada.schema";
import { PecaCadastradaGetByBolsaIdType } from "./pecaCadastrada.schema";
import { PecaCadastradaDeleteType } from "./pecaCadastrada.schema";

export class PecaCadastradaRepository {
    async getAll(): Promise<PecaCadastradaGetAllResponseType> {
        return prisma.pecaCadastrada.findMany();
    }

    async getByBolsaId(
        data: PecaCadastradaGetByBolsaIdType
    ): Promise<PecaCadastradaGetByBolsaIdResponseType> {
        return prisma.pecaCadastrada.findMany({
            where: { bolsaId: data.bolsaId },
        });
    }

    async create(data: PecaCadastradaCreateType): Promise<boolean> {
        try {
            const dataFormatted = data.codigoDaPeca.map((codigo) => ({
                codigoDaPeca: codigo,
                bolsaId: data.bolsaId,
            }));
            await prisma.pecaCadastrada.createMany({
                data: dataFormatted,
            });
            return true;
        } catch {
            return false;
        }
    }

    async delete(data: PecaCadastradaDeleteType): Promise<boolean> {
        try {
            await prisma.pecaCadastrada.delete({
                where: { pecaCadastradaId: data.pecaCadastradaId },
            });
            return true;
        } catch {
            return false;
        }
    }

    async update(
        data: PecaCadastradaUpdateType
    ): Promise<PecaCadastradaUpdateResponseType> {
        return prisma.pecaCadastrada.update({
            where: { pecaCadastradaId: data.pecaCadastradaId },
            data: {
                codigoDaPeca: data.codigoDaPeca,
            },
        });
    }
}
