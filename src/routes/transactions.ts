import { FastifyInstance } from "fastify"
import { knex } from "../database"

export async function TransactionsRoutes(app: FastifyInstance){
    app.get('/hello', async () => {
        const transaction = await knex('transactions')
        .where('amount', '>', 200)
        .select('*')
      
        return transaction
      })
}