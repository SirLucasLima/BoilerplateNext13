import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

export async function usersRoute(app: FastifyInstance) {
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

      const hashedPassword = await hash(password, 12) // Aumentar o fator de trabalho para 12

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      })

      return reply.send(user)
    } catch (error) {
      // Tratamento de erros
      console.error(error)
      return reply.status(500).send({ error: 'Erro ao criar o usuário' })
    }
  })
}
