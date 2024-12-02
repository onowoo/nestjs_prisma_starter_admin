<script lang="ts" setup>
import { onMounted, ref } from "vue"

import { CirclePlus, RefreshRight } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus"
import { cloneDeep } from "lodash-es"
import { CreateOrUpdateTableRequestData, TableData } from "@/api/permission/types"
import { createTableDataApi, deleteTableDataApi, getTableDataApi, updateTableDataApi } from "@/api/permission"
defineOptions({
  // 命名当前组件
  name: "SystemConfig"
})

const columns = ref([
  { prop: "id", label: "ID", width: "100" },
  { prop: "parentId", label: "父ID", width: "100" },
  { prop: "path", label: "路由", width: "130" },
  { prop: "component", label: "组件", width: "150" },
  { prop: "redirect", label: "重定向", slot: "avatar", width: "100" },
  { prop: "name", label: "路由名", width: "150" },
  { prop: "title", label: "菜单名", width: "200" },
  { prop: "roles", label: "路由权限", width: "80" },
  { prop: "icon", label: "图标", width: "80" },
  { prop: "hidden", label: "菜单状态", width: "80" },
  { prop: "alwaysShow", label: "根菜单状态", width: "80" },
  { prop: "keepAlive", label: "keepAlive", width: "80" },
  { prop: "order", label: "权重", width: "80" }
])

const loading = ref<boolean>(false)

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  id: undefined,
  parentId: undefined,
  path: "",
  name: "",
  title: "",
  roles: [],
  order: "",
  component: "",
  redirect: "",
  icon: "",
  keepAlice: true,
  hidden: false,
  alwaysShow: true
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateTableRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateTableRequestData> = {
  parentId: [{ required: true, message: "请输入父ID", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由", trigger: "blur" }],
  name: [{ required: true, message: "请输入路由名", trigger: "blur" }],
  title: [{ required: true, message: "请输入菜单名", trigger: "blur" }],
  roles: [{ type: "array", required: true, message: "请选择路由权限", trigger: "change" }],
  order: [{ required: true, type: "number", message: "请输入排序", trigger: "blur" }],
  component: [{ required: true, message: "请输入组件", trigger: "blur" }],
  redirect: [{ required: true, message: "请输入重定向", trigger: "blur" }],
  icon: [{ required: true, message: "请输入图标", trigger: "blur" }],
  keepAlice: [{ type: "boolean", required: true, message: "请选择是否保持活动", trigger: "change" }],
  hidden: [{ type: "boolean", required: true, message: "请选择菜单状态", trigger: "change" }],
  alwaysShow: [{ type: "boolean", required: true, message: "请选择根菜单状态", trigger: "change" }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.id ? updateTableDataApi(formData.value) : createTableDataApi(formData.value)
    api
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getTableData()
      })
      .finally(() => {
        loading.value = false
      })
  })
}
const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
//#endregion

//#region 删
const handleDelete = (row: TableData) => {
  ElMessageBox.confirm(`正在删除路由：${row.title}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    if (row.id) {
      deleteTableDataApi(row.id).then(() => {
        ElMessage.success("删除成功")
        getTableData()
      })
    }
  })
}
//#endregion

//#region 改
const handleUpdate = (row: TableData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 查
const tableData = ref<TableData[]>([])

const getTableData = () => {
  loading.value = true
  getTableDataApi()
    .then(({ data }) => {
      if (Array.isArray(data)) {
        tableData.value = data
      } else {
        tableData.value = [data]
      }
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
//#endregion

onMounted(() => {
  getTableData()
})

const defaultProps = {
  children: "children",
  label: "title",
  id: "id"
}
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增路由</el-button>
          <!-- <el-button type="danger" :icon="Delete">批量删除</el-button> -->
        </div>
        <div>
          <!-- <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip> -->
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <el-row>
        <el-col :span="4">
          <el-tree
            style="width: 200px"
            :data="tableData"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
          />
        </el-col>
        <el-col :span="20">
          <div class="table-wrapper" v-if="tableData">
            <el-table :data="tableData" row-key="id" lazy>
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column label="ID" prop="id" align="center" />

              <el-table-column
                v-for="column in columns"
                :key="column.prop"
                :prop="column.prop"
                :width="column.width"
                :label="column.label"
                align="center"
              />
              <el-table-column fixed="right" label="操作" width="150" align="center">
                <template #default="scope">
                  <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
                  <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formData.id === undefined ? '新增用户' : '修改用户'"
      @closed="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="用户名" v-if="formData.id === undefined">
          <el-input v-model="formData.parentId" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码" v-if="formData.id === undefined">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.path" type="email" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="formData.order" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
