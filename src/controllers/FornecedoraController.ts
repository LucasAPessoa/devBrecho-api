import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Tipagem para o corpo da requisição de criação/atualização
interface FornecedoraBody {
    nome: string;
    telefone?: string;
}

export const FornecedoraController = {
    // GET: /api/fornecedora
    getFornecedoras: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const fornecedoras = await prisma.fornecedora.findMany();
            return reply.send(fornecedoras);
        } catch (error) {
            request.log.error(error);
            return reply
                .status(500)
                .send({ message: "Erro interno do servidor" });
        }
    },

    // GET: /api/fornecedora/:id
    getFornecedora: async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = request.params;
            const fornecedora = await prisma.fornecedora.findUnique({
                where: { fornecedoraId: parseInt(id) },
            });

            if (!fornecedora) {
                return reply
                    .status(404)
                    .send({ message: "Fornecedora não encontrada" });
            }
            return reply.send(fornecedora);
        } catch (error) {
            request.log.error(error);
            return reply
                .status(500)
                .send({ message: "Erro interno do servidor" });
        }
    },

    // POST: /api/fornecedora
    createFornecedora: async (
        request: FastifyRequest<{ Body: FornecedoraBody }>,
        reply: FastifyReply
    ) => {
        try {
            const { nome, telefone } = request.body;
            const novaFornecedora = await prisma.fornecedora.create({
                data: { nome, telefone },
            });
            return reply.status(201).send(novaFornecedora);
        } catch (error) {
            request.log.error(error);
            return reply
                .status(500)
                .send({ message: "Erro ao criar fornecedora" });
        }
    },

    // PUT: /api/fornecedora/:id
    updateFornecedora: async (
        request: FastifyRequest<{
            Params: { id: string };
            Body: FornecedoraBody;
        }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = request.params;
            const data = request.body;
            const fornecedora = await prisma.fornecedora.update({
                where: { fornecedoraId: parseInt(id) },
                data,
            });
            return reply.send(fornecedora);
        } catch (error) {
            request.log.error(error);
            return reply
                .status(404)
                .send({
                    message: "Fornecedora não encontrada para atualização",
                });
        }
    },

    // DELETE: /api/fornecedora/:id
    deleteFornecedora: async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        try {
            const { id } = request.params;
            await prisma.fornecedora.delete({
                where: { fornecedoraId: parseInt(id) },
            });
            return reply.status(204).send();
        } catch (error) {
            request.log.error(error);
            return reply
                .status(404)
                .send({ message: "Fornecedora não encontrada para exclusão" });
        }
    },
};
