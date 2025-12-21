-- AlterTable
ALTER TABLE "Bolsa" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Bolsa" ADD CONSTRAINT "Bolsa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
