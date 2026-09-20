/**
 * 病理记录演示数据。
 *
 * 一次送检可以取多个部位，每个部位各出一条诊断，所以：
 * - specimen/gross 用（1）（2）（3）分部位描述；
 * - diags 是数组，每条形如「（部位）诊断结论。」，条数不固定；
 * - advice（诊断意见及建议）和 extra（补充检测）不一定都有。
 * 列表里只会出现已经出报告的记录：报告没出的病例还没有结论和报告日期，
 * 不在这个列表的范围内。
 */
import { readParam } from './index'

const HOSPITALS = {
  cz1: { organName: '常州市第一人民医院', organCode: '3204000001', organLevel: '三级甲等' },
  njgl: { organName: '南京大学医学院附属鼓楼医院', organCode: '3201000101', organLevel: '三级甲等' }
}

const RECORDS = [
  {
    pathNo: 'BL2026062000311',
    hospital: 'cz1',
    visitNo: 'ZY2600781',
    dept: '消化内科',
    sendDoctor: '陈志远',
    sendDate: '2026-06-20',
    specimen: '胃多部位黏膜活检（1.胃窦 2.胃体 3.十二指肠球部）',
    gross: '（1）胃窦：灰白组织2粒，直径0.2cm；（2）胃体：灰白组织1粒，直径0.15cm；（3）十二指肠：灰白组织1粒，直径0.1cm。全进块。',
    diags: [
      '（胃窦黏膜）慢性萎缩性胃炎伴轻度肠上皮化生，HP(+)。',
      '（胃体黏膜）慢性浅表性（非萎缩性）胃炎，伴轻度活动期，HP(+)。',
      '（十二指肠球部黏膜）慢性十二指肠炎，未见肠绒毛萎缩及异型增生。'
    ],
    advice: '建议行幽门螺杆菌（HP）根除治疗，1年后随访复查胃镜。',
    reportDoc: '王丽华',
    rvDoc: '孙美玲',
    reportDate: '2026-06-22'
  },
  {
    pathNo: 'BL2025090800251',
    hospital: 'njgl',
    visitNo: 'MZ2500477',
    dept: '骨科',
    sendDoctor: '李医生',
    sendDate: '2025-09-08',
    specimen: 'L4/L5 椎间盘髓核及椎旁增生黄韧带组织',
    gross: '（1）髓核：灰白碎组织一堆，总体积 1.5×1.0×0.5cm；（2）黄韧带：灰黄灰白韧性组织一块，大小 1.0×0.8×0.3cm。',
    diags: [
      '（L4/L5椎间盘髓核）纤维软骨及胶原组织退行性变，伴黏液样变性。',
      '（L4/L5椎旁黄韧带）纤维组织增生伴局灶性慢性炎细胞浸润及钙化。'
    ],
    advice: '符合椎间盘突出伴退行性改变病理特征，请结合 MRI 临床评估。',
    reportDoc: '张旭',
    rvDoc: '孙美玲',
    reportDate: '2025-09-11'
  },
  {
    pathNo: 'BL2024111400188',
    hospital: 'cz1',
    visitNo: 'MZ2400456',
    dept: '甲状腺外科',
    sendDoctor: '周海涛',
    sendDate: '2024-11-14',
    specimen: '右侧甲状腺、左侧甲状腺、中央区淋巴结（Ⅵ区）、右颈侧区淋巴结（Ⅱ-Ⅴ区）',
    gross: '（1）右叶甲状腺：4.5×3.0×2.0cm，切面见一灰白结节，最大径0.8cm；（2）左叶甲状腺：3.5×2.0×1.5cm；（3）Ⅵ区淋巴结：脂肪组织一堆，找到淋巴结6枚；（4）右颈侧区淋巴结：找到淋巴结12枚。',
    diags: [
      '（右侧甲状腺）乳头状癌（经典型），肿瘤最大径 0.8cm，未侵犯外膜，切缘净。',
      '（左侧甲状腺）结节性甲状腺肿，未见肿瘤累及。',
      '（中央区淋巴结 Ⅵ区）见癌转移（2/6）。',
      '（右颈侧区淋巴结 Ⅱ-Ⅴ区）未见癌转移（0/12）。'
    ],
    extra: 'CK19 (+)、Galectin-3 (+)、BRAF V600E (突变型)。',
    reportDoc: '王丽华',
    rvDoc: '孙美玲',
    reportDate: '2024-11-18'
  },
  {
    pathNo: 'BL2023032100142',
    hospital: 'cz1',
    visitNo: 'ZY2300655',
    dept: '皮肤科',
    sendDoctor: '吴敏',
    sendDate: '2023-03-21',
    specimen: '背部主肿物切除组织、背部主肿物基底附加切缘组织',
    gross: '（1）主肿物：带皮组织一块，2.0×1.2×0.8cm，皮下结节直径1.0cm；（2）基底切缘：灰白组织一小块，0.5×0.3×0.2cm。',
    diags: [
      '（背部皮肤肿物）皮肤纤维瘤（良性），侧切缘及基底切缘均净。',
      '（背部肿物基底附加切缘）纤维脂肪组织，未见肿瘤及纤维瘤病变残留。'
    ],
    advice: '病变已完整切除，无需二次扩切。',
    reportDoc: '张旭',
    rvDoc: '孙美玲',
    reportDate: '2023-03-24'
  }
]

