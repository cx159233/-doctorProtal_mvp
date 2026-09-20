<!--
 * @Author: ranfenghua ranfenghua@cecinvestment.com
 * @Date: 2025-06-23 16:52:22
 * @LastEditors: ranfenghua ranfenghua@cecinvestment.com
 * @LastEditTime: 2025-06-25 14:19:29
 * @FilePath: /jskydy-org-view/src/views/landing/index.vue
 * @Description: 
 * 
 * Copyright (c) 2025 by ${user.email}, All Rights Reserved. 
-->
<template>
  <div class="landing">
    <header>
        <img src="data:image/png;base64,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" class="logo">
        <div class="title">个人医保云</div>
    </header>
    <main>
        <img src="./images/bg.png" class="img"/>
    <p>您未在{{sourceName}}“医保人力资源管理系统”进行注册，请联系院内管理人员注册后再使用“个人医保云”</p>
    </main>
  </div>
</template>

<script>
import { dataTracking } from '@/api'
export default {
    data(){
        return {
            sourceName:window.CONFIG.source.text,
        }
    },
    mounted(){
        console.log(this.$route.query)
        console.log({
          sending_time:+new Date(),
          tm: +new Date(), // 记录触发事件
          appver: '1.0.1',
          type: 'pacs_landing',
          action: 'landing',
          extension: {
            ...this.$route.query
          }
        })
         this.trackingEvent({
          sending_time:+new Date(),
          tm: +new Date(), // 记录触发事件
          appver: '1.0.1',
          type: 'pacs_landing',
          action: 'landing',
          extension: {
            ...this.$route.query
          }
        })
    },
    methods:{
        // 埋点设置
        async trackingEvent(params) {
            const { data = null } = await dataTracking(params)
            console.log('data', data)
        },
    }
}
</script>

<style lang="less" scoped>
.landing{
    width:100%;
    height:100%;
    background: white;
    header{
        display: flex;
        font-size: 18px;
        font-weight: bold;
        color: #333;
        padding-left:32px;
        align-items: center;
        height:64px;
        background: white;
        >img{
            width: 30px;
            height:30px;
            margin-right:12px;
        }
    }
    .img{
        width:300px;
        height:300px
    }
    main{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top:50px;
    }
    p{
        width: 560px;
        font-size: 22px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 33px;
    }
}
</style>