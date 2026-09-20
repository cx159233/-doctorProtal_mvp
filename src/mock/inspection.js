/**
 * 检验查询演示数据。
 * 列表字段、报告详情字段均按 src/views/home/inspection.vue 与
 * src/views/detail/report/inspection.vue 实际消费的字段名生成。
 */
import { readParam } from './index'

const HOSPITALS = [
  { hospitalName: '常州市第一人民医院', hospitalCode: '3204000001', organLevel: '三级甲等' },
  { hospitalName: '常州市第二人民医院', hospitalCode: '3204000002', organLevel: '三级甲等' },
  { hospitalName: '常州市中医医院', hospitalCode: '3204000003', organLevel: '三级甲等' },
  { hospitalName: '常州市妇幼保健院', hospitalCode: '3204000004', organLevel: '三级甲等' },
  { hospitalName: '常州市武进人民医院', hospitalCode: '3204000005', organLevel: '三级乙等' },
  { hospitalName: '常州市金坛区人民医院', hospitalCode: '3204000006', organLevel: '二级甲等' }
]

const DPT_NAMES = ['呼吸内科', '消化内科', '内分泌科', '心血管内科', '神经内科', '肾内科', '普外科', '骨科', '泌尿外科', '急诊科']
const TEST_DOCTORS = ['沈志强', '吴晓燕', '顾建华', '张丽娜', '徐鹏', '蒋文娟', '钱伟', '郝梅']
const REPORT_COLUMNS = [
  { fieldCode: 'itemName', fieldName: '检验项目' },
  { fieldCode: 'result', fieldName: '结果' },
  { fieldCode: 'unit', fieldName: '单位' },
  { fieldCode: 'refRange', fieldName: '参考范围' },
  { fieldCode: 'hint', fieldName: '提示' }
]

// [检验项目, 结果, 单位, 参考范围, 提示]
const toRows = (rows) => rows.map(([itemName, result, unit, refRange, hint = '']) => ({ itemName, result, unit, refRange, hint }))

