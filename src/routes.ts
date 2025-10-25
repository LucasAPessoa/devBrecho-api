import { FastifyInstance } from "fastify";
import { FornecedoraController } from "./controllers/FornecedoraController";
import { BolsaController } from "./controllers/BolsaController";

export async function appRoutes(app: FastifyInstance) {
    // Rotas para Fornecedora
    app.get("/fornecedora", FornecedoraController.getFornecedoras);
    app.get("/fornecedora/:id", FornecedoraController.getFornecedora);
    app.post("/fornecedora", FornecedoraController.createFornecedora);
    app.put("/fornecedora/:id", FornecedoraController.updateFornecedora);
    app.delete("/fornecedora/:id", FornecedoraController.deleteFornecedora);

    // Rotas para Bolsa
    app.get("/bolsa", BolsaController.getBolsas);
    app.get("/bolsa/:id", BolsaController.getBolsa);
    app.post("/bolsa", BolsaController.createBolsa);
    app.put("/bolsa/:id", BolsaController.updateBolsa);
    app.delete("/bolsa/:id", BolsaController.deleteBolsa);
}
