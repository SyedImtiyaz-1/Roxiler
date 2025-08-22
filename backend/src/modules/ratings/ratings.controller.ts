import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto, UpdateRatingDto } from '../../common/dto/rating.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Ratings')
@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a rating for a store' })
  @ApiResponse({ status: 201, description: 'Rating submitted successfully' })
  @ApiResponse({ status: 409, description: 'User has already rated this store' })
  create(@CurrentUser() user: any, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(user.id, createRatingDto);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all ratings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Ratings retrieved successfully' })
  findAll() {
    return this.ratingsService.findAll();
  }

  @Get('my-ratings')
  @ApiOperation({ summary: 'Get current user ratings' })
  @ApiResponse({ status: 200, description: 'Ratings retrieved successfully' })
  findMyRatings(@CurrentUser() user: any) {
    return this.ratingsService.findByUser(user.id);
  }

  @Get('store/:storeId')
  @ApiOperation({ summary: 'Get ratings for a specific store' })
  @ApiResponse({ status: 200, description: 'Ratings retrieved successfully' })
  findByStore(@Param('storeId') storeId: string) {
    return this.ratingsService.findByStore(storeId);
  }

  @Get('user-rating/:storeId')
  @ApiOperation({ summary: 'Get current user rating for a specific store' })
  @ApiResponse({ status: 200, description: 'Rating retrieved successfully' })
  getUserRatingForStore(@CurrentUser() user: any, @Param('storeId') storeId: string) {
    return this.ratingsService.getUserRatingForStore(user.id, storeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rating by ID' })
  @ApiResponse({ status: 200, description: 'Rating retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update rating' })
  @ApiResponse({ status: 200, description: 'Rating updated successfully' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(id, user.id, updateRatingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rating' })
  @ApiResponse({ status: 200, description: 'Rating deleted successfully' })
  @ApiResponse({ status: 200, description: 'Rating not found' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ratingsService.remove(id, user.id);
  }
} 