<!--
 * @Description: 
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-14 15:40:14
 * @LastEditors: ranfenghua ranfenghua@cecinvestment.com
 * @LastEditTime: 2026-02-26 16:23:46
-->

<template>
  <div id="layout-header">
    <a-layout-header class="layout-header">
      <div class="left">
        <img
          class="logo"
          src="logo.png"
          @click="goTo"
        />
        <div
          class="title"
          @click="goTo"
        >个人医保云</div>
        <div class="menu-item">
          <a-menu
            theme="light"
            mode="horizontal"
            :style="{ lineHeight: '64px' }"
            v-model="menuKey"
            @click="clickMenuItem"
          >
          <template v-for="item in menuList">
          <template v-if="item.children.length<1">
            <a-menu-item :key="item.key">
                  <a-icon :type="item.icon" />
                  <span class="fz16">{{ item.title }}</span>
              </a-menu-item>
          </template>
              <a-sub-menu
              :key="item.key"
              v-else
              style="z-index: 2"
            >
              <span
                slot="title"
                class="item-title"
              >
                <a-icon :type="item.icon" />{{ item.title }}
              </span>
              <a-menu-item
                v-for="tab in item.children"
                :key="tab.key"
              >
                <span>{{ tab.title }}</span>
              </a-menu-item>
            </a-sub-menu>
          </template>
          </a-menu>
        </div>
      </div>
      <div class="right">
        <user-menu />
      </div>
    </a-layout-header>
  </div>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import { mapState } from 'vuex'
import { menuList } from './config'
// 「医保健康档案」下的查询列表，以及跨省调阅，都挂在它这一项菜单下
const ARCHIVE_ROUTES = [
  '/home/',
  '/inspection/index',
  '/outpatient/index',
  '/inpatient/index',
  '/pathology/index',
  '/vital/index'
]
const ARCHIVE_MENU_KEY = '/home/index'
export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
  },
  data() {
    return {
      menuKey: [],
      menuList:[]
    }
  },
  computed: {
    ...mapState({
      menulistInfo: state => state.user.menulistInfo,
      userInfo: state => state.user.userInfo
    })
  },
  created() {
    this.menuList = this.dealMenu()
    this.menuKey = [this.menuKeyOfRoute(this.$route.path)]
    this.$bus.$on('codeChange', () => {
      this.menuList = this.dealMenu()
    })
  },
  methods: {
    // 列表页和详情页没有独立的菜单项，不能直接把 $route.path 当选中项，否则顶部导航整条都不高亮
    menuKeyOfRoute(path) {
      if (!path) return ''
      if (ARCHIVE_ROUTES.some((item) => path.indexOf(item) === 0)) return ARCHIVE_MENU_KEY
      // 详情页沿用进入前的选中项，直接刷新进来时兜底到医保健康档案
      if (path.indexOf('/detail/') === 0) return this.menuKey[0] || ARCHIVE_MENU_KEY
      return path
    },
    dealMenu(){
      let arr = this.menulistInfo.filter(item=>!item.isHide)
      if(!window.CONFIG.source.isShowFeedback){
        arr = arr.filter(item=>item.title!=='异常反馈')
      }
      if(!window.CONFIG.source.syptdz){
        arr = arr.filter(item=>item.key!=='iframe')
      }
      if(!this.userInfo.statics_tab){
        arr = arr.filter(item=>(item.key!=='/mutual-statisic' && item.key!=='/order/statistic'))
      }
      return arr
    },
    goTo(pathObj) {
      this.$router.push({
        ...pathObj,
      })
    },
    // 占位菜单的判断只认代码里的配置。菜单会被 vuex-persistedstate 存进 localStorage，
    // 某一项接好、pending 去掉之后，老浏览器里那份缓存仍带着 pending:true，
    // 照着缓存判断会让这一项永远点不动
    isPending(key) {
      return menuList.some((item) => item.key === key && item.pending)
    },
    clickMenuItem({ i, key, keyPath }) {
      // 未接入的模块只提示、不跳转。a-menu 的 v-model 是在 click 之后才把点中的
      // key 写回 menuKey（MenuItem 里先 emit click 再 emit select），
      // 所以选中态要等下一帧再弹回当前路由，否则整条导航会停在一个其实没打开的项上
      if (this.isPending(key)) {
        this.$message.info('数据暂未接入，敬请期待')
        this.$nextTick(() => {
          this.menuKey = [this.menuKeyOfRoute(this.$route.path)]
        })
        return
      }
      let bool=false
      let pathObj = {}
      this.menuList.forEach((item) =>
        {
          if((item.key===keyPath[0])&&item.children.length<1){
            bool=true
          }
          item.children.some((tab) => {
            if (tab.key === key)
              pathObj = {
                path: tab.keyPath,
                query: tab.query,
              }
          })
        }
      )
      if(bool){
        this.$router.push(keyPath[0])
      }else{
        this.goTo(pathObj)
      }
    },
  },
  watch: {
    $route(route) {
      this.menuKey = [this.menuKeyOfRoute(route.path)]
    },
  },
}
</script>
<style lang="less" scoped>
@import url('./style/index.less');
</style>
