<template>
  <div class="product-list-page">
    <div class="container">
      <!-- 筛选栏 -->
      <div class="filter-bar card">
        <div class="filter-row">
          <span class="filter-label">排序：</span>
          <div class="filter-options">
            <button 
              :class="['filter-btn', { active: sortType === '' }]"
              @click="changeSort('')"
            >
              综合
            </button>
            <button 
              :class="['filter-btn', { active: sortType === 'sales' }]"
              @click="changeSort('sales')"
            >
              销量
            </button>
            <button 
              :class="['filter-btn', { active: sortType.startsWith('price') }]"
              @click="togglePriceSort"
            >
              价格
              <el-icon v-if="sortType === 'price-asc'"><SortUp /></el-icon>
              <el-icon v-else-if="sortType === 'price-desc'"><SortDown /></el-icon>
            </button>
          </div>
        </div>
        
        <div class="filter-info">
          <span v-if="keyword">搜索：{{ keyword }}</span>
          <span>共 {{ total }} 件商品</span>
        </div>
      </div>

      <!-- 商品列表 -->
      <div v-if="products.length > 0" class="product-grid" v-loading="loading">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product" 
        />
      </div>
      <div v-else class="empty-wrapper" v-loading="loading">
        <EmptyState text="暂无相关商品" :icon="Search">
          <template #action>
            <el-button type="primary" @click="$router.push('/')">去首页逛逛</el-button>
          </template>
        </EmptyState>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import api from '@/api'
import ProductCard from '@/components/common/ProductCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const products = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const sortType = ref('')
const keyword = ref('')
const categoryId = ref(null)

async function fetchProducts() {
  loading.value = true
  try {
    const res = await api.getProducts({
      page: currentPage.value,
      pageSize: pageSize.value,
      sort: sortType.value,
      keyword: keyword.value,
      categoryId: categoryId.value
    })
    products.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function changeSort(type) {
  sortType.value = type
  currentPage.value = 1
  fetchProducts()
}

function togglePriceSort() {
  if (sortType.value === 'price-asc') {
    sortType.value = 'price-desc'
  } else {
    sortType.value = 'price-asc'
  }
  currentPage.value = 1
  fetchProducts()
}

function handlePageChange(page) {
  currentPage.value = page
  fetchProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(() => route.query, (query) => {
  keyword.value = query.keyword || ''
  categoryId.value = query.categoryId ? Number(query.categoryId) : null
  sortType.value = query.sort || ''
  currentPage.value = 1
  fetchProducts()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.product-list-page {
  padding: $spacing-lg 0;
}

.filter-bar {
  margin-bottom: $spacing-base;
  padding: $spacing-base $spacing-lg;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  margin-bottom: $spacing-md;
}

.filter-label {
  font-size: $font-sm;
  color: $text-secondary;
}

.filter-options {
  display: flex;
  gap: $spacing-sm;
}

.filter-btn {
  padding: $spacing-sm $spacing-base;
  font-size: $font-sm;
  color: $text-secondary;
  border-radius: $radius-sm;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  
  &:hover {
    color: $primary-color;
    background: rgba($primary-color, 0.08);
  }
  
  &.active {
    color: $primary-color;
    background: rgba($primary-color, 0.1);
  }
}

.filter-info {
  display: flex;
  gap: $spacing-base;
  font-size: $font-xs;
  color: $text-muted;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-base;
  min-height: 400px;
}

.empty-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: $spacing-lg;
}
</style>
