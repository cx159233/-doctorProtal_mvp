<template>
  <div class="screen">
    <div class="stage">
      <div class="dashboard">
    <!-- Header -->

    <!-- 主体 -->
    <main class="main">
      <!-- 人体模型作为全局背景层 -->
      <img class="body-bg" src="../assets/slices/l_2246.png" alt="" />

      <!-- 左侧面板 -->
      <aside class="left-column">
        <!-- 个人信息 + 账户概览 -->
        <section class="panel profile-panel">
          <div v-if="!authorized" class="auth-empty">患者未授权，暂无数据</div>
          <template v-else>
          <div class="profile-card">
            <img class="avatar" src="../assets/slices/l_2182.png" alt="avatar" />
            <div class="profile-info">
              <div class="name-row">
                <span class="name">{{ patientName }}</span>
                <span class="status-tag">正常参保·在缴</span>
              </div>
              <div class="sub">{{ idParts.sex }} · {{ idParts.age }}岁 · {{ idParts.birthDate }}</div>
              <div class="meta">身份证：{{ idParts.maskedIdCard }}</div>
            </div>
            <div class="profile-actions">
              <div class="action-item"><img src="../assets/slices/l_1955.png" alt="" /><span>慢特病:高血压、糖尿病</span></div>
              <!-- <div class="action-item"><img src="../assets/slices/l_2094.png" alt="" /><span>信用就医白名单</span></div>
              <div class="action-item"><img src="../assets/slices/l_2274.png" alt="" /><span>备案地:上海</span></div> -->
              <div class="action-item"><img src="../assets/slices/l_2275.png" alt="" /><span>签约医生:李华(家医)</span></div>
            </div>
          </div>
          <div class="account-grid">
            <div class="account-item">
              <div class="account-label">年度医疗总费用(元)</div>
              <div class="account-value">12,480.00</div>
              <div class="trend"><span class="trend-arrow down">↓</span>较上年下降 12%</div>
            </div>
            <div class="account-item">
              <div class="account-label">统筹报销比例</div>
              <div class="account-value">65.8%</div>
              <div class="trend">统筹基金支付/年度医疗总费用</div>
            </div>
            <div class="account-item">
              <div class="account-label">统筹基金支付（元）</div>
              <div class="account-value">8,210.00</div>
              <div class="account-progress"><div class="account-progress-fill" style="width: 65.8%" /></div>
              <div class="trend"><span class="trend-arrow up">↑</span>较上年上升 2%</div>
            </div>
            <div class="account-item">
              <div class="account-label">个人账户支付（元）</div>
              <div class="account-value">4,270.00</div>
              <div class="account-progress"><div class="account-progress-fill" style="width: 34.2%" /></div>
              <div class="trend">→ 含大病保险自付</div>
            </div>
          </div>

          <div class="family-row">
            <div class="family-left">
              <div class="account-label">家庭共济账户</div>
              <div class="family-avatars">
                <span class="family-avatar"><img :src="icon('组 2256@2x')" alt="本人" /></span>
                <span class="family-avatar"><img :src="icon('组 2257@2x')" alt="配偶" /></span>
                <span class="family-avatar"><img :src="icon('组 2259@2x')" alt="子女" /></span>
              </div>
            </div>
            <div class="family-right">
              <div class="account-label">可用金额（元）</div>
              <div class="account-value muted">暂未开放</div>
            </div>
          </div>
          </template>
        </section>

        <!-- 医保信息档案 -->
        <section class="panel info-panel">
          <div class="panel-header">
            <div class="panel-title-bar">
              <span class="title-bar" />
              <span>医保信息档案</span>
            </div>
            <a
              class="more-link"
              role="button"
              tabindex="0"
              @click="navigateTo('/archive/index')"
              @keyup.enter="navigateTo('/archive/index')"
            >查看更多 <span class="arrow">›</span></a>
          </div>
          <div class="info-tabs" role="tablist" aria-label="医保信息档案分类">
            <button
              v-for="tab in infoTabs"
              :key="tab.key"
              type="button"
              role="tab"
              class="info-tab"
              :class="{ active: infoTab === tab.key }"
              :aria-selected="infoTab === tab.key"
              :tabindex="infoTab === tab.key ? 0 : -1"
              @click="infoTab = tab.key"
            >
              {{ tab.name }}
            </button>
          </div>
          <div v-if="!authorized" class="auth-empty">患者未授权，暂无数据</div>
          <!-- 参保状态：信息列表 + 年度进度环 -->
          <div
            v-else-if="activeInfo.kind === 'list'"
            class="info-body"
            role="tabpanel"
            :aria-label="activeInfo.name"
          >
            <div class="info-list">
              <div v-for="row in activeRows" :key="row.label" class="info-row">
                <span>{{ row.label }}：</span>
                <span class="val" :title="row.value">
                  <span v-if="row.dot" class="status-dot" />
                  {{ row.value }}
                </span>
              </div>
            </div>
            <div class="progress-ring-wrap">
              <div class="progress-label">{{ activeCost.key }}费用</div>
              <!-- 点圆环依次切换 门诊 / 住院 / 用药 -->
              <div
                class="ring-box"
                role="button"
                tabindex="0"
                title="点击切换 门诊 / 住院 / 用药"
                @click="nextCost"
                @keyup.enter="nextCost"
              >
                <svg viewBox="0 0 100 100" class="progress-ring" role="img"
                     :aria-label="`${activeCost.key}费用 ${costPercent}%`">
                  <defs>
                    <linearGradient id="ringGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" :stop-color="activeCost.from" />
                      <stop offset="100%" :stop-color="activeCost.to" />
                    </linearGradient>
                  </defs>
                  <circle class="track" cx="50" cy="50" r="42" />
                  <circle class="fill" cx="50" cy="50" r="42" :style="{ strokeDashoffset: ringOffset }" />
                </svg>
                <div class="ring-text">{{ costPercent }}%</div>
              </div>
              <div class="progress-amount">{{ costText }}</div>
            </div>
          </div>
          <!-- 商业保险 / 长护险：卡片列表 -->
          <div
            v-else
            class="info-body info-body--cards"
            role="tabpanel"
            :aria-label="activeInfo.name"
          >
            <article
              v-for="card in activeCards"
              :key="card.title"
              class="info-card"
              :class="card.variant"
            >
              <div class="card-head">
                <span class="card-title">{{ card.title }}</span>
                <span v-if="card.extra" class="card-extra" :class="card.extraTone">
                  {{ card.extra }}
                </span>
              </div>
              <div class="card-fields">
                <div v-for="field in card.fields" :key="field.label" class="card-field">
                  <span class="field-label">{{ field.label }}</span>
                  <span class="field-value" :class="field.tone" :title="field.value">
                    {{ field.value }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </aside>

      <!-- 中间区域 -->
      <section class="center-column">
        <div class="view-tabs" role="tablist" aria-label="中间区域视图">
          <button
            v-for="v in viewTabs"
            :key="v.key"
            type="button"
            role="tab"
            class="view-tab"
            :class="{ active: activeView === v.key }"
            :aria-selected="activeView === v.key"
            @click="activeView = v.key"
          >
            {{ v.name }}
          </button>
        </div>

        <div v-if="!authorized" class="auth-empty auth-empty--center">患者未授权，页面数据为空</div>
        <template v-else>
        <div v-if="activeView === 'panorama'" class="record-cards">
          <div
            v-for="item in records"
            :key="item.title"
            class="record-card"
            :class="[item.side, item.variant, item.tone]"
            :style="{ '--x': item.x + '%', '--y': item.y + '%' }"
            role="button"
            tabindex="0"
            @click="openRecord(item)"
            @keyup.enter="openRecord(item)"
          >
            <!-- 连接线条：从卡片边缘延伸向人体 -->
            <img
              v-if="item.line"
              class="record-line"
              :class="item.side"
              :src="icon(item.line)"
              :style="lineStyle(item)"
              alt=""
            />
            <div class="record-main">
              <div class="record-title">{{ item.title }}</div>
              <div class="record-value-row">
                <span v-if="item.sub" class="record-sub">{{ item.sub }}</span>
                <span v-if="item.value" class="record-value">{{ item.value }}</span>
                <span v-if="item.unit" class="record-unit">{{ item.unit }}</span>
              </div>
              <div v-if="item.date" class="record-date" :class="{ muted: item.variant === 'empty' }">{{ item.date }}</div>
            </div>
            <div class="record-icon-box" :class="item.tone">
              <img class="record-icon" :src="icon(item.icon)" alt="" />
            </div>
          </div>
        </div>

        <!-- 全生命周期时间轴：医保健康档案 -->
        <section v-else class="panel archive-panel" role="tabpanel" aria-label="全生命周期时间轴视图">
          <div class="panel-header">
            <div class="panel-title-bar">
              <span class="title-bar" />
              <span>医保健康档案</span>
            </div>
            <a
              class="more-link"
              role="button"
              tabindex="0"
              @click="openArchiveTab(archiveTab)"
              @keyup.enter="openArchiveTab(archiveTab)"
            >查看更多 <span class="arrow">›</span></a>
          </div>

          <div class="archive-tabs" role="tablist" aria-label="健康档案分类">
            <button
              v-for="t in archiveTabs"
              :key="t"
              type="button"
              role="tab"
              class="archive-tab"
              :class="{ active: archiveTab === t, 'is-disabled': NO_DATA_TABS.includes(t) }"
              :aria-selected="archiveTab === t"
              @click="switchArchiveTab(t)"
            >
              {{ t }}
            </button>
          </div>

          <div class="archive-meta">
            <span class="archive-meta-text">最近3年</span>
            <span class="archive-meta-count">数量：{{ archiveItems.length }}</span>
          </div>

          <div class="archive-timeline">
            <div
              v-for="(item, i) in archiveItems"
              :key="i + item.date + item.title"
              class="timeline-item"
            >
              <span class="timeline-dot" :class="{ latest: i === 0 }" />
              <div class="timeline-main">
                <div class="timeline-head">
                  <span class="timeline-date">{{ item.date }}</span>
                  <span class="timeline-org">{{ item.org }}</span>
                </div>
                <article class="timeline-card">
                  <svg class="timeline-card-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9.2 4.6H7.6A1.6 1.6 0 0 0 6 6.2v13a1.6 1.6 0 0 0 1.6 1.6h8.8a1.6 1.6 0 0 0 1.6-1.6v-13a1.6 1.6 0 0 0-1.6-1.6h-1.6" />
                    <rect x="9.2" y="2.8" width="5.6" height="3.2" rx="1" />
                    <path d="M8.8 13.4h1.8l1.1-2.4 1.3 3.6 1-1.2h1.2" />
                  </svg>
                  <div class="timeline-card-body">
                    <h4 class="timeline-card-title">{{ item.title }}</h4>
                    <template v-if="item.detail">
                      <div class="timeline-card-divider" />
                      <p class="timeline-card-detail">
                        <span class="detail-label">{{ item.detailLabel ?? '诊断' }}：</span>{{ item.detail }}
                      </p>
                    </template>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
        </template>
      </section>

      <!-- 右侧面板 -->
      <aside class="right-column">
        <section class="panel vitals-panel">
          <div class="panel-title-bar">
            <span class="title-bar" />
            <span>近期体征动态</span>
          </div>
          <div v-if="!authorized" class="auth-empty">患者未授权，暂无数据</div>
          <div v-else class="vitals-grid">
            <div v-for="v in vitals" :key="v.title" class="vital-card">
              <div class="vital-head">
                <img
                  class="vital-icon"
                  :src="icon(v.icon)"
                  :style="v.iconScale ? { transform: `scale(${v.iconScale})` } : undefined"
                  alt=""
                />
                <div class="vital-title">{{ v.title }}</div>
              </div>
              <div class="vital-sub">{{ v.sub }}</div>
              <div class="vital-value-row">
                <span class="vital-value" :class="v.valueClass">{{ v.value }}</span>
                <span v-if="v.unit" class="vital-unit">{{ v.unit }}</span>
                <span v-if="v.extra" class="vital-extra">{{ v.extra }}</span>
                <span v-if="v.arrow" class="vital-arrow" :class="v.arrowClass">{{ v.arrow }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="panel risk-panel">
          <div class="panel-header">
            <div class="panel-title-bar">
              <span class="title-bar" />
              <span>健康风险标签</span>
              <span class="risk-status">暂未开放</span>
            </div>
          </div>
          <div v-if="!authorized" class="auth-empty">患者未授权，暂无数据</div>
          <div v-else class="risk-list">
            <div v-for="g in riskGroups" :key="g.label" class="risk-row">
              <div class="risk-label">{{ g.label }}</div>
              <div class="risk-tags">
                <span v-for="t in g.tags" :key="t">{{ t }}</span>
              </div>
            </div>
          </div>
        </section>
      </aside>

      <!-- 底部智能服务 -->
      <footer class="services-bar">
        <div class="service-brand">
          <img src="../assets/slices/l_2391.png" alt="" />
          <span>智能服务</span>
        </div>
        <div class="service-divider" />
        <div v-if="!authorized" class="auth-empty">患者未授权，暂无数据</div>
        <div v-else class="service-list">
          <div v-for="s in services" :key="s.name" class="service-item">
            <img :src="icon(s.icon)" alt="" />
            <div class="service-text">
              <div class="service-name">{{ s.name }}</div>
              <div class="service-desc">{{ s.desc }}</div>
            </div>
          </div>
        </div>
        <div class="service-more" @click="openServiceMore">
          <div class="more-dots"><span /><span /><span /></div>
          <span>查看更多</span>
        </div>
      </footer>
    </main>

    <!-- 未接入页签的轻提示：跟档案页点「体检报告 / 用药记录」的提示一致 -->
    <div v-if="toast" class="screen-toast">{{ toast }}</div>

    <!-- 授权弹窗在主应用那边（公共件 AuthModal），大屏内不再自带一份 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
/* 「医保健康档案」的列表直接复用主应用各查询页的演示数据：
   大屏上的条数、最近时间、列表内容跟档案页看到的完全同源，不再另写一份 */
import { buildStudyList } from '../../src/mock/image'
import { buildTestList } from '../../src/mock/inspection'
import { buildVisitList } from '../../src/mock/outpatient'
import { buildStayList } from '../../src/mock/inpatient'
import { buildPathologyList } from '../../src/mock/pathology'
import { buildVitalList } from '../../src/mock/vital'

/* 切片图标统一解析：JS 里的相对路径字符串不会被 Vite 处理，需用 glob 预加载 */
const iconModules = import.meta.glob('../assets/slices/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as unknown as Record<string, string>
const icon = (name: string) => iconModules[`../assets/slices/${name}.png`] ?? ''

/* ========== 患者身份：由主应用经 URL 参数传入，年龄/性别/出生日期一律派生 ========== */
/* 大屏在 iframe 里跨进程，读不到主应用的状态，URL 是唯一通道。
   只传 name + idcard，其余字段从身份证推，避免手写值互相漂移。 */
const DEFAULT_ID_CARD = '320402197103154733'
const query = new URLSearchParams(window.location.search)
const patientName = query.get('name') || '张伟'
const patientIdCard = query.get('idcard') || DEFAULT_ID_CARD

const idParts = (() => {
  const id = patientIdCard
  const y = id.slice(6, 10)
  const m = id.slice(10, 12)
  const d = id.slice(12, 14)
  const birth = new Date(`${y}/${m}/${d}`)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  if (beforeBirthday) age--
  return {
    birthDate: `${y}-${m}-${d}`,
    age: String(age),
    sex: Number(id.charAt(16)) % 2 === 1 ? '男' : '女',
    maskedIdCard: `${id.slice(0, 4)}**********${id.slice(-4)}`,
  }
})()

/* ========== 患者授权：未授权时页面数据为空 ==========
   授权动作在主应用（8081）的公共弹窗 AuthModal 里完成——它和路由、sessionStorage 同源，
   大屏在 iframe 里跨进程够不着。这里只认 URL 上的 authorized 参数：
   授权成功后主应用会重建 iframe 地址，大屏整体重载，于是数据出来。
   不带该参数（直接开 5173 调试）时视为已授权，免得只剩一片空态。 */
const authorized = ref(query.get('authorized') !== '0')

/* ========== 医保信息总览：三个分类做成切换卡 ========== */
interface InfoRow {
  label: string
  value: string
  /* 值前带蓝色状态点（参保状态「正常参保」） */
  dot?: boolean
}
/* 卡片式内容（商业保险 / 长护险）里的字段 */
interface InfoCardField {
  label: string
  value: string
  /* 正向状态（长护险「享受中」）用绿色 */
  tone?: 'green'
}
interface InfoCard {
  title: string
  /* 右上角补充信息：保单号 / 失能等级 */
  extra?: string
  extraTone?: 'green'
  /* empty=暂无数据的虚线卡；green=长护险浅绿卡 */
  variant?: 'empty' | 'green'
  fields: InfoCardField[]
}
interface InfoTab {
  key: string
  name: string
  /* list=信息列表+费用环；cards=卡片列表 */
  kind: 'list' | 'cards'
  rows?: InfoRow[]
  cards?: InfoCard[]
}
const infoTabs: InfoTab[] = [
  {
    key: 'insured',
    name: '参保信息',
    kind: 'list',
    rows: [
      { label: '参保状态', value: '正常参保(在缴)', dot: true },
      { label: '参保类型', value: '职工基本医疗保险' },
      { label: '参保单位', value: '常州****公司' },
      { label: '统筹地区', value: '常州市' },
    ],
  },
  {
    key: 'longcare',
    name: '长期护理保险',
    kind: 'cards',
    cards: [
      {
        title: '常州市长期护理保险',
        extra: '重度失能 II 级',
        extraTone: 'green',
        variant: 'green',
        fields: [
          { label: '待遇状态', value: '享受中', tone: 'green' },
          { label: '服务方式', value: '居家上门护理' },
          { label: '服务频次', value: '3次/周' },
          { label: '定点机构', value: '常州安心养老服务中心' },
        ],
      },
    ],
  },
  {
    key: 'commercial',
    name: '商业保险',
    kind: 'cards',
    cards: [
      {
        title: '商业健康保险',
        extra: '保单号：--',
        variant: 'empty',
        fields: [
          { label: '保障状态', value: '--' },
          { label: '年度保额', value: '--' },
          { label: '免赔额', value: '--' },
          { label: '到期日期', value: '--' },
        ],
      },
    ],
  },
]
const infoTab = ref(infoTabs[0].key)
const activeInfo = computed(() => infoTabs.find((t) => t.key === infoTab.value) ?? infoTabs[0])
const activeRows = computed(() => activeInfo.value.rows ?? [])
const activeCards = computed(() => activeInfo.value.cards ?? [])

/* ========== 参保状态右侧的费用环：门诊 / 住院 / 用药 三类费用 ========== */
/* 分母取财务统计里的「年度医疗总费用」，三类是它的拆分；
   每类各配一套渐变色，点圆环依次切换 */
const COST_SHARES = [
  { key: '门诊', amount: 3860, from: '#7fa9f8', to: '#3a5bff' },
  { key: '住院', amount: 7240, from: '#7fe3c3', to: '#12b886' },
  /* 用药未接入，金额按 0 展示 */
  { key: '用药', amount: 0, from: '#ffcd8a', to: '#ff9f2e' },
]
const ANNUAL_TOTAL_COST = 12480
const money = (n: number) =>
  '¥' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const costIndex = ref(0)
const activeCost = computed(() => COST_SHARES[costIndex.value])
const costPercent = computed(() => ((activeCost.value.amount / ANNUAL_TOTAL_COST) * 100).toFixed(1))
const costText = computed(() => `${money(activeCost.value.amount)} / ${money(ANNUAL_TOTAL_COST)}`)
const nextCost = () => {
  costIndex.value = (costIndex.value + 1) % COST_SHARES.length
}

/* 进度环：r=42 → 周长 2πr ≈ 264，按百分比换算成 dashoffset */
const ringOffset = computed(() => 264 * (1 - Number(costPercent.value) / 100))

/* ========== 中间区域：视图切换 + 全生命周期时间轴 ========== */
const viewTabs = [
  { key: 'panorama', name: '全景健康视图' },
  { key: 'timeline', name: '全生命周期时间轴视图' },
]
const activeView = ref(viewTabs[0].key)

/* 医保健康档案分类 tab：跟档案页的查询页签、全景视图的卡片命名保持同一套 */
const archiveTabs = ['门诊记录', '住院记录', '全国影像检查', '检验记录', '病理记录', '穿戴数据', '体检报告', '用药记录']
const archiveTab = ref(archiveTabs[0])

interface ArchiveItem {
  date: string
  org: string
  /* 这次记录是什么：影像看检查项目名，门诊/住院/病理看科室与医师 */
  title: string
  /* 这份记录的结论，列表里没有可展示的结论时留空 */
  detail?: string
  /* 结论前缀，跟着类型走：门诊/住院/检验=诊断，影像=结论，病理=病理诊断 */
  detailLabel?: string
}

/* 列表接口按患者取数，大屏的患者身份由 URL 传入，两处姓名才一致 */
const listParams = { patientName, patientIdCard }
/* 列表返回的日期都带时分秒，时间轴与「最近」只用到日期 */
const dayOf = (value: string) => String(value).slice(0, 10)

/* 每个 tab 的列表都直接来自档案页对应的查询接口。
   卡片统一成「标题=这次记录是什么，副行=这份记录的结论」：
   门诊/住院/病理的标题取科室与医师（这些列表里 diag 才是诊断结论），
   影像/检验的标题本来就是检查项目名，结论各取报告里那句结论性的字段 */
const archives: Record<string, ArchiveItem[]> = {
  全国影像检查: buildStudyList(listParams).data.map((row: any) => ({
    date: dayOf(row.check_date),
    org: row.hospital_name,
    title: row.item_name,
    detail: row.rpt_seeing,
    detailLabel: '结论',
  })),
  检验记录: buildTestList(listParams).data.map((row: any) => ({
    date: dayOf(row.testDt),
    org: row.organName,
    title: row.projName,
    detail: row.clinicDiagnose,
    detailLabel: '诊断',
  })),
  门诊记录: buildVisitList(listParams).data.map((row: any) => ({
    date: dayOf(row.visitDt),
    org: row.organName,
    title: `${row.dept}　${row.doctor}`,
    detail: row.diag,
    detailLabel: '诊断',
  })),
  住院记录: buildStayList(listParams).data.map((row: any) => ({
    date: dayOf(row.inDate),
    org: row.organName,
    title: `${row.dept}　住院 ${row.bedDays} 天`,
    detail: row.diag,
    detailLabel: '诊断',
  })),
  病理记录: buildPathologyList(listParams).data.map((row: any) => ({
    date: dayOf(row.sendDate),
    org: row.organName,
    title: `${row.dept}　${row.sendDoctor}`,
    detail: row.diag,
    detailLabel: '病理诊断',
  })),
  穿戴数据: buildVitalList(listParams).data.map((row: any) => ({
    date: dayOf(row.monitorDate),
    org: row.device,
    title: row.title,
    detail: row.source,
    detailLabel: '来源',
  })),
}

/* 体检报告 / 用药记录：档案页也只有页签、没有数据，点了只提示不切换 */
const NO_DATA_TABS = ['体检报告', '用药记录']

/* 时间轴只展示最近 3 年（从今天往前推 3 年的滚动窗口）的记录，
   条数由窗口内的数据本身决定，不再写死条数上限 */
const RECENT_YEARS_CUTOFF = (() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 3)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
})()

const sortByDateDesc = (list: ArchiveItem[]) => list.slice().sort((a, b) => b.date.localeCompare(a.date))
const archiveItems = computed(() =>
  sortByDateDesc(archives[archiveTab.value] ?? []).filter((item) => item.date >= RECENT_YEARS_CUTOFF),
)

/* 轻提示：未接入的页签点了给一句反馈（没有 antd message 可用，自己挂一个） */
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined
const showToast = (text: string) => {
  toast.value = text
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 2000)
}
const switchArchiveTab = (tab: string) => {
  if (NO_DATA_TABS.includes(tab)) {
    showToast('数据暂未接入，敬请期待')
    return
  }
  archiveTab.value = tab
}

