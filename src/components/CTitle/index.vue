<template>
  <div class="c_title_main">
    <div class="c_title">
      <span class="c_title_border"></span>
      <slot name="title">
        {{ title || '' }}
      </slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/lib/style/themes/index.less';
.c_title_main {
  display: flex;
  margin-bottom: 24px;
  .c_title {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    .c_title_border {
      width: 4px;
      height: 16px;
      line-height: 16px;
      border-radius: 2px;
      margin-right: 8px;
      background-color: @primary-color;
    }
  }
}
</style>
