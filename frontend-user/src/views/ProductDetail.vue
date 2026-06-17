<template>
  <div class="product-detail-page">
    <div class="container" v-loading="loading">
      <template v-if="product">
        <!-- 商品主信息 -->
        <div class="product-main card">
          <!-- 图片区 -->
          <div class="product-gallery">
            <div class="main-image">
              <el-image :src="currentImage" fit="contain">
                <template #placeholder>
                  <div class="image-placeholder">
                    <el-icon :size="48"><Picture /></el-icon>
                  </div>
                </template>
                <template #error>
                  <div class="image-placeholder">
                    <el-icon :size="48"><Picture /></el-icon>
                    <span>图片加载失败</span>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="thumbnail-list">
              <div 
                v-for="(img, index) in product.images" 
                :key="index"
                :class="['thumbnail', { active: currentImage === img }]"
                @click="currentImage = img"
              >
                <el-image :src="img" fit="cover">
                  <template #error>
                    <div class="thumb-placeholder">
                      <el-icon :size="20"><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
            </div>
          </div>

          <!-- 信息区 -->
          <div class="product-info">
            <h1 class="product-name">{{ product.name }}</h1>
            
            <div class="product-meta">
              <span class="rating">
                <el-icon><Star /></el-icon>
                {{ product.rating }}
              </span>
              <span class="sales">已售 {{ product.sales }}</span>
              <span class="stock">库存 {{ product.stock }}</span>
            </div>

            <div class="price-box">
              <span class="current-price">¥{{ product.price }}</span>
              <span class="original-price" v-if="product.originalPrice > product.price">
                ¥{{ product.originalPrice }}
              </span>
              <span class="discount" v-if="product.originalPrice > product.price">
                省 ¥{{ product.originalPrice - product.price }}
              </span>
            </div>

            <!-- 规格选择 -->
            <div class="spec-section" v-if="product.specs?.length">
              <div v-for="spec in product.specs" :key="spec.name" class="spec-row">
                <span class="spec-label">{{ spec.name }}：</span>
                <div class="spec-values">
                  <button 
                    v-for="value in spec.values" 
                    :key="value"
                    :class="['spec-btn', { active: selectedSpecs[spec.name] === value }]"
                    @click="selectSpec(spec.name, value)"
                  >
                    {{ value }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 数量选择 -->
            <div class="quantity-row">
              <span class="quantity-label">数量：</span>
              <QuantitySelector v-model="quantity" :max="product.stock" />
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="addToCart" :loading="addingCart">
                <el-icon><ShoppingCart /></el-icon>
                加入购物车
              </el-button>
              <el-button type="danger" size="large" @click="buyNow">
                立即购买
              </el-button>
              <el-button size="large" @click="toggleFavorite">
                <el-icon>
                  <StarFilled v-if="isFavorite" />
                  <Star v-else />
                </el-icon>
                {{ isFavorite ? '已收藏' : '收藏' }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 商品详情 -->
        <div class="product-detail card">
          <h2 class="detail-title">商品详情</h2>
          <div class="detail-content">
            <p>{{ product.description }}</p>
            <div class="detail-images">
              <el-image 
                v-for="(img, index) in product.images" 
                :key="index"
                :src="img" 
                fit="contain"
                class="detail-image"
              >
                <template #error>
                  <div class="detail-image-placeholder">
                    <el-icon :size="32"><Picture /></el-icon>
                    <span>图片加载失败</span>
                  </div>
                </template>
              </el-image>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/api'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import { useUserStore } from '@/stores/user'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'
import QuantitySelector from '@/components/common/QuantitySelector.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const userStore = useUserStore()
const recentlyViewedStore = useRecentlyViewedStore()

const loading = ref(false)
const addingCart = ref(false)
const product = ref(null)
const currentImage = ref('')
const quantity = ref(1)
const selectedSpecs = ref({})

const isFavorite = computed(() => {
  return product.value ? favoritesStore.isFavorite(product.value.id) : false
})

async function fetchProduct() {
  loading.value = true
  try {
    const res = await api.getProductDetail(route.params.id)
    if (res.code === 200) {
      product.value = res.data
      currentImage.value = res.data.images?.[0] || res.data.image
      // 初始化规格选择
      if (res.data.specs?.length) {
        res.data.specs.forEach(spec => {
          selectedSpecs.value[spec.name] = spec.values[0]
        })
      }
      // 添加浏览记录
      recentlyViewedStore.addRecord(res.data)
    } else {
      ElMessage.error(res.message || '商品不存在')
      router.push('/')
    }
  } finally {
    loading.value = false
  }
}

function selectSpec(name, value) {
  selectedSpecs.value[name] = value
}

function addToCart() {
  addingCart.value = true
  setTimeout(() => {
    cartStore.addItem(product.value, quantity.value)
    addingCart.value = false
  }, 300)
}

function buyNow() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  cartStore.addItem(product.value, quantity.value)
  router.push('/cart')
}

function toggleFavorite() {
  favoritesStore.toggleFavorite(product.value)
}

watch(() => route.params.id, () => {
  fetchProduct()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.product-detail-page {
  padding: $spacing-lg 0;
}

.product-main {
  display: flex;
  gap: $spacing-xl;
  padding: $spacing-lg;
  margin-bottom: $spacing-base;
}

.product-gallery {
  width: 480px;
  flex-shrink: 0;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  background: $bg-color;
  border-radius: $radius-md;
  overflow: hidden;
  margin-bottom: $spacing-md;
  
  .el-image {
    width: 100%;
    height: 100%;
  }
  
  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    color: $text-muted;
    background: $bg-color;
    
    span {
      font-size: $font-xs;
    }
  }
}

.thumbnail-list {
  display: flex;
  gap: $spacing-sm;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: $radius-sm;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
  background: $bg-color;
  
  .el-image {
    width: 100%;
    height: 100%;
  }
  
  .thumb-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $text-muted;
    background: $bg-color;
  }
  
  &:hover,
  &.active {
    border-color: $primary-color;
  }
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: $font-xl;
  font-weight: 600;
  color: $text-primary;
  line-height: 1.4;
  margin-bottom: $spacing-md;
}

.product-meta {
  display: flex;
  gap: $spacing-lg;
  font-size: $font-sm;
  color: $text-secondary;
  margin-bottom: $spacing-base;
  
  .rating {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    color: $warning-color;
  }
}

.price-box {
  background: linear-gradient(135deg, #FFF5F0 0%, #FFEBE0 100%);
  padding: $spacing-base $spacing-lg;
  border-radius: $radius-md;
  margin-bottom: $spacing-lg;
  display: flex;
  align-items: baseline;
  gap: $spacing-md;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: $primary-color;
}

.original-price {
  font-size: $font-md;
  color: $text-muted;
  text-decoration: line-through;
}

.discount {
  font-size: $font-sm;
  color: $primary-color;
  background: rgba($primary-color, 0.1);
  padding: 2px 8px;
  border-radius: $radius-sm;
}

.spec-section {
  margin-bottom: $spacing-lg;
}

.spec-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: $spacing-md;
}

.spec-label {
  width: 60px;
  font-size: $font-sm;
  color: $text-secondary;
  padding-top: $spacing-sm;
}

.spec-values {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.spec-btn {
  padding: $spacing-sm $spacing-base;
  font-size: $font-sm;
  color: $text-primary;
  border: 1px solid $border-color;
  border-radius: $radius-sm;
  transition: all 0.2s;
  
  &:hover {
    border-color: $primary-color;
    color: $primary-color;
  }
  
  &.active {
    border-color: $primary-color;
    color: $primary-color;
    background: rgba($primary-color, 0.08);
  }
}

.quantity-row {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.quantity-label {
  width: 60px;
  font-size: $font-sm;
  color: $text-secondary;
}

.action-buttons {
  display: flex;
  gap: $spacing-md;
  
  .el-button {
    min-width: 140px;
  }
}

.product-detail {
  padding: $spacing-lg;
}

.detail-title {
  font-size: $font-lg;
  font-weight: 600;
  color: $text-primary;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border-color;
  margin-bottom: $spacing-lg;
}

.detail-content {
  p {
    font-size: $font-sm;
    color: $text-secondary;
    line-height: 1.8;
    margin-bottom: $spacing-lg;
  }
}

.detail-images {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
  
  .detail-image {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .detail-image-placeholder {
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    color: $text-muted;
    background: $bg-color;
    border-radius: $radius-md;
    
    span {
      font-size: $font-xs;
    }
  }
}
</style>
