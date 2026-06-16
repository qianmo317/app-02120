<template>
  <div class="user-center-page">
    <div class="container">
      <div class="user-layout">
        <!-- 左侧菜单 -->
        <aside class="user-sidebar card">
          <div class="user-profile">
            <el-avatar :size="64" :src="userStore.userInfo?.avatar">
              <el-icon :size="32"><User /></el-icon>
            </el-avatar>
            <div class="user-info">
              <h3 class="nickname">{{ userStore.userInfo?.nickname || '用户' }}</h3>
              <p class="level">
                <el-icon><Medal /></el-icon>
                Lv.{{ userStore.userInfo?.level || 1 }}
              </p>
            </div>
          </div>
          
          <el-menu :default-active="activeMenu" @select="handleMenuSelect">
            <el-menu-item index="profile">
              <el-icon><User /></el-icon>
              <span>个人资料</span>
            </el-menu-item>
            <el-menu-item index="orders">
              <el-icon><List /></el-icon>
              <span>我的订单</span>
            </el-menu-item>
            <el-menu-item index="address">
              <el-icon><Location /></el-icon>
              <span>收货地址</span>
            </el-menu-item>
            <el-menu-item index="favorites">
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </el-menu-item>
          </el-menu>
        </aside>

        <!-- 右侧内容 -->
        <main class="user-main card">
          <!-- 个人资料 -->
          <div v-if="activeMenu === 'profile'" class="profile-section">
            <h2 class="section-title">个人资料</h2>
            
            <el-form :model="profileForm" label-width="100px" class="profile-form">
              <el-form-item label="头像">
                <el-avatar :size="80" :src="userStore.userInfo?.avatar">
                  <el-icon :size="40"><User /></el-icon>
                </el-avatar>
              </el-form-item>
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="profileForm.phone" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveProfile">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 快捷入口 -->
          <div v-if="activeMenu === 'profile'" class="quick-entry">
            <h3 class="entry-title">快捷入口</h3>
            <div class="entry-grid">
              <router-link to="/orders?status=0" class="entry-item">
                <el-icon :size="24"><Wallet /></el-icon>
                <span>待付款</span>
              </router-link>
              <router-link to="/orders?status=1" class="entry-item">
                <el-icon :size="24"><Box /></el-icon>
                <span>待发货</span>
              </router-link>
              <router-link to="/orders?status=2" class="entry-item">
                <el-icon :size="24"><Van /></el-icon>
                <span>待收货</span>
              </router-link>
              <router-link to="/user/favorites" class="entry-item">
                <el-icon :size="24"><Star /></el-icon>
                <span>我的收藏</span>
              </router-link>
            </div>
          </div>

          <!-- 订单跳转提示 -->
          <div v-if="activeMenu === 'orders'" class="redirect-section">
            <EmptyState text="正在跳转到订单列表..." :icon="List" />
          </div>

          <!-- 地址跳转提示 -->
          <div v-if="activeMenu === 'address'" class="redirect-section">
            <EmptyState text="正在跳转到地址管理..." :icon="Location" />
          </div>

          <!-- 收藏跳转提示 -->
          <div v-if="activeMenu === 'favorites'" class="redirect-section">
            <EmptyState text="正在跳转到我的收藏..." :icon="Star" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { List, Location, Star } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('profile')
const profileForm = reactive({
  username: '',
  nickname: '',
  phone: '',
  email: ''
})

function handleMenuSelect(index) {
  activeMenu.value = index
  
  // 跳转到对应页面
  setTimeout(() => {
    switch (index) {
      case 'orders':
        router.push('/orders')
        break
      case 'address':
        router.push('/user/address')
        break
      case 'favorites':
        router.push('/user/favorites')
        break
    }
  }, 500)
}

async function saveProfile() {
  const result = await userStore.updateUserInfo({
    nickname: profileForm.nickname,
    email: profileForm.email
  })
  
  if (result.success) {
    ElMessage.success('保存成功')
  } else {
    ElMessage.error(result.message || '保存失败')
  }
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  // 初始化表单
  if (userStore.userInfo) {
    profileForm.username = userStore.userInfo.username
    profileForm.nickname = userStore.userInfo.nickname
    profileForm.phone = userStore.userInfo.phone
    profileForm.email = userStore.userInfo.email
  }
})
</script>

<style lang="scss" scoped>
.user-center-page {
  padding: $spacing-lg 0;
}

.user-layout {
  display: flex;
  gap: $spacing-base;
}

.user-sidebar {
  width: 240px;
  flex-shrink: 0;
  padding: $spacing-lg;
}

.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: $spacing-lg;
  border-bottom: 1px solid $border-color;
  margin-bottom: $spacing-base;
}

.user-info {
  text-align: center;
  margin-top: $spacing-md;
  
  .nickname {
    font-size: $font-md;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-xs;
  }
  
  .level {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-xs;
    font-size: $font-xs;
    color: $warning-color;
  }
}

.user-sidebar :deep(.el-menu) {
  border: none;
  
  .el-menu-item {
    height: 48px;
    line-height: 48px;
    border-radius: $radius-sm;
    margin-bottom: $spacing-xs;
    
    &.is-active {
      background: rgba($primary-color, 0.1);
      color: $primary-color;
    }
  }
}

.user-main {
  flex: 1;
  padding: $spacing-lg;
}

.section-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border-color;
  margin-bottom: $spacing-lg;
}

.profile-form {
  max-width: 500px;
}

.quick-entry {
  margin-top: $spacing-xl;
  padding-top: $spacing-lg;
  border-top: 1px solid $border-color;
}

.entry-title {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-base;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-base;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-lg;
  background: $bg-color;
  border-radius: $radius-md;
  color: $text-secondary;
  transition: all 0.2s;
  
  &:hover {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
  }
  
  span {
    font-size: $font-sm;
  }
}

.redirect-section {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
