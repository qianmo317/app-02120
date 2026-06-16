<template>
  <header class="app-header">
    <div class="header-content container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <el-icon :size="28"><ShoppingCart /></el-icon>
        <span class="logo-text">优品商城</span>
      </router-link>

      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索商品"
          size="large"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </router-link>
        
        <router-link to="/category" class="nav-item">
          <el-icon><Menu /></el-icon>
          <span>分类</span>
        </router-link>

        <router-link to="/cart" class="nav-item cart-item">
          <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0" :max="99">
            <el-icon><ShoppingCart /></el-icon>
          </el-badge>
          <span>购物车</span>
        </router-link>

        <template v-if="userStore.isLoggedIn">
          <el-dropdown @command="handleUserCommand">
            <div class="nav-item user-item">
              <el-avatar :size="28" :src="userStore.userInfo?.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span>{{ userStore.userInfo?.nickname || '用户' }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="user">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="orders">
                  <el-icon><List /></el-icon>我的订单
                </el-dropdown-item>
                <el-dropdown-item command="favorites">
                  <el-icon><Star /></el-icon>我的收藏
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        
        <template v-else>
          <router-link to="/login" class="nav-item">
            <el-icon><User /></el-icon>
            <span>登录</span>
          </router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

const searchKeyword = ref('')

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/products', query: { keyword: searchKeyword.value.trim() } })
  }
}

function handleUserCommand(command) {
  switch (command) {
    case 'user':
      router.push('/user')
      break
    case 'orders':
      router.push('/orders')
      break
    case 'favorites':
      router.push('/user/favorites')
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userStore.logout()
        router.push('/')
      }).catch(() => {})
      break
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: $bg-white;
  box-shadow: $shadow-sm;
  z-index: 1000;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $primary-color;
  font-size: $font-xl;
  font-weight: 700;
  flex-shrink: 0;
  
  .logo-text {
    white-space: nowrap;
  }
}

.search-box {
  flex: 1;
  max-width: 500px;
  
  :deep(.el-input-group__append) {
    background: $primary-color;
    border-color: $primary-color;
    color: white;
    
    &:hover {
      background: $primary-light;
    }
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: $spacing-base;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  color: $text-secondary;
  font-size: $font-sm;
  border-radius: $radius-sm;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    color: $primary-color;
    background: rgba($primary-color, 0.08);
  }
  
  &.router-link-active {
    color: $primary-color;
  }
}

.cart-item {
  :deep(.el-badge__content) {
    background: $primary-color;
  }
}

.user-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}
</style>
