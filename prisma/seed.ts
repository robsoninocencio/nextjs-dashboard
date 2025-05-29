import bcrypt from "bcryptjs";
import prisma from "@/prisma/lib/prisma";
import {
  UserData,
  usersData,
  customersData,
  invoicesData,
  revenueData,
} from "@/app/lib/placeholder-data";

/**
 * Função para semear a tabela 'User'.
 * Utiliza upsert para evitar duplicatas e cria registros se não existirem.
 */
async function seedUser() {
  console.log("Iniciando o seeding da tabela 'User'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    for (const u of UserData) {
      const result = await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: u,
      });
      if ((result as any).createdAt === (result as any).updatedAt) {
        createdCount++;
      } else {
        updatedCount++;
      }
    }
    console.log(
      `Seeding da tabela 'User' concluído com sucesso. Criados: ${createdCount}, Atualizados: ${updatedCount}.`
    );
  } catch (error) {
    console.error("Erro ao semear a tabela 'User':", error);
    console.error(error);
    throw error;
  }
}

/**
 * Função para semear a tabela 'users'.
 * Inclui hash de senha antes de criar/atualizar o registro.
 */
async function seedusers() {
  console.log("Iniciando o seeding da tabela 'Users'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    for (const u of usersData) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const userWithHashedPassword = { ...u, password: hashedPassword };
      const result = await prisma.users.upsert({
        where: { email: userWithHashedPassword.email },
        update: {},
        create: userWithHashedPassword,
      });
      if ((result as any).createdAt === (result as any).updatedAt) {
        createdCount++;
      } else {
        updatedCount++;
      }
    }
    console.log(
      `Seeding da tabela 'Users' concluído com sucesso. Criados: ${createdCount}, Atualizados: ${updatedCount}.`
    );
  } catch (error) {
    console.error("Erro ao semear a tabela 'Users':", error);
    console.error(error);
    throw error;
  }
}

/**
 * Função para semear a tabela 'Customers'.
 */
async function seedcustomers(): Promise<any[]> {
  // Define o tipo de retorno como Promise<any[]>
  console.log("Iniciando o seeding da tabela 'Customers'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    const createdCustomers = []; // Array para armazenar os clientes criados com seus IDs
    for (const u of customersData) {
      const result = await prisma.customers.upsert({
        where: { email: u.email },
        update: {},
        create: {
          id: u.id,
          name: u.name,
          email: u.email,
          image_url: u.image_url,
        },
      });
      createdCustomers.push(result); // Adiciona o cliente criado ao array
      if ((result as any).createdAt === (result as any).updatedAt) {
        createdCount++;
      } else {
        updatedCount++;
      }
    }
    console.log(
      `Seeding da tabela 'Customers' concluído com sucesso. Criados: ${createdCount}, Atualizados: ${updatedCount}.`
    );
    return createdCustomers; // Retorna os clientes criados
  } catch (error) {
    console.error("Erro ao semear a tabela 'Customers':", error);
    console.error(error);
    throw error;
  }
}

/**
 * Função para semear a tabela 'Invoices'.
 */
async function seedinvoices() {
  console.log("Iniciando o seeding da tabela 'Invoices'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    for (const i of invoicesData) {
      const result = await prisma.invoices.upsert({
        where: { id: i.id },
        update: {},
        create: {
          id: i.id,
          customer_id: i.customer_id, // Usando diretamente o customer_id dos dados
          amount: i.amount,
          status: i.status,
          date: new Date(i.date),
        },
      });
      if ((result as any).createdAt === (result as any).updatedAt) {
        createdCount++;
      } else {
        updatedCount++;
      }
    }
    console.log(
      `Seeding da tabela 'Invoices' concluído com sucesso. Criados: ${createdCount}, Atualizados: ${updatedCount}.`
    );
  } catch (error) {
    console.error("Erro ao semear a tabela 'Invoices':", error);
    console.error(error);
    throw error;
  }
}

/**
 * Função para semear a tabela 'Revenue'.
 */
async function seedrevenue() {
  console.log("Iniciando o seeding da tabela 'Revenue'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    for (const u of revenueData) {
      const result = await prisma.revenue.upsert({
        where: { month: u.month },
        update: { revenue: u.revenue },
        create: {
          month: u.month,
          revenue: u.revenue,
        },
      });
      if ((result as any).createdAt === (result as any).updatedAt) {
        createdCount++;
      } else {
        updatedCount++;
      }
    }
    console.log(
      `Seeding da tabela 'Revenue' concluído com sucesso. Criados: ${createdCount}, Atualizados: ${updatedCount}.`
    );
  } catch (error) {
    console.error("Erro ao semear a tabela 'Revenue':", error);
    console.error(error);
    throw error;
  }
}

/**
 * Função principal para executar todos os processos de seeding.
 */
export async function main() {
  console.log("Iniciando o processo de seeding...");
  try {
    await seedcustomers();
    await seedUser();
    await seedusers();
    await seedinvoices(); // Chamada sem argumentos
    await seedrevenue();
    console.log("Todos os processos de seeding concluídos com sucesso!");
  } catch (error) {
    console.error("Erro durante o processo de seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executa a função principal quando o script é chamado
main()
  .then(() => console.log("Seed completo."))
  .catch((e) => console.error(e));
