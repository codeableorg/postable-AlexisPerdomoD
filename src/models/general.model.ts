import {z} from "zod";
import { FormatedPost } from "./schemas.model";



export const querySchema = z.object({
    page:z.string().default("1"),
    limit: z.string().default("10"),
    username: z.string().optional(),
    orderBy:z.enum(["createdAt", "likesCount"]).default("createdAt"),
    order:z.enum(["asc", "desc"]).default("asc")
})

export type Query = z.infer< typeof querySchema >

export interface Err{
    message?:string, 
    error:boolean,
    status:number,
    cause?:string,
    code?:string ,
    name?:string,
    stack?:string
}

export type Pagination = {
    page:number,
    pageSize:number,
    totalItems:number | null,
    totalPages:number,
    nextPage:string | null,
    previusPage:string | null
}
export interface PostsResponse{
    ok:boolean,
    data: FormatedPost[],
    pagination: Pagination
}