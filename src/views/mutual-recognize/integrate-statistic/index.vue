<!--
 * @Description: 综合统计
 * @version: 1.0
 * @Author: renyong
 * @Date: 2022-05-16 15:42:47
 * @LastEditors: renyong
 * @LastEditTime: 2022-06-28 14:29:57
-->
<template>
  <div class="integrative-statistic">
    <!-- 个人互认统计 -->
    <section class="individual">
      <section class="top">
        <section class="left">
          <span class="title">个人互认统计</span>
          <a-tooltip>
            <template slot="title">
              <span>显示用户当前所选执业医疗机构互认数据概况，多点执业用户需切换执业机构查看对应数据。</span>
            </template>
            <a-icon type="question-circle" class="icon"/>
          </a-tooltip>
        </section>
        <section class="right">数据统计范围：2022年5月 - 至今</section>
      </section>
      <section class="main">
        <card-statistic 
          v-for="(item, index) in personalList"
          :key="index"
          :title="item.title"
          :count="item.count"
          :imgSrc="item.imgSrc"
          :suffix="item.suffix"
        >
          <a-tooltip slot="title-icon">
            <template slot="title">
              <span>{{ item.iconText }}</span>
            </template>
            <a-icon  type="question-circle" v-if="item.iconText"/>
          </a-tooltip>
        </card-statistic>
      </section>
    </section>
    <!-- 所在医院互认统计 -->
    <section class="orgName">
      <section class="top">
        <section class="left">
          <header class="title">所在 <span>{{ hospitalName }}</span>互认统计</header>
        </section>
      </section>
      <section class="main">
        <card-statistic 
          v-for="(item, index) in orgList"
          :key="index"
          :title="item.title"
          :count="item.count"
          :imgSrc="item.imgSrc"
          :suffix="item.suffix"
        >
        </card-statistic>
      </section>
    </section>
    <!-- 综合趋势 -->
    <section class="trend">
      <a-card>
        <div slot="title" class="title">综合趋势</div>
        <div slot="extra" class="extra">
          <a-radioGroup v-model="radioValue1" @change="changeRadioValue1">
            <a-radio-button
              v-for="(item, index) in dictionary.mutualDateRangeArr"
              :key="index"
              :value="item.value"
            >
              {{ item.text }}
            </a-radio-button>
          </a-radioGroup>
          <a-range-picker
            class="date-picker"
            v-model="date"
            :disabledDate="disabledDate"
            @change="changeRangeDate">
          </a-range-picker>
        </div>
        <div class="content">
          <a-row class="header">
            <a-col>
              <a-radioGroup v-model="radioValue2" @change="changeTrendType">
                <a-radio
                  v-for="(item, index) in dictionary.mutualRadioArr"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.text }}
                </a-radio>
              </a-radioGroup>
            </a-col>
          </a-row>
          <div id="trendChart"></div>
        </div>
      </a-card>
    </section>
  </div>
