import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function productsRoutes(app: FastifyInstance) {
  app.get('/products', async () => {
    const products = await prisma.products.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return products.map((product: { id: any }) => {
      return {
        id: product.id,
      }
    })
  })
}
