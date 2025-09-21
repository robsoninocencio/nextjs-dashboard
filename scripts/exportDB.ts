import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

async function exportDB() {
  const outputDir = path.join(__dirname, 'data');

  // Garante que o diretório de saída exista
  mkdirSync(outputDir, { recursive: true });

  // Obtém os nomes dos modelos dinamicamente do Prisma Client.
  // Isso torna o script robusto a mudanças no schema.
  const modelNames = Object.values(Prisma.ModelName);

  console.log(`📦 Exportando dados para os modelos: ${modelNames.join(', ')}`);

  for (const modelName of modelNames) {
    try {
      // O uso de `(prisma as any)` é uma forma pragmática de acessar os modelos dinamicamente.
      const data = await (prisma as any)[modelName].findMany();

      if (data.length === 0) {
        console.log(`🟡 Ignorado: ${modelName} (nenhum registro encontrado)`);
        continue;
      }

      writeFileSync(
        path.join(outputDir, `${modelName}.json`),
        JSON.stringify(data, null, 2),
        'utf-8'
      );
      console.log(`✅ Exportado: ${modelName} (${data.length} registros)`);
    } catch (error) {
      console.error(`❌ Erro ao exportar ${modelName}:`, error);
      // O loop continuará para o próximo modelo
    }
  }

  await prisma.$disconnect();
}

exportDB().catch(e => {
  console.error(e);
  process.exit(1);
});

// pnpm tsx scripts/exportDB.ts
