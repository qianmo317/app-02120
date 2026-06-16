<template>
  <div class="order-detail-page">
    <div class="container" v-loading="loading">
      <h1 class="page-title">订单详情</h1>

      <template v-if="order">
        <!-- 订单状态 -->
        <div class="status-card card">
          <div class="status-icon">
            <el-icon :size="48">
              <CircleCheck v-if="order.status === 3" />
              <Clock v-else />
            </el-icon>
          </div>
          <div class="status-info">
            <h2 class="status-text">{{ orderStatus[order.status].label }}</h2>
            <p class="status-desc" v-if="order.status === 0">请在24小时内完成支付</p>
            <p class="status-desc" v-else-if="order.status === 1">商家正在备货中</p>
            <p class="status-desc" v-else-if="order.status === 2">商品已发出，请注意查收</p>
            <p class="status-desc" v-else-if="order.status === 3">感谢您的购买</p>
          </div>
        </div>

        <!-- 收货信息 -->
        <div class="address-card card">
          <h3 class="card-title">
            <el-icon><Location /></el-icon>
            收货信息
          </h3>
          <div class="address-content">
            <p><span class="label">收货人：</span>{{ order.address.name }}</p>
            <p><span class="label">联系电话：</span>{{ order.address.phone }}</p>
            <p><span class="label">收货地址：</span>{{ order.address.province }}{{ order.address.city }}{{ order.address.district }}{{ order.address.detail }}</p>
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="goods-card card">
          <h3 class="card-title">
            <el-icon><Goods /></el-icon>
            商品信息
          </h3>
          <div class="goods-list">
            <div v-for="item in order.items" :key="item.productId" class="goods-item">
              <router-link :to="`/product/${item.productId}`" class="goods-link">
                <el-image :src="item.image" fit="cover" class="goods-image" />
                <div class="goods-info">
                  <p class="goods-name ellipsis">{{ item.name }}</p>
                  <p class="goods-price">¥{{ item.price }}</p>
                </div>
              </router-link>
              <div class="goods-quantity">× {{ item.quantity }}</div>
              <div class="goods-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="info-card card">
          <h3 class="card-title">
            <el-icon><Document /></el-icon>
            订单信息
          </h3>
          <div class="info-content">
            <p><span class="label">订单编号：</span>{{ order.id }}</p>
            <p><span class="label">下单时间：</span>{{ order.createTime }}</p>
            <p v-if="order.payTime"><span class="label">支付时间：</span>{{ order.payTime }}</p>
          </div>
        </div>

        <!-- 金额信息 -->
        <div class="amount-card card">
          <div class="amount-row">
            <span>商品金额</span>
            <span>¥{{ order.totalAmount.toFixed(2) }}</span>
          </div>
          <div class="amount-row">
            <span>运费</span>
            <span>免运费</span>
          </div>
          <div class="amount-row total">
            <span>实付金额</span>
            <span class="total-price">¥{{ order.totalAmount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-bar">
          <el-button v-if="order.status === 0" type="primary" size="large">
            立即付款
          </el-button>
          <el-button v-if="order.status === 2" type="primary" size="large">
            确认收货
          </el-button>
          <el-button size="large" @click="$router.push('/orders')">
            返回订单列表
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/api'
import { orderStatus } from '@/api/mock'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const order = ref(null)

async function fetchOrder() {
  loading.value = true
  try {
    const res = await api.getOrderDetail(route.params.id)
    if (res.code === 200) {
      order.value = res.data
    } else {
      ElMessage.error(res.message || '订单不存在')
      router.push('/orders')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrder()
})
</script>

<style lang="scss" scoped>
.order-detail-page {
  padding: $spacing-lg 0;
}

.status-card {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-base;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  color: white;
}

.status-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.status-text {
  font-size: $font-xl;
  font-weight: 600;
  margin-bottom: $spacing-xs;
}

.status-desc {
  font-size: $font-sm;
  opacity: 0.9;
}

.card-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-base;
  
  .el-icon {
    color: $primary-color;
  }
}

.address-card,
.goods-card,
.info-card,
.amount-card {
  padding: $spacing-lg;
  margin-bottom: $spacing-base;
}

.address-content,
.info-content {
  p {
    font-size: $font-sm;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .label {
    color: $text-muted;
    margin-right: $spacing-sm;
  }
}

.goods-list {
  display: flex;
  flex-direction: column;
}

.goods-item {
  display: flex;
  align-items: center;
  padding: $spacing-md 0;
  border-bottom: 1px solid $border-color;
  
  &:last-child {
    border-bottom: none;
  }
}

.goods-link {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  flex: 1;
}

.goods-image {
  width: 60px;
  height: 60px;
  border-radius: $radius-sm;
  flex-shrink: 0;
}

.goods-info {
  flex: 1;
  
  .goods-name {
    font-size: $font-sm;
    color: $text-primary;
    margin-bottom: $spacing-xs;
    
    &:hover {
      color: $primary-color;
    }
  }
  
  .goods-price {
    font-size: $font-xs;
    color: $text-secondary;
  }
}

.goods-quantity {
  width: 60px;
  text-align: center;
  font-size: $font-sm;
  color: $text-secondary;
}

.goods-subtotal {
  width: 100px;
  text-align: right;
  font-size: $font-md;
  font-weight: 600;
  color: $text-primary;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  padding: $spacing-sm 0;
  font-size: $font-sm;
  color: $text-secondary;
  
  &.total {
    padding-top: $spacing-base;
    border-top: 1px solid $border-color;
    margin-top: $spacing-sm;
  }
}

.total-price {
  font-size: $font-xl;
  font-weight: 700;
  color: $primary-color;
}

.action-bar {
  display: flex;
  justify-content: center;
  gap: $spacing-base;
  padding: $spacing-lg 0;
}
</style>
