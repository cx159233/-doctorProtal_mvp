<!--
 * @Description: 数据统计卡片组件
 * @version: 1.0
 * @Author: renyong
 * @Date: 2022-05-17 11:30:16
 * @LastEditors: renyong
 * @LastEditTime: 2022-05-19 16:47:23
-->
<template>
  <!-- 数据统计卡片 -->
  <a-card class="card-statistic" hoverable>
    <section class="left">
      <img :src="imgSrc" alt="">
    </section>
    <section class="right">
      <header class="title">
        <span>{{ title }}</span>
        <slot name="title-icon" />
      </header>
      <p class="count">
        <span>{{ count }}</span>
        <span>{{ suffix }}</span>
      </p>
    </section>
  </a-card>
</template>

<script>
export default {
  props: {
    imgSrc: { // 图片地址
      type: String,
      default: ''
    },
    title: { // 标题
      type: String,
      default: ''
    },
    count: {// 数量
      type: [Number, String],
      default: ''
    },
    suffix: { // 后缀
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
