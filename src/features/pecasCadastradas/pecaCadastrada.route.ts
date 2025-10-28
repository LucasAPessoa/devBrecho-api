import { FastifyInstance } from "fastify";
import { PecaCadastradaController } from "./pecaCadastrada.controller";
import {
    pecaCadastradaCreateSchema,
    pecaCadastradaDeleteSchema,
    pecaCadastradaGetAllResponseSchema,
    pecaCadastradaGetByBolsaIdSchema,
    pecaCadastradaUpdateSchema,
} from "./pecaCadastrada.schema";

export async function pecaCadastradaRoutes(
    app: FastifyInstance,
    options: { controller: PecaCadastradaController }
) {
    //GetByBolsaId
    app.get(
        "/:bolsaId",
        {
            schema: {
                params: pecaCadastradaGetByBolsaIdSchema,
                response: {
                    200: pecaCadastradaGetAllResponseSchema,
                },
            },
        },
        options.controller.getByBolsaId.bind(options.controller)
    );

    //GetAll
    app.get(
        "/",
        {
            schema: {
                response: {
                    200: pecaCadastradaGetAllResponseSchema,
                },
            },
        },
        options.controller.getAll.bind(options.controller)
    );

    // Create
    app.post(
        "/",
        {
            schema: {
                body: pecaCadastradaCreateSchema,
                response: {
                    201: { type: "boolean" },
                },
            },
        },
        options.controller.create.bind(options.controller)
    );

    // Delete
    app.delete(
        "/:pecaCadastradaId",
        {
            schema: {
                params: pecaCadastradaDeleteSchema,
            },
        },
        options.controller.delete.bind(options.controller)
    );

    // Update

    app.put(
        "/",
        {
            schema: {
                body: pecaCadastradaUpdateSchema,
                response: {
                    200: pecaCadastradaUpdateSchema,
                },
            },
        },
        options.controller.update.bind(options.controller)
    );
}
