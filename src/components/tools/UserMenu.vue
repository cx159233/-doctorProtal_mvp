<template>
  <div class="user-wrapper">
    <div class="content-box">
      <a-dropdown v-if="userInfo && userInfo.user_name">
        <span class="action ant-dropdown-link user-dropdown-menu">
          <!-- <a-avatar :style="{'backgroundColor': config.primaryColor}">
            {{
              userInfo.user_name && userInfo.user_name.substring(userInfo.user_name.length - 2, userInfo.user_name.length)
            }}
          </a-avatar> -->
          <span class="nickname" style="margin-right: 8px">{{ userInfo.user_name }}</span>
          <span v-if="userInfo.user_name && ($store.getters.hospitalName || (this.user.selectData && this.user.selectData.name))">|</span>
          <!-- <span>{{ $store.getters.hospitalName || (this.user.data[0] && this.user.data[0].name) }}</span> -->
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <a-icon type="exclamation-circle"/>
            <span>当前版本：2.1.1</span>
          </a-menu-item>
          <a-menu-divider/>
          <a-menu-item key="2">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <span class="nickname">
              <span class="text">{{ $store.getters.hospitalName || (user.selectData && user.selectData.name) }}</span>
              <span href="javascript:;" class="nickname-icon">
                <a-icon type="caret-down"/>
              </span>
          </span>
        </span>
        <a-menu slot="overlay" @click="setUserCookie" class="dropdown-menu" >
          <a-menu-item 
            v-for="item in user.data" 
            :key="item.code" 
            :disabled="item.status === 0"
            :class="{ 'menu-item-selected': user.selectData && user.selectData.code === item.code }"
          >
            <a href="javascript:;" :disabled="item.status === 0" >{{ item.name }}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getUserCookies,getWaibuUserInfo } from '@/api'
