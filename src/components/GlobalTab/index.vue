
<template>
  <!-- 全局标签页 -->
  <div class="global-tabs">
    <a-tabs
      v-model="activeKey"
      hide-add
      type="editable-card"
      :tabBarGutter="0"
      @edit="onEdit"
      @change="switchTabPane"
    >
      <a-tab-pane
        v-for="(item) in $store.getters.tabPane"
        :key="item.key"
      > 
        <template>
          <div :id="'tabpane-'+ item.key" slot="tab" ref="tabpane">
            <!-- 标签页标题 -->
            <span slot="tab" class="tabpane-title" :title="item.text">
              {{ item.text }}
            </span>
            <span slot="tab" class="tabpane-title-status" v-if="!item.key.includes('/home/index')">
              {{ item.typeName || (!item.type ? '' : (item.type === 'dicom' ? '影像' : '报告')) }}
            </span>
            <!-- 影像或者报告状态 -->
            <!-- <span
              v-if="!item.key.includes('/home/index')"
              slot="tab"
              :class="(!item.status || item.status === '0') ? 'tabpane-title-unstatus' : 'tabpane-title-onstatus'"
            >
              ({{ (!item.status || item.status === '0') ? '未互评' : '已互评' }})
            </span> -->
          </div>
        </template>
      </a-tab-pane>
    </a-tabs>
    <!-- 右键菜单 -->
    <transition name="fade">
      <div
        v-if="contextMenuVisible"
        class="context-tabs-wrap"
        ref="contextmenu"
        :style="{ left: `${contextMenuPostion.x}px`, top: `${contextMenuPostion.y}px` }"
      >
        <a-menu @click="changeMenuItem">
          <a-menu-item v-for="item in menuItems" :key="item.key" class="menu-item-li">
            <a>{{ item.text }}</a>
          </a-menu-item>
        </a-menu>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'GlobalTab',
  data() {
    return {
      activeKey: this.$route.fullPath, // 当前激活页面
      fromPath: '', // 进详情页之前所在的列表页，关掉最后一个页签时回到这里
      contextMenuVisible: false, // 是否展示右键自定义菜单
      contextMenuPostion: { // 右键菜单初始定位
        x: 0,
        y: 0
      },
      closeKey: null, // 关闭的路径
      tabPane: this.$store.getters.tabPane,
      menuItems: [ // 右键菜单选项
        {
          text: '关闭当前',
          key: 'current'
        },
        {
          text: '关闭右侧',
          key: 'right'
        },
         {
          text: '关闭左侧',
          key: 'left'
        },
        {
          text: '关闭其他',
          key: 'others'
        },
        {
          text: '关闭全部',
          key: 'all'
        }
      ]
    }
  },
  watch: {
  },
  mounted() {
    this.bindRightClick() // 页面挂载时绑定右键点击事件
    this.changeRoute(this.$route)
  },
  updated() { // 组件更新后
    this.bindRightClick() // 页面挂载时绑定右键点击事件
  },
  activated() {
  },
  destroyed() { // 组件卸载时
    // console.log('已卸载')
  },
  watch: {
    // 监听路由
    $route(route) {
      // console.log(route)
      this.changeRoute(route)
    }
  },
  methods: {
    // 点击返回
    back() {
      const self = this
      if (!this.btnDisabled) {
        // 如果没进行互认操作
        this.$confirm({
          title: '提示',
          content: (h) =>
            `当前页面有${
              !(self.reportRadioValue || self.imageRadioValue) ? '未完成' : '未提交'
            }的互认评价，是否确定退出？`,
          icon: (h) => <a-icon type="exclamation-circle" />,
          onOk() {
            self.$router.push({
              path: '/home/index',
            })
          },
          onCancel() {},
          class: 'test',
        })
      } else {
        self.$router.push({
          path: '/home/index',
        })
      }
    },
    // 路由变化之后的回调
    changeRoute(route) {
      // 详情页不算来源，其余页面都记下来，作为关掉最后一个页签时的回退目标
      if (route.path.indexOf('/detail/') !== 0) this.fromPath = route.path
      this.activeKey = decodeURIComponent(route.fullPath)
    },
    // 点击右侧菜单选项
    changeMenuItem({key}) {
      // 判断当前关闭的菜单
      let tabPane = this.$store.getters.tabPane
      // console.log('activeKey',this.activeKey, 'closeKey',this.closeKey)
      let closeIndex = null // 要关闭的索引值
      let activeIndex = null // 当前激活的索引值
      if (key === 'current') { // 关闭当前
        this.remove(this.closeKey)
        return
      }
      if (key === 'others') { // 关闭其他
        tabPane = tabPane.filter(item => item.key === this.closeKey)
        this.$store.dispatch('DeleteTabPane', tabPane) // store中的tabPane也需要重新赋值
        this.activeKey = this.closeKey
        if(!this.$route.fullPath.includes('home/index')){
if(this.$route.fullPath.includes('/home/cross-province')){
            const url_params=this.activeKey.split('?')||[]
            const obj = {}
            if(url_params[1]){
              url_params[1].split('&').forEach((i)=>{
                const index=i.indexOf('=')
                const nextIndex=index+1
                obj[i.substr(0,index)]=i.substr(nextIndex)
              })
              }
              this.$router.push({
                path: url_params[0],
                query:{
                  ...obj
                }
              })
          } else {
            this.goTo(this.activeKey) // 跳转到该路径
          }
        }
        
        return
      }
      if (key === 'all') { // 关闭全部
        this.$store.dispatch('DeleteTabPane', []) // store中的tabPane也需要删减
        this.goHome() // 关闭所有直接回到列表页面
        return
      }
      // 获取当前的closeKey的索引值和activeKey的索引值
      tabPane.forEach((v, k) => {
        if (v.key === this.closeKey) {
          closeIndex = k
        }
        if (v.key === this.activeKey) {
          activeIndex = k
        }
      })
      // console.log(closeIndex)
      if (this.activeKey !== this.closeKey) {
        if (key === 'left') {
          tabPane.splice(0, closeIndex)
          this.activeKey = activeIndex < closeIndex ? tabPane[0].key : tabPane[activeIndex - closeIndex].key
        }
        if (key === 'right') {
          tabPane.splice(closeIndex + 1, tabPane.length - 1)
          this.activeKey = activeIndex < closeIndex ? tabPane[activeIndex].key : tabPane[tabPane.length - 1].key
        }
      } else { // 如果相等
          if (key === 'left') {
            tabPane.splice(0, closeIndex)
            this.activeKey = this.activeKey !== tabPane[0].key ? tabPane[closeIndex - 1].key : tabPane[0].key
          }
          if (key === 'right') {
            tabPane.splice(closeIndex + 1, tabPane.length - 1)
            this.activeKey = this.activeKey !== tabPane[tabPane.length - 1].key ? tabPane[closeIndex + 1].key : tabPane[tabPane.length - 1].key
          }
      }
      this.$store.dispatch('DeleteTabPane', tabPane) // store中的tabPane也需要删减
      if(this.$route.fullPath.includes('/home/cross-province')){
            const url_params=this.activeKey.split('?')||[]
            const obj = {}
            if(url_params[1]){
              url_params[1].split('&').forEach((i)=>{
                const index=i.indexOf('=')
                const nextIndex=index+1
                obj[i.substr(0,index)]=i.substr(nextIndex)
              })
              }
              this.$router.push({
                path: url_params[0],
                query:{
                  ...obj
                }
              })
          } else {
            this.goTo(this.activeKey) // 跳转到该路径
          }
      
    },
    // 切换标签面板
    switchTabPane(activeKey) {
      // if(activeKey.includes('/home/cross-province')){
      //   return this.$router.push(activeKey)
      // }
      //处理切换时参数变化
      const url_params=activeKey.split('?')||[]
      const obj = {}
      if(url_params[1]){
        url_params[1].split('&').forEach((i)=>{
          const index=i.indexOf('=')
          const nextIndex=index+1
          obj[i.substr(0,index)]=i.substr(nextIndex)
        })
      }
      this.activeKey = activeKey
      this.$router.push({
        path: url_params[0],
        query:{
          ...obj
        }
      })
      if (activeKey.includes('/detail/image') || activeKey.includes('/detail/report')) {
        sessionStorage.setItem('history', -1)
      }
    },
    // 新增或者删除时的回调
    onEdit(targetKey, action) {
      this[action](targetKey)
      // console.log(targetKey, action)
    },
    // 跳转到该路径
    goTo(path) {
      // 对路径中的参数值进行编码处理
      const url_params = path.split('?') || []
      const query = {}
      if (url_params[1]) {
        url_params[1].split('&').forEach((i) => {
          const index = i.indexOf('=')
          const nextIndex = index + 1
          if (index !== -1) {
            query[i.substring(0, index)] = i.substring(nextIndex)
          }
        })
      }
      this.$router.push({
        path: url_params[0],
        query
      })
    },
    // 移出该标签页
    remove(targetKey) {
      let activeKey = this.activeKey // 当前激活的标签
      let lastIndex = null // 上一个索引
      this.$store.getters.tabPane.forEach((item, i) => {
        if (item.key === targetKey) {
          lastIndex = i - 1
        }
      })
      const tabPane = this.$store.getters.tabPane.filter(item => item.key !== targetKey)
      if (tabPane.length && activeKey === targetKey) {
        activeKey = lastIndex < 0 ? tabPane[0].key : tabPane[lastIndex].key
      }
      this.$store.dispatch('DeleteTabPane', tabPane) // store中的tabPane也需要删减
      if (!tabPane.length) {
        // 关掉最后一个页签就回到进入详情前的列表，不要一律跳回全国影像查询
        this.goTo(this.fromPath || '/home/index')
      }else if(targetKey===this.activeKey){
        // 当前页签被关掉，切到相邻页签（activeKey 上面已经算好了）
        // 如果key参数里面包含url参数，则需要处理，将参数encodeURIComponent
        if(activeKey.includes('/home/cross-province')){
          const url_params=activeKey.split('?')||[]
          const obj = {}
          if(url_params[1]){
            url_params[1].split('&').forEach((i)=>{
              const index=i.indexOf('=')
              const nextIndex=index+1
              obj[i.substr(0,index)]=i.substr(nextIndex)
            })
            }
            this.$router.push({
              path: url_params[0],
              query:{
                ...obj
              }
            })
        } else {
          this.goTo(activeKey)
        }
      }
      this.activeKey = activeKey
    },
    // 全部清空跳转到首页
    goHome() {
      this.$router.push({
        path: '/home/index'
      })
    },
    // 绑定点击鼠标右键事件
    bindRightClick() {
      const classNames = this.$refs.tabpane
      classNames && classNames.length && classNames.forEach(item=> {
        item.parentNode.parentNode && item.parentNode.parentNode.addEventListener('contextmenu', (e) => {
          e.preventDefault() // 阻止鼠标点击右键的浏览器默认事件
          const closeKey = e.currentTarget.firstChild.firstChild.getAttribute('id').replace(/^tabpane-/, '')
          // console.log(closeKey)
          this.closeKey = closeKey
          // 给右键菜单的位置赋值
          this.contextMenuPostion.x = e.clientX || e.pageX
          this.contextMenuPostion.y = e.clientY || e.pageY
          this.contextMenuVisible = true
        })
      })
      // 鼠标点击任意位 置关闭菜单
      document.body && document.body.addEventListener('click', () => {
        this.contextMenuVisible = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./style/index.less');
</style>