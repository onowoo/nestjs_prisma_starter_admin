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
  const modules = import.meta.glob("@/views/**/*.vue")
  const Layouts = () => import("@/layouts/index.vue")
  const dynamicRoutes = ref<RouteRecordRaw[]>([])

  const getRoutes = async () => {
    const res = await getTableDataApi()
    if (Array.isArray(res.data)) {
      res.data.forEach((item) => {
        delete item.id && delete item.parentId && delete item.layout && delete item.method
        if (item.component) {
          item.component = Layouts // 一级路由使用 Layouts
        }
        if (!item.name) {
          console.warn(`路由 ${item.path} 缺少 name 属性，无法添加到路由表`)
          return
        }
        if (item.children) {
          item.children.forEach((child: { component: any }) => {
            if (child.component) {
              const componentPath = `/src/views/${child.component}.vue`
              child.component = modules[componentPath] // 使用异步加载
            }
          })
        }
      })
      dynamicRoutes.value = res.data
    }
  }
  /** 根据角色生成可访问的 Routes（可访问的路由 = 常驻路由 + 有访问权限的动态路由） */
  const setRoutes = async (roles: string[]) => {
    await getRoutes()
    const accessedRoutes = filterDynamicRoutes(dynamicRoutes.value, roles)
    _set(accessedRoutes)
  }

  /** 所有路由 = 所有常驻路由 + 所有动态路由 */
  const setAllRoutes = () => {
    _set(dynamicRoutes.value)
  }

  const _set = (accessedRoutes: RouteRecordRaw[]) => {
    routes.value = constantRoutes.concat(accessedRoutes)
    addRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes
    // console.log(addRoutes.value)
  }

  return { routes, addRoutes, setRoutes, setAllRoutes }
})

/**
 * 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * 在 SSR 应用中可用于在 setup 外使用 store
 */
export function usePermissionStoreHook() {
  return usePermissionStore(pinia)
}
