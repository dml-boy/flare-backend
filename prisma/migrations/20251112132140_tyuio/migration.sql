/*
  Warnings:

  - You are about to drop the column `icon` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the `About` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[order]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `iconClass` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "icon",
ADD COLUMN     "iconClass" TEXT NOT NULL,
ALTER COLUMN "order" DROP DEFAULT;

-- DropTable
DROP TABLE "About";

-- CreateTable
CREATE TABLE "AboutIntro" (
    "id" SERIAL NOT NULL,
    "subtitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrl" TEXT,

    CONSTRAINT "AboutIntro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutStep" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "aboutIntroId" INTEGER NOT NULL,

    CONSTRAINT "AboutStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Service_order_idx" ON "Service"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Service_order_key" ON "Service"("order");

-- AddForeignKey
ALTER TABLE "AboutStep" ADD CONSTRAINT "AboutStep_aboutIntroId_fkey" FOREIGN KEY ("aboutIntroId") REFERENCES "AboutIntro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
