import { FastifyInstance } from 'fastify'
import { AppError } from '../utils/AppError'
import { prisma } from '../lib/prisma'
import { verify } from 'jsonwebtoken'
import { authConfig } from '../configs/auth'
import { z } from 'zod'

export async function productsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError('Missing JWT token', 401)
    }

    try {
      const [, token] = authHeader.split(' ')
      const { secret } = authConfig.jwt

      const decoded = verify(token, secret) as { sub: string }
      request.id = decoded.sub // Armazena o ID do usuário na propriedade personalizada
    } catch (error) {
      throw new AppError('Invalid JWT token', 401)
    }
  })

  app.get('/products', async (request, reply) => {
    const products = await prisma.product.findMany()
    reply.send(products)
  })

  app.get('/products/search', async (request, reply) => {
    const productSearchQuerySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
    })

    const { name, description, price } = productSearchQuerySchema.parse(
      request.query,
    )

    const filteredProducts = await prisma.product.findMany({
      where: {
        name: {
          contains: name || undefined,
        },
        description: {
          contains: description || undefined,
        },
        price: {
          equals: price || undefined,
        },
      },
    })

    reply.send(filteredProducts)
  })
}
