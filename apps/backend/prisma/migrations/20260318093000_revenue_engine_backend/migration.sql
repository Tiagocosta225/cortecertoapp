-- AlterTable
ALTER TABLE "public"."Barbearia"
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "whatsappLink" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "ativa" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "aceitaReservaPix" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "taxaReservaPadrao" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "tempoRetornoDias" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "metaSemanal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "public"."Barbearia"
SET "slug" = lower(regexp_replace("nome", '[^a-zA-Z0-9]+', '-', 'g'));

ALTER TABLE "public"."Barbearia"
ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Barbearia_slug_key" ON "public"."Barbearia"("slug");

-- AlterTable
ALTER TABLE "public"."Cliente"
ADD COLUMN     "aceitaWhatsapp" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "statusRelacionamento" TEXT NOT NULL DEFAULT 'ativo',
ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "origem" TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN     "ultimaVisita" TIMESTAMP(3),
ADD COLUMN     "totalGasto" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "visitas" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Servico"
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "destaqueLink" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ordemLink" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "depositoAntecipado" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "categoria" TEXT NOT NULL DEFAULT 'servico',
ADD COLUMN     "tempoRetornoDias" INTEGER;

-- AlterTable
ALTER TABLE "public"."Agendamento"
ADD COLUMN     "valorServico" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "valorReserva" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "statusPagamento" TEXT NOT NULL DEFAULT 'pendente',
ADD COLUMN     "formaPagamentoReserva" TEXT,
ADD COLUMN     "origem" TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN     "compareceu" BOOLEAN,
ADD COLUMN     "confirmadoWhatsapp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "barbeiroNome" TEXT,
ADD COLUMN     "observacoes" TEXT;
