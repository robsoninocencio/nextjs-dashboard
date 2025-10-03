import { z } from 'zod';

// Schema base para banco
export const bancoSchema = z.object({
  nome: z
    .string({
      required_error: 'Nome é obrigatório',
      invalid_type_error: 'Nome deve ser uma string',
    })
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/, 'Nome contém caracteres inválidos'),

  codigo: z
    .string({
      required_error: 'Código é obrigatório',
      invalid_type_error: 'Código deve ser uma string',
    })
    .min(3, 'Código deve ter pelo menos 3 caracteres')
    .max(10, 'Código deve ter no máximo 10 caracteres')
    .regex(/^[0-9]+$/, 'Código deve conter apenas números')
    .transform(codigo => codigo.padStart(3, '0')),

  agencia: z
    .string({
      required_error: 'Agência é obrigatória',
      invalid_type_error: 'Agência deve ser uma string',
    })
    .min(4, 'Agência deve ter pelo menos 4 caracteres')
    .max(10, 'Agência deve ter no máximo 10 caracteres')
    .regex(/^[0-9\-]+$/, 'Agência deve conter apenas números e hífen'),

  conta: z
    .string({
      required_error: 'Conta é obrigatória',
      invalid_type_error: 'Conta deve ser uma string',
    })
    .min(5, 'Conta deve ter pelo menos 5 caracteres')
    .max(20, 'Conta deve ter no máximo 20 caracteres')
    .regex(/^[0-9\-]+$/, 'Conta deve conter apenas números e hífen'),

  tipo: z.enum(['CORRENTE', 'POUPANCA', 'INVESTIMENTO'], {
    required_error: 'Tipo de conta é obrigatório',
    invalid_type_error: 'Tipo de conta inválido',
  }),

  ativo: z
    .boolean({
      invalid_type_error: 'Status ativo deve ser um booleano',
    })
    .default(true),
});

// Schema para criação de banco
export const createBancoSchema = bancoSchema.omit({
  ativo: true,
});

// Schema para atualização de banco
export const updateBancoSchema = bancoSchema.partial();

// Schema para filtros de banco
export const bancoFiltersSchema = z.object({
  nome: z.string().optional(),
  codigo: z.string().optional(),
  tipo: z.enum(['CORRENTE', 'POUPANCA', 'INVESTIMENTO']).optional(),
  ativo: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

// Schema para validação de conta única
export const uniqueContaSchema = z.object({
  codigo: z
    .string()
    .min(3, 'Código deve ter pelo menos 3 caracteres')
    .max(10, 'Código deve ter no máximo 10 caracteres')
    .regex(/^[0-9]+$/, 'Código deve conter apenas números'),
  agencia: z
    .string()
    .min(4, 'Agência deve ter pelo menos 4 caracteres')
    .max(10, 'Agência deve ter no máximo 10 caracteres')
    .regex(/^[0-9\-]+$/, 'Agência deve conter apenas números e hífen'),
  conta: z
    .string()
    .min(5, 'Conta deve ter pelo menos 5 caracteres')
    .max(20, 'Conta deve ter no máximo 20 caracteres')
    .regex(/^[0-9\-]+$/, 'Conta deve conter apenas números e hífen'),
  excludeId: z.string().uuid().optional(),
});

// Tipos TypeScript gerados automaticamente
export type BancoInput = z.input<typeof bancoSchema>;
export type BancoOutput = z.output<typeof bancoSchema>;
export type CreateBancoInput = z.input<typeof createBancoSchema>;
export type UpdateBancoInput = z.input<typeof updateBancoSchema>;
export type BancoFiltersInput = z.input<typeof bancoFiltersSchema>;
export type UniqueContaInput = z.input<typeof uniqueContaSchema>;

// Função para validar dados
export function validateBanco(data: unknown) {
  return bancoSchema.safeParse(data);
}

export function validateCreateBanco(data: unknown) {
  return createBancoSchema.safeParse(data);
}

export function validateUpdateBanco(data: unknown) {
  return updateBancoSchema.safeParse(data);
}

export function validateBancoFilters(data: unknown) {
  return bancoFiltersSchema.safeParse(data);
}

export function validateUniqueConta(data: unknown) {
  return uniqueContaSchema.safeParse(data);
}

// Validações customizadas
export const bancoValidations = {
  // Valida se o código do banco é válido (códigos oficiais do BACEN)
  validateCodigoBanco: (codigo: string): boolean => {
    const validCodigos = [
      '001',
      '033',
      '104',
      '237',
      '341',
      '356',
      '389',
      '399',
      '422',
      '070',
      '136',
      '173',
      '184',
      '477',
      '745',
      '041',
      '004',
      '021',
    ];
    return validCodigos.includes(codigo.padStart(3, '0'));
  },

  // Valida formato da agência
  validateAgenciaFormat: (agencia: string): boolean => {
    // Formatos válidos: 1234, 1234-5, 12345-6
    const agenciaPattern = /^[0-9]{4,5}-?[0-9]?$/;
    return agenciaPattern.test(agencia);
  },

  // Valida formato da conta
  validateContaFormat: (conta: string): boolean => {
    // Formatos válidos: 12345-6, 123456-7, 123456789-0
    const contaPattern = /^[0-9]{5,9}-?[0-9]?$/;
    return contaPattern.test(conta);
  },

  // Valida se a conta bancária pode ser desativada
  canDeactivate: async (bancoId: string): Promise<boolean> => {
    // Esta validação seria implementada no server action
    // Verificando se o banco tem investimentos ativos
    return true; // Placeholder
  },

  // Valida se a conta já existe (excluindo o próprio registro)
  isContaUnique: async (
    codigo: string,
    agencia: string,
    conta: string,
    excludeId?: string
  ): Promise<boolean> => {
    // Esta validação seria implementada no server action
    return true; // Placeholder
  },

  // Formata dados bancários para exibição
  formatConta: (conta: string): string => {
    // Remove hífen e formata com padrão brasileiro
    const cleanConta = conta.replace('-', '');
    if (cleanConta.length <= 8) {
      return cleanConta.replace(/(\d{5,7})(\d{1,2})?$/, '$1-$2').replace(/-$/, '');
    }
    return cleanConta.replace(/(\d{8})(\d{1,2})?$/, '$1-$2').replace(/-$/, '');
  },

  formatAgencia: (agencia: string): string => {
    // Remove hífen e formata com padrão brasileiro
    const cleanAgencia = agencia.replace('-', '');
    return cleanAgencia.replace(/(\d{4})(\d)?$/, '$1-$2').replace(/-$/, '');
  },
};
