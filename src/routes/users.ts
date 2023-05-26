import { FastifyInstance } from 'fastify'

export async function usersRoute(app: FastifyInstance) {
  app.get('/users', (request, reply) => {
    reply.send({ message: 'Hello World!' })
  })
}
