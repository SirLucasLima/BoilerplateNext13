import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { usersRoute } from './routes/users'
import { sessionsRoutes } from './routes/sessions'
import { productsRoute } from './routes/products'
import { uploadRoutes } from './routes/upload'
import { resolve } from 'node:path'

const app = fastify()

app.register(multipart)

app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(cors, {
  origin: true,
})

app.register(uploadRoutes)
app.register(usersRoute)
app.register(sessionsRoutes)
app.register(productsRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('👍 HTTP server running on port http://localhost:3333')
  })
