import { FastifyInstance } from "fastify";
import { SetorController } from "./controllers/SetorController";
import { FornecedoraController } from "./controllers/FornecedoraController";
import { BolsaController } from "./controllers/BolsaController";
import { PecaCadastradaController } from "./controllers/PecaCadastradaController";

export async function appRoutes(app: FastifyInstance) {
    // Rotas para Setor
    app.get("/setor", SetorController.getSetores);
    app.get("/setor/:id", SetorController.getSetor);
    app.post("/setor", SetorController.createSetor);
    app.put("/setor/:id", SetorController.updateSetor);
    app.delete("/setor/:id", SetorController.deleteSetor);

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

    // Rotas para PecaCadastrada
    app.get("/peca", PecaCadastradaController.getPecas);
    app.get("/peca/:id", PecaCadastradaController.getPeca);
    app.post("/peca", PecaCadastradaController.createPeca);
    app.put("/peca/:id", PecaCadastradaController.updatePeca);
    app.delete("/peca/:id", PecaCadastradaController.deletePeca);
}
