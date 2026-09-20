/**
 * 门诊记录演示数据。
 *
 * 字段来自 doctorProtal_mvp：
 * - 列表：src/components/MedicalDetail.vue 的 opTimeline（date/time/title/dept/hosp/level）
 *   与 src/data.ts 的 healthRecords type:'op'（cost/reimb）
 * - 病历：src/App.vue 的「门诊电子病历」段落（主诉/现病史/体格检查/初步诊断/处理意见）
 *   + src/components/MedicalDetail.vue 门诊病历（既往史）
 */
import { readParam } from './index'

const HOSPITALS = {
  cz1: { organName: '常州市第一人民医院', organCode: '3204000001', organLevel: '三级甲等' },
  njgl: { organName: '南京大学医学院附属鼓楼医院', organCode: '3201000101', organLevel: '三级甲等' }
}

// [就诊日期, 就诊时间, 医院, 科室, 诊断, 接诊医师, 总费用, 医保报销]
const VISITS = [
  {
    date: '2026-05-15', time: '09:30', hospital: 'cz1', dept: '心内科', diag: '冠心病常规复诊', doctor: '李建国', cost: '386.00', reimb: '268.00',
    chief: '反复胸闷、心悸2周，加重3天。',
    present: '患者于2周前无明显诱因出现胸闷，位于胸骨后，呈压榨感，持续约3-5分钟，休息或含服"硝酸甘油"后缓解。近3天症状加重，发作频率增加。无黑矇、晕厥。为求明确诊治，遂来我院门诊。',
    past: '高血压病史10年，最高160/100mmHg，长期口服苯磺酸氨氯地平片。否认糖尿病史，否认"肝炎、结核"等传染病史。',
    physical: 'T: 36.5℃， P: 72次/分， R: 18次/分， BP: 148/92mmHg。神志清，双肺呼吸音清，未闻及干湿性啰音。心界不大，心率72次/分，律齐，各瓣膜听诊区未闻及病理性杂音。',
    diagnosis: '1. 冠状动脉粥样硬化性心脏病；2. 高血压病3级（极高危）。',
    plan: '1. 继续服用阿司匹林、阿托伐他汀。2. 加用曲美他嗪片 20mg tid。3. 建议行冠脉CT检查。'
  },
  {
    date: '2025-03-22', time: '14:20', hospital: 'cz1', dept: '骨科', diag: '腰椎间盘突出治疗', doctor: '李医生', cost: '50.00', reimb: '45.00',
    chief: '腰痛伴左下肢放射痛2周，加重3天。',
    present: '患者于2周前因搬重物后出现腰部疼痛，呈持续性酸胀痛，向左下肢放射，久坐及弯腰时加重，平卧休息后减轻。近3天疼痛加重，行走受限。为求进一步诊治，遂来我院门诊。',
    past: '既往体健。否认手术、外伤及输血史。否认食物及药物过敏史。预防接种随社会进行。',
    physical: 'T: 36.8℃， P: 76次/分， R: 18次/分， BP: 126/78mmHg。腰椎生理曲度变直，L4/L5棘突旁压痛(+)，左侧直腿抬高试验50°(+)，左足拇趾背伸肌力Ⅳ级。',
    diagnosis: '腰椎间盘突出症（L4/L5）。',
    plan: '1. 卧床休息，佩戴腰围。2. 口服塞来昔布、甲钴胺。3. 建议腰椎MRI进一步评估。'
  },
  {
    date: '2026-03-15', time: '10:30', hospital: 'cz1', dept: '心内科', diag: '原发性高血压', doctor: '王建国', cost: '386.00', reimb: '268.00',
    chief: '发现血压升高10年，伴头晕1周。',
    present: '患者10年前体检发现血压升高，最高160/100mmHg，平时不规则服用"氨氯地平"治疗，血压波动在140-150/90-95mmHg。1周前无明显诱因出现头晕，呈阵发性，伴心悸、胸闷，无视物旋转、无恶心呕吐。为求进一步诊治，遂来我院门诊。',
    past: '既往体健。否认"糖尿病、冠心病"等慢性病史。否认"肝炎、结核"等传染病史。否认手术、外伤及输血史。',
    physical: 'T: 36.5℃， P: 72次/分， R: 18次/分， BP: 148/92mmHg。神志清，颈静脉无怒张，双肺呼吸音清。心界稍向左扩大，心率72次/分，律齐，A2>P2。',
    diagnosis: '1. 原发性高血压3级（极高危）；2. 高脂血症。',
    plan: '1. 苯磺酸氨氯地平片 5mg qd；2. 缬沙坦 80mg qd；3. 建议低盐低脂饮食，每日监测血压。'
  },
  {
    date: '2025-02-10', time: '11:15', hospital: 'njgl', dept: '消化内科', diag: '慢性胃炎', doctor: '陈志远', cost: '50.00', reimb: '45.00',
    chief: '反复上腹痛、反酸3个月，加重1周。',
    present: '患者近3个月来无明显诱因出现反复上腹部隐痛，以餐后明显，伴有反酸、嗳气，偶有恶心。近期食欲欠佳，睡眠尚可，大小便正常，体重无明显变化。为求明确诊治，遂来我院门诊。',
    past: '既往体健。否认"肝炎、结核"等传染病史。否认手术、外伤及输血史。否认食物及药物过敏史。',
    physical: 'T: 36.6℃， P: 78次/分， R: 18次/分， BP: 118/74mmHg。腹平软，上腹部轻压痛，无反跳痛，肝脾肋下未触及，肠鸣音正常。',
    diagnosis: '1. 慢性浅表性胃炎；2. 幽门螺杆菌感染(？)。',
    plan: '1. 奥美拉唑肠溶胶囊 20mg qd；2. 建议行13C尿素呼气试验；3. 规律饮食，忌辛辣刺激。'
  },
  {
    date: '2024-01-05', time: '10:00', hospital: 'njgl', dept: '呼吸内科', diag: '上呼吸道感染', doctor: '周琳', cost: '220.00', reimb: '154.00',
    chief: '咳嗽、咳痰伴发热2天。',
    present: '患者于2天前受凉后出现咳嗽，咳白色黏痰，伴发热，体温最高38.2℃，伴鼻塞、流涕、咽痛。自行口服"感冒灵"效果欠佳。为求进一步诊治，遂来我院门诊。',
    past: '既往体健。否认慢性咳嗽、咳痰史。否认吸烟史。否认"肝炎、结核"等传染病史。',
    physical: 'T: 38.1℃， P: 92次/分， R: 20次/分， BP: 116/72mmHg。咽部充血，双侧扁桃体Ⅰ度肿大。双肺呼吸音粗，未闻及干湿性啰音。',
    diagnosis: '急性上呼吸道感染。',
    plan: '1. 连花清瘟胶囊 4粒 tid；2. 布洛芬混悬液 必要时退热；3. 多饮水，注意休息。'
  },
  {
    date: '2023-11-20', time: '15:30', hospital: 'cz1', dept: '骨科', diag: '腰肌劳损', doctor: '张志强', cost: '180.00', reimb: '120.00',
    chief: '腰部疼痛伴活动受限1周，加重2天。',
    present: '患者于1周前因久坐办公后出现腰部酸痛，呈持续性钝痛，以两侧腰肌为著，劳累后加重，休息后减轻。无下肢放射痛，无大小便障碍。为求诊治，遂来我院门诊。',
    past: '既往体健。否认腰部外伤史。否认手术史。否认食物及药物过敏史。',
    physical: 'T: 36.4℃， P: 74次/分， R: 18次/分， BP: 122/76mmHg。腰椎生理曲度存在，双侧腰肌紧张、压痛(+)，腰椎活动略受限，双下肢感觉、肌力正常。',
    diagnosis: '腰肌劳损。',
    plan: '1. 塞来昔布胶囊 0.2g qd；2. 局部理疗，每日一次；3. 避免久坐及负重，加强腰背肌功能锻炼。'
  },
  {
    date: '2022-09-12', time: '08:45', hospital: 'njgl', dept: '眼科', diag: '结膜炎', doctor: '吴敏', cost: '65.00', reimb: '50.00',
    chief: '双眼发红、异物感伴流泪3天。',
    present: '患者于3天前无明显诱因出现双眼发红，伴异物感、流泪，晨起有分泌物，视物尚清晰。自行滴用"氯霉素眼药水"效果欠佳。为求诊治，遂来我院门诊。',
    past: '既往体健。否认眼部手术及外伤史。否认"肝炎、结核"等传染病史。否认食物及药物过敏史。',
    physical: '双眼睑轻度红肿，结膜充血明显，可见少量脓性分泌物。角膜透明，前房深浅正常，瞳孔对光反射灵敏。',
    diagnosis: '急性结膜炎（双眼）。',
    plan: '1. 左氧氟沙星滴眼液 双眼 每日4次；2. 更昔洛韦眼用凝胶 双眼 每日4次；3. 注意手卫生，避免交叉感染。'
  }
]

