/*
  Warnings:

  - You are about to drop the column `featured` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Testimonial` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order]` on the table `Testimonial` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorImage` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorName` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorTitle` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Testimonial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "featured",
DROP COLUMN "image",
DROP COLUMN "message",
DROP COLUMN "name",
DROP COLUMN "role",
ADD COLUMN     "authorImage" TEXT NOT NULL,
ADD COLUMN     "authorName" TEXT NOT NULL,
ADD COLUMN     "authorTitle" TEXT NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "thumbUrl" TEXT NOT NULL,
    "thumb2xUrl" TEXT,
    "fullUrl" TEXT NOT NULL,
    "fullSize" TEXT NOT NULL,
    "projectUrl" TEXT,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Portfolio_order_idx" ON "Portfolio"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_order_key" ON "Portfolio"("order");

-- CreateIndex
CREATE INDEX "Client_order_idx" ON "Client"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Client_order_key" ON "Client"("order");

-- CreateIndex
CREATE INDEX "SocialLink_order_idx" ON "SocialLink"("order");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_order_key" ON "SocialLink"("order");

-- CreateIndex
CREATE INDEX "Testimonial_order_idx" ON "Testimonial"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Testimonial_order_key" ON "Testimonial"("order");
