import { Controller, Get, Session } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('验证码')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get()
  @ApiOperation({ summary: '验证码', description: '用于登录'})
  getCaptcha(@Session() session: any) {
    return this.captchaService.generateCaptcha(session);
  }
}