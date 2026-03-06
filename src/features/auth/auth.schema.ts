import z from "zod";

export const loginSchema = z.object({
    email: z.email(),
    password: z
        .string()
        .min(8, "Password should have minimum length of 8 characters")
        .max(15, "Password is too long")
        .regex(
            new RegExp(".*[A-Z].*"),
            "Needs at least one uppercase character",
        )
        .regex(
            new RegExp(".*[a-z].*"),
            "Needs at least one lowercase character",
        )
        .regex(new RegExp(".*\\d.*"), "One number")
        .regex(
            new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
            "Needs at least one special character",
        )
        .min(8, "Must be at least 8 characters in length"),
});

export const profileSchema = z.object({
    userId: z.uuid(),
    firstName: z.string().max(100, "O nome deve ter no máximo 100 caracteres."),
    lastName: z
        .string()
        .max(100, "O sobrenome deve ter no máximo 100 caracteres."),
    phone: z
        .string()
        .max(20, "O telefone deve ter no máximo 20 caracteres.")
        .nullable(),
});

export type LoginType = z.infer<typeof loginSchema>;

export type ProfileType = z.infer<typeof profileSchema>;
