import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common'
  
  //import { JwtService } from '@nestjs/jwt'
  import { AccessoryService } from '@modules/accessory/accessory.service'
  import { UserService } from '@modules/rest/user/user.service'
  import { FastifyRequest } from 'fastify'
  
  import { Role } from '@prisma/client'
import { AppConfigService } from '@/modules/config/config.service'
  
  //import { jwtConstants } from './constants'
  //import { Request } from 'express'
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      protected accessory: AccessoryService,
      protected userService: UserService,
      protected env: AppConfigService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest()
  
      const sessionAccessToken = this.extractAccessTokenFromSession(request)
      if (sessionAccessToken !== undefined) {
        const userId = await this.accessory.verifyAsync(sessionAccessToken)
        if (userId) {
          request.userId = userId
          return true
        }
      }
  
      /* If access token is invalid, but refresh is valid than regenegate session */
      const sessionRefreshToken = this.extractRefreshTokenFromSession(request)
      if (sessionRefreshToken !== undefined) {
        const userId = await this.accessory.verifyAsync(sessionRefreshToken)
        if (userId) {
          request.userId = userId
          const user = await this.userService.user({ id: request.userId })
          const reply = context.switchToHttp().getResponse()
  
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
  
          if (sessionId) {
            await this.accessory.createTokenCookies({
              userId,
              sessionId,
              reply,
              options,
            })
          }
          return true
        }
      }
  
      const bearerAccessToken = this.extractTokenFromBearer(request)
      if (bearerAccessToken !== undefined) {
        const userId = await this.accessory.verifyAsync(bearerAccessToken)
        if (userId) {
          request.userId = userId
          return true
        }
      }
  
      //console.log('UnauthorizedException')
      throw new UnauthorizedException()
    }
  
    private extractAccessTokenFromSession(
      request: FastifyRequest,
    ): string | undefined {
      const accessToken =
        request.cookies && request.cookies['access-token']
          ? request.cookies['access-token']
          : undefined
      return accessToken
    }
  
    private extractRefreshTokenFromSession(
      request: FastifyRequest,
    ): string | undefined {
      const accessToken =
        request.cookies && request.cookies['refresh-token']
          ? request.cookies['refresh-token']
          : undefined
      return accessToken
    }
  
    private extractTokenFromBearer(request: FastifyRequest): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? []
      return type === 'Bearer' ? token : undefined
    }
  }
  
  @Injectable()
  export class AdminGuard extends AuthGuard implements CanActivate {
    constructor(
      protected accessory: AccessoryService,
      protected userService: UserService,
      protected env: AppConfigService,
    ) {
      super(accessory, userService, env)
    }
  
    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest()
      const success = await super.canActivate(context)
      if (!success) {
        throw new UnauthorizedException()
      }
  
      const user = await this.userService.user({ id: request.userId })
      const userRole = user.role
      if (userRole !== Role.ADMIN) {
        return false
      }
  
      // Basically if this guard is false then try the super.canActivate.  If its true then it would have returned already
      return true
    }
  }
  
  @Injectable()
  export class VisitorGuard implements CanActivate {
    constructor(
      protected accessory: AccessoryService,
      protected userService: UserService,
    ) {}
  
    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest()
      const sessionAccessToken = this.extractAccessTokenFromSession(request)
      if (sessionAccessToken !== undefined) {
        const userId = await this.accessory.verifyAsync(sessionAccessToken)
        if (userId) {
          request.userId = userId
        }
      }
      return true
    }
  
    private extractAccessTokenFromSession(
      request: FastifyRequest,
    ): string | undefined {
      const accessToken =
        request.cookies && request.cookies['access-token']
          ? request.cookies['access-token']
          : undefined
      return accessToken
    }
  }