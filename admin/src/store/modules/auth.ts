import { ref } from "vue"
import { pinia } from "@/store"
import { defineStore } from "pinia"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { ElMessage } from "element-plus"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import { resetRouter } from "@/router"
import * as api from "@/api/login"
import { type ResetPasswordRequestData, type LoginRequestData, type RegisterRequestData } from "@/api/login/types/login"
import routeSettings from "@/config/route"

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const userInfo = ref<any>({})
  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** 登录 */
  const login = async ({ username, password, code }: LoginRequestData) => {
    const res = await api.loginApi({ username, password, code })
    if (res.code === 0) {
      ElMessage.success(res.message)
      setToken(res.data.access_token)
      token.value = res.data.access_token
    }
    if (res.data.user_id) {
      localStorage.setItem("user_id", String(res.data.user_id))
    }
  }
  /** 注册 */
  const register = async ({ username, password, email }: RegisterRequestData) => {
    const res = await api.registerApi({ username, password, email })
    if (res.code === 0) {
      ElMessage.success(res.message)
      setToken(res.data.access_token)
      token.value = res.data.access_token
    }
    if (res.data.user_id) {
      localStorage.setItem("user_id", String(res.data.user_id))
    }
  }
  /** 忘记密码 */
  const forgot = async (email: string) => {
    const res: any = await api.sendResetPasswordEmailApi(email)
    if (res.code === 0) {
      ElMessage.success(res.message)
    }
  }
  /** 重置密码 */
  const reset = async ({ newPassword, token }: ResetPasswordRequestData) => {
    const res: any = await api.resetPasswordApi({ newPassword, token })
    if (res.code === 0) {
      ElMessage.success(res.message)
    }
  }
  /** 获取用户详情 */
  const getInfo = async (id: number) => {
    const { data } = await api.getUserInfoApi(id)
    userInfo.value = data
    // 验证返回的 roles 是否为一个非空数组，否则塞入一个没有任何作用的默认角色，防止路由守卫逻辑进入无限循环
    roles.value = data.roles?.length > 0 ? JSON.parse(data.roles) : routeSettings.defaultRoles
  }
  /** 模拟角色变化 */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    // 用刷新页面代替重新登录
    window.location.reload()
  }
  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ""
    roles.value = []
    resetRouter()
    _resetTagsView()
    ElMessage.success("退出成功")
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }
  /** 重置 Visited Views 和 Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { token, roles, userInfo, login, register, reset, forgot, getInfo, changeRoles, logout, resetToken }
})

/**
 * 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * 在 SSR 应用中可用于在 setup 外使用 store
 */
export function useAuthStoreHook() {
  return useAuthStore(pinia)
}
