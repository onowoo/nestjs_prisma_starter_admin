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
                    const { alwaysShow, roles, hidden, icon, keepAlive, order, title, ...rest } = item; // 移除字段
                    const children = buildMenuTree(item.id); // 递归构建子菜单
                    
                    // 创建菜单项对象
                    const menuItem = {
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
                        children // 直接赋值 children
                    };
                    
                    // 如果 children 为空数组，则删除该字段
                    if (children.length === 0) {
                        delete menuItem.children && delete menuItem.redirect; // 删除 children 字段
                    }
        
                    return menuItem;
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