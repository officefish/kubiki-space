import { Module } from '@nestjs/common'
import { ClassicAuthController } from './classic-auth.controller'
import { ClassicAuthService } from './classic-auth.service'
//import { UserService } from '@modules/rest/user/user.service'
import { AccessoryService } from '@modules/accessory/accessory.service'
import { AccessoryModule } from '@modules/accessory/accessory.module'
import { CryptoModule } from '@modules/crypto/crypto.module'
import { AppConfigService } from '@modules/config/config.service'
import { AppConfigModule } from '@modules/config/config.module'
import { CryptoService } from '@modules/crypto/crypto.service'
import { UserModule } from '../user/user.module'
import { UserService } from '../user/user.service'

@Module({
  imports: [AccessoryModule, CryptoModule, AppConfigModule, UserModule],
  controllers: [ClassicAuthController],
  providers: [ClassicAuthService, AppConfigService, AccessoryService, CryptoService, UserService],
})
export class ClassicAuthModule {}