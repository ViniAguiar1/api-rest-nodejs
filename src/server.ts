import { app } from "./app"

// Iniciar o servidor
app.listen({ port: 3000 }).then(() => {
  console.log('Server started on port 3000')
})
