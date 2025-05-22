-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('motorcycle', 'sedan', 'suv', 'van', 'truck');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('on_time', 'late', 'early', 'not_delivered');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('super_admin', 'regional_admin', 'standard');

-- CreateTable
CREATE TABLE "Driver" (
    "driver_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address" TEXT,
    "start_location" TEXT,
    "refresh_token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("driver_id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "vehicle_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "company" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("vehicle_id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "time_slot_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("time_slot_id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "delivery_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "size" TEXT NOT NULL,
    "delivery_instructions" TEXT,
    "time_slot_id" TEXT NOT NULL,
    "dropoff_location" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("delivery_id")
);

-- CreateTable
CREATE TABLE "DeliveryQueue" (
    "queue_id" TEXT NOT NULL,
    "delivery_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "position" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryQueue_pkey" PRIMARY KEY ("queue_id")
);

-- CreateTable
CREATE TABLE "OrderHistory" (
    "order_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "delivery_id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "delivery_duration" INTEGER,
    "delivery_distance" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderHistory_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Route" (
    "route_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "delivery_id" TEXT NOT NULL,
    "route_details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("route_id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "assignment_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "delivery_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "route_id" TEXT NOT NULL,
    "sequence_order" INTEGER,
    "expected_arrival_time" TIMESTAMP(3),

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'standard',
    "region" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "DriverLocation" (
    "location_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "speed" DOUBLE PRECISION,
    "heading" INTEGER,
    "battery_level" INTEGER,

    CONSTRAINT "DriverLocation_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "feedback_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("feedback_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE INDEX "idx_driver_email" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_license_plate_key" ON "Vehicle"("license_plate");

-- CreateIndex
CREATE INDEX "idx_vehicle_driver_id" ON "Vehicle"("driver_id");

-- CreateIndex
CREATE INDEX "idx_timeslot_start_end" ON "TimeSlot"("start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "idx_customer_email" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "idx_delivery_customer_id" ON "Delivery"("customer_id");

-- CreateIndex
CREATE INDEX "idx_delivery_time_slot_id" ON "Delivery"("time_slot_id");

-- CreateIndex
CREATE INDEX "idx_order_history_customer_id" ON "OrderHistory"("customer_id");

-- CreateIndex
CREATE INDEX "idx_order_history_driver_id" ON "OrderHistory"("driver_id", "date");

-- CreateIndex
CREATE INDEX "idx_route_driver_id" ON "Route"("driver_id", "createdAt");

-- CreateIndex
CREATE INDEX "idx_assignment_driver_id" ON "Assignment"("driver_id", "assigned_at");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "DriverLocation_driver_id_timestamp_idx" ON "DriverLocation"("driver_id", "timestamp");

-- CreateIndex
CREATE INDEX "idx_feedback_driver_id" ON "Feedback"("driver_id");

-- CreateIndex
CREATE INDEX "idx_feedback_customer_id" ON "Feedback"("customer_id");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "TimeSlot"("time_slot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryQueue" ADD CONSTRAINT "DeliveryQueue_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "Delivery"("delivery_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryQueue" ADD CONSTRAINT "DeliveryQueue_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "Delivery"("delivery_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "Delivery"("delivery_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "Delivery"("delivery_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("route_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverLocation" ADD CONSTRAINT "DriverLocation_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;