</template>
<script>
import * as echart from 'echarts'
import moment from 'moment'
import enums from '@/enum'
import dictionary from '@/dictionary'
import CardStatistic from './components/card-statistic'
import img1 from '@/assets/mutual/img1.svg'
import img2 from '@/assets/mutual/img2.svg'
import img3 from '@/assets/mutual/img3.svg'
import img4 from '@/assets/mutual/img4.svg'
import img5 from '@/assets/mutual/img5.svg'
import { mapGetters } from 'vuex'
import { getCookie } from '@/utils/cookie'
import { queryMutualStatistic, queryMutualTrend } from '@/api/mutual-statistic'
import { getAllDateBetweenDates } from '@/utils/methods'
import { dataTracking } from '@/api'
export default {
  components: {
    CardStatistic
  },
  data() {
    return {
      dictionary,
      radioValue1: 1, // 选择日期1
      radioValue2: 1, // 选择日期2
      date: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
      rangeDate: { // 日期范围
        end_time: moment().format('YYYY-MM-DD 23:59:59'),
        begin_time: moment().format('YYYY-MM-DD 00:00:00')
      },
      personalList: [
        {
          imgSrc: img1,
          title: '调阅互认率',
          key: 'recognition_rate',
          iconText: '检查结果互认次数/数据调阅次数X100%',
          count: '',
          suffix: '%'
        },
        {
          imgSrc: img2,
          title: '检查结果互认次数',
          key: 'recognition_count',
          iconText: '检查结果进行互认次数',
          count: '',
          suffix: ''
        },
        {
          imgSrc: img3,
          title: '数据调阅次数',
          key: 'access_count',
          iconText: '调阅患者历史影像数据详情的次数，不区分查看的是报告还是影像，都算查看了历史影像数据',
          count: '',
          suffix: ''
        },
        {
          imgSrc: img4,
          title: '查询次数',
          key: 'search_count',
          iconText: '医生登录系统后总的查询次数',
          count: '',
          suffix: ''
        },
        {
          imgSrc: img5,
          title: '访问次数',
          key: 'view_count',
          iconText: '通过医生工作站访问个人医保云的次数',
          count: '',
          suffix: ''
        }
      ],
      orgList: [
        {
          imgSrc: img1,
          title: '调阅互认率',
          key: 'recognition_rate',
          count: '',
          suffix: '%'
        },
        {
          imgSrc: img2,
          title: '检查结果互认次数',
          key: 'recognition_count',
          count: '',
          suffix: ''
        },
        {
          imgSrc: img3,
          title: '数据调阅次数',
          key: 'access_count',
          // iconText: '调阅患者历史影像数据详情的次数，不区分查看的是报告还是影像，都算查看了历史影像数据',
          count: '',
          suffix: ''
        },
        {
          imgSrc: img4,
          title: '查询次数',
          key: 'search_count',
          // iconText: '医生登录系统后总的查询次数',
          count: '',
          suffix: ''
        },
        {
          imgSrc: img5,
          title: '访问次数',
          key: 'view_count',
          // iconText: '通过医生工作站访问个人医保云的次数',
          count: '',
          suffix: ''
        }
      ],
      seriesNameArr: ['recognition_rate', 'recognition_count','access_count','search_count','view_count' ], // 系列数据
      myChart: null,
      chartObj: {
        date_arr: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        data: {}
      }
    }
  },
  created() {
    this.init()
  },
  destroyed() {
    this.$bus.$off('codeChange')
  },
  mounted() {
    this.$bus.$on('codeChange', ()=>{ // 注册codeChange
      this.init()
    })
  },
  computed: {
    ...mapGetters(['hospitalName', 'userInfo'])
  },
  methods: {
    /**
     * @Description: 埋点接口请求
     * @param {*} params 埋点参数
     * @return {*}
     * @author: renyong
     */   
    async trackingEvent(params) {
      try {
        const { data = null } = await dataTracking(params)
        // console.log('data', data)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * @Description: 初始化数据
     * @return {*}
     * @author: renyong
     */    
    init() {
      this.getMutualInfo()
      this.getTrendData()
      this.resetParams()
    },
    /**
     * @Description: 重置参数
     * @return {*}
     * @author: renyong
     */    
    resetParams() {
      this.radioValue1 = this.radioValue2 = 1
      this.date = [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
    },
    /**
     * @Description: 
     * @param date_arr 传入日期数组- 默认当前日期
     * @return {*}
     * @author: renyong
     */      
    async getTrendData(date_arr) {
      // console.log('x')
      const params = { // 传入的参数
        ...this.rangeDate,
        organ_code: getCookie('org_id')
      }
      try {
        const { data = {} } = await queryMutualTrend(params)
        const chart_obj = {
          date_arr: date_arr || [moment().format('YYYY-MM-DD')], // 日期
          data // 接口数据
        }
        Object.assign(this.chartObj, chart_obj)
        this.paintChart()

        // 设置埋点数据
        const trackingParams = {}
        const trackingObj = {
          sending_time: +new Date(),
          appver: '1.0.1',
          type: 'huren_stat',
          extension: {
            doc_hospital_id: getCookie('org_id'),
            doc_id: this.userInfo.uid
          }
        }
        Object.assign(trackingParams, trackingObj, {
          tm: +new Date(), // 记录触发事件
          action: 'summary_show',
        })
        // 记录查看影像埋点
        this.trackingEvent(trackingParams)
      } catch (error) {
        console.log('error', error)
      }
    },

    /**
     * @Description: 查询互认信息-个人和机构
     * @return {*}
     * @author: renyong
     */    
    async getMutualInfo() {
      try {
        const { data = {} } = await queryMutualStatistic({
          organ_code: getCookie('org_id')
        })
        const per_org_Keys = Object.keys(data && data) // 获取data的第一层keys
        const obj_keys = { keys: Object.keys(data && (data.personal || data.organization)) } // 获取第二层keys
        per_org_Keys.forEach(v => {
          const params = {
            arr: [],
            dataObj: {},
            ...obj_keys
          }
          if (v === 'personal') { //个人
            params.arr = this.personalList
            params.dataObj = data && data.personal
          } else if (v === 'organization') { // 机构
            params.arr = this.orgList
            params.dataObj = data && data.organization
          }
          this.getCount(params)
        })

        // 设置埋点数据
        const trackingParams = {}
        const trackingObj = {
          sending_time: +new Date(),
          appver: '1.0.1',
          type: 'huren_stat',
          extension: {
            doc_hospital_id: getCookie('org_id'),
            doc_id: this.userInfo.uid
          }
        }
        Object.assign(trackingParams, trackingObj, {
          tm: +new Date(), // 记录触发事件
          action: 'detail_show',
        })
        // 记录查看影像埋点
        this.trackingEvent(trackingParams)
      } catch (error) { 
        console.log(error)
      }
    },

    /**
     * @Description: 获取count值
     * @param arr 原始数据-需要修改其中的count值
     * @param keys 从接口获取的key值集合，与arr中的key相同
     * @param dataObj 接口返回的对象
     * @return {*}
     * @author: renyong
     */
    getCount({arr, keys, dataObj}) { // 解构传入的参数
      arr.forEach(v => {
        const value = dataObj[v.key]
        if (~keys.indexOf(v.key)) v.count = value // 存在key值
      })
    },
    /**
     * @Description: 绘制echart
     * @return {*}
     * @author: renyong
     */    
    paintChart() {
      // 过滤数据
      const type = enums.mutualTrendType[this.radioValue2] // 获取趋势类型
      const data_obj = this.chartObj.data[type] // 计算一次
      const per_arr = data_obj.personal // 个人
      const org_arr = data_obj.organization // 机构
      if(!this.myChart) this.myChart = echart.init(document.getElementById('trendChart'))
      const loadingObj = {
        text: '加载中...',
        color: '#0369FC'
      }
      this.myChart.showLoading(loadingObj)
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            // console.log(params)
            const arr = []
            params.forEach((v, k) => {
              const { name, value, color, seriesName } = v
              const styleStr1 = `
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 5px;
                background: ${color}
              `
              const tooltip =`
                <div>
                  <div> 
                    ${ k === 0 ? `<span style="margin-right: 5px;font-weight: bold;">${ name }</span>` : ''}
                    <p style="margin-top: 5px;">
                      <span
                        style="${styleStr1}"
                      >
                      </span>
                      <span>${ seriesName }：</span>
                      <span>${ this.radioValue2 === 1 ? (value + '%') : (value + '次')}</span>
                    </p>
                  </div>
                </div>
              `
              arr.push(tooltip)
            })
            return arr.join('')
          }
        },
        legend: {
          data: ['个人', '机构']
        },
        xAxis: {
          type: 'category',
          data: this.chartObj.date_arr,
          boundaryGap: false, // 两边不留白
          // gridIndex: 1,
          // axisLine: {
          //   lineStyle: {
          //     color: '#1890ff',
          //     width: 1,
          //     type: 'solid'
          //   }
          // },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: value => {
              return this.radioValue2 === 1 ? `${value}%` : value
            }
          }
        },
        series: [
          {
            name: '个人',
            type: 'line',
            // stack: 'Total',
            data: per_arr
          },
          {
            name: '机构',
            type: 'line',
            // stack: 'Total',
            data: org_arr
          }
        ],
        // dataZoom: [
        //   // 横向使用滚动条
        //   {
        //     type: 'inside', //有单独的滑动条，用户在滑动条上进行缩放或漫游。inside是直接可以是在内部拖动显示
        //     show: true, // 是否显示组件，如果设置为 false，不会显示，但是数据过滤的功能还存在。
        //     start: 0, // 数据窗口范围的起始百分比0-100
        //     end: 50, // 数据窗口范围的结束百分比0-100
        //     xAxisIndex: [0], // 此处表示控制第一个xAxis，设置 dataZoom-slider 组件控制的 x轴 可是已数组[0,2]表示控制第一，三个；xAxisIndex: 2 ，表示控制第二个。yAxisIndex属性同理
        //     bottom: -10,
        //     filterMode: 'empty', // 当前数据窗口外的数据，被 设置为空。即 不会 影响其他轴的数据范围。
        //     zoomLock: true,
        //   }
        // ]
      }
      option && this.myChart.setOption(option)
      window.addEventListener('resize', () => { // 自适应
        this.myChart.resize()
      })
      this.myChart.hideLoading()
    },
    /**
     * @Description: 切换日期
     * @param date
     * @param dateString
     * @return {*}
     * @author: renyong
     */    
    changeRangeDate(date, dateString) {
      this.radioValue1 = 0 // 重置radioValue1
      if (date.length) {
        this.rangeDate = {
          begin_time: date[0].format('YYYY-MM-DD 00:00:00'),
          end_time: date[1].format('YYYY-MM-DD 23:59:59')
        }
        const dateObj = {
          startDate: date[0].format('YYYY-MM-DD'),
          endDate: date[1].format('YYYY-MM-DD')
        }
        // console.log(dateObj)
        const date_arr = getAllDateBetweenDates(dateObj) // 获取两个日期间的所有日期
        // console.log(date_arr)
        this.getTrendData(date_arr)
      }
    },

    /**
     * @Description: 禁用日期
     * @param current 所有日期-moment格式
     * @return {*}
     * @author: renyong
     */  
    disabledDate(current) {
      return current > moment() || current < moment('2022-05-01')
    },
    /**
     * @Description: 切换日期
     * @param e 事件对象
     * @return {*}
     * @author: renyong
     */    
    changeRadioValue1(e) {
      this.radioValue1 = e.target.value
      let date_arr
      const rangeDate = this.rangeDate
      if (this.radioValue1 === 2) { // 7天内
        date_arr = this.getAllDates(7)
        this.date = this.getDate(7)
      } else if (this.radioValue1 === 3) { // 30天内
        date_arr = this.getAllDates(30)
        this.date = this.getDate(30)
      } else { // 今日
        this.date = [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')]
      }
      rangeDate.begin_time = this.date[0]
      rangeDate.end_time = this.date[1]
      // console.log('date_arr', date_arr)
      this.getTrendData(date_arr)
    },
    /**
     * @Description: 获取天数 
     * @param {*} days 天数
     * @return {*}
     * @author: renyong
     */    
    getDays(days) {
      const start = moment('2022-05-01') // 开始日期
      const end = moment().subtract(1, 'days') // 结束日期
      const diffDays = Math.abs(end.diff(start, 'days')) + 1 // 结束日期和开始日期相差多少天
      days = days > diffDays ? diffDays : days
      return days
    },
    /**
     * @Description: 获取开始日期和结束日期
     * @param days 天数
     * @return {*}
     * @author: renyong
     */    
    getDate(days) {
      days = this.getDays(days)
      return [moment().subtract(days, 'days').format('YYYY-MM-DD 00:00:00'), moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')]
    },
    /**
     * @Description: 获取两个日期之前的所有日期
     * @param days 天数
     * @return {*}
     * @author: renyong
     */    
    getAllDates(days) {
      days = this.getDays(days)
      const dateObj = {
        startDate: moment().subtract(days, 'days').format('YYYY-MM-DD'),
        endDate: moment().subtract(1, 'days').format('YYYY-MM-DD')
      }
      return getAllDateBetweenDates(dateObj)
    },

    /**
     * @Description: 切换趋势类型-展示不同的echart
     * @param e 事件对象
     * @return {*}
     * @author: renyong
     */    
    changeTrendType(e) {
      this.radioValue2 = e.target.value
      this.paintChart()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>