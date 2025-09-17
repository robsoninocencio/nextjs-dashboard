import { readFileSync } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

// Regex para identificar strings de data no formato ISO 8601
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

async function importDB() {
  const inputDir = path.join(__dirname, "data");

  // A ordem de importação é crucial para respeitar as chaves estrangeiras.
  // Modelos sem dependências (ou com dependências opcionais) vêm primeiro.
  // Modelos que dependem de outros vêm depois.
  // Ex: 'invoices' depende de 'clientes', então 'clientes' deve vir antes.
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

    // Usamos um "reviver" para converter strings de data ISO de volta para objetos Date.
    // Isso garante que os tipos de dados correspondam ao schema do Prisma.
    const data = JSON.parse(readFileSync(filePath, "utf-8"), (key, value) => {
      if (typeof value === "string" && isoDateRegex.test(value)) {
        return new Date(value);
      }
      return value;
    });

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
