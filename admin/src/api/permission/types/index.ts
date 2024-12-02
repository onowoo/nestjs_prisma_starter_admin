export interface CreateOrUpdateTableRequestData {
  id?: string
  username?: string
  password?: string
  email?: string
  phone?: string
  nickname?: string
  avatar?: string
}

export interface TableRequestData {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数：用户名 */
  username?: string
  /** 查询参数：手机号 */
  phone?: string
}

export interface TableData {
  id: number
  parentId: number
  path: string
  name: string
  title: string
  roles: JSON
  order: number
  component?: string
  redirect?: string
  icon?: string
  keepAlice?: boolean
  hidden?: boolean
  alwaysShow?: boolean
}

export type TableResponseData = ApiResponseData<{
  path: string
  component?: string
  redirect?: string
  name: string
  meta: {
    order: number
    title: string
    roles: JSON
    icon: string
    keepAlice: boolean
    hidden: boolean
  }
}>
