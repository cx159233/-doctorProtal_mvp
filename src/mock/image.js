/**
 * 影像查询演示数据。
 * 列表字段按 src/views/home/index.vue 实际消费字段生成，
 * 详情字段按 src/views/detail/components/index.vue 调用的 6 个接口生成。
 */
import { readParam } from './index'

const HOSPITALS = [
  { hospital_name: '常州市第一人民医院', hospital_code: '3204000001', hospital_level: '三级甲等' },
  { hospital_name: '常州市第二人民医院', hospital_code: '3204000002', hospital_level: '三级甲等' },
  { hospital_name: '常州市中医医院', hospital_code: '3204000003', hospital_level: '三级甲等' },
  { hospital_name: '常州市武进人民医院', hospital_code: '3204000005', hospital_level: '三级乙等' },
  { hospital_name: '常州市金坛区人民医院', hospital_code: '3204000006', hospital_level: '二级甲等' }
]

const MODALITY = ['DR', 'CT', 'MRI', '超声', '心电图机', 'DSA', '乳腺钼靶']
const BODY_PARTS = ['胸部', '头颅', '腰椎', '颈椎', '膝关节', '腹部', '心脏', '肝胆脾胰']
const DOCTORS = ['王建国', '李明远', '陈思远', '周慧', '张永强', '许静']

// 省外医院：跨省调阅里的数据来自非江苏省的医疗机构
const CROSS_HOSPITALS = [
  { hospital_name: '上海市第六人民医院', hospital_code: '3101000001', hospital_level: '三级甲等' },
  { hospital_name: '浙江大学医学院附属第二医院', hospital_code: '3301000001', hospital_level: '三级甲等' },
  { hospital_name: '中国医学科学院北京协和医院', hospital_code: '1101000001', hospital_level: '三级甲等' }
]

