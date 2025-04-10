import { Injectable } from '@nestjs/common'
import { Role } from '@prisma/client'
import { AppConfigService } from '@modules/config/config.service'
import { CryptoService } from '@modules/crypto/crypto.service'
import {
  RegenerateSessionInput,
  CreateCookieInput,
  CreateTokensInput,
  ClearCookieInput,
} from './accessory.types'


// interface SessionType {
//   expires: Date;
//   secret?: string | string[] | Buffer | Buffer[] | fastifyCookie.Signer | SignerBase;
//   algorithm?: string;
//   hook?: HookType | false;
//   parseOptions?: fastifyCookie.CookieSerializeOptions;
// } 

@Injectable()
export class AccessoryService {
  constructor(
    private readonly env: AppConfigService,
    private readonly crypto: CryptoService,
  ) {}

  /* Expires */

  async nowPlusMinutes(delay: number) {
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + delay)
    return expires
  }

  async nowPlusDays(delay: number) {
    const expires = new Date()
    expires.setDate(expires.getDate() + delay)
    return expires
  }

  /* Cookies service */

  async createCookie(input: CreateCookieInput) {
    input.reply.cookies[input.name] = input.value
    input.reply.setCookie(input.name, input.value, input.options)
  }

  async clearCookie(input: ClearCookieInput) {
    input.reply.cookies[input.name] = undefined
    input.reply.clearCookie(input.name, input.options)
  }

  async signAsync(userId: string, userName: string) {
    const payload = { sub: userId, userName }
    const options = { secret: this.env.getJwtSignature() }
    return await this.crypto.signAsync(payload, options)
  }

  async verifyAsync(token: string): Promise<string | undefined> {
    const options = { secret: this.env.getJwtSignature() }
    const payload = await this.crypto.verifyAsync(token, options)
    const id = payload.userId || payload.sub || undefined
    return id
  }

  async createTokenCookies(input: CreateTokensInput) {
    const { userId, sessionId, reply, options } = input
    const accessTokenMinutes = this.env.getAccessTokenMinutes()
    const refreshTokenDays = this.env.getRefreshTokenDays()

    const accessToken = await this.crypto.signAsync({ userId, sessionId })

    const accessExpires = await this.nowPlusMinutes(accessTokenMinutes)
    const accessOptions = { ...options, expires: accessExpires }

    this.createCookie({
      reply,
      name: 'access-token',
      value: accessToken,
      options: accessOptions,
    })

    const refreshToken = await this.crypto.signAsync({ sessionId })
    const refreshExpires = await this.nowPlusDays(refreshTokenDays)
    const refreshOptions = { ...options, expires: refreshExpires }
    this.createCookie({
      reply,
      name: 'refresh-token',
      value: refreshToken,
      options: refreshOptions,
    })
  }

  /* Session service */

}