export const OUTPATIENT_SECTIONS = [
  { key: 'chief', title: '主诉' },
  { key: 'present', title: '现病史' },
  { key: 'past', title: '既往史' },
  { key: 'physical', title: '体格检查' },
  { key: 'diagnosis', title: '初步诊断' },
  { key: 'plan', title: '处理意见' }
]

const pad = (n) => String(n).padStart(2, '0')

// 明细列表接口只带 rptId/organCode，患者信息在列表查询时缓存下来供详情复用
let currentPatient = { name: '张伟', idCard: '320402197103154733', sexAge: '男 / 55岁' }

const sexAgeOf = (idCard) => {
  if (!/^\d{17}[\dXx]$/.test(idCard)) return '--'
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
  const sex = Number(idCard.charAt(16)) % 2 === 1 ? '男' : '女'
  return `${sex} / ${age}岁`
}

const visitIdOf = (item, index) => `OP${item.date.replace(/-/g, '')}${String(1001 + index)}`

const buildRow = (item, index) => {
  const hospital = HOSPITALS[item.hospital]
  return {
    id: visitIdOf(item, index),
    visitId: visitIdOf(item, index),
    name: currentPatient.name,
    date: item.date,
    time: item.time,
    visitDt: `${item.date} ${item.time}`,
    dept: item.dept,
    diag: item.diag,
    doctor: item.doctor,
    cost: item.cost,
    reimb: item.reimb,
    organName: hospital.organName,
    organCode: hospital.organCode,
    organLevel: hospital.organLevel,
    hrFlag: 0
  }
}

