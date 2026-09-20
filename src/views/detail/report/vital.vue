<template>
  <div class="image-detail">
    <div class="left">
      <div class="report-info">
        <a-card :bordered="false" :loading="cardLoading">
          <div slot="title" class="header-title">
            <span>穿戴设备监测报告</span>
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
                      <p>{{ report.device }}</p>
                      <p>穿戴设备监测报告</p>
                    </a-col>
                    <a-col :sm="smCol" :md="mdCol" :xl="6"></a-col>
                  </a-row>
                  <!-- 监测基本信息 -->
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
                  <!-- 监测概述 / 关键指标 -->
                  <div class="present">
                    <div class="suggestion">
                      <span class="title">监测概述</span>
                      <p style="word-break: break-all;">{{ report.summary || '-' }}</p>
                    </div>
                    <div class="suggestion mr40">
                      <span class="title">关键指标</span>
                      <table class="bp-table">
                        <thead>
                          <tr>
                            <th>指标</th>
                            <th style="width: 110px">结果</th>
                            <th style="width: 100px">单位</th>
                            <th style="width: 130px">参考范围</th>
                            <th style="width: 90px">提示</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in metrics" :key="index">
                            <td>{{ item.label || '-' }}</td>
                            <td class="bp-main" :class="flagClass(item)">{{ item.value || '-' }}</td>
                            <td>{{ item.unit || '-' }}</td>
                            <td>{{ item.range || '-' }}</td>
                            <td :class="flagClass(item)">{{ item.hint || '正常' }}</td>
                          </tr>
                          <tr v-if="!metrics.length">
                            <td colspan="5">暂无指标</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <!-- 底部信息 -->
                  <div class="footer">
                    <div class="doctor">
                      <div>
                        <span class="title">设备厂商：</span>
                        <span>{{ report.deviceVendor || '-' }}</span>
                      </div>
                      <div class="name">
                        <span class="title">数据来源：</span>
                        <span>{{ report.source || '-' }}</span>
                      </div>
                    </div>
                    <div class="doctor mb24">
                      <div>
                        <span class="title">报告编号：</span>
                        <span>{{ report.reportNo || '-' }}</span>
                      </div>
                      <div class="name">
                        <span class="title">报告日期：</span>
                        <span>{{ report.monitorDate || '-' }}</span>
                      </div>
                    </div>
                    <p class="tip">*本报告由穿戴设备自动采集生成，仅供健康管理参考</p>
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
import { getVitalDetail } from '@/api/vital'

export default {
  name: 'vitalReportDetail',
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
          { title: '姓名', value: r.name },
          { title: '监测项目', value: r.title },
          { title: '报告编号', value: r.reportNo }
        ],
        [
          { title: '设备类型', value: r.device },
          { title: '数据来源', value: r.source },
          { title: '监测日期', value: r.monitorDate ? `${r.monitorDate} ${r.monitorTime || ''}`.trim() : '' }
        ]
      ]
    },
    metrics() {
      return this.report.metrics || []
    }
  },
  methods: {
    // 异常指标标红，达标指标标绿，其余保持默认
    flagClass(item) {
      if (item.flag === 'up') return 'bp-up'
      if (item.flag === 'good') return 'bp-good'
      return ''
    },
    async getVitalDetail() {
      const { id } = this.$route.query
      const { data } = await getVitalDetail({ id })
      this.report = data || {}
      this.cardLoading = false
    }
  },
  created() {
    this.getVitalDetail()
  }
}
</script>

<style scoped lang="less">
@import url('../style/index.less');

/deep/ .bp-table {
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #e3e3e3;
    padding: 10px 12px;
    text-align: left;
    font-size: 15px;
  }
  th {
    background: #f5f7fa;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
  }
  td {
    color: rgba(0, 0, 0, 0.65);
  }
  td.bp-main {
    font-weight: 700;
    color: #333;
  }
  .bp-up {
    color: #cf1322;
  }
  .bp-good {
    color: #389e0d;
  }
}
</style>