// has_dicom / has_report 为 '1' 时按钮可点，'0' 时置灰
const STUDIES = [
  {
    id: '90002',
    item_name: '胸部CT平扫',
    instrna: 'CT',
    category_name: '胸部',
    has_dicom: '1',
    has_report: '1',
    quality_control: 1,
    quality_control_hospital: 0,
    rpt_descrip: '两肺纹理增多，右肺下叶见斑片状磨玻璃密度影，边界欠清；余肺野未见异常密度影。纵隔内未见肿大淋巴结，双侧胸腔未见积液，胸膜未见增厚。',
    rpt_seeing: '右肺下叶炎症，建议治疗后复查。'
  },
  {
    id: '90001',
    item_name: '胸部正位DR',
    instrna: 'DR',
    category_name: '胸部',
    has_dicom: '1',
    has_report: '1',
    quality_control: 1,
    quality_control_hospital: 1,
    rpt_descrip: '两肺纹理清晰，右肺上叶见一结节状高密度影，大小约 6mm×5mm，边缘光滑，未见明显毛刺；余肺野未见明确异常密度影。纵隔居中，气管及主支气管通畅。心脏大小、形态未见异常。双侧胸腔未见积液。',
    rpt_seeing: '右肺上叶小结节，建议 6 个月后复查。'
  },
  {
    id: '90003',
    item_name: '头颅CT平扫',
    instrna: 'CT',
    category_name: '头颅',
    has_dicom: '1',
    has_report: '1',
    quality_control: 0,
    quality_control_hospital: 0,
    rpt_descrip: '双侧大脑半球对称，脑实质内未见异常密度影，脑沟、脑裂未见增宽，脑室系统大小、形态正常，中线结构居中。颅骨骨质未见破坏。',
    rpt_seeing: '颅脑CT平扫未见明显异常。'
  },
  {
    id: '90004',
    item_name: '腰椎MRI平扫',
    instrna: 'MRI',
    category_name: '腰椎',
    has_dicom: '1',
    has_report: '1',
    quality_control: 1,
    quality_control_hospital: 1,
    rpt_descrip: '腰椎生理曲度变直，诸椎体骨质信号未见异常。L4/5 椎间盘向后突出，硬膜囊受压，相应水平椎管轻度狭窄；L5/S1 椎间盘轻度膨出。脊髓信号未见异常。',
    rpt_seeing: 'L4/5 椎间盘突出；L5/S1 椎间盘膨出。'
  },
  {
    id: '90005',
    item_name: '膝关节MRI平扫',
    instrna: 'MRI',
    category_name: '膝关节',
    has_dicom: '1',
    has_report: '1',
    quality_control: 0,
    quality_control_hospital: 1,
    rpt_descrip: '右膝关节内外侧半月板形态及信号未见异常；前后交叉韧带及内外侧副韧带形态、信号正常；关节软骨未见明显缺损；关节腔见少量积液信号。',
    rpt_seeing: '右膝关节少量积液。'
  },
  {
    id: '90006',
    item_name: '全腹部CT增强',
    instrna: 'CT',
    category_name: '腹部',
    has_dicom: '1',
    has_report: '1',
    quality_control: 1,
    quality_control_hospital: 0,
    rpt_descrip: '肝脏、胆囊、胰腺、脾脏及双肾形态大小正常，增强后未见异常强化灶。腹腔及腹膜后未见肿大淋巴结，腹腔未见积液。',
    rpt_seeing: '全腹部CT增强未见明显异常。'
  },
  {
    id: '90007',
    item_name: '腹部彩超',
    instrna: '超声',
    category_name: '肝胆脾胰',
    has_dicom: '1',
    has_report: '1',
    quality_control: 0,
    quality_control_hospital: 1,
    rpt_descrip: '肝脏大小形态正常，实质回声均匀，肝内血管纹理清晰，未见占位性病变。胆囊大小正常，壁光滑，腔内未见异常回声。脾脏、胰腺未见异常。',
    rpt_seeing: '肝胆脾胰超声未见明显异常。'
  },
  {
    id: '90008',
    item_name: '心脏彩超',
    instrna: '超声',
    category_name: '心脏',
    has_dicom: '1',
    has_report: '1',
    quality_control: 1,
    quality_control_hospital: 1,
    rpt_descrip: '各房室腔内径正常范围，室间隔及左室后壁厚度正常，运动协调。各瓣膜形态、活动未见异常，CDFI 未见明显异常血流信号。左室射血分数 63%。',
    rpt_seeing: '心脏结构及功能未见明显异常。'
  },
  {
    id: '90009',
    item_name: '十二导联心电图',
    instrna: '心电图机',
    category_name: '心脏',
    has_dicom: '0',
    has_report: '1',
    quality_control: 0,
    quality_control_hospital: 1,
    rpt_descrip: '窦性心律，心率 76 次/分，P-QRS-T 波形态正常，各导联 ST 段无明显偏移，QT 间期正常范围。',
    rpt_seeing: '窦性心律，心电图大致正常。'
  },
  {
    id: '90010',
    item_name: '颈椎MRI平扫',
    instrna: 'MRI',
    category_name: '颈椎',
    has_dicom: '1',
    has_report: '0',
    quality_control: 0,
    quality_control_hospital: 1,
    rpt_descrip: '颈椎生理曲度变直，C5/6 椎间盘向后突出，硬膜囊轻度受压；余椎间盘信号未见明显异常，脊髓信号正常。',
    rpt_seeing: 'C5/6 椎间盘突出。'
  }
]

// 省外调阅数据：结构与省内一致，只是都来自非江苏省的医院
const CROSS_STUDIES = [
  {
    id: '91001',
    item_name: '胸部HRCT平扫',
    instrna: 'CT',
    category_name: '胸部',
    has_dicom: '1',
    has_report: '1',
    quality_control: 1,
    quality_control_hospital: 0,
    hospital: CROSS_HOSPITALS[0],
    rpt_descrip: '两肺纹理清晰，左肺下叶背段见一实性结节，大小约 8mm×7mm，边缘可见浅分叶，未见胸膜牵拉；余肺野未见异常密度影。纵隔内未见肿大淋巴结，双侧胸腔未见积液。',
    rpt_seeing: '左肺下叶背段结节，建议增强扫描进一步评估。'
  },
  {
    id: '91002',
    item_name: '上腹部MRI增强',
    instrna: 'MRI',
    category_name: '腹部',
    has_dicom: '1',
    has_report: '1',
    quality_control: 1,
    quality_control_hospital: 1,
    hospital: CROSS_HOSPITALS[1],
    rpt_descrip: '肝脏形态大小正常，肝右叶见一类圆形长 T1 长 T2 信号灶，直径约 12mm，增强后动脉期未见明显强化，门脉期及延迟期未见廓清。胆囊、胰腺、脾脏及双肾未见异常。',
    rpt_seeing: '肝右叶小囊肿，建议定期复查。'
  },
  {
    id: '91003',
    item_name: '头颅MRI平扫',
    instrna: 'MRI',
    category_name: '头颅',
    has_dicom: '1',
    has_report: '1',
    quality_control: 0,
    quality_control_hospital: 0,
    hospital: CROSS_HOSPITALS[2],
    rpt_descrip: '双侧大脑半球对称，灰白质对比正常，双侧基底节区见散在点状长 T2 信号影，边界清楚。脑室系统大小、形态正常，中线结构居中，垂体、视交叉未见异常。',
    rpt_seeing: '双侧基底节区腔隙灶，请结合临床。'
  }
]

