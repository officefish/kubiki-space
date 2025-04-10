import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

import { Role } from '@prisma/client'
const roleEnum = z.nativeEnum(Role)

const email = {
  email: z.string().email(),
}

const password = {
  password: z
    .password() // string with advanced schemas
    .min(8) // Expect password length to be greater or equal to 8
    .max(36) // Expect password length to be less or equal to 100
    .atLeastOne('digit') // Expect password to have at least one digit
    .atLeastOne('lowercase') // Expect password to have at least one lowercase letter
    .atLeastOne('uppercase') // Expect password to have at least one uppercase letter
    .atLeastOne('special'), // Expect password to have at least one special symbol
}

const name = {
  name: z
    .string()
    .min(7, { message: 'Must be 7 or more characters long' })
    .max(24, { message: 'Must be 24 or less characters long' })
    .optional(),
}

const SignInSchema = z.object({
  ...email,
  ...password,
})

const SignUpSchema = z.object({
  ...email,
  ...password,
  ...name,
})

const SignInSuccessPayload = z.object({
  ...email,
  id: z.string(),
  name: z.string(),
  verified: z.boolean(),
  authenticated: z.boolean(),
  role: roleEnum,
  accessToken: z.string().optional(),
})

const SignInSuccessSchema = z.object({
  user: SignInSuccessPayload,
})

const FailSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
})

export class SignInDto extends createZodDto(SignInSchema) {}
export class SignUpDto extends createZodDto(SignUpSchema) {}
export class SignInSuccessDto extends createZodDto(SignInSuccessSchema) {}
export class FailDto extends createZodDto(FailSchema) {}