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
} from "./bolsa.schema";

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
                response: {
                    200: bolsaGetAllActiveResponseSchema,
                },
            },
        },
        controller.getAllActive.bind(controller)
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

    // Sync Pecas

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

    // Set Status

    app.patch(
        "/:bolsaId/status",
        {
            schema: {
                params: bolsaParamsSchema,
                body: bolsaSetStatusSchema,
                response: {
                    204: { type: null },
                },
            },
        },
        controller.setStatus.bind(controller)
    );
}
