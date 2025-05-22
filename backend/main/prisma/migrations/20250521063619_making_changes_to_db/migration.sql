/*
  Warnings:

  - A unique constraint covering the columns `[driver_id,delivery_id]` on the table `DeliveryQueue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[driver_id]` on the table `DriverLocation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DeliveryQueue" ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryQueue_driver_id_delivery_id_key" ON "DeliveryQueue"("driver_id", "delivery_id");

-- CreateIndex
CREATE UNIQUE INDEX "DriverLocation_driver_id_key" ON "DriverLocation"("driver_id");
