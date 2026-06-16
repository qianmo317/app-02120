<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="page-title">确认订单</h1>

      <div class="checkout-content">
        <!-- 收货地址 -->
        <section class="address-section card">
          <h2 class="section-title">
            <el-icon><Location /></el-icon>
            收货地址
          </h2>
          
          <div class="address-list" v-if="addresses.length > 0">
            <div 
              v-for="addr in addresses" 
              :key="addr.id"
              :class="['address-item', { selected: selectedAddress?.id === addr.id }]"
              @click="selectedAddress = addr"
            >
              <div class="address-info">
                <span class="name">{{ addr.name }}</span>
                <span class="phone">{{ addr.phone }}</span>
                <el-tag v-if="addr.isDefault" size="small" type="warning">默认</el-tag>
              </div>
              <p class="address-detail">
                {{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.detail }}
              </p>
            </div>
          </div>
          
          <el-button type="primary" link @click="showAddressDialog = true">
            <el-icon><Plus /></el-icon>
            添加新地址
          </el-button>
        </section>

        <!-- 商品清单 -->
        <section class="goods-section card">
          <h2 class="section-title">
            <el-icon><Goods /></el-icon>
            商品清单
          </h2>
          
          <div class="goods-list">
            <div v-for="item in cartStore.selectedItems" :key="item.productId" class="goods-item">
              <el-image :src="item.image" fit="cover" class="goods-image" />
              <div class="goods-info">
                <p class="goods-name ellipsis">{{ item.name }}</p>
                <p class="goods-price">¥{{ item.price }} × {{ item.quantity }}</p>
              </div>
              <span class="goods-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </section>

        <!-- 订单备注 -->
        <section class="remark-section card">
          <h2 class="section-title">
            <el-icon><EditPen /></el-icon>
            订单备注
          </h2>
          <el-input 
            v-model="remark" 
            type="textarea" 
            :rows="2"
            placeholder="选填，可以告诉卖家您的特殊需求"
            maxlength="200"
            show-word-limit
          />
        </section>

        <!-- 结算信息 -->
        <section class="summary-section card">
          <div class="summary-row">
            <span>商品金额</span>
            <span>¥{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>运费</span>
            <span>{{ freight > 0 ? '¥' + freight.toFixed(2) : '免运费' }}</span>
          </div>
          <div class="summary-row total">
            <span>应付金额</span>
            <span class="total-price">¥{{ totalAmount.toFixed(2) }}</span>
          </div>
        </section>

        <!-- 提交订单 -->
        <div class="submit-bar card">
          <div class="submit-info">
            <span>收货地址：</span>
            <span v-if="selectedAddress" class="address-text">
              {{ selectedAddress.name }} {{ selectedAddress.phone }} 
              {{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}
            </span>
            <span v-else class="no-address">请选择收货地址</span>
          </div>
          <div class="submit-action">
            <span class="pay-amount">
              应付：<em>¥{{ totalAmount.toFixed(2) }}</em>
            </span>
            <el-button 
              type="primary" 
              size="large"
              :disabled="!selectedAddress"
              :loading="submitting"
              @click="submitOrder"
            >
              提交订单
            </el-button>
          </div>
        </div>
      </div>

      <!-- 添加地址弹窗 -->
      <el-dialog v-model="showAddressDialog" title="添加收货地址" width="500px">
        <el-form ref="addressFormRef" :model="newAddress" :rules="addressRules" label-width="80px">
          <el-form-item label="收货人" prop="name">
            <el-input v-model="newAddress.name" placeholder="请输入收货人姓名" maxlength="20" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="newAddress.phone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
          <el-form-item label="所在地区" prop="region">
            <el-input v-model="newAddress.region" placeholder="请输入省市区，如：北京市朝阳区" />
          </el-form-item>
          <el-form-item label="详细地址" prop="detail">
            <el-input v-model="newAddress.detail" type="textarea" placeholder="请输入详细地址，如：xx街道xx号xx室" maxlength="100" show-word-limit />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="newAddress.isDefault">设为默认地址</el-checkbox>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showAddressDialog = false">取消</el-button>
          <el-button type="primary" @click="saveAddress">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/api'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const addresses = ref([])
const selectedAddress = ref(null)
const remark = ref('')
const submitting = ref(false)
const showAddressDialog = ref(false)
const addressFormRef = ref(null)
const newAddress = ref({
  name: '',
  phone: '',
  region: '',
  detail: '',
  isDefault: false
})

// 地址表单校验规则
const addressRules = {
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请输入所在地区', trigger: 'blur' },
    { min: 4, message: '请输入完整的省市区信息', trigger: 'blur' }
  ],
  detail: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 100, message: '详细地址长度为5-100个字符', trigger: 'blur' }
  ]
}