/* 全景视图卡片的次数与最近时间：都从对应 tab 的列表统计，不再写死 */
const countOf = (tab: string) => (archives[tab] ?? []).length
const latestOf = (tab: string) => {
  const latest = sortByDateDesc(archives[tab] ?? [])[0]
  return latest ? `最近:${latest.date}` : ''
}

/* 各线图圆点在切图内的坐标（@2x 像素）与切图宽度 */
const LINE_DOTS: Record<string, { w: number; x: number; y: number }> = {
  '组 2248@2x': { w: 334, x: 7.5, y: 21 },
  '组 2249@2x': { w: 271, x: 263.5, y: 5.5 },
  '组 2250@2x': { w: 274, x: 5, y: 14 },
  '组 2251@2x': { w: 285, x: 277.5, y: 5.5 },
  '组 2252@2x': { w: 274, x: 5.5, y: 4.5 },
  '组 2253@2x': { w: 279, x: 270.5, y: 5.5 },
  '组 2254@2x': { w: 268, x: 13.5, y: 50 },
  '组 2255@2x': { w: 257, x: 250, y: 142 },
}
/* 圆点钉在卡片内角：距卡边（水平内嵌）与距卡顶的距离 */
const DOT_INSET = 4
const DOT_TOP = 4

/* 设计稿 px → rem：postcss-pxtorem 只转换 CSS 文件，
   内联样式必须手动换算，否则小屏下线条不随视口缩放、圆点会脱离卡片 */
