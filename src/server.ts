import fastify from 'fastify'
import cors from '@fastify/cors'
import { usersRoute } from './routes/users'

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(usersRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server running on port http://localhost:3333')
  })
