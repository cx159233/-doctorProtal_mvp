<template>
  <div class="cec-txt-area">
    <a-textarea
      :value="inputValue"
      @input="
        (e) => {
          $emit('blur', e.target.value);
        }
      "
      @blur="e => $emit('blur', e.target.value)"
      :placeholder="placeholder"
      :maxLength="len"
      :auto-size="autoSize"
      v-bind="$attrs"
    />
    <span class="value">{{ inputValue ? inputValue.length : 0 }}/{{len}}</span>
  </div>
</template>
<script>
export default {
  name: 'CTextArea',
  model: {
    prop: 'inputValue',
    event: 'blur'
  },
  props: {
    len: {
      type: Number,
      default: 255
    },
    autoSize: {
      type: Object,
      default: () => {
        return { minRows: 3, maxRows: 4 }
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    inputValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
.cec-txt-area {
  position: relative;
  .value {
    position: absolute;
    right: 10px;
    bottom: 0px;
    color: rgba(0, 0, 0, 0.25);
  }
}
</style>
