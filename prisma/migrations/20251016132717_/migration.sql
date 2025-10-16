-- CreateTable
CREATE TABLE "Setor" (
    "setorId" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Setor_pkey" PRIMARY KEY ("setorId")
);

-- CreateTable
CREATE TABLE "Fornecedora" (
    "fornecedoraId" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,

    CONSTRAINT "Fornecedora_pkey" PRIMARY KEY ("fornecedoraId")
);

-- CreateTable
CREATE TABLE "Bolsa" (
    "bolsaId" SERIAL NOT NULL,
    "dataDeEntrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataMensagem" TIMESTAMP(3),
    "quantidadeDePecasSemCadastro" INTEGER NOT NULL,
    "observacoes" TEXT,
    "fornecedoraId" INTEGER NOT NULL,
    "setorId" INTEGER NOT NULL,

    CONSTRAINT "Bolsa_pkey" PRIMARY KEY ("bolsaId")
);

-- CreateTable
CREATE TABLE "PecaCadastrada" (
    "pecaCadastradaId" SERIAL NOT NULL,
    "codigoDaPeca" TEXT NOT NULL,
    "bolsaId" INTEGER NOT NULL,

    CONSTRAINT "PecaCadastrada_pkey" PRIMARY KEY ("pecaCadastradaId")
);

-- AddForeignKey
ALTER TABLE "Bolsa" ADD CONSTRAINT "Bolsa_fornecedoraId_fkey" FOREIGN KEY ("fornecedoraId") REFERENCES "Fornecedora"("fornecedoraId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bolsa" ADD CONSTRAINT "Bolsa_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("setorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PecaCadastrada" ADD CONSTRAINT "PecaCadastrada_bolsaId_fkey" FOREIGN KEY ("bolsaId") REFERENCES "Bolsa"("bolsaId") ON DELETE RESTRICT ON UPDATE CASCADE;
