/**
 * 住院记录演示数据（病案首页）。
 *
 * 字段来自 doctorProtal_mvp：
 * - 列表：src/data.ts 的 healthRecords 里 type:'ip' 的 6 条
 *   （date/dateEnd/hosp/dept/diag/cost/reimb/status）
 * - 病案首页：src/components/MedicalDetail.vue 的「住院病案首页」段落
 *   （基本信息 / 入院及出院信息 / 诊断信息含 ICD-10 / 血型过敏 / 医生签署）
 *   + src/App.vue 的 ip 详情弹窗（手术操作 / 出院情况）
 */
import { readParam } from './index'

const HOSPITALS = {
  cz1: { organName: '常州市第一人民医院', organCode: '3204000001', organLevel: '三级甲等' },
  njgl: { organName: '南京大学医学院附属鼓楼医院', organCode: '3201000101', organLevel: '三级甲等' }
}

// MVP 里用 title.includes(...) 三元式推导病案首页内容，这里按记录落成显式字段
const STAYS = [
  {
    inDate: '2025-03-10', outDate: '2025-03-20', hospital: 'cz1', dept: '心内科',
    diag: '急性心肌梗死', doctor: '刘明远', cost: '12450.00', reimb: '9800.00',
    ward: '1201 / 22床', mainIcd: 'I21.100',
    otherDiags: [
      { name: '原发性高血压 3级', icd: 'I10.x00' },
      { name: '2型糖尿病', icd: 'E11.900' }
    ],
    operations: [{ name: '经皮冠状动脉支架植入术(PCI)', date: '2025-03-10' }],
    outStatus: '患者神志清，精神可，无胸闷胸痛。切口愈合良好，生命体征平稳。'
  },
  {
    inDate: '2024-02-19', outDate: '2024-02-27', hospital: 'cz1', dept: '内分泌科',
    diag: 'II型糖尿病', doctor: '陈志远', cost: '8420.00', reimb: '6230.00',
    ward: '0903 / 08床', mainIcd: 'E11.900',
    otherDiags: [
      { name: '高脂血症', icd: 'E78.500' },
      { name: '糖尿病周围神经病变', icd: 'G63.200' }
    ],
    operations: [],
    outStatus: '血糖控制平稳，空腹血糖 6.2mmol/L，无低血糖发作。'
  },
  {
    inDate: '2023-05-10', outDate: '2023-05-18', hospital: 'cz1', dept: '普外科',
    diag: '急性阑尾炎', doctor: '赵志强', cost: '8420.00', reimb: '6230.00',
    ward: '0705 / 15床', mainIcd: 'K35.900',
    otherDiags: [{ name: '局限性腹膜炎', icd: 'K65.900' }],
    operations: [{ name: '腹腔镜下阑尾切除术', date: '2023-05-10' }],
    outStatus: '腹部切口愈合良好，无红肿渗液。肛门排气排便正常，可进半流质。'
  },
  {
    inDate: '2022-12-01', outDate: '2022-12-11', hospital: 'njgl', dept: '呼吸内科',
    diag: '大叶性肺炎', doctor: '吴敏', cost: '5600.00', reimb: '4100.00',
    ward: '1102 / 06床', mainIcd: 'J15.200',
    otherDiags: [{ name: '低氧血症', icd: 'R09.100' }],
    operations: [],
    outStatus: '咳嗽咳痰明显减轻，体温正常，复查胸片提示肺部炎症吸收好转。'
  },
  {
    inDate: '2022-08-15', outDate: '2022-08-23', hospital: 'cz1', dept: '消化内科',
    diag: '急性胃肠炎', doctor: '陈志远', cost: '3200.00', reimb: '2400.00',
    ward: '0802 / 19床', mainIcd: 'K52.900',
    otherDiags: [{ name: '轻度脱水', icd: 'E86.x00' }],
    operations: [],
    outStatus: '腹痛腹泻缓解，大便成形，电解质复查正常。'
  },
  {
    inDate: '2022-03-10', outDate: '2022-03-25', hospital: 'cz1', dept: '骨伤科',
    diag: '左桡骨远端骨折', doctor: '张志强', cost: '7800.00', reimb: '5900.00',
    ward: '0601 / 03床', mainIcd: 'S52.500',
    otherDiags: [{ name: '骨质疏松', icd: 'M81.900' }],
    operations: [{ name: '切开复位内固定术', date: '2022-03-10' }],
    outStatus: '左腕石膏固定中，末梢血运及感觉正常，X 线示骨折对位对线良好。'
  }
]

