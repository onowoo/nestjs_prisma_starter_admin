import { IsString,  IsOptional, IsNumber, IsJSON, IsBoolean} from 'class-validator';

export class CreatePermissionDto {
  @IsNumber()
  parentId: number;

  @IsString()
  path: string;

  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsJSON()
  roles: JSON;

  @IsNumber()
  order: number
  
  @IsOptional() // 可选字段
  @IsString()
  component?: string;
  
  @IsOptional() // 可选字段
  @IsString()
  redirect?: string;

  @IsOptional() // 可选字段
  @IsString()
  icon?: string;

  @IsOptional() // 可选字段
  @IsBoolean()
  keepAlive?: boolean;

  @IsOptional() // 可选字段
  @IsBoolean()
  hidden?: boolean;

  @IsOptional() // 可选字段
  @IsBoolean()
  alwaysShow?: boolean;
}