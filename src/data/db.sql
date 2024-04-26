CREATE TABLE
    "Users" (
        id SERIAL PRIMARY KEY,
        "username" VARCHAR(50) NOT NULL UNIQUE,
        "password" VARCHAR(50) NOT NULL,
        "email" VARCHAR(50) UNIQUE,
        "firstName" VARCHAR(50),
        "lastName" VARCHAR(50),
        "role" VARCHAR(10) NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMPTZ NOT NULL,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    "Posts" (
        id SERIAL PRIMARY KEY,
        "user_id" INT NOT NULL REFERENCES "Users" (id) ON DELETE CASCADE,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    "Likes" (
        "createdAt" TIMESTAMPTZ NOT NULL,
        user_id INT NOT NULL REFERENCES "Users" (id) ON DELETE CASCADE,
        post_id INT NOT NULL REFERENCES "Posts" (id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, post_id)
    );

CREATE INDEX idx_username ON "Users" (username);

/*

Users

id: Identificador único del usuario. Restricción: Clave primaria.
username: Apodo de usuario. Restricción: Único, no nulo.
password: Contraseña del usuario, almacenada de manera segura. Restricción: No nulo.
email: Email del usuario. Restricción: Único, puede ser nulo.
firstName: Nombre del usuario. Restricción: Puede ser nulo.
lastName: Apellido del usuario. Restricción: Puede ser nulo.
role: Rol del usuario, con valores 'user' o 'admin'. Restricción: No nulo, "user" por defecto.
createdAt: Fecha y hora de creación del usuario. Restricción: No nulo.
updatedAt: Fecha y hora de la última actualización del usuario. Restricción: No nulo.



Posts

id: Identificador único del post. Restricción: Clave primaria.
userId: Identificador del usuario que creó el post. Restricción: Clave foránea, no nulo.
content: Contenido del post. Restricción: No nulo.
createdAt: Fecha y hora de creación del post. Restricción: No nulo.
updatedAt: Fecha y hora de la última actualización del post. Restricción: No nulo.

Likes

id: Identificador único del like. Restricción: Clave primaria.
postId: Identificador del post al que se le dio like. Restricción: Clave foránea, no nulo.
userId: Identificador del usuario que dio like. Restricción: Clave foránea, no nulo.
createdAt: Fecha y hora en que se dio el like. Restricción: No nulo.


Unicidad en Likes: La combinación de postId y userId en la tabla Likes debe ser única para evitar likes duplicados.
Restricciones de Datos: Deberás aplicar restricciones adecuadas en cuanto a longitud y formato de los datos según tu criterio (por ejemplo, longitud máxima de username o formato de email).

 */