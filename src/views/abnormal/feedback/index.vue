<template>
  <a-card style="margin: 24px 0">
    <div class="form-main">
      <c-title title="反馈基本信息" />
      <a-form-model
        ref="basicForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        class="rule_form"
      >
        <a-form-model-item label="反馈医生姓名" class="rule_info_item">
          <span>{{ userInfo.user_name }}</span>
        </a-form-model-item>
        <a-form-model-item label="反馈医生所在机构" class="rule_info_item">
          <span>{{ hospitalName }}</span>
        </a-form-model-item>
        <a-form-model-item label="联系方式" prop="contact_phone">
          <a-input v-model.trim="form.contact_phone" placeholder="请输入手机号码" :max-length="11" allowClear />
        </a-form-model-item>
      </a-form-model>

      <c-title title="反馈内容" />
      <a-form-model
        ref="contentForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        class="rule_form"
      >
        <a-form-model-item label="反馈类型">
          <a-select v-model="form.issue_type" placeholder="请选择反馈类型" @change="changeType">
            <a-select-option :value="item.key" v-for="item in feedbackType" :key="item.key">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <div class="tip">
            <span>注：</span>非检查类数据问题可以选择其他类进行反馈
          </div>
        </a-form-model-item>
        <template v-if="form.issue_type !== 'other-problem-feedback'">
          <a-form-model-item label="患者姓名" prop="patient_name">
            <!-- 1、用户直接填写，2、从其他页面直接带入  -->
            <!-- <span>{{ hospitalName }}</span> -->
            <a-input v-model.trim="form.patient_name" placeholder="请输入异常数据的患者姓名，例如：张三" :max-length="50" allowClear />
          </a-form-model-item>
          <a-form-model-item label="患者证件号" prop="cardno">
            <a-input v-model.trim="form.cardno" placeholder="请输入异常数据的患者证件号，例如：身份证号" :max-length="18" allowClear />
          </a-form-model-item>
          <a-form-model-item label="检查设备类型" prop="modality">
            <a-input v-model.trim="form.modality" placeholder="请输入异常数据的检查设备类型，例如：CT" :max-length="20" allowClear />
          </a-form-model-item>
          <a-form-model-item label="检查项目名称" prop="proj_name">
            <a-input v-model.trim="form.proj_name" placeholder="请输入异常数据的检查项目名称，例如：胸部CT平扫" :max-length="100" allowClear />
          </a-form-model-item>
          <a-form-model-item label="检查医院" prop="hospital_name">
            <a-input v-model.trim="form.hospital_name" placeholder="请输入异常数据的检查医院，例如：儿童医院" :max-length="100" allowClear />
          </a-form-model-item>
          <a-form-model-item label="检查时间" prop="chk_dt">
            <a-date-picker
              v-model="form.chk_dt"
              placeholder="请选择检查时间"
              style="width: 100%"
              format="YYYY-MM-DD"
              :valueFormat="valueFormat"
              @change="dtChange"
            />
          </a-form-model-item>
          <a-form-model-item label="异常问题" prop="issue_content">
            <!-- 根据反馈类型从工单系统中获取供用户选择 -->
            <a-select v-model="form.issue_content" placeholder="请选择异常问题">
              <a-select-option :value="item.name" v-for="item in issueContentOptions" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </template>

        <a-form-model-item
          label="异常描述"
          prop="issue_description"
          v-if="form.issue_type === 'other-problem-feedback'"
        >
          <c-text-area
            v-model.trim="form.issue_description"
            placeholder="请填写异常详情：例如2023年1月1日在儿童医院做的胸部CT平扫查询不到"
            :max-length="100"
            allowClear
            :len="100"
          />
        </a-form-model-item>
        <a-form-model-item label="异常描述" v-if="form.issue_type !== 'other-problem-feedback'">
          <c-text-area
            v-model.trim="form.issue_description"
            placeholder="请填写异常详情：例如报告年龄显示错误"
            :max-length="100"
            allowClear
            :len="100"
          />
        </a-form-model-item>
        <a-form-model-item label="附件">
          <a-upload-dragger
            name="file"
            :multiple="false"
            :action="actionUrl"
            :file-list="fileList"
            @change="handleChange"
            accept="image/jpeg,image/png"
            :before-upload="beforeUpload"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
            <p class="ant-upload-hint">请上传1M以下的jpg或者png图片文件</p>
          </a-upload-dragger>
        </a-form-model-item>
        <a-form-model-item class="rule_info_item" :wrapperCol="{ span: 15, offset: 7 }">
          <div>
            <a-button type="primary" @click="submitForm" :loading="loading"> 提交 </a-button>
          </div>
        </a-form-model-item>
      </a-form-model>
    </div>
  </a-card>
