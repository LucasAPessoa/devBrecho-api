import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ... (Interface BolsaBody não muda)
interface BolsaBody {
    dataMensagem?: string | Date;
    quantidadeDePecasSemCadastro: number;
    observacoes?: string;
    fornecedoraId: number;
    setorId: number;
    codigosDePeca?: string[];
}

export const BolsaController = {
    // GET: /api/bolsa (MODIFICADO para filtrar deletados)
    getBolsas: async (request: FastifyRequest, reply: FastifyReply) => {
        const bolsas = await prisma.bolsa.findMany({
            where: { deletedAt: null }, // <-- SÓ RETORNA BOLSAS ATIVAS
            include: {
                fornecedora: true,
                setor: true,
                pecasCadastradas: true,
            },
        });
        return reply.send(bolsas);
    },

    // GET: /api/bolsa/:id (MODIFICADO para filtrar deletados)
    getBolsa: async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const bolsa = await prisma.bolsa.findFirst({
            // Usamos findFirst para combinar 'where'
            where: {
                bolsaId: parseInt(id),
                deletedAt: null,
            },
            include: {
                fornecedora: true,
                setor: true,
                pecasCadastradas: true,
            },
        });
        if (!bolsa)
            return reply.status(404).send({ message: "Bolsa não encontrada" });
        return reply.send(bolsa);
    },

    // POST: /api/bolsa (Não precisa de alteração)
    createBolsa: async (
        request: FastifyRequest<{ Body: BolsaBody }>,
        reply: FastifyReply
    ) => {
        const { codigosDePeca, ...bolsaData } = request.body;
        try {
            const novaBolsaComPecas = await prisma.$transaction(async (tx) => {
                const novaBolsa = await tx.bolsa.create({
                    data: {
                        ...bolsaData,
                        dataMensagem: bolsaData.dataMensagem
                            ? new Date(bolsaData.dataMensagem)
                            : null,
                    },
                });
                if (codigosDePeca && codigosDePeca.length > 0) {
                    const pecasParaCriar = codigosDePeca.map((codigo) => ({
                        codigoDaPeca: codigo,
                        bolsaId: novaBolsa.bolsaId,
                    }));
                    await tx.pecaCadastrada.createMany({
                        data: pecasParaCriar,
                    });
                }
                return novaBolsa;
            });
            return reply.status(201).send(novaBolsaComPecas);
        } catch (error) {
            request.log.error(error);
            return reply
                .status(500)
                .send({ message: "Erro ao criar a bolsa e suas peças." });
        }
    },

    // PUT: /api/bolsa/:id (Não precisa de alteração)
    updateBolsa: async (
        request: FastifyRequest<{
            Params: { id: string };
            Body: Partial<BolsaBody>;
        }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const { codigosDePeca, ...bolsaData } = request.body;
        try {
            const bolsaAtualizada = await prisma.$transaction(async (tx) => {
                const bolsa = await tx.bolsa.update({
                    where: { bolsaId: parseInt(id) },
                    data: {
                        ...bolsaData,
                        dataMensagem: bolsaData.dataMensagem
                            ? new Date(bolsaData.dataMensagem)
                            : undefined,
                    },
                });
                if (codigosDePeca) {
                    await tx.pecaCadastrada.deleteMany({
                        where: { bolsaId: parseInt(id) },
                    });
                    if (codigosDePeca.length > 0) {
                        const pecasParaCriar = codigosDePeca.map((codigo) => ({
                            codigoDaPeca: codigo,
                            bolsaId: bolsa.bolsaId,
                        }));
                        await tx.pecaCadastrada.createMany({
                            data: pecasParaCriar,
                        });
                    }
                }
                return bolsa;
            });
            return reply.send(bolsaAtualizada);
        } catch (error) {
            request.log.error(error);
            return reply
                .status(404)
                .send({ message: "Bolsa não encontrada para atualização" });
        }
    },

    // DELETE: /api/bolsa/:id (MODIFICADO para soft delete)
    deleteBolsa: async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        try {
            // Em vez de deletar, atualizamos o campo 'deletedAt'
            await prisma.bolsa.update({
                where: { bolsaId: parseInt(id) },
                data: { deletedAt: new Date() },
            });
            return reply.status(204).send();
        } catch (error) {
            request.log.error(error);
            return reply
                .status(404)
                .send({ message: "Bolsa não encontrada para exclusão" });
        }
    },
};
