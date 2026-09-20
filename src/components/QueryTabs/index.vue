<template>
  <!-- 顶部导航下面那条查询类页签栏 -->
  <div class="query-tabs">
    <div class="query-tabs-bar">
      <span class="query-tabs-title">全生命周期诊疗记录</span>
      <a-tabs :activeKey="activeKey">
        <a-tab-pane
          v-for="item in tabs"
          :key="item.key"
        >
          <span
            slot="tab"
            class="tab-label"
            :class="{ 'is-disabled': item.disabled }"
            @click="changeTab(item)"
          >{{ item.text }}</span>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { QUERY_TABS, queryTabKeyOfRoute } from '@/config/query-tabs'

export default {
  name: 'QueryTabs',
  data() {
    return {
      tabs: QUERY_TABS,
      activeKey: queryTabKeyOfRoute(this.$route.path)
    }
  },
  watch: {
    $route(route) {
      const key = queryTabKeyOfRoute(route.path)
      if (key) this.activeKey = key
    }
  },
  methods: {
    changeTab(item) {
      if (!item.path) {
        this.$message.info('数据暂未接入，敬请期待')
        return
      }
      this.activeKey = item.key
      // 已经在目标页面就别再 push，否则 vue-router 会抛重复导航
      if (this.$route.path === item.path) return
      this.$router.push(item.path)
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./style/index.less');
</style>
