import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  // 从 localStorage 恢复用户信息，避免刷新时闪烁
  const savedUserInfo = localStorage.getItem('userInfo')
  const userInfo = ref(savedUserInfo ? JSON.parse(savedUserInfo) : null)

  const isLoggedIn = computed(() => !!token.value)

  // 保存用户信息到 localStorage
  function saveUserInfo(info) {
    userInfo.value = info
    if (info) {
      localStorage.setItem('userInfo', JSON.stringify(info))
    } else {
      localStorage.removeItem('userInfo')
    }
  }

  async function login(data) {
    const res = await api.login(data)
    if (res.code === 200) {
      token.value = res.data.token
      saveUserInfo(res.data.user)
      localStorage.setItem('token', res.data.token)
      return { success: true }
    }
    return { success: false, message: res.message }
  }

  async function register(data) {
    const res = await api.register(data)
    if (res.code === 200) {
      token.value = res.data.token
      saveUserInfo(res.data.user)
      localStorage.setItem('token', res.data.token)
      return { success: true }
    }
    return { success: false, message: res.message }
  }

  async function fetchUserInfo() {
    if (!token.value) return
    const res = await api.getUserInfo()
    if (res.code === 200) {
      saveUserInfo(res.data)
    }
  }

  async function updateUserInfo(data) {
    const res = await api.updateUserInfo(data)
    if (res.code === 200) {
      saveUserInfo(res.data)
      return { success: true }
    }
    return { success: false, message: res.message }
  }

  function logout() {
    token.value = ''
    saveUserInfo(null)
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    register,
    fetchUserInfo,
    updateUserInfo,
    logout
  }
})
