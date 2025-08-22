import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { CreateStoreDto, UpdateStoreDto, StoreQueryDto } from '../../common/dto/store.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Stores')
@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new store (Admin only)' })
  @ApiResponse({ status: 201, description: 'Store created successfully' })
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stores with filtering and sorting' })
  @ApiResponse({ status: 200, description: 'Stores retrieved successfully' })
  findAll(@Query() query: StoreQueryDto) {
    return this.storesService.findAll(query);
  }

  @Get('my-stores')
  @Roles('STORE_OWNER')
  @ApiOperation({ summary: 'Get stores owned by current user (Store Owner only)' })
  @ApiResponse({ status: 200, description: 'Stores retrieved successfully' })
  findMyStores(@CurrentUser() user: any) {
    return this.storesService.findByOwner(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiResponse({ status: 200, description: 'Store retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update store (Admin only)' })
  @ApiResponse({ status: 200, description: 'Store updated successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete store (Admin only)' })
  @ApiResponse({ status: 200, description: 'Store deleted successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
} 