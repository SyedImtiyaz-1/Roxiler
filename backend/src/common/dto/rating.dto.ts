import { IsInt, Min, Max, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  ratingValue: number;

  @ApiProperty({ example: 'store-id-here' })
  @IsString()
  storeId: string;
}

export class UpdateRatingDto {
  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  ratingValue: number;
} 