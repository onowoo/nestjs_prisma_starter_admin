import { ref } from "vue"
import { pinia } from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw } from "vue-router"
import { constantRoutes } from "@/router"
import { flatMultiLevelRoutes } from "@/router/helper"
import routeSettings from "@/config/route"
import { getTableDataApi } from "@/api/permission"

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  const routeRoles = route.meta?.roles
  return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true
}

const filterDynamicRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterDynamicRoutes(tempRoute.children, roles)
      }
      res.push(tempRoute)
    }
  })
  return res
}

export const usePermissionStore = defineStore("permission", () => {
  /** 可访问的路由 */
  const routes = ref<RouteRecordRaw[]>([])
  /** 有访问权限的动态路由 */
  const addRoutes = ref<RouteRecordRaw[]>([])

  const dynamicTree = ref<any>([])
  // const dynamicRoutes = ref<RouteRecordRaw[]>([])

  /** 获取动态路由 */
  /** 获取动态路由 */

  // 新增的递归函数，用于格式化路由
  const formatRoute = (route: any) => {
    const componentLoader =
      route.component === "Layouts"
        ? () =>
            import("@/layouts/index.vue").catch((error) => {
              console.log(error)
            })
        : () =>
            import(route.component).catch((err) => {
              console.error(`Failed to load component at ${route.component}:`, err)
              return import("@/views/error-page/404.vue") // 你可以返回一个404组件作为默认
            })

    return {
      path: route.path,
      component: componentLoader,
      redirect: route.redirect,
      name: route.name,
      meta: {
        order: route.order,
        title: route.title,
        roles: route.roles,
        svgIcon: route.icon,
        alwaysShow: route.alwaysShow,
        hidden: route.hidden,
        keepAlive: route.keepAlive
      },
      children: route.children ? route.children.map(formatRoute) : [], // 递归处理子路由
      hasChildren: route.children && route.children.length > 0
    } as RouteRecordRaw
  }
  /** 根据角色生成可访问的 Routes（可访问的路由 = 常驻路由 + 有访问权限的动态路由） */
  const setRoutes = async (roles: string[]) => {
    const res = await getTableDataApi()
    if (res.code === 0 && Array.isArray(res.data)) {
      // 处理返回的数据以匹配 dynamicTree 的结构
      dynamicTree.value = res.data.map((route: any) => {
        return formatRoute(route)
      })
      const accessedRoutes = filterDynamicRoutes(dynamicTree.value, roles)
      _set(accessedRoutes)
    }
  }

  /** 所有路由 = 所有常驻路由 + 所有动态路由 */
  const setAllRoutes = () => {
    _set(dynamicTree.value)
  }

  const _set = (accessedRoutes: RouteRecordRaw[]) => {
    routes.value = constantRoutes.concat(accessedRoutes)
    addRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes
  }

  return { routes, addRoutes, dynamicTree, setRoutes, setAllRoutes }
})

/**
 * 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * 在 SSR 应用中可用于在 setup 外使用 store
 */
export function usePermissionStoreHook() {
  return usePermissionStore(pinia)
}
