import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { AppConfigModule } from 'src/modules/config/config.module';
import { PingPongModule } from '@/modules/rest/ping-pong/ping-pong.module';
import { CollectionModule } from '@/modules/rest/collection/collection.module';
import { ClassicAuthModule } from '@/modules/rest/classic-auth/classic-auth.module';
import { UserModule } from '@/modules/rest/user/user.module';


@Module({
  imports: [
    PrismaModule,
    AppConfigModule,
    PingPongModule,
    CollectionModule,
    ClassicAuthModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
