<template>
  <div class="image-detail">
    <!-- 影像详情 -->
    <Detail :classify="1"></Detail>
  </div>
</template>
<script>
import { queryImageDetail, queryApproveList, submitApproveList } from '@/api/image-detail'
import { PageLoading } from '@/components/PageLoading'
import { postNormalData, arrTransferStr, jsonTransfer, strToArr } from '@/utils/methods'
import { getCookie } from '@/utils/cookie'
import Detail from '../components'
export default {
  name: 'imageDetail',
  components: {
    Detail
  },
  data() {
    return {
      study_id: this.$route.query.id || '', // 查询id
      type: this.$route.query.type || '', // 类型 dicom-影像 report-报告
      imgCommon: [],
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
        study_request_time: ''
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
      const {
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
        study_request_time
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
    },
     // 查询互认清单
    async queryApprove() {
      const { data = {} } = await queryApproveList()
      const { img } = data && data
      this.imgCommon = jsonTransfer(img && img.common)
      // this.reportCommon = jsonTransfer(report && report.common)
      // this.reportObject = jsonTransfer(report && report.object)
      // this.imgObject = jsonTransfer(img && img.object)
    },
  },
  mounted() {
    if (this.$route.query.report) {
      return
    }
    const history = sessionStorage.getItem('history') ? Number(sessionStorage.getItem('history')) : 0
    // console.log(this.$route.query.new_label)
    if (!history && (this.$route.query.new_label === '0' || this.$route.query.new_label === undefined)) {
      this.$router.push({
          path: '/home/index'
      })
    }
    // window.addEventListener('beforeunload', function (e) {
    //   this.$router.back(-1)
    //   return false
    // })
    // this.queryApprove()
  },
  destroyed () {
  },
  deactivated() {
    // console.log('image deactivated')
  },
  activated() {
    // 重新获取id和type
    // this.study_id = this.$route.query.id
    // this.type = this.$route.query.type
    // this.queryDetail()
    // console.log('image activated')
  },
  watch: {
    // $route(route) {
    //   if (route.query.id || route.query.type) {
    //     this.queryDetail()
    //   }
    // }
  }
}
</script>