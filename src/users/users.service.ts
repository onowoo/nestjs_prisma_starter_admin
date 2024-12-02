import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 添加通过用户名查找用户的方法
  async findByUsername(username: string) {
    return  await this.prisma.user.findFirst({
      where: { username },
    })
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }

  async findUserGroupById(groupId: number) {
    return await this.prisma.user_group.findFirst({
      where: { id: groupId },
    })
  }

  async saveResetToken(userId: number, token: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        reset_token: token,
        reset_token_expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 10分钟后过期
      },
    });
  }

  async findByResetToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_token_expires: {
          gt: new Date(), // 确保令牌未过期
        },
      },
    });

    if (!user) {
      throw new NotFoundException('重置令牌无效或已过期');
    }

    return user;
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { password, ...restDto } = createUserDto;
    // 使用 bcrypt 进行密码哈希
    const hashedPassword = await bcrypt.hash(password, 10); 
    
    const user = await this.prisma.user.create({
      data: {
        ...restDto,
        group_id: 2,
        status: "normal",
        password: hashedPassword,
        updated_at: new Date(),
        created_at: new Date(),
      },
    });
    const userObj = JSON.parse(JSON.stringify(user, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    return {
      code: 0,
      data: {
        ...userObj,
        money: Number(user.money)
      },
      message: "sucsses"
    };
  }

  async findAll(params: {
    currentPage?: number;
    size?: number;
    username?: string;
    phone?: string;
  }) {
    const { currentPage, size, username, phone  } = params;
    const skip = (currentPage - 1) * size;
  
    const where = {
      ...(username ? { username: { contains: username } } : {}),
      ...(phone ? { phone: { contains: phone } } : {}),
    };
  
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: size,
        where,
        select: {
          id: true,
          group_id: true,
          username: true,
          nickname: true,
          phone: true,
          email: true,
          avatar: true,
          vip: true,
          money: true,
          score: true,
          status: true,
          created_at: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);
  
    // 转换 BigInt 为普通数字
    const data = users.map(user => ({
      ...user,
      id: Number(user.id),
      group_id: Number(user.group_id),
      money: Number(user.money.toFixed(2))
    }));
  
    return {
      code: 0,
      data:{
        list: data,
        total: Number(total),
        currentPage,
        size,
        totalPages: Math.ceil(Number(total) / size),
      },
      message: "success"
    };
  }

  async findOne(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const userObj = JSON.parse(JSON.stringify(user, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    const userGroup = await this.findUserGroupById(user.group_id)
    const roles = userGroup ? userGroup.rules : []
    delete userObj.password
    return {
      code: 0,
      data: {
        ...userObj,
        money: Number(user.money),
        roles: roles
      },
      message: "获取详情成功"
    };
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<any> {
    const { password, ...restDto } = updateUserDto;
    
    // 如果更新包含密码，则进行哈希
    const data = password
      ? { ...restDto, password:  await bcrypt.hash(password, 10) }
      : restDto;
    
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    
    const userObj = JSON.parse(JSON.stringify(user, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    return {
      code: 0,
      data: {
        ...userObj,
        money: Number(user.money)
      },
      message: "sucsses"
    };
  }

  async remove(id: number): Promise<any> {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return {
      code: 0,
      data: user.id,
      message: "删除用户成功"
    };
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}