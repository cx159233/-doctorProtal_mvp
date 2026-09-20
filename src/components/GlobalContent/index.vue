<!--
 * @Description: 
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-14 15:40:14
 * @LastEditors: renyong
 * @LastEditTime: 2022-06-14 13:42:22
-->
<template>
  <div id="layout-content">
    <a-layout-content class="layout-content" :class="{ 'layout-content--bleed': routeMeta.fullBleed }">
      <QueryTabs v-if="routeMeta.showTab && !$route.query.org_id" />
      <div v-if="$store.getters.tabPane.length && routeMeta.showTab && !$route.query.org_id" key="global-tab">
        <!-- <div class="message" v-if="!!alert_message">{{alert_message}}<a-icon type="close-circle" class="close-icon" @click="close"/></div> -->
        <GlobalTab>
        </GlobalTab>
      </div>
      <div class="content" :style="contentStyle">
        <!-- 需要缓存的页面 -->
        <keep-alive>
          <router-view v-if="routeMeta.keepAlive" key="keepAlive"></router-view>
        </keep-alive>
        <!-- 不需要缓存的页面 -->
        <router-view v-if="!routeMeta.keepAlive" key="inKeepAlive"></router-view>
      </div>
    </a-layout-content>
  </div>
</template>
<script>
import {  mapGetters, mapMutations } from 'vuex'
import RouteView from '@/layouts/RouteView.vue'
import GlobalTab from 'components/GlobalTab'
import QueryTabs from 'components/QueryTabs'

export default {
  name: 'LayoutContent',
  components: {
    RouteView,
    GlobalTab,
    QueryTabs
  },
  data() {
    return {
      name: '',
      routeMeta: this.$route.meta,
      cachePage: ['home'],
      breadList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo','message']),
    // 整屏页面（个人医保画像）不留内边距，内容区只让出顶部导航的高度
    contentStyle() {
      if (this.routeMeta.fullBleed) return { marginTop: '0' }
      return {
        marginTop: (this.$store.getters.tabPane.length && this.routeMeta.showTab && !this.$route.query.org_id) ? '0' : '12px'
      }
    },
    alert_message(){
      if(this.message&&this.userInfo.alert_message){
        return this.userInfo.alert_message
      }else{
        return ''
      }
    }

  },
  mounted() {
    // console.log(this.$route)
  },
  activated() {
    // console.log('actived global')
  },
  methods: {
    ...mapMutations(['SET_MESSAGE']),
    close(){
      this.SET_MESSAGE(false)
    }
  },
  watch: {
    '$route.meta': { // 监听路由meta的变化
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.routeMeta = newVal
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./style/index.less');
</style>