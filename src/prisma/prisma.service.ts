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
      console.log('用户表为空,正在插入测试数据');
      await this.seedData();
    } else {
      console.log('用户表存在数据,无需插入测试数据');
    }
  }

  async seedData() {
    // 插入 user_group 数据
    const userGroups = await Promise.all([
      this.user_group.create({
        data: {
          id: 1,
          name: '管理员',
          rules: JSON.stringify(["admin","editor"]), // 默认值为空数组
          created_at: new Date(),
          updated_at: new Date(),
          status: 'normal',
        },
      }),
      this.user_group.create({
        data: {
          id: 2,
          name: '用户',
          rules: JSON.stringify(["editor"]), // 默认值为 ["editor"]
          created_at: new Date(),
          updated_at: new Date(),
          status: 'normal',
        },
      }),
    ]);

    console.log('已插入用户组数据:', userGroups);

    // 插入 user 数据
    const password = await bcrypt.hash('admin123456', 10);
    const users = await Promise.all([
      this.user.create({
        data: {
          username: 'admin',
          nickname: 'Admin',
          password: password,
          email: '6559170@qq.com',
          phone: '13351517778',
          group_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          status: 'normal',
        },
      })
    ]);
    console.log('已插入用户数据:', users);

        // 插入 permission 数据
        const permissionsData = [
            {
              parentId: 0,
              path: "/",
              name: "Dashboard",
              title: "控制台",
              roles: ["admin", "editor"],
              order: 9,
              component: "@/views/dashboard/index.vue",
              redirect: "/dashboard",
              icon: "dashboard",
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 0,
              path: "/system",
              name: "System",
              title: "系统管理",
              roles: ["admin", "editor"],
              order: 8,
              component: "Layouts",
              redirect: "/system/config",
              icon: "Grid",
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 2,
              path: "/system/config",
              name: "SystemConfig",
              title: "系统配置",
              roles: ["admin"],
              order: 89,
              component: "@/views/system/config/index.vue",
              redirect: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 2,
              path: "/system/profile",
              name: "Profile",
              title: "个人资料",
              order: 88,
              component: "@/views/system/profile/index.vue",
              redirect: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 2,
              path: "/system/user",
              name: "UserManage",
              title: "用户管理",
              roles: ["admin"],
              order: 87,
              component: "@/views/system/user/index.vue",
              redirect: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 0,
              path: "/link",
              name: "Link",
              title: "外链",
              order: 7,
              redirect: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 6,
              path: "www.baidu.com",
              name: "Link1",
              title: "百度",
              order: 79,
              redirect: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 6,
              path: "www.toutiao.com",
              name: "Link2",
              title: "头条",
              order: 78,
              redirect: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId:0,
              path: "/unocss",
              name: "UnoCSS",
              title: "UnoCSS",
              order: 6,
              component: "@/views/unocss/index.vue",
              redirect: "/unocss/index",
              icon: "unocss",
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId:0,
              path: "/table",
              name: "Table",
              title: "表格",
              order:5,
              component: "Layouts",
              redirect: "/table/element-plus",
              icon: "Grid",
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId:10,
              path: "element-plus",
              name: "ElementPlus",
              title: "表格",
              order:59,
              component: "@/views/table/element-plus/index.vue",
              redirect: null,
              icon: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId:10,
              path: "vxe-table",
              name: "VxeTable",
              title: "表格",
              order:58,
              component: "@/views/table/vxe-table/index.vue",
              redirect: null,
              icon: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              path: "/menu",
              name: "Menu",
              title: "多级路由",
              order: 4,
              component: "Layouts",
              redirect: "/menu/menu1",
              icon: "menu",
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId:13,
              path: "/menu1",
              name: "Menu1",
              title: "menu1",
              order: 49,
              component: "@/views/menu/menu1/index.vue",
              redirect: "/menu/menu1",
              icon: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId:14,
              path: "/menu1-1",
              name: "Menu1-1",
              title: "menu1-1",
              order: 499,
              component: "@/views/menu/menu1-1/index.vue",
              redirect: "/menu/menu1",
              icon: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId:14,
              path: "/menu1-2",
              name: "Menu1-2",
              title: "menu1-2",
              order: 498,
              component: "@/views/menu/menu1-2/index.vue",
              redirect: "/menu/menu1-2-1",
              icon: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId:16,
              path: "/menu1-2-1",
              name: "Menu1-2-1",
              title: "menu1-2-1",
              order: 4999,
              component: "@/views/menu/menu1-2-1/index.vue",
              redirect: "/menu/menu1-2-1",
              icon: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId:16,
              path: "/menu1-2-2",
              name: "Menu1-2-2",
              title: "menu1-2-2",
              order: 4998,
              component: "@/views/menu/menu1-2-2/index.vue",
              icon: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId:14,
              path: "/menu1-3",
              name: "Menu1-3",
              title: "menu1-3",
              order: 497,
              component: "@/views/menu/menu1-3/index.vue",
              redirect: null,
              icon: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId:0,
              path: "/hook-demo",
              name: "HookDemo",
              title: "Hook",
              order: 3,
              component: "Layouts",
              redirect: "/hook-demo/use-fetch-select",
              icon: "Menu",
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 20,
              path: "use-fetch-select",
              name: "UseFetchSelect",
              title: "Hook",
              order: 39,
              component: "@/views/hook-demo/use-fetch-select.vue",
              redirect: null,
              icon: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 20,
              path: "use-fullscreen-loading",
              name: "UseFullscreenLoading",
              title: "useFullscreenLoading",
              order: 38,
              component: "@/views/hook-demo/use-fullscreen-loading.vue",
              redirect: null,
              icon: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 20,
              path: "use-watermark",
              name: "UseWatermark",
              title: "useWatermark",
              order: 37,
              component: "@/views/hook-demo/use-watermark.vu",
              redirect: null,
              icon: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 0,
              path: "/permission",
              name: "Permission",
              title: "权限",
              roles: ["admin", "editor"],
              order: 2,
              component: "Layouts",
              redirect: "/permission/page",
              icon: "lock",
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 24,
              path: "page",
              name: "PagePermission",
              title: "页面级",
              roles: ["admin"],
              order: 29,
              component: "@/views/permission/page.vue",
              redirect: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
          {
              parentId: 24,  
              path: "directive",
              name: "DirectivePermission",
              title: "按钮级",
              order: 28,
              component: "@/views/permission/directive.vue",
              redirect: null,
              keepAlive: true,
              hidden: false,
              alwaysShow: true,
            },
        ]

        const permissions = [];
        for (const permission of permissionsData) {
          const createdPermission = await this.permission.create({ data: permission });
          permissions.push(createdPermission);
        }
    
        console.log('已插入动态路由数据:', permissions);
  }
}