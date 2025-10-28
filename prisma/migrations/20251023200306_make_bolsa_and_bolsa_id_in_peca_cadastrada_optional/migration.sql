-- DropForeignKey
ALTER TABLE "public"."PecaCadastrada" DROP CONSTRAINT "PecaCadastrada_bolsaId_fkey";

-- AlterTable
ALTER TABLE "PecaCadastrada" ALTER COLUMN "bolsaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PecaCadastrada" ADD CONSTRAINT "PecaCadastrada_bolsaId_fkey" FOREIGN KEY ("bolsaId") REFERENCES "Bolsa"("bolsaId") ON DELETE SET NULL ON UPDATE CASCADE;
