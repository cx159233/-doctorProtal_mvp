<template>
  <div class="mva-page">
    <!-- 家庭共济 + 慢特病待遇 + 异地就医备案 -->
    <div class="card mva-header">
      <div class="mva-header-inner">
        <!-- 家庭共济成员 -->
        <div class="mva-family">
          <div class="mva-sec-hd">
            <span class="mva-sec-stripe"></span>
            <span class="mva-sec-title">家庭共济成员</span>
            <span class="mva-sec-badge">暂未开放</span>
          </div>
          <div class="mva-family-bd" @click="showFamilyManagementModal = true">
            <div class="mva-fam-stack">
              <a-avatar
                v-for="(m, i) in familyMembers"
                :key="i"
                class="mva-fam-av"
                icon="user"
                :size="40"
                :title="m.name"
              />
            </div>
          </div>
        </div>

        <!-- 慢特病待遇 -->
        <div class="mva-ins">
          <div class="mva-sec-hd">
            <span class="mva-sec-stripe"></span>
            <span class="mva-sec-title">个人慢特病待遇</span>
            <span class="mva-sec-badge">2 项已认定</span>
          </div>
          <div class="mva-ins-bd">
            <div class="mva-ins-row">
              <span class="mva-kv-lbl"><i class="mva-cond-dot"></i>高血压</span>
              <span class="mva-kv-val">已认定 · 2024-03 起</span>
            </div>
            <div class="mva-ins-row">
              <span class="mva-kv-lbl"><i class="mva-cond-dot"></i>糖尿病</span>
              <span class="mva-kv-val">已认定 · 2024-03 起</span>
            </div>
          </div>
        </div>

        <div class="mva-vline"></div>

        <!-- 异地就医备案 -->
        <div class="mva-demo-block">
          <div class="mva-sec-hd">
            <span class="mva-sec-stripe"></span>
            <span class="mva-sec-title">异地就医备案</span>
            <span class="mva-sec-badge">暂未开放</span>
          </div>
          <div class="mva-ins-bd">
            <div class="mva-ins-row">
              <span class="mva-kv-lbl mva-kv-lbl--wide">备案地</span>
              <span class="mva-kv-val">--</span>
            </div>
            <div class="mva-ins-row">
              <span class="mva-kv-lbl mva-kv-lbl--wide">备案类型</span>
              <span class="mva-kv-val">--</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mva-grid">
      <!-- 财务档案：医保基金与资金结算 -->
      <div class="card">
        <div class="ch">
          <div class="ch-l">
            <div class="ch-stripe" style="background: var(--blue)"></div>
            <div class="ch-title">医保财务档案</div>
          </div>
        </div>
        <div class="cb">
          <div class="g4 mva-mb20">
            <div class="mc mc-fee">
              <div class="mc-lbl"><a-icon type="account-book" />年度医疗总费用</div>
              <div class="mc-val">{{ fees.total }}</div>
              <div class="mc-trend">↓ 较上年下降 12%</div>
            </div>
            <div class="mc mc-fund">
              <div class="mc-lbl"><a-icon type="bank" />统筹基金支付</div>
              <div class="mc-val">{{ fees.fund }}</div>
              <div class="mc-trend">↑ 较上年上升 2%</div>
            </div>
            <div class="mc mc-acct">
              <div class="mc-lbl"><a-icon type="wallet" />个人账户支付</div>
              <div class="mc-val">{{ fees.account }}</div>
              <div class="mc-trend">→ 含大病保险自付</div>
            </div>
            <div class="mc mc-ratio">
              <div class="mc-lbl"><a-icon type="pie-chart" />统筹报销比例</div>
              <div class="mc-val">{{ fees.fundRatio }}</div>
              <div class="mc-trend">统筹基金支付 ÷ 年度医疗总费用</div>
            </div>
          </div>

          <div class="mva-filter">
            <div class="mva-filter-item">
              <span class="mva-filter-lbl">年度：</span>
              <a-select
                v-model="selectedYear"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                style="width: 130px"
              >
                <a-select-option value="2026">2026年度</a-select-option>
                <a-select-option value="2025">2025年度</a-select-option>
                <a-select-option value="2024">2024年度</a-select-option>
              </a-select>
            </div>
            <div class="mva-filter-item">
              <span class="mva-filter-lbl">地区：</span>
              <a-select
                v-model="selectedCity"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                style="width: 130px"
              >
                <a-select-option value="changzhou">常州市</a-select-option>
                <a-select-option value="nanjing">南京市</a-select-option>
                <a-select-option value="wuxi">无锡市</a-select-option>
              </a-select>
            </div>
            <div class="mva-filter-item">
              <span class="mva-filter-lbl">类型：</span>
              <a-select
                v-model="selectedRecordType"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                style="width: 130px"
              >
                <a-select-option value="门诊">门诊</a-select-option>
                <a-select-option value="住院">住院</a-select-option>
                <a-select-option value="药店">药店</a-select-option>
              </a-select>
            </div>
            <a-button @click="resetFilters">重置</a-button>
          </div>

          <Table
            rowKey="date"
            :columns="columns"
            :dataSource="pagedData"
            :totalNum="filteredData.length"
            :pagination="pagination"
            :scrollX="1014"
          />
        </div>
      </div>

      <!-- 信息档案：待遇资质看板 -->
      <div class="card">
        <div class="ch">
          <div class="ch-l">
            <div class="ch-stripe" style="background: var(--blue)"></div>
            <div class="ch-title">医保信息档案</div>
          </div>
        </div>
        <div class="cb">
          <div class="mva-group">
            <div class="mva-group-hd">
              <span class="mva-group-title">参保信息</span>
            </div>
            <div class="mva-cond-list">
              <div class="mva-cond-item">
                <span class="mva-cond-name">参保状态</span>
                <span class="mva-cond-meta"><i class="mva-cond-dot"></i>正常参保(在缴)</span>
              </div>
              <div class="mva-cond-item">
                <span class="mva-cond-name">参保类型</span>
                <span class="mva-cond-meta">职工基本医疗保险</span>
              </div>
              <div class="mva-cond-item">
                <span class="mva-cond-name">参保单位</span>
                <span class="mva-cond-meta">常州****公司</span>
              </div>
              <div class="mva-cond-item">
                <span class="mva-cond-name">统筹地区</span>
                <span class="mva-cond-meta">常州市</span>
              </div>
            </div>
          </div>

          <div class="mva-group">
            <div class="mva-group-hd">
              <span class="mva-group-title">长期护理保险</span>
            </div>
            <div class="ins-card-v2 mva-ltc-card">
              <div class="ins-v2-top mva-ltc-top">
                <div class="ins-v2-info">
                  <div class="ins-v2-name">常州市长期护理保险</div>
                </div>
                <!-- 评定结论放卡片右上角，不再单占一行 -->
                <div class="ins-v2-id mva-ltc-id">重度失能 II 级</div>
              </div>
              <div class="ins-v2-body">
                <div class="ins-v2-item">
                  <div class="ins-v2-lbl">待遇状态</div>
                  <div class="ins-v2-val" style="color: var(--green)">享受中</div>
                </div>
                <div class="ins-v2-item">
                  <div class="ins-v2-lbl">服务方式</div>
                  <div class="ins-v2-val">居家上门护理</div>
                </div>
                <div class="ins-v2-item">
                  <div class="ins-v2-lbl">服务频次</div>
                  <div class="ins-v2-val">3次/周</div>
                </div>
                <div class="ins-v2-item">
                  <div class="ins-v2-lbl">定点机构</div>
                  <div class="ins-v2-val" title="常州安心养老服务中心">常州安心养老服务中心</div>
                </div>
              </div>
            </div>
          </div>

          <div class="mva-group mva-group-demo">
            <div class="mva-group-hd">
              <span class="mva-group-title">商业保险</span>
              <span class="mva-badge-demo">暂未开放</span>
            </div>
            <div class="ins-card-v2 mva-ins-demo">
              <div class="ins-v2-top mva-ins-demo-top">
                <div class="ins-v2-info">
                  <div class="ins-v2-name">商业健康保险</div>
                </div>
                <!-- 保单号在卡片右上角，顶栏只留机构名，卡片更矮 -->
                <div class="ins-v2-id">保单号：--</div>
              </div>
              <div class="ins-v2-body">
                <div class="ins-v2-item">
                  <div class="ins-v2-lbl">保障状态</div>
                  <div class="ins-v2-val">--</div>
                </div>
                <div class="ins-v2-item">
                  <div class="ins-v2-lbl">年度保额</div>
                  <div class="ins-v2-val">--</div>
                </div>
                <div class="ins-v2-item">
                  <div class="ins-v2-lbl">免赔额</div>
                  <div class="ins-v2-val">--</div>
                </div>
                <div class="ins-v2-item">
                  <div class="ins-v2-lbl">到期日期</div>
                  <div class="ins-v2-val">--</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 家庭共济成员管理。内容 portal 到 body，所以再挂一层 mva-page 让样式命中 -->
    <a-modal
      :visible="showFamilyManagementModal"
      title="家庭共济成员管理"
      :footer="null"
      width="600px"
      @cancel="showFamilyManagementModal = false"
    >
      <div class="mva-page">
        <div class="modal-body fam-mgmt-v2">
          <div class="fam-v2-header">
            <div class="fam-v2-user">
              <div class="fam-v2-av">👨‍⚕️</div>
              <div class="fam-v2-info">
                <div class="fam-v2-name">{{ patient.name }} <span class="fam-v2-tag">主授权人</span></div>
                <div class="fam-v2-id">身份证号：{{ patient.maskedIdCard }}</div>
              </div>
            </div>
            <div class="fam-v2-balance">
              <div class="fam-v2-bal-lbl">个账余额</div>
              <div class="fam-v2-bal-val">¥ 12,450.00</div>
            </div>
          </div>

          <div class="fam-v2-tabs">
            <div :class="['fam-v2-tab', activeFamilyTab === 0 ? 'active' : '']" @click="activeFamilyTab = 0">我授权的亲属 ({{ familyMembers.length }})</div>
            <div :class="['fam-v2-tab', activeFamilyTab === 1 ? 'active' : '']" @click="activeFamilyTab = 1">授权给我使用的亲属 ({{ authorizedMeMembers.length }})</div>
          </div>

          <div v-if="activeFamilyTab === 0" class="fam-v2-list">
            <div v-for="(member, i) in familyMembers" :key="i" class="fam-v2-card">
              <div class="fam-v2-card-top">
                <div class="fam-v2-card-user">
                  <div class="fam-v2-card-av" :style="{ background: member.color }">{{ member.av }}</div>
                  <div class="fam-v2-card-info">
                    <div class="fam-v2-card-name">{{ member.name }} <span class="tag t-blue">{{ member.rel }}</span></div>
                    <div class="fam-v2-card-id">{{ member.id }}</div>
                  </div>
                </div>
                <div :class="['tag', member.status === '已激活' ? 't-green' : 't-amber']">{{ member.status }}</div>
              </div>

              <div class="fam-v2-permissions">
                <div class="fam-v2-perm-hd">权限设置</div>
                <div class="fam-v2-perm-list">
                  <div class="fam-v2-perm-item">
                    <span>使用我的个账余额</span>
                    <div :class="['toggle', member.balance ? 'on' : '']"></div>
                  </div>
                  <div class="fam-v2-perm-item">
                    <span>代办医保业务授权</span>
                    <div :class="['toggle', member.balance ? 'on' : '']"></div>
                  </div>
                </div>
              </div>

              <div class="fam-v2-card-actions">
                <button class="fam-v2-btn" @click="notOpen">解绑</button>
                <button class="fam-v2-btn" @click="notOpen">支付明细</button>
                <button class="fam-v2-btn p-color" @click="notOpen">共济缴费</button>
              </div>
            </div>
          </div>

          <div v-else class="fam-v2-list">
            <div v-for="(member, i) in authorizedMeMembers" :key="i" class="fam-v2-card">
              <div class="fam-v2-card-top">
                <div class="fam-v2-card-user">
                  <div class="fam-v2-card-av" :style="{ background: member.color }">{{ member.av }}</div>
                  <div class="fam-v2-card-info">
                    <div class="fam-v2-card-name">{{ member.name }} <span class="tag t-blue">{{ member.rel }}</span></div>
                    <div class="fam-v2-card-id">{{ member.id }}</div>
                  </div>
                </div>
                <div :class="['tag', member.status === '已激活' ? 't-green' : 't-amber']">{{ member.status }}</div>
              </div>

              <div class="fam-v2-card-actions">
                <button class="fam-v2-btn" @click="notOpen">支付明细</button>
              </div>
            </div>
          </div>

          <div class="fam-v2-footer">
            <button class="fam-v2-foot-btn" @click="notOpen"><a-icon type="search" /> 查询共济支出</button>
            <button class="fam-v2-foot-btn p-bg" @click="notOpen"><a-icon type="plus" /> 添加家庭成员</button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Table from '@/components/Table'
