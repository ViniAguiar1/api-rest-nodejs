import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import cookie from '@fastify/cookie'
import { TransactionsRoutes } from './routes/transactions'

// Criando uma instância do Fastify
const app = fastify()
app.register(cookie)
app.register(fastifySwagger, {
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
  }
})
app.register(fastifySwaggerUi, {
  routePrefix: '/documentation', // Caminho para acessar a documentação
  uiConfig: {
    docExpansion: 'none', // Define para não expandir os métodos por padrão
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
