import { ElMessage } from 'element-plus'
import mockApi from './mock'

// API 错误拦截器
const withErrorHandler = (apiCall) => {
  return async (...args) => {
    try {
      const res = await apiCall(...args)
      
      // 统一处理业务错误
      if (res.code && res.code !== 200) {
        // 401 未授权
        if (res.code === 401) {
          ElMessage.error('登录已过期，请重新登录')
          // 可以在这里触发登出逻辑
          return res
        }
        
        // 404 资源不存在
        if (res.code === 404) {
          ElMessage.error(res.message || '请求的资源不存在')
          return res
        }
        
        // 其他业务错误
        if (res.code >= 400) {
          ElMessage.error(res.message || '操作失败，请重试')
          return res
        }
      }
      
      return res
    } catch (error) {
      console.error('API Error:', error)
      
      // 网络错误
      if (error.message === 'Network Error') {
        ElMessage.error('网络连接失败，请检查网络')
      } else if (error.code === 'ECONNABORTED') {
        ElMessage.error('请求超时，请重试')
      } else {
        ElMessage.error('系统异常，请稍后重试')
      }
      
      // 返回统一的错误格式
      return { code: 500, message: error.message || '系统异常' }
    }
  }
}

// 统一 API 导出（带错误拦截）
export const api = {
  // 分类
  getCategories: withErrorHandler(() => mockApi.getCategories()),
  
  // 商品
  getProducts: withErrorHandler((params) => mockApi.getProducts(params)),
  getProductDetail: withErrorHandler((id) => mockApi.getProductDetail(id)),
  getBanners: withErrorHandler(() => mockApi.getBanners()),
  
  // 订单
  getOrders: withErrorHandler((params) => mockApi.getOrders(params)),
  getOrderDetail: withErrorHandler((id) => mockApi.getOrderDetail(id)),
  createOrder: withErrorHandler((data) => mockApi.createOrder(data)),
  payOrder: withErrorHandler((orderId) => mockApi.payOrder(orderId)),
  confirmReceive: withErrorHandler((orderId) => mockApi.confirmReceive(orderId)),
  
  // 地址
  getAddresses: withErrorHandler(() => mockApi.getAddresses()),
  
  // 用户
  login: withErrorHandler((data) => mockApi.login(data)),
  register: withErrorHandler((data) => mockApi.register(data)),
  getUserInfo: withErrorHandler(() => mockApi.getUserInfo()),
  updateUserInfo: withErrorHandler((data) => mockApi.updateUserInfo(data))
}

export default api