import { getCookie,removeCookie } from '@/utils/cookie'
import { ssoJump,clearAllCookie } from '@/utils/auth'
import config from '@/config/default.config'
export default {
  name: 'UserMenu',
  components: {
    // NoticeIcon
  },
  computed: {
    ...mapGetters(['userInfo', 'hospitalName', 'userName', 'tabPane'])
  },
  data () {
    return {
      visible: false,
      config,
      labelCol: {
        xs: { span: 0 },
        sm: { span: 0 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 }
      },
      user: {
        data: [],
        selectData: null
      },
      hospital_name: '', // 医院名称
      hospital_code: this.$route.query.hospital_code, // 医院code
      org_id: this.$route.query.org_id, // 互认统计-来源
      isFullscreen: false,
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created() {
    // console.log('userInfo', this.userInfo)
  },
  async mounted () {
    const params=this.$route.query.params||getCookie('url_params')
     if(params){
      const formData = new FormData()
      formData.append('encrypt_params', params)
        const {code,data}=await getWaibuUserInfo(formData)
        if(code===200){
          this.org_id = data.hospital_code
        }else{
          this.org_id = this.$route.query.hospital_code
        }
    }
    this.getUserCookie()
  },
  methods: {
    ...mapActions(['Logout', 'SetCookie', 'SetHospitalName', 'DeleteTabPane','setOrgList']),
    handleLogout () {
      const _that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({}).then(() => {
            // 将store中的标签清空
            this.$store.dispatch('DeleteTabPane', [])
            this.$store.dispatch('SetUserInfo', {})
            this.$store.dispatch('SetHospitalName', '')
            this.$store.dispatch('ResetSystem', false)  // 系统重置
            this.$store.dispatch('resetOtherInfo')
            clearAllCookie()
          }).catch(err => {
            this.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    },
    // 判断用户的所属账户是否停用，全部停用提示，
    isAllStop(data){
      if(data instanceof  Array) {
        this.user.selectData = null
          return data.every((item, index)=>{
            if(item.status === 1) { // 启用
            !this.user.selectData ? this.user.selectData = item : null
            if([this.hospital_code,this.org_id].includes(item.code)){ //当hospital_code org_id存在时
              this.user.selectData = item
            }else if(this.hospital_code || this.org_id){
              return true
            }else{
              return false
            }
          }
          return item.status === 0
        })
      }
      return true
    },
    userWarn(title, content, okText, callback){
       this.$warning({
          title: title,
          content: h => <div><p style="color: red;">{content}</p></div>,
          icon: h => <a-icon type="exclamation-circle" />,
          okText: okText,
          zIndex: 9999,
          onOk: () => {
            callback && callback()
            if(!callback){
              clearAllCookie()
              ssoJump() // 到登录页面
            }
          }
        })
    },
    // 获取用户的token
    async getUserCookie() {
      try {
        const { data = [], error } = await getUserCookies() // 设置cookie
        if (!data) { // 如果data不存在
          this.userWarn('该用户暂无权限','获取不到该用户的组织机构，暂无访问权限','请重新登录')
          return
        }
        if(this.isAllStop(data)){
          if (!this.$route.path.includes('/home/index')) {
            this.userContinue(error, data)
            return
          }
          // 全部停用了怎么办呢，给一个提示  
          // query 传参已经被停用了怎么办呢
          if(!!this.hospital_code && this.user.selectData) {
            // 代表传进来的医院code至少没有权限访问
            this.userWarn('该用户暂无权限','没有当前组织机构的访问权限','选择其他账户',() => {
              this.userContinue(error, data)
            })
          } else this.userWarn('该用户暂无权限','没有可用账号，请联系管理员','重新登录')
          return
        }
        this.userContinue(error, data)
      } catch (error) {
        console.log('error', error)
      }
    },
    userContinue(error, data){
      if (error.code === 401) {
        this.$message.error({
          content: error.message,
          duration: 2
        })
      }
      this.user.data = data && Array.isArray(data) && data
      this.setOrgList(this.user.data.filter((i)=>this.user.selectData.code === i.code))
      const code = this.user.selectData && this.user.selectData.code
      // console.log('user', this.user.selectData)
      this.SetHospitalName(this.user.selectData?.name)
      // if (code !== getCookie('org_id')) {
      //   this.SetCookie(code) // 设置org_id cookie
      //   this.$bus.$emit('codeChange')
      //   // this.SetHospitalName(this.user.selectData?.name)
      // }
      this.SetCookie(code) // 设置org_id cookie
        this.$bus.$emit('codeChange')
    },
    // 往cookie里写入用户的cookie
    async setUserCookie({ item, key, keyPath}) {
      // 写入cookie之前先比对有无重复cookie
      const org_id = getCookie('org_id')
      this.user?.data?.forEach((v, k) => {
        if (v.code === key) {
          this.hospital_name = v.name
          this.user.selectData = v // 更新选中数据
        }
      })
      this.SetHospitalName(this.hospital_name)
      if (key !== org_id) {
        // console.log(this.tabPane[0])
        // const arr = [this.tabPane[0]]
        this.SetCookie(key) // 设置org_id cookie
        this.setOrgList(this.user.data.filter((i)=>key === i.code))
        this.$bus.$emit('codeChange')
      }
    }
  }
}
</script>

<style lang="less">
.nickname-menu{
  display: none;
}
.user-wrapper{
  .action-icon{
    font-size: 18px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.65);
    margin: 0 8px;
  }
  .action {
    cursor: pointer;
    padding: 0 8px;
    display: inline-block;
    transition: all 0.3s;
    height: 100%;
    color: rgba(0, 0, 0, 0.65);
    .text {
      margin-right: 12px;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }

    .avatar {
      margin: 20px 8px 20px 0;
      color: #1890ff;
      background: hsla(0, 0%, 100%, 0.85);
      vertical-align: middle;
    }
    .nickname-icon {
      color: #000;
    }
    .icon {
      font-size: 16px;
      padding: 4px;
    }
  }
}
.code-item{
  .ant-form-item-children{
    display: flex;
    .getCaptcha{
      margin-left: 24px;
    }
  }
}
@media (max-width: 414px) {
  .nickname-menu{
    display: block;
  }
  .nickname{
    display: none;
  }
}
.dropdown-menu {
  &::-webkit-scrollbar { // 滚动条整体部分
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-thumb { // 滚动条里面的小方块，能上下左右移动
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.35);
    background: rgba(0, 0, 0, 0.35);
  }
  &::-webkit-scrollbar-track { // 滚动条的轨道
    -webkit-box-shadow: 0;
    border-radius: 0;
    background: #f6f8ff;
  }
  .menu-item-selected {
    background-color: #e6f7ff !important;
    color: #1890ff !important;
    font-weight: 500;
  }
}
</style>
