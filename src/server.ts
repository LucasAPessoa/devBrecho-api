import Fastify from "fastify";
import { appRoutes } from "./routes";

console.log("--- [PASSO 1] Iniciando o arquivo server.ts ---");

const app = Fastify({
    logger: true,
});

console.log("--- [PASSO 2] Instância do Fastify criada ---");

app.register(appRoutes, { prefix: "/api" });

console.log("--- [PASSO 3] Rotas registradas ---");

const start = async () => {
    try {
        console.log("--- [PASSO 4] Dentro da função start ---");

        // Verificando a variável de ambiente crucial
        if (!process.env.DATABASE_URL) {
            console.error(
                "ERRO FATAL: A variável de ambiente DATABASE_URL não foi definida!"
            );
            throw new Error("DATABASE_URL não definida");
        }
        console.log(
            "--- [PASSO 5] DATABASE_URL encontrada. Tentando iniciar o servidor... ---"
        );

        const port = Number(process.env.PORT) || 3333;
        await app.listen({ port, host: "0.0.0.0" });

        // Se você chegar aqui, a aplicação iniciou com sucesso!
        app.log.info(`🚀 Servidor HTTP rodando na porta ${port}`);
    } catch (err) {
        // Este log vai capturar o erro exato que está quebrando a aplicação
        console.error("--- ERRO FATAL AO INICIAR O SERVIDOR ---");
        console.error(err);
        process.exit(1);
    }
};

start();
