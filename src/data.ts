export const healthRecords = [
  { date: "2024-05-15", hosp: "常州市第一人民医院", dept: "心内科", type: "op", diag: "冠心病常规复诊", cost: "¥386", reimb: "¥268", tags: ["门诊"], desc: "1. 冠状动脉粥样硬化性心脏病 2. 高血压病3级（极高危）" },
  { date: "2024-03-22", hosp: "常州市第一人民医院", dept: "骨科", type: "op", diag: "腰椎间盘突出治疗", cost: "¥50", reimb: "¥45", tags: ["门诊"], desc: "腰椎间盘突出症 (L4/L5)" },
  { date: "2024-03-15", hosp: "常州市第一人民医院", dept: "心内科", type: "op", diag: "原发性高血压", cost: "¥386", reimb: "¥268", tags: ["门诊"], desc: "原发性高血压2级，血压控制欠佳，调整用药方案" },
  { date: "2024-02-10", hosp: "南京大学医学院附属鼓楼医院", dept: "消化内科", type: "op", diag: "慢性胃炎", cost: "¥50", reimb: "¥45", tags: ["门诊"], desc: "慢性浅表性胃炎，幽门螺杆菌阳性" },
  { date: "2024-01-05", hosp: "南京大学医学院附属鼓楼医院", dept: "呼吸内科", type: "op", diag: "上呼吸道感染", cost: "¥220", reimb: "¥154", tags: ["门诊"], desc: "急性上呼吸道感染，伴有发热、咳嗽" },
  { date: "2023-11-20", hosp: "常州市第一人民医院", dept: "骨科", type: "op", diag: "腰肌劳损", cost: "¥180", reimb: "¥120", tags: ["门诊"], desc: "腰部肌肉劳损，建议理疗及休息" },
  { date: "2023-09-12", hosp: "南京大学医学院附属鼓楼医院", dept: "眼科", type: "op", diag: "结膜炎", cost: "¥65", reimb: "¥50", tags: ["门诊"], desc: "急性结膜炎，予以抗生素眼药水治疗" },

  { date: "2024-03-10", dateEnd: "2024-03-20", hosp: "常州市第一人民医院", dept: "心内科", type: "ip", diag: "急性心肌梗死住院记录", cost: "¥12,450", reimb: "¥9,800", tags: ["住院"], desc: "主要诊断：入院后急诊PCI术，于前降支植入支架一枚。术后予以抗血小板、调脂、改善心肌重构等治疗。", status: "已出院" },
  { date: "2021-08-05", dateEnd: "2021-08-12", hosp: "常州市第一人民医院", dept: "内分泌科", type: "ip", diag: "血糖平衡调节", cost: "¥8,420", reimb: "¥6,230", tags: ["住院"], desc: "主要诊断：II型糖尿病，血糖控制不佳", status: "已出院" },
  { date: "2023-05-10", hosp: "常州市第一人民医院", dept: "普外科", type: "ip", diag: "阑尾炎住院", cost: "¥8,420", reimb: "¥6,230", tags: ["住院"], desc: "主要诊断：急性阑尾炎。行腹腔镜下阑尾切除术，术后恢复良好。", status: "已出院" },
  { date: "2022-12-01", hosp: "南京大学医学院附属鼓楼医院", dept: "呼吸内科", type: "ip", diag: "大叶性肺炎", cost: "¥5,600", reimb: "¥4,100", tags: ["住院"], desc: "主要诊断：大叶性肺炎。入院抗感染、对症支持治疗，病情好转。", status: "已出院" },
  { date: "2022-08-15", hosp: "常州市第一人民医院", dept: "消化内科", type: "ip", diag: "急性胃肠炎", cost: "¥3,200", reimb: "¥2,400", tags: ["住院"], desc: "主要诊断：急性胃肠炎伴中度脱水。予以补液、抗感染治疗。", status: "已出院" },
  { date: "2022-03-10", hosp: "常州市第一人民医院", dept: "骨伤科", type: "ip", diag: "左桡骨远端骨折", cost: "¥7,800", reimb: "¥5,900", tags: ["住院"], desc: "主要诊断：左桡骨远端骨折。行切开复位内固定术，术后石膏固定。", status: "已出院" },

  { date: "2024-05-16", hosp: "常州市第一人民医院", dept: "检验科", type: "lab", diag: "生化常规检查", cost: "¥120", reimb: "¥100", tags: ["检验"], metrics: [{label: "谷丙转氨酶 (ALT)", value: "45", unit: "U/L", flag: "high"}, {label: "总胆固醇 (TC)", value: "6.2", unit: "mmol/L", flag: "high"}], moreCount: 3 },
  { date: "2024-04-12", hosp: "南京大学医学院附属鼓楼医院", dept: "检验科", type: "lab", diag: "糖化血红蛋白", cost: "¥80", reimb: "¥60", tags: ["检验"], metrics: [{label: "糖化血红蛋白", value: "5.8", unit: "%", flag: ""}] },
  { date: "2024-03-15", hosp: "常州市第一人民医院", dept: "检验科", type: "lab", diag: "血常规 (五分类)", cost: "¥80", reimb: "¥60", tags: ["检验"], metrics: [{label: "白细胞 (WBC)", value: "7.2", unit: "10^9/L", flag: ""}, {label: "红细胞 (RBC)", value: "4.8", unit: "10^12/L", flag: ""}] },
  { date: "2023-12-15", hosp: "南京大学医学院附属鼓楼医院", dept: "检验科", type: "lab", diag: "尿常规", cost: "¥45", reimb: "¥35", tags: ["检验"], metrics: [{label: "尿蛋白 (PRO)", value: "阴性", flag: ""}, {label: "尿糖 (GLU)", value: "阴性", flag: ""}] },
  { date: "2023-10-10", hosp: "常州市第一人民医院", dept: "检验科", type: "lab", diag: "凝血功能", cost: "¥150", reimb: "¥120", tags: ["检验"], metrics: [{label: "凝血酶原时间 (PT)", value: "12.5", unit: "s", flag: ""}, {label: "INR", value: "1.05", flag: ""}] },
  { date: "2023-05-20", hosp: "常州市第一人民医院", dept: "检验科", type: "lab", diag: "糖化血红蛋白", cost: "¥90", reimb: "¥70", tags: ["检验"], metrics: [{label: "糖化血红蛋白", value: "6.1", unit: "%", flag: "high"}] },

  { date: "2024-05-16", hosp: "常州市第一人民医院", dept: "放射科", type: "exam", diag: "胸部CT平扫", cost: "¥240", reimb: "¥180", tags: ["检查", "放射科"], desc: "诊断结论：双肺纹理增多；建议结合临床，必要时随访。" },
  { date: "2024-03-12", hosp: "南京大学医学院附属鼓楼医院", dept: "超声科", type: "exam", diag: "心脏彩超", cost: "¥60", reimb: "¥40", tags: ["检查", "超声科"], desc: "诊断结论：左房稍大，左室壁节段性运动异常，EF 52%。" },
  { date: "2024-04-12", hosp: "南京大学医学院附属鼓楼医院", dept: "超声科", type: "exam", diag: "彩色多普勒超声", cost: "¥180", reimb: "¥140", tags: ["检查", "超声科"], desc: "结论：颈动脉内膜毛糙，未见明显斑块。建议定期复查。" },
  { date: "2024-03-16", hosp: "常州市第一人民医院", dept: "放射科", type: "exam", diag: "胸部CT平扫", cost: "¥240", reimb: "¥180", tags: ["检查"], desc: "诊断结论：双肺纹理增多，左肺下叶微小结节影，建议随访。" },
  { date: "2024-03-15", hosp: "常州市第一人民医院", dept: "心功能室", type: "exam", diag: "心电图检查", cost: "¥60", reimb: "¥40", tags: ["检查"], desc: "诊断结论：窦性心律，正常心电图。" },
  { date: "2023-12-10", hosp: "南京大学医学院附属鼓楼医院", dept: "超声科", type: "exam", diag: "腹部超声", cost: "¥180", reimb: "¥140", tags: ["检查"], desc: "诊断结论：肝胆胰脾未见明显异常，双肾大小形态正常。" },
  { date: "2023-10-05", hosp: "常州市第一人民医院", dept: "内镜中心", type: "exam", diag: "胃镜检查", cost: "¥650", reimb: "¥520", tags: ["检查"], desc: "诊断结论：慢性浅表性胃炎，十二指肠球部未见异常。" },
  { date: "2023-06-20", hosp: "常州市第一人民医院", dept: "放射科", type: "exam", diag: "腰椎MRI", cost: "¥580", reimb: "¥460", tags: ["检查"], desc: "诊断结论：L4/L5椎间盘膨出，L5/S1椎间盘突出（中央型）。" },

  { date: "2024-05-17", hosp: "常州德仁堂药店", dept: "心内科", type: "med", diag: "长期用药处方", cost: "¥158", reimb: "¥120", tags: ["药耗"], items: [{name: "阿司匹林肠溶片", count: "1盒"}, {name: "阿托伐他汀钙片", count: "2盒"}], moreCount: 1 },
  { date: "2024-04-15", hosp: "常州万民药店", dept: "门诊部", type: "med", diag: "门诊处方详单", cost: "¥85", reimb: "¥65", tags: ["药耗"], items: [{name: "一次性使用无菌注射器 5ml", count: "1具"}] },
  { date: "2024-03-15", hosp: "常州德仁堂药店", dept: "心内科", type: "med", diag: "高血压用药", cost: "¥158", reimb: "¥120", tags: ["药耗"], items: [{name: "苯磺酸氨氯地平片", count: "2盒"}, {name: "缬沙坦胶囊", count: "1盒"}] },
  { date: "2024-02-10", hosp: "南京益丰大药房", dept: "消化内科", type: "med", diag: "胃病用药", cost: "¥85", reimb: "¥65", tags: ["药耗"], items: [{name: "奥美拉唑肠溶片", count: "1盒"}] },
  { date: "2024-01-05", hosp: "南京益丰大药房", dept: "呼吸内科", type: "med", diag: "感冒用药", cost: "¥42", reimb: "¥30", tags: ["药耗"], items: [{name: "复方氨酚烷胺片", count: "1盒"}] },
  { date: "2023-11-20", hosp: "常州万民药店", dept: "骨科", type: "med", diag: "止痛用药", cost: "¥110", reimb: "¥80", tags: ["药耗"], items: [{name: "塞来昔布胶囊", count: "1盒"}] },
  { date: "2023-09-12", hosp: "南京益丰大药房", dept: "眼科", type: "med", diag: "眼药水", cost: "¥35", reimb: "¥25", tags: ["药耗"], items: [{name: "左氧氟沙星滴眼液", count: "1瓶"}] },

  { id: "30", date: "2024-06-01", hosp: "常州爱康国宾体检中心", dept: "体检中心", type: "pe", diag: "年度员工健康体检", cost: "¥850", reimb: "¥0", tags: ["体检"], desc: "建议：1. 发现轻度脂肪肝，建议低脂饮食。2. 尿酸指标偏高，需控制嘌呤摄入。", metrics: [{label: "甘油三酯", value: "2.45", flag: "high"}, {label: "血尿酸", value: "468", flag: "high"}] },
  { id: "31", date: "2024-05-15", hosp: "常州美年大健康体检中心", dept: "体检中心", type: "pe", diag: "专项防癌筛查体检", cost: "¥1200", reimb: "¥0", tags: ["体检"], desc: "诊断：各项指标在正常范围内，未见明显异常。" },

  { id: "wd1", date: "2026-06-25 08:32", hosp: "Apple Watch Series 9", dept: "个人穿戴", type: "wd", diag: "24h动态心电监测报告", cost: "—", reimb: "—", tags: ["穿戴"], desc: "窦性心律，平均心率72bpm，偶发室性早搏(2次/24h)，ST-T未见明显异常。最长RR间期1.42s(睡眠中)。", metrics: [{label: "平均心率", value: "72", unit: "bpm", flag: ""}, {label: "最低心率", value: "48", unit: "bpm", flag: ""}, {label: "最高心率", value: "128", unit: "bpm", flag: "high"}, {label: "室性早搏", value: "2", unit: "次/24h", flag: ""}, {label: "HRV(SDNN)", value: "86", unit: "ms", flag: ""}] },
  { id: "wd2", date: "2026-06-24 22:15", hosp: "华为手环 9", dept: "个人穿戴", type: "wd", diag: "睡眠呼吸监测", cost: "—", reimb: "—", tags: ["穿戴"], desc: "总睡眠7h12m，深睡1h48m(25%)，浅睡4h20m，REM 1h4m。AHI指数3.2(正常<5)，SpO2最低93%，平均97%。鼾声时长占比8%。", metrics: [{label: "睡眠时长", value: "7h12m", flag: ""}, {label: "深睡占比", value: "25", unit: "%", flag: ""}, {label: "AHI指数", value: "3.2", flag: ""}, {label: "最低血氧", value: "93", unit: "%", flag: "high"}, {label: "鼾声占比", value: "8", unit: "%", flag: ""}] },
  { id: "wd3", date: "2026-06-23 18:45", hosp: "欧姆龙电子血压计", dept: "居家监测", type: "wd", diag: "家庭血压日志·本周汇总", cost: "—", reimb: "—", tags: ["穿戴"], desc: "本周测量14次，收缩压均值138mmHg，舒张压均值88mmHg。晨峰血压偏高(152/95)，下午时段控制良好(128/82)。服药依从率100%。", metrics: [{label: "收缩压均值", value: "138", unit: "mmHg", flag: "high"}, {label: "舒张压均值", value: "88", unit: "mmHg", flag: ""}, {label: "晨峰收缩压", value: "152", unit: "mmHg", flag: "high"}, {label: "服药依从率", value: "100", unit: "%", flag: ""}] },
  { id: "wd4", date: "2026-06-22 07:15", hosp: "鱼跃血糖仪", dept: "居家监测", type: "wd", diag: "空腹及餐后血糖监测周报", cost: "—", reimb: "—", tags: ["穿戴"], desc: "空腹血糖均值5.6mmol/L，餐后2h血糖均值7.8mmol/L。1次餐后偏高(9.2mmol/L，对应晚餐)，其余在目标范围内。连续葡萄糖监测(CGM)显示血糖变异系数22%。", metrics: [{label: "空腹血糖均值", value: "5.6", unit: "mmol/L", flag: ""}, {label: "餐后2h均值", value: "7.8", unit: "mmol/L", flag: ""}, {label: "血糖CV", value: "22", unit: "%", flag: ""}, {label: "TIR(3.9-10)", value: "92", unit: "%", flag: ""}] },
  { id: "wd5", date: "2026-06-21 14:00", hosp: "康泰心电贴(CM-X)", dept: "远程医疗", type: "wd", diag: "72h连续心电贴片监测终评", cost: "—", reimb: "—", tags: ["穿戴"], desc: "总记录71.5h，窦性心律为主，偶发房性早搏(15次)，室性早搏(3次)。最长停搏1.8s(睡眠中)。心率变异性正常。QTc间期正常范围。结论：未见明显恶性心律失常。", metrics: [{label: "总记录时长", value: "71.5h", flag: ""}, {label: "房性早搏", value: "15", unit: "次", flag: ""}, {label: "最长停搏", value: "1.8", unit: "s", flag: "high"}, {label: "QTc间期", value: "428", unit: "ms", flag: ""}] },
  { id: "wd6", date: "2026-06-20 09:30", hosp: "小米体脂秤 2", dept: "居家监测", type: "wd", diag: "体成分分析月报", cost: "—", reimb: "—", tags: ["穿戴"], desc: "体重78.5kg，BMI 27.8(超重)，体脂率26.2%(偏高)，肌肉量54.3kg，内脏脂肪等级12(偏高)，基础代谢1720kcal，身体年龄58岁。建议：增加有氧运动，控制饮食热量。", metrics: [{label: "体重", value: "78.5", unit: "kg", flag: "high"}, {label: "BMI", value: "27.8", flag: "high"}, {label: "体脂率", value: "26.2", unit: "%", flag: "high"}, {label: "内脏脂肪", value: "12", unit: "级", flag: "high"}, {label: "基础代谢", value: "1720", unit: "kcal", flag: ""}] },
];

