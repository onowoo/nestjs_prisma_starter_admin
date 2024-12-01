import { Controller, Post, UseGuards, Request, Body, HttpCode, HttpStatus, Get, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiQuery, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('用户认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '登录', description: '使用账号密码'})
  @ApiBody({
    description: '登录参数',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: '用户名',
          example: 'admin'
        },
        password: {
          type: 'string',
          description: '密码',
          example: 'admin123456'
        }
      },
      required: ['username', 'password']
    }
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Session() session: any) {
    return this.authService.login(loginDto,session)
  }
  
  @Post('register')
  @ApiOperation({ summary: '用户注册', description: '创建新用户账号' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '参数验证失败' })
  @ApiResponse({ status: 409, description: '用户名或邮箱已存在' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '忘记密码', description: '发送重置密码邮件' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: '重置密码邮件已发送' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '重置密码', description: '使用重置令牌设置新密码' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: '密码重置成功' })
  @ApiResponse({ status: 400, description: '无效的重置令牌' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword
    );
  }
}