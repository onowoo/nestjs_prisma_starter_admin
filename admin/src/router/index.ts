import { type RouteRecordRaw, createRouter } from "vue-router"
import { history, flatMultiLevelRoutes } from "./helper"
import routeSettings from "@/config/route"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ":path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          order: 9,
          title: "控制台",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/system",
    component: Layouts,
    redirect: "/system/config",
    name: "System",
    meta: {
      order: 2,
      title: "系统管理",
      roles: ["admin", "editor"],
      elIcon: "Grid",
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "config",
        component: () => import("@/views/system/config/index.vue"),
        name: "SystemConfig",
        meta: {
          order: 39,
          title: "系统配置",
          roles: ["admin"],
          keepAlive: true
        }
      },
      {
        path: "profile",
        component: () => import("@/views/system/profile/index.vue"),
        name: "Profile",
        meta: {
          order: 38,
          title: "个人资料",
          keepAlive: true
        }
      },
      {
        path: "user",
        component: () => import("@/views/system/user/index.vue"),
        name: "UserManage",
        meta: {
          title: "用户管理",
          roles: ["admin"],
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/link",
    meta: {
      order: 3,
      title: "外链",
      svgIcon: "link"
    },
    children: [
      {
        path: "https://juejin.cn/post/7089377403717287972",
        component: () => {},
        name: "Link1",
        meta: {
          order: 79,
          title: "中文文档"
        }
      },
      {
        path: "https://juejin.cn/column/7207659644487139387",
        component: () => {},
        name: "Link2",
        meta: {
          order: 78,
          title: "新手教程"
        }
      }
    ]
  },
  {
    path: "/unocss",
    component: Layouts,
    redirect: "/unocss/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/unocss/index.vue"),
        name: "UnoCSS",
        meta: {
          order: 2,
          title: "UnoCSS",
          svgIcon: "unocss"
        }
      }
    ]
  },
  {
    path: "/table",
    component: Layouts,
    redirect: "/table/element-plus",
    name: "Table",
    meta: {
      order: 6,
      title: "表格",
      elIcon: "Grid"
    },
    children: [
      {
        path: "element-plus",
        component: () => import("@/views/table/element-plus/index.vue"),
        name: "ElementPlus",
        meta: {
          order: 69,
          title: "Element Plus",
          keepAlive: true
        }
      },
      {
        path: "vxe-table",
        component: () => import("@/views/table/vxe-table/index.vue"),
        name: "VxeTable",
        meta: {
          order: 68,
          title: "Vxe Table",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/menu",
    component: Layouts,
    redirect: "/menu/menu1",
    name: "Menu",
    meta: {
      order: 5,
      title: "多级路由",
      svgIcon: "menu"
    },
    children: [
      {
        path: "menu1",
        component: () => import("@/views/menu/menu1/index.vue"),
        redirect: "/menu/menu1/menu1-1",
        name: "Menu1",
        meta: {
          order: 59,
          title: "menu1"
        },
        children: [
          {
            path: "menu1-1",
            component: () => import("@/views/menu/menu1/menu1-1/index.vue"),
            name: "Menu1-1",
            meta: {
              order: 599,
              title: "menu1-1",
              keepAlive: true
            }
          },
          {
            path: "menu1-2",
            component: () => import("@/views/menu/menu1/menu1-2/index.vue"),
            redirect: "/menu/menu1/menu1-2/menu1-2-1",
            name: "Menu1-2",
            meta: {
              order: 598,
              title: "menu1-2"
            },
            children: [
              {
                path: "menu1-2-1",
                component: () => import("@/views/menu/menu1/menu1-2/menu1-2-1/index.vue"),
                name: "Menu1-2-1",
                meta: {
                  order: 5989,
                  title: "menu1-2-1",
                  keepAlive: true
                }
              },
              {
                path: "menu1-2-2",
                component: () => import("@/views/menu/menu1/menu1-2/menu1-2-2/index.vue"),
                name: "Menu1-2-2",
                meta: {
                  order: 5987,
                  title: "menu1-2-2",
                  keepAlive: true
                }
              }
            ]
          },
          {
            path: "menu1-3",
            component: () => import("@/views/menu/menu1/menu1-3/index.vue"),
            name: "Menu1-3",
            meta: {
              order: 597,
              title: "menu1-3",
              keepAlive: true
            }
          }
        ]
      },
      {
        path: "menu2",
        component: () => import("@/views/menu/menu2/index.vue"),
        name: "Menu2",
        meta: {
          order: 58,
          title: "menu2",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/hook-demo",
    component: Layouts,
    redirect: "/hook-demo/use-fetch-select",
    name: "HookDemo",
    meta: {
      order: 4,
      title: "Hook",
      elIcon: "Menu",
      alwaysShow: true
    },
    children: [
      {
        path: "use-fetch-select",
        component: () => import("@/views/hook-demo/use-fetch-select.vue"),
        name: "UseFetchSelect",
        meta: {
          order: 49,
          title: "useFetchSelect"
        }
      },
      {
        path: "use-fullscreen-loading",
        component: () => import("@/views/hook-demo/use-fullscreen-loading.vue"),
        name: "UseFullscreenLoading",
        meta: {
          order: 48,
          title: "useFullscreenLoading"
        }
      },
      {
        path: "use-watermark",
        component: () => import("@/views/hook-demo/use-watermark.vue"),
        name: "UseWatermark",
        meta: {
          order: 47,
          title: "useWatermark"
        }
      }
    ]
  },
  {
    path: "/permission",
    component: Layouts,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      order: 3,
      title: "权限",
      svgIcon: "lock",
      roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "page",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          order: 29,
          title: "页面级",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "directive",
        component: () => import("@/views/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          order: 28,
          title: "按钮级" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  }
]

export const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    // window.location.reload()
  }
}