const px2rem = (v: number) => `${v / 16}rem`

/* 连接线摆放：圆点钉在卡片内角（左卡右上角 / 右卡左上角），
   以远端（人体侧）为支点微调缩放，保证线尾落点不动 */
const lineStyle = (item: RecordItem) => {
  const dy = item.lineDy ?? 0
  const meta = item.line ? LINE_DOTS[item.line] : undefined
  if (!meta) return { top: px2rem((item.lineY ?? 24) + dy), width: px2rem(item.lineW ?? 240) }
  const baseW = item.lineW ?? 240
  /* 圆点到线图远端的图内距离：左卡远端在右侧，右卡远端在左侧 */
  const farSpan = item.side === 'left' ? meta.w - meta.x : meta.x
  const scale = (baseW + DOT_INSET) / farSpan
  const w = meta.w * scale
  const dotX = meta.x * scale
  const dotY = meta.y * scale
  const pos =
    item.side === 'left'
      ? { left: `calc(100% - ${px2rem(DOT_INSET + dotX)})` }
      : { right: `calc(100% - ${px2rem(DOT_INSET + w - dotX)})` }
  /* 手动微调：以圆点为轴整体旋转，线尾方向改变而圆点不动 */
  const rot = item.lineRot
    ? { transform: `rotate(${item.lineRot}deg)`, transformOrigin: `${px2rem(dotX)} ${px2rem(dotY)}` }
    : {}
  return { ...pos, top: px2rem(DOT_TOP - dotY + dy), width: px2rem(w), ...rot }
}



