import z from "zod";

// Request body schema for PecaCadastrada

export const pecaCadastradaSchema = z.object({
    pecaCadastradaId: z.number().int().positive(),
    codigoDaPeca: z.string().min(1).max(10),
    bolsaId: z.number().int().positive(),
});

export const pecaCadastradaCreateSchema = z.object({
    codigoDaPeca: z.array(z.string().min(1).max(10)),
    bolsaId: z.number().int().positive(),
});

export const pecaCadastradaUpdateSchema = z.object({
    pecaCadastradaId: z.number().int().positive(),
    codigoDaPeca: z.string().min(1).max(10),
});

export const pecaCadastradaDeleteSchema = z.object({
    pecaCadastradaId: z.number().int().positive(),
});

//DELETE and GET by ID params schema

export const pecaCadastradaParamsSchema = z.object({
    pecaCadastradaId: z.number().int().positive(),
});

export const pecaCadastradaGetByBolsaIdSchema = z.object({
    bolsaId: z.number().int().positive(),
});

export type PecaCadastradaType = z.infer<typeof pecaCadastradaSchema>;

export type PecaCadastradaCreateType = z.infer<
    typeof pecaCadastradaCreateSchema
>;

export type PecaCadastradaUpdateType = z.infer<
    typeof pecaCadastradaUpdateSchema
>;

export type PecaCadastradaGetByIdType = z.infer<
    typeof pecaCadastradaParamsSchema
>;
export type PecaCadastradaDeleteType = z.infer<
    typeof pecaCadastradaParamsSchema
>;
export type PecaCadastradaGetByBolsaIdType = z.infer<
    typeof pecaCadastradaGetByBolsaIdSchema
>;

//Response schema for PecaCadastrada

export const pecaCadastradaResponseSchema = pecaCadastradaSchema;

export const pecaCadastradaGetAllResponseSchema = z.array(
    pecaCadastradaResponseSchema
);

export const pecaCadastradaGetByBolsaIdResponseSchema = z.array(
    pecaCadastradaResponseSchema.omit({ bolsaId: true })
);

export type PecaCadastradaUpdateResponseType = z.infer<
    typeof pecaCadastradaResponseSchema
>;

export type PecaCadastradaResponseType = z.infer<
    typeof pecaCadastradaResponseSchema
>;

export type PecaCadastradaGetAllResponseType = z.infer<
    typeof pecaCadastradaGetAllResponseSchema
>;

export type PecaCadastradaGetByBolsaIdResponseType = z.infer<
    typeof pecaCadastradaGetByBolsaIdResponseSchema
>;
