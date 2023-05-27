import fastify from 'fastify'
import cors from '@fastify/cors'
import { usersRoute } from './routes/users'
import { sessionsRoutes } from './routes/sessions'

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(usersRoute)
app.register(sessionsRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server running on port http://localhost:3333')
  })
