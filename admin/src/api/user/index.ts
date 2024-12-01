import { request } from "@/utils/service"
import type * as Table from "./types/table"

/** 增 */
export function createTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
  const { id: _, ...params } = data
  return request({
    url: "users",
    method: "post",
    data: params
  })
}

/** 删 */
export function deleteTableDataApi(id: string) {
  const params = Number(id)
  return request({
    url: `users/${params}`,
    method: "delete"
  })
}

/** 改 */
export function updateTableDataApi(data: Table.CreateOrUpdateTableRequestData) {
  const params = Number(data.id)
  return request({
    url: `users/${params}`,
    method: "patch",
    data
  })
}

/** 查 */
export function getTableDataApi(params: Table.TableRequestData) {
  return request<Table.TableResponseData>({
    url: "/users",
    method: "get",
    params
  })
}
