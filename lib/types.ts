import { Prisma, investimentos } from '@prisma/client';

// 1. Tipo base para Investimento, diretamente do modelo Prisma
//    O nome do tipo corresponde ao nome do modelo no schema.prisma: 'investimentos'.
export type Investimento = investimentos;

// 2. Tipo para Investimento com relações, correspondendo exatamente ao payload
//    retornado por `fetchFilteredInvestimentos`.
//    O nome do tipo corresponde ao nome do modelo no schema.prisma: 'investimentosGetPayload'.
export type InvestimentoCompleto = Prisma.investimentosGetPayload<{
  include: {
    clientes: {
      select: {
        name: true;
      };
    };
    bancos: {
      select: {
        nome: true;
      };
    };
    ativos: {
      select: {
        nome: true;
        tipos: {
          select: {
            nome: true;
          };
        };
        ativo_categorias: {
          select: {
            categoria: {
              select: { id: true; nome: true };
            };
          };
        };
      };
    };
  };
}>;
