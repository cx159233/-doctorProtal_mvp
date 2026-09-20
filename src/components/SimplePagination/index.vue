<template>
  <div class="simple-pagination">
    <a-button class="btn left-btn" :disabled="page === 1" @click="backClick">
      <a-icon type="left" class="left-icon"></a-icon>
    </a-button>
    <div class="page">
      <span class="total-text">共{{ totalPage }}份</span>
      <span>{{ page }}</span>
      <span>/</span>
      <span>{{ totalPage }}</span>
    </div>
    <a-button class="btn right-btn" @click="nextClick" :disabled="page === totalPage">
      <a-icon type="right" class="right-icon"></a-icon>
    </a-button>
  </div>
</template>
<script>
export default {
  name: 'SimplePagination',
  props: {
    totalPage: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      page: 1, // 当前页码
    }
  },
  methods: {
    // 点击上一页
    backClick() {
      this.page--
      if (this.page < 1) this.page = 1 
      this.$emit('backClick', this.page)
    },
    // 点击下一页
    nextClick() {
      this.page++
      if (this.page > this.totalPage) {
        this.page = this.totalPage
      }
      this.$emit('nextClick', this.page)
    },
    // 重置页码
    resetPage() {
      this.page = 1
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./style/index.less');
</style>