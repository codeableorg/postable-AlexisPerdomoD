import {z} from "zod"
const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
export const userSquema = z.object({
    username: z.string().max(50),
    password: z.string().max(50).regex(regex),
    email: z.string().max(50).email().optional(),
    firstName: z.string().max(50).optional(),
    lastName:z.string().max(50).optional(),
    role: z.string().max(10).default("user"),
    createdAt:z.date().default(new Date()),
    updatedAt:z.date().default(new Date()),
})
export type User = z.infer<typeof userSquema & {id:Number}>
