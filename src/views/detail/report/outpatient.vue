<template>
  <div class="image-detail">
    <div class="left">
      <div class="report-info">
        <a-card :bordered="false" :loading="cardLoading">
          <div slot="title" class="header-title">
            <span>门诊病历详情</span>
          </div>
          <div class="card-contnet" style="user-select: none;">
            <a-row class="card-content-row" style="display: flex; justify-content: center;">
              <a-col :sm="smCol" :md="17" :xl="18" class="card-content-col" :style="styleColLeft">
                <div v-watermark="watermarkConfig" class="water-mark">
                  <a-row class="header">
                    <a-col class="logo" :sm="smCol" :md="mdCol" :xl="4">
                      <div>
                        <span style="font-weight:bold;">患者主ID：</span>
                        <span class="title">{{ report.systemPatientId || '-' }}</span>
                      </div>
                    </a-col>
                    <a-col class="bigTitle" :sm="smCol" :md="mdCol" :xl="14">
                      <p>{{ report.organName }}</p>
                      <p>门诊病历记录</p>
                    </a-col>
                    <a-col :sm="smCol" :md="mdCol" :xl="6"></a-col>
                  </a-row>
                  <!-- 就诊信息 -->
                  <div class="info">
                    <a-row
                      v-for="(row, rIdx) in infoRows"
                      :key="rIdx"
                      :class="{ 'last-row': rIdx === infoRows.length - 1 }"
                    >
                      <a-col
                        v-for="item in row"
                        :key="item.title"
                        :sm="smCol"
                        :md="mdCol"
                        :xl="xlCol"
                        class="text-ellpisis"
                      >
                        <span class="title">{{ item.title }}：</span>
                        <a-tooltip placement="top">
                          <template slot="title"><span>{{ item.value || '-' }}</span></template>
                          <span>{{ item.value || '-' }}</span>
                        </a-tooltip>
                      </a-col>
                    </a-row>
                  </div>
                  <!-- 病历正文 -->
                  <div class="present">
                    <div
                      v-for="(item, index) in sectionList"
                      :key="index"
                      class="suggestion"
                      :class="{ mr40: index !== 0 }"
                    >
                      <span class="title">{{ item.title }}</span>
                      <p style="word-break: break-all;">{{ item.content || '-' }}</p>
                    </div>
                  </div>
                  <!-- 底部信息 -->
                  <div class="footer">
                    <div class="doctor">
                      <div>
                        <span class="title">接诊医师：</span>
                        <span>{{ report.doctor || '-' }}</span>
                      </div>
                      <div class="name">
                        <span class="title">记录医师：</span>
                        <span>{{ report.recordDoc || '-' }}</span>
                      </div>
                    </div>
                    <div class="doctor mb24">
                      <div>
                        <span class="title">审核医师：</span>
                        <span>{{ report.rvName || '-' }}</span>
                      </div>
                      <div class="name">
                        <span class="title">记录时间：</span>
                        <span>{{ report.recordDt || '-' }}</span>
                      </div>
                    </div>
                    <p class="tip">*本病历仅作临床参考</p>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import '@/utils/directive'
import { getOutpatientDetail } from '@/api/outpatient'

export default {
  name: 'outpatientReportDetail',
  data() {
    return {
      smCol: 24,
      mdCol: 8,
      xlCol: 8,
      report: {},
      cardLoading: true,
      styleColLeft: {
        marginTop: '24px',
        padding: '53px 36px',
        border: '1px solid #E3E3E3',
        borderRadius: '2px',
        fontSize: '16px',
        background: '#FCFCFC'
      },
      watermarkConfig: {
        text: '',
        font: '16px Vedana',
        textColor: '#e0e9f8',
        width: 330,
        height: 150,
        textRotate: -30
      }
    }
  },
  computed: {
    infoRows() {
      const r = this.report
      return [
        [
          { title: '患者姓名', value: r.name },
          { title: '年龄/性别', value: r.sexAge },
          { title: '就诊科室', value: r.appDptName }
        ],
        [
          { title: '就诊类别', value: r.visitType },
          { title: '接诊医师', value: r.doctor },
          { title: '门诊号', value: r.visitId }
        ],
        [
          { title: '就诊日期', value: r.visitDate },
          { title: '就诊时间', value: r.visitTime },
          { title: '病历号', value: r.emrNo }
        ],
        [{ title: '门诊诊断', value: r.diag }]
      ]
    },
    sectionList() {
      return this.report.sections || []
    }
  },
  methods: {
    async getOutpatientDetail() {
      const { id, organCode } = this.$route.query
      const { data } = await getOutpatientDetail({ visitId: id, organCode })
      this.report = data || {}
      this.cardLoading = false
    }
  },
  created() {
    this.getOutpatientDetail()
  }
}
</script>

<style scoped lang="less">
@import url('../style/index.less');
</style>
