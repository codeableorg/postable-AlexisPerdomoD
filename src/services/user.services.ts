import { Request, Response } from "express";

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
export const getUserCtr = async(req:Request, res:Response)=>{}//todo
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
export const updateUserCtr = async(req:Request, res:Response)=>{}//todo
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
export const deleteUserCtr = async(req:Request, res:Response)=>{}//todo
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
export const createUserCtr = async(req:Request, res:Response)=>{}//todo
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
export const loginUserCtr = async(req:Request, res:Response)=>{}//todo
