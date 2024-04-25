import { Request, Response } from "express"
/* 
Parámetros Query:

    page: Número de página (opcional, por defecto 1).
    limit: Número de posts por página (opcional, por defecto 10).
    username: Filtrar posts por nombre de usuario (opcional).
    orderBy: Criterio de ordenación, opciones: createdAt, likesCount (opcional, por defecto createdAt).
    order: Dirección de la ordenación, opciones: asc, desc (opcional, por defecto asc).

{
  "ok": true,
  "data": [
    {
      "id": 1,
      "content": "Este es un post",
      "createdAt": "2024-01-19 07:37:16-08",
      "updatedAt": "2024-01-19 07:37:16-08",
      "username": "usuario1",
      "likesCount": 5
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 20,
    "totalPages": 2,
    "nextPage": 2,
    "previousPage": null, 
  }
}*/


export const GetPostsCtr = async(req:Request, res:Response)=>{
//todo
}

/*
Parámetros:

    username: Usuario a consultar.

Parámetros Query:

    page: Número de página (opcional, por defecto 1).
    limit: Número de posts por página (opcional, por defecto 10).
    orderBy: Criterio de ordenación, opciones: createdAt, likesCount (opcional, por defecto createdAt).
    order: Dirección de la ordenación, opciones: asc, desc (opcional, por defecto asc).

{
  "ok": true,
  "data": [
    {
      "id": 2,
      "content": "Post del usuario",
      "createdAt": "2024-01-19 05:37:16-08",
      "updatedAt": "2024-01-19 05:37:16-08",
      "username": "usuario-específico",
      "likesCount": 0
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 5,
    "totalPages": 1,
    "nextPage": null,
    "previousPage": null, 
  }
}
 */
// /:username
export const GetPostCtr = async(req:Request, res:Response)=>{
//todo
}

// POST /posts
/*Descripción: Permite a un usuario registrado crear un nuevo post.
Body:

    content: Texto del post.

Respuesta:

    201 Created: Post creado exitosamente.
    400 Bad Request: Si falta información o el formato es incorrecto.
    401 Unauthorized: Si el usuario no está autenticado.

    {
  "ok": true,
  "data": {
    "id": 10,
    "content": "Mi nuevo post",
    "createdAt": "2024-01-19 10:37:16-08",
    "updatedAt": "2024-01-19 10:37:16-08",
    "username": "mi-usuario",
    "likesCount": 0
  }
}
 */
export const createPostCtr = async(req:Request, res:Response)=>{}//todo

/*PATCH /posts/:id (Editar Post Existente)

    Descripción: Permite a un usuario registrado editar un post existente.
    Parámetros URL:
        id: ID del post a editar.
    Body:
        content: Texto actualizado del post. (El campo es opcional, pero se debe enviar al menos un campo para actualizar)
    Respuesta:
        200 OK: Post actualizado exitosamente. Devuelve el post actualizado.
        400 Bad Request: Si falta información, el formato es incorrecto o no se envía ningún campo para actualizar.
        401 Unauthorized: Si el usuario no está autenticado o no es el propietario del post.
        404 Not Found: Si el post no existe.

        {
  "ok": true,
  "data": {
    "id": 10,
    "content": "Mi post actualizado",
    "createdAt": "2024-01-19 10:37:16-08",
    "updatedAt": "2024-01-19 11:00:00-08",
    "username": "mi-usuario",
    "likesCount": 0
  }
}
 */
export const updatePostCtr = async(req:Request, res:Response) =>{}//todo

/**

POST /posts/:postId/like (Dar Like a un Post) (DELETE) para eliminar like

    Descripción: Permite a un usuario registrado dar "Like" a un post.
    Parámetros:
        postId: ID del post a dar like.
    Respuesta:
        200 OK: Like registrado.
        404 Not Found: Si el post no existe.
        401 Unauthorized: Si el usuario no está autenticado.
    Ejemplo de Respuesta:

    {
      "ok": true,
      "data": {
        "id": 15,
        "content": "Mi nuevo post",
        "createdAt": "2024-01-19 10:37:16-08",
        "updatedAt": "2024-01-19 10:37:16-08",
        "username": "usuario",
        "likesCount": 1
      }
    }

 */
    export const updateLikeCtr = async(req:Request, res:Response) =>{}//todo
