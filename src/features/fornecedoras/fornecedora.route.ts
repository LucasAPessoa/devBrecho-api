import { FastifyInstance } from "fastify";
import { FornecedoraController } from "./fornecedora.controller";

import {
    fornecedoraParamsSchema,
    fornecedoraCreateSchema,
    fornecedoraUpdateSchema,
    fornecedoraGetAllResponseSchema,
    fornecedoraResponseSchema,
} from "./fornecedora.schema";

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
                params: fornecedoraParamsSchema,
                response: {
                    204: { type: "null" },
                },
            },
        },
        controller.delete.bind(controller)
    );
}
