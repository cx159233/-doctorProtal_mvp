<template>
  <div class="login-auth">
     <!-- <div class="login-header">
       <img :src="svgLogo" alt="" class="svg-logo" />
       <h3 class="title">健康险核查服务 - 平安医保</h3>
    </div> -->
    <login-bg />
    <div class="login-form">
      <h3>个人医保云</h3>
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item prop="username">
          <a-input v-model="form.username" size="large" type="text" autocomplete="false" placeholder="医护执业资格证号/身份证号/账号">
            <a-icon slot="prefix" type="user" class="color" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input-password v-model="form.password" size="large" autocomplete="false" placeholder="密码">
            <a-icon slot="prefix" type="lock" class="color" />
          </a-input-password>
        </a-form-model-item>

        <a-form-model-item prop="verify_value" class="verification">
          <a-input 
          v-model="form.verify_value" 
          size="large" 
          type="text" 
          autocomplete="false" 
          placeholder="验证码" 
          class="verification-code">
          </a-input>
          <img :src="verificationImg" class="verification-img" @click="getUserCaptchaX"/>
          <span @click="getUserCaptchaX" v-if="!verificationImg" class="verification-get">获取验证码</span>
        </a-form-model-item>

        <a-form-model-item prop="agree">
          <a-checkbox value="1" name="agree" v-model="form.agree" @change="handleCheckbox">我已阅读并同意<i class="text-link" @click.prevent="tap(1)">用户服务许可协议</i>和<i
              class="text-link"
          @click.prevent="tap(2)">数据隐私权政策</i></a-checkbox>
        </a-form-model-item>

        <a-form-model-item>
          <a-button
            size="large"
            type="primary"
            class="login-button"
            :loading="btnLoading"
            :disabled="btnLoading"
            @click="handleSubmit">
            登录
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <modalTip ref="modalTip"></modalTip>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import svgLogo from '@/assets/svg-logo.svg'
import { getUserCaptcha } from '@/api/index'
// import {SM2} from 'gm-crypto'
// import { commonTracking } from '@/api'
import { getUserInfo } from '@/api'
export default {
  components: {
    LoginBg:()=>import('./components/loginBg.vue'),
    modalTip:()=>import('./components/modalTip.vue')
  },
  data() {
    return {
      form: {
        username: undefined,
        password: undefined,
        agree: undefined,
        verify_value:undefined
      },
      svgLogo,
      rules: {
        username: [
          {
            required: true,
            message: '请输入医护执业资格证/身份证号/账号',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change'
          }
        ],
        verify_value: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'change'
          }
        ],
        agree: [
          {
            required: true,
            message: '请同意并勾选用户服务许可协议和数据隐私权政策',
            trigger: 'change'
          }
        ]
      },
      btnLoading: false,
      verificationImg:null,
      id:''
    }
  },
  mounted(){
   this.getUserCaptchaX()
   this.getIsOnline()
  },
  methods: {
    ...mapActions(['Login']),
    async getUserCaptchaX(){
      const {data,code}=await getUserCaptcha()
      if(code === 200){
        const { base64, id } = data || {}
        this.verificationImg= base64
        this.form.id = id
      }
    },
    handleSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        // const params = new FormData()
        // const password = SM2.encrypt(this.form.password, process.env.VUE_APP_API_PUBLIC_KEY, {
        //     mode: SM2.constants.C1C3C2,
        //     inputEncoding: 'utf-8',
        //     outputEncoding: 'hex'
        // })
        // params.append('username', this.form.username)
        // params.append('password', password)
        // params.append('verify_value',`${ this.form.verify_value}`)
        // params.append('id',`${ this.id}`)
        if (valid) {
          this.btnLoading = true
          try {
            const params = JSON.parse(JSON.stringify(this.form))
            delete params.agree
            this.Login(this.form)
              .then(res => {
                // commonTracking(
                //   {
                //       event_id: 'PAC.pinganhealth-org-view.user.click',
                //       sending_time:new Date().getTime(),
                //       tm:new Date().getTime(), // 记录触发事件
                //       type:'user_logon',
                //       action:'logon_btn_click',
                //       extension: {
                //         is_logon_success:res.code === 200 ? '1' : '0',
                //         user_name: this.form.username,
                //         logon_time: new Date().getTime()
                //     }
                //   }
                // )
                if (res && res.code === 200) {
                  // this.SetAccount(this.form.username)
                  // window.localStorage.setItem('account',this.form.username)
                  setTimeout(() => {
                    this.$router.push('/')
                    console.log('登录成功')
                  }, 500)
                }else{
                  this.getUserCaptchaX()
                }
              })
              .catch(err => console.log(err))
              .finally(() => {
                this.btnLoading = false
              })
          } catch(err) {
             this.btnLoading = false
          }
        }
      })
    },
    tap(type){
      // tap
      this.$refs.modalTip.open(type)
    },
    handleCheckbox(val){
      if(!this.form.agree){this.form.agree  = undefined}
    },
    async getIsOnline(){
      const res = await getUserInfo()
      res?.code === 200 && (this.$router.push('/')) 
      // console.log(res, '<<<res')
    }
  }
}
</script>

<style lang="less" scoped>
.verification{
  // display: inline-flex;
  align-items: center;
}
.verification-code{
  width:calc(100% - 110px);
  margin-right: 8px;
}
.verification-img{
  height:40px;
  width: 100px;
  background: #E8E8E8;
  position: relative;
  top: -4px;
  cursor: pointer;
  // display: none;
}
.verification-get{
  color: #1990fe;
  cursor: pointer;
}
.login-auth {
  position: relative;
  width: 100%;
  height: 100vh;
  background: url(~@/assets/loginAuth/bg_cd.png) no-repeat;
  background-size: 100% 100%;
  overflow: auto;
}
.login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 0;

  img {
    width: 60px;
    margin-right: 10px;
  }

  h3 {
    font-size: 40px;
    font-weight: 500;
    margin-bottom: 0;
    color: #1990fe;
  }
}

.login-form {
  width: 500px;
  background: #fff;
  box-sizing: border-box;
  padding: 52px 65px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  margin-left: 25%;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.1600);
  border-radius: 10px 10px 10px 10px;

  h3 {
    font-weight: bold;
    color: #333333;
    font-size: 24px;
    line-height: 1;
    margin-bottom: 33px;
    text-align: center;
    .svg-logo{
      width: 50px;
      position: relative;
      top: -5px;
      margin-right: 5px;
    }
  }

  :v-deep.ant-checkbox-wrapper{
    display: flex;
    align-items: center;
    ::v-deep .ant-checkbox{
      top: 0;
    }
  }
  .text-link {
    color: #1890FF;
    font-style: normal;
    padding: 0 2px;
  }

  .login-button {
    width: 100%;
  }

  :v-deep.ant-input-prefix {
    color: #0369FC;
    font-size: 14px;
  }
}

.foot {
  position: fixed;
  left: 0;
  bottom: 48px;
  right: 0;
  text-align: center;

  span {
    font-size: 12px;
    font-weight: 400;
    color: #999999;

    &.margin_16 {
      margin-left: 56px;
    }
  }
}
</style>
<style lang="less">
.login-form .ant-form-item{
    height: 68px !important;
  }
</style>