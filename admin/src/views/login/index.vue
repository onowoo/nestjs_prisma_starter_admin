<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useAuthStore } from "@/store/modules/auth"
import { type FormInstance, type FormRules } from "element-plus"
import { User, Lock, Key, Message, Picture, Loading } from "@element-plus/icons-vue"
import { getLoginCodeApi } from "@/api/login"
import { type LoginRequestData, type RegisterRequestData, type ResetPasswordRequestData } from "@/api/login/types/login"
import ThemeSwitch from "@/components/ThemeSwitch/index.vue"

const router = useRouter()
const route = useRoute()
const formType = ref("login")

onMounted(() => {
  if (route.query.token) {
    formType.value = "reset-password"
    resetFormData.token = route.query.token as string
  }
})

/** 表单元素的引用 */
const loginFormRef = ref<FormInstance | null>(null)
const registerFormRef = ref<FormInstance | null>(null)
const forgotFormRef = ref<FormInstance | null>(null)
const resetFormRef = ref<FormInstance | null>(null)

/** 登录按钮 Loading */
const loading = ref(false)
/** 验证码图片 URL */
const codeUrl = ref("")
/** 登录表单数据 */
const loginFormData: LoginRequestData = reactive({
  username: "admin",
  password: "admin123456",
  code: ""
})
/** 注册表单数据 */
const registerFormData: RegisterRequestData = reactive({
  username: "",
  password: "",
  email: ""
})
/** 忘记密码表单数据 */
const forgotFormData = reactive({
  email: ""
})
/** 重置密码表单数据 */
const resetFormData: ResetPasswordRequestData = reactive({
  newPassword: "",
  token: ""
})
/** 登录表单校验规则 */
const loginFormRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
}
/** 注册表单校验规则 */
const registerFormRules: FormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ],
  email: [{ required: true, type: "email", message: "请输入验证码", trigger: "blur" }]
}
/** 重置表单校验规则 */
const forgotFormRules: FormRules = {
  email: [{ required: true, type: "email", message: "请输入邮箱", trigger: "blur" }]
}
/** 重置表单校验规则 */
const resetFormRules: FormRules = {
  token: [{ required: true, message: "未发现重置密钥", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: "长度在 8 到 16 个字符", trigger: "blur" }
  ]
}
/** 登录逻辑 */
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      useAuthStore()
        .login(loginFormData)
        .then(() => {
          router.push({ path: "/" })
        })
        .catch(() => {
          createCode()
          loginFormData.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
/** 注册逻辑 */
const handleRegister = () => {
  registerFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      useAuthStore()
        .register(registerFormData)
        .then(() => {
          router.push({ path: "/" })
        })
        .catch(() => {
          createCode()
          loginFormData.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
/** 忘记密码逻辑 */
const handleForgot = () => {
  forgotFormRef.value?.validate((valid: boolean, fields) => {
    console.log("req is here")
    if (valid) {
      useAuthStore()
        .forgot(forgotFormData.email)
        .then(() => {
          console.log(111)
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
/** 重置密码逻辑 */
const handleReset = () => {
  resetFormRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      loading.value = true
      useAuthStore()
        .reset(resetFormData)
        .then(() => {
          formType.value = "login"
        })
        .catch(() => {
          createCode()
          loginFormData.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
/** 创建验证码 */
const createCode = () => {
  // 先清空验证码的输入
  loginFormData.code = ""
  // 获取验证码
  codeUrl.value = ""
  getLoginCodeApi().then((res) => {
    codeUrl.value = res.data.captcha
  })
}

/** 初始化验证码 */
createCode()
</script>

<template>
  <div class="login-container">
    <ThemeSwitch class="theme-switch" />
    <div
      class="login-card dark:bg-dark-400/30 bg-gray-200/30 backdrop-filter backdrop-blur-md border-solid dark:border-gray-400/20 border-gray-100/30 shadow"
    >
      <div class="title gap-4">
        <img src="@/assets/layouts/wy.png" class="bg-white w-13 h-10 p-1 rounded-full" />
        <div class="text-4xl font-bold gray-400 dark:gray-100">Wanapp</div>
      </div>
      <div class="content opacity-80">
        <!--登录表单-->
        <el-form
          v-if="formType === 'login'"
          ref="loginFormRef"
          :model="loginFormData"
          :rules="loginFormRules"
          @keyup.enter="handleLogin"
          class="delay-300 ease-in-out"
        >
          <el-form-item prop="username">
            <el-input
              v-model.trim="loginFormData.username"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="loginFormData.password"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model.trim="loginFormData.code"
              placeholder="验证码"
              type="text"
              tabindex="3"
              :prefix-icon="Key"
              maxlength="7"
              size="large"
            >
              <template #append>
                <el-image :src="codeUrl" @click="createCode" draggable="false">
                  <template #placeholder>
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </template>
                  <template #error>
                    <el-icon>
                      <Loading />
                    </el-icon>
                  </template>
                </el-image>
              </template>
            </el-input>
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">登 录</el-button>
          <div class="uno-flex-center flex-col mt-10 gap-3 text-sm">
            <div class="cursor-pointer hover:text-blue-200" @click="formType = 'register'">还没账号？点此注册</div>
            <div class="cursor-pointer hover:text-blue-200" @click="formType = 'forgot-password'">忘记密码</div>
          </div>
        </el-form>
        <!--注册表单-->
        <el-form
          v-if="formType === 'register'"
          ref="registerFormRef"
          :model="registerFormData"
          :rules="registerFormRules"
          @keyup.enter="handleRegister"
          class="delay-300 ease-in-out"
        >
          <el-form-item prop="username">
            <el-input
              v-model.trim="registerFormData.username"
              placeholder="用户名"
              type="text"
              tabindex="1"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model.trim="registerFormData.password"
              placeholder="密码"
              type="password"
              tabindex="2"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model.trim="registerFormData.email"
              placeholder="电子邮箱"
              type="email"
              :prefix-icon="Message"
              size="large"
            />
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleRegister">注 册</el-button>
          <div class="uno-flex-center flex-col mt-10 gap-3 text-sm">
            <div class="cursor-pointer hover:text-blue-200" @click="formType = 'login'">已有账号？点此登录</div>
            <div class="cursor-pointer hover:text-blue-200" @click="formType = 'forgot-password'">忘记密码</div>
          </div>
        </el-form>
        <!--忘记密码表单-->
        <el-form
          v-if="formType === 'forgot-password'"
          ref="forgotFormRef"
          :model="forgotFormData"
          :rules="forgotFormRules"
          @keyup.enter="handleForgot"
          class="delay-300 ease-in-out"
        >
          <el-form-item prop="email">
            <el-input
              v-model.trim="forgotFormData.email"
              placeholder="电子邮箱"
              type="email"
              :prefix-icon="Message"
              size="large"
            />
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleForgot"
            >发送重置密码邮件</el-button
          >
        </el-form>
        <!--重置密码表单-->
        <el-form
          v-if="formType === 'reset-password'"
          ref="resetFormRef"
          :model="resetFormData"
          :rules="resetFormRules"
          @keyup.enter="handleReset"
          class="delay-300 ease-in-out"
        >
          <el-form-item prop="password">
            <el-input
              v-model.trim="resetFormData.newPassword"
              placeholder="密码"
              type="password"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click.prevent="handleReset">立即重置</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  background-image: url("@/assets/layouts/wavy-lines.svg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .login-card {
    width: 480px;
    max-width: 90%;
    border-radius: 20px;
    overflow: hidden;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      img {
        height: 50px;
      }
    }
    .content {
      padding: 20px 50px 50px 50px;
      :deep(.el-input-group__append) {
        background-color: #cacaca;
        padding: 0;
        overflow: hidden;
        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }
      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
