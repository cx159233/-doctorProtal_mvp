<template>
  <div class="image-detail">
    <div class="left">
      <div class="report-info">
        <a-card :bordered="false" :loading="cardLoading">
          <div slot="title" class="header-title">
            <span>病案首页</span>
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
                      <p>住院病案首页</p>
                    </a-col>
                    <a-col :sm="smCol" :md="mdCol" :xl="6"></a-col>
                  </a-row>
                  <!-- 付费方式 / 住院次数 / 病案号 -->
                  <div class="meta-top">
                    <span>医疗付费方式：{{ report.payWay || '-' }}</span>
                    <span>{{ report.inTimes || '-' }}</span>
                    <span>病案号：{{ report.caseNo || '-' }}</span>
                  </div>
                  <!-- 基本信息 + 入出院信息 -->
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
                        :xl="item.span || xlCol"
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
                  <!-- 诊断 / 手术 / 出院情况 -->
                  <div class="present">
                    <div class="suggestion">
                      <span class="title">诊断信息</span>
                      <table class="bp-table">
                        <thead>
                          <tr>
                            <th style="width: 120px">类别</th>
                            <th>疾病诊断</th>
                            <th style="width: 170px">疾病编码（ICD-10）</th>
                            <th style="width: 100px">入院病情</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>主要诊断</td>
                            <td class="bp-main">{{ mainDiag.name || '-' }}</td>
                            <td>{{ mainDiag.icd || '-' }}</td>
                            <td>有</td>
                          </tr>
                          <tr v-for="(item, index) in otherDiags" :key="index">
                            <td>其他诊断</td>
                            <td>{{ item.name || '-' }}</td>
                            <td>{{ item.icd || '-' }}</td>
                            <td>有</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="suggestion mr40">
                      <span class="title">手术及操作</span>
                      <p v-for="(item, index) in operations" :key="index">
                        {{ index + 1 }}. {{ item.name }}（{{ item.date }}）
                      </p>
                      <p v-if="!operations.length">无</p>
                    </div>
                    <div class="suggestion mr40">
                      <span class="title">出院情况</span>
                      <p>{{ report.outStatus || '-' }}</p>
                    </div>
                  </div>
                  <!-- 底部信息 -->
                  <div class="footer">
                    <div class="doctor">
                      <div>
                        <span class="title">科主任：</span>
                        <span>{{ report.chiefDoc || '-' }}</span>
                      </div>
                      <div class="name">
                        <span class="title">主任医师：</span>
                        <span>{{ report.chiefPhysician || '-' }}</span>
                      </div>
                    </div>
                    <div class="doctor">
                      <div>
                        <span class="title">主治医师：</span>
                        <span>{{ report.attendingDoc || '-' }}</span>
                      </div>
                      <div class="name">
                        <span class="title">住院医师：</span>
                        <span>{{ report.residentDoc || '-' }}</span>
                      </div>
                    </div>
                    <div class="doctor">
                      <div>
                        <span class="title">责任护士：</span>
                        <span>{{ report.nurse || '-' }}</span>
                      </div>
                      <div class="name">
                        <span class="title">质控医生：</span>
                        <span>{{ report.qcDoc || '-' }}</span>
                      </div>
                    </div>
                    <div class="doctor mb24">
                      <div></div>
                      <div class="name">
                        <span class="title">签署日期：</span>
                        <span>{{ report.signDate || '-' }}</span>
                      </div>
                    </div>
                    <p class="tip">*本病案首页仅作临床参考</p>
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
import { getInpatientDetail } from '@/api/inpatient'

export default {
  name: 'inpatientReportDetail',
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
          { title: '性别', value: r.sex },
          { title: '年龄', value: r.age ? `${r.age}岁` : '' }
        ],
        [
          { title: '出生日期', value: r.birthDate },
          { title: '身份证号', value: r.idCard },
          { title: '民族', value: r.nation }
        ],
        [
          { title: '职业', value: r.occupation },
          { title: '婚姻', value: r.marriage },
          { title: '国籍', value: r.nationality }
        ],
        [
          { title: '现住址', value: r.address, span: 16 },
          { title: '联系电话', value: r.phone, span: 8 }
        ],
        [
          { title: '入院日期', value: r.inDate },
          { title: '出院日期', value: r.outDate },
          { title: '实际住院', value: r.bedDays ? `${r.bedDays} 天` : '' }
        ],
        [
          { title: '入院科室', value: r.inDept },
          { title: '出院科室', value: r.outDept },
          { title: '病房床位', value: r.ward }
        ],
        [
          { title: '住院号', value: r.stayId },
          { title: '血型', value: r.bloodType ? `${r.bloodType} / Rh ${r.rh || '-'}` : '' },
          { title: '药物过敏', value: r.allergy }
        ]
      ]
    },
    mainDiag() {
      return this.report.mainDiag || {}
    },
    otherDiags() {
      return this.report.otherDiags || []
    },
    operations() {
      return this.report.operations || []
    }
  },
  methods: {
    async getInpatientDetail() {
      const { id, organCode } = this.$route.query
      const { data } = await getInpatientDetail({ stayId: id, organCode })
      this.report = data || {}
      this.cardLoading = false
    }
  },
  created() {
    this.getInpatientDetail()
  }
}
</script>

<style scoped lang="less">
@import url('../style/index.less');

/deep/ .meta-top {
  padding: 12px 0;
  border-bottom: 1px solid #e9e9e9;
  text-align: center;
  color: rgba(0, 0, 0, 0.65);
  span + span {
    margin-left: 40px;
  }
}
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
}
</style>
