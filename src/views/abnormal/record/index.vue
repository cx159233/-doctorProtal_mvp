<template>
  <a-card style="margin: 24px 0">
    <a-tabs v-model="activeKey" type="card">
      <a-tab-pane :tab="item.name" :key="item.key" v-for="item in tabsArr">
        <basic-table :feedback-type="item.key" @seeClick="showDetail" />
      </a-tab-pane>
    </a-tabs>
    <detail ref="infoRef" />
  </a-card>
</template>
<script>
import BasicTable from './components/BasicTable.vue'
import Detail from './components/Detail.vue'
export default {
  components: {
    BasicTable,
    Detail,
  },
  data() {
    return {
      activeKey: 'report-problem-feedback',
      newTabIndex: 0,
      // 报告类 report-problem-feedback 影像类 image-problem-feedback 其他类 other--problem-feedback
      tabsArr: [
        {
          name: '报告类',
          key: 'report-problem-feedback',
        },
        {
          name: '影像类',
          key: 'image-problem-feedback',
        },
        {
          name: '其他类',
          key: 'other-problem-feedback',
        },
      ],
    }
  },
  mounted() {},
  methods: {
    showDetail(item) {
      this.$refs.infoRef.show(item.sn)
    },
  },
}
</script>