</template>
<script>
import CTitle from '@/components/CTitle'
import { rules } from './config/rulesConfig'
import { feedbackType } from '@/enum'
import CTextArea from '@/components/CTextArea'

import { feedbackEnum, createFeedback, uploadFile } from '@/api/abnormal'
export default {
  components: {
    CTitle,
    CTextArea,
  },
  data() {
    return {
      valueFormat: 'YYYY-MM-DD',
      form: {
        // issue_type: feedbackType[0].key,
        // attachments: '', // 文件
      },
      loading: false,
      fileList: [],
      rules,
      issueContentOptions: [],
      feedbackType,
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
      enumObj: {},
      actionUrl: window.CONFIG.apiRoot + '/feedback/upload',
    }
  },
  created() {
    this.getEnum()
    const _query = this.$route.query || {}

    !_query.issue_type && (_query.issue_type = feedbackType[0].key)
    this.form = {
      ..._query,
    }

    if (_query.chk_dt) this.valueFormat = 'YYYY-MM-DD HH:mm:ss'
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    hospitalName() {
      return this.$store.getters.hospitalName
    },
  },
  watch: {
    'form.issue_type': {
      handler(val) {
        this.setContentOptions(val)
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      this.form = {
        issue_type: feedbackType[0].key,
      }
      this.fileList = []
    },
    changeType(){
      // console.log(12312)
      this.$refs.contentForm.clearValidate()
    },
    dtChange(val) {
      this.valueFormat = 'YYYY-MM-DD'
    },
    setContentOptions(val) {
      this.$set(this.form, 'issue_content', undefined)
      if (val === 'report-problem-feedback') {
        this.issueContentOptions = this.enumObj.report
      } else if (val === 'image-problem-feedback') {
        this.issueContentOptions = this.enumObj.image
      } else
        this.issueContentOptions = [
          {
            id: '0001',
            key: 'other',
            name: '其他',
          },
        ]
    },
    handleChange(info) {
      const status = info.file.status
      const response = info.file.response
      if (!!status) this.fileList = [info.file]
      else this.fileList = []

      if (status === 'removed') {
        this.fileList = []
        this.form.attachments = ''
      }
      if (status === 'done') {
        if (response.code === 200) {
          this.form.attachments = response.data || ''
        } else this.form.attachments = ''
      } else if (status === 'error') {
      }
    },
    // 获取异常问题枚举
    getEnum() {
      feedbackEnum().then((res) => {
        if (res.code === 200) {
          this.enumObj = res.data || {}
          this.setContentOptions(this.form.issue_type)
        }
      })
    },
    beforeUpload(file) {
      const isLt = file.size / 1024 / 1024 < 1
      const fileType = file?.name.split('.')
      const [suffix] = fileType.slice(-1)
      const _imgSuffix = ['png', 'jpg', 'jpeg']
      if (!_imgSuffix.includes(suffix)) {
        this.$message.error('请上传1M以下的jpg或者png图片文件!')
        return false
      }
      if (!isLt) {
        this.$message.error('请上传1M以下的jpg或者png图片文件!')
      }
      return !!isLt
    },

    submitForm() {
      this.$refs.basicForm.validate((valid) => {
        if (valid) {
          this.$refs.contentForm.validate((valide) => {
            if (valide) {
              this.createFeedback()
            }
          })
        }
      })
    },
    createFeedback() {
      // 请完善反馈的必要信息后再提交！
      this.loading = true
      const _data = {
        ...this.form,
        doc_name: this.userInfo?.user_name,
        doc_hospital_name: this.hospitalName,
        ris_study_id: this.form.ris_study_id ? this.form.ris_study_id : '-'
      }

      if (_data.issue_type === 'other-problem-feedback') {
        const _arr = ['patient_name', 'cardno', 'modality', 'proj_name', 'hospital_name', 'chk_dt', 'issue_content']
        _arr.map((v) => {
          _data[v] = '-'
        })
      }
      createFeedback(_data)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success({
              content: '提交成功，我们会抓紧异常排查，请保持联系方式畅通！',
              duration: 3,
            })
            this.init()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
<style lang="less" scoped>
.form-main {
  max-width: 830px;
  margin: auto;
}
/deep/.ant-form-item-children{
  position: relative;
}
.tip{
  font-size: 12px;
  position: absolute;
  line-height: 1;
  width: 300px;
  top: 46px;
}
</style>
