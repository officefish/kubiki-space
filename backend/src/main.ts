import { NestFactory } from '@nestjs/core'
import { AppModule } from "./app/app.module"
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify'

import { WinstonModule } from "nest-winston"

import { logger } from './logger/winston.logger'
import { 
  initializeCookies, 
  initializeCors, 
  initializeSession, 
  initializeStaticAssets, 
  initializeSwagger } from './bootstrap'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: WinstonModule.createLogger({
        instance: logger,
      }),
    }
  )
  // Set global prefix for api
  app.setGlobalPrefix('/api/v1')

  /* installation of auxiliary modules */
  initializeCors(app)
  initializeStaticAssets(app)
  initializeSwagger(app)

  //initializeSentry(app)

  initializeCookies(app)
  initializeSession(app)

  //initializeNewRelic(app)

  /* server admin client */
  //initializeNext(app)
  //await nextRoutes(app)

  const port = process.env.NODE_ENV === 'production' ? process.env.PROD_PORT : process.env.DEV_PORT
  const host = process.env.NODE_ENV === 'production' ? "0.0.0.0" : "localhost"

  /* start server */
  await app.listen(port, host).then(res => {
    console.log(`server started at port: ${res.address()["port"]}`)
  }).catch(err => {
    console.error(err)
  })
}
bootstrap()
