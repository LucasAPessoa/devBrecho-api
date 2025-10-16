import Fastify from "fastify";
import { appRoutes } from "./routes";

const app = Fastify({
    logger: true, // Habilita logs para debug
});

// Registra todas as rotas da aplicação
app.register(appRoutes, { prefix: "/api" });

const start = async () => {
    try {
        // A porta será lida da variável de ambiente PORT ou será 3333 por padrão
        const port = Number(process.env.PORT) || 3333;
        await app.listen({ port, host: "localhost" });
        app.log.info(`🚀 Servidor HTTP rodando na porta ${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
