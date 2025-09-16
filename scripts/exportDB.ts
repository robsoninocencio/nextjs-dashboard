import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

async function exportDB() {
  const outputDir = path.join(__dirname, "data");

  // Garante que o diretório de saída exista
  mkdirSync(outputDir, { recursive: true });

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
    try {
      const data = await (prisma as any)[model].findMany();
      writeFileSync(
        path.join(outputDir, `${model}.json`),
        JSON.stringify(data, null, 2),
        "utf-8"
      );
      console.log(`✅ Exportado: ${model} (${data.length} registros)`);
    } catch (error) {
      console.error(`❌ Erro ao exportar ${model}:`, error);
      // O loop continuará para o próximo modelo
    }
  }

  await prisma.$disconnect();
}

exportDB().catch((e) => {
  console.error(e);
  process.exit(1);
});

// pnpm tsx scripts/exportDB.ts
