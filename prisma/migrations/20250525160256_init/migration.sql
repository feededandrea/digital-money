/*
  Warnings:

  - You are about to drop the column `correo` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `cuit` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "actividades" ADD COLUMN     "usuarioTransferenciaId" INTEGER;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "correo",
ADD COLUMN     "cuit" VARCHAR(50) NOT NULL,
ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ADD COLUMN     "telefono" VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE "tarjetas" (
    "id" SERIAL NOT NULL,
    "numero" VARCHAR(16) NOT NULL,
    "titular" VARCHAR(100) NOT NULL,
    "vencimiento" DATE NOT NULL,
    "cvv" VARCHAR(3) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,

    CONSTRAINT "tarjetas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "actividades" ADD CONSTRAINT "actividades_usuarioTransferenciaId_fkey" FOREIGN KEY ("usuarioTransferenciaId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarjetas" ADD CONSTRAINT "tarjetas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
