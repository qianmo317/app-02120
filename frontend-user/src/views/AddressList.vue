<template>
  <div class="address-list-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">收货地址</h1>
        <el-button type="primary" @click="showDialog()">
          <el-icon><Plus /></el-icon>
          新增地址
        </el-button>
      </div>

      <div class="address-grid" v-loading="loading">
        <template v-if="addresses.length > 0">
          <div 
            v-for="addr in addresses" 
            :key="addr.id" 
            :class="['address-card card', { default: addr.isDefault }]"
          >
            <div class="address-header">
              <span class="name">{{ addr.name }}</span>
              <span class="phone">{{ addr.phone }}</span>
              <el-tag v-if="addr.isDefault" size="small" type="warning">默认</el-tag>
            </div>
            <p class="address-detail">
              {{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.detail }}
            </p>
            <div class="address-actions">
              <el-button type="primary" link @click="showDialog(addr)">编辑</el-button>
              <el-button type="primary" link v-if="!addr.isDefault" @click="setDefault(addr.id)">
                设为默认
              </el-button>
              <el-button type="danger" link @click="handleDelete(addr.id)">删除</el-button>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="card empty-card">
            <EmptyState text="暂无收货地址" :icon="Location">
              <template #action>
                <el-button type="primary" @click="showDialog()">添加地址</el-button>
              </template>
            </EmptyState>
          </div>
        </template>
      </div>

      <!-- 地址编辑弹窗 -->
      <el-dialog 
        v-model="dialogVisible" 
        :title="editingAddress ? '编辑地址' : '新增地址'" 
        width="500px"
      >
        <el-form :model="addressForm" :rules="rules" ref="formRef" label-width="80px">
          <el-form-item label="收货人" prop="name">
            <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="addressForm.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="所在地区" prop="region">
            <el-input v-model="addressForm.region" placeholder="请输入省市区" />
          </el-form-item>
          <el-form-item label="详细地址" prop="detail">
            <el-input 
              v-model="addressForm.detail" 
              type="textarea" 
              :rows="2"
              placeholder="请输入详细地址" 
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="addressForm.isDefault">设为默认地址</el-checkbox>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAddress" :loading="saving">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Location } from '@element-plus/icons-vue'
import api from '@/api'
import { useUserStore } from '@/stores/user'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const addresses = ref([])
const editingAddress = ref(null)
const formRef = ref(null)

const addressForm = reactive({
  name: '',
  phone: '',
  region: '',
  detail: '',
  isDefault: false
})

const rules = {
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  region: [{ required: true, message: '请输入所在地区', trigger: 'blur' }],
  detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

async function fetchAddresses() {
  loading.value = true
  try {
    const res = await api.getAddresses()
    if (res.code === 200) {
      addresses.value = res.data
    }
  } finally {
    loading.value = false
  }
}

function showDialog(addr = null) {
  editingAddress.value = addr
  if (addr) {
    addressForm.name = addr.name
    addressForm.phone = addr.phone
    addressForm.region = `${addr.province} ${addr.city} ${addr.district}`
    addressForm.detail = addr.detail
    addressForm.isDefault = addr.isDefault
  } else {
    addressForm.name = ''
    addressForm.phone = ''
    addressForm.region = ''
    addressForm.detail = ''
    addressForm.isDefault = false
  }
  dialogVisible.value = true
}

async function saveAddress() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    saving.value = true
    try {
      const addr = {
        id: editingAddress.value?.id || Date.now(),
        name: addressForm.name,
        phone: addressForm.phone,
        province: '',
        city: '',
        district: addressForm.region,
        detail: addressForm.detail,
        isDefault: addressForm.isDefault
      }
      
      if (editingAddress.value) {
        // 编辑
        const index = addresses.value.findIndex(a => a.id === editingAddress.value.id)
        if (index > -1) {
          addresses.value[index] = addr
        }
      } else {
        // 新增
        addresses.value.push(addr)
      }
      
      // 如果设为默认，取消其他默认
      if (addr.isDefault) {
        addresses.value.forEach(a => {
          if (a.id !== addr.id) {
            a.isDefault = false
          }
        })
      }
      
      dialogVisible.value = false
      ElMessage.success('保存成功')
    } finally {
      saving.value = false
    }
  })
}

function setDefault(id) {
  addresses.value.forEach(addr => {
    addr.isDefault = addr.id === id
  })
  ElMessage.success('设置成功')
}

function handleDelete(id) {
  ElMessageBox.confirm('确定要删除该地址吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    addresses.value = addresses.value.filter(a => a.id !== id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  fetchAddresses()
})
</script>

<style lang="scss" scoped>
.address-list-page {
  padding: $spacing-lg 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-base;
}

.address-card {
  padding: $spacing-lg;
  transition: all 0.2s;
  
  &.default {
    border: 1px solid $primary-color;
  }
  
  &:hover {
    box-shadow: $shadow-md;
  }
}

.address-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
  
  .name {
    font-size: $font-md;
    font-weight: 600;
    color: $text-primary;
  }
  
  .phone {
    font-size: $font-sm;
    color: $text-secondary;
  }
}

.address-detail {
  font-size: $font-sm;
  color: $text-secondary;
  line-height: 1.6;
  margin-bottom: $spacing-md;
}

.address-actions {
  display: flex;
  gap: $spacing-md;
  padding-top: $spacing-md;
  border-top: 1px solid $border-color;
}

.empty-card {
  grid-column: span 2;
}
</style>
