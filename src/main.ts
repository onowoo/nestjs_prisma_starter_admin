import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  console.log("Starting NestJS application...");
  const app = await NestFactory.create(AppModule);

  // 配置会话中间件
  app.use(
    session({
      secret: process.env.JWT_SECRET, // 替换为您的密钥
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // 在生产环境中，确保使用 HTTPS
    }),
  );

// Swagger 配置
  const config = new DocumentBuilder()
  .setTitle('API-Docs')
  .setDescription('API 文档')
  .setVersion('1.0')
  .addServer('/api')
  .addBearerAuth()  // 如果使用 JWT 认证
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);  // api-docs 为文档访问路径

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:3333', 'http://localhost:3000'];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('不允许的来源'));
      }
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api')
  await app.listen(3000);
  console.log("NestJS application is running on port 3000");
}
bootstrap();