import { FastifyInstance } from "fastify";
import { UserController } from "./user.controller";

import { userCreateSchema } from "./user.schema";

export async function userRoutes(
    app: FastifyInstance,
    options: { controller: UserController }
) {
    const { controller } = options;

    app.post(
        "/",
        {
            schema: {
                tags: ["Users"],
                body: userCreateSchema,
            },
        },
        controller.create.bind(controller)
    );
}
