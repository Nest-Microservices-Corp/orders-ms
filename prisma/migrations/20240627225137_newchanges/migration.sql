/*
  Warnings:

  - A unique constraint covering the columns `[stripePaymentId]` on the table `OrderReceipt` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripePaymentId` to the `OrderReceipt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderReceipt" ADD COLUMN     "stripePaymentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrderReceipt_stripePaymentId_key" ON "OrderReceipt"("stripePaymentId");
