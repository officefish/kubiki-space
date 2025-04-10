import { INestApplication, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'

export function initializeSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Kubiki Server API')
    .setDescription('Kubiki server API description with Zod schema validation')
    .setVersion('1.0')
    .setContact('Sergey Inozemcev', 'https://t.me/indiecaps', 'indicogames@yandex.ru')
    .addBearerAuth()
    .addTag('ping-pong')
    .addTag('collection')
    .build()
  patchNestJsSwagger()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  //if (process.env.NODE_ENV === 'development') {
  //  app.enableCors(localhostCorsConfig);
  Logger.log('Swagger initialized', 'Bootstrap')
  //}
}