-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cliente_id" UUID NOT NULL,
    "usersId" UUID,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investimentos" (
    "id" UUID NOT NULL,
    "data" DATE NOT NULL,
    "ano" VARCHAR(4) NOT NULL,
    "mes" VARCHAR(2) NOT NULL,
    "rendimentoDoMes" INTEGER NOT NULL,
    "dividendosDoMes" INTEGER NOT NULL,
    "valorAplicado" INTEGER NOT NULL,
    "saldoBruto" INTEGER NOT NULL,
    "percentualDeCrescimentoSaldoBruto" DOUBLE PRECISION,
    "valorResgatado" INTEGER NOT NULL,
    "impostoIncorrido" INTEGER NOT NULL,
    "impostoPrevisto" INTEGER NOT NULL,
    "saldoLiquido" INTEGER NOT NULL,
    "percentualDeCrescimentoSaldoLiquido" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clienteId" UUID NOT NULL,
    "bancoId" UUID NOT NULL,
    "ativoId" UUID NOT NULL,
    "userId" UUID,

    CONSTRAINT "investimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ativos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tipoId" UUID,

    CONSTRAINT "ativos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bancos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue" (
    "month" VARCHAR(4) NOT NULL,
    "revenue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenue_pkey" PRIMARY KEY ("month")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE INDEX "clientes_name_idx" ON "clientes"("name");

-- CreateIndex
CREATE INDEX "clientes_email_idx" ON "clientes"("email");

-- CreateIndex
CREATE INDEX "clientes_userId_idx" ON "clientes"("userId");

-- CreateIndex
CREATE INDEX "invoices_cliente_id_idx" ON "invoices"("cliente_id");

-- CreateIndex
CREATE INDEX "invoices_cliente_id_date_idx" ON "invoices"("cliente_id", "date");

-- CreateIndex
CREATE INDEX "invoices_usersId_idx" ON "invoices"("usersId");

-- CreateIndex
CREATE INDEX "investimentos_ano_idx" ON "investimentos"("ano");

-- CreateIndex
CREATE INDEX "investimentos_mes_idx" ON "investimentos"("mes");

-- CreateIndex
CREATE INDEX "investimentos_clienteId_idx" ON "investimentos"("clienteId");

-- CreateIndex
CREATE INDEX "investimentos_bancoId_idx" ON "investimentos"("bancoId");

-- CreateIndex
CREATE INDEX "investimentos_ativoId_idx" ON "investimentos"("ativoId");

-- CreateIndex
CREATE INDEX "investimentos_ano_mes_clienteId_idx" ON "investimentos"("ano", "mes", "clienteId");

-- CreateIndex
CREATE INDEX "investimentos_ano_mes_clienteId_bancoId_idx" ON "investimentos"("ano", "mes", "clienteId", "bancoId");

-- CreateIndex
CREATE INDEX "investimentos_ano_mes_clienteId_bancoId_ativoId_idx" ON "investimentos"("ano", "mes", "clienteId", "bancoId", "ativoId");

-- CreateIndex
CREATE INDEX "investimentos_userId_idx" ON "investimentos"("userId");

-- CreateIndex
CREATE INDEX "ativos_tipoId_idx" ON "ativos"("tipoId");

-- CreateIndex
CREATE INDEX "ativos_nome_idx" ON "ativos"("nome");

-- CreateIndex
CREATE INDEX "tipos_nome_idx" ON "tipos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "bancos_nome_key" ON "bancos"("nome");

-- CreateIndex
CREATE INDEX "bancos_nome_idx" ON "bancos"("nome");

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investimentos" ADD CONSTRAINT "investimentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investimentos" ADD CONSTRAINT "investimentos_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investimentos" ADD CONSTRAINT "investimentos_ativoId_fkey" FOREIGN KEY ("ativoId") REFERENCES "ativos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investimentos" ADD CONSTRAINT "investimentos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ativos" ADD CONSTRAINT "ativos_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "tipos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