import { DEFAULT_PATIENT } from '@/config/demo'

const REIMBURSEMENT_DATA = [
  { date: '2026-03-05 14:20:31', hosp: '常州市第一人民医院', type: '门诊', total: '386.00', cash: '38.00', fund: '268.00', account: '80.00', deduct: '0.00', other: '0.00', ratio: '69.4%' },
  { date: '2026-02-18 09:12:05', hosp: '南京大学医学院附属鼓楼医院', type: '门诊', total: '50.00', cash: '0.00', fund: '45.00', account: '5.00', deduct: '0.00', other: '0.00', ratio: '90.0%' },
  { date: '2025-08-05 11:07:05', hosp: '常州市第一人民医院', type: '住院', total: '6101.50', cash: '3310.86', fund: '2790.64', account: '0.00', deduct: '0.00', other: '0.00', ratio: '45.7%' },
  { date: '2025-07-20 09:30:12', hosp: '南京大学医学院附属鼓楼医院', type: '门诊', total: '420.00', cash: '120.00', fund: '300.00', account: '0.00', deduct: '0.00', other: '0.00', ratio: '71.4%' },
  { date: '2025-06-15 14:22:45', hosp: '常州市第一人民医院', type: '药店', total: '158.50', cash: '0.00', fund: '0.00', account: '158.50', deduct: '0.00', other: '0.00', ratio: '0.0%' },
  { date: '2025-05-10 10:15:30', hosp: '常州市第一人民医院', type: '门诊', total: '850.00', cash: '250.00', fund: '600.00', account: '0.00', deduct: '0.00', other: '0.00', ratio: '70.6%' },
  { date: '2025-04-02 08:45:00', hosp: '南京大学医学院附属鼓楼医院', type: '住院', total: '12500.00', cash: '3500.00', fund: '9000.00', account: '0.00', deduct: '0.00', other: '0.00', ratio: '72.0%' },
]

