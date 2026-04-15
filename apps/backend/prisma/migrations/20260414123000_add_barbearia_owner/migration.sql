-- AlterTable
ALTER TABLE "public"."Barbearia"
ADD COLUMN IF NOT EXISTS "usuarioId" INTEGER;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Barbearia_usuarioId_fkey'
    ) THEN
        ALTER TABLE "public"."Barbearia"
        ADD CONSTRAINT "Barbearia_usuarioId_fkey"
        FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
