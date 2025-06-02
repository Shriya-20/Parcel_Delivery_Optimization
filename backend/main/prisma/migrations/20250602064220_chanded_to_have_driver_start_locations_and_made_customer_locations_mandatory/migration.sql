/*
  Warnings:

  - Made the column `latitude` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_location` on table `Driver` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "start_location_latitude" DOUBLE PRECISION,
ADD COLUMN     "start_location_longitude" DOUBLE PRECISION,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "start_location" SET NOT NULL;
