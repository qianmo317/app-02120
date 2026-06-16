<template>
  <div class="quantity-selector">
    <button 
      class="qty-btn" 
      :disabled="modelValue <= min"
      @click="decrease"
    >
      <el-icon><Minus /></el-icon>
    </button>
    <input 
      type="number" 
      class="qty-input"
      :value="modelValue"
      :min="min"
      :max="max"
      @change="handleChange"
    />
    <button 
      class="qty-btn" 
      :disabled="modelValue >= max"
      @click="increase"
    >
      <el-icon><Plus /></el-icon>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 999
  }
})

const emit = defineEmits(['update:modelValue'])

function decrease() {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1)
  }
}

function increase() {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1)
  }
}

function handleChange(e) {
  let value = parseInt(e.target.value) || props.min
  value = Math.max(props.min, Math.min(props.max, value))
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped>
.quantity-selector {
  display: inline-flex;
  align-items: center;
  border: 1px solid $border-color;
  border-radius: $radius-sm;
  overflow: hidden;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-color;
  color: $text-secondary;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: $primary-color;
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.qty-input {
  width: 50px;
  height: 32px;
  border: none;
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  text-align: center;
  font-size: $font-sm;
  color: $text-primary;
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &:focus {
    outline: none;
  }
}
</style>
