import {z} from "zod";
import { FormatedPost } from "./schemas.model";



export const querySchema = z.object({
    page:z.number().min(1).default(1),
    limit: z.number().min(1).default(10),
    username: z.string().optional(),
    orderBy:z.enum(["createdAt", "likesCount"]).default("createdAt"),
    order:z.enum(["asc", "desc"]).default("asc")
})

export type Query = z.infer< typeof querySchema >

export interface Err{
    message?:string, 
    error:boolean,
    status:number
}

export interface Pagination{
    page:number,
    pagesize:number,
    totalItems:number,
    totalPages:number,
    nextPage:string | null,
    previusPage:string | null
}
export interface Response{
    ok:boolean,
    data: FormatedPost[],
    pagination: Pagination
}