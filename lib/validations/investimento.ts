import { z } from "zod";

// Schema base para investimento
export const investimentoSchema = z.object({
  data: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Data inválida",
    })
    .refine(
      (date) => {
        const parsedDate = new Date(date);
        return parsedDate <= new Date();
      },
      {
        message: "Data não pode ser no futuro",
      }
    ),

  ano: z
    .string()
    .length(4, "Ano deve ter 4 dígitos")
    .refine(
      (ano) => {
        const anoNum = parseInt(ano);
        const anoAtual = new Date().getFullYear();
        return anoNum >= 1900 && anoNum <= anoAtual + 1;
      },
      {
        message: "Ano inválido",
      }
    ),

  mes: z
    .string()
    .length(2, "Mês deve ter 2 dígitos")
    .refine(
      (mes) => {
        const mesNum = parseInt(mes);
        return mesNum >= 1 && mesNum <= 12;
      },
      {
        message: "Mês deve estar entre 01 e 12",
      }
    ),

  rendimentoDoMes: z
    .number({
      required_error: "Rendimento do mês é obrigatório",
      invalid_type_error: "Rendimento deve ser um número",
    })
    .min(0, "Rendimento deve ser positivo")
    .max(100000000, "Rendimento muito alto"),

  dividendosDoMes: z
    .number({
      required_error: "Dividendos do mês é obrigatório",
      invalid_type_error: "Dividendos deve ser um número",
    })
    .min(0, "Dividendos deve ser positivo")
    .max(100000000, "Dividendos muito alto"),

  valorAplicado: z
    .number({
      required_error: "Valor aplicado é obrigatório",
      invalid_type_error: "Valor aplicado deve ser um número",
    })
    .min(0, "Valor aplicado deve ser positivo")
    .max(1000000000, "Valor aplicado muito alto"),

  saldoBruto: z
    .number({
      required_error: "Saldo bruto é obrigatório",
      invalid_type_error: "Saldo bruto deve ser um número",
    })
    .min(0, "Saldo bruto deve ser positivo")
    .max(1000000000, "Saldo bruto muito alto"),

  saldoAnterior: z
    .number({
      required_error: "Saldo anterior é obrigatório",
      invalid_type_error: "Saldo anterior deve ser um número",
    })
    .min(0, "Saldo anterior deve ser positivo")
    .max(1000000000, "Saldo anterior muito alto")
    .default(0),

  valorResgatado: z
    .number({
      required_error: "Valor resgatado é obrigatório",
      invalid_type_error: "Valor resgatado deve ser um número",
    })
    .min(0, "Valor resgatado deve ser positivo")
    .max(1000000000, "Valor resgatado muito alto"),

  impostoIncorrido: z
    .number({
      required_error: "Imposto incorrido é obrigatório",
      invalid_type_error: "Imposto incorrido deve ser um número",
    })
    .min(0, "Imposto incorrido deve ser positivo")
    .max(100000000, "Imposto incorrido muito alto"),

  impostoPrevisto: z
    .number({
      required_error: "Imposto previsto é obrigatório",
      invalid_type_error: "Imposto previsto deve ser um número",
    })
    .min(0, "Imposto previsto deve ser positivo")
    .max(100000000, "Imposto previsto muito alto"),

  saldoLiquido: z
    .number({
      required_error: "Saldo líquido é obrigatório",
      invalid_type_error: "Saldo líquido deve ser um número",
    })
    .min(0, "Saldo líquido deve ser positivo")
    .max(1000000000, "Saldo líquido muito alto"),

  clienteId: z
    .string({
      required_error: "Cliente é obrigatório",
      invalid_type_error: "ID do cliente deve ser uma string",
    })
    .uuid("ID do cliente deve ser um UUID válido"),

  bancoId: z
    .string({
      required_error: "Banco é obrigatório",
      invalid_type_error: "ID do banco deve ser uma string",
    })
    .uuid("ID do banco deve ser um UUID válido"),

  ativoId: z
    .string({
      required_error: "Ativo é obrigatório",
      invalid_type_error: "ID do ativo deve ser uma string",
    })
    .uuid("ID do ativo deve ser um UUID válido"),
});

// Schema para criação de investimento
export const createInvestimentoSchema = investimentoSchema.omit({
  saldoAnterior: true,
  impostoIncorrido: true,
  impostoPrevisto: true,
  saldoLiquido: true,
});

// Schema para atualização de investimento
export const updateInvestimentoSchema = investimentoSchema.partial();

// Schema para filtros de investimento
export const investimentoFiltersSchema = z.object({
  ano: z.string().optional(),
  mes: z.string().optional(),
  cliente: z.string().optional(),
  banco: z.string().optional(),
  ativo: z.string().optional(),
  tipo: z.string().optional(),
  categoriaId: z.string().uuid().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

// Tipos TypeScript gerados automaticamente
export type InvestimentoInput = z.input<typeof investimentoSchema>;
export type InvestimentoOutput = z.output<typeof investimentoSchema>;
export type CreateInvestimentoInput = z.input<typeof createInvestimentoSchema>;
export type UpdateInvestimentoInput = z.input<typeof updateInvestimentoSchema>;
export type InvestimentoFiltersInput = z.input<
  typeof investimentoFiltersSchema
>;

// Função para validar dados
export function validateInvestimento(data: unknown) {
  return investimentoSchema.safeParse(data);
}

export function validateCreateInvestimento(data: unknown) {
  return createInvestimentoSchema.safeParse(data);
}

export function validateUpdateInvestimento(data: unknown) {
  return updateInvestimentoSchema.safeParse(data);
}

export function validateInvestimentoFilters(data: unknown) {
  return investimentoFiltersSchema.safeParse(data);
}
