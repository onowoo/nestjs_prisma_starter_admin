import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '@/mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { CaptchaService } from '@/captcha/captcha.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private readonly captchaService: CaptchaService,
  ) {}

  async validateUser(username: string, password: string, email?: string, event?: 'login' | 'register'): Promise<any> {
    // 如果是登录验证
    if (event === 'login') {
      const user = await this.usersService.findByUsername(username);
      if (!user) {
        throw new UnauthorizedException('用户不存在'); // 用户不存在
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('密码不正确'); // 密码不正确
      }
      return user; // 返回用户信息
    }
  
    // 如果是注册验证
    if (event === 'register') {
      const existingUser = await this.usersService.findByUsername(username);
      if (existingUser) {
        throw new ConflictException('用户名已存在'); // 用户名已存在
      }
  
      const existingEmail = await this.usersService.findByEmail(email);
      if (existingEmail) {
        throw new ConflictException('邮箱已被使用'); // 邮箱已被使用
      }
    }
  
    return null; // 如果没有提供有效的 event，返回 null
  }

  async login(loginDto: LoginDto, session: any) {
    // 验证验证码
    const isCaptchaValid = this.captchaService.validateCaptcha(loginDto.code, session);
    if (!isCaptchaValid) {
      throw new UnauthorizedException('验证码无效');
    }
    const user = await this.validateUser(loginDto.username, loginDto.password, undefined ,'login')
    const payload = { username: user.username, sub: user.id };
    return {
      code: 0,
      data: {
        access_token: this.jwtService.sign(payload),
        user_id: user.id,
      },
      message: '登录成功'
    }
  }

  async register(registerDto: RegisterDto) {
    // 检查用户名是否已存在
    await this.validateUser(registerDto.username, undefined ,registerDto.email, 'register');
    // 创建新用户
    const user = await this.usersService.create({
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
    });
    const payload = { username: user.username, sub: user.id };
    return {
      code: 0,
      data: {
        access_token: this.jwtService.sign(payload),
        user_id: user.id,
      },
      message: '注册成功'
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('该邮箱未注册');
    }

    // 生成重置令牌
    const resetToken = this.generateResetToken();
    
    // 保存重置令牌到数据库
    await this.usersService.saveResetToken(user.id, resetToken);
    
    // 发送重置密码邮件
    await this.sendResetPasswordEmail(email, resetToken);

    return {
      code: 0 ,
      message: '重置密码邮件已发送，请检查您的邮箱',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // 验证令牌
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('无效的重置令牌');
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码并清除重置令牌
    await this.usersService.updatePassword(user.id, hashedPassword);

    return {
      code:0,
      message: '密码重置成功',
    };
  }

  private generateResetToken(): string {
    // 生成随机令牌的逻辑
    return require('crypto').randomBytes(32).toString('hex');
  }

  private async sendResetPasswordEmail(email: string, token: string) {
    await this.mailService.sendResetPasswordMail(email, token);
  }
}