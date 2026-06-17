import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBrowseHistoryStore = defineStore('browseHistory', () => {
  const items = ref(JSON.parse(localStorage.getItem('browseHistory') || '[]'))

  const count = computed(() => items.value.length)

  const sortedItems = computed(() => {
    return [...items.value].sort((a, b) => new Date(b.browseTime) - new Date(a.browseTime))
  })

  function saveToStorage() {
    localStorage.setItem('browseHistory', JSON.stringify(items.value))
  }

  function addRecord(product) {
    const existingIndex = items.value.findIndex(item => item.productId === product.id)
    if (existingIndex > -1) {
      items.value.splice(existingIndex, 1)
    }

    items.value.unshift({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      browseTime: new Date().toISOString()
    })

    if (items.value.length > 50) {
      items.value = items.value.slice(0, 50)
    }

    saveToStorage()
  }

  function removeRecord(productId) {
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
    sortedItems,
    addRecord,
    removeRecord,
    clearAll
  }
})
