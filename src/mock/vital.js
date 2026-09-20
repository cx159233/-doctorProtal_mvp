/**
 * 体征记录（可穿戴设备监测）演示数据。
 *
 * 来源：doctorProtal_mvp 顶部导航「穿戴」tab。
 * 列表取自 src/data.ts 里 type:'wd' 的 6 条 healthRecords；
 * 详情取自 src/components/MedicalDetail.vue 的「穿戴数据详情」段落
 * （按 title 分支硬编码的监测概述与关键指标表，这里摊平成每条记录的字段）。
 * 参考范围 / 提示两列 MVP 只在详情表里写死，列表数据里没有，一并搬到这里。
 */

const monitorTitle = [
  { label: '平均心率', value: '72', unit: 'bpm', range: '60-100', hint: '正常', flag: '' },
  { label: '最低心率', value: '48', unit: 'bpm', range: '40-60', hint: '正常', flag: '' },
  { label: '最高心率', value: '128', unit: 'bpm', range: '100-160', hint: '↑', flag: 'up' },
  { label: '室性早搏', value: '2', unit: '次/24h', range: '< 100', hint: '正常', flag: '' },
  { label: 'HRV(SDNN)', value: '86', unit: 'ms', range: '50-100', hint: '正常', flag: '' }
]

const monitorSleep = [
  { label: '总睡眠时长', value: '7h12m', unit: '-', range: '7-9h', hint: '正常', flag: '' },
  { label: '深睡占比', value: '25', unit: '%', range: '20-25', hint: '正常', flag: '' },
  { label: 'AHI指数', value: '3.2', unit: '-', range: '< 5', hint: '正常', flag: '' },
  { label: '最低血氧', value: '93', unit: '%', range: '≥ 95', hint: '↓', flag: 'up' },
  { label: '鼾声占比', value: '8', unit: '%', range: '< 10', hint: '正常', flag: '' }
]

const monitorBp = [
  { label: '收缩压均值', value: '138', unit: 'mmHg', range: '< 140', hint: '偏高', flag: 'up' },
  { label: '舒张压均值', value: '88', unit: 'mmHg', range: '< 90', hint: '正常', flag: '' },
  { label: '晨峰收缩压', value: '152', unit: 'mmHg', range: '< 135', hint: '↑', flag: 'up' },
  { label: '服药依从率', value: '100', unit: '%', range: '≥ 80', hint: '达标', flag: 'good' }
]

const monitorGlucose = [
  { label: '空腹血糖均值', value: '5.6', unit: 'mmol/L', range: '3.9-6.1', hint: '正常', flag: '' },
  { label: '餐后2h均值', value: '7.8', unit: 'mmol/L', range: '< 7.8', hint: '正常', flag: '' },
  { label: '血糖变异系数', value: '22', unit: '%', range: '< 36', hint: '正常', flag: '' },
  { label: 'TIR(3.9-10)', value: '92', unit: '%', range: '> 70', hint: '达标', flag: 'good' }
]

const monitorPatch = [
  { label: '总记录时长', value: '71.5h', unit: '-', range: '72h', hint: '正常', flag: '' },
  { label: '房性早搏', value: '15', unit: '次', range: '< 100', hint: '正常', flag: '' },
  { label: '室性早搏', value: '3', unit: '次', range: '< 100', hint: '正常', flag: '' },
  { label: '最长停搏', value: '1.8', unit: 's', range: '< 2.0', hint: '偏高', flag: 'up' }
]

const monitorBody = [
  { label: '体重', value: '78.5', unit: 'kg', range: '-', hint: '超重', flag: 'up' },
  { label: 'BMI', value: '27.8', unit: '-', range: '18.5-24', hint: '↑', flag: 'up' },
  { label: '体脂率', value: '26.2', unit: '%', range: '10-20', hint: '↑', flag: 'up' },
  { label: '内脏脂肪等级', value: '12', unit: '级', range: '1-9', hint: '↑', flag: 'up' },
  { label: '基础代谢', value: '1720', unit: 'kcal', range: '-', hint: '正常', flag: '' }
]