interface RecordItem {
  title: string
  value?: string
  unit?: string
  date?: string
  sub?: string
  icon: string
  x: number
  y: number
  side: 'left' | 'right'
  /* 图标底色色调 */
  tone?: 'blue' | 'orange' | 'red' | 'green' | 'gray'
  /* 空态：整卡置灰（体检报告 / 用药记录） */
  variant?: 'empty'
  /* 连接线切图（slices 下文件名，含 @2x） */
  line?: string
  /* 线条起点距卡片顶部的纵向位置（px，可为负） */
  lineY?: number
  /* 线条显示宽度（px） */
  lineW?: number
  /* 线条手动微调：绕圆点旋转角度（deg，正=顺时针） */
  lineRot?: number
  /* 线条手动微调：整体上下平移（px，正=向下） */
  lineDy?: number
}

/* x = 距本侧边界百分比（left 贴左、right 贴右），y = 距顶部百分比 */
/* 次数 = 对应 tab 列表的全量条数，最近时间 = 列表里最新一条的日期 */
const records: RecordItem[] = [
  { title: '门诊记录', value: String(countOf('门诊记录')), unit: '次', date: latestOf('门诊记录'), icon: 'l_2187', tone: 'blue', x: 6.85, y: 8, side: 'left', line: '组 2248@2x', lineY: -5, lineW: 254 },
  { title: '住院记录', value: String(countOf('住院记录')), unit: '次', date: latestOf('住院记录'), icon: 'l_2213', tone: 'orange', x: 6.85, y: 12, side: 'right', line: '组 2249@2x', lineY: -46, lineW: 231 },
  { title: '全国影像检查', value: String(countOf('全国影像检查')), unit: '次', date: latestOf('全国影像检查'), icon: 'l_2210', tone: 'red', x: 6.85, y: 29, side: 'left', line: '组 2250@2x', lineY: 1, lineW: 241 },
  { title: '检验记录', value: String(countOf('检验记录')), unit: '次', date: latestOf('检验记录'), icon: 'l_2214', tone: 'green', x: 6.85, y: 37, side: 'right', line: '组 2251@2x', lineY: -34, lineW: 222 },
  { title: '病理记录', value: String(countOf('病理记录')), unit: '份', date: latestOf('病理记录'), icon: 'l_2211', tone: 'green', x: 6.85, y: 53, side: 'left', line: '组 2252@2x', lineY: 8, lineW: 245 },
  { title: '穿戴数据', value: String(countOf('穿戴数据')), unit: '份', date: latestOf('穿戴数据'), icon: 'l_2215', tone: 'blue', x: 6.85, y: 62, side: 'right', line: '组 2253@2x', lineY: -20, lineW: 204 },
  /* 体检报告 / 用药记录：功能未接入，与档案页的置灰页签对应 */
  { title: '体检报告', date: '暂未接入', icon: 'l_2212', tone: 'gray', x: 6.85, y: 78, side: 'left', variant: 'empty', line: '组 2254@2x', lineY: -28, lineW: 211, lineRot: -1.3 },
  { title: '用药记录', date: '暂未接入', icon: 'l_2216', tone: 'gray', x: 6.85, y: 86, side: 'right', variant: 'empty', line: '组 2255@2x', lineY: -40, lineW: 225, lineRot: 1, lineDy: 15 },
]

