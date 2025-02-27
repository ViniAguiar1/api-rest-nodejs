import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

// Teste mais famosos

// Teste de integração: Testa a integração entre diferentes partes do sistema
// Teste de unidade: Testa uma unidade de código
// Teste de ponta a ponta: Testa o sistema como um todo

export async function TransactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req, res) => {
    console.log(`[${req.method}] ${req.url}`)
  })

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

      let sessionId = req.cookies.sessionId

      if (!sessionId) {
        sessionId = crypto.randomUUID()
        res.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        })
      }

      await knex('transactions').insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
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
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const { sessionId } = req.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select('*')
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
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const getTrasanctionsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTrasanctionsParamsSchema.parse(req.params)

      const { sessionId } = req.cookies

      const transaction = await knex('transactions')
      .where({
        id,
        session_id: sessionId,
      })
      .first()

      if (!transaction) {
        return res.status(404).send('Transaction not found')
      }

      return { transaction }
    }
  )

  // Rota GET /summary - Resumo da soma das transações
  app.get(
    '/summary',
    {
      schema: {
        description: 'Get the summary of all transactions (total amount)',
        tags: ['transactions'],
        response: {
          200: {
            description: 'Resumo das transações',
            type: 'object',
            properties: {
              summary: {
                type: 'object',
                properties: {
                  amount: { type: 'number' }, // A soma total do campo "amount"
                },
              },
            },
          },
        },
      },
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const { sessionId } = req.cookies

      const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .where('session_id', sessionId)
      .first()

      return { summary }
    }
  )
}

