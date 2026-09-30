import z from 'zod';


export const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title cannot be empty')
        .max(200, 'Title must be under 200 characters'),
    description: z
        .string()
        .max(1000, 'Description must be under 1000 characters')
        .optional()
        .default(''),
});


export const updateTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title cannot be empty')
        .max(200, 'Title must be under 200 characters')
        .optional(),
    description: z
        .string()
        .max(1000, 'Description must be under 1000 characters')
        .optional(),
    status: z
        .enum(['Pending', 'In Progress', 'Completed'], {
            message: 'Status must be Pending, In Progress, or Completed',
        })
        .optional(),
});
