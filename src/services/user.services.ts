import { Request, Response } from "express";
import factory from "../dao/factory";
import { loginSchema, userSquema , TokenInfo,userUpdatesSchema} from "../models/schemas.model";
import { checkPass, signPass } from "../utiilities/bcrypt";
import dotenv from "../config/dotenv.config";
import { Err } from "../models/general.model";

import { checkToken } from "../utiilities/checkToken";
import  jwt  from 'jsonwebtoken';
const um = factory.um()
/*

GET /me (Ver Perfil de Usuario)

    Descripción: Muestra el perfil del usuario autenticado.
    Respuesta:
        200 OK: Información del perfil en formato JSON.
        401 Unauthorized: Si el usuario no está autenticado.
    Ejemplo de Respuesta:

    {
      "ok": true,
      "data": {
        "id": 2,
        "username": "miUsuario",
        "email": "miemail@example.com",
        "firstName": "Nombre",
        "lastName": "Apellido",
        "createdAt": "2024-01-19 10:37:16-08",
        "updatedAt": "2024-01-19 10:37:16-08"
      }
    }

 */

    
export const getUserCtr = async(req:Request, res:Response)=>{
    const currentUser:TokenInfo | Err = checkToken(req)
    if("error" in currentUser)return res.status(currentUser.status).send({
        error:currentUser.cause || "ERROR",
        message: currentUser.message,
    })

    

    const r = await um.getUser(currentUser.username)
    if("error" in r)return res.status(r.status).send({
        error:r.cause || "ERROR",
        message: r.message,
    })
    const data ={
        id:r.id,
        username:r.username,
        email: r.email || "",
        lastName: r.lastName || "",
        firstName: r.firstName || "",
        createAt: r.createdAt,
        updateAt: r.updatedAt
      }
    return res.send({
        ok:true,
        data
    })

}//todo
/**PATCH /me (Editar Cuenta de Usuario)
    Descripción: Permite al usuario editar su información de perfil.
    Body:
        email, firstName, lastName: Campos opcionales para actualizar.
    Respuesta:
        200 OK: Perfil actualizado.
        400 Bad Request: Si el formato es incorrecto.
        401 Unauthorized: Si el usuario no está autenticado.
    Ejemplo de Respuesta:

    {
      "ok": true,
      "data": {
        "id": 2,
        "username": "miUsuario",
        "email": "nuevo@mail.com",
        "firstName": "Nombre",
        "lastName": "Apellido",
        "createdAt": "2024-01-19 10:37:16-08",
        "updatedAt": "2024-01-19 11:00:16-08"
      } */
export const updateUserCtr = async(req:Request, res:Response)=>{
    const currentUser:TokenInfo | Err = checkToken(req)
    if("error" in currentUser)return res.status(currentUser.status).send({
        error:currentUser.cause || "ERROR",
        message: currentUser.message,
    })
    //todo check if user exist , token could keep an username that already is not longer used 

    const userUpdates = userUpdatesSchema.safeParse(req.body)
    if(userUpdates.success === false){
        return res.status(400).send({
          name:userUpdates.error.name,
          errors: userUpdates.error.errors.join(" "),
          cause: userUpdates.error.cause,
          message: userUpdates.error.message
        })
    }

    const updates = userUpdates.data
    if(updates.password)updates.password = signPass(updates.password)
    const r = await um.updateUser(currentUser.username, updates)
    if("error" in r)return res.status(r.status).send({
        error:r.cause || "ERROR",
        message: r.message,
    })
    const data ={
        id:r.id,
        username:r.username,
        email: r.email || "",
        lastName: r.lastName || "",
        firstName: r.firstName || "",
        createAt: r.createdAt,
        updateAt: r.updatedAt
      }
    return res.send({
        ok:true,
        data
    })
}
//todo
/**
DELETE /me (Eliminar Cuenta de Usuario)

    Descripción: Permite al usuario eliminar su cuenta.
    Respuesta:
        200 OK: Cuenta eliminada.
        401 Unauthorized: Si el usuario no está autenticado.
    Ejemplo de Respuesta:

    {
      "ok": true
    }

 */
export const deleteUserCtr = async(req:Request, res:Response)=>{
    const currentUser:TokenInfo | Err = checkToken(req)
    if("error" in currentUser)return res.status(currentUser.status).send({
        error:currentUser.cause || "ERROR",
        message: currentUser.message,
    })

    const r = await um.deleteUser(currentUser.username)
    if("error" in r)return res.status(r.status).send({
        error:r.cause || "ERROR",
        message: r.message,
    })
    return res.send(r)

}//todo
/**

POST /signup (Crear Cuenta)

Descripción: Permite a un nuevo usuario registrarse en la plataforma.

Body:

    username, password: Campos requeridos para el registro.

Respuesta:

    201 Created: Cuenta creada.
    400 Bad Request: Si falta información o el formato es incorrecto.

Ejemplo de Respuesta:

{
  "ok": true,
  "data": {
    "id": 20,
    "username": "nuevoUsuario",
    "email": "un-mail@example.com",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "createdAt": "2024-01-19 10:37:16-08",
    "updatedAt": "2024-01-19 10:37:16-08"
  }
}

 */
export const createUserCtr = async(req:Request, res:Response)=>{
  const newUserInfo = userSquema.safeParse(req.body)
  if(newUserInfo.success === false){
    return res.status(400).send({
      name:newUserInfo.error.name,
      errors: newUserInfo.error.errors.join(" "),
      cause: newUserInfo.error.cause,
      message: newUserInfo.error.message
    })

  }
  newUserInfo.data.password = signPass(newUserInfo.data.password)

  const newUser = await um.createUser(newUserInfo.data)
  if("error" in newUser){
    return res.status(newUser.status).send({
      message: newUser.message || "something went wrong",
      cause: newUser.code ? newUser.cause : "server internarl problem",
      stack: newUser.stack
    })
  }
  const data ={
    id:newUser.id,
    username:newUser.username,
    email: newUser.email || "",
    lastName: newUser.lastName || "",
    firstName: newUser.firstName || "",
    createAt: newUser.createdAt,
    updateAt: newUser.updatedAt
  }

  return res.status(201).send({
    ok:true,
    data
  })
}
/**

POST /login (Iniciar Sesión)

    Descripción: Permite a un usuario existente iniciar sesión.
    Body:
        username, password: Credenciales requeridas para el inicio de sesión.
    Respuesta:
        200 OK: Sesión iniciada, retorna token JWT.
        401 Unauthorized: Credenciales incorrectas.
    Ejemplo de Respuesta:

    {
      "ok": true,
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5..."
      }
    }

 */
export const loginUserCtr = async(req:Request, res:Response)=>{
    const newLog = loginSchema.safeParse(req.body)
    if(newLog.success === false){
        return res.status(400).send({
            name:newLog.error.name,
            errors: newLog.error.errors.join(" "),
            cause: newLog.error.cause,
            message: newLog.error.message
        })
    }
    const user = await um.getUser(newLog.data.username)
    if("error" in user)return res.status(user.status).send(user)
    if(!checkPass(newLog.data.password, user))return res.status(401).send({
            error:"invalid credentials",
            message:"there is incorrect password or username"
        })
   const ti:TokenInfo = {
        username: user.username,
        role: user.role
    }
    const secret =  dotenv.SECRET_TOKEN || ""
    const data = jwt.sign(ti, secret, {expiresIn:"1h"})
    return res.send({ok:true, data})
}//todo