const freight = computed(() => {
  return cartStore.totalPrice >= 99 ? 0 : 10
})

const totalAmount = computed(() => {
  return cartStore.totalPrice + freight.value
})

async function fetchAddresses() {
  const res = await api.getAddresses()
  if (res.code === 200) {
    addresses.value = res.data
    selectedAddress.value = res.data.find(a => a.isDefault) || res.data[0]
  }
}

function saveAddress() {
  if (!addressFormRef.value) return
  
  addressFormRef.value.validate((valid) => {
    if (!valid) return
    
    const addr = {
      id: Date.now(),
      name: newAddress.value.name,
      phone: newAddress.value.phone,
      province: '',
      city: '',
      district: newAddress.value.region,
      detail: newAddress.value.detail,
      isDefault: newAddress.value.isDefault
    }
    
    addresses.value.push(addr)
    selectedAddress.value = addr
    showAddressDialog.value = false
    ElMessage.success('地址添加成功')
    
    // 重置表单
    newAddress.value = { name: '', phone: '', region: '', detail: '', isDefault: false }
    addressFormRef.value.resetFields()
  })
}

async function submitOrder() {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }
  
  submitting.value = true
  
  try {
    const orderData = {
      items: cartStore.selectedItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: totalAmount.value,
      address: selectedAddress.value,
      remark: remark.value
    }
    
    const res = await api.createOrder(orderData)
    
    if (res.code === 200) {
      ElMessage.success('订单提交成功')
      cartStore.clearSelected()
      router.push('/orders')
    } else {
      ElMessage.error(res.message || '订单提交失败')
    }
  } catch (error) {
    ElMessage.error('订单提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (cartStore.selectedItems.length === 0) {
    ElMessage.warning('请先选择商品')
    router.push('/cart')
    return
  }
  fetchAddresses()
})
</script>

<style lang="scss" scoped>
.checkout-page {
  padding: $spacing-lg 0;
}

.checkout-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.section-title {
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

.address-section {
  padding: $spacing-lg;
}

.address-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-base;
  margin-bottom: $spacing-base;
}

.address-item {
  padding: $spacing-base;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: $primary-light;
  }
  
  &.selected {
    border-color: $primary-color;
    background: rgba($primary-color, 0.05);
  }
}

.address-info {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-xs;
  
  .name {
    font-weight: 600;
    color: $text-primary;
  }
  
  .phone {
    color: $text-secondary;
  }
}

.address-detail {
  font-size: $font-sm;
  color: $text-secondary;
}

.goods-section {
  padding: $spacing-lg;
}

.goods-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.goods-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg-color;
  border-radius: $radius-md;
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
  }
  
  .goods-price {
    font-size: $font-xs;
    color: $text-secondary;
  }
}

.goods-subtotal {
  font-size: $font-md;
  font-weight: 600;
  color: $primary-color;
}

.remark-section {
  padding: $spacing-lg;
}

.summary-section {
  padding: $spacing-lg;
}

.summary-row {
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

.submit-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-base $spacing-lg;
  position: sticky;
  bottom: 0;
}

.submit-info {
  font-size: $font-sm;
  color: $text-secondary;
  
  .address-text {
    color: $text-primary;
  }
  
  .no-address {
    color: $error-color;
  }
}

.submit-action {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.pay-amount {
  font-size: $font-sm;
  color: $text-secondary;
  
  em {
    font-style: normal;
    font-size: $font-xl;
    font-weight: 700;
    color: $primary-color;
  }
}
</style>
