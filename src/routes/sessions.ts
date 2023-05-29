import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AppError } from '../utils/AppError'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { authConfig } from '../configs/auth'

export async function sessionsRoutes(app: FastifyInstance) {
  app.post('/sessions/signin', async (request, reply) => {
    const registerBodySchema = z.object({
      username: z.string().min(3),
      password: z
        .string()
        .min(6)
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/),
    })

    const { username, password } = registerBodySchema.parse(request.body)

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (!user) {
      throw new AppError('Invalid username', 401)
    }

    const passwordValidation = await compare(password, user.password)
    if (!passwordValidation) {
      throw new AppError('Invalid username or password', 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    return reply.send({ user, token })
  })
}
