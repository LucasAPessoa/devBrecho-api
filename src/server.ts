import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from "fastify-type-provider-zod";

import { globalErrorHandler } from "./hooks/globalErrorHandler.hook";
import { AuthHook } from "./hooks/auth.hook";

import { AuthService } from "./features/auth/auth.service";
import { AuthController } from "./features/auth/auth.controller";
import { authRoutes } from "./features/auth/auth.route";

import { UserRepository } from "./features/users/user.repository";
import { UserService } from "./features/users/user.service";
import { UserController } from "./features/users/user.controller";
import { userRoutes } from "./features/users/user.route";

import { SetorRepository } from "./features/setores/setor.repository";
import { SetorService } from "./features/setores/setor.service";
import { SetorController } from "./features/setores/setor.controller";
import { setorRoutes } from "./features/setores/setor.route";

import { PecaCadastradaRepository } from "./features/pecasCadastradas/pecaCadastrada.repository";
import { PecaCadastradaService } from "./features/pecasCadastradas/pecaCadastrada.service";
import { PecaCadastradaController } from "./features/pecasCadastradas/pecaCadastrada.controller";
import { pecaCadastradaRoutes } from "./features/pecasCadastradas/pecaCadastrada.route";

import { FornecedoraRepository } from "./features/fornecedoras/fornecedora.repository";
import { FornecedoraService } from "./features/fornecedoras/fornecedora.service";
import { FornecedoraController } from "./features/fornecedoras/fornecedora.controller";
import { fornecedoraRoutes } from "./features/fornecedoras/fornecedora.route";

import { BolsaRepository } from "./features/bolsas/bolsa.repository";
import { BolsaService } from "./features/bolsas/bolsa.service";
import { BolsaController } from "./features/bolsas/bolsa.controller";
import { bolsaRoutes } from "./features/bolsas/bolsa.route";

const app = Fastify({
    logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const start = async () => {
    try {
        app.setErrorHandler(globalErrorHandler);

        await app.register(cors, {
            origin: ["http://localhost:5173"],
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
        });

        await app.register(fastifySwagger, {
            openapi: {
                info: {
                    title: "BrechoApi",
                    version: "1.0.0",
                },
            },
            transform: jsonSchemaTransform,
        });

        await app.register(fastifySwaggerUi, {
            routePrefix: "/docs",
        });

        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);
        const userController = new UserController(userService);

        const authService = new AuthService(userService);
        const authController = new AuthController(authService);

        const setorRepository = new SetorRepository();
        const setorService = new SetorService(setorRepository);
        const setorController = new SetorController(setorService);

        const pecaCadastradaRepository = new PecaCadastradaRepository();
        const pecaCadastradaService = new PecaCadastradaService(
            pecaCadastradaRepository
        );
        const pecaCadastradaController = new PecaCadastradaController(
            pecaCadastradaService
        );

        const fornecedoraRepository = new FornecedoraRepository();
        const fornecedoraService = new FornecedoraService(
            fornecedoraRepository
        );
        const fornecedoraController = new FornecedoraController(
            fornecedoraService
        );

        const bolsaRepository = new BolsaRepository();
        const bolsaService = new BolsaService(
            bolsaRepository,
            pecaCadastradaService
        );
        const bolsaController = new BolsaController(bolsaService);

        app.register(authRoutes, {
            prefix: "/api/auth",
            controller: authController,
        });

        app.register(async (privateRoutes) => {
            privateRoutes.addHook("preHandler", AuthHook);

            privateRoutes.register(userRoutes, {
                prefix: "/api/users",
                controller: userController,
            });

            privateRoutes.register(setorRoutes, {
                prefix: "/api/setores",
                controller: setorController,
            });

            privateRoutes.register(pecaCadastradaRoutes, {
                prefix: "/api/pecaCadastrada",
                controller: pecaCadastradaController,
            });

            privateRoutes.register(fornecedoraRoutes, {
                prefix: "/api/fornecedoras",
                controller: fornecedoraController,
            });

            privateRoutes.register(bolsaRoutes, {
                prefix: "/api/bolsas",
                controller: bolsaController,
            });
        });

        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL não definida");
        }

        const port = Number(process.env.PORT) || 3333;
        await app.listen({ port, host: "0.0.0.0" });

        app.log.info(`Servidor HTTP rodando na porta ${port}`);
    } catch (err) {
        console.error("--- ERRO FATAL AO INICIAR O SERVIDOR ---");
        console.error(err);
        process.exit(1);
    }
};

start();
