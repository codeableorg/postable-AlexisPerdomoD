import { PoolClient, QueryConfig, QueryResult } from "pg"
import { Err, PostsResponse, Query, Res } from "../models/general.model"
import { FormatedPost, Post, PostInfo, User } from "../models/schemas.model"
import logger from "../config/logger.config"

export default class PostManager {
    #getDB: () => Promise<PoolClient>
    constructor(getDB: () => Promise<PoolClient>) {
        this.#getDB = getDB
    }
    //todo
    async getPosts(querys: Query): Promise<PostsResponse | Err> {
        try {
            const client = await this.#getDB()
            const { orderBy, order, limit, page, username } = querys
            let pageNumber =
                isNaN(parseInt(page)) && parseInt(page) < 0 ? 1 : parseInt(page)
            let limitNumber =
                isNaN(parseInt(limit)) && parseInt(limit) < 0
                    ? 1
                    : parseInt(limit)
            const offset = pageNumber === 1 ? 0 : (pageNumber - 1) * limitNumber
            const SQLQuery: QueryConfig = {
                text: `
                    SELECT p.id,  p.content, u.username AS username,
                    COUNT(l.post_id) AS likesCount, p."createdAt", p."updatedAt"
                    FROM "Posts" AS p
                    INNER JOIN "Users" AS u ON p.user_id = u.id
                    LEFT JOIN "Likes" AS l ON p.id = l.post_id
                    GROUP BY p.id, p.content, u.username, p."createdAt", p."updatedAt"
                    ORDER BY $1 LIMIT $2 OFFSET $3
                    `,
                values: [`${orderBy} ${order}`, limitNumber, offset],
            }
            const countQuery: QueryConfig = {
                text: `SELECT COUNT(*) FROM "Posts"`,
                values: [],
            }

            if (username) {
                //post the user have wroten
                SQLQuery.text = `
                SELECT p.id,  p.content, u.username AS username,
                COUNT(l.post_id) AS likesCount, p."createdAt", p."updatedAt"
                FROM "Posts" AS p
                INNER JOIN "Users" AS u ON p.user_id = u.id
                LEFT JOIN "Likes" AS l ON p.id = l.post_id
                WHERE u.username = $4
                GROUP BY p.id, p.content, u.username, p."createdAt", p."updatedAt"
                ORDER BY $1 LIMIT $2 OFFSET $3
                `
                countQuery.text += `WHERE "user_id" = (
                    SELECT id
                    FROM "Users"
                    WHERE "username" = $1
                )`
                SQLQuery.values?.push(username)
                countQuery.values?.push(username)
            }

            SQLQuery.text += ";"
            countQuery.text += `;`
            const response: QueryResult<FormatedPost> = await client.query(
                SQLQuery
            )
            const totalCount = await client.query(countQuery)
            const totalCountNumber = parseInt(totalCount.rows[0].count, 10)
            return {
                ok: true,
                data: response.rows,
                pagination: {
                    page: pageNumber,
                    pageSize:
                        totalCountNumber && totalCountNumber > limitNumber
                            ? limitNumber
                            : totalCountNumber,
                    totalItems: totalCountNumber,
                    totalPages: Math.ceil(
                        (totalCountNumber || 0) / limitNumber
                    ),
                    nextPage: null,
                    previusPage: null,
                },
            }
        } catch (error) {
            logger.debug(error)
            if (error instanceof Error) {
                if ("name" in error && error.name === "TypeError") {
                    const err = {
                        error: true,
                        status: 400,
                        cause: error.message,
                        message: "bad request",
                        name: error.name,
                        stack: error.stack,
                        code: "",
                    }
                    if ("code" in error)
                        err.code =
                            typeof error.code === "string" ? error.code : ""
                }
                return {
                    error: true,
                    status: 500,
                    cause: error.message,
                    message: "something whent wrong",
                    name: error.name,
                    stack: error.stack,
                }
            }
            return {
                error: true,
                message: "internal error server",
                status: 500,
            }
        }
    }
    async createPost(
        p: PostInfo,
        username: string
    ): Promise<{ ok: boolean; data: FormatedPost } | Err> {
        try {
            const client = await this.#getDB()
            const { user_id, content, createdAt, updatedAt } = p
            const response: QueryResult<Post> = await client.query({
                text: `
                INSERT INTO "Posts"(user_id, content, "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4) RETURNING *;`,
                values: [user_id, content, createdAt, updatedAt],
            })
            const data: FormatedPost = {
                content: response.rows[0].content,
                id: response.rows[0].id,
                createdAt: response.rows[0].createdAt,
                updatedAt: response.rows[0].updatedAt,
                likesCount: 0,
                username,
            }
            return {
                ok: true,
                data,
            }
        } catch (error) {
            logger.debug(error)
            if (error instanceof Error) {
                if ("name" in error && error.name === "TypeError") {
                    const err = {
                        error: true,
                        status: 400,
                        cause: error.message,
                        message: "bad request",
                        name: error.name,
                        stack: error.stack,
                        code: "",
                    }
                    if ("code" in error)
                        err.code =
                            typeof error.code === "string" ? error.code : ""
                }
                return {
                    error: true,
                    status: 500,
                    cause: error.message,
                    message: "something whent wrong",
                    name: error.name,
                    stack: error.stack,
                }
            }
            return {
                error: true,
                message: "internal error server",
                status: 500,
            }
        }
    }
    async getPostsLikedByUser(u: User, querys: Query):Promise<PostsResponse | Err> {
        try {
            const client = await this.#getDB()
            const { orderBy, order, limit, page } = querys
            let pageNumber =
                isNaN(parseInt(page)) && parseInt(page) < 0 ? 1 : parseInt(page)
            let limitNumber =
                isNaN(parseInt(limit)) && parseInt(limit) < 0
                    ? 1
                    : parseInt(limit)
            const offset = pageNumber === 1 ? 0  : (pageNumber - 1) * limitNumber
            const SQLQuery: QueryConfig = {
                text: `
                    SELECT p.id, p.content, u.username AS username,
                    COUNT(l.post_id) AS likesCount, p."createdAt", p."updatedAt"
                    FROM "Posts" AS p
                    INNER JOIN "Users" AS u ON u.id = p.user_id
                    INNER JOIN "Likes" AS l on p.id = l.post_id
                    WHERE l.user_id = $1
                    GROUP BY p.id, p.content, u.username, p."createdAt", p."updatedAt"
                    ORDER BY $2 LIMIT $3 OFFSET $4;`,
                values: [u.id, `${orderBy} ${order}`, limitNumber, offset],
            }
            const countQuery: QueryConfig = {
                text: `
                SELECT COUNT(*) FROM "Post" AS p
                INNER JOIN "Likes" AS l ON l.post_id = p.id
                WHERE l.user_id = $1;`,
                values: [u.id],
            }
            const response: QueryResult<FormatedPost> = await client.query(
                SQLQuery
            )
            const totalCount = await client.query(countQuery)
            const totalCountNumber = parseInt(totalCount.rows[0].count, 10)
            return {
                ok: true,
                data: response.rows,
                pagination: {
                    page: pageNumber,
                    pageSize:
                        totalCountNumber && totalCountNumber > limitNumber
                            ? limitNumber
                            : totalCountNumber,
                    totalItems: totalCountNumber,
                    totalPages: Math.ceil(
                        (totalCountNumber || 0) / limitNumber
                    ),
                    nextPage: null,
                    previusPage: null,
                },
            }
        } catch (error) {
            logger.debug(error)
            if (error instanceof Error) {
                if ("name" in error && error.name === "TypeError") {
                    const err = {
                        error: true,
                        status: 400,
                        cause: error.message,
                        message: "bad request",
                        name: error.name,
                        stack: error.stack,
                        code: "",
                    }
                    if ("code" in error)
                        err.code =
                            typeof error.code === "string" ? error.code : ""
                }
                return {
                    error: true,
                    status: 500,
                    cause: error.message,
                    message: "something whent wrong",
                    name: error.name,
                    stack: error.stack,
                }
            }
            return {
                error: true,
                message: "internal error server",
                status: 500,
            }
        }
    }
    async getFormatedPostById(id: number):Promise<Res<FormatedPost> | Err> {
        try {
            const client = await this.#getDB()
            const query: QueryConfig = {
                text: `SELECT p.id, p.content, u.username AS username,
                    COUNT(l.post_id) AS likesCount, p."createdAt", p."updatedAt"
                    FROM "Posts" AS p
                    INNER JOIN "Users" AS u ON u.id = p.user_id
                    INNER JOIN "Likes" AS l on p.id = l.post_id
                    WHERE p.id = $1
                    GROUP BY p.id, p.content, u.username, p."createdAt", p."updatedAt"`,
                values: [id],
            }
            const response: QueryResult<FormatedPost> = await client.query(
                query
            )
            if (response.rowCount === 0)
                return {
                    error: true,
                    message: "post not found",
                    status: 404,
                }
            return {
                ok: true,
                data: response.rows[0],
            }
        } catch (error) {
            logger.debug(error)
            if (error instanceof Error) {
                if ("name" in error && error.name === "TypeError") {
                    const err = {
                        error: true,
                        status: 400,
                        cause: error.message,
                        message: "bad request",
                        name: error.name,
                        stack: error.stack,
                        code: "",
                    }
                    if ("code" in error)
                        err.code =
                            typeof error.code === "string" ? error.code : ""
                }
                return {
                    error: true,
                    status: 500,
                    cause: error.message,
                    message: "something whent wrong",
                    name: error.name,
                    stack: error.stack,
                }
            }
            return {
                error: true,
                message: "internal error server",
                status: 500,
            }
        }
    }
    async getPostById(id: number):Promise<Res<Post> | Err> {
        try {
            const client = await this.#getDB()
            const query: QueryConfig = {
                text: `SELECT * FROM "Post" WHERE id = $1`,
                values: [id],
            }
            const response: QueryResult<Post> = await client.query(query)
            if (response.rowCount === 0)
                return {
                    error: true,
                    message: "post not found",
                    status: 404,
                }
            return {
                ok: true,
                data: response.rows[0],
            }
        } catch (error) {
            logger.debug(error)
            if (error instanceof Error) {
                if ("name" in error && error.name === "TypeError") {
                    const err = {
                        error: true,
                        status: 400,
                        cause: error.message,
                        message: "bad request",
                        name: error.name,
                        stack: error.stack,
                        code: "",
                    }
                    if ("code" in error)
                        err.code =
                            typeof error.code === "string" ? error.code : ""
                }
                return {
                    error: true,
                    status: 500,
                    cause: error.message,
                    message: "something whent wrong",
                    name: error.name,
                    stack: error.stack,
                }
            }
            return {
                error: true,
                message: "internal error server",
                status: 500,
            }
        }
    }
    async updatePost(post: Post, update: string) {
        try {
            const client = await this.#getDB()
            await client.query({
                text: `UPDATE "Posts" SET content = $1 WHERE id = $2;`,
                values: [update, post.id],
            })
            return this.getFormatedPostById(post.id)
        } catch (error) {
            logger.debug(error)
            if (error instanceof Error) {
                if ("name" in error && error.name === "TypeError") {
                    const err = {
                        error: true,
                        status: 400,
                        cause: error.message,
                        message: "bad request",
                        name: error.name,
                        stack: error.stack,
                        code: "",
                    }
                    if ("code" in error)
                        err.code =
                            typeof error.code === "string" ? error.code : ""
                }
                return {
                    error: true,
                    status: 500,
                    cause: error.message,
                    message: "something whent wrong",
                    name: error.name,
                    stack: error.stack,
                }
            }
            return {
                error: true,
                message: "internal error server",
                status: 500,
            }
        }
    }
}

// para buscar post a los cuales un usuario en especifico ha dado like
//WHERE l.user_id = id_usuario_especifico

