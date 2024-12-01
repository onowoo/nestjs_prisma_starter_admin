import { IsString } from 'class-validator';

export class ValidateCaptchaDto {
  @IsString()
  input: string;

  @IsString()
  captchaText: string;
}