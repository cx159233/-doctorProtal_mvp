<template>
    <div class="reprot-detail">
      <a-card :bordered="false" :loading="cardLoading">
        <div class="reprot-detail-title">
          <span>{{ report.organName }}</span>
          <span style="padding-left:20px">检验报告单</span>
        </div>
        <a-divider />
        <div class="project-info pl50">
          <span>检验项目：</span>
          <span>{{ report.projName }}</span>
        </div>
        <a-divider />
        <div class="top-list pl50">
          <div v-for="(item,index) in topList" :key="index" class="top-item">
            <span class="top-title">{{item.title}}：</span>
            <span>{{ item.value||'--' }}</span>
          </div>
        </div>
        <a-table :columns="column" :data-source="dataSource" :rowKey="(record,index) => index" :pagination="false" class="mb-24">
    <!-- <a slot="trend" slot-scope="text">
      <img src="./images/top" v-if="text === '1'" alt="">
      <img src="./images/bottom" v-else>
    </a> -->
  </a-table>
  <div class="bottom-list pl50">
          <div v-for="(item,index) in bottomList" :key="index" class="bottom-item">
            <span class="bottom-title">{{item.title}}：</span>
            <span>{{ item.value||'--' }}</span>
          </div>
        </div>
        </a-card>
    </div>
  </template>
  <script>
  import { getTestRptDetail } from '@/api/inspection'
  import { dataTracking } from '@/api'
  import { getCookie } from '@/utils/cookie'
  export default {
    name: 'reportDetail',
    data() {
      return {
        report:{},
        dataSource:[],
        column:[],
        cardLoading: true,
        topList:[
          {
            title: '姓名',
            value: 'name'
          },
          {
            title: '就诊编号',
            value: 'visitNumber'
          },
          {
            title: '科室',
            value: 'appDptName'
          },
          {
            title: '性别/年龄',
            value: 'sex/age'
          },
          {
            title: '样本编号',
            value: 'sampClassRaw'
          },
          {
            title: '样本类型',
            value: 'sampCnameRaw'
          },
          {
            title: '检验仪器',
            value: 'instName'
          },
          {
            title: '临床诊断',
            value: 'clinicDiagnose'
          }
        ],
        bottomList:[
          {
            title: '送检医师',
            value: 'sampName'
          },
          {
            title: '检验者',
            value: 'testDocName'
          },
          {
            title: '审核者',
            value: 'rvName'
          },
          {
            title: '申请时间',
            value: 'applyDt'
          },
          {
            title: '采样时间',
            value: 'sampDt'
          },
          {
            title: '接收时间',
            value: 'acceptDt'
          },
          {
            title: '审核时间',
            value: 'rptDt'
          }
        ]
      }
    },
    methods: {
      setPoint(type,action,time='',obj={}){
              const {patient_id_card,app_dpt_name,id,patient_name,view_record_id}=this.$route.query
              const sending_time = +new Date() // 记录埋点开始时间
              this.trackingEvent({
                sending_time,
                  tm:new Date().getTime(), // 记录触发事件
                  appver: '1.0.1',
                  type,
                  action,
                  extension: {
                    doc_name: this.user_name,
                    hospital_code: getCookie('org_id'),
                    patient_name,
                    cardno: patient_id_card,
                    app_dpt_name,
                    view_record_id,
                    study_primary_id: id,
                    is_data_return: time?`${time}`:'',
                    ...obj
                  }
            })
          },
          async trackingEvent(params) {
                const { data = null } = await dataTracking(params)
                console.log('data', data)
              },
      async getTestRptDetail() {
        const { id,organCode } = this.$route.query
        const  time=new Date().getTime()
        const { data } = await getTestRptDetail({
          rptId:id,
          organCode
        })
        this.setPoint('inspection_user_query_behavior','report_page_loading_success',data ? '1' : '0', {'report_request_duration':`${new Date().getTime()- time}`})
        this.topList.map(item => {
          if(item.value.includes('/')){
            const arr = item.value.split('/')
            let str = ''
            arr.forEach(item1 => {

              if(item1 === 'sex'){
                str += data[item1] === 1 ? '男' : '女'
              }else{
                str += `/${data[item1]}`
              }
              item.value = str
            })
          }else{
            item.value = data[item.value]
          }
          
        })
        this.bottomList.map(item => {
          item.value = data[item.value]
        })
        this.report = data || {}
        const arr = []
        data.itemFields?.forEach(item => {
          const {fieldCode,fieldName} = item
          // const scopedSlots = fieldName === '趋势'? {customRender: 'trend'} : {}
          this.column.push({
            title:fieldName,
            dataIndex: fieldCode,
            key: fieldCode,
            ellipsis: true,
            // ...scopedSlots
          })
        })
        data.itemFieldsValue.forEach((item,index) => {
          arr[index] = {}
          Object.keys(item).forEach(key => {
            arr[index][key] = item[key]
          })
        })
        this.dataSource = arr
        this.cardLoading = false
      }
    },
    created() {
      this.getTestRptDetail()
    },
    // 卸载页面
    destroyed() {
    },
    mounted() {
    },
    watch: {
    },
    computed: {
    }
  }
  </script>
  <style scoped lang="less">
.reprot-detail{
  background: white;
  height: calc(100vh - 80px);
  font-family: PingFang SC, PingFang SC;
}
/deep/ .pl50{
  padding:0 50px;
}
/deep/ .mb-24{
  margin-bottom: 24px;
}
/deep/ .project-info{
  font-size: 18px;
  span:nth-child(1){
    font-weight: 400;

color: rgb(0,0,0);
  }
}
/deep/ .reprot-detail-title{
  font-weight: bold;
font-size: 24px;
color: rgba(0,0,0,0.85);
line-height: 24px;
text-align: center;
}
/deep/ .top-list{
  display: flex;
  flex-wrap: wrap;
  margin-bottom:10px;
  .top-item{
    width: 33%;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-size: 18px;
    .top-title{
      width: 100px;
      text-align: right;
      margin-right: 10px;
      font-weight: 400;

color: rgb(0,0,0);
    }
  }
}
/deep/ .bottom-list{
  display: flex;
  flex-wrap: wrap;
  .bottom-item{
    width: 33%;
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-size: 18px;
    .bottom-title{
      width: 100px;
      text-align: right;
      margin-right: 10px;
      font-weight: 400;

color: rgb(0,0,0);
    }
  }
}
</style>