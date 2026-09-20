<!--
 * @Description: 
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-12 11:36:22
 * @LastEditors: renyong
 * @LastEditTime: 2022-08-05 15:41:14
-->
<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import {  mapMutations } from 'vuex'
// import store from '@/store'
// import router from '@/router'
// import { getCookie, setCookie } from '@/utils/cookie'
moment.locale('zh-cn')
export default {
  name: 'App',
  data() {
    return {
      locale: zhCN,
    }
  },
  watch:{
     $route: {
      deep:true,
      handler(newVal, oldVal) {
        this.dealLabel()
      }
    },
  },
  methods: {
    ...mapMutations(['SET_NAVIGATOR']),
    //标签 解决影像和报告跳转问题
    dealLabel(){
      const record=this.$route.query||{}
      if(['/detail/image','/detail/report','/detail/inspection/report'].includes(this.$route.path)&&record.new_label!=='1'){
        const tabPane = this.$store.getters.tabPane
        const bol = tabPane.some((item) => item.id === record.id && item.type === record.type) // 如果匹配其中一项
        if (!bol) {
          // 如果都没有对应的key，则添加
          this.$router.push('/home/index') // 添加标签页
        }
      }
    },
    // jump() {
    //   console.log(1)
    // }
  },
  mounted() {
    // console.log(router)
    // window.addEventListener('onbeforeunload', this.jump)
    // window.onbeforeunload = this.jump
  },
  created() {
    this.SET_NAVIGATOR(window.performance.timing)
    sessionStorage.setItem('history', 0)
    // console.log(this.$router.)
    // if(![this.$router.path].includes('home/index')) {
    //   this.$router.replace('/home/index')
    // }
  },
}
</script>
