<template>
  <div>
    <a-modal v-model="visible" :title="activeItem.title" width="1000px" @ok="visible = false"> 
       <div v-html="activeItem.content"></div>
    </a-modal>
  </div>
</template>
<script>
import {agreeCZList} from '../czData'
export default {
  data() {
    return {
     visible:false,
     activeItem:{}
    }
  },
  methods: {
    open(type = 1) {
      if (type === 1) {
        this.activeItem = agreeCZList[0]
      } else {
        this.activeItem = agreeCZList[1]
      }
      this.visible = true

    }
  }
}
</script>