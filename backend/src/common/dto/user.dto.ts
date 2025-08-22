import { IsEmail, IsString, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN',
  NORMAL_USER = 'NORMAL_USER',
  STORE_OWNER = 'STORE_OWNER',
}

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', minLength: 20, maxLength: 60 })
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123 Main St, City, State 12345', maxLength: 400 })
  @IsString()
  @MaxLength(400)
  address: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.NORMAL_USER })
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', minLength: 20, maxLength: 60, required: false })
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name?: string;

  @ApiProperty({ example: 'user@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123 Main St, City, State 12345', maxLength: 400, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  address?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.NORMAL_USER, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UserQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
} 