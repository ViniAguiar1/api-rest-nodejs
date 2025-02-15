import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
// import crypto from 'node:crypto'

const app = fastify()

app.get('/hello', async () => {
  const transaction = await knex('transactions')
  .where('amount', '>', 200)
  .select('*')

  return transaction
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('Server started on port 3000')
  })
