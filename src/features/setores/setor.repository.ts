import { prisma } from "../../lib/prisma";
import { SetorCreateType } from "./setor.schema";
import { SetorType } from "./setor.schema";
import { SetorGetByIdType } from "./setor.schema";
import { SetorUpdateType } from "./setor.schema";
import { SetorDeleteType } from "./setor.schema";
import { SetorResponseType } from "./setor.schema";
import { SetorGetAllResponseType } from "./setor.schema";

export class SetorRepository {
    async getAll(): Promise<SetorGetAllResponseType> {
        return prisma.setor.findMany();
    }

    async getById(data: SetorGetByIdType): Promise<SetorResponseType | null> {
        return prisma.setor.findUnique({
            where: { setorId: data.setorId },
        });
    }

    async create(data: SetorCreateType): Promise<SetorType> {
        return prisma.setor.create({
            data,
        });
    }

    async update(data: SetorUpdateType): Promise<SetorType> {
        return prisma.setor.update({
            where: { setorId: data.setorId },
            data: {
                nome: data.nome,
            },
        });
    }

    async delete(data: SetorDeleteType): Promise<boolean> {
        try {
            await prisma.setor.delete({
                where: { setorId: data.setorId },
            });
            return true;
        } catch {
            return false;
        }
    }
}
