import { z } from "zod";

export const fornecedoraSchema = z.object({
    fornecedoraId: z.number().int().positive(),
    codigo: z.string().min(1, "O código é obrigatório.").max(50),
    nome: z.string().min(1, "O nome é obrigatório.").max(100),
    telefone: z
        .string()
        .max(20, "O telefone deve ter no máximo 20 caracteres.")
        .optional()
        .nullable(),
});

export const fornecedoraCreateSchema = fornecedoraSchema.omit({
    fornecedoraId: true,
});

export const fornecedoraUpdateSchema = z.object({
    fornecedoraId: z
        .number({
            invalid_type_error: "O ID da fornecedora deve ser um número.",
        })
        .int("O ID da fornecedora deve ser um inteiro.")
        .positive("O ID da fornecedora deve ser um número positivo."),
    codigo: z.string().min(1, "O código é obrigatório.").max(50),
    nome: z.string().min(1, "O nome é obrigatório.").max(100),
    telefone: z
        .string()
        .max(20, "O telefone deve ter no máximo 20 caracteres.")
        .optional()
        .nullable(),
});

export const fornecedoraParamsSchema = z.object({
    fornecedoraId: z.coerce
        .number({
            invalid_type_error: "O ID da fornecedora deve ser um número.",
        })
        .int("O ID da fornecedora deve ser um inteiro.")
        .positive("O ID da fornecedora deve ser um número positivo."),
});

export type FornecedoraType = z.infer<typeof fornecedoraSchema>;
export type FornecedoraCreateType = z.infer<typeof fornecedoraCreateSchema>;
export type FornecedoraUpdateType = z.infer<typeof fornecedoraUpdateSchema>;
export type FornecedoraParamsType = z.infer<typeof fornecedoraParamsSchema>;

export const fornecedoraResponseSchema = fornecedoraSchema;
export const fornecedoraGetAllResponseSchema = z.array(
    fornecedoraResponseSchema
);

export type FornecedoraResponseType = z.infer<typeof fornecedoraResponseSchema>;
export type FornecedoraGetAllResponseType = z.infer<
    typeof fornecedoraGetAllResponseSchema
>;
