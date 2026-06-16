<template>
  <div class="empty-state">
    <el-icon :size="64" class="empty-icon">
      <component :is="icon" />
    </el-icon>
    <p class="empty-text">{{ text }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup>
import { ShoppingCart } from '@element-plus/icons-vue'

defineProps({
  icon: {
    type: [String, Object],
    default: () => ShoppingCart
  },
  text: {
    type: String,
    default: '暂无数据'
  }
})
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl * 2;
}

.empty-icon {
  color: $text-muted;
  margin-bottom: $spacing-base;
}

.empty-text {
  font-size: $font-sm;
  color: $text-secondary;
  margin-bottom: $spacing-base;
}
</style>
