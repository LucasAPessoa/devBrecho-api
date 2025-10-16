import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Tipagem para o corpo da requisição de criação/atualização
interface BolsaBody {
    dataMensagem?: string | Date;
    quantidadeDePecasSemCadastro: number;
    observacoes?: string;
    fornecedoraId: number;
    setorId: number;
}

export const BolsaController = {
    // GET: /api/bolsa
    getBolsas: async (request: FastifyRequest, reply: FastifyReply) => {
        const bolsas = await prisma.bolsa.findMany({
            include: {
                fornecedora: true, // Equivalente ao .Include(b => b.Fornecedora)
                setor: true, // Equivalente ao .Include(b => b.Setor)
            },
        });
        return reply.send(bolsas);
    },

    // GET: /api/bolsa/:id
    getBolsa: async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const bolsa = await prisma.bolsa.findUnique({
            where: { bolsaId: parseInt(id) },
            include: {
                fornecedora: true,
                setor: true,
            },
        });
        if (!bolsa)
            return reply.status(404).send({ message: "Bolsa não encontrada" });
        return reply.send(bolsa);
    },

    // POST: /api/bolsa
    createBolsa: async (
        request: FastifyRequest<{ Body: BolsaBody }>,
        reply: FastifyReply
    ) => {
        const { dataMensagem, ...rest } = request.body;
        const novaBolsa = await prisma.bolsa.create({
            data: {
                ...rest,
                dataMensagem: dataMensagem ? new Date(dataMensagem) : null,
            },
        });
        return reply.status(201).send(novaBolsa);
    },

    // PUT: /api/bolsa/:id
    updateBolsa: async (
        request: FastifyRequest<{
            Params: { id: string };
            Body: Partial<BolsaBody>;
        }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const { dataMensagem, ...rest } = request.body;

        const data: any = { ...rest };
        if (dataMensagem) {
            data.dataMensagem = new Date(dataMensagem);
        }

        try {
            const bolsa = await prisma.bolsa.update({
                where: { bolsaId: parseInt(id) },
                data,
            });
            return reply.send(bolsa);
        } catch (error) {
            request.log.error(error);
            return reply
                .status(404)
                .send({ message: "Bolsa não encontrada para atualização" });
        }
    },

    // DELETE: /api/bolsa/:id
    deleteBolsa: async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        try {
            await prisma.bolsa.delete({ where: { bolsaId: parseInt(id) } });
            return reply.status(204).send();
        } catch (error) {
            request.log.error(error);
            return reply
                .status(404)
                .send({ message: "Bolsa não encontrada para exclusão" });
        }
    },
};
