-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'TESTER', 'EARLY_ACCESS', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
