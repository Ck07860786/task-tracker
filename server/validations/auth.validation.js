import z from 'zod';

export const userRegistrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").max(50, "Name must be less than 50 characters long"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
