import { z } from 'zod';

// Esquema para la tabla 'posts'
export const postSchema = z.object({
    id: z.number().int(),
    user_id: z.number().int(),
    content: z.string(),
    createdAt:z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
});
export type Post = z.infer<typeof postSchema>
// Esquema para la tabla 'likes'
export const likeSchema = z.object({
    createdAt: z.date().default(new Date()),
    user_id: z.number().int(),
    post_id: z.number().int(),
});
export type Like = z.infer<typeof likeSchema>