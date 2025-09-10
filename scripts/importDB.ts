import { readFileSync } from "fs";
import path from "path";
import prisma from "../prisma/lib/prisma"; // ajuste o caminho se necessário

async function importDB() {
  const inputDir = path.join(__dirname, "data");

  // ordem para respeitar as dependências
  const order = [
    "users",
    "tipos",
    "categorias",
    "bancos",
    "revenue",
    "ativos",
    "clientes",
    "invoices",
    "investimentos",
    "ativo_categoria",
  ];

  for (const model of order) {
    const filePath = path.join(inputDir, `${model}.json`);
    const data = JSON.parse(readFileSync(filePath, "utf-8"));

    if (!data || data.length === 0) {
      console.log(`🟡 Ignorado: ${model} (nenhum dado encontrado)`);
      continue;
    }

    await (prisma as any)[model].createMany({
      data,
      skipDuplicates: true,
    });
    console.log(`✅ Importado: ${model} (${data.length} registros)`);
  }

  await prisma.$disconnect();
}

importDB().catch((e) => {
  console.error(e);
  process.exit(1);
});

// pnpm tsx scripts/importDB.ts
