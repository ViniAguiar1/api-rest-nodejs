import fastify from 'fastify';

const app = fastify();

app.get('/hello', async (request, reply) => {
  return { hello: 'world' };
});


app.listen({
  port: 3000,
}).then(() => {
  console.log('Server started on port 3000');
})