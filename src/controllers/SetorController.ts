import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const SetorController = {
    getSetores: async (request: FastifyRequest, reply: FastifyReply) => {
        const setores = await prisma.setor.findMany();
        return reply.send(setores);
    },

    getSetor: async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const setor = await prisma.setor.findUnique({
            where: { setorId: parseInt(id) },
        });
        if (!setor)
            return reply.status(404).send({ message: "Setor não encontrado" });
        return reply.send(setor);
    },

    createSetor: async (
        request: FastifyRequest<{ Body: { nome: string } }>,
        reply: FastifyReply
    ) => {
        const { nome } = request.body;
        const novoSetor = await prisma.setor.create({ data: { nome } });
        return reply.status(201).send(novoSetor);
    },

    updateSetor: async (
        request: FastifyRequest<{
            Params: { id: string };
            Body: { nome: string };
        }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const { nome } = request.body;
        const setor = await prisma.setor.update({
            where: { setorId: parseInt(id) },
            data: { nome },
        });
        return reply.send(setor);
    },

    deleteSetor: async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        await prisma.setor.delete({ where: { setorId: parseInt(id) } });
        return reply.status(204).send();
    },
};
