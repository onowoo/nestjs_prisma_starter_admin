export interface CreateOrUpdateTableRequestData {
  id?: string
  parentId?: string
  path: string
  name: string
  title: string
  roles: string[]
  order: string
  component?: any
  redirect?: string
  icon?: string
  keepAlice?: boolean
  hidden?: boolean
  alwaysShow?: boolean
}

export interface TableData {
  id?: string
  parentId?: string
  path: string
  name: string
  title: string
  roles: string[]
  order: string
  component?: any
  redirect?: string
  icon?: string
  keepAlice?: boolean
  hidden?: boolean
  alwaysShow?: boolean
}

export type TableResponseData = ApiResponseData<{
  id?: string
  parentId?: string
  path: string
  name: string
  title: string
  roles: string[]
  order: string
  component?: any
  redirect?: string
  icon?: string
  keepAlice?: boolean
  hidden?: boolean
  alwaysShow?: boolean
}>
