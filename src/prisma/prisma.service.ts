import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.checkAndSeedData();
  }
  async checkAndSeedData() {
    const userCount = await this.user.count();

    if (userCount === 0) {
      console.log('User table is empty. Seeding data...');
      await this.seedData();
    } else {
      console.log('User table already has data. No seeding required.');
    }
  }

  async seedData() {
    // 插入 user_group 数据
    const userGroups = await Promise.all([
      this.user_group.create({
        data: {
          id: 1,
          name: '系统管理员',
          rules: JSON.stringify(["admin","editor"]), // 默认值为空数组
          created_at: new Date(),
          updated_at: new Date(),
          status: 'normal',
        },
      }),
      this.user_group.create({
        data: {
          id: 2,
          name: '站群管理员',
          rules: JSON.stringify(["editor"]), // 默认值为 ["editor"]
          created_at: new Date(),
          updated_at: new Date(),
          status: 'normal',
        },
      }),
    ]);

    console.log('Inserted User Group:', userGroups);

    // 插入 user 数据
    const password = await bcrypt.hash('admin123456', 10);
    const user = await this.user.create({
      data: {
        username: 'admin',
        nickname: '系统管理员',
        password: password,
        email: '6559170@qq.com',
        phone: '13351517778',
        group_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        status: 'normal',
      },
    });

    console.log('Inserted User:', user);
  }
}