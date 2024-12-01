import { Strategy } from 'passport-local'; // 导入 Passport Local 策略
import { PassportStrategy } from '@nestjs/passport'; // 导入 NestJS 的 Passport 策略基类
import { Injectable, UnauthorizedException } from '@nestjs/common'; // 导入 NestJS 的装饰器和异常处理
import { AuthService } from '../auth.service'; // 导入 AuthService，用于用户验证

@Injectable() // 将该类标记为可注入的服务
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username', // 指定请求中用于用户名的字段名
      passwordField: 'password', // 指定请求中用于密码的字段名
    });
  }

  // validate 方法用于验证用户凭据
  async validate(username?: string, password?: string): Promise<any> {
    // 调用 AuthService 的 validateUser 方法进行用户验证
    const user = await this.authService.validateUser(username, password, undefined, 'login');
    
    // 如果用户不存在或凭据无效，抛出未授权异常
    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // 抛出异常，表示凭据无效
    }
    
    // 如果验证成功，返回用户信息
    return user; // 返回用户对象，通常包含用户的 ID 和其他信息
  }
}