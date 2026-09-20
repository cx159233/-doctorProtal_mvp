<!--
 * @Description: 历史互认清单
 * @version: 1.0
 * @Author: renyong
 * @Date: 2022-05-16 15:48:45
 * @LastEditors: renyong
 * @LastEditTime: 2022-06-28 13:41:11
-->
<template>
  <div class="history-mutual-recognize">
    <a-card>
      <div slot="title" class="title">历史互认清单</div>
      <section class="main">
        <a-form-model
          layout="inline"
          :model="form"
          @submit="handleSubmit"
        >
          <a-row class="m-b-16">
            <a-col :span="6">
              <a-form-model-item label="患者姓名">
                <a-input placeholder="请输入" v-model="form.name" allowClear></a-input>
              </a-form-model-item>
              <a-form-model-item>
                <a-button type="primary" html-type="submit" :loading="queryLoading">查询</a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row class="m-b-16">
            <a-col>
              <a-form-model-item label="检查类型">
                <a-select v-model="form.modality" style="width: 100px;" placeholder="请选择" @change="changeType" allowClear>
                  <a-select-option v-for="(item, index) in checkObj.modality" :key="index" :value="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="检查部位" >
                <a-select v-model="form.body_part" style="width: 100px;" placeholder="请选择" @change="changePart" allowClear>
                  <a-select-option v-for="(item, index) in checkObj.body_part" :key="index" :value="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="检查项目名称" >
                <a-select v-model="form.proj_name" style="width: 100px;" placeholder="请选择" @change="changeProject" allowClear>
                  <a-select-option v-for="(item, index) in checkObj.proj_name" :key="index" :value="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="不互认原因">
                <a-select
                  v-model="form.reason_id"
                  placeholder="请选择"
                  style="width: 405px;"
                  @change="getHistoryList"
                  :allowClear="true"
                  show-search
                  :filter-option="filterOption"
                  >
                  <a-select-option v-for="(item,index) in reasonList" :key="index" :value="item.value" >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row class="m-b-16">
            <a-col>
              <a-form-model-item label="检查时间">
                <a-range-picker @change="changeCheckDate" :disabledDate="disabledDate"></a-range-picker>
              </a-form-model-item>
              <a-form-model-item label="操作时间">
                <a-range-picker @change="changeOperDate" :disabledDate="disabledDate"></a-range-picker>
              </a-form-model-item>
              <a-form-model-item label="互认操作">
                <a-select v-model="form.is_recognition" placeholder="请选择" style="width: 100px;" @change="changeRecognition" allowClear>
                  <a-select-option :key="1" :value="1">互认</a-select-option>
                  <a-select-option :key="2" :value="2">不互认</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <global-table
          :columns="columns"
          :dataSource="dataSource"
          :scrollX="1100"
          :pagination="{
            current,
            pageSize,
            total
          }"
          @changePageNum="changePageNum"
        ></global-table>
      </section>
    </a-card>
  </div>
</template>

