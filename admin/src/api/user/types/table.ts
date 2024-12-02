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
  created_at: Date
  email: string
  avatar: string
  id: string
  phone: string
  roles: string
  status: boolean
  username: string
}

export type TableResponseData = ApiResponseData<{
  list: TableData[]
  total: number
}>