const pad = (n) => String(n).padStart(2, '0')
const fmtDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

// 各条影像的检查时间：铺在 2022-2026 之间，避免整张列表清一色是当年数据
const CHECK_DATES = [
  '2026-08-12 09:15',
  '2026-05-20 14:30',
  '2025-11-08 10:05',
  '2025-06-25 15:40',
  '2024-12-10 08:50',
  '2024-07-16 11:20',
  '2023-10-09 13:35',
  '2023-04-18 16:10',
  '2022-11-22 09:45',
  '2022-05-14 10:55',
  '2026-02-26 11:05',
  '2025-02-14 09:20',
  '2023-08-30 14:15'
]
// 列表 / 报告 / 申请单共用同一条检查时间，几处日期才能对得上
const checkDateOf = (index) => new Date(CHECK_DATES[index % CHECK_DATES.length].replace(/-/g, '/'))

// 省内 + 省外共用一个池子，这样详情/报告/查看器接口对两类 id 都能命中
const ALL_STUDIES = STUDIES.concat(CROSS_STUDIES)
const studyById = (id) => ALL_STUDIES.find((item) => item.id === id) || STUDIES[0]
const studyIndex = (id) => Math.max(ALL_STUDIES.findIndex((item) => item.id === id), 0)
// 省外记录自带医院，省内按顺序轮转
const hospitalOf = (study, index) => study.hospital || HOSPITALS[index % HOSPITALS.length]

// 报告扫描件：用内联 SVG 充当图片，避免额外依赖图片资源
const reportSnapshot = (study, hospital, patient) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="980">
  <rect width="760" height="980" fill="#ffffff"/>
  <rect x="20" y="20" width="720" height="940" fill="none" stroke="#d9d9d9" stroke-width="2"/>
  <text x="380" y="90" font-size="30" font-family="SimSun" text-anchor="middle" fill="#333">${hospital.hospital_name}</text>
  <text x="380" y="140" font-size="26" font-family="SimSun" text-anchor="middle" fill="#333">医 学 影 像 诊 断 报 告</text>
  <line x1="60" y1="165" x2="700" y2="165" stroke="#333" stroke-width="2"/>
  <text x="70" y="215" font-size="20" font-family="SimSun" fill="#333">患者姓名：${patient.name}</text>
  <text x="420" y="215" font-size="20" font-family="SimSun" fill="#333">性别/年龄：${patient.sex}/${patient.age}</text>
  <text x="70" y="260" font-size="20" font-family="SimSun" fill="#333">检查项目：${study.item_name}</text>
  <text x="420" y="260" font-size="20" font-family="SimSun" fill="#333">检查部位：${study.category_name}</text>
  <text x="70" y="340" font-size="20" font-family="SimSun" fill="#333">影像表现：</text>
  <text x="70" y="380" font-size="17" font-family="SimSun" fill="#555">${study.rpt_descrip.slice(0, 34)}</text>
  <text x="70" y="408" font-size="17" font-family="SimSun" fill="#555">${study.rpt_descrip.slice(34, 68)}</text>
  <text x="70" y="436" font-size="17" font-family="SimSun" fill="#555">${study.rpt_descrip.slice(68, 102)}</text>
  <text x="70" y="490" font-size="20" font-family="SimSun" fill="#333">诊断意见：</text>
  <text x="70" y="530" font-size="17" font-family="SimSun" fill="#555">${study.rpt_seeing}</text>
  <text x="70" y="860" font-size="20" font-family="SimSun" fill="#333">报告医师：${DOCTORS[0]}</text>
  <text x="420" y="860" font-size="20" font-family="SimSun" fill="#333">审核医师：${DOCTORS[2]}</text>
  <text x="70" y="930" font-size="15" font-family="SimSun" fill="#999">（模拟报告扫描件，仅用于演示展示效果）</text>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// 影像浏览：演示环境未接影像服务器，用 public/dicom.png 这张胸片顶替，