/* 大屏在 iframe 里跨进程，拿不到父页面的 router：跳转意图统一 postMessage 给外层 */
const navigateTo = (path: string) => {
  window.parent.postMessage({ type: 'portraitNavigate', path }, '*')
}

/* 智能服务的对外工作台，不在主应用路由里，直接开新标签 */
const openServiceMore = () => {
  window.open('https://agentoperation.tssz.qzz.io/#/terminal-user?view=ai-workbench', '_blank')
}

/* 医保健康档案页签 → 路由。各查询页就是一条路由，路由一命中那边的页签就会选中，
   所以「代入 tab」把路由带过去就够了 */
const TAB_ROUTES: Record<string, string> = {
  门诊记录: '/outpatient/index',
  住院记录: '/inpatient/index',
  全国影像检查: '/home/index',
  检验记录: '/inspection/index',
  病理记录: '/pathology/index',
  穿戴数据: '/vital/index',
}
/* 页签名跟全景视图卡片标题、档案页页签完全一致，所以卡片直接拿标题当页签名；
   体检报告 / 用药记录在档案页也只有页签没有数据，查不到路由时只给提示 */
const openArchiveTab = (tab: string) => {
  const path = TAB_ROUTES[tab]
  if (!path) {
    showToast('数据暂未接入，敬请期待')
    return
  }
  navigateTo(path)
}
const openRecord = (item: RecordItem) => openArchiveTab(item.title)

interface VitalItem {
  title: string
  sub: string
  value: string
  unit?: string
  extra?: string
  valueClass: string
  icon: string
  /* 切片墨量不同，用缩放系数做视觉补偿，使图标看起来等大 */
  iconScale?: number
  arrow?: string
  arrowClass?: string
}

const vitals: VitalItem[] = [
  { title: '血压控制', sub: '近7天平均血压', value: '128/82', unit: 'mmHg', valueClass: 'red', icon: 'l_2184', iconScale: 0.82 },
  { title: '血糖管理', sub: '最近血糖', value: '6.8', unit: 'mmol/L', valueClass: 'red', icon: 'l_2183', iconScale: 0.95, arrow: '↑', arrowClass: 'up' },
  { title: '体重管理', sub: 'BMI', value: '26.4', extra: '（超重）', valueClass: 'red', icon: 'l_2360', iconScale: 0.8 },
  { title: '心率监测', sub: '近7天静息心率', value: '72', unit: '次/分', valueClass: 'green', icon: 'l_2215', iconScale: 0.9 },
]

const riskGroups = [
  { label: '基础信息', tags: ['待接入', '待接入'] },
  { label: '既往史', tags: ['待接入'] },
  { label: '疾病标签', tags: ['待接入', '待接入'] },
  { label: '风险分层', tags: ['待接入'] },
]

const services = [
  { name: '四肢骨折', desc: '肢体损伤识别', icon: 'l_2231' },
  { name: '冠脉钙化', desc: '血管硬化评估', icon: 'l_2232' },
  { name: '肋骨骨折', desc: '胸部损伤检测', icon: 'l_2233' },
  { name: '骨密度分析', desc: '骨质疏松评估', icon: 'l_2234' },
  { name: '肺结节筛查', desc: '早期病灶识别', icon: 'l_2235' },
  { name: '肺炎检测', desc: '肺部炎症评估', icon: 'l_2236' },
]
</script>

<style scoped>
/* 外层视口：撑满屏幕并隐藏溢出，内部按设计稿等比缩放后自动填充 */
.screen {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #eef4fb 0%, #dbe8f8 100%);
}

.stage {
  position: relative;
  width: 100%;
  height: 100%;
}

:global(html),
:global(body),
:global(#app) {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #eef4fb 0%, #dbe8f8 100%);
}

/* 设计稿 1920 x 1080 → 120rem x 67.5rem（1rem = 16px @1920）；
   用 max() 让画布在视口更宽/更高时自动填充，无滚动条也不裁剪 */
.dashboard {
  --fs-10: 10px;
  --fs-11: 11px;
  --fs-12: 12px;
  --fs-13: 13px;
  --fs-14: 14px;
  --fs-16: 16px;
  --fs-18: 18px;
  --fs-19: 19px;
  --fs-20: 20px;
  --fs-22: 22px;
  --fs-24: 24px;

  /* 色板：与「医保信息档案」（src/views/archive/style/index.less 里的变量）同值，
     字号/字重也按那边的层级来 —— 面板标题 16、分组标题与正文 14、字段名 13、说明 12 */
  --ink2: #1e293b;   /* 正文与字段值 */
  --ink3: #475569;   /* 面板标题 / 分组标题 */
  --ink4: #94a3b8;   /* 说明、提示、极小字 */
  --line2: #f1f5f9;  /* 占位标签底色 */
  --ink-sub: #666;   /* 字段名 / 次级文字 */
  --blue: #0369fc;   /* 唯一主蓝 */
  --green: #059669;  /* 语义绿（正常/达标） */
  --red: #dc2626;    /* 语义红（异常） */

  --pad-x: 20px;
  --gap: 25px;
  --side-w: 451px;
  --card-w: 222px;

  position: relative;
  width: max(120rem, 100vw);
  height: max(68rem, 95vh);
  display: flex;
  flex-direction: column;
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  color: var(--ink2);
}

/* ========== Header ========== */
.header {
  flex-shrink: 0;
  min-height: 0px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px var(--pad-x);
}

.logo {
  width: 64px;
  height: auto;
  flex-shrink: 0;
}

.site-title {
  font-size: var(--fs-20);
  font-weight: 600;
  color: var(--ink2);
  margin: 0;
  white-space: nowrap;
}

.header-divider {
  width: 1px;
  height: 24px;
  background: rgba(3, 105, 252, 0.12);
  margin: 0 24px;
  flex-shrink: 0;
}

.nav {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  min-width: 0;
  overflow: hidden;
}

.nav-item {
  height: 32px;
  line-height: 32px;
  padding: 0 20px;
  border-radius: 999px;
  background: rgba(242, 243, 245, 0.25);
  font-size: var(--fs-14);
  color: var(--ink-sub);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
}

.nav-item.active {
  background: #d7e4fd;
  color: var(--blue);
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
  flex-shrink: 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 182px;
  height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f1f5f9;
  font-size: var(--fs-14);
  color: #ccc;
  white-space: nowrap;
  overflow: hidden;
}

.search-icon {
  width: 22px;
  height: auto;
  flex-shrink: 0;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.action-btn img {
  width: 26px;
  height: auto;
}

.ai-badge {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-13);
  font-weight: 700;
  color: var(--ink2);
  flex-shrink: 0;
}