<script>
import GlobalTable from 'components/Table'
import { queryMutualHistory, queryConditions } from '@/api/mutual-statistic'
import { queryList } from '@/api/image-list'
import { postNormalData, desensitization } from '@/utils/methods'
import { dataTracking } from '@/api'
import { mapGetters } from 'vuex'
import { getCookie } from '@/utils/cookie'
import { queryApproveList } from '@/api/image-detail'
import enums from '@/enum'
export default {
  components: {
    GlobalTable
  },
  data() {
    return {
      queryLoading: false, // 查询loading
      dataSource: [], // 列表数据源-接口获取
      current: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总条数
      checkObj: { // 检查
        modality: [], // 检查类型
        body_part: [], // 检查部位
        proj_name: [] // 检查项目
      },
      form: {
        name: this.$route.query.name || '', // 患者姓名
        study_begin_time: '', // 检查开始时间
        study_end_time:  '', // 检查结束时间
        op_begin_time:  '', // 操作开始时间
        op_end_time:  '', // 操作结束时间
        is_recognition: undefined, // 是否互认
        modality: undefined, // 检查类型
        body_part: undefined, // 检查部位
        proj_name: undefined, // 检查项目
        page: 1, //当前页数
        page_size: 10, // 每页条数
        reason_id:undefined
      },
      reasonList:[], // 不互认原因列表
      columns: [
        {
          title: '患者姓名',
          dataIndex: 'name',
          width: '150px',
          customRender: (text, record, index) => {
            return text || '-'
          }
        },
        {
          title: '身份证号',
          dataIndex: 'id_card',
          width: '160px',
          customRender: (text, record, index) => {
            return text && desensitization(text, 4, -4) || '-'
          }
        },
        {
          title: '医院名称',
          dataIndex: 'hospital_name',
          width: '150px',
          customRender: (text, record, index) => {
            return text || '-'
          }
        },
        {
          title: '检查设备类型',
          dataIndex: 'modality',
          width: '150px',
          customRender: (text, record, index) => {
            return text || '-'
          }
        },
        {
          title: '检查部位',
          dataIndex: 'body_part',
          width: '100px',
          customRender: (text, record, index) => {
            return text || '-'
          }
        },
        {
          title: '检查项目名称',
          dataIndex: 'proj_name',
          width: '150px',
          customRender: (text, record, index) => {
            return text || '-'
          }
        },
        {
          title: '检查时间',
          dataIndex: 'report_time',
          width: '150px',
          customRender: (text, record, index) => {
            return text || '-'
          }
        },
        {
          title: '互认操作',
          dataIndex: 'is_recognition',
          width: '100px',
          customRender: (text, record, index) => {
            return enums.isRecognition[Number(text)]
          }
        },
        {
          title: '不互认原因',
          dataIndex: 'reason',
          width: '150px',
          customRender: (text, record, index) => {
            return text || '-'
          }
        },
        {
          title: '操作时间',
          dataIndex: 'op_time',
          width: '150px',
          customRender: (text, record, index) => {
            return text || '-'
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '170px',
          customRender: (text, record, index) => {
            const reportParam = { // 报告
              type: 'report',
              record
            }
            const imageParam = { // 影像
              type: 'dicom',
              record
            }
            const reportTag = (<a style={{ marginLeft: '8px'}} onClick={ () => this.viewDetail(reportParam) }>查看报告</a>)
            const imageTag = (<a onClick={ () => this.viewDetail(imageParam) }>查看影像</a>)
            return [imageTag, reportTag]
          }
        }
      ]
    }
  },
  destroyed() {
    this.$bus.$off('codeChange')
  },
  mounted() {
    this.$bus.$on('codeChange', ()=>{ // 注册codeChange
      this.init()
    })
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    /**
     * @Description: 初始化数据
     * @return {*}
     * @author: renyong
     */    
    init() {
      this.getHistoryList()
      this.getConditions()
      this.getReasonList()
    },
    /**
     * @Description: 查询患者信息
     * @param name 患者姓名
     * @param id_card 患者证件号
     * @return {*}
     * @author: renyong
     */    
    async queryPatientInfo({name, id_card, study_primary_id}) { // 患者姓名和身份证号
      const queryParams = {
        patient_name: name,
        time_view_range: -1,
        patient_id_card: id_card,
        quality_control: '',
        source: '3' // 来源 1:重复开单提醒；2：一键查询；3:IP访问或为空
      }
      const formData = postNormalData(queryParams)
      const obj = {
        sending_time: +new Date(),
        appver: '1.0.1',
        type: 'pacs_search',
          extension: {
          doc_id: this.userInfo.uid,
          doc_hospital_id: getCookie('org_id'),
          patient_name: name
        }
      }
      const trackingParams = {}
      Object.assign(trackingParams,obj,{
        tm: +new Date(), // 记录触发事件
        action: 'search_start',
      })
      this.trackingEvent(trackingParams)
      // 开始查询
      try {
        const { data = [], code = '' } = await queryList(formData)
        const [ filterData ] = data && Array.isArray(data) && data.length ? data.filter(item => item.id === study_primary_id) : []// 过滤数据
        // console.log('filterData', filterData)
        if (code === 200) { // 埋点查询成功
          Object.assign(trackingParams,obj,{
            tm: +new Date(), // 时间戳
            action: 'search_succ',
          })
          this.trackingEvent(trackingParams)
        }
        if (code === 200 && (!data || (!!data && Array.isArray(data) && !data.length))) { // 埋点查询成功但没有结果
          Object.assign(trackingParams, obj, {
            tm: +new Date(), // 时间戳
            action: 'search_succ_no_result',
          })
          this.trackingEvent(trackingParams)
        }
        return filterData
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * @Description: 埋点设置
     * @param name 埋点参数
     * @return {*}
     * @author: renyong
     */
    async trackingEvent(params) {
      const { data = null } = await dataTracking(params)
      // console.log('data', data)
      return data
    },
    
    /**
     * @Description: 获取检查类型
     * @return {*}
     * @author: renyong
     */    
    async getConditions() {
      const { data = [] } = await queryConditions({
        organ_code: getCookie('org_id')
      })
      this.checkObj = data && { ... this.checkObj, ...data}
      // console.log('getConditions', this.checkObj)
    },
    async getReasonList(){
      this.reasonList = []
      const {data = {}} = await queryApproveList()
      for(const k in data){
        this.reasonList.push({
          name: data[k],
          value: k
        })
      }
    },

    /**
     * @Description: 获取历史清单
     * @return {*}
     * @author: renyong
     */    
    async getHistoryList() {
      this.queryLoading = true
      setTimeout(() => {
        this.queryLoading = false
      }, 500)
      const { data = [], meta = {} } = await queryMutualHistory(this.form)
      this.dataSource = data && Array.isArray(data) && data
      this.total = meta && meta.pagination && meta.pagination.total || 0
      // console.log('data', data)
    },

    /**
     * @Description: 切换页码
     * @param obj
     * @return {*}
     * @author: renyong
     */    
    changePageNum(obj) {
      console.log('obj', obj)
      const form = this.form
      this.current = obj.current // 展示当前页码
      this.pageSize = obj.pageSize // 展示条数
      form.page = obj.current
      form.page_size = obj.pageSize
      this.getHistoryList()
    },
    
    /**
     * @Description: 切换检查日期
     * @param date moment日期格式
     * @param dateString 字符串日期格式
     * @return {*}
     * @author: renyong
     */   
    changeCheckDate(date, dateString) {
      const form = this.form
      if (date.length) {
        form.study_begin_time = date[0].format('YYYY-MM-DD 00:00:00')
        form.study_end_time = date[1].format('YYYY-MM-DD 23:59:59')
      } else {
        form.study_begin_time = ''
        form.study_end_time = ''
      }
      this.getHistoryList()
    },
    /**
     * @Description: 切换操作日期
     * @param date moment日期格式
     * @param dateString 字符串日期格式
     * @return {*}
     * @author: renyong
     */    
    changeOperDate(date, dateString) {
      const form = this.form
       if (date.length) {
        form.op_begin_time = date[0].format('YYYY-MM-DD 00:00:00')
        form.op_end_time = date[1].format('YYYY-MM-DD 23:59:59')
      } else {
        form.op_begin_time = ''
        form.op_end_time = ''
      }
       this.getHistoryList()
    },

    /**
     * @Description: 切换查询组
     * @return {*}
     * @author: renyong
     */
    // 切换类型
    changeType(val) {
      this.getHistoryList()
    },
    changePart(val) {
      this.getHistoryList()
    },
    changeProject(val) {
      this.getHistoryList()
    },
    changeRecognition(val) {
      this.getHistoryList()
    },

    /**
     * @Description: 查询
     * @return {*}
     * @author: renyong
     */  
    handleSubmit() {
      this.getHistoryList()
    },

    /**
     * @Description: 禁用日期
     * @param current moment格式日期
     * @return {*}
     * @author: renyong
     */    
    disabledDate(current) {
      return current > new Date()
    },

    /**
     * @Description: 查看影像和报告
     * @param type 查看类型 'report'-报告 'image'-影像
     * @param record 数据
     * @return {*}
     * @author: renyong
     */    
    async viewDetail({type, record}) {
      const {name, id_card, study_primary_id,view_record_id} = record
      const params = {
        name,
        id_card,
        study_primary_id
      }
      // this.$store.dispatch('DeleteTabPane', [])  // 跳过去清空标签页
      const org_id = getCookie('org_id')
      const filterData = await this.queryPatientInfo(params) || {}
      if (filterData && (JSON.stringify(filterData)!== '{}')) {
        const path = type === 'dicom' ? '/detail/image' : '/detail/report'
        // 添加到tabPane标签页容器中, 添加之前比对有无重复添加标签页
        // const tabPane = this.$store.getters.tabPane
        // const text = filterData.pat_name + ' ' + filterData.item_name
        // const obj = {
        //   // 组装数据
        //   id: filterData.id,
        //   text,
        //   status: filterData.hr_flag || '0',
        //   type,
        //   // key: tabPane.length,
        //   key: type === 'dicom' // 影像
        //     ? `/detail/image?id=${filterData.id}&type=dicom&has_dicom=${filterData.has_dicom}&has_report=${filterData.has_report}&hospital_code=${filterData.hospital_code}&pat_name=${filterData.pat_name}&item_name=${filterData.item_name}&org_id=${org_id}`
        //     : `/detail/report?id=${filterData.id}&type=report&has_dicom=${filterData.has_dicom}&has_report=${filterData.has_report}&hospital_code=${filterData.hospital_code}&pat_name=${filterData.pat_name}&item_name=${filterData.item_name}&org_id=${org_id}`,
        // }
        // const bol = tabPane.some((item, k) => item.id === obj.id && item.type === type) // 如果匹配其中一项
        // if (!bol) {
        //   // 如果都没有对应的key，则添加
        //   this.$store.dispatch('PushTabPane', obj) // 添加标签页
        // }
        const newPage = this.$router.resolve({
          path,
          query: {
            uid: this.userInfo.uid,
            id: filterData.id,
            type,
            has_dicom: filterData.has_dicom,
            has_report: filterData.has_report,
            hospital_code: filterData.hospital_code,
            pat_name: filterData.pat_name,
            item_name: filterData.item_name,
            org_id,
            // 是否新标签
            new_label: '1',
            view_record_id
          }
        })
        window.open(newPage.href, '_blank')
      } else {
        this.$warning({
          content: '暂不支持查看'
        })
      }
    },
  }
}
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>