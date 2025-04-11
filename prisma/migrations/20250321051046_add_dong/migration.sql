/*
  Warnings:

  - Added the required column `dong` to the `Apartment_Marker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Apartment_Marker` ADD COLUMN `dong` VARCHAR(191) NOT NULL;
