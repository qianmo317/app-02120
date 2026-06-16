<template>
  <div class="favorites-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">我的收藏</h1>
        <el-button 
          v-if="favoritesStore.count > 0" 
          type="danger" 
          link 
          @click="handleClearAll"
        >
          清空收藏
        </el-button>
      </div>

      <div class="favorites-grid">
        <template v-if="favoritesStore.items.length > 0">
          <div v-for="item in favoritesStore.items" :key="item.productId" class="favorite-card card">
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
              <div class="product-actions">
                <el-button type="primary" size="small" @click="addToCart(item)">
                  加入购物车
                </el-button>
                <el-button size="small" @click="handleRemove(item.productId)">
                  取消收藏
                </el-button>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="card empty-card">
            <EmptyState text="暂无收藏商品" :icon="Star">
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
import { Star } from '@element-plus/icons-vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import EmptyState from '@/components/common/EmptyState.vue'
import { onMounted } from 'vue'

const router = useRouter()
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()
const userStore = useUserStore()

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
  favoritesStore.removeItem(productId)
}

function handleClearAll() {
  ElMessageBox.confirm('确定要清空所有收藏吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    favoritesStore.clearAll()
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
.favorites-page {
  padding: $spacing-lg 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-base;
}

.favorite-card {
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
  margin-bottom: $spacing-md;
}

.product-actions {
  display: flex;
  gap: $spacing-sm;
  
  .el-button {
    flex: 1;
  }
}

.empty-card {
  grid-column: span 4;
}
</style>
