import fastify from 'fastify'
import { knex } from './database'
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
    port: 3000,
  })
  .then(() => {
    console.log('Server started on port 3000')
  })
