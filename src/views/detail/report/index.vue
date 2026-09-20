<template>
  <div class="reprot-detail">
    <!-- 报告详情 -->
    <Detail :classify="2"></Detail>
  </div>
</template>
<script>
import { queryImageDetail, queryApproveList, submitApproveList } from '@/api/image-detail'
import { PageLoading } from '@/components/PageLoading'
import { postNormalData, arrTransferStr, jsonTransfer, strToArr } from '@/utils/methods'
import { getCookie } from '@/utils/cookie'
import Detail from '../components'
export default {
  name: 'reportDetail',
  components: {
    Detail
  },
  data() {
    return {
      study_id: this.$route.query.id || '', // 查询id
      type: this.$route.query.type || '', // 类型 dicom-影像 report-报告
      reportCommon: [], // 报告-客观原因
      reportInfo: {
        hospital_name: '',
        modality: '',
        patient_name: '',
        patient_sex: '',
        patient_age: '',
        accession_number: '', // 门诊号
        visit_departments: '',
        hospitalization_bed_number: '', // 床号
        study_request_no: '', // 住院号
        record_num: '', // 检查号
        report_date: '',
        out_patientId: '', // 病人id
        study_body_part: '', // 检查部位
        image_performance: '', // 影像表现
        first_clinical_diagnosis: '', // 诊断意见
        report_doctor: '', // 报告医师
        study_doctor: '', // 审核医师
        study_date: '', // 检查日期
        if_dicom_upload: '',
        study_request_time: '',
        is_hr: '' // 是否互认
      },
    }
  },
  methods: {
     // 查询详情
    async queryDetail() {
      const { data = {} } = await queryImageDetail({
        study_id: this.study_id,
        type: this.type
      })
      // console.log(data)
      const  {
        if_dicom_upload,
        hospital_name,
        modality,
        patient_name,
        patient_sex,
        patient_age,
        accession_number, // 门诊号
        visit_departments,
        hospitalization_bed_number, // 床号
        study_request_no, // 住院号
        record_num, // 检查号
        report_date,
        out_patientId, // 病人id
        study_body_part, // 检查部位
        image_performance, // 影像表现
        first_clinical_diagnosis, // 诊断意见
        report_doctor, // 报告医师
        study_doctor, // 审核医师
        study_date, // 检查日期
        study_request_time,
        is_hr
      } = data && data
      this.reportInfo.hospital_name = hospital_name
      this.reportInfo.modality = modality
      this.reportInfo.patient_name = patient_name
      this.reportInfo.patient_sex = patient_sex
      this.reportInfo.patient_age = patient_age
      this.reportInfo.accession_number = accession_number
      this.reportInfo.visit_departments = visit_departments
      this.reportInfo.hospitalization_bed_number = hospitalization_bed_number
      this.reportInfo.study_request_no = study_request_no
      this.reportInfo.record_num = record_num
      this.reportInfo.report_date = report_date
      this.reportInfo.out_patientId = out_patientId
      this.reportInfo.study_body_part = study_body_part
      this.reportInfo.image_performance = image_performance
      this.reportInfo.first_clinical_diagnosis = first_clinical_diagnosis
      this.reportInfo.report_doctor = report_doctor
      this.reportInfo.study_doctor = study_doctor
      this.reportInfo.study_date = study_date
      this.reportInfo.if_dicom_upload = if_dicom_upload
      this.reportInfo.study_request_time = study_request_time
      this.reportInfo.is_hr = is_hr
    },
    // 查询互认清单
    async queryApprove() {
      const { data = {} } = await queryApproveList()
      const { report } = data && data
      this.reportCommon = jsonTransfer(report && report.common)
    }
  },
  created() {
    // this.queryApprove()
  },
  activated() {
    // 重新获取id和type
    // this.study_id = this.$route.query.id
    // this.type = this.$route.query.type
    // this.queryDetail()
    // console.log('report activated')
  },
  deactivated() {
    // console.log('report deactivated')
  },
  // 卸载页面
  destroyed() {
  },
  mounted() {
    // console.log('mounted')
    const history = sessionStorage.getItem('history') ? Number(sessionStorage.getItem('history')) : 0
    // console.log(this.$route.query.new_label)
    if (!history && (this.$route.query.new_label === '0' || this.$route.query.new_label === undefined)) {
      this.$router.push({
          path: '/home/index'
      })
    }
  },
  watch: {
    // 变化之后重新发起请求
    // '$route.params.id'() {
    //   this.reques
    // }
    // $route(route) {
    //   // console.log('route')
    //   // this.isFirst = true // 重置为true
    //   // this.isRequestAgain(route)
    //   // if (this.isFirst) return // 如果是第一次,不发起请求
    //   // if (route.query.id || route.query.type) { // 不是第一次则监听id和type的变化
    //   //   this.queryDetail()
    //   // }
    // }
  },
  computed: {
   
  }
}
</script>