export const patientList = [
  { id: 'P88001235', name: '张伟', gender: '男', age: 54, status: '住院中', dept: '心内科', bed: '12-05', doctor: '李建国', risk: 'high' },
  { id: 'P88001236', name: '王芳', gender: '女', age: 42, status: '已出院', dept: '呼吸科', bed: '-', doctor: '陈晓梅', risk: 'low' },
  { id: 'P88001237', name: '李强', gender: '男', age: 68, status: '住院中', dept: '神经外科', bed: '08-12', doctor: '赵志强', risk: 'medium' },
  { id: 'P88001238', name: '刘洋', gender: '女', age: 29, status: '门诊', dept: '消化内科', bed: '-', doctor: '孙丽', risk: 'low' },
];

export const allRecords = [
  {
    id: 'r1',
    type: 'outpatient',
    date: '2024-05-15',
    hospital: '常州市第一人民医院',
    dept: '心血管内科',
    doctor: '李建国',
    name: '冠心病常规复诊',
    desc: '患者自述近期偶有胸闷，持续约3-5分钟，休息后缓解。',
    diagnosis: '1. 冠状动脉粥样硬化性心脏病\n2. 高血压病3级（极高危）',
    plan: '1. 继续服用阿司匹林、阿托伐他汀。\n2. 加用曲美他嗪片 20mg tid。\n3. 建议行冠脉CT检查。'
  },
  {
    id: 'r2',
    type: 'exam',
    date: '2024-05-16',
    hospital: '常州市第一人民医院',
    dept: '放射科',
    name: '胸部CT平扫',
    doctor: '王医生',
    desc: '诊断结论: 双肺纹理增多；建议结合临床，必要时随访。'
  },
  {
    id: 'r3',
    type: 'lab',
    date: '2024-05-16',
    hospital: '常州市第一人民医院',
    name: '生化常规检查',
    metrics: [
      { label: '谷丙转氨酶 (ALT)', value: '45', unit: 'U/L', flag: 'high' },
      { label: '总胆固醇 (TC)', value: '6.2', unit: 'mmol/L', flag: 'high' },
      { label: '低密度脂蛋白 (LDL-C)', value: '4.1', unit: 'mmol/L', flag: 'high' },
      { label: '空腹血糖 (GLU)', value: '5.4', unit: 'mmol/L', flag: '' },
      { label: '肌酐 (Cr)', value: '82', unit: 'μmol/L', flag: '' }
    ]
  },
  {
    id: 'r4',
    type: 'inpatient',
    date: '2024-03-10 ~ 2024-03-20',
    hospital: '南京大学医学院附属鼓楼医院',
    dept: '心内科',
    doctor: '张主任',
    name: '急性心肌梗死住院记录',
    reason: '突发持续性胸痛4小时。',
    process: '入院后急诊行PCI术，于前降支植入支架一枚。术后予以抗血小板、调脂、改善心肌重构等治疗。',
    result: '好转出院。',
    orders: '1. 双抗治疗6个月。\n2. 定期复查心电图、心肌酶。'
  },
  {
    id: 'r5',
    type: 'exam',
    date: '2024-03-12',
    hospital: '南京大学医学院附属鼓楼医院',
    dept: '超声科',
    name: '心脏彩超',
    doctor: '赵医生',
    desc: '诊断结论: 左房稍大，左室壁节段性运动异常，EF 52%。'
  },
  {
    id: 'r6',
    type: 'medicine',
    date: '2024-05-17',
    hospital: '常州市第一人民医院',
    name: '长期用药处方',
    items: [
      { name: '阿司匹林肠溶片', dose: '100mg qd', count: '1盒' },
      { name: '阿托伐他汀钙片', dose: '20mg qn', count: '2盒' },
      { name: '曲美他嗪片', dose: '20mg tid', count: '1盒' }
    ]
  },
  {
    id: 'r7',
    type: 'outpatient',
    date: '2024-03-22',
    hospital: '常州市第一人民医院',
    dept: '骨科',
    doctor: '李医生',
    name: '腰椎间盘突出治疗',
    desc: '腰痛伴左下肢放射痛2周，加重3天。',
    diagnosis: '腰椎间盘突出症（L4/L5）',
    plan: '1. 卧床休息，佩戴腰围。\n2. 口服塞来昔布、甲钴胺。\n3. 建议腰椎MRI进一步评估。'
  },
  {
    id: 'r8',
    type: 'inpatient',
    date: '2021-08-05 ~ 2021-08-12',
    hospital: '常州市第一人民医院',
    dept: '内分泌科',
    doctor: '陈医生',
    name: '血糖平衡调节',
    reason: '血糖持续偏高，住院调整方案。',
    process: 'II型糖尿病，血糖控制不佳',
    result: '好转出院。',
    orders: '1. 调整胰岛素方案。\n2. 饮食控制，定期监测血糖。'
  },
  {
    id: 'r9',
    type: 'exam',
    date: '2024-04-12',
    hospital: '南京大学医学院附属鼓楼医院',
    dept: '超声科',
    name: '彩色多普勒超声',
    doctor: '周医生',
    desc: '颈动脉内膜毛糙，未见明显斑块。建议定期复查。'
  },
  {
    id: 'r10',
    type: 'lab',
    date: '2024-04-12',
    hospital: '南京大学医学院附属鼓楼医院',
    name: '糖化血红蛋白',
    metrics: [
      { label: '糖化血红蛋白', value: '5.8', unit: '%', flag: '' }
    ]
  },
  {
    id: 'r11',
    type: 'medicine',
    date: '2024-04-15',
    hospital: '常州市第一人民医院',
    name: '门诊处方详单',
    items: [
      { name: '一次性使用无菌注射器 5ml', dose: '外用', count: '1具' }
    ]
  }
];
