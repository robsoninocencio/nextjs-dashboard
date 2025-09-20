import { z } from "zod";

// Schema base para cliente
export const clienteSchema = z.object({
  name: z
    .string({
      required_error: "Nome é obrigatório",
      invalid_type_error: "Nome deve ser uma string",
    })
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

  email: z
    .string({
      required_error: "Email é obrigatório",
      invalid_type_error: "Email deve ser uma string",
    })
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres")
    .refine(
      (email) => {
        // Validação adicional para emails corporativos
        const commonDomains = [
          "gmail.com",
          "yahoo.com",
          "hotmail.com",
          "outlook.com",
        ];
        const domain = email.split("@")[1];
        return !commonDomains.includes(domain);
      },
      {
        message: "Por favor, use um email corporativo ou profissional",
      }
    ),

  userId: z
    .string({
      required_error: "Usuário é obrigatório",
      invalid_type_error: "ID do usuário deve ser uma string",
    })
    .uuid("ID do usuário deve ser um UUID válido")
    .optional(),
});

// Schema para criação de cliente
export const createClienteSchema = clienteSchema.omit({
  userId: true,
});

// Schema para atualização de cliente
export const updateClienteSchema = clienteSchema.partial();

// Schema para filtros de cliente
export const clienteFiltersSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  userId: z.string().uuid().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

// Schema para validação de email único
export const uniqueEmailSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  excludeId: z.string().uuid().optional(),
});

// Tipos TypeScript gerados automaticamente
export type ClienteInput = z.input<typeof clienteSchema>;
export type ClienteOutput = z.output<typeof clienteSchema>;
export type CreateClienteInput = z.input<typeof createClienteSchema>;
export type UpdateClienteInput = z.input<typeof updateClienteSchema>;
export type ClienteFiltersInput = z.input<typeof clienteFiltersSchema>;
export type UniqueEmailInput = z.input<typeof uniqueEmailSchema>;

// Função para validar dados
export function validateCliente(data: unknown) {
  return clienteSchema.safeParse(data);
}

export function validateCreateCliente(data: unknown) {
  return createClienteSchema.safeParse(data);
}

export function validateUpdateCliente(data: unknown) {
  return updateClienteSchema.safeParse(data);
}

export function validateClienteFilters(data: unknown) {
  return clienteFiltersSchema.safeParse(data);
}

export function validateUniqueEmail(data: unknown) {
  return uniqueEmailSchema.safeParse(data);
}

// Validações customizadas
export const clienteValidations = {
  // Valida se o nome contém apenas caracteres válidos
  validateName: (name: string): boolean => {
    return /^[a-zA-ZÀ-ÿ\s]+$/.test(name);
  },

  // Valida se o email é de um domínio corporativo
  isCorporateEmail: (email: string): boolean => {
    const commonDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
    ];
    const domain = email.split("@")[1];
    return !commonDomains.includes(domain);
  },

  // Valida se o cliente pode ser deletado (sem investimentos ativos)
  canDelete: async (clienteId: string): Promise<boolean> => {
    // Esta validação seria implementada no server action
    // Verificando se o cliente tem investimentos ativos
    return true; // Placeholder
  },
};