const RECORDS = [
  {
    index: 1,
    monitorDate: '2026-06-25',
    monitorTime: '08:32',
    device: 'Apple Watch Series 9',
    source: '个人穿戴',
    title: '24h动态心电监测报告',
    reportNo: 'WD501001',
    summary: '窦性心律，平均心率72bpm，偶发室性早搏(2次/24h)，ST-T未见明显异常。最长RR间期1.42s(睡眠中)。',
    metrics: monitorTitle
  },
  {
    index: 2,
    monitorDate: '2025-12-11',
    monitorTime: '22:15',
    device: '华为手环 9',
    source: '个人穿戴',
    title: '睡眠呼吸监测',
    reportNo: 'WD502001',
    summary: '总睡眠7h12m，深睡1h48m(25%)，浅睡4h20m，REM 1h4m。AHI指数3.2(正常<5)，SpO2最低93%，平均97%。鼾声时长占比8%。',
    metrics: monitorSleep
  },
  {
    index: 3,
    monitorDate: '2025-04-18',
    monitorTime: '18:45',
    device: '欧姆龙电子血压计',
    source: '居家监测',
    title: '家庭血压日志·本周汇总',
    reportNo: 'WD503001',
    summary: '本周测量14次，收缩压均值138mmHg，舒张压均值88mmHg。晨峰血压偏高(152/95)，下午时段控制良好(128/82)。服药依从率100%。',
    metrics: monitorBp
  },
  {
    index: 4,
    monitorDate: '2024-08-07',
    monitorTime: '07:15',
    device: '鱼跃血糖仪',
    source: '居家监测',
    title: '空腹及餐后血糖监测周报',
    reportNo: 'WD504001',
    summary: '空腹血糖均值5.6mmol/L，餐后2h血糖均值7.8mmol/L。1次餐后偏高(9.2mmol/L，对应晚餐)，其余在目标范围内。连续葡萄糖监测(CGM)显示血糖变异系数22%。',
    metrics: monitorGlucose
  },
  {
    index: 5,
    monitorDate: '2023-05-19',
    monitorTime: '14:00',
    device: '康泰心电贴(CM-X)',
    source: '远程医疗',
    title: '72h连续心电贴片监测终评',
    reportNo: 'WD505001',
    summary: '总记录71.5h，窦性心律为主，偶发房性早搏(15次)，室性早搏(3次)。最长停搏1.8s(睡眠中)。心率变异性正常。QTc间期正常范围。结论：未见明显恶性心律失常。',
    metrics: monitorPatch
  },
  {
    index: 6,
    monitorDate: '2022-10-26',
    monitorTime: '09:30',
    device: '小米体脂秤 2',
    source: '居家监测',
    title: '体成分分析月报',
    reportNo: 'WD506001',
    summary: '体重78.5kg，BMI 27.8(超重)，体脂率26.2%(偏高)，肌肉量54.3kg，内脏脂肪等级12(偏高)，基础代谢1720kcal，身体年龄58岁。建议：增加有氧运动，控制饮食热量。',
    metrics: monitorBody
  }
]

// 列表查询时缓存一次患者，详情接口复用，保证两处姓名一致
const currentPatient = { name: '张伟', idCard: '320402197103154733' }

const recordIdOf = (item) => `VT${item.monitorDate.replace(/-/g, '')}${String(1001 + item.index)}`

const toRow = (item) => ({
  id: recordIdOf(item),
  name: currentPatient.name,
  patientIdCard: currentPatient.idCard,
  monitorDate: item.monitorDate,
  monitorTime: item.monitorTime,
  title: item.title,
  device: item.device,
  source: item.source,
  reportNo: item.reportNo
})

export function buildVitalList(params) {
  const patientName = params && params.patientName
  const patientIdCard = params && params.patientIdCard
  if (patientName) currentPatient.name = patientName
  if (patientIdCard) currentPatient.idCard = patientIdCard

  const data = RECORDS.slice()
    .sort((a, b) => b.monitorDate.localeCompare(a.monitorDate))
    .map(toRow)

  return {
    code: 200,
    message: 'ok',
    data,
    meta: { pagination: { current: 1, pageSize: 10, total: data.length } }
  }
}

export function buildVitalDetail(params) {
  const id = (params && (params.id || params.recordId)) || ''
  const item = RECORDS.find((r) => recordIdOf(r) === id) || RECORDS[0]

  return {
    code: 200,
    message: 'ok',
    data: {
      id: recordIdOf(item),
      name: currentPatient.name,
      systemPatientId: currentPatient.idCard,
      device: item.device,
      deviceVendor: item.device,
      source: item.source,
      title: item.title,
      reportNo: item.reportNo,
      monitorDate: item.monitorDate,
      monitorTime: item.monitorTime,
      summary: item.summary,
      metrics: item.metrics
    }
  }
}
