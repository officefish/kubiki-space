import { Controller, Post, Get, Param, NotFoundException } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  //   @Post(':userId')
  //   async createCollection(@Param('userId') userId: string) {
  //     return this.collectionService.createCollection(userId);
  //   }

  
  @ApiOperation({ summary: 'Response collection model based on userId.' })
  @ApiResponse({ status: 200, description: "Success response with Ok status gives user's Collection model" })
  
  @Get(':userId')
  async getCollection(@Param('userId') userId: string) {
    const collection = await this.collectionService.getCollection(userId);
    if (!collection) {
        new NotFoundException(`Collection ${userId} not found`);
    }
  }
}