/* ========== 主体布局（三列 flex） ========== */
.main {
  flex: 1;
  position: relative;
  display: flex;
  gap: var(--gap);
  padding: 21px var(--pad-x) 26px;
  min-height: 560px;
  overflow: hidden;
}

/* 人体背景：等比完整显示，底部避开智能服务栏，保证人体不被遮挡 */
.body-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 150px;
  width: 100%;
  height: calc(100% - 150px);
  object-fit: contain;
  pointer-events: none;
  z-index: 1;
}

.left-column,
.right-column {
  flex: 0 0 var(--side-w);
  max-width: var(--side-w);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  min-width: 0;
}

.left-column {
  gap: var(--gap);
}

.right-column {
  gap: 20px;
  /* 底部智能服务栏是绝对定位浮在内容之上的（bottom 26px + 高 124px），
     不预留这段高度的话「近期体征动态」第二行卡片会被压住 */
  padding-bottom: 180px;
}

.center-column {
  flex: 1 1 auto;
  position: relative;
  z-index: 2;
  min-width: 0;
}

/* ========== 通用面板与标题 ========== */
.panel {
  border-radius: 12px;
  padding: 16px 17px;
}

.panel-title-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--fs-16);
  /* 面板标题对齐「医保信息档案」的 .ch-title：16px / 700 / --ink3 */
  font-weight: 700;
  color: var(--ink3);
}

.title-bar {
  width: 5px;
  height: 19px;
  border-radius: 3px;
  background: var(--blue);
  flex-shrink: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.more-link {
  font-size: var(--fs-14);
  color: var(--blue);
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
}

.more-link .arrow {
  margin-left: 2px;
}

/* ========== 左侧：个人信息 + 账户概览 ========== */
.profile-panel {
  background: #fff;
}

.profile-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0px 0px 12px 1px rgba(0,80,160,0.1);
  border-radius: 12px 12px 12px 12px;
}

.avatar {
  width: 71px;
  height: 71px;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.name {
  font-size: var(--fs-20);
  font-weight: 700;
  color: var(--ink2);
}

.status-tag {
  height: 26px;
  line-height: 26px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(30, 185, 186, 0.13);
  color: rgba(57, 152, 153, 1);
  font-size: var(--fs-12);
  white-space: nowrap;
}

.sub {
  font-size: var(--fs-14);
  color: var(--ink-sub);
  margin-top: 14px;
}

.meta {
  font-size: var(--fs-14);
  color: var(--ink-sub);
  margin-top: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-actions {
  width: 100%;
  margin-top: 3px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 8px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-14);
  color: var(--ink-sub);
  min-width: 0;
  
}

.action-item img {
  /* 定高不定宽：图标源图长宽比不一（慢特病 48x36、签约医生 32x40），
     按宽度对齐会让 32x40 那种高出一截，看着比同类大一圈 */
  height: 18px;
  width: auto;
  flex-shrink: 0;
}

.action-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 账户概览 */
.account-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.account-item {
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  min-width: 0;
  border-radius: 9px 9px 9px 9px;
  border: 1px solid rgba(10,129,255,0.12);
}

/* 对齐「医保信息档案」财务卡片标题（.mc-lbl：13px / --ink4 / 400） */
.account-label {
  font-size: var(--fs-13);
  font-weight: 400;
  color: var(--ink4);
}

.account-value {
  font-size: var(--fs-18);
  font-weight: 700;
  color: var(--blue);
  margin-top: 4px;
  /* 固定行高：普通值与 large 值占同样的行高，让下方进度条/趋势行对齐 */
  line-height: 32px;
}

.account-value.large {
  font-size: var(--fs-24);
}

/* 家庭共济未开放：占位文字，比真实金额（18px）降一档 */
.account-value.muted {
  font-size: var(--fs-16);
  color: var(--ink4);
}

.account-progress {
  height: 4px;
  background: #b8d2f3;
  border-radius: 999px;
  margin-top: 10px;
}

.account-progress-fill {
  height: 100%;
  background: var(--blue);
  border-radius: 999px;
}

/* 说明行统一一档：12px / --ink4，与医保信息档案的 .mc-trend 及各面板小字同色同字号 */
.trend {
  font-size: var(--fs-12);
  color: var(--ink4);
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 涨跌箭头着色：费用升=红、降=绿；无涨跌的说明行不带箭头，保持上面的灰 */
.trend-arrow.up {
  color: var(--red);
}

.trend-arrow.down {
  color: var(--green);
}

.family-row {
  margin-top: 12px;
  background: rgba(214, 214, 214, 0.48);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  
}

.family-avatars {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

/* 圆框固定 26px，保证三个头像尺寸一致 */
.family-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(207, 208, 209, 0.38);
}

.family-avatar img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* 切图内人物剪影高矮不一（男 72 / 女 75 / 小孩 64，@2x px），
   在圆框内各自放大，使三个人物视觉大小一致（框大小不变） */
.family-avatars .family-avatar:nth-child(1) img {
  transform: scale(1.04);
}

.family-avatars .family-avatar:nth-child(3) img {
  transform: scale(1.17);
}

/* ========== 左侧：医保信息总览 ========== */
.info-panel {
  /* 仍然吃满左栏剩余高度（和下方对齐才对得上中间的卡片），
     底部留白靠内容撑高来减少，不靠缩面板 */
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* 页签：下划线式，整体居中，选中蓝字 + 蓝色下划线，未选中灰字 */
.info-tabs {
  display: flex;
  justify-content: center;
  gap: 56px;
  border-bottom: 1px solid #e8eef5;
  margin: 14px 0 16px;
}

.info-tab {
  position: relative;
  padding: 0 2px 12px;
  border: none;
  background: transparent;
  color: var(--ink-sub);
  font-family: inherit;
  font-size: var(--fs-14);
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s;
}

.info-tab:hover {
  color: var(--blue);
}

.info-tab:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
}

.info-tab.active {
  color: var(--blue);
  font-weight: 500;
}

/* 选中的下划线压在灰色底线上，两端圆头 */
.info-tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  border-radius: 3px;
  background: var(--blue);
}

.info-body {
  display: flex;
  gap: 0;
  flex: 1;
  min-height: 0;
}

/* 卡片式 tab（商业保险 / 长护险）：纵向卡片列表，超出可滚动 */
.info-body--cards {
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
}

.info-card {
  flex: none;
  padding: 16px;
  border: 1px solid #e6ebf3;
  border-radius: 8px;
  background: #fff;
}

/* 暂无数据：虚线灰卡，跟档案页「商业保险」占位卡一致 */
.info-card.empty {
  border-style: dashed;
  border-color: #e2e8f0;
  background: #f8fafc;
}

/* 长护险：浅绿卡 */
.info-card.green {
  border-color: #ddfbe7;
  background: #f7fefa;
}

/* 顶栏：机构名 + 右上角补充信息，下面一条分隔线收口 */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px dashed #e2e8f0;
}

.info-card.green .card-head {
  border-bottom-style: solid;
  border-bottom-color: #ddfbe7;
}

/* 占位卡的顶栏上下间距也跟档案页一样收紧，卡片整体更矮 */
.info-card.empty .card-head {
  padding-bottom: 12px;
  margin-bottom: 12px;
}

