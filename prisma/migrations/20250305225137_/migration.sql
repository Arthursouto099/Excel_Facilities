/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "contact" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "cpf" TEXT NOT NULL DEFAULT '333.333.333-33',
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'state';

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");
