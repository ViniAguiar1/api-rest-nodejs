import fastify from 'fastify'
import fastifySwagger from 'fastify-swagger'
import { knex } from './database'
import { env } from './env'
import { TransactionsRoutes } from './routes/transactions'

// Criando uma instância do Fastify
const app = fastify()

// Registrar o plugin Swagger
app.register(fastifySwagger, {
  routePrefix: '/documentation', // Caminho para acessar a documentação
  swagger: {
    info: {
      title: 'API de Transações',
      description: 'API para gerenciar transações',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    tags: [
      { name: 'transactions', description: 'Gestão de transações' }
    ],
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  staticCSP: true,
  exposeRoute: true, // Torna a rota de documentação disponível
})

// Registrar as rotas de transações com o prefixo 'transactions'
app.register(TransactionsRoutes, {
  prefix: '/transactions',
})

// Iniciar o servidor
app.listen({ port: 3000 }).then(() => {
  console.log('Server started on port 3000')
})
