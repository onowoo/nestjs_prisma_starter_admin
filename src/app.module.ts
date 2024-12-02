import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { PermissionModule } from './permission/permission.module';
// import { ArchivesModule } from '@/archives/archives.module';
// import { ChannelsModule } from '@/channels/channels.module';
// import { TagsModule } from '@/tags/tags.module';
// import { OrdersModule } from '@/orders/orders.module';
// import { VipModule } from '@/vip/vip.module';
import { AuthModule } from './auth/auth.module';
import { CaptchaModule } from './captcha/captcha.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使配置全局可用
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
    CaptchaModule,
    PermissionModule,
    // ArchivesModule,
    // ChannelsModule,
    // TagsModule,
    // OrdersModule,
    // VipModule,
  ],
})
export class AppModule {}
