import Vue from 'vue'
import VueLs from 'vue-ls'
import config from '@/config/default.config'

// 基础库
import './lazy_lib'
// import '../style/global.less'

Vue.use(VueLs, config.storageOptions)
