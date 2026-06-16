import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

  const count = computed(() => items.value.length)

  function saveToStorage() {
    localStorage.setItem('favorites', JSON.stringify(items.value))
  }

  function isFavorite(productId) {
    return items.value.some(item => item.productId === productId)
  }

  function addItem(product) {
    if (isFavorite(product.id)) {
      ElMessage.warning('该商品已在收藏夹中')
      return
    }
    
    items.value.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      addTime: new Date().toISOString()
    })
    
    saveToStorage()
    ElMessage.success('收藏成功')
  }

  function removeItem(productId) {
    const index = items.value.findIndex(item => item.productId === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
      ElMessage.success('已取消收藏')
    }
  }

  function toggleFavorite(product) {
    if (isFavorite(product.id)) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  function clearAll() {
    items.value = []
    saveToStorage()
  }

  return {
    items,
    count,
    isFavorite,
    addItem,
    removeItem,
    toggleFavorite,
    clearAll
  }
})
