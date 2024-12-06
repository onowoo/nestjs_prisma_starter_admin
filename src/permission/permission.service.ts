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
                    const { alwaysShow, roles, hidden, icon, keepAlive, order, title, component, ...rest } = item; // 移除字段
                    const children = buildMenuTree(item.id); // 递归构建子菜单
                    
                    // 创建菜单项对象
                    const menuItem = {
                        ...rest, // 保留剩余字段
                        component: parentId === 0 ? "Layouts" : component, // 一级菜单的 component 设置为 "Layouts"
                        children // 直接赋值 children
                    };
        
                    // 如果 children 为空数组，则进行处理
                    if (children.length === 0) {
                        // 如果是一级菜单，填充默认子菜单项
                        if (parentId === 0) { // 假设一级菜单的 parentId 为 0
                            menuItem.children = [{
                                path: "index",
                                component: component, // 使用一级菜单的 component
                                name: item.name, // 使用一级菜单的 name
                                meta: { // 将 meta 移到默认子菜单
                                    alwaysShow,
                                    hidden,
                                    svgIcon: icon,
                                    keepAlive,
                                    order,
                                    title,
                                    roles
                                }
                            }];
                            // 仅在没有子菜单时删除一级菜单的 meta
                            delete menuItem.meta;
                        } else {
                            // 对于其他菜单，删除空数组的 children 字段
                            delete menuItem.children;
                        }
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