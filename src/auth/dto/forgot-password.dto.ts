import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ description: '邮箱', example: 'john@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: '重置密码令牌', example: 'token123' })
  @IsString()
  token: string;

  @ApiProperty({ description: '新密码', example: 'NewPassword123' })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;
}