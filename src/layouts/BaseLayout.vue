<template>
  <div id="base-layout">
    <!-- 全局头部 -->
    <GlobalHeader />
    <!-- 全局内容 -->
    <GlobalContent />
  </div>
</template>

<script>
import GlobalHeader from '@/components/GlobalHeader'
import GlobalContent from '@/components/GlobalContent'
export default {
  name: 'BaseLayout',
  components: {
    GlobalHeader,
    GlobalContent
  }
}
</script>
<style lang="less" scoped>
@import url('./styles/BaseLayout.less');
</style>