const REPORTS = [
  {
    projName: '血常规',
    sampCnameRaw: '全血',
    sampClassRaw: '20260818C00183',
    instName: '迈瑞 BC-6800Plus',
    clinicDiagnose: '上呼吸道感染',
    rows: [
      ['白细胞计数 WBC', '6.85', '×10⁹/L', '3.5~9.5', ''],
      ['红细胞计数 RBC', '4.72', '×10¹²/L', '3.8~5.1', ''],
      ['血红蛋白 HGB', '142', 'g/L', '115~150', ''],
      ['血小板计数 PLT', '236', '×10⁹/L', '125~350', ''],
      ['中性粒细胞百分比', '62.4', '%', '40~75', ''],
      ['淋巴细胞百分比', '28.5', '%', '20~50', ''],
      ['C反应蛋白 CRP', '22.6', 'mg/L', '0~8', '↑']
    ]
  },
  {
    projName: '肝功能全套',
    sampCnameRaw: '血清',
    sampClassRaw: '20260521C00406',
    instName: '罗氏 Cobas 8000',
    clinicDiagnose: '慢性胃炎',
    rows: [
      ['丙氨酸氨基转移酶 ALT', '56', 'U/L', '7~40', '↑'],
      ['天门冬氨酸氨基转移酶 AST', '42', 'U/L', '13~35', '↑'],
      ['γ-谷氨酰转移酶 GGT', '78', 'U/L', '7~45', '↑'],
      ['总胆红素 TBIL', '15.8', 'μmol/L', '5~21', ''],
      ['直接胆红素 DBIL', '4.2', 'μmol/L', '0~7', ''],
      ['总蛋白 TP', '70.5', 'g/L', '65~85', ''],
      ['白蛋白 ALB', '43.2', 'g/L', '40~55', '']
    ]
  },
  {
    projName: '肾功能',
    sampCnameRaw: '血清',
    sampClassRaw: '20251203C00407',
    instName: '贝克曼 AU5800',
    clinicDiagnose: '高血压病 2级',
    rows: [
      ['尿素 UREA', '5.62', 'mmol/L', '2.9~8.2', ''],
      ['肌酐 CREA', '88', 'μmol/L', '57~97', ''],
      ['尿酸 UA', '386', 'μmol/L', '208~428', ''],
      ['胱抑素C CysC', '0.92', 'mg/L', '0.51~1.09', '']
    ]
  },
  {
    projName: '空腹血糖+糖化血红蛋白',
    sampCnameRaw: '血浆',
    sampClassRaw: '20250714C00215',
    instName: '西门子 ADVIA 2400',
    clinicDiagnose: '2型糖尿病',
    rows: [
      ['空腹血糖 GLU', '8.36', 'mmol/L', '3.9~6.1', '↑'],
      ['糖化血红蛋白 HbA1c', '7.8', '%', '4.0~6.0', '↑'],
      ['果糖胺 FMN', '2.86', 'mmol/L', '1.7~2.5', '↑']
    ]
  },
  {
    projName: '电解质',
    sampCnameRaw: '血清',
    sampClassRaw: '20241219C00331',
    instName: '贝克曼 AU5800',
    clinicDiagnose: '急性胃肠炎',
    rows: [
      ['钾 K', '3.28', 'mmol/L', '3.5~5.3', '↓'],
      ['钠 Na', '138.5', 'mmol/L', '137~147', ''],
      ['氯 CL', '102.6', 'mmol/L', '99~110', ''],
      ['钙 CA', '2.24', 'mmol/L', '2.11~2.52', ''],
      ['镁 MG', '0.86', 'mmol/L', '0.75~1.02', '']
    ]
  },
  {
    projName: '凝血功能',
    sampCnameRaw: '血浆(抗凝)',
    sampClassRaw: '20240608C00198',
    instName: '希森美康 CS-5100',
    clinicDiagnose: '冠心病',
    rows: [
      ['凝血酶原时间 PT', '12.6', 's', '11~14.5', ''],
      ['国际标准化比值 INR', '1.02', '', '0.8~1.2', ''],
      ['活化部分凝血活酶时间 APTT', '32.8', 's', '28~45', ''],
      ['纤维蛋白原 FIB', '3.42', 'g/L', '2~4', ''],
      ['D-二聚体 D-Dimer', '0.36', 'mg/L', '0~0.55', '']
    ]
  },
  {
    projName: '尿常规',
    sampCnameRaw: '尿液',
    sampClassRaw: '20231127C00077',
    instName: '迈瑞 UA-5600',
    clinicDiagnose: '泌尿系感染',
    rows: [
      ['尿白细胞 WBC', '68', '/μL', '0~28', '↑'],
      ['尿红细胞 RBC', '12', '/μL', '0~17', ''],
      ['尿蛋白 PRO', '1+', '', '阴性', '↑'],
      ['尿糖 GLU', '阴性', '', '阴性', ''],
      ['尿比重 SG', '1.018', '', '1.003~1.030', ''],
      ['酸碱度 pH', '6.5', '', '4.5~8.0', '']
    ]
  },
  {
    projName: '甲状腺功能三项',
    sampCnameRaw: '血清',
    sampClassRaw: '20230316C00512',
    instName: '罗氏 Cobas 8000',
    clinicDiagnose: '甲状腺功能亢进',
    rows: [
      ['促甲状腺激素 TSH', '0.02', 'μIU/mL', '0.35~4.94', '↓'],
      ['游离三碘甲状腺原氨酸 FT3', '9.86', 'pmol/L', '2.63~5.7', '↑'],
      ['游离甲状腺素 FT4', '28.4', 'pmol/L', '9.01~19.05', '↑']
    ]
  },
  {
    projName: '心肌酶谱',
    sampCnameRaw: '血清',
    sampClassRaw: '20221206C00263',
    instName: '贝克曼 AU5800',
    clinicDiagnose: '胸痛待查',
    rows: [
      ['肌酸激酶 CK', '118', 'U/L', '38~174', ''],
      ['肌酸激酶同工酶 CK-MB', '14.2', 'U/L', '0~24', ''],
      ['乳酸脱氢酶 LDH', '196', 'U/L', '120~250', ''],
      ['肌钙蛋白I cTnI', '0.008', 'ng/mL', '0~0.034', '']
    ]
  },
  {
    projName: '降钙素原+C反应蛋白',
    sampCnameRaw: '血清',
    sampClassRaw: '20220421C00144',
    instName: '罗氏 Cobas 8000',
    clinicDiagnose: '肺部感染',
    rows: [
      ['降钙素原 PCT', '0.42', 'ng/mL', '0~0.05', '↑'],
      ['C反应蛋白 CRP', '68.2', 'mg/L', '0~8', '↑']
    ]
  }
]

