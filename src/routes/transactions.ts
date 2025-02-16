import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'

export async function TransactionsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: {
        description: 'Cria uma nova transação',
        tags: ['transactions'],
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            amount: { type: 'number' },
            type: { type: 'string', enum: ['credit', 'debit'] },
          },
          required: ['title', 'amount', 'type'],
        },
        response: {
          201: {
            description: 'Transação criada com sucesso',
            type: 'string',
          },
        },
      },
    },
    async (req, res) => {
      const createTransactionSchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['credit', 'debit']),
      })

      const { title, amount, type } = createTransactionSchema.parse(req.body)

      await knex('transactions').insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
      })

      return res.status(201).send('Transaction created')
    }
  )
}
