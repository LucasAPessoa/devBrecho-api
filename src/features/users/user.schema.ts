import { User, Role } from "../../../prisma/generated/prisma/client";
import { z } from "zod";

export const userSchema = z.object({
    userId: z.uuid(),
    firstName: z.string().max(100, "O nome deve ter no máximo 100 caracteres."),
    lastName: z
        .string()
        .max(100, "O sobrenome deve ter no máximo 100 caracteres."),
    phone: z
        .string()
        .max(20, "O telefone deve ter no máximo 20 caracteres.")

        .nullable(),
    email: z.email("O email deve ser válido."),
    passwordHash: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    deletedAt: z.date().nullable(),

    role: z.enum(Role),

    managerId: z.uuid().nullable(),
});

export const userCreateSchema = userSchema.omit({
    userId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});

export const userUpdateSchema = userSchema.pick({
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
    role: true,
});

export const userGetEmailAndPasswordSchema = userSchema.pick({
    userId: true,
    email: true,
    passwordHash: true,
});

export const userParamsSchema = z.object({
    userId: z.uuid("O ID do usuário deve ser um UUID válido."),
});

export type UserType = z.infer<typeof userSchema>;
export type UserCreateType = z.infer<typeof userCreateSchema>;
export type UserUpdateType = z.infer<typeof userUpdateSchema>;
export type UserParamsType = z.infer<typeof userParamsSchema>;
export type UserGetEmailAndPasswordType = z.infer<
    typeof userGetEmailAndPasswordSchema
>;

export const userResponseSchema = userSchema.omit({
    passwordHash: true,
});
export const userGetSubordinatesResponseSchema = z.array(userResponseSchema);

export type UserResponseType = z.infer<typeof userResponseSchema>;
export type UserGetSubordinatesResponseType = z.infer<
    typeof userGetSubordinatesResponseSchema
>;
