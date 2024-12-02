import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  generateCaptcha(session: any) {
    if (!session) {
      throw new Error('Session is undefined'); // 检查 session 是否有效
    }

    const captcha = svgCaptcha.create();
    session.captcha = captcha.text; // 将验证码存储到会话中
    const base64Svg = Buffer.from(captcha.data).toString('base64');
    return {
      code: 0,
      data: {
        captcha: `data:image/svg+xml;base64,${base64Svg}`,
      },
      message:'success'
    };
  }

  validateCaptcha(input: string, session: any): boolean {
    return input.toLowerCase() === session.captcha.toLowerCase(); // 从会话中获取并验证
  }
}