import { FastifyInstance } from "fastify";
import { PecaCadastradaController } from "./pecaCadastrada.controller";
import {
    pecaCadastradaCreateSchema,
    pecaCadastradaDeleteSchema,
    pecaCadastradaGetAllResponseSchema,
    pecaCadastradaGetByBolsaIdSchema,
    pecaCadastradaUpdateSchema,
} from "./pecaCadastrada.schema";
import z from "zod";

export async function pecaCadastradaRoutes(
    app: FastifyInstance,
    options: { controller: PecaCadastradaController }
) {
    //GetByBolsaId
    app.get(
        "/:bolsaId",
        {
            schema: {
                tags: ["Pecas Cadastradas"],
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
                tags: ["Pecas Cadastradas"],
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
                tags: ["Pecas Cadastradas"],
                body: pecaCadastradaCreateSchema,
                response: {
                    201: z.boolean(),
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
                tags: ["Pecas Cadastradas"],
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
                tags: ["Pecas Cadastradas"],
                body: pecaCadastradaUpdateSchema,
                response: {
                    200: pecaCadastradaUpdateSchema,
                },
            },
        },
        options.controller.update.bind(options.controller)
    );
}
