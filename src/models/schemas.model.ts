import { z } from 'zod';

// 'posts'
export const postSchema = z.object({
    user_id: z.number().int(),
    content: z.string(),
    createdAt:z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
});
export type Post = z.infer<typeof postSchema & {id:number}>

export type FormatedPost = {
    id:number,
    content:string,
    createdAt:Date,
    updatedAt:Date,
    username:string,
    likesCount:number
}

// Esquema para la tabla 'likes'
export const likeSchema = z.object({
    createdAt: z.date().default(new Date()),
    user_id: z.number().int(),
    post_id: z.number().int(),
});
export type Like = z.infer<typeof likeSchema>

// regex for password 
const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//users
export const userSquema = z.object({
    username: z.string().max(50),
    password: z.string().max(50).regex(regex),
    email: z.string().max(50).email().optional(),
    firstName: z.string().max(50).optional(),
    lastName:z.string().max(50).optional(),
    role: z.enum(["admin", "user"]).default("user"),
    createdAt:z.date().default(new Date()),
    updatedAt:z.date().default(new Date()),
})
export type UserInfo =  z.infer<typeof userSquema>
export type User = UserInfo & {id:number}

export const userUpdatesSchema = z.object({
    username: z.string().max(50).optional(),
    password: z.string().max(50).regex(regex).optional(),
    email: z.string().max(50).email().optional(),
    firstName: z.string().max(50).optional(),
    lastName:z.string().max(50).optional(),
})
export type UserUpdates = Record<string, string | undefined> & z.infer<typeof userUpdatesSchema>