.card-title {
  font-size: var(--fs-14);
  font-weight: 400;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-extra {
  flex: none;
  align-self: flex-start;
  font-size: var(--fs-13);
  color: #94a3b8;
  white-space: nowrap;
}

/* 长护险的评定结论是这张卡的看点：字号跟机构名同档，走绿字 */
.card-extra.green {
  font-size: var(--fs-14);
  color: #059669;
}

/* 置灰卡整卡一个灰，层次只靠字号区分 */
.info-card.empty .card-title,
.info-card.empty .card-extra,
.info-card.empty .field-label,
.info-card.empty .field-value {
  color: #94a3b8;
}

.card-fields {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.card-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.field-label {
  font-size: var(--fs-13);
  /* 跟「参保状态」列表的字段名同一档灰（档案页的卡片也是这个色） */
  color: var(--ink-sub);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.field-value {
  font-size: var(--fs-14);
  font-weight: 400;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 长护险正向状态 */
.field-value.green {
  color: #059669;
}

.info-list {
  flex: 1;
  min-width: 0;
  /* 左缩进对齐「医保信息档案」参保信息分组内的字段行（.mva-cond-list padding: 9px 14px） */
  padding-left: 14px;
  padding-right: 20px;
}

/* label 后紧跟 value，不留中间空白 */
.info-row {
  display: flex;
  gap: 8px;
  font-size: var(--fs-14);
  /* 行距放宽，把面板底部那片空白填掉一部分 */
  padding: 16px 0;
  color: var(--ink-sub);
}

/* 值前的状态点（正常参保） */
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 6px;
  vertical-align: middle;
  border-radius: 50%;
  background: var(--blue);
}

.info-row > span:first-child {
  flex: 0 0 auto;
  white-space: nowrap;
}

.info-row .val {
  color: var(--ink2);
  font-weight: 500;
  text-align: left;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-ring-wrap {
  width: 150px;
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 「门诊费用」与左侧首行「参保状态」顶对齐：不居中，补上 .info-row 的上内边距 */
  justify-content: flex-start;
  padding-top: 16px;
  gap: 12px;
  padding-left: 10px;
  border-left: 1px solid #edf1f7;
}

.ring-box {
  position: relative;
  width: 104px;
  height: 104px;
  /* 圆环可点：点一下切换下一类费用 */
  cursor: pointer;
}

.ring-box:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
  border-radius: 50%;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring circle {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
}

.progress-ring .track {
  stroke: #dbe4f8;
}

.progress-ring .fill {
  stroke: url(#ringGradient);
  stroke-dasharray: 264;
  stroke-dashoffset: 100;
}

.ring-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-18);
  font-weight: 700;
  color: var(--blue);
}

.progress-label {
  font-size: var(--fs-13);
  color: var(--ink2);
  white-space: nowrap;
}

.progress-amount {
  font-size: var(--fs-12);
  color: var(--blue);
  white-space: nowrap;
}

/* ========== 中间：顶部 tabs + 浮动卡片 ========== */
/* 切换卡：浅蓝底胶囊容器，选中项白底蓝字带投影 */
.view-tabs {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: #edf2fb;
  border: 1px solid #e6edfa;
  box-shadow: 0 2px 10px rgba(29, 108, 236, 0.07);
  z-index: 3;
}

.view-tab {
  height: 28px;
  line-height: 28px;
  padding: 0 20px;
  border: none;
  border-radius: 999px;
  background: transparent;
  font-family: inherit;
  font-size: var(--fs-14);
  color: #5b6b85;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
}

.view-tab:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
}

.view-tab.active {
  background: #fff;
  color: var(--blue);
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(29, 108, 236, 0.18);
}

/* ========== 中间：全生命周期时间轴（医保健康档案） ========== */
.archive-panel {
  position: absolute;
  left: 0;
  right: 0;
  top: 48px;
  bottom: 200px;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}

/* 分类分段控件：浅灰容器 + 选中项白底 */
.archive-tabs {
  display: flex;
  gap: 2px;
  /* 标题到页签的间距对齐「近期体征动态」标题到卡片的 14px（.vitals-grid margin-top） */
  margin-top: 14px;
  padding: 4px;
  border-radius: 10px;
  background: #f4f6f9;
}

.archive-tab {
  flex: 1;
  height: 32px;
  border: none;
  border-radius: 7px;
  background: transparent;
  font-family: inherit;
  font-size: var(--fs-14);
  color: var(--ink-sub);
  cursor: pointer;
  white-space: nowrap;
}

.archive-tab:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
}

/* 选中态同上：白底 + 主蓝字带投影（原来是 #001270 深蓝，看着发黑） */
.archive-tab.active {
  background: #fff;
  color: var(--blue);
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(29, 108, 236, 0.18);
}

/* 未接入的页签置灰，但仍可点（点了弹提示），和档案页的处理一致 */
.archive-tab.is-disabled {
  color: rgba(0, 0, 0, 0.25);
}

/* 汇总行：最近3年 + 数量 */
.archive-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 18px 0 14px;
  font-size: var(--fs-14);
  color: var(--ink2);
}

.archive-meta-count {
  padding: 4px 10px;
  border-radius: 6px;
  background: #f1f3f7;
  font-size: var(--fs-14);
  color: var(--ink-sub);
}

/* 时间轴列表：超出可滚动 */
.archive-timeline {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.timeline-item {
  position: relative;
  padding-left: 28px;
  padding-bottom: 20px;
}

/* 竖轴：每个节点向下延伸，末节点只留一小截 */
.timeline-item::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 12px;
  bottom: 0;
  width: 2px;
  background: #cfe0ff;
}

.timeline-item:last-child::before {
  bottom: auto;
  height: 16px;
}

.timeline-dot {
  position: absolute;
  left: 1px;
  top: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--blue);
}

.timeline-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

/* 时间轴内的文字统一 14px，不再分标题/正文/日期几档 */
.timeline-date {
  padding: 3px 8px;
  border-radius: 4px;
  background: #f1f3f7;
  font-size: var(--fs-14);
  color: var(--ink-sub);
}

