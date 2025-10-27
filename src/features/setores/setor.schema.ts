import z from "zod";

// Request body schema for Setor

export const setorSchema = z.object({
    setorId: z.number().int().positive(),
    nome: z.string().min(1).max(10),
});

export const setorCreateSchema = setorSchema.omit({ setorId: true });

export const setorUpdateSchema = z.object({
    setorId: z
        .number({ invalid_type_error: "O ID do setor deve ser um número." })
        .int("O ID do setor deve ser um inteiro.")
        .positive("O ID do setor deve ser um número positivo."),
    nome: z.string().min(1).max(10),
});

export const setorParamsSchema = z.object({
    setorId: z.coerce
        .number({ invalid_type_error: "O ID do setor deve ser um número." })
        .int("O ID do setor deve ser um inteiro.")
        .positive("O ID do setor deve ser um número positivo."),
});

export type SetorType = z.infer<typeof setorSchema>;
export type SetorCreateType = z.infer<typeof setorCreateSchema>;
export type SetorUpdateType = z.infer<typeof setorUpdateSchema>;
export type SetorGetByIdType = z.infer<typeof setorParamsSchema>;
export type SetorDeleteType = z.infer<typeof setorParamsSchema>;
export type SetorParamsType = z.infer<typeof setorParamsSchema>;

// Response schema for Setor
export const setorResponseSchema = setorSchema;

export const setorGetAllResponseSchema = z.array(setorResponseSchema);

export type SetorResponseType = z.infer<typeof setorResponseSchema>;
export type SetorGetAllResponseType = z.infer<typeof setorGetAllResponseSchema>;
