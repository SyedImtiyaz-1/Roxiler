import { IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: 'Best Electronics Store' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: '456 Tech Ave, Silicon Valley, CA 94025', maxLength: 400 })
  @IsString()
  @MaxLength(400)
  address: string;

  @ApiProperty({ example: 'user-id-here' })
  @IsString()
  ownerId: string;
}

export class UpdateStoreDto {
  @ApiProperty({ example: 'Best Electronics Store', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: '456 Tech Ave, Silicon Valley, CA 94025', maxLength: 400, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  address?: string;

  @ApiProperty({ example: 'user-id-here', required: false })
  @IsOptional()
  @IsString()
  ownerId?: string;
}

export class StoreQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
} 