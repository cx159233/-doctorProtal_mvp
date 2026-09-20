import Vue from 'vue'
import CONFIG from '@/config/global.config'

Vue.mixin({
  data () {
    return {
      CONFIG
    }
  }
})
