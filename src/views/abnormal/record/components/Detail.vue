<template>
  <a-drawer
    title="查看详情"
    placement="right"
    :visible="visible"
    width="688px"
    :after-visible-change="afterVisibleChange"
    @close="onClose"
  >
    <a-skeleton v-if="pageLoading" />
    <template v-else>
      <c-title title="反馈基本信息" />
      <a-descriptions :column="2" class="des_list">
        <a-descriptions-item label="反馈医生"> {{ resultData.doc_name || emptyTxt }} </a-descriptions-item>
        <a-descriptions-item label="反馈医生所在机构">
          {{ resultData.doc_hospital_name || emptyTxt }}
        </a-descriptions-item>
        <a-descriptions-item label="联系方式"> {{ resultData.contact_phone || emptyTxt }} </a-descriptions-item>
      </a-descriptions>
      <a-divider />
      <c-title title="反馈内容" />
      <a-descriptions :column="2" class="des_list">
        <a-descriptions-item label="反馈类型">
          {{ getTypeName(resultData.issue_type) || emptyTxt }}
        </a-descriptions-item>
        <template v-if="resultData.issue_type !== 'other-problem-feedback'">
          <a-descriptions-item label="患者姓名"> {{ resultData.patient_name || emptyTxt }} </a-descriptions-item>
          <a-descriptions-item label="患者证件号"> {{ resultData.cardno || emptyTxt }} </a-descriptions-item>
          <a-descriptions-item label="检查设备类型"> {{ resultData.modality || emptyTxt }} </a-descriptions-item>
          <a-descriptions-item label="检查项目名称"> {{ resultData.proj_name || emptyTxt }} </a-descriptions-item>
          <a-descriptions-item label="检查医院"> {{ resultData.hospital_name || emptyTxt }} </a-descriptions-item>
          <a-descriptions-item label="检查时间" :span="2"> {{ resultData.chk_dt || emptyTxt }} </a-descriptions-item>
          <a-descriptions-item label="异常问题" :span="2">
            <span class="error">{{ resultData.issue_content || emptyTxt }} </span>
          </a-descriptions-item>
        </template>
        <a-descriptions-item label="异常描述" :span="2">
          {{ resultData.issue_description || emptyTxt }}
        </a-descriptions-item>
        <a-descriptions-item label="附件" :span="2">
          <a href="javascript:void(0)" v-if="resultData.attachments" @click="downloadFile">
            {{ resultData.attachments | fileFilter }}</a
          >
          <span v-else>{{ emptyTxt }}</span>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider />
      <c-title title="处理信息" />
      <a-descriptions :column="1" class="des_list">
        <a-descriptions-item label="处理状态">
          <span v-if="!status[resultData.process_status]">{{ emptyTxt }}</span>
          <span v-else :style="{ color: status[resultData.process_status][1] }">{{
            status[resultData.process_status][0]
          }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="异常回复" v-if="resultData.process_status === 'FINISHED'">
          <span class="error">{{ resultData.process_reply || emptyTxt }} </span>
        </a-descriptions-item>
      </a-descriptions>
    </template>
  </a-drawer>
</template>
<script>
import CTitle from '@/components/CTitle'
import { queryFeedbackById } from '@/api/abnormal'
import { feedbackType } from '@/enum'
export default {
  components: {
    CTitle,
  },
  data() {
    return {
      status: {
        RUNNING: ['处理中', '#1890ff'],
        FINISHED: ['已完成', '#52c41a'],
        REVOKED: ['已取消', '#f5222d'],
      },
      visible: false,
      resultData: null,
      emptyTxt: '--',
      pageLoading: false,
    }
  },
  filters: {
    fileFilter(val) {
      console.log(val, 'val')
      if (!val) return ''
      const _val = val.split('?')[0].split('/')
      console.log(_val[_val.length - 1], '_val[_val.length - 1]')
      return _val[_val.length - 1]
    },
  },
  methods: {
    getTypeName(val) {
      const itemArr = feedbackType.filter((v) => v.key === val)
      if (!itemArr || !itemArr.length) return ''
      return itemArr[0].name
    },
    show(sn) {
      this.visible = true
      this.getDetail(sn)
    },
    downloadFile() {
      window.open(this.resultData.attachments)
    },
    getDetail(sn) {
      this.pageLoading = true
      queryFeedbackById({
        sn,
      })
        .then((res) => {
          if (res.code === 200) {
            this.resultData = res.data
          }
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    afterVisibleChange(val) {
      console.log('visible', val)
    },
    onClose() {
      this.visible = false
    },
  },
}
</script>
<style lang="less" scoped>
@import '~ant-design-vue/lib/style/themes/index.less';
.primary {
  color: @primary-color;
}

.error {
  color: #e0241b;
}
// @primary-color: #1890ff; // 全局主色
// @link-color: #1890ff; // 链接色
// @success-color: #52c41a; // 成功色
// @warning-color: #faad14; // 警告色
// @error-color: #f5222d; // 错误色
</style>
