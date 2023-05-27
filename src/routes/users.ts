import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
// import { AppError } from '../utils/AppError'

export async function usersRoute(app: FastifyInstance) {
  app.post('/users', async (request) => {
    const registerBodySchema = z.object({
      username: z.string().min(3),
      password: z.string().min(6),
    })

    const { username, password } = registerBodySchema.parse(request.body)

    // const checkUserExists = await prisma.user.findMany({
    //   where: { username },
    // })

    // if (checkUserExists) {
    //   throw new AppError('This username already in use')
    // }

    const user = await prisma.user.create({
      data: {
        username,
        password,
      },
    })

    return user
  })
}
