<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">购物车</h1>

      <template v-if="cartStore.items.length > 0">
        <div class="cart-content">
          <!-- 购物车列表 -->
          <div class="cart-list card">
            <!-- 表头 -->
            <div class="cart-header">
              <el-checkbox 
                :model-value="cartStore.isAllSelected"
                @change="cartStore.toggleSelectAll"
              >
                全选
              </el-checkbox>
              <span class="col-product">商品信息</span>
              <span class="col-price">单价</span>
              <span class="col-quantity">数量</span>
              <span class="col-subtotal">小计</span>
              <span class="col-action">操作</span>
            </div>

            <!-- 商品列表 -->
            <div class="cart-items">
              <div v-for="item in cartStore.items" :key="item.productId" class="cart-item">
                <el-checkbox 
                  :model-value="item.selected"
                  @change="cartStore.toggleSelect(item.productId)"
                />
                
                <div class="col-product">
                  <router-link :to="`/product/${item.productId}`" class="product-link">
                    <el-image :src="item.image" fit="cover" class="product-image">
                      <template #error>
                        <div class="image-placeholder">
                          <el-icon><Picture /></el-icon>
                        </div>
                      </template>
                    </el-image>
                    <span class="product-name ellipsis-2">{{ item.name }}</span>
                  </router-link>
                </div>
                
                <div class="col-price">
                  <span class="price">¥{{ item.price }}</span>
                </div>
                
                <div class="col-quantity">
                  <QuantitySelector 
                    :model-value="item.quantity"
                    :max="item.stock"
                    @update:model-value="(val) => cartStore.updateQuantity(item.productId, val)"
                  />
                </div>
                
                <div class="col-subtotal">
                  <span class="subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
                
                <div class="col-action">
                  <el-button 
                    type="danger" 
                    link 
                    @click="handleRemove(item.productId)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 结算栏 -->
          <div class="cart-footer card">
            <div class="footer-left">
              <el-checkbox 
                :model-value="cartStore.isAllSelected"
                @change="cartStore.toggleSelectAll"
              >
                全选
              </el-checkbox>
              <el-button type="danger" link @click="handleClearSelected" :disabled="cartStore.selectedCount === 0">
                删除选中
              </el-button>
            </div>
            
            <div class="footer-right">
              <div class="summary">
                <span>已选 <em>{{ cartStore.selectedCount }}</em> 件商品</span>
                <span class="total-label">合计：</span>
                <span class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
              <el-button 
                type="primary" 
                size="large"
                :disabled="cartStore.selectedCount === 0"
                @click="goCheckout"
              >
                去结算
              </el-button>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="card">
          <EmptyState text="购物车是空的" :icon="ShoppingCart">
            <template #action>
              <el-button type="primary" @click="$router.push('/')">去购物</el-button>
            </template>
          </EmptyState>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ShoppingCart } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import QuantitySelector from '@/components/common/QuantitySelector.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

function handleRemove(productId) {
  ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cartStore.removeItem(productId)
    ElMessage.success('已删除')
  }).catch(() => {})
}

function handleClearSelected() {
  ElMessageBox.confirm('确定要删除选中的商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cartStore.clearSelected()
    ElMessage.success('已删除')
  }).catch(() => {})
}

function goCheckout() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  router.push('/checkout')
}
</script>

<style lang="scss" scoped>
.cart-page {
  padding: $spacing-lg 0;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.cart-list {
  padding: 0;
}

.cart-header {
  display: flex;
  align-items: center;
  padding: $spacing-base $spacing-lg;
  background: $bg-color;
  font-size: $font-sm;
  color: $text-secondary;
  
  .el-checkbox {
    margin-right: $spacing-base;
  }
}

.col-product {
  flex: 1;
}

.col-price,
.col-quantity,
.col-subtotal,
.col-action {
  width: 120px;
  text-align: center;
}

.cart-items {
  padding: $spacing-base;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: $spacing-base;
  border-bottom: 1px solid $border-color;
  
  &:last-child {
    border-bottom: none;
  }
  
  .el-checkbox {
    margin-right: $spacing-base;
  }
}

.product-link {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: $radius-sm;
  flex-shrink: 0;
  
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

.product-name {
  font-size: $font-sm;
  color: $text-primary;
  max-width: 300px;
  
  &:hover {
    color: $primary-color;
  }
}

.price {
  font-size: $font-sm;
  color: $text-primary;
}

.subtotal {
  font-size: $font-md;
  font-weight: 600;
  color: $primary-color;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-base $spacing-lg;
  position: sticky;
  bottom: 0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.summary {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
  font-size: $font-sm;
  color: $text-secondary;
  
  em {
    font-style: normal;
    color: $primary-color;
    font-weight: 600;
  }
}

.total-label {
  margin-left: $spacing-base;
}

.total-price {
  font-size: $font-xxl;
  font-weight: 700;
  color: $primary-color;
}
</style>
