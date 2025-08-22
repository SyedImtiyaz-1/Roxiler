import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least 1 uppercase letter and 1 special character',
  })
  password: string;
}

export class SignupDto {
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
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least 1 uppercase letter and 1 special character',
  })
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least 1 uppercase letter and 1 special character',
  })
  oldPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least 1 uppercase letter and 1 special character',
  })
  newPassword: string;
} 