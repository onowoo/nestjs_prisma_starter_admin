import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "captcha",
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "auth/login",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi(id: number) {
  return request<Login.UserInfoResponseData>({
    url: `users/${id}`,
    method: "get"
  })
}

/** 注册并返回 Token */
export function registerApi(data: Login.RegisterRequestData) {
  return request<Login.LoginResponseData>({
    url: "auth/register",
    method: "post",
    data
  })
}

/** 发送重置密码邮件 */
export function sendResetPasswordEmailApi(email: string) {
  return request({
    url: "auth/forgot-password",
    method: "post",
    data: { email }
  })
}

/** 重置密码 */
export function resetPasswordApi(data: Login.ResetPasswordRequestData) {
  return request({
    url: "auth/reset-password",
    method: "post",
    data
  })
}
