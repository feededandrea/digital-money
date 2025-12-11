/*
  Warnings:

  - Added the required column `tipoActividad` to the `actividades` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
-- Crear el tipo ENUM si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipoactividad') THEN
        CREATE TYPE "TipoActividad" AS ENUM ('TARJETA', 'TRANSFERENCIA', 'PAGO_SERVICIO', 'PAGO_USUARIO', 'PAGO_EXTERNO');
    END IF;
END
$$;

-- 1. Agregar la columna tipoActividad con tipo ENUM nullable
ALTER TABLE "actividades"
ADD COLUMN "tipoActividad" "TipoActividad";

-- 2. Actualizar las filas existentes para poner valor por defecto
UPDATE "actividades" SET "tipoActividad" = 'PAGO_EXTERNO' WHERE "tipoActividad" IS NULL;

-- 3. Cambiar la columna a NOT NULL
ALTER TABLE "actividades"
ALTER COLUMN "tipoActividad" SET NOT NULL;

-- 3. Cambiar la columna a NOT NULL
ALTER TABLE "actividades"
ALTER COLUMN "tipoActividad" SET NOT NULL;


-- AlterTable
ALTER TABLE "tarjetas" ADD COLUMN     "saldoDisponible" DECIMAL(10,2) NOT NULL DEFAULT 100000.00;

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

-- CreateIndex
CREATE UNIQUE INDEX "TarjetaActividad_actividadId_key" ON "TarjetaActividad"("actividadId");

-- CreateIndex
CREATE UNIQUE INDEX "TransferenciaActividad_actividadId_key" ON "TransferenciaActividad"("actividadId");

-- CreateIndex
CREATE UNIQUE INDEX "PagoServicioActividad_actividadId_key" ON "PagoServicioActividad"("actividadId");

-- CreateIndex
CREATE UNIQUE INDEX "PagoExternoActividad_actividadId_key" ON "PagoExternoActividad"("actividadId");

-- AddForeignKey
ALTER TABLE "TarjetaActividad" ADD CONSTRAINT "TarjetaActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "actividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferenciaActividad" ADD CONSTRAINT "TransferenciaActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "actividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoServicioActividad" ADD CONSTRAINT "PagoServicioActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "actividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoExternoActividad" ADD CONSTRAINT "PagoExternoActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "actividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
