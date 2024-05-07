<script setup>
import {Lock, User} from '@element-plus/icons-vue'
import {ref} from 'vue'
import {ElMessage} from "element-plus";
import {userLoginService, userRegisterService} from "@/api/user.js";
import {useRouter} from "vue-router";
import {useTokenStore} from "@/stores/token.js";

//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
const registerData = ref({
  email: '',
  password: '',
  rePassword: ''
})

const loginData = ref({
  email: '',
  password: ''
})

// 表单验证规则
const rules = {
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change']}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 16, message: '密码为6-16位数字与大小写字母组合', trigger: 'blur'},
  ],
  rePassword: [
    {required: true, message: '请再次输入密码', trigger: 'blur'},
    {
      // todo 实时检验
      validator: (rule, value, callback) => {
        if (value === registerData.value.password) {
          callback()
        } else {
          callback(new Error('密码不一致'))
        }
      },
      trigger: 'blur'
    }
  ]
}

// 注册
// todo 注册成功可直接登录
const register = async () => {
  let res = await userRegisterService(registerData.value)
  ElMessage.success(res.msg ? res.msg : '注册成功')
}

// 登录
const router = useRouter();
const tokenStore = useTokenStore();
const login = async () => {
  let res = await userLoginService(registerData.value)
  ElMessage.success(res.msg ? res.msg : '登录成功')
  tokenStore.setToken(res.data) // 保存token
  router.push('/') // 跳转首页
}

// 登录和注册切换时，清空表单
const clearForm = () => {
  registerData.value.email = ''
  registerData.value.password = ''
  registerData.value.rePassword = ''
}
</script>

<template>
  <el-row class = "login-page">
    <el-col :span = "12" class = "bg"></el-col>
    <el-col :span = "6" :offset = "3" class = "form">
      <!-- 注册表单 -->
      <el-form ref = "form" size = "large" autocomplete = "off" v-if = "isRegister" :model = "registerData"
               :rules = "rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop = "email">
          <el-input :prefix-icon = "User" placeholder = "请输入邮箱"
                    v-model = "registerData.email"></el-input>
        </el-form-item>
        <el-form-item prop = "password">
          <el-input :prefix-icon = "Lock" type = "password" placeholder = "请输入密码"
                    v-model = "registerData.password"></el-input>
        </el-form-item>
        <el-form-item prop = "rePassword">
          <el-input v-model = "registerData.rePassword" :prefix-icon = "Lock" type = "password"
                    placeholder = "请再次输入密码" ></el-input>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class = "button" type = "primary" auto-insert-space @click = "register">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class = "flex">
          <el-link type = "info" :underline = "false" @click = "isRegister = false; clearForm()">
            ← 已有账号？去登录
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form ref = "form" size = "large" autocomplete = "off" v-else :rules = "rules" :model = "registerData">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop = "email">
          <el-input :prefix-icon = "User" placeholder = "请输入邮箱" v-model = "registerData.email"></el-input>
        </el-form-item>
        <el-form-item prop = "password">
          <el-input name = "password" :prefix-icon = "Lock" type = "password" v-model = "registerData.password"
                    placeholder = "请输入密码"></el-input>
        </el-form-item>
        <el-form-item class = "flex">
          <div class = "flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type = "primary" :underline = "false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button class = "button" type = "primary" auto-insert-space @click = "login">登录</el-button>
        </el-form-item>
        <el-form-item class = "flex">
          <el-link type = "info" :underline = "false" @click = "isRegister = true; clearForm()">
            没账号？去注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang = "scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
    url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>