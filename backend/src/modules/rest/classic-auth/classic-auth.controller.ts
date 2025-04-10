import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common'
import { Res } from '@nestjs/common'
import { ClassicAuthService } from './classic-auth.service'
import { FastifyRequest, FastifyReply } from 'fastify'
import { 
    SignInDto, 
    SignUpDto, 
    SignInSuccessDto, 
    FailDto 
} from './classic-auth.schema'

import {
  ApiCreatedResponse,
  ApiResponse,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger'

//import {
//  SignInResponseDesc,
//  SignInBodyDesc,
//  SignInValidationFailedDesc,
//} from './auth.constants'

import { Role, User as UserModel } from '@prisma/client'
//import { Role } from '@prisma/client'

import { AccessoryService } from '@modules/accessory/accessory.service'
import { CryptoService } from '@modules/crypto/crypto.service'
import { UserService } from '@modules/rest/user/user.service'
import { AppConfigService } from '@modules/config/config.service'

import { AuthGuard } from './classic-auth.guard'

@ApiTags('classic-auth')
@Controller('classic-auth')
export class ClassicAuthController {
  constructor(
    private readonly service: ClassicAuthService,
    private readonly accessory: AccessoryService,
    private readonly crypto: CryptoService,
    private readonly userService: UserService,
    private readonly env: AppConfigService,
  ) {}

  
  @Post('sign-in')
  @ApiCreatedResponse({
    //description: SignInResponseDesc,
    type: SignInSuccessDto,
  })
  //@ApiResponse({
    //status: 403,
    //description: SignInValidationFailedDesc,
  //})
  //@ApiResponse({
    //status: 401,
    //description: 'UNAUTHORIZED',
    //type: FailDto,
  //})
  @ApiBody({
    //description: SignInBodyDesc,
    type: SignInDto,
  })
  async signIn(
    @Body() credentials: SignInDto,
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<SignInSuccessDto> {
    const { email, password } = credentials
    const user: UserModel = await this.service.signIn(email, password)

    if (!user) {
      return reply.code(401).send({ statusCode: 401, message: 'UNAUTHORIZED' })
    }

    // 2FA is not enabled for this account,
    // so create a new session for this user.
    //await updateSession(request, reply, user)
    const userId = user.id
    const userRole = user.role

    const maxAge = this.env.getSessionMaxAge()
    const sessionExpires = new Date(Date.now() + maxAge)
    const options = {
      ...request.server.cookieOptions,
      expires: sessionExpires,
    }
    
    let sessionId = ''
    // vitest request has no session, so we should ignore creating cookies in this way
    if (request.session) {
      await request.session.regenerate()
      sessionId = request.session.sessionId || undefined
      request.session.userId = userId
      request.session.userRole = userRole || Role.GUEST

      this.accessory.createCookie({
        reply,
        name: 'sessionId',
        value: sessionId,
        options,
      })
    }

    // Vitest request does not create session, so we should create jwt as parameter 
    let jwtToken: string
    if (sessionId) {
      await this.accessory.createTokenCookies({
        userId,
        sessionId,
        reply,
        options,
      })
    } else {
      jwtToken = await this.accessory.signAsync(userId, user.name)
    }

    if (!user.verified) {
      //await sendVerifyEmail(request, reply, email)
    }

    const payload = {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      verified: user?.verified,
      authenticated: true,
      role: user?.role,
    }

    if (jwtToken) {
      payload['accessToken'] = jwtToken
    }

    return reply.code(201).send({ user: payload })
  }



  @Post('sign-up')
  async register(
    @Body() credentials: SignUpDto,
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    const { email, password, name } = credentials

    const saltLength = this.env.getSaltLength()

    //
    const existUser = await this.userService.user({ email, verified: true })
    if (existUser) {
      reply.code(409).send({ statusCode: 409, message: 'CONFLICT' })
    }

    try {
      const salt = await this.crypto.generateSalt(saltLength)
      const hashedPassword = await this.crypto.hash(password, salt)

      // Insert a record into the "user" collection.
      const data = {
        name,
        email,
        password: hashedPassword,
        salt,
        verified: false,
      }
      const user = await this.userService.createUser(data)

      if (user) {
        try {
          // After successfully creating a new user, automatically log in.
          return await this.signIn(credentials, request, reply)
          //reply.code(201).send(signInPayload)
        } catch (e) {
          console.log(e)
          reply.code(403).send({ statusCode: 403, message: 'FORBIDDEN' })
        }
      } else {
        reply.code(502).send({ statusCode: 502, message: 'DATABASE ERROR' })
      }

      //console.log(user)
    } catch (e) {
      //reply.code(reply.codeStatus.CONFLICT).send(e)
      //console.log(e)
      reply.code(409).send({ statusCode: 409, message: 'CONFLICT', error: e })
    }
  }



  @UseGuards(AuthGuard)
  @Get('sign-out')
  async logout(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    const id = request['userId']
    const user = await this.userService.user({ id })

    if (!user) {
      return reply
        .code(401)
        .send({ statusCode: 401, message: 'User not found' })
    }

    const maxAge = this.env.getSessionMaxAge()
    const sessionExpires = new Date(Date.now() + maxAge)
    const options = {
      ...request.server.cookieOptions,
      expires: sessionExpires,
    }
    
    let sessionId = ''
    // vitest request has no session, so we should ignore creating cookies in this way
    if (request.session) {
      await request.session.regenerate()
      sessionId = request.session.sessionId || undefined
      request.session.userId = user.id
      request.session.userRole = user.role || Role.GUEST

      this.accessory.createCookie({
        reply,
        name: 'sessionId',
        value: sessionId,
        options,
      })
    }
    // Clear the access and refresh token cookies for this session.
    this.accessory.clearCookie({
      reply,
      name: 'access-token',
      options,
    })
    this.accessory.clearCookie({ reply, name: 'refresh-token', options })

    reply.code(200).send({ statusCode: 200, message: 'User success sign out.' })
  }

}