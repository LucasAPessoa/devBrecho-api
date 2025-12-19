import { FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";

import {
    userCreateSchema,
    userParamsSchema,
    userResponseSchema,
} from "../users/user.schema";
import { loginSchema } from "./auth.schema";

export async function authRoutes(
    app: FastifyInstance,
    options: { controller: AuthController }
) {
    const { controller } = options;

    app.post(
        "/register",
        {
            schema: {
                tags: ["Auth"],
                body: userCreateSchema,
            },
        },
        controller.register.bind(controller)
    );

    app.post(
        "/login",
        {
            schema: {
                tags: ["Auth"],
                body: loginSchema,
            },
        },
        controller.login.bind(controller)
    );
}
