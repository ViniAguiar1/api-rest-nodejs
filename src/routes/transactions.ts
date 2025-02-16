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
    
    // Rota GET / - Listar todas as transações
    app.get(
      '/',
      {
        schema: {
          description: 'Get all transactions',
          tags: ['transactions'],
          response: {
            200: {
              description: 'Lista de transações',
              type: 'object',
              properties: {
                transactions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      title: { type: 'string' },
                      amount: { type: 'number' },
                      type: { type: 'string', enum: ['credit', 'debit'] },
                    },
                  },
                },
              },
            },
          },
        },
      },
      async () => {
        const transactions = await knex('transactions').select('*')
        return { transactions }
      }
    )
  
    // Rota GET /:id - Obter transação por ID
    app.get(
      '/:id',
      {
        schema: {
          description: 'Get a single transaction by ID',
          tags: ['transactions'],
          params: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
            },
            required: ['id'],
          },
          response: {
            200: {
              description: 'Transação encontrada',
              type: 'object',
              properties: {
                transaction: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    title: { type: 'string' },
                    amount: { type: 'number' },
                    type: { type: 'string', enum: ['credit', 'debit'] },
                  },
                },
              },
            },
            404: {
              description: 'Transação não encontrada',
              type: 'string',
              example: 'Transaction not found',
            },
          },
        },
      },
      async (req, res) => {
        const getTrasanctionsParamsSchema = z.object({
          id: z.string().uuid(),
        })
  
        const { id } = getTrasanctionsParamsSchema.parse(req.params)
  
        const transaction = await knex('transactions').where('id', id).first()
  
        if (!transaction) {
          return res.status(404).send('Transaction not found')
        }
  
        return { transaction }
      }
    )
  }

