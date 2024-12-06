import { router } from "@/router"
import { useAuthStoreHook } from "@/store/modules/auth"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { setRouteChange } from "@/hooks/useRouteListener"
import { useTitle } from "@/hooks/useTitle"
import { getToken } from "@/utils/cache/cookies"
import routeSettings from "@/config/route"
import isWhiteList from "@/config/white-list"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({ showSpinner: false })
const { setTitle } = useTitle()
const userStore = useAuthStoreHook()
const permissionStore = usePermissionStoreHook()

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  // 如果没有登陆
  if (!getToken()) {
    // 如果在免登录的白名单中，则直接进入
    if (isWhiteList(to)) return next()
    // 其他没有访问权限的页面将被重定向到登录页面
    return next("/login")
  }

  // 如果已经登录，并准备进入 Login 页面，则重定向到主页
  if (to.path === "/login") {
    return next({ path: "/" })
  }

  // 如果用户已经获得其权限角色
  if (userStore.roles.length !== 0) return next()

  // 否则要重新获取权限角色
  try {
    const user_id = Number(localStorage.getItem("user_id"))
    if (user_id) {
      await userStore.getInfo(user_id)
    }
    // 注意：角色必须是一个数组！ 例如: ["admin"] 或 ["developer", "editor"]
    const roles = userStore.roles
    if (routeSettings.dynamic) {
      await permissionStore.setRoutes(roles)
    } else {
      permissionStore.setAllRoutes()
    }
    // 生成可访问的 Routes
    // 将 "有访问权限的动态路由" 添加到 Router 中
    console.log(permissionStore.addRoutes)

    permissionStore.addRoutes.forEach((route) => router.addRoute(route))
    // 设置 replace: true, 因此导航将不会留下历史记录
    next({ ...to, replace: true })
  } catch (error) {
    // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
    userStore.resetToken()
    ElMessage.error((error as Error).message || "路由守卫过程发生错误")
    next("/login")
  }
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(to.meta.title)
  NProgress.done()
})
