import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, ForbiddenException, Patch, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';


@ApiTags('用户管理')
@Controller('users')
@UseGuards(JwtAuthGuard) // 所有接口都需要登录
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '创建用户', description: '仅管理员可操作' })
  @UseGuards(AdminGuard) // 只有管理员可以创建用户
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '获取用户列表', description: '仅系统管理员可操作' })
  @ApiQuery({ name: 'currentPage', required: false, description: '页码', type: Number })
  @ApiQuery({ name: 'size', required: false, description: '每页数量', type: Number })
  @ApiQuery({ name: 'username', required: false, description: '用户名', type: String })
  @ApiQuery({ name: 'phone', required: false, description: '手机号', type: String })
  @UseGuards(AdminGuard)
  async findAll(
    @Query('currentPage', new DefaultValuePipe(1), ParseIntPipe) currentPage: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('username') username: string,
    @Query('phone') phone: string,
  ) {
    return this.usersService.findAll({
      currentPage,
      size,
      username,
      phone
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情', description: '管理员可查看所有用户，普通用户只能查看自己' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser,
  ) {
    if (currentUser.group_id !== 1 && currentUser.id !== parseInt(id)) {
      throw new ForbiddenException('无权访问此用户信息');
    }
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户信息', description: '管理员可更新所有用户，普通用户只能更新自己' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser,  // 使用自定义装饰器替代 @Request()
  ) {
    // 只允许管理员或用户本人更新
    if (currentUser.group_id !== 1 && currentUser.id !== parseInt(id)) {
      throw new ForbiddenException('无权修改此用户信息');
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户', description: '仅管理员可操作' })
  @UseGuards(AdminGuard) // 只有管理员可以删除用户
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}