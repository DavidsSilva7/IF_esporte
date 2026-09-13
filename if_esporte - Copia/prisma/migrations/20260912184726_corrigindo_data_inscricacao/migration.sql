/*
  Warnings:

  - You are about to drop the column `dataIncricao` on the `Inscricao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inscricao" DROP COLUMN "dataIncricao",
ADD COLUMN     "dataInscricao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
