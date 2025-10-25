import "dotenv/config";
import Fastify from "fastify";

import cors from "@fastify/cors";
import { setorRoutes } from "./features/setores/setor.route";
import { SetorRepository } from "./features/setores/setor.repository";
import { SetorService } from "./features/setores/setor.service";
import { SetorController } from "./features/setores/setor.controller";

import {
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from "fastify-type-provider-zod";
import { pecaCadastradaRoutes } from "./features/pecasCadastradas/pecaCadastrada.route";
import { PecaCadastradaRepository } from "./features/pecasCadastradas/pecaCadastrada.repository";
import { PecaCadastradaController } from "./features/pecasCadastradas/pecaCadastrada.controller";

import { PecaCadastradaService } from "./features/pecasCadastradas/pecaCadastrada.service";

console.log("--- [PASSO 1] Iniciando o arquivo server.ts ---");

const app = Fastify({
    logger: true,
}).withTypeProvider<ZodTypeProvider>();

console.log("--- [PASSO 1.1] Adicionando os compilers ---");

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

console.log("--- [PASSO 2] Instância do Fastify criada ---");

const start = async () => {
    try {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://devbrecho-front.onrender.com",
        ];

        await app.register(cors, {
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);

                if (allowedOrigins.indexOf(origin) === -1) {
                    const msg =
                        "A política de CORS para este site não permite acesso da Origem especificada.";
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            },
        });

        const setorRepository = new SetorRepository();
        const setorService = new SetorService(setorRepository);
        const setorController = new SetorController(setorService);

        app.register(setorRoutes, {
            prefix: "/api/setores",
            controller: setorController,
        });

        const pecaCadastradaRepository = new PecaCadastradaRepository();
        const pecaCadastradaService = new PecaCadastradaService(
            pecaCadastradaRepository
        );
        const pecaCadastradaController = new PecaCadastradaController(
            pecaCadastradaService
        );

        app.register(pecaCadastradaRoutes, {
            prefix: "/api/pecaCadastrada",
            controller: pecaCadastradaController,
        });

        console.log("--- [PASSO 3] Rotas registradas ---");

        if (!process.env.DATABASE_URL) {
            console.error(
                "ERRO FATAL: A variável de ambiente DATABASE_URL não foi definida!"
            );
            throw new Error("DATABASE_URL não definida");
        }

        console.log(
            "--- [PASSO 4] DATABASE_URL encontrada. Tentando iniciar o servidor... ---"
        );

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
