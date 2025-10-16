import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Tipagem para o corpo da requisição de criação/atualização
interface PecaCadastradaBody {
    codigoDaPeca: string;
    bolsaId: number;
}

export const PecaCadastradaController = {
    // GET: /api/peca
    getPecas: async (request: FastifyRequest, reply: FastifyReply) => {
        const pecas = await prisma.pecaCadastrada.findMany({
            include: {
                bolsa: true, // Equivalente ao .Include(p => p.Bolsa)
            },
        });
        return reply.send(pecas);
    },

    // GET: /api/peca/:id
    getPeca: async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const peca = await prisma.pecaCadastrada.findUnique({
            where: { pecaCadastradaId: parseInt(id) },
            include: {
                bolsa: true,
            },
        });
        if (!peca)
            return reply.status(404).send({ message: "Peça não encontrada" });
        return reply.send(peca);
    },

    // POST: /api/peca
    createPeca: async (
        request: FastifyRequest<{ Body: PecaCadastradaBody }>,
        reply: FastifyReply
    ) => {
        const data = request.body;
        const novaPeca = await prisma.pecaCadastrada.create({ data });
        return reply.status(201).send(novaPeca);
    },

    // PUT: /api/peca/:id
    updatePeca: async (
        request: FastifyRequest<{
            Params: { id: string };
            Body: Partial<PecaCadastradaBody>;
        }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const data = request.body;
        try {
            const peca = await prisma.pecaCadastrada.update({
                where: { pecaCadastradaId: parseInt(id) },
                data,
            });
            return reply.send(peca);
        } catch (error) {
            request.log.error(error);
            return reply
                .status(404)
                .send({ message: "Peça não encontrada para atualização" });
        }
    },

    // DELETE: /api/peca/:id
    deletePeca: async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        try {
            await prisma.pecaCadastrada.delete({
                where: { pecaCadastradaId: parseInt(id) },
            });
            return reply.status(204).send();
        } catch (error) {
            request.log.error(error);
            return reply
                .status(404)
                .send({ message: "Peça não encontrada para exclusão" });
        }
    },
};
