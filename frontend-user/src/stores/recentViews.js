import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'recentViews'
const MAX_ITEMS = 50

export const useRecentViewsStore = defineStore('recentViews', () => {
  const items = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

  const count = computed(() => items.value.length)

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  function addItem(product) {
    const productId = product.id
    const index = items.value.findIndex(item => item.productId === productId)

    if (index > -1) {
      items.value.splice(index, 1)
    }

    items.value.unshift({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      viewTime: new Date().toISOString()
    })

    if (items.value.length > MAX_ITEMS) {
      items.value = items.value.slice(0, MAX_ITEMS)
    }

    saveToStorage()
  }

  function removeItem(productId) {
    const index = items.value.findIndex(item => item.productId === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  function clearAll() {
    items.value = []
    saveToStorage()
  }

  return {
    items,
    count,
    addItem,
    removeItem,
    clearAll
  }
})
