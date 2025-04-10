import {
    Controller,
    Get,
    Post,
    Res,
    Req,
    Body,
    UseGuards,
    Put,
    Delete,
    //UploadedFile,
    //Query,
    Param,
  } from '@nestjs/common'
  
  import {
    UpsetProfileDto,
    GetDomainDto,
    UpdateRoleDto,
    DeleteUserDto,
    SuccessProfileResponseDto,
  } from './user.schema'
  //import { getTartanAsRender } from '../../../../shared/services/tartan/svg-data.builder'
  //'@/shared/services/tartan/svg-data.builder'
  //import { generateRandomPattern } from '@shared/services/tartan/random-pattern'
  
  import {
    //ApiCreatedResponse,
    ApiResponse,
    //ApiBody,
    ApiTags,
  } from '@nestjs/swagger'
  
  import { FastifyRequest, FastifyReply } from 'fastify'
  
  import { UserService } from './user.service'
  //import { UploadService } from '../upload/upload.service'
  import { AppConfigService } from '../../config/config.service'
  import { AdminGuard, AuthGuard } from '@modules/rest/classic-auth/classic-auth.guard'
  import { CryptoService } from '../../crypto/crypto.service'
  //import { TartanService } from '../../tartan/tartan.service'
  
  @ApiTags('user')
  @Controller('user')
  export class UserController {
    //private getTartanAsRender = getTartanAsRender
    //private generateRandomPattern
    constructor(
      private readonly service: UserService,
      //private readonly imageProccesing: UploadService,
      private readonly env: AppConfigService,
      private readonly crypto: CryptoService,
      //private readonly tartanProcessing: TartanService,
    ) {}
  
   
    @UseGuards(AdminGuard)
    @Put('/role')
    async updateRole(
      @Body() credentials: UpdateRoleDto,
      @Res() reply: FastifyReply,
    ) {
      const { id, role } = credentials
  
      const user = this.service.updateRole(id, role)
      if (!user) {
        return reply
          .code(401)
          .send({ statusCode: 401, message: 'User not found' })
      }
  
      reply
        .code(201)
        .send({ code: 201, message: `Success role update. New role: ${role}` })
    }
  
    @UseGuards(AdminGuard)
    @Delete('')
    async deleteUser(
      @Body() credentials: DeleteUserDto,
      @Res() reply: FastifyReply,
    ) {
      const { id } = credentials
  
      const user = this.service.deleteUser({ id })
      if (!user) {
        return reply
          .code(401)
          .send({ statusCode: 401, message: 'User not found' })
      }
  
      reply.code(200).send({ code: 200, message: `Success user deleted` })
    }
  }