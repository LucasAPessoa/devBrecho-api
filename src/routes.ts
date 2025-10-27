import { FastifyInstance } from "fastify";

import { BolsaController } from "./controllers/BolsaController";

export async function appRoutes(app: FastifyInstance) {
    // Rotas para Bolsa
    app.get("/bolsa", BolsaController.getBolsas);
    app.get("/bolsa/:id", BolsaController.getBolsa);
    app.post("/bolsa", BolsaController.createBolsa);
    app.put("/bolsa/:id", BolsaController.updateBolsa);
    app.delete("/bolsa/:id", BolsaController.deleteBolsa);
}
