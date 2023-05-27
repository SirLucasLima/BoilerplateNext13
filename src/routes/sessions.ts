// const AppError = require("../utils/AppError")
// const knex = require("../database/knex");
// const { compare } = require("bcryptjs");
// const authConfig = require("../configs/auth")
// const { sign } = require("jsonwebtoken")

// class SessionsController {
//   async create(request, response){
//     const { email, password } = request.body

//     const user = await knex("users").where({ email }).first()
//     if (!user) {
//       throw new AppError("Invalid email or password", 401)
//     }

//     const passwordValidation = await compare(password, user.password)
//     if(!passwordValidation) {
//       throw new AppError("Invalid email or password", 401)
//     }

//     const { secret, expiresIn } = authConfig.jwt
//     const token = sign({}, secret, {
//       subject: String(user.id),
//       expiresIn
//     })

//     return response.json({ user, token })
//   }
// }

// module.exports = SessionsController

import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AppError } from '../utils/AppError'
import { compare } from 'bcryptjs'
import { authConfig } from '../configs/auth'
import { sign } from 'jsonwebtoken'

export async function sessionsRoutes(app: FastifyInstance) {
  app.post('/users', async (request, response) => {
    const registerBodySchema = z.object({
      username: z.string().min(3),
      password: z.string().min(6),
    })

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
      throw new AppError('Invalid email or password', 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    return { user, token }
  })
}
