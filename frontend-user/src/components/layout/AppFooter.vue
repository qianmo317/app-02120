<template>
  <footer class="app-footer">
    <div class="footer-content container">
      <!-- 服务保障 -->
      <div class="service-bar">
        <div class="service-item">
          <el-icon :size="24"><Van /></el-icon>
          <div class="service-info">
            <span class="title">全国包邮</span>
            <span class="desc">满99元免运费</span>
          </div>
        </div>
        <div class="service-item">
          <el-icon :size="24"><Refresh /></el-icon>
          <div class="service-info">
            <span class="title">7天无理由</span>
            <span class="desc">退换无忧</span>
          </div>
        </div>
        <div class="service-item">
          <el-icon :size="24"><CircleCheck /></el-icon>
          <div class="service-info">
            <span class="title">正品保障</span>
            <span class="desc">品质保证</span>
          </div>
        </div>
        <div class="service-item">
          <el-icon :size="24"><Service /></el-icon>
          <div class="service-info">
            <span class="title">客服服务</span>
            <span class="desc">24小时在线</span>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="copyright">
        <p>© 2024 优品商城 版权所有</p>
        <p>本站仅供学习演示使用，不提供真实商品交易服务</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.app-footer {
  background: $bg-white;
  margin-top: $spacing-xl;
}

.footer-content {
  padding: $spacing-xl 0;
}

.service-bar {
  display: flex;
  justify-content: space-around;
  padding: $spacing-lg 0;
}

.service-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  color: $text-secondary;
  
  .el-icon {
    color: $primary-color;
  }
  
  .service-info {
    display: flex;
    flex-direction: column;
    
    .title {
      font-size: $font-sm;
      font-weight: 600;
      color: $text-primary;
    }
    
    .desc {
      font-size: $font-xs;
      color: $text-muted;
    }
  }
}

.copyright {
  padding-top: $spacing-lg;
  text-align: center;
  
  p {
    font-size: $font-xs;
    color: $text-muted;
    margin-bottom: $spacing-xs;
  }
}
</style>