const FAMILY_MEMBERS = [
  { name: '李 **', rel: '配偶', id: '3204**********1234', status: '已激活', balance: true, av: '👩', color: '#FEE2E2' },
  { name: '陈 **', rel: '子女', id: '3204**********5678', status: '已激活', balance: true, av: '👦', color: '#e6f7ff' },
  { name: '陈 ** 华', rel: '父亲', id: '3204**********9012', status: '待确认', balance: false, av: '👴', color: '#f5f3ff' },
]

const AUTHORIZED_ME_MEMBERS = [
  { name: '陈 ** 强', rel: '兄弟', id: '3204**********4321', status: '已激活', av: '👨', color: '#ecfeff' },
]

// 筛选条件重置后的取值，data 初始值和重置按钮共用，避免两处不一致
const DEFAULT_FILTERS = {
  year: '2026',
  city: 'changzhou',
  recordType: '门诊',
}

// 四张卡片的金额按年度存一份，模板里不再反复写三元表达式；
// 统筹报销比例也由同一份的 fund / total 现算，改金额就不用另外改比例
const FEE_CARDS = {
  2026: { total: 12480, fund: 8210, account: 4270 },
  2025: { total: 9860, fund: 6540, account: 3320 }
}

const money = (n) => '¥' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default {
  name: 'archive',
  components: {
    Table
  },
  data() {
    return {
      selectedYear: DEFAULT_FILTERS.year,
      selectedCity: DEFAULT_FILTERS.city,
      selectedRecordType: DEFAULT_FILTERS.recordType,
      showFamilyManagementModal: false,
      activeFamilyTab: 0,
      familyMembers: FAMILY_MEMBERS,
      authorizedMeMembers: AUTHORIZED_ME_MEMBERS,
      rawData: REIMBURSEMENT_DATA,
      columns: [
        {
          title: '日期',
          key: 'date',
          dataIndex: 'date',
          width: '112px',
          customRender: (text) => {
            const [day, time] = String(text).split(' ')
            return this.$createElement('div', { class: 'mva-date' }, [
              this.$createElement('span', { class: 'mva-date-day' }, day),
              this.$createElement('span', { class: 'mva-date-time' }, time)
            ])
          }
        },
        {
          title: '机构',
          key: 'hosp',
          dataIndex: 'hosp',
          width: '162px',
          customRender: (text, record) => {
            return this.$createElement('span', { attrs: { title: text } }, text)
          }
        },
        {
          title: '类型',
          key: 'type',
          dataIndex: 'type',
          width: '78px',
          customRender: (text, record) => {
            const cls = record.type === '门诊' ? 't-blue' : (record.type === '住院' ? 't-red' : 't-cyan')
            return this.$createElement('span', { class: ['tag', cls] }, text)
          }
        },
        // 金额类字段脱敏，只保留报销比例可读
        { title: '总费用(元)', key: 'total', dataIndex: 'total', width: '92px', customRender: this.renderMasked('mva-strong') },
        { title: '现金支付(元)', key: 'cash', dataIndex: 'cash', width: '94px', customRender: this.renderMasked('') },
        { title: '基金支付(元)', key: 'fund', dataIndex: 'fund', width: '94px', customRender: this.renderMasked('mva-blue') },
        { title: '个账支付(元)', key: 'account', dataIndex: 'account', width: '94px', customRender: this.renderMasked('mva-blue') },
        { title: '账户抵扣金额(元)', key: 'deduct', dataIndex: 'deduct', width: '100px', customRender: this.renderMasked('') },
        { title: '其他支付金额(元)', key: 'other', dataIndex: 'other', width: '100px', customRender: this.renderMasked('') },
        {
          title: '报销比例',
          key: 'ratio',
          dataIndex: 'ratio',
          width: '90px',
          customRender: (text, record) => {
            const svg =
              '<svg viewBox="0 0 36 36">' +
              '<circle cx="18" cy="18" r="16" fill="none" stroke="var(--line)" stroke-width="4"></circle>' +
              '<circle cx="18" cy="18" r="16" fill="none" stroke="var(--blue)" stroke-width="4" stroke-dasharray="' +
              parseFloat(record.ratio) +
              ', 100" stroke-linecap="round"></circle>' +
              '</svg>'
            const ring = this.$createElement('div', { class: 'mva-ring', domProps: { innerHTML: svg } })
            const label = this.$createElement('span', { class: 'mva-ring-label' }, text)
            return [this.$createElement('div', { class: 'mva-ratio' }, [ring, label])]
          }
        }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showLessItems: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onShowSizeChange: (current, pageSize) => {
          this.pagination.current = 1
          this.pagination.pageSize = pageSize
        },
        onChange: (current) => {
          this.pagination.current = current
        }
      }
    }
  },
  computed: {
    patient() {
      const info = this.$store.state.user.hospital_data || {}
      const idCard = String(info.patient_id_card || DEFAULT_PATIENT.idCard)
      return {
        name: info.patient_name || DEFAULT_PATIENT.name,
        maskedIdCard: idCard.slice(0, 4) + '**********' + idCard.slice(-4),
        gender: Number(idCard.charAt(16)) % 2 === 1 ? '男' : '女',
        age: this.ageOf(idCard)
      }
    },
    // 2024 年度暂时没有数据，跟改动前一样回落到 2025 那组
    fees() {
      const f = FEE_CARDS[this.selectedYear] || FEE_CARDS[2025]
      return {
        total: money(f.total),
        fund: money(f.fund),
        account: money(f.account),
        fundRatio: ((f.fund / f.total) * 100).toFixed(1) + '%'
      }
    },
    filteredData() {
      return this.rawData.filter(item => item.type === this.selectedRecordType)
    },
    pagedData() {
      const start = (this.pagination.current - 1) * this.pagination.pageSize
      return this.filteredData.slice(start, start + this.pagination.pageSize)
    }
  },
  watch: {
    filteredData: {
      immediate: true,
      handler(list) {
        this.pagination.total = list.length
        this.pagination.current = 1
      }
    }
  },
  methods: {
    // 列自定义渲染的取样器：只给单元格套个着色 class
    // 金额脱敏：只看得到星号，值不外露
    renderMasked(cls) {
      return () => this.$createElement('span', { class: cls }, '***')
    },
    ageOf(idCard) {
      const year = Number(idCard.slice(6, 10))
      const month = Number(idCard.slice(10, 12))
      const day = Number(idCard.slice(12, 14))
      if (!year) return 0
      const now = new Date()
      let age = now.getFullYear() - year
      const beforeBirthday =
        now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day)
      if (beforeBirthday) age -= 1
      return age < 0 ? 0 : age
    },
    notOpen() {
      this.$message.info('暂未开通')
    },
    // 年度 / 地区 / 类型 三个筛选条件一起回到默认值
    resetFilters() {
      this.selectedYear = DEFAULT_FILTERS.year
      this.selectedCity = DEFAULT_FILTERS.city
      this.selectedRecordType = DEFAULT_FILTERS.recordType
    }
  }
}
</script>

<style lang="less">
@import url('./style/index.less');
</style>