const pad = (n) => String(n).padStart(2, '0')
const fmtDate = (date, hasTime = true) => {
  const d = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return hasTime ? `${d} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` : d
}
// 各条检验的采样时间：铺在 2022-2026 之间，避免整张列表清一色是当年数据
const TEST_DATES = [
  '2026-08-18 08:12',
  '2026-05-21 09:05',
  '2025-12-03 08:40',
  '2025-07-14 07:55',
  '2024-12-19 09:30',
  '2024-06-08 08:25',
  '2023-11-27 10:10',
  '2023-03-16 08:05',
  '2022-12-06 09:45',
  '2022-04-21 08:35'
]
// 列表 / 详情共用同一条采样时间，几处日期才能对得上
const testDateOf = (index) => new Date(TEST_DATES[index % TEST_DATES.length].replace(/-/g, '/'))

const buildRow = (tpl, index) => {
  const hospital = HOSPITALS[index % HOSPITALS.length]
  const testDate = testDateOf(index)
  const rptDate = new Date(testDate.getTime() + 2 * 60 * 60 * 1000)
  return {
    hospital,
    testDate,
    rptDate,
    rptId: `JR${testDate.getFullYear()}${pad(testDate.getMonth() + 1)}${pad(testDate.getDate())}${String(1001 + index)}`,
    hrFlag: index % 3 === 0 ? 1 : 0
  }
}

// 列表页查询时缓存一次患者信息，供详情页复用（详情接口只接收 rptId/organCode）
let currentPatient = { name: '张伟', idCard: '3204**********4733' }

export function buildTestList(params) {
  const name = readParam(params, 'patientName')
  const idCard = readParam(params, 'patientIdCard')
  if (name) currentPatient = { name, idCard: idCard || currentPatient.idCard }

  const data = REPORTS.map((tpl, index) => {
    const { hospital, testDate, rptId, hrFlag } = buildRow(tpl, index)
    return {
      id: rptId,
      rptId,
      name: currentPatient.name,
      projName: tpl.projName,
      // 门诊诊断：时间轴卡片要展示，列表原本不读这个字段，透出去不影响列表页
      clinicDiagnose: tpl.clinicDiagnose,
      testDt: fmtDate(testDate),
      organName: hospital.hospitalName,
      organCode: hospital.hospitalCode,
      organLevel: hospital.organLevel,
      hrFlag,
      hr_flag: String(hrFlag),
      is_repeat: 0
    }
  })

  return {
    code: 200,
    message: 'ok',
    data,
    meta: { pagination: { total: data.length, current_page: 1, page_size: 10 } }
  }
}

export function buildTestDetail(params) {
  const rptId = readParam(params, 'rptId')
  const organCode = readParam(params, 'organCode')
  const index = Math.max(REPORTS.findIndex((tpl, i) => buildRow(tpl, i).rptId === rptId), 0)
  const tpl = REPORTS[index]
  const { hospital, testDate, rptDate } = buildRow(tpl, index)
  const applyDate = new Date(testDate.getTime() - 40 * 60 * 1000)
  const acceptDate = new Date(testDate.getTime() + 25 * 60 * 1000)

  return {
    code: 200,
    message: 'ok',
    data: {
      name: currentPatient.name,
      visitNumber: `MZ${testDate.getFullYear()}${pad(testDate.getMonth() + 1)}${pad(testDate.getDate())}${String(2468 + index)}`,
      appDptName: DPT_NAMES[index % DPT_NAMES.length],
      sex: index % 2 === 0 ? 1 : 0,
      age: String(38 + index * 3),
      sampClassRaw: tpl.sampClassRaw,
      sampCnameRaw: tpl.sampCnameRaw,
      instName: tpl.instName,
      clinicDiagnose: tpl.clinicDiagnose,
      sampName: TEST_DOCTORS[index % TEST_DOCTORS.length],
      testDocName: TEST_DOCTORS[(index + 2) % TEST_DOCTORS.length],
      rvName: TEST_DOCTORS[(index + 4) % TEST_DOCTORS.length],
      applyDt: fmtDate(applyDate),
      sampDt: fmtDate(testDate),
      acceptDt: fmtDate(acceptDate),
      rptDt: fmtDate(rptDate),
      organName: hospital.hospitalName,
      organCode: organCode || hospital.hospitalCode,
      projName: tpl.projName,
      itemFields: REPORT_COLUMNS,
      itemFieldsValue: toRows(tpl.rows)
    }
  }
}

export function buildTestCondition() {
  return {
    code: 200,
    message: 'ok',
    data: {
      hospitals: HOSPITALS.map((h) => ({ hospitalName: h.hospitalName, hospitalCode: h.hospitalCode })),
      projNames: REPORTS.map((tpl) => tpl.projName)
    }
  }
}
