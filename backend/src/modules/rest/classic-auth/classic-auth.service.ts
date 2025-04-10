import { Injectable } from '@nestjs/common'

import { UserService } from '@modules/rest/user/user.service'
import { CryptoService } from '@modules/crypto/crypto.service'

import { User as UserModel } from '@prisma/client'

@Injectable()
export class ClassicAuthService {
  constructor(
    private userService: UserService,
    private cryptoService: CryptoService,
  ) {}

  async signIn(email: string, password: string): Promise<UserModel | null> {
    const user = await this.userService.user({ email: email })
    const samePassword = await this.cryptoService.compare(
      password,
      user?.password || '',
    )
    if (!user || !samePassword) return null

    return user
  }
}