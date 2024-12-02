import { Controller, Injectable, NotFoundException, UseGuards, Body, Post, Get } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionService } from './permission.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('路由菜单')
@Controller('permission')
@UseGuards(JwtAuthGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Post()
    @ApiOperation({ summary: '创建路由', description: '仅管理员可操作' })
    @UseGuards(AdminGuard)
    async create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto)
    }

    @Get()
    @ApiOperation({ summary: '获取全部动态路由', description: '需登录' })
    async findAll() {
        return this.permissionService.findAll()
    }
}