import { z } from "zod";

import { pecaCadastradaSchema } from "../pecasCadastradas/pecaCadastrada.schema";
import { fornecedoraSchema } from "../fornecedoras/fornecedora.schema";
import { setorSchema } from "../setores/setor.schema";

export const bolsaSchema = z.object({
    bolsaId: z.number().int().positive(),
    dataDeEntrada: z.coerce.date(),
    dataMensagem: z.coerce.date().optional().nullable(),
    quantidadeDePecasSemCadastro: z
        .number()
        .int("A quantidade deve ser um número inteiro.")
        .nonnegative("A quantidade não pode ser negativa."),
    observacoes: z
        .string()
        .max(500, "As observações devem ter no máximo 500 caracteres.")
        .optional()
        .nullable(),
    statusDevolvida: z.boolean().optional().nullable(),
    statusDoada: z.boolean().optional().nullable(),
    deletedAt: z.coerce.date().optional().nullable(),
    fornecedoraId: z.number().int().positive(),
    setorId: z.number().int().positive(),
    pecasCadastradas: z.array(pecaCadastradaSchema).optional(),
});

export const bolsaCreateSchema = z.object({
    dataMensagem: z.coerce.date().optional().nullable(),
    quantidadeDePecasSemCadastro: z
        .number()
        .int("A quantidade deve ser um inteiro.")
        .nonnegative("A quantidade não pode ser negativa."),
    observacoes: z
        .string()
        .max(500, "As observações devem ter no máximo 500 caracteres.")
        .optional()
        .nullable(),
    statusDevolvida: z.boolean().optional().nullable(),
    statusDoada: z.boolean().optional().nullable(),
    fornecedoraId: z
        .number({ invalid_type_error: "O ID da fornecedora é obrigatório." })
        .int()
        .positive(),
    setorId: z
        .number({ invalid_type_error: "O ID do setor é obrigatório." })
        .int()
        .positive(),

    codigosDasPecas: z.array(
        z.string().min(1, "O código da peça não pode ser vazio.")
    ),
});

export const bolsaUpdateSchema = z.object({
    dataMensagem: z.coerce.date().optional().nullable(),
    quantidadeDePecasSemCadastro: z
        .number()
        .int("A quantidade deve ser um inteiro.")
        .nonnegative("A quantidade não pode ser negativa."),
    observacoes: z
        .string()
        .max(500, "As observações devem ter no máximo 500 caracteres.")
        .optional()
        .nullable(),
    statusDevolvida: z.boolean().optional().nullable(),
    statusDoada: z.boolean().optional().nullable(),
    fornecedoraId: z
        .number({ invalid_type_error: "O ID da fornecedora é obrigatório." })
        .int()
        .positive(),
    setorId: z
        .number({ invalid_type_error: "O ID do setor é obrigatório." })
        .int()
        .positive(),
});

export const bolsaParamsSchema = z.object({
    bolsaId: z.coerce
        .number({ invalid_type_error: "O ID da bolsa deve ser um número." })
        .int("O ID da bolsa deve ser um inteiro.")
        .positive("O ID da bolsa deve ser um número positivo."),
});

export const bolsaSetStatusSchema = z.object({
    statusDevolvida: z.boolean().optional().nullable(),
    statusDoada: z.boolean().optional().nullable(),
});

export type BolsaType = z.infer<typeof bolsaSchema>;
export type BolsaCreateType = z.infer<typeof bolsaCreateSchema>;
export type BolsaUpdateType = z.infer<typeof bolsaUpdateSchema>;
export type BolsaParamsType = z.infer<typeof bolsaParamsSchema>;
export type BolsaSetStatusType = z.infer<typeof bolsaSetStatusSchema>;

export const bolsaPopulatedResponseSchema = bolsaSchema.extend({
    fornecedora: fornecedoraSchema,
    setor: setorSchema,
    pecasCadastradas: z.array(pecaCadastradaSchema),
});

export const bolsaResponseSchema = bolsaPopulatedResponseSchema;

export const bolsaGetAllResponseSchema = z.array(bolsaPopulatedResponseSchema);

export type BolsaResponseType = z.infer<typeof bolsaResponseSchema>;
export type BolsaGetAllResponseType = z.infer<typeof bolsaGetAllResponseSchema>;

export const bolsaSyncPecasSchema = z.object({
    codigosDasPecas: z
        .array(z.string().min(1, "O código da peça não pode ser vazio."))
        .min(1, "É preciso cadastrar ao menos uma peça."),
});

export type BolsaSyncPecasType = z.infer<typeof bolsaSyncPecasSchema>;
