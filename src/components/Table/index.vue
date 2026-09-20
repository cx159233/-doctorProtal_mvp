<!--
 * @Description: table全局组件
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-14 15:40:14
 * @LastEditors: renyong
 * @LastEditTime: 2022-05-27 11:22:13
-->
<template>
  <div class="table-list">
    <a-table
      :row-key="rowKey"
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      :pagination="pagination"
      :rowClassName="setRowClassName"
      :scroll="{x: scrollX }"
      @change="changeSize"
    >
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    rowKey: {
      type: String,
      default: ''
    },
    columns: { // 标题栏
      type: Array,
      default: () => []
    },
    dataSource: { // 数据源
      type: Array,
      default: () => []
    },
    totalNum: { // 总条数
      type: Number,
      default: 0
    },
    projectCode: { // 项目编号
      type: String,
      default: ''
    },
    pagination: { // 分页信息
      type: Object,
      default: () => {}
    },
    scrollX: {
      type: Number,
      default: 0
    }
  },
  components: {

  },
  data() {
    return {
      loading: false,
      pageSize: 10, // 默认每页10条数据
      page: 1, // 当前页码
      isShowTip: false // 是否展示提示信息
    }
  },
  created() {
    // console.log(this.projectCode.split(','))
  },
  methods: {
     // pageSize 变化的回调
    showSizeChange(obj) {
      this.pageSize = obj.pageSize // 每页条数变化
      this.page = obj.current // 当前页码
      this.$emit('currentPageChange', current) // 将当前页码抛出到父组件
    },
    // 页码改变的回调，参数是改变后的页码及每页条数
    changeSize (obj) {
      this.$emit('changePageNum', obj)
    },
    // 根据项目需要展示tr颜色
    setRowClassName(record) {
      let className = ''
      if (record.is_repeat) {
        let bol = false
        className = record.is_repeat === 1 ? 'showBgColor' : '' // 重复提醒样式
        bol = record.is_repeat === 1 ? true : false
        this.isShowTip = bol
      }
      this.$emit('showTableTip', this.isShowTip) // 是否展示提示
      return className
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>