-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clientes" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoices" (
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
CREATE TABLE "public"."investimentos" (
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
CREATE TABLE "public"."tipos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ativos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tipoId" UUID,

    CONSTRAINT "ativos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ativo_categoria" (
    "ativoId" UUID NOT NULL,
    "categoriaId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ativo_categoria_pkey" PRIMARY KEY ("ativoId","categoriaId")
);

-- CreateTable
CREATE TABLE "public"."categorias" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "parentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bancos" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."revenue" (
    "month" VARCHAR(4) NOT NULL,
    "revenue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenue_pkey" PRIMARY KEY ("month")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "public"."clientes"("email");

-- CreateIndex
CREATE INDEX "clientes_name_idx" ON "public"."clientes"("name");

-- CreateIndex
CREATE INDEX "clientes_email_idx" ON "public"."clientes"("email");

-- CreateIndex
CREATE INDEX "clientes_userId_idx" ON "public"."clientes"("userId");

-- CreateIndex
CREATE INDEX "invoices_cliente_id_idx" ON "public"."invoices"("cliente_id");

-- CreateIndex
CREATE INDEX "invoices_cliente_id_date_idx" ON "public"."invoices"("cliente_id", "date");

-- CreateIndex
CREATE INDEX "invoices_usersId_idx" ON "public"."invoices"("usersId");

-- CreateIndex
CREATE INDEX "investimentos_ano_idx" ON "public"."investimentos"("ano");

-- CreateIndex
CREATE INDEX "investimentos_mes_idx" ON "public"."investimentos"("mes");

-- CreateIndex
CREATE INDEX "investimentos_clienteId_idx" ON "public"."investimentos"("clienteId");

-- CreateIndex
CREATE INDEX "investimentos_bancoId_idx" ON "public"."investimentos"("bancoId");

-- CreateIndex
CREATE INDEX "investimentos_ativoId_idx" ON "public"."investimentos"("ativoId");

-- CreateIndex
CREATE INDEX "investimentos_ano_mes_clienteId_idx" ON "public"."investimentos"("ano", "mes", "clienteId");

-- CreateIndex
CREATE INDEX "investimentos_ano_mes_clienteId_bancoId_idx" ON "public"."investimentos"("ano", "mes", "clienteId", "bancoId");

-- CreateIndex
CREATE INDEX "investimentos_ano_mes_clienteId_bancoId_ativoId_idx" ON "public"."investimentos"("ano", "mes", "clienteId", "bancoId", "ativoId");

-- CreateIndex
CREATE INDEX "investimentos_userId_idx" ON "public"."investimentos"("userId");

-- CreateIndex
CREATE INDEX "tipos_nome_idx" ON "public"."tipos"("nome");

-- CreateIndex
CREATE INDEX "ativos_tipoId_idx" ON "public"."ativos"("tipoId");

-- CreateIndex
CREATE INDEX "ativos_nome_idx" ON "public"."ativos"("nome");

-- CreateIndex
CREATE INDEX "ativo_categoria_ativoId_idx" ON "public"."ativo_categoria"("ativoId");

-- CreateIndex
CREATE INDEX "ativo_categoria_categoriaId_idx" ON "public"."ativo_categoria"("categoriaId");

-- CreateIndex
CREATE INDEX "categorias_nome_idx" ON "public"."categorias"("nome");

-- CreateIndex
CREATE INDEX "categorias_parentId_idx" ON "public"."categorias"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "bancos_nome_key" ON "public"."bancos"("nome");

-- CreateIndex
CREATE INDEX "bancos_nome_idx" ON "public"."bancos"("nome");

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."investimentos" ADD CONSTRAINT "investimentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."investimentos" ADD CONSTRAINT "investimentos_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "public"."bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."investimentos" ADD CONSTRAINT "investimentos_ativoId_fkey" FOREIGN KEY ("ativoId") REFERENCES "public"."ativos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."investimentos" ADD CONSTRAINT "investimentos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ativos" ADD CONSTRAINT "ativos_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "public"."tipos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ativo_categoria" ADD CONSTRAINT "ativo_categoria_ativoId_fkey" FOREIGN KEY ("ativoId") REFERENCES "public"."ativos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ativo_categoria" ADD CONSTRAINT "ativo_categoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categorias" ADD CONSTRAINT "categorias_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
