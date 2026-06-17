<template>
  <div class="history-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">最近浏览</h1>
        <el-button 
          v-if="historyStore.count > 0" 
          type="danger" 
          link 
          @click="handleClearAll"
        >
          清空浏览记录
        </el-button>
      </div>

      <div class="history-grid">
        <template v-if="historyStore.sortedItems.length > 0">
          <div v-for="item in historyStore.sortedItems" :key="item.productId" class="history-card card">
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
              <div class="view-time">{{ formatTime(item.viewTime) }}</div>
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
import { Clock } from '@element-plus/icons-vue'
import { useHistoryStore } from '@/stores/history'
import EmptyState from '@/components/common/EmptyState.vue'

const historyStore = useHistoryStore()

function formatTime(timeStr) {
  const date = new Date(timeStr)
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

function handleClearAll() {
  import('element-plus').then(({ ElMessageBox, ElMessage }) => {
    ElMessageBox.confirm('确定要清空所有浏览记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      historyStore.clearAll()
      ElMessage.success('已清空')
    }).catch(() => {})
  })
}
</script>

<style lang="scss" scoped>
.history-page {
  padding: $spacing-lg 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-base;
}

.history-card {
  padding: 0;
  overflow: hidden;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
  }
}

.product-link {
  display: block;
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  
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
  padding: $spacing-md;
}

.product-name {
  font-size: $font-sm;
  font-weight: 400;
  color: $text-primary;
  line-height: 1.4;
  height: 40px;
  margin-bottom: $spacing-sm;
  
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

.view-time {
  font-size: $font-xs;
  color: $text-muted;
}

.empty-card {
  grid-column: span 4;
}
</style>
