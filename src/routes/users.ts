import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'
import { AppError } from '../utils/AppError'

export async function usersRoute(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const registerBodySchema = z.object({
      username: z.string().min(3),
      password: z
        .string()
        .min(6)
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/),
    })

    const { username, password } = registerBodySchema.parse(request.body)

    const userExists = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (userExists) {
      throw new AppError('Username already taken', 400)
    }

    const hashedPassword = await hash(password, 10)
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    })

    return reply.send(user)
  })
}
