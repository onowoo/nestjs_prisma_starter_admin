<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { usePermissionStore } from "@/store/modules/permission"

defineOptions({
  // 命名当前组件
  name: "SystemConfig"
})

const { getPermissions, dynamicTree } = usePermissionStore()

const columns = ref([
  { prop: "id", label: "ID", width: "50" },
  { prop: "parentId", label: "父ID", width: "50" },
  { prop: "path", label: "路由", width: "130" },
  { prop: "component", label: "组件", width: "150" },
  { prop: "redirect", label: "重定向", slot: "avatar", width: "100" },
  { prop: "name", label: "路由名", width: "150" },
  { prop: "title", label: "菜单名", width: "200" },
  { prop: "roles", label: "路由权限", width: "80" },
  { prop: "icon", label: "图标", width: "80" },
  { prop: "hidden", label: "菜单状态", width: "80" },
  { prop: "alwaysShow", label: "根菜单状态", width: "80" },
  { prop: "keepAlive", label: "keepAlive", width: "80" }
])

const loading = ref<boolean>(false)

onMounted(() => {
  getPermissions()
})

const defaultProps = {
  children: "children",
  label: "title"
}
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <el-row>
        <el-col :span="4">
          <el-tree
            style="width: 200px"
            :data="dynamicTree"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
          />
        </el-col>
        <el-col :span="20" class="bg-dark-100">
          <div class="table-wrapper">
            <el-table :data="dynamicTree">
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column
                v-for="column in columns"
                :key="column.prop"
                :prop="column.prop"
                :width="column.width"
                :label="column.label"
                align="center"
              >
                <template #default="scope">
                  <el-avatar v-if="column.prop === 'avatar' && scope.row.avatar" :src="scope.row.avatar" />

                  <div v-if="column.prop === 'status'">
                    <el-tag v-if="scope.row.status === 'normal'" type="success" effect="plain" disable-transitions
                      >启用</el-tag
                    >
                    <el-tag v-else type="danger" effect="plain" disable-transitions>禁用</el-tag>
                  </div>
                  <div v-if="column.prop === 'vip'">
                    <el-tag v-if="scope.row.vip" type="success" effect="plain" disable-transitions>是</el-tag>
                    <el-tag v-else type="danger" effect="plain" disable-transitions>否</el-tag>
                  </div>

                  <div v-if="column.prop === 'created_at'">
                    {{ new Date(scope.row.created_at).toISOString().split("T")[0] }}
                  </div>
                </template>
              </el-table-column>
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
  </div>
</template>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