// 列表那一列放不下整串诊断，只出第一条 + 条数
const diagBrief = (diags) => {
  const first = (diags[0] || '').replace(/。$/, '')
  return diags.length > 1 ? `${first} 等${diags.length}条` : first
}

let currentPatient = { name: '张伟', idCard: '320402197103154733', sex: '男', age: 55 }

const toRow = (item) => {
  const hospital = HOSPITALS[item.hospital]
  return {
    id: item.pathNo,
    pathNo: item.pathNo,
    name: currentPatient.name,
    sex: currentPatient.sex,
    age: currentPatient.age,
    visitNo: item.visitNo,
    dept: item.dept,
    sendOrgan: hospital.organName,
    specimen: item.specimen,
    sendDate: item.sendDate,
    diag: diagBrief(item.diags),
    reportDate: item.reportDate,
    sendDoctor: item.sendDoctor,
    organName: hospital.organName,
    organCode: hospital.organCode,
    organLevel: hospital.organLevel
  }
}

export function buildPathologyList(params) {
  const name = readParam(params, 'patientName')
  const idCard = readParam(params, 'patientIdCard')
  if (name) currentPatient = { ...currentPatient, name, idCard: idCard || currentPatient.idCard }

  const data = RECORDS.slice()
    .sort((a, b) => b.sendDate.localeCompare(a.sendDate))
    .map(toRow)

  return {
    code: 200,
    message: 'ok',
    data,
    meta: { pagination: { current: 1, pageSize: 10, total: data.length } }
  }
}

export function buildPathologyDetail(params) {
  const pathNo = readParam(params, 'id')
  const item = RECORDS.find((r) => r.pathNo === pathNo) || RECORDS[0]
  const hospital = HOSPITALS[item.hospital]

  return {
    code: 200,
    message: 'ok',
    data: {
      pathNo: item.pathNo,
      name: currentPatient.name,
      sex: currentPatient.sex,
      age: currentPatient.age,
      systemPatientId: currentPatient.idCard,
      visitNo: item.visitNo,
      organName: hospital.organName,
      organCode: hospital.organCode,
      organLevel: hospital.organLevel,
      dept: item.dept,
      sendOrgan: hospital.organName,
      sendDoctor: item.sendDoctor,
      sendDate: item.sendDate,
      specimen: item.specimen,
      gross: item.gross,
      diags: item.diags,
      advice: item.advice || '',
      extra: item.extra || '',
      reportDoc: item.reportDoc,
      rvDoc: item.rvDoc,
      reportDate: item.reportDate
    }
  }
}
