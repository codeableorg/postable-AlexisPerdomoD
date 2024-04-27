import bcrypt from "bcrypt"
import { User } from "../models/schemas.model"


export const signPass = (password:string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// compare password
export const checkPass = (password:string, user:User) => bcrypt.compareSync(password, user.password)