export interface LoginRequestData {
  /** admin 或 editor */
  username: string
  /** 密码 */
  password: string
  /** 验证码 */
  code: string
}
export interface RegisterRequestData {
  username: string
  password: string
  email: string
}
export interface ResetPasswordRequestData {
  token: string
  newPassword: string
}

export type LoginCodeResponseData = ApiResponseData<{
  captcha: string
}>

export type LoginResponseData = ApiResponseData<{
  access_token: string
  user_id: number
}>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string }>
