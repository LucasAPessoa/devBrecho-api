/*
  Warnings:

  - Made the column `bolsaId` on table `PecaCadastrada` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."PecaCadastrada" DROP CONSTRAINT "PecaCadastrada_bolsaId_fkey";

-- AlterTable
ALTER TABLE "PecaCadastrada" ALTER COLUMN "bolsaId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PecaCadastrada" ADD CONSTRAINT "PecaCadastrada_bolsaId_fkey" FOREIGN KEY ("bolsaId") REFERENCES "Bolsa"("bolsaId") ON DELETE RESTRICT ON UPDATE CASCADE;
