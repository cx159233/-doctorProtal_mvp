<template>
  <div class="image-detail">
    <div class="left">
      <div class="report-info">
        <a-card :bordered="false" :loading="cardLoading">
          <div slot="title" class="header-title">
            <span>病理检查报告</span>
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
                      <p>病理检查报告</p>
                    </a-col>
                    <a-col :sm="smCol" :md="mdCol" :xl="6"></a-col>
                  </a-row>
                  <!-- 送检信息 -->
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
                  <!-- 病理正文 -->
                  <div class="present">
                    <div
                      v-for="(item, index) in sectionList"
                      :key="item.title"
                      class="suggestion"
                      :class="{ mr40: index !== 0 }"
                    >
                      <span class="title">{{ item.title }}</span>
                      <!-- 诊断明细一个部位一条，逐行排；其余小节都是一段话 -->
                      <template v-if="item.lines">
                        <p
                          v-for="(line, lineIndex) in item.lines"
                          :key="lineIndex"
                          class="diag-item"
                        >{{ line }}</p>
                      </template>
                      <p v-else style="word-break: break-all;">{{ item.content }}</p>
                    </div>
                  </div>
                  <!-- 底部信息 -->
                  <div class="footer">
                    <div class="doctor">
                      <div>
                        <span class="title">报告医师：</span>
                        <span>{{ report.reportDoc || '-' }}</span>
                      </div>
                      <div class="name">
                        <span class="title">审核医师：</span>
                        <span>{{ report.rvDoc || '-' }}</span>
                      </div>
                    </div>
                    <div class="doctor mb24">
                      <div>
                        <span class="title">报告日期：</span>
                        <span>{{ report.reportDate || '-' }}</span>
                      </div>
                      <div class="name">
                        <span class="title">送检日期：</span>
                        <span>{{ report.sendDate || '-' }}</span>
                      </div>
                    </div>
                    <p class="tip">*本报告仅供临床参考，病理诊断以正式签发报告为准</p>
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
import { getPathologyDetail } from '@/api/pathology'

export default {
  name: 'pathologyReportDetail',
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
          { title: '性别', value: r.sex },
          { title: '年龄', value: r.age || r.age === 0 ? `${r.age}岁` : '' }
        ],
        [
          { title: '病理号', value: r.pathNo },
          { title: '门诊/住院号', value: r.visitNo },
          // 送检日期在底部已经有一份，这里放送检机构
          { title: '送检机构', value: r.sendOrgan }
        ],
        [
          { title: '送检科室', value: r.dept },
          { title: '送检医师', value: r.sendDoctor }
        ]
      ]
    },
    sectionList() {
      const r = this.report
      const diags = r.diags || []
      // 送检材料往往是多个部位一长串，放在上面的信息格里会被截断，挪到正文来
      // 没有内容的小节直接不渲染，不同病例的字段并不齐全
      return [
        { title: '送检材料', content: r.specimen },
        { title: '大体描述', content: r.gross },
        { title: `病理诊断明细（共 ${diags.length} 条）`, lines: diags },
        { title: '诊断意见及建议', content: r.advice },
        { title: '补充检测（免疫组化）', content: r.extra }
      ].filter((item) => (item.lines ? item.lines.length : item.content))
    }
  },
  methods: {
    async getPathologyDetail() {
      const { id } = this.$route.query
      const { data } = await getPathologyDetail({ id })
      this.report = data || {}
      this.cardLoading = false
    }
  },
  created() {
    this.getPathologyDetail()
  }
}
</script>

<style scoped lang="less">
@import url('../style/index.less');
/* 诊断明细同属一个小节，行距比小节间距小一档，才看得出是一组 */
.present .suggestion .diag-item {
  margin-top: 8px;
}
</style>
