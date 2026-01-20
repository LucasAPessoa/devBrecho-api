import { FastifyInstance } from "fastify";
import { FornecedoraController } from "./fornecedora.controller";

import {
    fornecedoraParamsSchema,
    fornecedoraCreateSchema,
    fornecedoraUpdateSchema,
    fornecedoraGetAllResponseSchema,
    fornecedoraResponseSchema,
    FornecedoraSearchQuerySchema,
} from "./fornecedora.schema";
import z from "zod";

export async function fornecedoraRoutes(
    app: FastifyInstance,
    options: { controller: FornecedoraController }
) {
    const { controller } = options;

    // GetAll
    app.get(
        "/",
        {
            schema: {
                tags: ["Fornecedoras"],
                params: FornecedoraSearchQuerySchema,
                response: {
                    200: fornecedoraGetAllResponseSchema,
                },
            },
        },
        controller.getAll.bind(controller)
    );

    // GetById
    app.get(
        "/:fornecedoraId",
        {
            schema: {
                tags: ["Fornecedoras"],
                params: fornecedoraParamsSchema,
                response: {
                    200: fornecedoraResponseSchema,
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
                tags: ["Fornecedoras"],
                body: fornecedoraCreateSchema,
                response: {
                    201: fornecedoraResponseSchema,
                },
            },
        },
        controller.create.bind(controller)
    );

    // Update
    app.put(
        "/:fornecedoraId",
        {
            schema: {
                tags: ["Fornecedoras"],
                params: fornecedoraParamsSchema,
                body: fornecedoraUpdateSchema,
                response: {
                    200: fornecedoraResponseSchema,
                },
            },
        },
        controller.update.bind(controller)
    );

    // Delete
    app.delete(
        "/:fornecedoraId",
        {
            schema: {
                tags: ["Fornecedoras"],
                params: fornecedoraParamsSchema,
                response: {
                    204: z.null(),
                },
            },
        },
        controller.delete.bind(controller)
    );
}
