import { Router } from "express";
import { createUserCtr, deleteUserCtr, getUserCtr, loginUserCtr, updateUserCtr } from "../services/user.services";

const userRouter = Router()

userRouter.get("/me",getUserCtr)
userRouter.patch("/me", updateUserCtr)
userRouter.delete("/me", deleteUserCtr)
userRouter.post("/signup", createUserCtr)
userRouter.post("/login",loginUserCtr)

export default userRouter