<template>
  <div class="category-page">
    <div class="container">
      <div class="category-layout">
        <!-- 左侧分类列表 -->
        <aside class="category-sidebar card">
          <h3 class="sidebar-title">全部分类</h3>
          <ul class="category-list">
            <li 
              v-for="cat in categories" 
              :key="cat.id"
              :class="['category-item', { active: activeCategory === cat.id }]"
              @click="selectCategory(cat.id)"
            >
              <el-icon><component :is="cat.icon" /></el-icon>
              <span>{{ cat.name }}</span>
              <el-icon class="arrow"><ArrowRight /></el-icon>
            </li>
          </ul>
        </aside>

        <!-- 右侧子分类展示 -->
        <main class="category-main card">
          <template v-if="currentCategory">
            <h2 class="main-title">{{ currentCategory.name }}</h2>
            
            <div class="subcategory-grid">
              <router-link 
                v-for="sub in currentCategory.children" 
                :key="sub.id"
                :to="`/products?categoryId=${sub.id}`"
                class="subcategory-item"
              >
                <div class="subcategory-image">
                  <el-image 
                    :src="sub.image" 
                    fit="cover"
                  >
                    <template #error>
                      <div class="image-placeholder">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
                <span class="subcategory-name">{{ sub.name }}</span>
              </router-link>
            </div>

            <!-- 该分类热门商品 -->
            <div class="hot-products">
              <h3 class="hot-title">热门商品</h3>
              <div class="product-grid" v-loading="loading">
                <ProductCard 
                  v-for="product in categoryProducts" 
                  :key="product.id" 
                  :product="product" 
                />
              </div>
            </div>
          </template>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import ProductCard from '@/components/common/ProductCard.vue'

const route = useRoute()
const loading = ref(false)
const categories = ref([])
const activeCategory = ref(null)
const categoryProducts = ref([])

const currentCategory = computed(() => {
  return categories.value.find(c => c.id === activeCategory.value)
})

async function selectCategory(id) {
  activeCategory.value = id
  loading.value = true
  try {
    const res = await api.getProducts({ categoryId: id, pageSize: 4 })
    categoryProducts.value = res.data.list
  } finally {
    loading.value = false
  }
}

// 监听路由参数变化
watch(() => route.query.id, (newId) => {
  if (newId && categories.value.length > 0) {
    const id = Number(newId)
    if (categories.value.some(c => c.id === id)) {
      selectCategory(id)
    }
  }
})

onMounted(async () => {
  const res = await api.getCategories()
  categories.value = res.data
  
  // 优先使用 URL 参数中的分类 ID
  const queryId = route.query.id ? Number(route.query.id) : null
  if (queryId && categories.value.some(c => c.id === queryId)) {
    selectCategory(queryId)
  } else if (categories.value.length > 0) {
    selectCategory(categories.value[0].id)
  }
})
</script>

<style lang="scss" scoped>
.category-page {
  padding: $spacing-lg 0;
}

.category-layout {
  display: flex;
  gap: $spacing-base;
}

.category-sidebar {
  width: 240px;
  flex-shrink: 0;
  padding: $spacing-base;
}

.sidebar-title {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border-color;
  margin-bottom: $spacing-md;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.category-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all 0.2s;
  color: $text-secondary;
  
  .arrow {
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  &:hover {
    background: $bg-color;
    color: $text-primary;
    
    .arrow {
      opacity: 1;
    }
  }
  
  &.active {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
    
    .arrow {
      opacity: 1;
    }
  }
}

.category-main {
  flex: 1;
  padding: $spacing-lg;
}

.main-title {
  font-size: $font-xl;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.subcategory-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: $spacing-base;
  margin-bottom: $spacing-xl;
}

.subcategory-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  border-radius: $radius-md;
  transition: all 0.2s;
  
  &:hover {
    background: $bg-color;
    
    .subcategory-image {
      transform: scale(1.05);
    }
  }
}

.subcategory-image {
  width: 80px;
  height: 80px;
  border-radius: $radius-md;
  overflow: hidden;
  transition: transform 0.2s;
  
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

.subcategory-name {
  font-size: $font-sm;
  color: $text-primary;
}

.hot-products {
  border-top: 1px solid $border-color;
  padding-top: $spacing-lg;
}

.hot-title {
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-base;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-base;
}
</style>
