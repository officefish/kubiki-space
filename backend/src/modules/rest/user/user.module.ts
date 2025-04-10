import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
//import { UserService } from './user.service'
import { CryptoService } from '@modules/crypto/crypto.service'
import { JwtService } from '@nestjs/jwt'
import { AccessoryService } from '@modules/accessory/accessory.service'
import { AccessoryModule } from '@modules/accessory/accessory.module'
//import { UploadModule } from '../upload/upload.module'
//import { UploadService } from '../upload/upload.service'
//import { SharpModule, SharpService } from 'nestjs-sharp'
import { AppConfigService } from '../../config/config.service'
import { ConfigModule } from '@nestjs/config'
import { AppConfigModule } from '../../config/config.module'
import { UserService } from './user.service'
//import { TartanModule } from '../../tartan/tartan.module'
//import { TartanService } from '../../tartan/tartan.service'

@Module({
  imports: [
    AccessoryModule,
    ConfigModule,
    AppConfigModule, 
    //UploadModule, 
    //SharpModule, 
    //TartanModule
],
  controllers: [UserController],
  providers: [
    UserService,
    CryptoService,
    JwtService,
    AccessoryService,
    //UploadService,
    //SharpService,
    AppConfigService,
    //TartanService,
  ],
})
export class UserModule {}