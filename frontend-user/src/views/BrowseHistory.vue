<template>
  <div class="browse-history-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">最近浏览</h1>
        <el-button 
          v-if="browseHistoryStore.count > 0" 
          type="danger" 
          link 
          @click="handleClearAll"
        >
          清空记录
        </el-button>
      </div>

      <div class="history-list">
        <template v-if="browseHistoryStore.sortedItems.length > 0">
          <div 
            v-for="item in browseHistoryStore.sortedItems" 
            :key="item.productId" 
            class="history-item card"
          >
            <router-link :to="`/product/${item.productId}`" class="product-link">
              <el-image :src="item.image" fit="cover" class="product-image">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </router-link>
            
            <div class="product-info">
              <router-link :to="`/product/${item.productId}`">
                <h3 class="product-name ellipsis-2">{{ item.name }}</h3>
              </router-link>
              <div class="product-price">¥{{ item.price }}</div>
              <div class="browse-time">
                <el-icon><Clock /></el-icon>
                <span>{{ formatTime(item.browseTime) }}</span>
              </div>
            </div>

            <div class="item-actions">
              <el-button type="primary" size="small" @click="addToCart(item)">
                加入购物车
              </el-button>
              <el-button size="small" @click="handleRemove(item.productId)">
                删除
              </el-button>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="card empty-card">
            <EmptyState text="暂无浏览记录" :icon="Clock">
              <template #action>
                <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
              </template>
            </EmptyState>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Clock, Picture } from '@element-plus/icons-vue'
import { useBrowseHistoryStore } from '@/stores/browseHistory'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import EmptyState from '@/components/common/EmptyState.vue'
import { onMounted } from 'vue'

const router = useRouter()
const browseHistoryStore = useBrowseHistoryStore()
const cartStore = useCartStore()
const userStore = useUserStore()

function formatTime(time) {
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN')
}

function addToCart(item) {
  cartStore.addItem({
    id: item.productId,
    name: item.name,
    price: item.price,
    image: item.image,
    stock: 999
  })
}

function handleRemove(productId) {
  browseHistoryStore.removeRecord(productId)
  ElMessage.success('已删除')
}

function handleClearAll() {
  ElMessageBox.confirm('确定要清空所有浏览记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    browseHistoryStore.clearAll()
    ElMessage.success('已清空')
  }).catch(() => {})
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
  }
})
</script>

<style lang="scss" scoped>
.browse-history-page {
  padding: $spacing-lg 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.history-item {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  padding: $spacing-md;
  transition: all 0.2s;

  &:hover {
    box-shadow: $shadow-sm;
  }
}

.product-link {
  display: block;
  flex-shrink: 0;
}

.product-image {
  width: 100px;
  height: 100px;
  border-radius: $radius-sm;
  
  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $bg-color;
    color: $text-muted;
  }
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: $font-sm;
  font-weight: 400;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-xs;
  
  &:hover {
    color: $primary-color;
  }
}

.product-price {
  font-size: $font-lg;
  font-weight: 700;
  color: $primary-color;
  margin-bottom: $spacing-xs;
}

.browse-time {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-xs;
  color: $text-muted;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  flex-shrink: 0;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-card {
  min-height: 300px;
}
</style>
