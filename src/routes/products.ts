import { FastifyInstance } from 'fastify'
import { AppError } from '../utils/AppError'
import { prisma } from '../lib/prisma'

export async function productsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    const authheader = await request.headers.authorization

    if (!authheader) {
      throw new AppError('Invalid JWT token', 401)
    }
  })

  app.get('/products', async (request, reply) => {
    const products = await prisma.product.findMany()
    reply.send(products)
  })
}
