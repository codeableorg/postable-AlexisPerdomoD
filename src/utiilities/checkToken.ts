import jwt, { JsonWebTokenError } from "jsonwebtoken"
import { Err } from "../models/general.model"
import { TokenInfo, tokenInfoSchema } from "../models/schemas.model"
import { ZodError } from "zod"
import dotenv from "../config/dotenv"
import { Request } from "express"

export const checkToken = (req:Request):TokenInfo | Err =>{
    try {
        let token = req.headers.authorization
        if(!token)return{
            error:true,
            message:"Unauthorized",
            status:401
        }
        token = token.split(" ")[1]
        return tokenInfoSchema.parse(jwt.verify(token, dotenv.SECRET_TOKEN || ""))
    } catch (error) {
        if(error instanceof JsonWebTokenError){
            return {
                error:true,
                message: error.message,
                cause: error.name,
                status:401
            }
        }else if(error instanceof ZodError)return{
                error:true,
                message: error.message,
                cause: error.name,
                status:400
            }


        return{
            error:true,
            message:"internar error server",
            status:500
        }
    }
}