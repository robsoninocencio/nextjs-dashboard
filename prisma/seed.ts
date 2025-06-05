import bcrypt from "bcryptjs";
import prisma from "@/prisma/lib/prisma";
import { z } from "zod";
import {
  usersData,
  clientesData,
  invoicesData,
  revenueData,
  bancosData,
  tiposData,
  ativosData,
  investimentosData,
} from "@/lib/placeholder-data";

/**
 * Função para semear a tabela 'users'.
 * Inclui hash de senha antes de criar/atualizar o registro.
 */
async function seedUsers() {
  console.log("Iniciando o seeding da tabela 'Users'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    const createdUsers = []; // Array para armazenar os users criados com seus IDs
    for (const u of usersData) {
      const users = await prisma.users.findUnique({
        where: { id: u.id },
      });

      if (!users) {
        createdCount++;
      } else {
        updatedCount++;
      }

      const hashedPassword = await bcrypt.hash(u.password, 10);
      const userWithHashedPassword = { ...u, password: hashedPassword };
      const result = await prisma.users.upsert({
        where: { email: userWithHashedPassword.email },
        update: {},
        create: userWithHashedPassword,
      });
      createdUsers.push(result); // Adiciona o cliente criado ao array
    }
    console.log(
      `Seeding da tabela 'Users' concluído com sucesso. Criados: ${createdCount}, Atualizados: ${updatedCount}.`
    );
    return createdUsers; // Retorna os clientes criados
  } catch (error) {
    console.error("Erro ao semear a tabela 'Users':", error);
    console.error(error);
    throw error;
  }
}

/**
 * Função para semear a tabela 'Clientes'.
 */
async function seedClientes(): Promise<any[]> {
  console.log("Iniciando o seeding da tabela 'Clientes'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    const createdClientes = []; // Array para armazenar os clientes criados com seus IDs
    for (const u of clientesData) {
      const clientes = await prisma.clientes.findUnique({
        where: { email: u.email },
      });

      if (!clientes) {
        createdCount++;
      } else {
        updatedCount++;
      }

      const result = await prisma.clientes.upsert({
        where: { email: u.email },
        update: {},
        create: {
          id: u.id,
          name: u.name,
          email: u.email,
        },
      });
      createdClientes.push(result); // Adiciona o cliente criado ao array
    }
    console.log(
      `Seeding da tabela 'Clientes' concluído com sucesso. Criados: ${createdCount}, Atualizados: ${updatedCount}.`
    );
    return createdClientes; // Retorna os clientes criados
  } catch (error) {
    console.error("Erro ao semear a tabela 'Clientes':", error);
    console.error(error);
    throw error;
  }
}

/**
 * Função para semear a tabela 'Invoices'.
 */
async function seedInvoices() {
  console.log("Iniciando o seeding da tabela 'Invoices'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    for (const i of invoicesData) {
      const invoices = await prisma.invoices.findFirst({
        where: { cliente_id: i.cliente_id, amount: i.amount, status: i.status },
      });

      if (!invoices) {
        createdCount++;
      } else {
        updatedCount++;
      }

      const result = await prisma.invoices.upsert({
        where: { id: i.id },
        update: {},
        create: {
          id: i.id,
          cliente_id: i.cliente_id, // Usando diretamente o cliente_id dos dados
          amount: i.amount,
          status: i.status,
          date: new Date(i.date),
        },
      });
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
async function seedRevenue() {
  console.log("Iniciando o seeding da tabela 'Revenue'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    for (const u of revenueData) {
      const revenue = await prisma.revenue.findUnique({
        where: { month: u.month },
      });

      if (!revenue) {
        createdCount++;
      } else {
        updatedCount++;
      }

      const result = await prisma.revenue.upsert({
        where: { month: u.month },
        update: { revenue: u.revenue },
        create: {
          month: u.month,
          revenue: u.revenue,
        },
      });
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
 * Função para semear a tabela 'Bancos'.
 */
async function seedBancos(): Promise<any[]> {
  console.log("Iniciando o seeding da tabela 'Bancos'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    const createdTipos = []; // Array para armazenar os bancos criados com seus IDs
    for (const u of bancosData) {
      const bancos = await prisma.bancos.findUnique({
        where: { id: u.id },
      });

      if (!bancos) {
        createdCount++;
      } else {
        updatedCount++;
      }

      const result = await prisma.bancos.upsert({
        where: { id: u.id },
        update: {},
        create: {
          id: u.id,
          nome: u.nome,
        },
      });
      createdTipos.push(result); // Adiciona o cliente criado ao array
    }
    console.log(
      `Seeding da tabela 'Bancos' concluído com sucesso. Criados: ${createdCount}, Atualizados: ${updatedCount}.`
    );
    return createdTipos; // Retorna os clientes criados
  } catch (error) {
    console.error("Erro ao semear a tabela 'Bancos':", error);
    console.error(error);
    throw error;
  }
}

/**
 * Função para semear a tabela 'Tipos'.
 */
async function seedTipos(): Promise<any[]> {
  console.log("Iniciando o seeding da tabela 'Tipos'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    const createdTipos = []; // Array para armazenar os tipos criados com seus IDs
    for (const u of tiposData) {
      const tipos = await prisma.tipos.findUnique({
        where: { id: u.id },
      });

      if (!tipos) {
        createdCount++;
      } else {
        updatedCount++;
      }

      const result = await prisma.tipos.upsert({
        where: { id: u.id },
        update: {},
        create: {
          id: u.id,
          nome: u.nome,
        },
      });
      createdTipos.push(result); // Adiciona o tipo criado ao array
    }
    console.log(
      `Seeding da tabela 'Tipos' concluído com sucesso. Criados: ${createdCount}, Atualizados: ${updatedCount}.`
    );
    return createdTipos; // Retorna os tipos criados
  } catch (error) {
    console.error("Erro ao semear a tabela 'Tipos':", error);
    console.error(error);
    throw error;
  }
}

async function seedAtivos() {
  console.log("Iniciando o seeding da tabela 'Ativos'...");
  try {
    let createdCount = 0;
    let updatedCount = 0;
    const createdAtivos = []; // Array para armazenar os ativos criados com seus IDs
    for (const i of ativosData) {
      const ativos = await prisma.ativos.findFirst({
        where: { id: i.id },
      });

      if (!ativos) {
        createdCount++;
      } else {
        updatedCount++;
      }

      const result = await prisma.ativos.upsert({
        where: { id: i.id },
        update: {},
        create: {
          id: i.id,
          nome: i.nome,
          tipoId: i.tipoId,
        },
      });
      createdAtivos.push(result); // Adiciona o ativo criado ao array
    }
    console.log(
      `Seeding da tabela 'Ativos' concluído com sucesso. Criados: ${createdCount}, Atualizados: ${updatedCount}.`
    );
    return createdAtivos; // Retorna os ativos criados
  } catch (error) {
    console.error("Erro ao semear a tabela 'Ativos':", error);
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
    await seedUsers();
    await seedClientes();
    await seedInvoices();
    await seedRevenue();
    await seedBancos();
    await seedTipos();
    await seedAtivos();
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
