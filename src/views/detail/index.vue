<template>
  <div class="image-detail">
    <router-view></router-view>
  </div>
</template>

<script>
import { queryImageDetail, queryApproveList, submitApproveList } from '@/api/image-detail'
import { PageLoading } from '@/components/PageLoading'
import { postNormalData, arrTransferStr, jsonTransfer, strToArr } from '@/utils/methods'
export default {
  name: 'imageDetail',
  components: {
    PageLoading
  },
  data() {
    return {
      has_hr: 0, // 是否互认
      pageLoading: false,
      smCol: 8,
      mdCol: 8,
      xlCol: 8,
      if_dicom_upload: '0', // 是否上传影像
      study_id: this.$route.query.id || '', // 查询id
      visible: false, // 是否展示查看更多弹窗
      record_num: '', // 展示报告是否有无
      hospital_code: '', // 医院编号
      study_date: '', // 申请时间
      study_request_time: '',
      // isRecognized: false, // 已互认但未提交
      reportRadioDisabled: false, // 报告单选框是否禁用
      imageRadioDisabled: false, // 影像单选框是否禁用

      reportCommon: [], // 报告客观原因
      reportObject: [], // 报告不符合质控标准
      imgCommon: [], // 报告客观原因
      imgObject: [], // 报告不符合质控标准

      checkedList1: [], // 报告互认
      indeterminate1: false,
      checkAll1: false,

      checkedList2: [], // 影像互认
      indeterminate2: false,
      checkAll2: false,

      indeterminate3: false,
      checkAll3: false,
      checkedList3: [], // 影像互认

      indeterminate4: false,
      checkAll4: false,
      checkedList4: [], // 影像互认
      
      reportRadioValue: 0, // 报告互认单选框
      imageRadioValue: 0, // 影像互认单选框
      isShowTip1: false, // 是否展示互认意见
      isShowTip2: false, // 是否展示影像意见
      btnDisabled: false, // 判断按钮是否置灰不可点击
      // 申请单信息
      applyInfo: [
        // {
        //   patient_name: '', // 患者姓名
        //   hospital_name: '', // 医院名称
        //   modality: '', // 检查类型
        //   patient_id_card: '', // 身份证号
        //   visit_departments: '', // 就诊科室
        //   study_body_part: '', // 检查部位
        //   patient_age: '', // 年龄
        //   patient_sex: '', // 性别
        //   first_clinical_diagnosis: ''
        // }
      ],
      // 报告信息
      reportInfo: [
        // {
        //   report_date: '', // 报告时间
        //   is_hr: '', // 开放互认
        //   report_doctor: '', // 报告医师
        //   report_approver: '', // 审核医师
        //   report_diagnoses: '', // 检查所见
        //   chief_complaint: '' // 病史描述
        // }
      ],
      // 影像信息
      imageInfo: [
        // {
        //   study_request_time: '' // 检查时间
        // }
      ]
    }
  },
  created() {
    // console.log(this.$store.getters.tabPane)
    // this.queryDetail()
    // this.queryApprove()
    // this.clearTabPane()
  },
  mounted() {
    // this.getDdfData()
    // console.log('store.tabPane',this.$store.getters.tabPane)
    // console.log(1)
  },
  watch: {
    $route(route) {
      console.log('watch id', route.query.id)
    }
  },
  // updated() {
  //   console.log(this.study_id)
  // },
  // mounted() {
  // },
  activated() {
    // console.log('detail activated')
    // console.log('detail tabPane',this.$store.getters.tabPane)
    // this.study_id = this.$route.query.id
    // this.queryDetail()
    // 重置右侧
    // this.resetData()
    // this.queryApprove()
  },
  methods: {
    // 用于清空vuex中的tabpane
    // clearTabPane() {
    //   const arr = [
    //     {
    //       text: '查询列表',
    //       key: 'home/index'
    //     }
    //   ]
    //   this.$store.dispatch('DeleteTabPane', arr)
    // },
    // 重置右侧数据
    resetData() {
      Object.assign(this, {
        checkedList1: [], // 报告互认
        indeterminate1: false,
        checkAll1: false,

        checkedList2: [], // 影像互认
        indeterminate2: false,
        checkAll2: false,

        indeterminate3: false,
        checkAll3: false,
        checkedList3: [], // 影像互认

        indeterminate4: false,
        checkAll4: false,
        checkedList4: [], // 影像互认
        
        reportRadioValue: 0, // 报告互认单选框
        imageRadioValue: 0, // 影像互认单选框
        isShowTip1: false, // 是否展示互认意见
        isShowTip2: false,
      })
    },
    // 查询互认清单
    async queryApprove() {
      const { data = {} } = await queryApproveList()
      const { img, report } = data && data
      this.reportCommon = jsonTransfer(report && report.common)
      this.reportObject = jsonTransfer(report && report.object)
      this.imgCommon = jsonTransfer(img && img.common)
      this.imgObject = jsonTransfer(img && img.object)
    },
    // 弹出提示
    backTip() {
      const self = this
      if (!this.btnDisabled) { // 如果没进行互认操作
        this.$confirm({
          title: '提示',
          content: h => `当前页面有${!(self.reportRadioValue || self.imageRadioValue) ? '未完成' : '未提交' }的互认评价，是否确定退出？`,
          icon: h => <a-icon type="exclamation-circle" />,
          onOk () {
            self.$router.push({
              path: '/home/index'
            })
          },
          onCancel() {},
          class: 'test',
        })
      } else {
        self.$router.push({
          path: '/home/index'
        })
      }
    },
    // 处理提交
    async handleSubmit() {
      const { 
        reportRadioValue, // 报告互认单选按钮值
        imageRadioValue, // 影像互认单选按钮值
        checkedList1, // 报告互认-客观原因勾选项
        checkedList2, // 报告互认-不符合质控标准勾选项
        checkedList3, // 影像互认-客观原因勾选项
        checkedList4 // 影像互认-不符合质控标准勾选项
      } = this
      if (imageRadioValue && reportRadioValue) { // 两个都有值
        if (reportRadioValue === '2') {
          if (imageRadioValue === '2') { // 只需判断为2时
            this.isShowTip2 = (!checkedList3.length && !checkedList4.length) ? true : false
          }
          this.isShowTip1 = (!checkedList1.length && !checkedList2.length) ? true : false
        } else if (imageRadioValue === '2') {
          if (reportRadioValue === '2') {
            this.isShowTip1 = (!checkedList1.length && !checkedList2.length) ? true : false
          }
          this.isShowTip2 = (!checkedList3.length && !checkedList4.length) ? true : false
        }
        if ((this.isShowTip1 && this.isShowTip2) || (this.isShowTip1 || this.isShowTip2)) return
      } else { // 如果两个中其中一个有值或者两个都没得值
        if (!reportRadioValue && !imageRadioValue) { // 若两个都没选都是初始值0的话，给出提示
          return this.isShowTip1 = this.isShowTip2 = true
        } else { // 如果其中一个有值
          if (reportRadioValue || imageRadioValue) {
            this.isShowTip1 = this.isShowTip2 = false
          }
        }
      }
      // 将数组转化为已逗号隔开的字符串
      const arrStr1 = arrTransferStr(this.checkedList1)
      const arrStr2 = arrTransferStr(this.checkedList2)
      const arrStr3 = arrTransferStr(this.checkedList3)
      const arrStr4 = arrTransferStr(this.checkedList4)
      const obj = {
        ris_exam_id: this.study_id,
        is_recognition_image: this.imageRadioValue || '',
        response_for_image: arrStr3 || 0,
        remark_for_image: arrStr4 || 0,
        is_recognition_report: this.reportRadioValue || '',
        response_for_report: arrStr1 || 0,
        remark_for_report: arrStr2 || 0
      }
      const formData = postNormalData(obj)
      this.pageLoading = true
      const { code = '' } = await submitApproveList(formData)
      if (code === 200) { // 如果成功，刷新详情页
        if (imageRadioValue && reportRadioValue) { // 如果两个都有值
          this.reportRadioDisabled = true // 报告互认禁用
          this.imageRadioDisabled = true // 影像互认禁用
        } else {
          if (reportRadioValue || imageRadioValue) {
            if (reportRadioValue && !imageRadioValue) {
              this.reportRadioDisabled = true // 报告互认禁用
              this.imageRadioDisabled = false // 影像互认禁用
            } else if (imageRadioValue && !reportRadioValue) {
              this.reportRadioDisabled = false // 报告互认禁用
              this.imageRadioDisabled = true // 影像互认禁用
            }
          }
        }
        this.$message.success({
          content: '提交成功',
          duration: 2
        })
        this.queryDetail()
      }
      this.pageLoading = false
    },
    // 影像radio Change
    imageRadioChange(e) {
      this.isShowTip2 = false // 影像互认提示语
      this.imageRadioValue = e.target.value
      if (this.imageRadioValue === '1') { // 如果是互认
        Object.assign(this, {
          checkedList3: [],
          indeterminate3: false,
          checkAll3: false,
          checkedList4: [],
          indeterminate4: false,
          checkAll4: false
        })
      }
    },
    // 报告radio按钮
    reportRadioChange(e) {
      this.isShowTip1 = false // 报告互认提示语
      this.reportRadioValue = e.target.value
       if (this.reportRadioValue === '1') { // 如果是互认
        Object.assign(this, {
          checkedList1: [],
          indeterminate1: false,
          checkAll1: false,
          checkedList2: [],
          indeterminate2: false,
          checkAll2: false
        })
      }
    },
    // 报告互认-客观原因勾选不是全部时
    onChange1(checkedList) {
      this.checkedList1 = checkedList
      this.indeterminate1 = !!checkedList.length && checkedList.length < this.reportCommon.length
      this.checkAll1 = checkedList.length === this.reportCommon.length
      this.isShowTip1 = (!this.checkedList1.length && !this.checkedList2.length) ? true : false
    },
    // 报告互认-客观原因勾选全部
    onCheckAllChange1(e) {
      const arr = this.reportCommon.map(item => item && item.key)
      Object.assign(this, {
        checkedList1: e.target.checked ? arr : [],
        indeterminate1: false,
        checkAll1: e.target.checked
      })
      this.isShowTip1 = (!this.checkedList1.length && !this.checkedList2.length) ? true : false
    },
    // 报告互认-不符合质控标准勾选
    onChange2(checkedList) {
      this.checkedList2 = checkedList
      this.indeterminate2 = !!checkedList.length && checkedList.length < this.reportObject.length
      this.checkAll2 = checkedList.length === this.reportObject.length
      this.isShowTip1 = (!this.checkedList1.length && !this.checkedList2.length) ? true : false
    },
    // 报告互认-不符合质控标准全勾选
    onCheckAllChange2(e) {
      const arr = this.reportObject.map(item => item && item.key)
      Object.assign(this, {
        checkedList2: e.target.checked ? arr : [],
        indeterminate2: false,
        checkAll2: e.target.checked
      })
      this.isShowTip1 = (!this.checkedList1.length && !this.checkedList2.length) ? true : false
    },
    // 影像互认-客观原因勾选不是全部时
    onChange3(checkedList) {
      this.checkedList3 = checkedList
      this.indeterminate3 = !!checkedList.length && checkedList.length < this.imgCommon.length
      this.checkAll3 = checkedList.length === this.imgCommon.length
      this.isShowTip2 = (!this.checkedList3.length && !this.checkedList4.length) ? true : false
    },
    // 影像互认-客观原因勾选全部时
    onCheckAllChange3(e) {
      const arr = this.imgCommon.map(item => item && item.key)
      Object.assign(this, {
        checkedList3: e.target.checked ? arr : [],
        indeterminate3: false,
        checkAll3: e.target.checked
      })
      this.isShowTip2 = (!this.checkedList3.length && !this.checkedList4.length) ? true : false
    },
    // 影像互认-不符合质控标准勾选不是全部时
    onChange4(checkedList) {
      this.checkedList4 = checkedList
      this.indeterminate4 = !!checkedList.length && checkedList.length < this.imgObject.length
      this.checkAll4 = checkedList.length === this.imgObject.length
      this.isShowTip2 = (!this.checkedList3.length && !this.checkedList4.length) ? true : false
    },
    // 影像互认-不符合质控标准勾选全部时
    onCheckAllChange4(e) {
      const arr = this.imgObject.map(item => item && item.key)
      Object.assign(this, {
        checkedList4: e.target.checked ? arr : [],
        indeterminate4: false,
        checkAll4: e.target.checked
      })
      this.isShowTip2 = (!this.checkedList3.length && !this.checkedList4.length) ? true : false
    },
    // 确定退出
    handleOk2() {
      this.$router.push({
        path: '/home/index'
      })
    },
    // // 退出弹窗
    // handleCancel2() {
    //   this.visible2 = false
    // },
    // 查看影像
    viewImage() {
      // window.open(`http://10.229.2.184/feitu/dimage/index.html?accessionNumber=${this.record_num}&hsCode=${this.hospital_code}&date=${this.study_date}&noPreview=1`)
      window.open(`${location.origin}/feitu/dimage/index.html?accessionNumber=${this.record_num}&hsCode=${this.hospital_code}&date=${this.study_date}&noPreview=1`)
    },
    // 查询接口
    async queryDetail() {
      const { data = {} } = await queryImageDetail({
        study_id: this.study_id
      })
      const {
        patient_name,
        hospital_name,
        modality,
        patient_id_card,
        visit_departments,
        study_body_part,
        patient_age,
        patient_sex,
        first_clinical_diagnosis,
        accession_number, // 申请单号
        study_date, // 申请时间
        study_doctor, // 申请医师
        report_date, // 报告时间
        is_hr, // 开放互认
        report_doctor, // 报告医师
        report_approver, // 审核医师
        report_diagnoses, // 检查所见
        image_performance, // 申请信息病史描述
        chief_complaint, // 病史描述
        study_request_time, // 检查时间
        has_hr, // 是否操作过该条数据的互认，已经操作过过1，未操作过为0
        study_request_no, // 申请单号
        if_dicom_upload, // 是否上传影像
        image_hr, // 影像互认
        report_hr, // 报告互认
        response_for_report, // 报告互认-客观原因
        remark_for_report, // 报告互认-不符合质控标准
        remark_for_image, // 影像互认-不符合质控标准
        response_for_image, // 影像互认-客观原因
        record_num, // 报告号 展示报告是否有无
        hospital_code
      } = data && data
      // 申请信息
      const applyInfoObj = {
        patient_name,
        hospital_name,
        modality,
        patient_id_card,
        visit_departments, // 就诊科室
        study_body_part, // 检查部位
        patient_age, // 年龄
        patient_sex, // 性别
        first_clinical_diagnosis,
        accession_number,
        study_date,
        study_doctor,
        image_performance,
        study_request_no,
        study_request_time
      }
      // 报告信息
      const reportInfoObj = {
        report_date,
        is_hr,
        report_doctor, // 报告医师
        report_approver, // 审核医师
        report_diagnoses, // 检查所见
        chief_complaint // 病史描述
      }
      // 影像信息
      const imageInfoObj = {
        study_request_time
      }
      const arr1 = [ { ...applyInfoObj } ]
      const arr2 = [ { ...reportInfoObj } ]
      const arr3 = [ { ...imageInfoObj } ]
      // const { applyInfo, reportInfo, imageInfo } = this
      this.applyInfo = arr1
      this.reportInfo = arr2
      this.imageInfo = arr3
      this.has_hr = has_hr
      this.if_dicom_upload = if_dicom_upload
      this.reportRadioValue = report_hr
      this.imageRadioValue = image_hr
      this.record_num = record_num
      this.hospital_code = hospital_code
      this.study_date = study_date
      this.study_request_time = study_request_timeresetData
      if (this.has_hr === '1') { // 如果都操作过
        this.imageRadioDisabled = (image_hr === '0' || !image_hr) ? false : true
        this.reportRadioDisabled = (report_hr === '0' || !report_hr) ? false : true
        this.btnDisabled = this.reportRadioDisabled && this.imageRadioDisabled ? true : false
        if (!this.imageRadioDisabled) { // 如果为false,说明放开操作
          Object.assign(this, {
            indeterminate3: false,
            checkAll3: false,
            checkedList3: [], // 影像互认

            indeterminate4: false,
            checkAll4: false,
            checkedList4: [], // 影像互认
            isShowTip2: false
          })
        } else { // 如果操作被禁用
          // console.log(strToArr(remark_for_image).length)
          Object.assign(this, {
            checkedList3: strToArr(response_for_image) || [],
            indeterminate3: (strToArr(response_for_image).length && strToArr(response_for_image).length !== this.imgCommon.length) ? true : false,
            checkedList4: strToArr(remark_for_image) || [],
            indeterminate4: (strToArr(remark_for_image).length && strToArr(remark_for_image).length !== this.imgObject.length) ? true : false,
            checkAll3: strToArr(response_for_image).length === this.imgCommon.length ? true : false,
            checkAll4: strToArr(remark_for_image).length === this.imgObject.length ? true : false,
            isShowTip2: false
          })
        }
        if (!this.reportRadioDisabled) { // 如果为false,说明放开
          Object.assign(this, {
            indeterminate1: false,
            checkAll1: false,
            checkedList1: [], // 影像互认

            indeterminate2: false,
            checkAll2: false,
            checkedList2: [], // 影像互认
            isShowTip1: false
          })
        } else {
          // console.log(strToArr(response_for_report).length === this.reportCommon.length)
          // console.log(strToArr(remark_for_report).length === this.reportObject.length)
          Object.assign(this, {
            checkedList1: strToArr(response_for_report) || [],
            indeterminate1: (strToArr(response_for_report).length && strToArr(response_for_report).length !== this.reportCommon.length) ? true : false,
            checkedList2: strToArr(remark_for_report) || [],
            indeterminate2: (strToArr(remark_for_report).length && strToArr(remark_for_report).length !== this.reportObject.length) ? true : false,
            checkAll1: strToArr(response_for_report).length === this.reportCommon.length ? true : false,
            checkAll2: strToArr(remark_for_report).length === this.reportObject.length ? true : false,
            isShowTip1: false
          })
        }
      } else { // 如果没操作过
        this.reportRadioDisabled = false
        this.imageRadioDisabled = false
        this.btnDisabled = false
        this.resetData() // 重置数据
      }
      // console.log(this.reportRadioDisabled, this.imageRadioDisabled)
      // console.log(data)
    },
    // 取消弹窗
    handleCancel() {
      // console.log(1)
      this.visible = false
    }
  },
}
</script>

<style lang="less" scoped>
@import url('./style/index.less');
</style>

<style lang="less">
.ant-modal-root{
  .title{
    color: #333;
  }
  .value{
    color: #666;
  }
  .ant-row{
    margin-bottom: 20px;
  }
}
</style>
