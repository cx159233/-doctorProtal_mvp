<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// import KeepAlive from './KeepAlive'
import { mixinDevice } from '@/utils/mixin'
export default {
  name: 'UserLayout',
  components: {
    // KeepAlive
  },
  mixins: [mixinDevice],
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style scoped lang="less">
@import url('./styles/UserLayout.less');
</style>