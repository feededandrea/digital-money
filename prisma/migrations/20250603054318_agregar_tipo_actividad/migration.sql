/*
  Warnings:

  - Changed the type of `tipoActividad` on the `actividades` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "actividades" DROP COLUMN "tipoActividad",
ADD COLUMN     "tipoActividad" VARCHAR(30) NOT NULL;