const stayIdOf = (item, index) => `IP${item.inDate.replace(/-/g, '')}${String(1001 + index)}`
const caseNoOf = (item, index) => `BA${item.inDate.replace(/-/g, '')}${String(99283 + index)}`

// 明细接口只带 stayId/organCode，患者信息在列表查询时缓存下来供详情复用
let currentPatient = { name: '张伟', idCard: '320402197103154733', sexAge: '男 / 55岁' }

const idPartsOf = (idCard) => {
  if (!/^\d{17}[\dXx]$/.test(idCard)) return null
  const y = idCard.slice(6, 10)
  const m = idCard.slice(10, 12)
  const d = idCard.slice(12, 14)
  const birth = new Date(`${y}/${m}/${d}`)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  if (beforeBirthday) age--
  return {
    birthDate: `${y}-${m}-${d}`,
    age,
    sex: Number(idCard.charAt(16)) % 2 === 1 ? '男' : '女',
    maskedIdCard: `${idCard.slice(0, 14)}****`
  }
}

const sexAgeOf = (idCard) => {
  const p = idPartsOf(idCard)
  return p ? `${p.sex} / ${p.age}岁` : '--'
}

const daysBetween = (a, b) =>
  Math.round((new Date(b.replace(/-/g, '/')) - new Date(a.replace(/-/g, '/'))) / 86400000)

const buildRow = (item, index) => {
  const hospital = HOSPITALS[item.hospital]
  return {
    id: stayIdOf(item, index),
    stayId: stayIdOf(item, index),
    name: currentPatient.name,
    inDate: item.inDate,
    outDate: item.outDate,
    dept: item.dept,
    diag: item.diag,
    doctor: item.doctor,
    cost: item.cost,
    reimb: item.reimb,
    bedDays: daysBetween(item.inDate, item.outDate),
    organName: hospital.organName,
    organCode: hospital.organCode,
    organLevel: hospital.organLevel,
    hrFlag: 0
  }
}

export function buildStayList(params) {
  const name = readParam(params, 'patientName')
  const idCard = readParam(params, 'patientIdCard')
  if (name) currentPatient = { name, idCard: idCard || currentPatient.idCard, sexAge: sexAgeOf(idCard || currentPatient.idCard) }

  const data = STAYS.map(buildRow)

  return {
    code: 200,
    message: 'ok',
    data,
    meta: { pagination: { total: data.length, current_page: 1, page_size: 10 } }
  }
}

export function buildStayDetail(params) {
  const stayId = readParam(params, 'stayId')
  const index = Math.max(STAYS.findIndex((item, i) => stayIdOf(item, i) === stayId), 0)
  const item = STAYS[index]
  const hospital = HOSPITALS[item.hospital]
  const p = idPartsOf(currentPatient.idCard) || { birthDate: '--', age: '--', sex: '--', maskedIdCard: '--' }

  return {
    code: 200,
    message: 'ok',
    data: {
      // 基本
      name: currentPatient.name,
      sex: p.sex,
      sexAge: currentPatient.sexAge,
      birthDate: p.birthDate,
      age: p.age,
      idCard: p.maskedIdCard,
      systemPatientId: currentPatient.idCard,
      nationality: '中国',
      nation: '汉族',
      marriage: '已婚',
      occupation: '工程师',
      address: '常州市天宁区青龙街道某小区',
      phone: '138****8832',
      // 抬头
      organName: hospital.organName,
      organCode: hospital.organCode,
      organLevel: hospital.organLevel,
      payWay: '职工医保',
      inTimes: '第 1 次住院',
      caseNo: caseNoOf(item, index),
      stayId: stayIdOf(item, index),
      // 入出院
      inDate: item.inDate,
      inTime: '10:00',
      inDept: item.dept,
      outDate: item.outDate,
      outTime: '09:30',
      outDept: item.dept,
      ward: item.ward,
      bedDays: daysBetween(item.inDate, item.outDate),
      // 诊断
      mainDiag: { name: item.diag, icd: item.mainIcd },
      otherDiags: item.otherDiags,
      // 其他
      allergy: '无',
      bloodType: 'O 型',
      rh: '阳性',
      injuryReason: '无',
      operations: item.operations,
      outStatus: item.outStatus,
      // 签署
      chiefDoc: '王建国',
      chiefPhysician: '刘明远',
      attendingDoc: item.doctor,
      residentDoc: '张医师',
      nurse: '李护士',
      qcDoc: '孙主任',
      signDate: `${item.outDate} 09:30`,
      recordDt: `${item.outDate} 10:30`
    }
  }
}
