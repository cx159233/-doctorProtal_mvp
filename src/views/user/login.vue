<!--
 * @Author: ranfenghua ranfenghua@cecinvestment.com
 * @Date: 2025-06-23 16:45:33
 * @LastEditors: ranfenghua ranfenghua@cecinvestment.com
 * @LastEditTime: 2025-06-25 14:20:16
 * @FilePath: /jskydy-org-view/src/views/user/login.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${user.email}, All Rights Reserved. 
-->
<template>
  <div class="login-page">
    <div class="login-form">
      <a-form @submit="handleSubmit">
        <a-form-item>
          <a-row>
            <a-col>
              <div class="title-logo">
                <img src="~@/assets/login/logo.png" alt="" class="login-logo">
                <p>
                  <span class="logo-title">{{sourceName}}数字影像查询互认服务系统</span>
                </p>
              </div>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col>
              <a-input placeholder="请输入医护执业资格证号/身份证号" class="input-idCard">
                <a-icon slot="prefix" type='user' style="color: #1890ff;"></a-icon>
              </a-input>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col>
              <a-input placeholder="请输入密码" class="input-password">
                <a-icon slot="prefix" type='lock' style="color: #1890ff;"></a-icon>
              </a-input>
            </a-col>
          </a-row>
        </a-form-item>
        <!-- 用户协议 -->
        <a-form-item>
          <a-row>
            <a-col>
              <div class="argreement">
                <a-checkbox></a-checkbox>
                <span class="text1">我已阅读并同意</span>
                <a href="">用户服务许可协议</a>
                <span>和</span>
                <a href="">数据隐私权政策</a>
              </div>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item>
          <a-row>
            <a-col>
              <div class="btn">
                <a-button type="primary" html-type="submit" size="large" class="log-btn">登录</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </div>
    <!-- <a-button type="primary" class="login">登录</a-button> -->
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      sourceName:window.CONFIG.source.text,
      colSpanLeft: 2,
      colSpanRight: 16
    }
  },
  methods: {
    handleSubmit() {
      // console.log('submit')
    }
  }
}
</script>
<style scoped lang="less">
@import url('./style/index');
// .login-page {
//   background: #eee;
// }
</style>