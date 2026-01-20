import { FastifyInstance } from "fastify";
import { BolsaController } from "./bolsa.controller";

import {
    bolsaParamsSchema,
    bolsaCreateSchema,
    bolsaUpdateSchema,
    bolsaGetAllActiveResponseSchema,
    bolsaResponseSchema,
    bolsaSyncPecasSchema,
    bolsaSetStatusSchema,
    bolsaSearchQuerySchema,
    bolsaGetAllDoadasAndDevolvidasSchema,
    bolsaGetAllDoadasAndDevolvidasResponseSchema,
    bolsaGetGroupedByPrazoSchema,
} from "./bolsa.schema";
import z from "zod";

export async function bolsaRoutes(
    app: FastifyInstance,
    options: { controller: BolsaController }
) {
    const { controller } = options;

    // getAllActive
    app.get(
        "/",
        {
            schema: {
                tags: ["Bolsas"],
                querystring: bolsaSearchQuerySchema,
                response: {
                    200: bolsaGetAllActiveResponseSchema,
                },
            },
        },
        controller.getAll.bind(controller)
    );

    // GetById
    app.get(
        "/:bolsaId",
        {
            schema: {
                tags: ["Bolsas"],
                params: bolsaParamsSchema,
                response: {
                    200: bolsaResponseSchema,
                },
            },
        },
        controller.getById.bind(controller)
    );

    // Create
    app.post(
        "/",
        {
            schema: {
                tags: ["Bolsas"],
                body: bolsaCreateSchema,
                response: {
                    201: bolsaResponseSchema,
                },
            },
        },
        controller.create.bind(controller)
    );

    // Update
    app.put(
        "/:bolsaId",
        {
            schema: {
                tags: ["Bolsas"],
                params: bolsaParamsSchema,
                body: bolsaUpdateSchema,
                response: {
                    200: bolsaResponseSchema,
                },
            },
        },
        controller.update.bind(controller)
    );

    // Sync Pecas

    app.put(
        "/:bolsaId/pecas",
        {
            schema: {
                tags: ["Bolsas", "Pecas Cadastradas"],
                params: bolsaParamsSchema,
                body: bolsaSyncPecasSchema,
                response: {
                    204: z.null(),
                },
            },
        },
        controller.syncPecas.bind(controller)
    );

    // Set Status

    app.patch(
        "/:bolsaId/status",
        {
            schema: {
                tags: ["Bolsas"],
                params: bolsaParamsSchema,
                body: bolsaSetStatusSchema,
                response: {
                    204: z.null(),
                },
            },
        },
        controller.setStatus.bind(controller)
    );

    // Get All Doadas And Devolvidas

    app.get(
        "/doadasEDevolvidas/:fornecedoraId",
        {
            schema: {
                tags: ["Bolsas"],
                params: bolsaGetAllDoadasAndDevolvidasSchema,
                response: {
                    200: bolsaGetAllDoadasAndDevolvidasResponseSchema,
                },
            },
        },
        controller.getAllDoadasAndDevolvidas.bind(controller)
    );

    // Get Bolsas Grouped By Mensagem

    app.get(
        "/groupedByDataMensagem",
        {
            schema: {
                tags: ["Bolsas"],
                response: {
                    200: bolsaGetGroupedByPrazoSchema,
                },
            },
        },
        controller.getBolsasGroupedByPrazo.bind(controller)
    );
}
