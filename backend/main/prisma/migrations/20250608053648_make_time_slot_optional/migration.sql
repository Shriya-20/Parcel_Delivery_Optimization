-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_time_slot_id_fkey";

-- AlterTable
ALTER TABLE "Delivery" ALTER COLUMN "time_slot_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "TimeSlot"("time_slot_id") ON DELETE SET NULL ON UPDATE CASCADE;
