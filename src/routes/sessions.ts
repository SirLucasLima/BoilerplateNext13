import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AppError } from '../utils/AppError'
import { compare } from 'bcryptjs'
import { authConfig } from '../configs/auth'
import { sign } from 'jsonwebtoken'

export async function sessionsRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const registerBodySchema = z.object({
      username: z.string().min(3),
      password: z
        .string()
        .min(6)
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/),
    })

    try {
      const { username, password } = registerBodySchema.parse(request.body)

      const user = await prisma.user.findUniqueOrThrow({
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

      return { user, token }
    } catch (error) {
      // Tratamento de erros
      console.error(error)
      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ error: error.message })
      }
      return reply.status(500).send({ error: 'Erro ao autenticar o usuário' })
    }
  })
}