.timeline-org {
  font-size: var(--fs-14);
  color: var(--ink4);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-card {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  background: #eef4ff;
}

.timeline-card-icon {
  flex: none;
  width: 22px;
  height: 22px;
  fill: none;
  stroke: var(--blue);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.timeline-card-body {
  flex: 1;
  min-width: 0;
}

.timeline-card-title {
  margin: 0;
  font-size: var(--fs-14);
  font-weight: 600;
  color: var(--ink2);
}

.timeline-card-divider {
  margin: 10px 0;
  border-top: 1px solid #dfe8f8;
}

.timeline-card-detail {
  margin: 0;
  font-size: var(--fs-14);
  line-height: 1.6;
  color: var(--ink2);
}

.timeline-card-detail .detail-label {
  color: var(--ink4);
}

/* 卡片定位区域上界收到服务栏之上，避免最后一张卡片被智能服务栏遮挡 */
.record-cards {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 200px;
  z-index: 2;
}

.record-card {
  position: absolute;
  width: var(--card-w);
  max-width: 44%;
  min-height: 110px;
  background: rgba(255, 255, 255, 0.72);
  border-radius: 12px;
  padding: 12px 14px;
  display: block;
  box-shadow: 0 2px 14px 1px rgba(112, 166, 233, 0.3);
  /* 卡片可点：点了跳回医保健康档案对应的查询页签 */
  cursor: pointer;
}

.record-card:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
}

/* 连接线：位于卡片白底之上、文字图标之下，圆点钉在卡片内角 */
.record-line {
  position: absolute;
  z-index: 0;
  height: auto;
  pointer-events: none;
}

/* 卡片贴各自一侧边界定位，随列宽自适应，不依赖固定列宽 */
.record-card.left {
  left: var(--x);
  top: var(--y);
}

.record-card.right {
  right: var(--x);
  top: var(--y);
}

.record-card.empty {
  background: rgba(236, 236, 236, 0.72);
  box-shadow: none;
}

/* 卡片指向人体的连接线与端点 */
/* .record-card::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 42px;
  height: 1px;
  background: linear-gradient(90deg, rgba(82, 140, 255, 0.65), rgba(82, 140, 255, 0.2));
}

.record-card::before {
  content: '';
  position: absolute;
  top: 50%;
  width: 6px;
  height: 6px;
  margin-top: -3px;
  border-radius: 50%;
  background: #528cff;
  box-shadow: 0 0 0 3px rgba(82, 140, 255, 0.18);
}

.record-card.left::after {
  right: -46px;
}

.record-card.left::before {
  right: -54px;
}

.record-card.right::after {
  left: -46px;
  transform: scaleX(-1);
}

.record-card.right::before {
  left: -54px;
} */

.record-main {
  position: relative;
  z-index: 1;
  display: block;
}

/* 全景卡片：分组标题 16，统计条数 22（卡片里最大的一档），单位/说明 16，日期 14 */
.record-title {
  padding-right: 64px;
  font-size: var(--fs-16);
  font-weight: 600;
  color: var(--ink2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-value-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.record-value {
  font-size: var(--fs-22);
  font-weight: 700;
  color: var(--blue);
}

.record-unit {
  font-size: var(--fs-16);
  color: var(--ink2);
}

.record-sub {
  font-size: var(--fs-16);
  color: var(--ink-sub);
}

.record-date {
  font-size: var(--fs-14);
  color: var(--ink4);
  margin-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-date.muted {
  color: rgba(148, 163, 184, 0.7);
}

/* 图标置于卡片右上角，无背景色 */
.record-icon-box {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 1;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.record-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}

/* ========== 右侧：健康风险标签 ========== */
.risk-panel {
  background: #fff;
  /* 高度随内容收拢即可；原先写死 390px 会在内容下方撑出一大片空白 */
  flex: 0 0 auto;
}

/* 头部「暂未开放」占位标签：与「医保信息档案」的 .mva-sec-badge 同款
   （--line2 底 + --ink4 字 + 14px/600，不写死高度，由字号和 padding 撑开） */
.risk-status {
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--line2);
  color: var(--ink4);
  font-size: var(--fs-14);
  font-weight: 600;
  white-space: nowrap;
}

.risk-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 14px;
}

.risk-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.risk-label {
  font-size: var(--fs-14);
  /* 分组标题对齐档案页的 .mva-group-title：14px / 600 / --ink3 */
  color: var(--ink3);
  font-weight: 600;
}

.risk-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 0;
}

/* 「待添加」浅灰圆角药丸 */
.risk-tags span {
  height: 28px;
  line-height: 28px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid #e3e6eb;
  /* background: #f7f9fc; */
  color: var(--ink4);
  font-size: var(--fs-13);
  white-space: nowrap;
}

/* ========== 右侧：近期体征动态 ========== */
.vitals-panel {
  /* 吃掉右侧列的剩余高度，让 2x2 卡片被 grid 均分铺满，而不是贴着 min-height 缩水 */
  flex: 1 1 auto;
  min-height: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.vitals-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  gap: 12px;
  margin-top: 14px;
  flex: 1;
  min-height: 0;
}

.vital-card {
  background: #fff;
  border: 1px solid rgba(29, 108, 236, 0.12);
  border-radius: 12px;
  padding: 16px;
  /* min-height: 148px; */
  box-shadow: 0 2px 8px rgba(112, 166, 233, 0.08);
}

.vital-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 固定正方形容器 + contain，配合 iconScale 视觉补偿，使图标等大 */
.vital-icon {
  width: 27px;
  height: 27px;
  object-fit: contain;
  object-position: center;
  flex-shrink: 0;
}

.vital-title {
  font-size: var(--fs-14);
  font-weight: 600;
  /* 与「健康风险标签」的分组标题（.risk-label）同色 */
  color: var(--ink3);
}

.vital-sub {
  /* 与「智能服务」副标题、财务卡标题（.account-label）统一 13px */
  font-size: var(--fs-13);
  color: var(--ink4);
  margin-top: 6px;
}

.vital-value-row {
  margin-top: 12px;
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
}

.vital-value {
  font-size: var(--fs-18);
  font-weight: 700;
}

.vital-value.red {
  color: var(--red);
}

.vital-value.green {
  color: var(--green);
}

.vital-unit {
  font-size: var(--fs-12);
  color: var(--ink-sub);
}

.vital-extra {
  font-size: var(--fs-14);
  color: var(--red);
  font-weight: 600;
}

.vital-arrow {
  font-size: var(--fs-12);
  color: #fc3c03;
  font-weight: 600;
}

/* ========== 底部智能服务：透明底 + 白色卡片横排 ========== */
.services-bar {
  position: absolute;
  left: calc(var(--pad-x) + var(--side-w) + var(--gap));
  right: var(--pad-x);
  bottom: 26px;
  min-height: 124px;
  background: #ffffff;
  box-shadow: 0 0 6px 1px rgba(112, 166, 233, 0.34);
  border-radius: 12px 12px 12px 12px;
  border: 1px solid #ffffff;
  display: flex;
  align-items: center;
  padding: 16px 24px;
  gap: 16px;
  z-index: 3;
  overflow: hidden;
}

.service-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--fs-19);
  font-weight: 600;
  color: var(--ink2);
  flex-shrink: 0;
  white-space: nowrap;
}

.service-brand img {
  width: 36px;
  height: auto;
}

.service-divider {
  width: 1px;
  height: 70px;
  background: #B8D2F3;
  flex-shrink: 0;
}

.service-list {
  flex: 1;
  display: flex;
  gap: 16px;
  min-width: 0;
}

/* 每个服务项：图标在左，名称/描述左对齐双行 */
.service-item {
  flex: 1 1 0;
  min-width: 0;
  height: 84px;
  background: #ffffff;
  border-radius: 12px;
  /* box-shadow: 0 0 6px 1px rgba(112, 166, 233, 0.16); */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 0 12px;
  border: 1px solid rgba(10,129,255,0.12);
  border-radius: 9px 9px 9px 9px;
}

.service-item img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}

.service-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  /* 标题与说明行的间距对齐「近期体征动态」的 .vital-sub（margin-top: 6px） */
  gap: 6px;
}

.service-name {
  font-size: var(--fs-14);
  font-weight: 600;
  color: var(--ink3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: left;
}

.service-desc {
  /* 与「近期体征动态」副标题、财务卡标题（.account-label）统一 13px */
  font-size: var(--fs-13);
  color: var(--ink4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: left;
}

.service-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-12);
  color: #7e7e7e;
  flex-shrink: 0;
  cursor: pointer;
}

.more-dots {
  display: flex;
  gap: 4px;
}

.more-dots span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #7e7e7e;
}

/* ========== 患者授权 ========== */
/* 未授权时各面板的空态提示 */
.auth-empty {
  flex: 1;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b8c4;
  font-size: var(--fs-14);
  letter-spacing: 1px;
}

.auth-empty--center {
  position: absolute;
  inset: 0;
  flex: none;
}

/* 未接入页签的轻提示：居中浮在内容之上，2 秒后自动消失 */
.screen-toast {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 998;
  padding: 9px 20px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: var(--fs-14);
  pointer-events: none;
}

</style>
