<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card card">
        <div class="login-header">
          <h1 class="login-title">欢迎登录</h1>
          <p class="login-subtitle">优品商城，品质生活从这里开始</p>
        </div>

        <el-form 
          ref="formRef" 
          :model="loginForm" 
          :rules="rules" 
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="请输入用户名"
              size="large"
              prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password"
              placeholder="请输入密码"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              size="large" 
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <span>还没有账号？</span>
          <router-link to="/register" class="register-link">立即注册</router-link>
        </div>

        <div class="demo-tip">
          <el-alert 
            title="演示账号：demo / 123456" 
            type="info" 
            :closable="false"
            show-icon
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const formRef = ref(null)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度为2-20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ]
}

async function handleLogin() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    try {
      const result = await userStore.login({
        username: loginForm.username,
        password: loginForm.password
      })
      
      if (result.success) {
        ElMessage.success('登录成功')
        const redirect = route.query.redirect || '/'
        router.push(redirect)
      } else {
        ElMessage.error(result.message || '登录失败')
      }
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFF5F0 0%, #F5F6FA 100%);
  padding: $spacing-xl;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  padding: $spacing-xl;
}

.login-header {
  text-align: center;
  margin-bottom: $spacing-xl;
}

.login-title {
  font-size: $font-xxl;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.login-subtitle {
  font-size: $font-sm;
  color: $text-secondary;
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: $spacing-lg;
  }
  
  :deep(.el-form-item__content) {
    justify-content: space-between;
  }
}

.login-btn {
  width: 100%;
}

.login-footer {
  text-align: center;
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: $spacing-lg;
}

.register-link {
  color: $primary-color;
  margin-left: $spacing-xs;
  
  &:hover {
    text-decoration: underline;
  }
}

.demo-tip {
  margin-top: $spacing-lg;
}
</style>
