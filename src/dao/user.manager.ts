import { PoolClient, QueryResult } from "pg";
import { User, UserInfo} from "../models/schemas.model";
import { Err } from "../models/general.model";



export default class UserManager{
    #getDB:()=> Promise<PoolClient>
    constructor(getDB:()=> Promise<PoolClient>){
        this.#getDB = getDB
    }
    async getUser(username:string):Promise<User | Err>{
        try {
            const client = await this.#getDB()
            const response:QueryResult<User> = await client.query({
                text:`SELECT * FROM Users WHERE username = $1`,
                values:[username]
            })
            if(response.rowCount === 0){
                return {
                    error:true,
                    message:"user not found",
                    status:404
                }
            }
            return response.rows[0]
        } catch (error) {
            console.error()
            if(error instanceof Error) return{
                error:true,
                status:500,
                cause: error.message,
                message:"internal server error",
                name: error.name,
                stack:error.stack
            }
            return {
                error:true,
                message:"internal server error",
                status:500
            }
        }
    }
    async createUser(userInfo:UserInfo):Promise<User | Err>{
        try {
            const client = await this.#getDB()
            const {
                username, 
                password, 
                email, 
                firstName, 
                lastName, 
                role, 
                createdAt , 
                updatedAt
            } = userInfo
            const response:QueryResult<User> = await client.query({
                text:`
                    INSERT INTO Users( username, password, email, firstName, lastName, role, createdAt , updatedAt)
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;`,
                values:[username, password, email, firstName, lastName, role, createdAt, updatedAt]
            })
            return response.rows[0]
        } catch (error) {
            console.error(error)
            if(error instanceof Error){
                if("code" in error){
                    return{
                        error:true,
                        status:400,
                        cause: error.message,
                        message:"bad request",
                        code: typeof error.code === "string" ? error.code : undefined,
                        name: error.name,
                        stack:error.stack
                    }
                }
                return{
                    error:true,
                    status:500,
                    cause: error.message,
                    message:"something whent wrong",
                    name: error.name,
                    stack:error.stack
                }
            }
            return {
                error:true,
                message:"internal error server",
                status:500
            }
        }
    }
}