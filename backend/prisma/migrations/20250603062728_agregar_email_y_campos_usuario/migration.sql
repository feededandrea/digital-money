/*
  Warnings:

  - You are about to drop the column `correo` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `tipoActividad` to the `actividades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuit` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "actividades" ADD COLUMN     "tipoActividad" VARCHAR(30) NOT NULL,
ADD COLUMN     "usuarioTransferenciaId" INTEGER;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "correo",
ADD COLUMN     "cuit" VARCHAR(50) NOT NULL,
ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ADD COLUMN     "telefono" VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE "TarjetaActividad" (
    "id" SERIAL NOT NULL,
    "actividadId" INTEGER NOT NULL,
    "tarjetaId" INTEGER NOT NULL,

    CONSTRAINT "TarjetaActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferenciaActividad" (
    "id" SERIAL NOT NULL,
    "actividadId" INTEGER NOT NULL,
    "cvuDestino" VARCHAR(50) NOT NULL,
    "banco" TEXT,

    CONSTRAINT "TransferenciaActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagoServicioActividad" (
    "id" SERIAL NOT NULL,
    "actividadId" INTEGER NOT NULL,
    "servicioId" INTEGER NOT NULL,
    "nombreServicio" VARCHAR(100) NOT NULL,

    CONSTRAINT "PagoServicioActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagoExternoActividad" (
    "id" SERIAL NOT NULL,
    "actividadId" INTEGER NOT NULL,
    "cvuDestino" TEXT NOT NULL,
    "alias" TEXT,

    CONSTRAINT "PagoExternoActividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarjetas" (
    "id" SERIAL NOT NULL,
    "numero" VARCHAR(16) NOT NULL,
    "titular" VARCHAR(100) NOT NULL,
    "vencimiento" DATE NOT NULL,
    "cvv" VARCHAR(3) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saldoDisponible" DECIMAL(10,2) NOT NULL DEFAULT 100000.00,
    "usuarioId" INTEGER,

    CONSTRAINT "tarjetas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TarjetaActividad_actividadId_key" ON "TarjetaActividad"("actividadId");

-- CreateIndex
CREATE UNIQUE INDEX "TransferenciaActividad_actividadId_key" ON "TransferenciaActividad"("actividadId");

-- CreateIndex
CREATE UNIQUE INDEX "PagoServicioActividad_actividadId_key" ON "PagoServicioActividad"("actividadId");

-- CreateIndex
CREATE UNIQUE INDEX "PagoExternoActividad_actividadId_key" ON "PagoExternoActividad"("actividadId");

-- AddForeignKey
ALTER TABLE "actividades" ADD CONSTRAINT "actividades_usuarioTransferenciaId_fkey" FOREIGN KEY ("usuarioTransferenciaId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TarjetaActividad" ADD CONSTRAINT "TarjetaActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "actividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferenciaActividad" ADD CONSTRAINT "TransferenciaActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "actividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoServicioActividad" ADD CONSTRAINT "PagoServicioActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "actividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoExternoActividad" ADD CONSTRAINT "PagoExternoActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "actividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarjetas" ADD CONSTRAINT "tarjetas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