export function buildVisitList(params) {
  const name = readParam(params, 'patientName')
  const idCard = readParam(params, 'patientIdCard')
  if (name) currentPatient = { name, idCard: idCard || currentPatient.idCard, sexAge: sexAgeOf(idCard || currentPatient.idCard) }

  const data = VISITS.map(buildRow)

  return {
    code: 200,
    message: 'ok',
    data,
    meta: { pagination: { total: data.length, current_page: 1, page_size: 10 } }
  }
}

export function buildVisitDetail(params) {
  const visitId = readParam(params, 'visitId')
  const index = Math.max(VISITS.findIndex((item, i) => visitIdOf(item, i) === visitId), 0)
  const item = VISITS[index]
  const hospital = HOSPITALS[item.hospital]

  return {
    code: 200,
    message: 'ok',
    data: {
      name: currentPatient.name,
      sexAge: currentPatient.sexAge,
      systemPatientId: currentPatient.idCard,
      visitId: visitIdOf(item, index),
      emrNo: `MZ${item.date.replace(/-/g, '')}${String(2468 + index)}`,
      sex: Number((currentPatient.idCard || '').charAt(16)) % 2 === 1 ? 1 : 0,
      appDptName: item.dept,
      visitDate: item.date,
      visitTime: item.time,
      visitType: '门诊',
      diag: item.diag,
      organName: hospital.organName,
      organCode: hospital.organCode,
      organLevel: hospital.organLevel,
      sections: OUTPATIENT_SECTIONS.map((s) => ({ title: s.title, content: item[s.key] })),
      doctor: item.doctor,
      recordDoc: item.doctor,
      rvName: '孙美玲',
      recordDt: `${item.date} ${pad(Number(item.time.slice(0, 2)) + 1)}:${item.time.slice(3)}`
    }
  }
}
