import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
import { TransactionsRoutes } from './routes/transactions'
// import crypto from 'node:crypto'

const app = fastify()

app.register(TransactionsRoutes)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server started on port 3000')
  })
