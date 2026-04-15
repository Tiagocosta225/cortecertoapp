-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."Plano" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "periodo" TEXT NOT NULL DEFAULT 'mensal',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."Assinatura" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "planoId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'trialing',
    "gateway" TEXT NOT NULL DEFAULT 'asaas',
    "gatewayCustomerId" TEXT,
    "gatewaySubscriptionId" TEXT,
    "gatewayCheckoutId" TEXT,
    "checkoutUrl" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "trialEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assinatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."Pagamento" (
    "id" SERIAL NOT NULL,
    "assinaturaId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "valor" DOUBLE PRECISION NOT NULL,
    "gateway" TEXT NOT NULL DEFAULT 'asaas',
    "gatewayPaymentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "rawEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Plano_codigo_key" ON "public"."Plano"("codigo");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Assinatura_usuarioId_idx" ON "public"."Assinatura"("usuarioId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Assinatura_status_idx" ON "public"."Assinatura"("status");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Pagamento_gatewayPaymentId_key" ON "public"."Pagamento"("gatewayPaymentId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Pagamento_assinaturaId_idx" ON "public"."Pagamento"("assinaturaId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Pagamento_status_idx" ON "public"."Pagamento"("status");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Assinatura_usuarioId_fkey'
    ) THEN
        ALTER TABLE "public"."Assinatura"
        ADD CONSTRAINT "Assinatura_usuarioId_fkey"
        FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Assinatura_planoId_fkey'
    ) THEN
        ALTER TABLE "public"."Assinatura"
        ADD CONSTRAINT "Assinatura_planoId_fkey"
        FOREIGN KEY ("planoId") REFERENCES "public"."Plano"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Pagamento_assinaturaId_fkey'
    ) THEN
        ALTER TABLE "public"."Pagamento"
        ADD CONSTRAINT "Pagamento_assinaturaId_fkey"
        FOREIGN KEY ("assinaturaId") REFERENCES "public"."Assinatura"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Seed default SaaS plan.
INSERT INTO "public"."Plano" ("codigo", "nome", "descricao", "preco", "periodo", "ativo", "updatedAt")
VALUES (
    'profissional-mensal',
    'Profissional Mensal',
    'Plano mensal do CorteCertoApp para um perfil dono de barbearia.',
    39.90,
    'mensal',
    true,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("codigo") DO UPDATE SET
    "nome" = EXCLUDED."nome",
    "descricao" = EXCLUDED."descricao",
    "preco" = EXCLUDED."preco",
    "periodo" = EXCLUDED."periodo",
    "ativo" = EXCLUDED."ativo",
    "updatedAt" = CURRENT_TIMESTAMP;

-- Existing users receive a 7-day trial when the billing schema is introduced.
INSERT INTO "public"."Assinatura" (
    "usuarioId",
    "planoId",
    "status",
    "gateway",
    "currentPeriodStart",
    "currentPeriodEnd",
    "trialEndsAt",
    "updatedAt"
)
SELECT
    u."id",
    p."id",
    'trialing',
    'asaas',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    CURRENT_TIMESTAMP
FROM "public"."Usuario" u
CROSS JOIN "public"."Plano" p
WHERE p."codigo" = 'profissional-mensal'
AND NOT EXISTS (
    SELECT 1 FROM "public"."Assinatura" a WHERE a."usuarioId" = u."id"
);
