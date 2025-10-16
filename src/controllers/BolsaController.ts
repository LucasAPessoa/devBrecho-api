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
    // Adicionamos a lista de códigos de peça, que virá como um array de strings
    codigosDePeca?: string[];
}

export const BolsaController = {
    // GET (getBolsas e getBolsa) não precisam de alteração
    // ... (mantenha os métodos GET como estão)
    getBolsas: async (request: FastifyRequest, reply: FastifyReply) => {
        const bolsas = await prisma.bolsa.findMany({
            include: {
                fornecedora: true,
                setor: true,
                pecasCadastradas: true, // Opcional: incluir as peças já na listagem
            },
        });
        return reply.send(bolsas);
    },

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
                pecasCadastradas: true, // Inclui as peças ao buscar uma bolsa específica
            },
        });
        if (!bolsa)
            return reply.status(404).send({ message: "Bolsa não encontrada" });
        return reply.send(bolsa);
    },

    // POST: /api/bolsa (MODIFICADO)
    createBolsa: async (
        request: FastifyRequest<{ Body: BolsaBody }>,
        reply: FastifyReply
    ) => {
        const { codigosDePeca, ...bolsaData } = request.body;

        const novaBolsaComPecas = await prisma.$transaction(async (tx) => {
            // 1. Cria a bolsa primeiro para obter um ID
            const novaBolsa = await tx.bolsa.create({
                data: {
                    ...bolsaData,
                    dataMensagem: bolsaData.dataMensagem
                        ? new Date(bolsaData.dataMensagem)
                        : null,
                },
            });

            // 2. Se houver códigos, formata e cria as peças associadas
            if (codigosDePeca && codigosDePeca.length > 0) {
                const pecasParaCriar = codigosDePeca.map((codigo) => ({
                    codigoDaPeca: codigo,
                    bolsaId: novaBolsa.bolsaId, // Associa ao ID da bolsa recém-criada
                }));
                await tx.pecaCadastrada.createMany({
                    data: pecasParaCriar,
                });
            }

            return novaBolsa;
        });

        return reply.status(201).send(novaBolsaComPecas);
    },

    // PUT: /api/bolsa/:id (MODIFICADO)
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
                // 1. Atualiza os dados da bolsa
                const bolsa = await tx.bolsa.update({
                    where: { bolsaId: parseInt(id) },
                    data: {
                        ...bolsaData,
                        dataMensagem: bolsaData.dataMensagem
                            ? new Date(bolsaData.dataMensagem)
                            : undefined,
                    },
                });

                // 2. Se a lista de códigos foi enviada, sincronizamos as peças
                if (codigosDePeca) {
                    // Deleta as peças antigas...
                    await tx.pecaCadastrada.deleteMany({
                        where: { bolsaId: parseInt(id) },
                    });

                    // ... e cria as novas
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

    // DELETE (deleteBolsa) não precisa de alteração
    // ... (mantenha o método DELETE como está)
    deleteBolsa: async (
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        try {
            // A deleção em cascata (configurada no schema.prisma) cuidará das peças
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
