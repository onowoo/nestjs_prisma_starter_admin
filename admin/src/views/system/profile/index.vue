<script lang="ts" setup>
import { ref } from "vue"
import { updateTableDataApi } from "@/api/user"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { type CreateOrUpdateTableRequestData } from "@/api/user/types/table"
import { cloneDeep } from "lodash-es"
import { useAuthStore } from "@/store/modules/auth"

defineOptions({
  // 命名当前组件
  name: "Profile"
})
const { userInfo } = useAuthStore()
const loading = ref<boolean>(false)

//#region 表单
const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  id: userInfo.id,
  nickname: userInfo.nickname,
  avatar: userInfo.avatar,
  password: "",
  email: userInfo.email,
  phone: userInfo.phone
}

const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateTableRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateTableRequestData> = {
  password: [{ trigger: "blur", message: "请输入密码" }],
  email: [{ trigger: "blur", message: "请输入邮箱", type: "email" }],
  phone: [{ trigger: "blur", message: "请输入手机号" }],
  avatar: [{ trigger: "blur", message: "请输入头像" }],
  nickname: [{ trigger: "blur", message: "请输入昵称" }]
}
//#endregion

//#region 请求
const handleUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    updateTableDataApi(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        resetForm
        useAuthStore().getInfo
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
</script>

<template>
  <div class="app-container">
    <el-card body-class="mt-6">
      <el-form
        label-position="top"
        style="max-width: 600px"
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item prop="nickname" label="昵称">
          <!-- 添加昵称字段 -->
          <el-input v-model="formData.nickname" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.email" type="email" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="avatar" label="头像">
          <!-- 添加头像字段 -->
          <el-input v-model="formData.avatar" placeholder="请输入头像链接" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpdate" :loading="loading">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
