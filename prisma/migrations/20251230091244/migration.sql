/*
  Warnings:

  - Added the required column `authProvider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'KAKAO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" "AuthProvider" NOT NULL default 'LOCAL',
ALTER COLUMN "password" DROP NOT NULL;
