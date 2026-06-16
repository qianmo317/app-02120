<template>
  <div class="order-list-page">
    <div class="container">
      <h1 class="page-title">我的订单</h1>

      <!-- 订单状态筛选 -->
      <div class="order-tabs card">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="全部订单" name="all" />
          <el-tab-pane label="待付款" name="0" />
          <el-tab-pane label="待发货" name="1" />
          <el-tab-pane label="待收货" name="2" />
          <el-tab-pane label="已完成" name="3" />
        </el-tabs>
      </div>

      <!-- 订单列表 -->
      <div class="order-list" v-loading="loading">
        <template v-if="orders.length > 0">
          <div v-for="order in orders" :key="order.id" class="order-card card">
            <!-- 订单头部 -->
            <div class="order-header">
              <div class="order-info">
                <span class="order-id">订单号：{{ order.id }}</span>
                <span class="order-time">{{ order.createTime }}</span>
              </div>
              <el-tag :type="orderStatus[order.status].color" size="small">
                {{ orderStatus[order.status].label }}
              </el-tag>
            </div>

            <!-- 商品列表 -->
            <div class="order-items">
              <div v-for="item in order.items" :key="item.productId" class="order-item">
                <router-link :to="`/product/${item.productId}`" class="item-link">
                  <el-image :src="item.image" fit="cover" class="item-image" />
                  <div class="item-info">
                    <p class="item-name ellipsis">{{ item.name }}</p>
                    <p class="item-price">¥{{ item.price }} × {{ item.quantity }}</p>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- 订单底部 -->
            <div class="order-footer">
              <div class="order-total">
                共 {{ order.items.reduce((sum, item) => sum + item.quantity, 0) }} 件商品，
                实付：<span class="total-price">¥{{ order.totalAmount.toFixed(2) }}</span>
              </div>
              <div class="order-actions">
                <el-button 
                  v-if="order.status === 0" 
                  type="primary" 
                  size="small"
                  @click="handlePay(order)"
                >
                  立即付款
                </el-button>
                <el-button 
                  v-if="order.status === 2" 
                  type="primary" 
                  size="small"
                  @click="handleConfirmReceive(order)"
                >
                  确认收货
                </el-button>
                <el-button v-if="order.status === 3" size="small" @click="handleRebuy(order)">
                  再次购买
                </el-button>
                <router-link :to="`/order/${order.id}`">
                  <el-button size="small">查看详情</el-button>
                </router-link>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="card">
            <EmptyState text="暂无订单" :icon="List">
              <template #action>
                <el-button type="primary" @click="$router.push('/')">去购物</el-button>
              </template>
            </EmptyState>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { List } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'
import { orderStatus } from '@/api/mock'
import { useCartStore } from '@/stores/cart'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)
const activeTab = ref('all')
const orders = ref([])

async function fetchOrders() {
  loading.value = true
  try {
    const params = activeTab.value === 'all' ? {} : { status: Number(activeTab.value) }
    const res = await api.getOrders(params)
    if (res.code === 200) {
      orders.value = res.data.list
    }
  } finally {
    loading.value = false
  }
}

function handleTabChange() {
  fetchOrders()
}

async function handlePay(order) {
  try {
    await ElMessageBox.confirm(
      `确认支付订单 ${order.id}，金额 ¥${order.totalAmount.toFixed(2)}？`,
      '确认支付',
      { confirmButtonText: '确认支付', cancelButtonText: '取消', type: 'info' }
    )
    
    const res = await api.payOrder(order.id)
    if (res.code === 200) {
      ElMessage.success('支付成功')
      fetchOrders()
    } else {
      ElMessage.error(res.message || '支付失败')
    }
  } catch {
    // 用户取消
  }
}

async function handleConfirmReceive(order) {
  try {
    await ElMessageBox.confirm(
      '确认已收到商品？',
      '确认收货',
      { confirmButtonText: '确认收货', cancelButtonText: '取消', type: 'info' }
    )
    
    const res = await api.confirmReceive(order.id)
    if (res.code === 200) {
      ElMessage.success('确认收货成功')
      fetchOrders()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch {
    // 用户取消
  }
}

function handleRebuy(order) {
  order.items.forEach(item => {
    cartStore.addItem({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image
    }, item.quantity)
  })
  ElMessage.success('已加入购物车')
  router.push('/cart')
}

onMounted(() => {
  fetchOrders()
})
</script>

<style lang="scss" scoped>
.order-list-page {
  padding: $spacing-lg 0;
}

.order-tabs {
  margin-bottom: $spacing-base;
  padding: 0 $spacing-base;
  
  :deep(.el-tabs__header) {
    margin: 0;
  }
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.order-card {
  padding: 0;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md $spacing-lg;
  background: $bg-color;
}

.order-info {
  display: flex;
  gap: $spacing-lg;
  font-size: $font-sm;
  color: $text-secondary;
}

.order-items {
  padding: $spacing-base $spacing-lg;
}

.order-item {
  padding: $spacing-md 0;
  border-bottom: 1px solid $border-color;
  
  &:last-child {
    border-bottom: none;
  }
}

.item-link {
  display: flex;
  gap: $spacing-md;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: $radius-sm;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  
  .item-name {
    font-size: $font-sm;
    color: $text-primary;
    margin-bottom: $spacing-xs;
    
    &:hover {
      color: $primary-color;
    }
  }
  
  .item-price {
    font-size: $font-xs;
    color: $text-secondary;
  }
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md $spacing-lg;
  border-top: 1px solid $border-color;
}

.order-total {
  font-size: $font-sm;
  color: $text-secondary;
  
  .total-price {
    font-size: $font-md;
    font-weight: 600;
    color: $primary-color;
  }
}

.order-actions {
  display: flex;
  gap: $spacing-sm;
}
</style>
