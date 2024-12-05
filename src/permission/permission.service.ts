import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<any> {

        const allPermissions = await this.prisma.permission.findMany();
        
        function buildMenuTree(parentId: number) {
            return allPermissions
                .filter(item => item.parentId === parentId) // 根据 parentId 过滤
                .sort((a, b) => b.order - a.order) // 根据 order 排序
                .map(item => {
                    const { alwaysShow,roles, hidden, icon, keepAlive, order, title, ...rest } = item; // 移除字段
                    return {
                        ...rest, // 保留剩余字段
                        meta: { // 新增 meta 对象
                            alwaysShow,
                            hidden,
                            svgIcon: icon,
                            keepAlive,
                            order,
                            title,
                            roles
                        },
                        children: buildMenuTree(item.id) // 递归构建子菜单
                    };
                });
        }
        
        const tree = buildMenuTree(0)

        return {
            code: 0,
            data: tree,
            message: "添加成功"
        }
    }

    async create(CreatePermissionDto: CreatePermissionDto): Promise<any> {

        const {...restDto} = CreatePermissionDto

        const permission = this.prisma.permission.create({
            data: {
                ...restDto,
                roles: JSON.stringify(restDto.roles)
            }
        })

        return {
            code: 0,
            data: permission,
            message: "添加成功"
        }
    }
}