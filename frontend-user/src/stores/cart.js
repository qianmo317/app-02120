import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))

  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const selectedItems = computed(() => {
    return items.value.filter(item => item.selected)
  })

  const selectedCount = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  const isAllSelected = computed(() => {
    return items.value.length > 0 && items.value.every(item => item.selected)
  })

  function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  function addItem(product, quantity = 1) {
    const existingItem = items.value.find(item => item.productId === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        selected: true,
        stock: product.stock
      })
    }
    
    saveToStorage()
    ElMessage.success('已添加到购物车')
  }

  function removeItem(productId) {
    const index = items.value.findIndex(item => item.productId === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.productId === productId)
    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, item.stock))
      saveToStorage()
    }
  }

  function toggleSelect(productId) {
    const item = items.value.find(item => item.productId === productId)
    if (item) {
      item.selected = !item.selected
      saveToStorage()
    }
  }

  function toggleSelectAll() {
    const newValue = !isAllSelected.value
    items.value.forEach(item => {
      item.selected = newValue
    })
    saveToStorage()
  }

  function clearSelected() {
    items.value = items.value.filter(item => !item.selected)
    saveToStorage()
  }

  function clearCart() {
    items.value = []
    saveToStorage()
  }

  return {
    items,
    totalCount,
    selectedItems,
    selectedCount,
    totalPrice,
    isAllSelected,
    addItem,
    removeItem,
    updateQuantity,
    toggleSelect,
    toggleSelectAll,
    clearSelected,
    clearCart
  }
})