// 版式按阅片器做：顶部工具条 + 左侧序列列表 + 中间影像（四角 DICOM 标注）。
// 页面本身是 data: URL，没有自己的 origin，相对路径解析不到图片，
// 所以要按 document.baseURI 现算绝对地址
// （publicPath 是 './'，直接写 /dicom.png 在子路径部署下会失效）
const viewerPage = (study, hospital, patient, checkTime) => {
  const shot = new URL('dicom.png', document.baseURI).href
  // 各模态给一套常见的序列；只有一张图，切序列只换标注和层数
  const series =
    study.instrna === 'DR' || study.instrna === '乳腺钼靶'
      ? [{ name: '正位', frames: 1 }, { name: '侧位', frames: 1 }]
      : study.instrna === '超声' || study.instrna === '心电图机'
        ? [{ name: '主序列', frames: 1 }]
        : [{ name: '轴位', frames: 64 }, { name: '冠状位重建', frames: 32 }, { name: '矢状位重建', frames: 32 }]

  const seriesHtml = series
    .map(
      (item, i) => `      <div class="series-item${i ? '' : ' active'}" data-index="${i}">
        <img class="series-thumb" src="${shot}" alt="">
        <div class="series-meta">
          <b>序列 ${i + 1}</b>
          <span>${item.name}</span>
          <span>${item.frames} 层</span>
        </div>
      </div>`
    )
    .join('\n')

  const toolsHtml = ['移动', '缩放', '窗宽窗位', '测量']
    .map(
      (name, i) => `<button class="tool${i ? '' : ' active'}" type="button" data-tool="${name}">${name}</button>`
    )
    .join('')

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>影像浏览 - ${study.item_name}</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body { background: #0b0f14; color: #dfe7f1; overflow: hidden;
         font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif; }
  .viewer { display: flex; flex-direction: column; height: 100vh; }

  .toolbar { flex: none; height: 46px; display: flex; align-items: center; gap: 6px;
             padding: 0 12px; background: #141a22; border-bottom: 1px solid #222c38; }
  .toolbar-title { flex: 1; min-width: 0; margin-right: 8px; font-size: 13px; color: #e8eef7;
                   white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .toolbar-title span { margin-left: 8px; color: #8fa3b8; }
  .tool { flex: none; height: 30px; padding: 0 12px; border: 1px solid #263140; border-radius: 6px;
          background: #1b232d; color: #cfdcea; font-family: inherit; font-size: 13px; cursor: pointer; }
  .tool:hover { background: #223041; }
  .tool.active { border-color: #1d6cec; background: #1d6cec; color: #fff; }
  .toolbar-right { flex: none; display: flex; align-items: center; gap: 6px; margin-left: 8px; }
  .frame-btn { width: 30px; padding: 0; }
  .counter { min-width: 60px; text-align: center; font-size: 13px; color: #9fb0c4; }

  .stage-wrap { flex: 1; display: flex; min-height: 0; }
  .series { flex: none; width: 186px; background: #121820; border-right: 1px solid #222c38;
            overflow-y: auto; }
  .series-title { padding: 12px; font-size: 12px; letter-spacing: 0.5px; color: #8fa3b8; }
  .series-item { display: flex; gap: 10px; padding: 8px 12px; cursor: pointer;
                 border-left: 2px solid transparent; }
  .series-item:hover { background: #172029; }
  .series-item.active { background: #1b2634; border-left-color: #1d6cec; }
  .series-thumb { flex: none; width: 44px; height: 44px; border-radius: 4px; background: #000;
                  object-fit: cover; }
  .series-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0;
                 font-size: 12px; line-height: 1.4; color: #8fa3b8; }
  .series-meta b { color: #e8eef7; font-weight: 600; }

  .stage { position: relative; flex: 1; min-width: 0; display: flex;
           align-items: center; justify-content: center; background: #000; }
  .stage img { display: block; max-width: 100%; max-height: 100%; }
  .overlay { position: absolute; font-size: 12px; line-height: 1.7; color: #cfe0f0;
             text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9); pointer-events: none; }
  .overlay b { font-weight: 600; }
  .overlay.tl { top: 12px; left: 14px; }
  .overlay.tr { top: 12px; right: 14px; text-align: right; }
  .overlay.bl { bottom: 12px; left: 14px; }
  .overlay.br { bottom: 12px; right: 14px; text-align: right; }
</style>
</head>
<body>
<div class="viewer">
  <div class="toolbar">
    <div class="toolbar-title">${patient.name} · ${study.item_name}<span>${study.instrna} · ${study.category_name}</span></div>
    ${toolsHtml}
    <button class="tool" type="button" data-reset="1">复位</button>
    <div class="toolbar-right">
      <button class="tool frame-btn" type="button" data-step="-1">‹</button>
      <div class="counter" id="counter">1 / ${series[0].frames}</div>
      <button class="tool frame-btn" type="button" data-step="1">›</button>
    </div>
  </div>
  <div class="stage-wrap">
    <div class="series">
      <div class="series-title">序列</div>
${seriesHtml}
    </div>
    <div class="stage">
      <img src="${shot}" alt="">
      <div class="overlay tl">
        <div><b>${patient.name}</b></div>
        <div>${patient.sex} · ${patient.age}岁</div>
        <div>${patient.idCard}</div>
      </div>
      <div class="overlay tr">
        <div>${hospital.hospital_name}</div>
        <div>${study.instrna} · ${study.category_name}</div>
        <div>${checkTime}</div>
      </div>
      <div class="overlay bl">
        <div>${study.item_name}</div>
        <div>WW 400 / WL 40</div>
      </div>
      <div class="overlay br">
        <div id="series-name">序列 1 · ${series[0].name}</div>
        <div>层 <b id="frame-no">1</b> / <b id="frame-total">${series[0].frames}</b></div>
        <div>缩放 100%</div>
      </div>
    </div>
  </div>
</div>
<script>
(function () {
  var seriesData = ${JSON.stringify(series)}
  var index = 0
  var frame = 1

  function render() {
    var cur = seriesData[index]
    document.getElementById('frame-no').textContent = String(frame)
    document.getElementById('frame-total').textContent = String(cur.frames)
    document.getElementById('counter').textContent = frame + ' / ' + cur.frames
    document.getElementById('series-name').textContent = '序列 ' + (index + 1) + ' · ' + cur.name
    var items = document.querySelectorAll('.series-item')
    for (var i = 0; i < items.length; i++) {
      items[i].className = 'series-item' + (i === index ? ' active' : '')
    }
  }

  function activeTool(name) {
    var tools = document.querySelectorAll('.tool[data-tool]')
    for (var i = 0; i < tools.length; i++) {
      tools[i].className = 'tool' + (tools[i].getAttribute('data-tool') === name ? ' active' : '')
    }
  }

  document.querySelector('.series').addEventListener('click', function (event) {
    var item = event.target.closest('.series-item')
    if (!item) return
    index = Number(item.getAttribute('data-index'))
    frame = 1
    render()
  })

  document.querySelector('.toolbar').addEventListener('click', function (event) {
    var target = event.target
    if (!target.classList.contains('tool')) return
    if (target.getAttribute('data-reset')) {
      frame = 1
      activeTool('移动')
      render()
      return
    }
    var step = target.getAttribute('data-step')
    if (step) {
      var cur = seriesData[index]
      frame = ((frame - 1 + Number(step) + cur.frames) % cur.frames) + 1
      render()
      return
    }
    activeTool(target.getAttribute('data-tool'))
  })
})()
<\/script>
</body>
</html>`
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
}

// 列表查询时缓存患者信息，供只接收 study_primary_id 的详情接口复用
let currentPatient = { name: '张伟', idCard: '3204**********4733', sex: '男', age: '55' }
let currentStudy = STUDIES[0]
let currentCheckDate = fmtDate(checkDateOf(0))

const toStudyRow = (study, index) => {
  const hospital = hospitalOf(study, index)
  const checkDate = checkDateOf(index)
  return {
    data_scope: study.hospital ? 'province_out' : 'province_in',
    id: study.id,
    pat_name: currentPatient.name,
    patient_id_card: currentPatient.idCard,
    item_name: study.item_name,
    instrna: study.instrna,
    category_name: study.category_name,
    // 报告结论：时间轴卡片要展示，列表原本不读这个字段，透出去不影响列表页
    rpt_seeing: study.rpt_seeing,
    check_date: fmtDate(checkDate),
    hospital_name: hospital.hospital_name,
    hospital_code: hospital.hospital_code,
    hospital_level: hospital.hospital_level,
    quality_control: study.quality_control,
    quality_control_hospital: study.quality_control_hospital,
    has_dicom: study.has_dicom,
    has_report: study.has_report,
    hr_flag: study.quality_control_hospital ? '1' : '0',
    is_repeat: 0
  }
}

const asStudyList = (studies, params) => {
  const name = readParam(params, 'patient_name')
  const idCard = readParam(params, 'patient_id_card')
  if (name) currentPatient = { ...currentPatient, name, idCard: idCard || currentPatient.idCard }
  return { code: 200, message: 'ok', data: studies.map(toStudyRow) }
}

export function buildStudyList(params) {
  return asStudyList(STUDIES, params)
}

// 省外调阅：字段与省内完全一致，只是数据来自非江苏省的医院
export function buildCrossProvinceStudyList(params) {
  return asStudyList(CROSS_STUDIES, params)
}

export function buildStudyConditions() {
  return {
    code: 200,
    message: 'ok',
    data: {
      hospital: HOSPITALS.concat(CROSS_HOSPITALS).map((h) => ({
        hospital_name: h.hospital_name,
        hospital_code: h.hospital_code
      })),
      modality: MODALITY,
      ckpt_name: BODY_PARTS
    }
  }
}

export function buildTimeRange() {
  // -1 表示全部时间范围
  return { code: 200, message: 'ok', data: -1 }
}

// /report/list
export function buildReportList(params) {
  const id = readParam(params, 'study_primary_id')
  const study = studyById(id)
  const index = studyIndex(id)
  const hospital = hospitalOf(study, index)
  const checkDate = checkDateOf(index)
  currentStudy = study
  currentCheckDate = fmtDate(checkDate)

  return {
    code: 200,
    message: 'ok',
    data: [
      {
        study_primary_id: study.id,
        system_patient_id: `P2026${pad(index + 1)}${study.id}`,
        organ_name: hospital.hospital_name,
        organ_code: hospital.hospital_code,
        proj_name: study.item_name,
        item_name: study.item_name,
        name: currentPatient.name,
        age: currentPatient.age,
        sex: currentPatient.sex,
        op_em_hp_ex_mark: index % 2 === 0 ? '门诊' : '住院',
        chk_dpt_name: ['呼吸内科', '骨科', '神经内科', '消化内科'][index % 4],
        ris_study_id: `RIS${study.id}`,
        op_em_hp_ex_no: `MZ20260${pad(index + 1)}${String(3500 + index)}`,
        chk_dt: currentCheckDate,
        rpt_dt: fmtDate(new Date(checkDate.getTime() + 3 * 60 * 60 * 1000)),
        ckpt_name: study.category_name,
        rpt_descrip: study.rpt_descrip,
        rpt_seeing: study.rpt_seeing,
        chk_doc_name: DOCTORS[index % DOCTORS.length],
        rv_name: DOCTORS[(index + 2) % DOCTORS.length],
        rpt_name: DOCTORS[(index + 1) % DOCTORS.length],
        rv2_name: DOCTORS[(index + 3) % DOCTORS.length],
        rpt_code: `RPT${study.id}`,
        snapshot_url: reportSnapshot(study, hospital, currentPatient),
        snapshot_type: '1',
        rpt_share: '0',
        quality_control: study.quality_control,
        thumb_img: [],
        response_for_image: '',
        remark_for_image: '',
        image_has_hr: '0',
        image_hr: ''
      }
    ]
  }
}

// /apply/list
export function buildApplyList(params) {
  const id = readParam(params, 'study_primary_id')
  const study = studyById(id)
  const index = studyIndex(id)
  const hospital = hospitalOf(study, index)

  return {
    code: 200,
    message: 'ok',
    data: [
      {
        apply_type: 2,
        organ_name: hospital.hospital_name,
        proj_name: study.item_name,
        exam_id: `EX${study.id}`,
        name: currentPatient.name,
        age: currentPatient.age,
        sex: currentPatient.sex,
        app_dpt_name: ['呼吸内科', '骨科', '神经内科', '消化内科'][index % 4],
        cardtype: '01',
        cardno: currentPatient.idCard,
        idcard_hos: currentPatient.idCard,
        op_em_hp_ex_mark: index % 2 === 0 ? '门诊' : '住院',
        allergy_history: '无',
        item_name: study.item_name,
        subj_complaint: '咳嗽咳痰 1 周，伴活动后胸闷。',
        symptom: '患者 1 周前受凉后出现咳嗽、咳白色粘痰，无明显发热，自服药物后症状未见明显缓解。',
        app_remark: `了解${study.category_name}情况，明确诊断。`,
        app_doc_name: DOCTORS[(index + 1) % DOCTORS.length],
        apply_dt: fmtDate(new Date(checkDateOf(index).getTime() - 35 * 60 * 1000)),
        ckpt_name: study.category_name,
        scan_report_url: '',
        apply_study_list: STUDIES.slice(0, 3).map((item, i) => ({
          proj_name: item.item_name,
          ckpt_name: item.category_name,
          is_current_study: item.id === study.id ? '1' : '0',
          has_dicom: item.has_dicom,
          has_report: item.has_report,
          study_primary_id: item.id,
          pat_name: currentPatient.name,
          hospital_code: HOSPITALS[i % HOSPITALS.length].hospital_code
        }))
      }
    ]
  }
}

// /report/list/without_trace
export function buildTranceList(params) {
  const id = readParam(params, 'study_primary_id')
  const study = studyById(id)
  const index = studyIndex(id)
  return {
    code: 200,
    message: 'ok',
    data: [
      {
        name: currentPatient.name,
        proj_name: study.item_name,
        item_name: study.item_name,
        organ_name: hospitalOf(study, index).hospital_name,
        chk_dt: currentCheckDate,
        ris_study_id: `RIS${study.id}`
      }
    ]
  }
}

// /recognition/patient_info
export function buildRecognitionPatient(params) {
  const id = readParam(params, 'study_primary_id')
  const study = studyById(id)
  const index = studyIndex(id)
  return {
    code: 200,
    message: 'ok',
    data: {
      view_record_id: `VIEW2026${study.id}`,
      study_request_time: fmtDate(new Date(checkDateOf(index).getTime() - 35 * 60 * 1000)),
      dpt_name: ['呼吸内科', '骨科', '神经内科', '消化内科'][index % 4],
      ckpt_name: study.category_name,
      modality: study.instrna,
      proj_name: study.item_name,
      response_for_image: '',
      remark_for_image: '',
      image_has_hr: '0',
      image_hr: ''
    }
  }
}

// /study/viewer_url
export function buildViewerUrl(params) {
  const id = readParam(params, 'study_primary_id')
  const study = studyById(id)
  const index = studyIndex(id)
  const checkTime = fmtDate(checkDateOf(index)).slice(0, 16)
  return { code: 200, message: 'ok', data: viewerPage(study, hospitalOf(study, index), currentPatient, checkTime) }
}

// /approve/reason_list
export function buildApproveReason() {
  return {
    code: 200,
    message: 'ok',
    data: {
      '1': '检查部位与本次诊疗不符',
      '2': '检查时间超出互认时限',
      '3': '图像质量不满足诊断要求',
      '4': '病情变化需重新检查'
    }
  }
}

// /auth/info 仅在请求失败时兜底，避免离线演示卡在授权弹窗
export function buildAuthStatus() {
  return { code: 200, message: 'ok', data: { auth_status: 1 } }
}
