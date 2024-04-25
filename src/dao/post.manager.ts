import { PoolClient, QueryConfig } from "pg";
import { Query } from "../models/general.model";

export default class PostManager{
    #getDB:()=> Promise<PoolClient>
    #baseConfig:QueryConfig
    constructor(getDB:()=> Promise<PoolClient>){
        this.#getDB = getDB
        this.#baseConfig = {
            text: `
                SELECT p.id, p.title, p.content, u.username AS username,
                COUNT(l.post_id) AS likesCount
                FROM Posts AS p
                INNER JOIN Users AS u ON p.user_id = u.id
                LEFT JOIN likes AS l ON p.id = l.post_id
                GROUP BY p.id, p.title, p.content, u.username
                ORDER BY $1 $2 LIMIT $3 OFFSET $4
                `,
        }
    }
    async getPosts(querys:Query){
        try {
            const client = await this.#getDB()
            const SQLQuery = this.#baseConfig
            const {orderBy, order, limit, page, username} = querys
            const offset = page === 1 ? 0 : (page - 1) * limit

            if(username){
                //post the user have wroten
                SQLQuery.text += " AND u.username = $5;"
                SQLQuery.values = [orderBy, order, limit, offset, username]
                return await client.query(SQLQuery)
            }
            SQLQuery.text += ";"
            SQLQuery.values = [orderBy, order, limit, offset]
            return await client.query(SQLQuery)

        } catch (error) {
            console.error(error)
            return {
                error:true,
                message:"internal error server",
                status:500
            }
        }
    }
}

// para buscar post a los cuales un usuario en especifico ha dado like 
//WHERE l.user_id = id_usuario_especifico