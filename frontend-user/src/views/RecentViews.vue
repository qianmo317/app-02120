<template>
  <div class="recent-views-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">最近浏览</h1>
        <el-button
          v-if="recentViewsStore.count > 0"
          type="danger"
          link
          @click="handleClearAll"
        >
          清空浏览记录
        </el-button>
      </div>

      <div class="views-list">
        <template v-if="recentViewsStore.items.length > 0">
          <div
            v-for="item in recentViewsStore.items"
            :key="item.productId"
            class="view-item card"
          >
            <router-link :to="`/product/${item.productId}`" class="item-link">
              <el-image :src="item.image" fit="cover" class="item-image">
                <template #error>
                  <div class="image-placeholder">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="item-info">
                <h3 class="item-name ellipsis-2">{{ item.name }}</h3>
                <div class="item-meta">
                  <span class="view-time">
                    <el-icon><Clock /></el-icon>
                    {{ formatTime(item.viewTime) }}
                  </span>
                  <span class="item-price">¥{{ item.price }}</span>
                </div>
              </div>
            </router-link>
            <el-button
              class="remove-btn"
              :icon="Delete"
              circle
              size="small"
              @click="handleRemove(item.productId)"
            />
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
import { Clock, Delete } from '@element-plus/icons-vue'
import { useRecentViewsStore } from '@/stores/recentViews'
import { useUserStore } from '@/stores/user'
import EmptyState from '@/components/common/EmptyState.vue'
import { onMounted } from 'vue'

const router = useRouter()
const recentViewsStore = useRecentViewsStore()
const userStore = useUserStore()

function formatTime(time) {
  const now = Date.now()
  const diff = now - new Date(time).getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 30 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return new Date(time).toLocaleDateString()
  }
}

function handleRemove(productId) {
  recentViewsStore.removeItem(productId)
  ElMessage.success('已删除该记录')
}

function handleClearAll() {
  ElMessageBox.confirm('确定要清空所有浏览记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    recentViewsStore.clearAll()
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
.recent-views-page {
  padding: $spacing-lg 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.views-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.view-item {
  display: flex;
  align-items: center;
  padding: $spacing-base;
  transition: all 0.3s;

  &:hover {
    box-shadow: $shadow-md;

    .remove-btn {
      opacity: 1;
    }
  }
}

.item-link {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  flex: 1;
  min-width: 0;
}

.item-image {
  width: 96px;
  height: 96px;
  flex-shrink: 0;
  border-radius: $radius-md;
  overflow: hidden;
  background: $bg-color;

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-muted;
  }
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: $font-md;
  font-weight: 500;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-sm;

  &:hover {
    color: $primary-color;
  }
}

.item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-base;

  .view-time {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-xs;
    color: $text-muted;
  }

  .item-price {
    font-size: $font-md;
    font-weight: 700;
    color: $primary-color;
  }
}

.remove-btn {
  flex-shrink: 0;
  margin-left: $spacing-base;
  opacity: 0;
  transition: opacity 0.2s;
}

.empty-card {
  padding: 0;
}
</style>
