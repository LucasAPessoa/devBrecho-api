import { z } from "zod";

export const pecaCadastradaSchema = z.object({
    pecaCadastradaId: z.number().int().positive(),
    codigoDaPeca: z.string().min(1).max(100),
    bolsaId: z.number().int().positive(),
});

export const pecaCadastradaCreateSchema = z.object({
    bolsaId: z.number().int().positive(),
    codigoDaPeca: z
        .array(z.string().min(1, "O código da peça não pode ser vazio."))
        .min(1, "É preciso cadastrar ao menos uma peça."),
});

export const pecaCadastradaUpdateSchema = z.object({
    pecaCadastradaId: z.number().int().positive(),
    codigoDaPeca: z.string().min(1, "O código da peça é obrigatório.").max(100),
});

export const pecaCadastradaGetByBolsaIdSchema = z.object({
    bolsaId: z.coerce
        .number()
        .int("O ID da bolsa deve ser um inteiro.")
        .positive("O ID da bolsa deve ser positivo."),
});

export const pecaCadastradaDeleteSchema = z.object({
    pecaCadastradaId: z.coerce
        .number()
        .int("O ID da peça deve ser um inteiro.")
        .positive("O ID da peça deve ser positivo."),
});

export type PecaCadastradaType = z.infer<typeof pecaCadastradaSchema>;

export type PecaCadastradaCreateType = z.infer<
    typeof pecaCadastradaCreateSchema
>;
export type PecaCadastradaUpdateType = z.infer<
    typeof pecaCadastradaUpdateSchema
>;
export type PecaCadastradaGetByBolsaIdType = z.infer<
    typeof pecaCadastradaGetByBolsaIdSchema
>;
export type PecaCadastradaDeleteType = z.infer<
    typeof pecaCadastradaDeleteSchema
>;

export const pecaCadastradaResponseSchema = pecaCadastradaSchema;
export const pecaCadastradaGetAllResponseSchema = z.array(
    pecaCadastradaResponseSchema
);
export const pecaCadastradaGetByBolsaIdResponseSchema = z.array(
    pecaCadastradaResponseSchema
);
export const pecaCadastradaUpdateResponseSchema = pecaCadastradaResponseSchema;

export type PecaCadastradaResponseType = z.infer<
    typeof pecaCadastradaResponseSchema
>;
export type PecaCadastradaGetAllResponseType = z.infer<
    typeof pecaCadastradaGetAllResponseSchema
>;
export type PecaCadastradaGetByBolsaIdResponseType = z.infer<
    typeof pecaCadastradaGetByBolsaIdResponseSchema
>;
export type PecaCadastradaUpdateResponseType = z.infer<
    typeof pecaCadastradaUpdateResponseSchema
>;
