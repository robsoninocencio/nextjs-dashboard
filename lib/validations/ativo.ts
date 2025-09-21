import { z } from 'zod';

// Schema base para ativo
export const ativoSchema = z.object({
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
    .max(20, 'Código deve ter no máximo 20 caracteres')
    .regex(/^[A-Z0-9]+$/, 'Código deve conter apenas letras maiúsculas e números')
    .transform(codigo => codigo.toUpperCase()),

  tipoId: z
    .string({
      required_error: 'Tipo é obrigatório',
      invalid_type_error: 'ID do tipo deve ser uma string',
    })
    .uuid('ID do tipo deve ser um UUID válido'),

  descricao: z
    .string({
      invalid_type_error: 'Descrição deve ser uma string',
    })
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),

  ativo: z
    .boolean({
      invalid_type_error: 'Status ativo deve ser um booleano',
    })
    .default(true),
});

// Schema para criação de ativo
export const createAtivoSchema = ativoSchema.omit({
  ativo: true,
});

// Schema para atualização de ativo
export const updateAtivoSchema = ativoSchema.partial();

// Schema para filtros de ativo
export const ativoFiltersSchema = z.object({
  nome: z.string().optional(),
  codigo: z.string().optional(),
  tipoId: z.string().uuid().optional(),
  ativo: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

// Schema para validação de código único
export const uniqueCodigoSchema = z.object({
  codigo: z
    .string()
    .min(3, 'Código deve ter pelo menos 3 caracteres')
    .max(20, 'Código deve ter no máximo 20 caracteres')
    .regex(/^[A-Z0-9]+$/, 'Código deve conter apenas letras maiúsculas e números'),
  excludeId: z.string().uuid().optional(),
});

// Tipos TypeScript gerados automaticamente
export type AtivoInput = z.input<typeof ativoSchema>;
export type AtivoOutput = z.output<typeof ativoSchema>;
export type CreateAtivoInput = z.input<typeof createAtivoSchema>;
export type UpdateAtivoInput = z.input<typeof updateAtivoSchema>;
export type AtivoFiltersInput = z.input<typeof ativoFiltersSchema>;
export type UniqueCodigoInput = z.input<typeof uniqueCodigoSchema>;

// Função para validar dados
export function validateAtivo(data: unknown) {
  return ativoSchema.safeParse(data);
}

export function validateCreateAtivo(data: unknown) {
  return createAtivoSchema.safeParse(data);
}

export function validateUpdateAtivo(data: unknown) {
  return updateAtivoSchema.safeParse(data);
}

export function validateAtivoFilters(data: unknown) {
  return ativoFiltersSchema.safeParse(data);
}

export function validateUniqueCodigo(data: unknown) {
  return uniqueCodigoSchema.safeParse(data);
}

// Validações customizadas
export const ativoValidations = {
  // Valida se o código segue o padrão de mercado
  validateCodigoFormat: (codigo: string): boolean => {
    // Padrões comuns: PETR4, VALE3, ITUB4, etc.
    const codigoPattern = /^[A-Z]{4}[0-9]{1,2}$/;
    return codigoPattern.test(codigo);
  },

  // Valida se o nome é um nome de empresa válido
  validateNome: (nome: string): boolean => {
    // Não permite apenas números ou caracteres especiais
    return /^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/.test(nome) && /\d/.test(nome) === false;
  },

  // Valida se o ativo pode ser desativado (sem investimentos ativos)
  canDeactivate: async (ativoId: string): Promise<boolean> => {
    // Esta validação seria implementada no server action
    // Verificando se o ativo tem investimentos ativos
    return true; // Placeholder
  },

  // Valida se o código já existe (excluindo o próprio registro)
  isCodigoUnique: async (codigo: string, excludeId?: string): Promise<boolean> => {
    // Esta validação seria implementada no server action
    return true; // Placeholder
  },
};
