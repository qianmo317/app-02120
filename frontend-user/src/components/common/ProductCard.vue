<template>
  <div class="product-card" @click="goToDetail">
    <div class="product-image">
      <el-image :src="product.image" fit="cover" lazy>
        <template #placeholder>
          <div class="image-placeholder">
            <el-icon :size="32"><Picture /></el-icon>
          </div>
        </template>
        <template #error>
          <div class="image-placeholder">
            <el-icon :size="32"><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      
      <!-- 标签 -->
      <div class="tags" v-if="product.tags?.length">
        <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      
      <!-- 收藏按钮 -->
      <button class="favorite-btn" @click.stop="toggleFavorite">
        <el-icon :size="20">
          <StarFilled v-if="isFavorite" />
          <Star v-else />
        </el-icon>
      </button>
    </div>
    
    <div class="product-info">
      <h3 class="product-name ellipsis-2">{{ product.name }}</h3>
      
      <div class="product-meta">
        <div class="price-row">
          <span class="price">¥{{ product.price }}</span>
          <span class="original-price" v-if="product.originalPrice > product.price">
            ¥{{ product.originalPrice }}
          </span>
        </div>
        <span class="sales">已售 {{ formatSales(product.sales) }}</span>
      </div>
      
      <div class="product-actions">
        <el-button type="primary" size="small" @click.stop="addToCart">
          <el-icon><ShoppingCart /></el-icon>
          加入购物车
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

const isFavorite = computed(() => favoritesStore.isFavorite(props.product.id))

function formatSales(sales) {
  if (sales >= 10000) {
    return (sales / 10000).toFixed(1) + '万'
  }
  return sales
}

function goToDetail() {
  router.push(`/product/${props.product.id}`)
}

function addToCart() {
  cartStore.addItem(props.product)
}

function toggleFavorite() {
  favoritesStore.toggleFavorite(props.product)
}
</script>

<style lang="scss" scoped>
.product-card {
  background: $bg-white;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: all 0.3s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
    
    .favorite-btn {
      opacity: 1;
    }
  }
}

.product-image {
  position: relative;
  aspect-ratio: 1;
  background: $bg-color;
  
  .el-image {
    width: 100%;
    height: 100%;
  }
  
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

.tags {
  position: absolute;
  top: $spacing-sm;
  left: $spacing-sm;
  display: flex;
  gap: $spacing-xs;
  
  .tag {
    padding: 2px 8px;
    font-size: 10px;
    color: white;
    background: $primary-color;
    border-radius: 2px;
    
    &:nth-child(2) {
      background: $error-color;
    }
  }
}

.favorite-btn {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  opacity: 0;
  transition: all 0.2s;
  color: $text-muted;
  
  &:hover {
    color: $primary-color;
    transform: scale(1.1);
  }
  
  .el-icon {
    color: inherit;
  }
  
  // 已收藏状态
  &:has(.el-icon:first-child) {
    opacity: 1;
    color: $primary-color;
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
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: $spacing-md;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: $spacing-xs;
}

.price {
  font-size: $font-lg;
  font-weight: 700;
  color: $primary-color;
}

.original-price {
  font-size: $font-xs;
  color: $text-muted;
  text-decoration: line-through;
}

.sales {
  font-size: $font-xs;
  color: $text-muted;
}

.product-actions {
  .el-button {
    width: 100%;
  }
}
</style>
