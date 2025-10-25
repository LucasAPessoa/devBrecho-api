import { FastifyInstance } from "fastify";
import { SetorController } from "./setor.controller";

import {
    setorParamsSchema,
    setorCreateSchema,
    setorUpdateSchema,
    setorGetAllResponseSchema,
    setorResponseSchema,
} from "./setor.schema";

export async function setorRoutes(
    app: FastifyInstance,

    options: { controller: SetorController }
) {
    const { controller } = options;

    //GetAll
    app.get(
        "/",
        {
            schema: {
                response: {
                    200: setorGetAllResponseSchema,
                },
            },
        },
        controller.getAll.bind(controller)
    );

    //GetById
    app.get(
        "/:setorId",
        {
            schema: {
                params: setorParamsSchema,
                response: {
                    200: setorResponseSchema,
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
                body: setorCreateSchema,
                response: {
                    201: setorResponseSchema,
                },
            },
        },

        controller.create.bind(controller)
    );

    app.put(
        "/:setorId",
        {
            schema: {
                params: setorParamsSchema,
                body: setorUpdateSchema,
                response: {
                    200: setorResponseSchema,
                },
            },
        },
        controller.update.bind(controller)
    );

    // Delete
    app.delete(
        "/:setorId",
        {
            schema: {
                params: setorParamsSchema,
            },
        },
        controller.delete.bind(controller)
    );
}
