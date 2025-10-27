import { FastifyInstance } from "fastify";
import { BolsaController } from "./bolsa.controller";

import {
    bolsaParamsSchema,
    bolsaCreateSchema,
    bolsaUpdateSchema,
    bolsaGetAllResponseSchema,
    bolsaResponseSchema,
    bolsaSyncPecasSchema,
} from "./bolsa.schema";

export async function bolsaRoutes(
    app: FastifyInstance,
    options: { controller: BolsaController }
) {
    const { controller } = options;

    // GetAll
    app.get(
        "/",
        {
            schema: {
                response: {
                    200: bolsaGetAllResponseSchema,
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
                params: bolsaParamsSchema,
                body: bolsaUpdateSchema,
                response: {
                    200: bolsaResponseSchema,
                },
            },
        },
        controller.update.bind(controller)
    );

    // Delete
    app.delete(
        "/:bolsaId",
        {
            schema: {
                params: bolsaParamsSchema,
                response: {
                    204: { type: "null" },
                },
            },
        },
        controller.delete.bind(controller)
    );

    app.put(
        "/:bolsaId/pecas",
        {
            schema: {
                params: bolsaParamsSchema,
                body: bolsaSyncPecasSchema,
                response: {
                    204: { type: "null" },
                },
            },
        },
        controller.syncPecas.bind(controller)
    );
}
