<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowLeft, User, Calendar, Clock, MapPin, Phone, FileText, Activity, ClipboardCheck, ChevronRight, Eye } from 'lucide-vue-next';

const props = defineProps<{
  patient: any;
  record: any;
}>();

const emit = defineEmits(['back', 'show-dicom']);

const opTimeline = [
  { id: 1, date: '2024-05-15', time: '09:30', title: '冠心病常规复诊', dept: '心内科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'op' },
  { id: 2, date: '2024-03-22', time: '14:20', title: '腰椎间盘突出治疗', dept: '骨科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'op' },
  { id: 3, date: '2024-03-15', time: '10:30', title: '原发性高血压', dept: '心内科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'op' },
  { id: 4, date: '2024-02-10', time: '11:15', title: '慢性胃炎', dept: '消化内科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'op' },
  { id: 5, date: '2024-01-05', time: '10:00', title: '上呼吸道感染', dept: '呼吸内科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'op' },
  { id: 6, date: '2023-11-20', time: '15:30', title: '腰肌劳损', dept: '骨科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'op' },
  { id: 7, date: '2023-09-12', time: '08:45', title: '结膜炎', dept: '眼科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'op' },
];

const ipTimeline = [
  { id: 101, date: '2024-03-10', time: '10:00', title: '急性心肌梗死住院记录', dept: '心内科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'ip' },
  { id: 102, date: '2023-05-10', time: '08:00', title: '阑尾炎住院', dept: '普外科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'ip' },
  { id: 103, date: '2022-12-01', time: '09:00', title: '大叶性肺炎', dept: '呼吸内科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'ip' },
  { id: 104, date: '2022-08-15', time: '14:30', title: '急性胃肠炎', dept: '消化内科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'ip' },
  { id: 105, date: '2022-03-10', time: '11:00', title: '左桡骨远端骨折', dept: '骨伤科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'ip' },
  { id: 106, date: '2021-08-05', time: '10:30', title: '血糖平衡调节', dept: '内分泌科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'ip' },
];

const labTimeline = [
  { id: 201, date: '2024-05-16', time: '08:30', title: '生化常规检查', dept: '检验科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'lab' },
  { id: 202, date: '2024-04-12', time: '09:15', title: '糖化血红蛋白', dept: '检验科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'lab' },
  { id: 203, date: '2024-03-15', time: '08:35', title: '血常规 (五分类)', dept: '检验科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'lab' },
  { id: 204, date: '2023-12-15', time: '09:00', title: '尿常规', dept: '检验科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'lab' },
  { id: 205, date: '2023-10-10', time: '08:45', title: '凝血功能', dept: '检验科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'lab' },
  { id: 206, date: '2023-05-20', time: '10:15', title: '糖化血红蛋白', dept: '检验科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'lab' },
];

const examTimeline = [
  { id: 301, date: '2024-05-16', time: '10:20', title: '胸部CT平扫', dept: '放射科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'exam' },
  { id: 302, date: '2024-04-12', time: '14:00', title: '彩色多普勒超声', dept: '超声科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'exam' },
  { id: 303, date: '2024-03-16', time: '10:20', title: '胸部CT平扫', dept: '放射科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'exam' },
  { id: 304, date: '2024-03-15', time: '15:00', title: '心电图检查', dept: '心功能室', hosp: '常州市第一人民医院', level: '三级甲等', type: 'exam' },
  { id: 305, date: '2024-03-12', time: '11:30', title: '心脏彩超', dept: '超声科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'exam' },
  { id: 306, date: '2023-12-10', time: '09:00', title: '腹部超声', dept: '超声科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'exam' },
];

const medTimeline = [
  { id: 401, date: '2024-05-17', time: '10:00', title: '长期用药处方', dept: '心内科', hosp: '常州德仁堂药店', level: '', type: 'med' },
  { id: 402, date: '2024-04-15', time: '15:30', title: '门诊处方详单', dept: '门诊部', hosp: '常州万民药店', level: '', type: 'med' },
  { id: 403, date: '2024-03-15', time: '10:00', title: '高血压用药', dept: '心内科', hosp: '常州德仁堂药店', level: '', type: 'med' },
  { id: 404, date: '2024-02-10', time: '15:00', title: '胃病用药', dept: '消化内科', hosp: '南京益丰大药房', level: '', type: 'med' },
  { id: 405, date: '2024-01-05', time: '11:00', title: '感冒用药', dept: '呼吸内科', hosp: '南京益丰大药房', level: '', type: 'med' },
  { id: 406, date: '2023-11-20', time: '12:00', title: '止痛用药', dept: '骨科', hosp: '常州万民药店', level: '', type: 'med' },
];

const wdTimeline = [
  { id: 501, date: '2026-06-25', time: '08:32', title: '24h动态心电监测报告', dept: '个人穿戴', hosp: 'Apple Watch Series 9', level: '', type: 'wd' },
  { id: 502, date: '2026-06-24', time: '22:15', title: '睡眠呼吸监测', dept: '个人穿戴', hosp: '华为手环 9', level: '', type: 'wd' },
  { id: 503, date: '2026-06-23', time: '18:45', title: '家庭血压日志·本周汇总', dept: '居家监测', hosp: '欧姆龙电子血压计', level: '', type: 'wd' },
  { id: 504, date: '2026-06-22', time: '07:15', title: '空腹及餐后血糖监测周报', dept: '居家监测', hosp: '鱼跃血糖仪', level: '', type: 'wd' },
  { id: 505, date: '2026-06-21', time: '14:00', title: '72h连续心电贴片监测终评', dept: '远程医疗', hosp: '康泰心电贴(CM-X)', level: '', type: 'wd' },
  { id: 506, date: '2026-06-20', time: '09:30', title: '体成分分析月报', dept: '居家监测', hosp: '小米体脂秤 2', level: '', type: 'wd' },
];

const currentTimeline = computed(() => {
  if (props.record?.type === 'ip') return ipTimeline;
  if (props.record?.type === 'lab') return labTimeline;
  if (props.record?.type === 'exam') return examTimeline;
  if (props.record?.type === 'med') return medTimeline;
  if (props.record?.type === 'wd') return wdTimeline;
  return opTimeline;
});

const searchQuery = ref('');
const appliedSearchQuery = ref('');

const filteredTimeline = computed(() => {
  if (!appliedSearchQuery.value) return currentTimeline.value;
  return currentTimeline.value.filter(item =>
    item.title.includes(appliedSearchQuery.value) ||
    item.dept.includes(appliedSearchQuery.value) ||
    item.hosp.includes(appliedSearchQuery.value)
  );
});

const activeTimelineId = ref(
  (() => {
    const tl = currentTimeline.value;
    if (!props.record) return tl[0]?.id;
    const match = tl.find(t =>
      t.date === props.record.date &&
      t.title === (props.record.diag || props.record.title)
    );
    return match?.id || tl[0]?.id;
  })()
);
const activeRecord = computed(() => currentTimeline.value.find(t => t.id === activeTimelineId.value) || currentTimeline.value[0]);

const selectTimeline = (id: number) => {
  activeTimelineId.value = id;
};

const handleSearch = () => {
  appliedSearchQuery.value = searchQuery.value;
};

</script>

<template>
  <div class="op-detail-page">
    <!-- Header -->
    <header class="op-header">
      <div class="op-header-l">
        <button class="back-btn" @click="emit('back')">
          <ArrowLeft :size="18" />
          <span>返回工作台</span>
        </button>
        <div class="divider"></div>
        <div class="op-title">
          {{ activeRecord.title }}
        </div>
      </div>
      <div class="op-header-r">
      </div>
    </header>

    <div class="op-body">
      <!-- Left Sidebar -->
      <aside class="op-sidebar">
        <!-- Patient Info removed -->

        <!-- Timeline Card -->
        <div class="op-card timeline-card">
          <div class="op-search">
            <input type="text" placeholder="请输入检索项目" v-model="searchQuery" @keyup.enter="handleSearch" />
            <button class="filter-text-btn" @click="handleSearch">查询</button>
          </div>

          <div class="op-timeline scroll-y">
            <div class="tl-year">{{ activeRecord.date.split('-')[0] }}</div>
            <div
              v-for="item in filteredTimeline"
              :key="item.id"
              :class="['tl-item', item.id === activeTimelineId ? 'on' : '']"
              @click="selectTimeline(item.id)"
            >
              <div class="tl-dot"></div>
              <div class="tl-content">
                <div class="tl-time">{{ item.date.slice(5) }}<br/>{{ item.time }}</div>
                <div class="tl-main">
                  <div class="tl-title">{{ item.title }}</div>
                  <div class="tl-meta">
                    <span>{{ item.hosp }}</span>
                    <span>{{ item.dept }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content (Medical Record) -->
      <main class="op-main">
        <!-- 住院病案首页 (Inpatient Home Page) -->
        <div class="report-container ip-home-page" v-if="activeRecord.type === 'ip'">
          <div class="report-header">
            <div class="report-hosp">{{ activeRecord.hosp }}</div>
            <div class="report-title">住院病案首页</div>
            <div class="ip-meta-top">
              <span>医疗付费方式：职工医保</span>
              <span>第 1 次住院</span>
              <span>病案号：IP{{ activeRecord.id }}99283</span>
            </div>
          </div>

          <div class="ip-scroll-content">
            <div class="ip-section-title">基本信息</div>
            <div class="ip-section-grid">
              <div class="ip-grid-row">
                <div class="ip-item"><span class="ip-lbl">姓名：</span><span class="ip-val">{{ patient?.name || '陈**' }}</span></div>
                <div class="ip-item"><span class="ip-lbl">性别：</span><span class="ip-val">{{ patient?.gender || '男' }}</span></div>
                <div class="ip-item"><span class="ip-lbl">出生日期：</span><span class="ip-val">1982-05-12</span></div>
                <div class="ip-item"><span class="ip-lbl">年龄：</span><span class="ip-val">{{ patient?.age || '42' }}岁</span></div>
                <div class="ip-item"><span class="ip-lbl">国籍：</span><span class="ip-val">中国</span></div>
              </div>
              <div class="ip-grid-row">
                <div class="ip-item" style="grid-column: span 2"><span class="ip-lbl">身份证号：</span><span class="ip-val">32040419820512****</span></div>
                <div class="ip-item"><span class="ip-lbl">职业：</span><span class="ip-val">工程师</span></div>
                <div class="ip-item"><span class="ip-lbl">婚姻：</span><span class="ip-val">已婚</span></div>
                <div class="ip-item"><span class="ip-lbl">民族：</span><span class="ip-val">汉族</span></div>
              </div>
              <div class="ip-grid-row">
                <div class="ip-item" style="grid-column: span 3"><span class="ip-lbl">现住址：</span><span class="ip-val">常州市天宁区青龙街道某小区</span></div>
                <div class="ip-item" style="grid-column: span 2"><span class="ip-lbl">电话：</span><span class="ip-val">138****8832</span></div>
              </div>
            </div>

            <div class="ip-section-title">入院及出院信息</div>
            <div class="ip-section-grid">
              <div class="ip-grid-row" style="background: #fafafa; font-weight: 600;">
                <div class="ip-item" style="grid-column: span 2">日期项目</div>
                <div class="ip-item">就诊科别</div>
                <div class="ip-item">病房/病床</div>
                <div class="ip-item">备注</div>
              </div>
              <div class="ip-grid-row">
                <div class="ip-item" style="grid-column: span 2"><span class="ip-lbl">入院：</span><span class="ip-val">{{ activeRecord.date }} 10:00</span></div>
                <div class="ip-item"><span class="ip-val">{{ activeRecord.dept }}</span></div>
                <div class="ip-item"><span class="ip-val">1201 / 22床</span></div>
                <div class="ip-item"><span class="ip-val">-</span></div>
              </div>
              <div class="ip-grid-row">
                <div class="ip-item" style="grid-column: span 2"><span class="ip-lbl">出院：</span><span class="ip-val">{{ activeRecord.title.includes('心肌梗死') ? '2024-03-20' : activeRecord.title.includes('阑尾炎') ? '2023-05-18' : activeRecord.title.includes('肺炎') ? '2022-12-11' : activeRecord.title.includes('胃肠炎') ? '2022-08-23' : activeRecord.title.includes('骨折') ? '2022-03-25' : '2021-08-12' }} 09:30</span></div>
                <div class="ip-item"><span class="ip-val">{{ activeRecord.dept }}</span></div>
                <div class="ip-item"><span class="ip-val">1201 / 22床</span></div>
                <div class="ip-item"><span class="ip-lbl">实际住院：</span><span class="ip-val" style="color: var(--blue);">{{ activeRecord.title.includes('心肌梗死') ? '11' : activeRecord.title.includes('阑尾炎') ? '8' : activeRecord.title.includes('肺炎') ? '10' : activeRecord.title.includes('胃肠炎') ? '8' : activeRecord.title.includes('骨折') ? '15' : '7' }}</span> 天</div>
              </div>
            </div>

            <div class="ip-section-title">诊断信息</div>
            <table class="ip-diag-table">
              <thead>
                <tr>
                  <th style="width: 120px">类别</th>
                  <th>疾病诊断</th>
                  <th style="width: 120px">疾病编码 (ICD-10)</th>
                  <th style="width: 100px">入院病情</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="ip-diag-type">主要诊断</td>
                  <td style="font-weight: 700; color: var(--ink);">{{ activeRecord.title.includes('心肌梗死') ? '急性心肌梗死' : activeRecord.title.includes('阑尾炎') ? '急性阑尾炎' : activeRecord.title.includes('肺炎') ? '大叶性肺炎' : activeRecord.title.includes('胃肠炎') ? '急性胃肠炎' : activeRecord.title.includes('骨折') ? '左桡骨远端骨折' : 'II型糖尿病' }}</td>
                  <td>{{ activeRecord.title.includes('心肌梗死') ? 'I21.100' : activeRecord.title.includes('阑尾炎') ? 'K35.900' : activeRecord.title.includes('肺炎') ? 'J15.200' : activeRecord.title.includes('胃肠炎') ? 'K52.900' : activeRecord.title.includes('骨折') ? 'S52.500' : 'E11.900' }}</td>
                  <td>有</td>
                </tr>
                <tr v-for="i in 3" :key="i">
                  <td class="ip-diag-type">其他诊断</td>
                  <td>{{ i === 1 ? (activeRecord.title.includes('心肌梗死') ? '原发性高血压 3级' : activeRecord.title.includes('阑尾炎') ? '局限性腹膜炎' : activeRecord.title.includes('肺炎') ? '低氧血症' : activeRecord.title.includes('胃肠炎') ? '轻度脱水' : activeRecord.title.includes('骨折') ? '骨质疏松' : '高脂血症') : '-' }}</td>
                  <td>{{ i === 1 ? (activeRecord.title.includes('心肌梗死') ? 'I10.x00' : activeRecord.title.includes('阑尾炎') ? 'K65.900' : activeRecord.title.includes('肺炎') ? 'R09.100' : activeRecord.title.includes('胃肠炎') ? 'E86.x00' : activeRecord.title.includes('骨折') ? 'M81.900' : 'E78.500') : '-' }}</td>
                  <td>{{ i === 1 ? '有' : '-' }}</td>
                </tr>
              </tbody>
            </table>

            <div class="ip-section-grid" style="margin-top: 20px;">
              <div class="ip-grid-row">
                <div class="ip-item" style="grid-column: span 5"><span class="ip-lbl">药物过敏：</span><span class="ip-val">无</span></div>
              </div>
              <div class="ip-grid-row">
                <div class="ip-item"><span class="ip-lbl">血型：</span><span class="ip-val">O 型</span></div>
                <div class="ip-item"><span class="ip-lbl">Rh：</span><span class="ip-val">阳性</span></div>
                <div class="ip-item" style="grid-column: span 3"><span class="ip-lbl">损伤、中毒的外部原因：</span><span class="ip-val">无</span></div>
              </div>
            </div>

            <div class="ip-footer">
              <div class="ip-footer-row">
                <div class="ri-item"><span class="ri-lbl">科主任：</span><span class="ri-val">王建国</span></div>
                <div class="ri-item"><span class="ri-lbl">主任医师：</span><span class="ri-val">刘明远</span></div>
                <div class="ri-item"><span class="ri-lbl">主治医师：</span><span class="ri-val">陈主任</span></div>
                <div class="ri-item"><span class="ri-lbl">住院医师：</span><span class="ri-val">张医生</span></div>
              </div>
              <div class="ip-footer-row" style="margin-top: 12px;">
                <div class="ri-item"><span class="ri-lbl">责任护士：</span><span class="ri-val">李护士</span></div>
                <div class="ri-item"><span class="ri-lbl">质控医生：</span><span class="ri-val">孙主任</span></div>
                <div class="ri-item"><span class="ri-lbl">日期：</span><span class="ri-val">{{ activeRecord.date }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 门诊病历 (Outpatient) -->
        <div class="report-container" v-else-if="activeRecord.type === 'op'">
          <div class="report-header">
            <div class="report-hosp">{{ activeRecord.hosp }}</div>
            <div class="report-title">门诊病历记录</div>
          </div>

          <div class="report-info-grid">
            <div class="ri-item"><span class="ri-lbl">姓名：</span><span class="ri-val">{{ patient?.name || '陈**' }}</span></div>
            <div class="ri-item"><span class="ri-lbl">性别：</span><span class="ri-val">{{ patient?.gender || '男' }}</span></div>
            <div class="ri-item"><span class="ri-lbl">年龄：</span><span class="ri-val">{{ patient?.age || '42' }}岁</span></div>
            <div class="ri-item"><span class="ri-lbl">科室：</span><span class="ri-val">{{ activeRecord.dept }}</span></div>
            <div class="ri-item"><span class="ri-lbl">病历号：</span><span class="ri-val">OP{{ activeRecord.id }}88231</span></div>
            <div class="ri-item"><span class="ri-lbl">就诊日期：</span><span class="ri-val">{{ activeRecord.date }}</span></div>
          </div>

          <div class="report-section">
            <div class="rs-title">主诉：</div>
            <div class="rs-content">
              <template v-if="activeRecord.title.includes('高血压')">发现血压升高5年，伴头晕、心悸1周。</template>
              <template v-else-if="activeRecord.title.includes('冠心病')">反复胸闷、心悸2周，加重3天。</template>
              <template v-else-if="activeRecord.title.includes('腰椎') || activeRecord.title.includes('腰肌')">腰部疼痛伴活动受限1周，加重2天。</template>
              <template v-else-if="activeRecord.title.includes('胃炎')">反复上腹痛、反酸3个月，加重1周。</template>
              <template v-else-if="activeRecord.title.includes('上呼吸道') || activeRecord.title.includes('感冒')">咳嗽、咳痰伴发热2天。</template>
              <template v-else-if="activeRecord.title.includes('结膜炎')">双眼发红、异物感伴流泪3天。</template>
              <template v-else>不适就诊。</template>
            </div>
          </div>

          <div class="report-section">
            <div class="rs-title">现病史：</div>
            <div class="rs-content">
              <template v-if="activeRecord.title.includes('高血压')">患者于5年前体检时发现血压升高，最高达160/100mmHg，平时不规则服用"氨氯地平"治疗，血压波动在140-150/90-95mmHg。1周前无明显诱因出现头晕，呈阵发性，伴心悸、胸闷，无视物旋转、无恶心呕吐。为求进一步诊治，遂来我院门诊。</template>
              <template v-else-if="activeRecord.title.includes('冠心病')">患者于2周前无明显诱因出现胸闷，位于胸骨后，呈压榨感，持续约3-5分钟，休息或含服"硝酸甘油"后缓解。近3天症状加重，发作频率增加。无黑矇、晕厥。为求明确诊治，遂来我院门诊。</template>
              <template v-else-if="activeRecord.title.includes('腰椎')">患者于1周前因搬重物后出现腰部疼痛，呈持续性酸胀痛，向左下肢放射，久坐及弯腰时加重，平卧休息后减轻。近2天疼痛加重，行走受限。为求进一步诊治，遂来我院门诊。</template>
              <template v-else-if="activeRecord.title.includes('腰肌')">患者于1周前因久坐办公后出现腰部酸痛，呈持续性钝痛，以两侧腰肌为著，劳累后加重，休息后减轻。无下肢放射痛，无大小便障碍。为求诊治，遂来我院门诊。</template>
              <template v-else-if="activeRecord.title.includes('胃炎')">患者近3个月来无明显诱因出现反复上腹部隐痛，以餐后明显，伴有反酸、嗳气，偶有恶心。近期食欲欠佳，睡眠尚可，大小便正常，体重无明显变化。为求明确诊治，遂来我院门诊。</template>
              <template v-else-if="activeRecord.title.includes('上呼吸道') || activeRecord.title.includes('感冒')">患者于2天前受凉后出现咳嗽，咳白色黏痰，伴发热，体温最高38.2℃，伴鼻塞、流涕、咽痛。自行口服"感冒灵"效果欠佳。为求进一步诊治，遂来我院门诊。</template>
              <template v-else-if="activeRecord.title.includes('结膜炎')">患者于3天前无明显诱因出现双眼发红，伴异物感、流泪，晨起有分泌物，视物尚清晰。自行滴用"氯霉素眼药水"效果欠佳。为求诊治，遂来我院门诊。</template>
              <template v-else>患者近期出现不适症状，为求明确诊治，遂来我院门诊。</template>
            </div>
          </div>

          <div class="report-section">
            <div class="rs-title">既往史：</div>
            <div class="rs-content">
              既往体健。否认"糖尿病、冠心病"等慢性病史。否认"肝炎、结核"等传染病史。否认手术、外伤及输血史。否认食物及药物过敏史。预防接种随社会进行。
            </div>
          </div>

          <div class="report-section">
            <div class="rs-title">初步诊断：</div>
            <div class="rs-content" style="font-weight: 700;">
              <template v-if="activeRecord.title.includes('高血压')">1. 原发性高血压(2级，中危)；2. 高脂血症。</template>
              <template v-else-if="activeRecord.title.includes('冠心病')">1. 冠状动脉粥样硬化性心脏病；2. 稳定性心绞痛。</template>
              <template v-else-if="activeRecord.title.includes('腰椎')">1. 腰椎间盘突出症(L4/L5)；2. 坐骨神经痛。</template>
              <template v-else-if="activeRecord.title.includes('腰肌')">1. 腰肌劳损。</template>
              <template v-else-if="activeRecord.title.includes('胃炎')">1. 慢性浅表性胃炎；2. 幽门螺杆菌感染(?)。</template>
              <template v-else-if="activeRecord.title.includes('上呼吸道') || activeRecord.title.includes('感冒')">1. 急性上呼吸道感染。</template>
              <template v-else-if="activeRecord.title.includes('结膜炎')">1. 急性结膜炎(双眼)。</template>
              <template v-else>待进一步检查明确诊断。</template>
            </div>
          </div>

          <div class="report-footer">
            <div class="rf-item"><span>就诊医师：</span><span>陈主任</span></div>
            <div class="rf-item"><span>日期：</span><span>{{ activeRecord.date }}</span></div>
          </div>
        </div>

        <!-- 检验明细 (Laboratory) -->
        <div class="report-container" v-else-if="activeRecord.type === 'lab'">
          <div class="report-header">
            <div class="report-hosp">{{ activeRecord.hosp }}</div>
            <div class="report-title">检验报告单</div>
          </div>
          <div class="report-info-grid">
            <div class="ri-item"><span class="ri-lbl">项目名称：</span><span class="ri-val">{{ activeRecord.title }}</span></div>
            <div class="ri-item"><span class="ri-lbl">标本类型：</span><span class="ri-val">血清</span></div>
            <div class="ri-item"><span class="ri-lbl">采样时间：</span><span class="ri-val">{{ activeRecord.date }} 08:30</span></div>
            <div class="ri-item"><span class="ri-lbl">报告时间：</span><span class="ri-val">{{ activeRecord.date }} 11:20</span></div>
            <div class="ri-item"><span class="ri-lbl">检验号：</span><span class="ri-val">LIS{{ activeRecord.id }}001</span></div>
            <div class="ri-item"><span class="ri-lbl">审核医生：</span><span class="ri-val">孙美玲</span></div>
          </div>
          <table class="tbl" style="margin-top: 20px">
            <thead>
              <tr>
                <th>项目名称</th>
                <th>结果</th>
                <th>单位</th>
                <th>参考范围</th>
                <th>提示</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="activeRecord.title.includes('生化')">
                <tr><td>谷丙转氨酶 (ALT)</td><td style="color: var(--red); font-weight: 700;">45</td><td>U/L</td><td>0 - 40</td><td style="color: var(--red);">↑</td></tr>
                <tr><td>总胆固醇 (TC)</td><td style="color: var(--red); font-weight: 700;">6.2</td><td>mmol/L</td><td>2.8 - 5.2</td><td style="color: var(--red);">↑</td></tr>
                <tr><td>低密度脂蛋白 (LDL-C)</td><td style="color: var(--red); font-weight: 700;">4.1</td><td>mmol/L</td><td>< 3.4</td><td style="color: var(--red);">↑</td></tr>
                <tr><td>空腹血糖 (GLU)</td><td style="font-weight: 700;">5.4</td><td>mmol/L</td><td>3.9 - 6.1</td><td>正常</td></tr>
                <tr><td>肌酐 (Cr)</td><td style="font-weight: 700;">82</td><td>μmol/L</td><td>44 - 133</td><td>正常</td></tr>
              </template>
              <template v-else-if="activeRecord.title.includes('糖化')">
                <tr><td>糖化血红蛋白 (HbA1c)</td><td :style="{ color: activeRecord.id === 206 ? 'var(--red)' : 'inherit', fontWeight: '700' }">{{ activeRecord.id === 202 ? '5.8' : '6.1' }}</td><td>%</td><td>4.0 - 6.0</td><td :style="{ color: activeRecord.id === 206 ? 'var(--red)' : 'inherit' }">{{ activeRecord.id === 206 ? '↑' : '' }}</td></tr>
              </template>
              <template v-else-if="activeRecord.title.includes('血常规')">
                <tr><td>白细胞 (WBC)</td><td style="font-weight: 700;">7.2</td><td>10^9/L</td><td>3.5 - 9.5</td><td>正常</td></tr>
                <tr><td>红细胞 (RBC)</td><td style="font-weight: 700;">4.8</td><td>10^12/L</td><td>4.0 - 5.5</td><td>正常</td></tr>
                <tr><td>血红蛋白 (HGB)</td><td style="font-weight: 700;">142</td><td>g/L</td><td>130 - 175</td><td>正常</td></tr>
                <tr><td>血小板 (PLT)</td><td style="font-weight: 700;">215</td><td>10^9/L</td><td>125 - 350</td><td>正常</td></tr>
              </template>
              <template v-else-if="activeRecord.title.includes('尿常规')">
                <tr><td>尿蛋白 (PRO)</td><td style="font-weight: 700;">阴性</td><td>-</td><td>阴性</td><td>正常</td></tr>
                <tr><td>尿糖 (GLU)</td><td style="font-weight: 700;">阴性</td><td>-</td><td>阴性</td><td>正常</td></tr>
                <tr><td>白细胞 (LEU)</td><td style="font-weight: 700;">阴性</td><td>-</td><td>阴性</td><td>正常</td></tr>
              </template>
              <template v-else-if="activeRecord.title.includes('凝血')">
                <tr><td>凝血酶原时间 (PT)</td><td style="font-weight: 700;">12.5</td><td>s</td><td>11.0 - 14.5</td><td>正常</td></tr>
                <tr><td>APTT</td><td style="font-weight: 700;">30.2</td><td>s</td><td>25.0 - 35.0</td><td>正常</td></tr>
                <tr><td>INR</td><td style="font-weight: 700;">1.05</td><td>-</td><td>0.8 - 1.2</td><td>正常</td></tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- 检查报告 (Examination) -->
        <div class="report-container" v-else-if="activeRecord.type === 'exam'">
          <div class="report-header">
            <div class="report-hosp">{{ activeRecord.hosp }}</div>
            <div class="report-title">检查报告单</div>
            <button class="report-view-btn" style="position: absolute; top: 20px; right: 20px; background: #fff; border: 1px solid var(--line2); padding: 6px 16px; border-radius: 4px; font-size: 13px; color: var(--ink2); cursor: pointer; display: flex; align-items: center; gap: 4px;" @click="emit('show-dicom')">
              <Eye :size="14" />
              查看影像
            </button>
          </div>

          <div class="ip-scroll-content">
            <div class="report-info-grid" style="margin-top: 0;">
              <div class="ri-item"><span class="ri-lbl">病人姓名：</span><span class="ri-val">{{ patient?.name || '陈**' }}</span></div>
              <div class="ri-item"><span class="ri-lbl">性别/年龄：</span><span class="ri-val">{{ patient?.gender || '男' }} / {{ patient?.age || '42' }}岁</span></div>
              <div class="ri-item"><span class="ri-lbl">门诊号：</span><span class="ri-val">OP{{ activeRecord.id }}88231</span></div>

              <div class="ri-item"><span class="ri-lbl">科室：</span><span class="ri-val">{{ activeRecord.dept }}</span></div>
              <div class="ri-item"><span class="ri-lbl">床号：</span><span class="ri-val">22床</span></div>
              <div class="ri-item"><span class="ri-lbl">住院号：</span><span class="ri-val">IP{{ activeRecord.id }}99283</span></div>

              <div class="ri-item"><span class="ri-lbl">病区：</span><span class="ri-val">一病区</span></div>
              <div class="ri-item"><span class="ri-lbl">检查日期：</span><span class="ri-val">{{ activeRecord.date }} 10:20:15</span></div>
              <div class="ri-item"><span class="ri-lbl">报告日期：</span><span class="ri-val">{{ activeRecord.date }} 11:29:23</span></div>

              <div class="ri-item"><span class="ri-lbl">病人ID：</span><span class="ri-val">PID{{ activeRecord.id }}0098</span></div>
            <div class="ri-item"><span class="ri-lbl">检查号：</span><span class="ri-val">EXAM{{ activeRecord.id }}001</span></div>
          </div>

          <div class="report-section">
            <div class="rs-title" style="border-bottom: 1px solid var(--line2); padding-bottom: 8px;">检查部位：<span style="font-weight: normal; margin-left: 8px;">胸部 (CT平扫)</span></div>
          </div>

          <div class="report-section">
            <div class="rs-title">影像表现：</div>
            <div class="rs-content" style="background: #fcfcfc; padding: 12px; border-radius: 4px; font-size: 14px; color: var(--ink2); line-height: 1.6;">
              双肺纹理增多、增粗，走行尚自然。肺野内未见明显实质性浸润影。左肺下叶见一直径约3mm微小结节影，边界清晰。气管及主要支气管通畅。纵隔未见明显肿大淋巴结。心影增大。双侧胸膜无增厚，胸腔未见积液。
            </div>
          </div>

          <div class="report-section">
            <div class="rs-title">诊断结论：</div>
            <div class="rs-content" style="background: #fcfcfc; padding: 12px; border-radius: 4px; font-size: 14px; color: var(--ink2); line-height: 1.6;">
              <template v-if="activeRecord.title.includes('CT')">
                1. 双肺纹理增多；<br/>
                2. 左肺下叶微小结节，建议随访；<br/>
                3. 心影增大，请结合临床。
              </template>
              <template v-else-if="activeRecord.title.includes('心电图')">
                1. 窦性心律；<br/>
                2. 正常心电图。
              </template>
              <template v-else>
                1. 检查部位未见明显异常；<br/>
                2. 建议定期随访。
              </template>
            </div>
          </div>

            <div class="report-footer" style="margin-top: 30px; border-top: 1px solid var(--line2); padding-top: 20px;">
              <div class="rf-item"><span>报告医师：</span><span style="font-weight: 600;">施龚</span></div>
              <div class="rf-item"><span>审核医师：</span><span style="font-weight: 600;">潘靡埠</span></div>
            </div>
            <div style="font-size: 12px; color: var(--ink4); margin-top: 10px; font-style: italic;">
              *本报告仅供临床参考
            </div>
          </div>
        </div>

        <!-- 电子处方 (Medication/Pharmacy) -->
        <div class="report-container" v-else-if="activeRecord.type === 'med'">
          <div class="report-header">
            <div class="report-hosp">{{ activeRecord.hosp }}</div>
            <div class="report-title">电 子 处 方 笺</div>
          </div>
          <div class="report-info-grid">
            <div class="ri-item"><span class="ri-lbl">科室：</span><span class="ri-val">{{ activeRecord.dept }}</span></div>
            <div class="ri-item"><span class="ri-lbl">日期：</span><span class="ri-val">{{ activeRecord.date }}</span></div>
            <div class="ri-item"><span class="ri-lbl">处方号：</span><span class="ri-val">RX{{ activeRecord.id }}001</span></div>
          </div>
          <div class="prescription-body" style="margin-top: 20px;">
            <div style="font-size: 24px; font-weight: 700; margin-bottom: 10px;">Rp:</div>
            <div class="med-item-p" style="padding: 10px 0; border-bottom: 1px dashed var(--line);">
              <div style="display: flex; justify-content: space-between; font-weight: 700;">
                <span>1. 苯磺酸氨氯地平片</span>
                <span>5mg * 7片/盒 x 4盒</span>
              </div>
              <div style="font-size: 13px; color: var(--ink3); margin-top: 4px;">用法：一次5mg，每日一次，口服</div>
            </div>
            <div class="med-item-p" style="padding: 10px 0; border-bottom: 1px dashed var(--line);">
              <div style="display: flex; justify-content: space-between; font-weight: 700;">
                <span>2. 缬沙坦胶囊</span>
                <span>80mg * 7粒/盒 x 4盒</span>
              </div>
              <div style="font-size: 13px; color: var(--ink3); margin-top: 4px;">用法：一次80mg，每日一次，口服</div>
            </div>
          </div>
          <div class="report-footer" style="margin-top: 100px;">
            <div class="rf-item"><span>医师：</span><span>王建国</span></div>
            <div class="rf-item"><span>药师：</span><span>李药师</span></div>
          </div>
        </div>

        <!-- 穿戴数据详情 (Wearable Device Data) -->
        <div class="report-container" v-else-if="activeRecord.type === 'wd'">
          <div class="report-header">
            <div class="report-hosp">{{ activeRecord.hosp }}</div>
            <div class="report-title">穿戴设备监测报告</div>
          </div>

          <div class="ip-scroll-content">
            <div class="report-info-grid" style="margin-top: 0;">
              <div class="ri-item"><span class="ri-lbl">设备类型：</span><span class="ri-val">{{ activeRecord.hosp }}</span></div>
              <div class="ri-item"><span class="ri-lbl">监测项目：</span><span class="ri-val">{{ activeRecord.title }}</span></div>
              <div class="ri-item"><span class="ri-lbl">监测日期：</span><span class="ri-val">{{ activeRecord.date }} {{ activeRecord.time }}</span></div>
              <div class="ri-item"><span class="ri-lbl">数据来源：</span><span class="ri-val">{{ activeRecord.dept }}</span></div>
              <div class="ri-item"><span class="ri-lbl">报告编号：</span><span class="ri-val">WD{{ activeRecord.id }}001</span></div>
            </div>

            <div class="report-section">
              <div class="rs-title">监测概述：</div>
              <div class="rs-content" style="background: #fcfcfc; padding: 12px; border-radius: 4px; font-size: 14px; color: var(--ink2); line-height: 1.6;">
                {{ activeRecord.title === '24h动态心电监测报告' ? '窦性心律，平均心率72bpm，偶发室性早搏(2次/24h)，ST-T未见明显异常。最长RR间期1.42s(睡眠中)。' :
                   activeRecord.title === '睡眠呼吸监测' ? '总睡眠7h12m，深睡1h48m(25%)，浅睡4h20m，REM 1h4m。AHI指数3.2(正常<5)，SpO2最低93%，平均97%。鼾声时长占比8%。' :
                   activeRecord.title === '家庭血压日志·本周汇总' ? '本周测量14次，收缩压均值138mmHg，舒张压均值88mmHg。晨峰血压偏高(152/95)，下午时段控制良好(128/82)。服药依从率100%。' :
                   activeRecord.title === '空腹及餐后血糖监测周报' ? '空腹血糖均值5.6mmol/L，餐后2h血糖均值7.8mmol/L。1次餐后偏高(9.2mmol/L)，其余在目标范围内。TIR(3.9-10)为92%。' :
                   activeRecord.title === '72h连续心电贴片监测终评' ? '总记录71.5h，窦性心律为主，偶发房性早搏(15次)，室性早搏(3次)。最长停搏1.8s(睡眠中)。心率变异性正常。未见明显恶性心律失常。' :
                   '体重78.5kg，BMI 27.8(超重)，体脂率26.2%(偏高)，肌肉量54.3kg，内脏脂肪等级12(偏高)，基础代谢1720kcal。' }}
              </div>
            </div>

            <div class="report-section" v-if="activeRecord.title === '24h动态心电监测报告'">
              <div class="rs-title">关键指标：</div>
              <table class="tbl" style="margin-top: 12px">
                <thead><tr><th>指标</th><th>结果</th><th>单位</th><th>参考范围</th><th>提示</th></tr></thead>
                <tbody>
                  <tr><td>平均心率</td><td style="font-weight: 700;">72</td><td>bpm</td><td>60-100</td><td>正常</td></tr>
                  <tr><td>最低心率</td><td style="font-weight: 700;">48</td><td>bpm</td><td>40-60</td><td>正常</td></tr>
                  <tr><td>最高心率</td><td style="font-weight: 700; color: var(--red);">128</td><td>bpm</td><td>100-160</td><td>↑</td></tr>
                  <tr><td>室性早搏</td><td style="font-weight: 700;">2</td><td>次/24h</td><td>< 100</td><td>正常</td></tr>
                  <tr><td>HRV(SDNN)</td><td style="font-weight: 700;">86</td><td>ms</td><td>50-100</td><td>正常</td></tr>
                </tbody>
              </table>
            </div>

            <div class="report-section" v-if="activeRecord.title === '睡眠呼吸监测'">
              <div class="rs-title">关键指标：</div>
              <table class="tbl" style="margin-top: 12px">
                <thead><tr><th>指标</th><th>结果</th><th>单位</th><th>参考范围</th><th>提示</th></tr></thead>
                <tbody>
                  <tr><td>总睡眠时长</td><td style="font-weight: 700;">7h12m</td><td>-</td><td>7-9h</td><td>正常</td></tr>
                  <tr><td>深睡占比</td><td style="font-weight: 700;">25</td><td>%</td><td>20-25</td><td>正常</td></tr>
                  <tr><td>AHI指数</td><td style="font-weight: 700;">3.2</td><td>-</td><td>< 5</td><td>正常</td></tr>
                  <tr><td>最低血氧</td><td style="font-weight: 700; color: var(--red);">93</td><td>%</td><td>≥ 95</td><td>↓</td></tr>
                  <tr><td>鼾声占比</td><td style="font-weight: 700;">8</td><td>%</td><td>< 10</td><td>正常</td></tr>
                </tbody>
              </table>
            </div>

            <div class="report-section" v-if="activeRecord.title === '家庭血压日志·本周汇总'">
              <div class="rs-title">关键指标：</div>
              <table class="tbl" style="margin-top: 12px">
                <thead><tr><th>指标</th><th>结果</th><th>单位</th><th>参考范围</th><th>提示</th></tr></thead>
                <tbody>
                  <tr><td>收缩压均值</td><td style="font-weight: 700; color: var(--red);">138</td><td>mmHg</td><td>< 140</td><td>偏高</td></tr>
                  <tr><td>舒张压均值</td><td style="font-weight: 700;">88</td><td>mmHg</td><td>< 90</td><td>正常</td></tr>
                  <tr><td>晨峰收缩压</td><td style="font-weight: 700; color: var(--red);">152</td><td>mmHg</td><td>< 135</td><td>↑</td></tr>
                  <tr><td>服药依从率</td><td style="font-weight: 700; color: var(--green);">100</td><td>%</td><td>≥ 80</td><td>达标</td></tr>
                </tbody>
              </table>
            </div>

            <div class="report-section" v-if="activeRecord.title === '空腹及餐后血糖监测周报'">
              <div class="rs-title">关键指标：</div>
              <table class="tbl" style="margin-top: 12px">
                <thead><tr><th>指标</th><th>结果</th><th>单位</th><th>参考范围</th><th>提示</th></tr></thead>
                <tbody>
                  <tr><td>空腹血糖均值</td><td style="font-weight: 700;">5.6</td><td>mmol/L</td><td>3.9-6.1</td><td>正常</td></tr>
                  <tr><td>餐后2h均值</td><td style="font-weight: 700;">7.8</td><td>mmol/L</td><td>< 7.8</td><td>正常</td></tr>
                  <tr><td>血糖变异系数</td><td style="font-weight: 700;">22</td><td>%</td><td>< 36</td><td>正常</td></tr>
                  <tr><td>TIR(3.9-10)</td><td style="font-weight: 700; color: var(--green);">92</td><td>%</td><td>> 70</td><td>达标</td></tr>
                </tbody>
              </table>
            </div>

            <div class="report-section" v-if="activeRecord.title === '72h连续心电贴片监测终评'">
              <div class="rs-title">关键指标：</div>
              <table class="tbl" style="margin-top: 12px">
                <thead><tr><th>指标</th><th>结果</th><th>单位</th><th>参考范围</th><th>提示</th></tr></thead>
                <tbody>
                  <tr><td>总记录时长</td><td style="font-weight: 700;">71.5h</td><td>-</td><td>72h</td><td>正常</td></tr>
                  <tr><td>房性早搏</td><td style="font-weight: 700;">15</td><td>次</td><td>< 100</td><td>正常</td></tr>
                  <tr><td>室性早搏</td><td style="font-weight: 700;">3</td><td>次</td><td>< 100</td><td>正常</td></tr>
                  <tr><td>最长停搏</td><td style="font-weight: 700; color: var(--red);">1.8</td><td>s</td><td>< 2.0</td><td>偏高</td></tr>
                </tbody>
              </table>
            </div>

            <div class="report-section" v-if="activeRecord.title === '体成分分析月报'">
              <div class="rs-title">关键指标：</div>
              <table class="tbl" style="margin-top: 12px">
                <thead><tr><th>指标</th><th>结果</th><th>单位</th><th>参考范围</th><th>提示</th></tr></thead>
                <tbody>
                  <tr><td>体重</td><td style="font-weight: 700; color: var(--red);">78.5</td><td>kg</td><td>-</td><td>超重</td></tr>
                  <tr><td>BMI</td><td style="font-weight: 700; color: var(--red);">27.8</td><td>-</td><td>18.5-24</td><td>↑</td></tr>
                  <tr><td>体脂率</td><td style="font-weight: 700; color: var(--red);">26.2</td><td>%</td><td>10-20</td><td>↑</td></tr>
                  <tr><td>内脏脂肪等级</td><td style="font-weight: 700; color: var(--red);">12</td><td>级</td><td>1-9</td><td>↑</td></tr>
                  <tr><td>基础代谢</td><td style="font-weight: 700;">1720</td><td>kcal</td><td>-</td><td>正常</td></tr>
                </tbody>
              </table>
            </div>

            <div class="report-footer" style="margin-top: 30px; border-top: 1px solid var(--line2); padding-top: 20px;">
              <div class="rf-item"><span>设备厂商：</span><span>{{ activeRecord.hosp }}</span></div>
              <div class="rf-item"><span>报告日期：</span><span>{{ activeRecord.date }}</span></div>
            </div>
            <div style="font-size: 12px; color: var(--ink4); margin-top: 10px; font-style: italic;">
              *本报告由穿戴设备自动采集生成，仅供健康管理参考
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.op-detail-page {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  height: calc(100% - 64px);
  background: #f0f2f5;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.op-header {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.op-header-l {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #1890ff;
  font-size: 14px;
  padding: 8px 0;
}

.back-btn:hover {
  opacity: 0.8;
}

.divider {
  width: 1px;
  height: 16px;
  background: #e8e8e8;
}

.op-title {
  font-size: 14px;
  color: #666;
}

.op-btn-p {
  background: #1890ff;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.op-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.op-sidebar {
  width: 340px;
  background: transparent;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
}

.op-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.patient-card {
  padding: 20px;
}

.pc-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  position: relative;
}

.pc-av {
  width: 48px;
  height: 48px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
}

.pc-info {
  flex: 1;
}

.pc-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.pc-meta {
  font-size: 12px;
  color: #666;
}

.pc-star {
  position: absolute;
  right: 0;
  top: 0;
  color: #ccc;
  cursor: pointer;
}

.pc-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.pc-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.pc-icon {
  color: #999;
}

.pc-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.timeline-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.op-search {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.op-search input {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 12px;
}

.filter-text-btn {
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.op-timeline {
  padding: 14px 12px 16px;
  flex: 1;
}

.tl-year {
  font-size: 12px;
  font-weight: 700;
  margin: 2px 8px 10px;
  color: var(--ink4);
  letter-spacing: 0.3px;
}

.tl-item {
  position: relative;
  padding: 12px 12px 12px 36px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  border-radius: 10px;
  margin: 0 6px 8px;
  border: 1px solid transparent;
  background: #fff;
}

.tl-item:hover {
  background: var(--bg);
}

.tl-item.on {
  background: var(--blue-l);
  border-color: var(--blue-m);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.12);
}

.tl-item::before {
  content: '';
  position: absolute;
  left: 18px;
  top: 22px;
  bottom: -12px;
  width: 2px;
  background: var(--line);
}

.tl-item:last-child::before {
  display: none;
}

.tl-dot {
  position: absolute;
  left: 14px;
  top: 16px;
  width: 10px;
  height: 10px;
  background: var(--line);
  border-radius: 50%;
  z-index: 1;
}

.tl-item.on .tl-dot {
  background: var(--blue);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.18);
}

.tl-content {
  display: flex;
  gap: 12px;
}

.tl-time {
  font-size: 11px;
  color: var(--ink4);
  text-align: left;
  line-height: 1.4;
  min-width: 42px;
  font-variant-numeric: tabular-nums;
}

.tl-item.on .tl-time {
  color: var(--blue);
  font-weight: 700;
}

.tl-main {
  flex: 1;
}

.tl-title {
  font-size: 13px;
  color: var(--ink2);
  margin-bottom: 6px;
  line-height: 1.4;
}

.tl-item.on .tl-title {
  color: var(--ink);
  font-weight: 700;
}

.tl-meta {
  font-size: 11px;
  color: var(--ink4);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tl-item.on .tl-meta span {
  color: var(--ink3);
}

.op-main {
  flex: 1;
  padding: 16px 16px 16px 0;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.report-container {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  padding: 40px 60px;
  min-height: 100%;
  position: relative;
}

.report-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.report-hosp {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.report-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  border-bottom: 1px solid #333;
  display: inline-block;
  padding-bottom: 4px;
}

.report-view-btn {
  position: absolute;
  right: 0;
  top: 0;
  background: #1890ff;
  border: none;
  color: #fff;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.report-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px 12px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #e8e8e8;
  margin-bottom: 30px;
}

.ri-item {
  font-size: 13px;
  color: #333;
}

.ri-lbl {
  font-weight: 600;
  color: #000;
}

.report-section {
  margin-bottom: 24px;
}

.rs-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #000;
}

.rs-content {
  font-size: 13px;
  line-height: 1.8;
  color: #333;
  text-align: justify;
}

.report-footer {
  margin-top: 60px;
  padding-top: 20px;
  border-top: 1px dashed #e8e8e8;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.rf-item {
  font-size: 13px;
}

.rf-item span:first-child {
  font-weight: 600;
  color: #000;
}

.report-watermark {
  margin-top: 40px;
  text-align: center;
  color: #ccc;
  font-size: 12px;
  font-style: italic;
}
/* Inpatient Home Page Styles */
.ip-home-page {
  padding: 0 !important;
  color: var(--ink);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ip-scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.report-header {
  padding: 20px;
  background: #fff;
  border-bottom: 1px solid var(--line2);
  position: relative;
}

.ip-header {
  text-align: center;
  border-bottom: 2px solid var(--line);
  padding-bottom: 16px;
  margin-bottom: 24px;
}

.ip-hosp-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--blue);
}

.ip-title-main {
  font-size: 28px;
  font-weight: 700;
  margin: 12px 0;
  letter-spacing: 4px;
  color: var(--ink);
}

.ip-meta-top {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--ink3);
}

.ip-section-title {
  background: #f8fafc;
  padding: 6px 12px;
  font-weight: 700;
  margin: 24px 0 12px;
  border-left: 4px solid var(--blue);
  color: var(--ink);
  font-size: 14px;
}

.ip-section-grid {
  border: 1px solid var(--line2);
  border-radius: 4px;
  overflow: hidden;
}

.ip-grid-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-bottom: 1px solid var(--line2);
}

.ip-grid-row:last-child {
  border-bottom: none;
}

.ip-item {
  padding: 10px 12px;
  border-right: 1px solid var(--line2);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ip-item:last-child {
  border-right: none;
}

.ip-lbl {
  color: var(--ink4);
  white-space: nowrap;
}

.ip-val {
  font-weight: 600;
  color: var(--ink2);
}

.ip-diag-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--line2);
  border-radius: 4px;
}

.ip-diag-table th, .ip-diag-table td {
  border: 1px solid var(--line2);
  padding: 10px 12px;
  font-size: 13px;
  text-align: left;
}

.ip-diag-table th {
  background: #f8fafc;
  color: var(--ink3);
  font-weight: 600;
}

.ip-diag-type {
  font-weight: 700;
  background: #f8fafc;
  color: var(--ink2);
}

.ip-footer {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px dashed var(--line2);
}

.ip-footer-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--ink3);
}

/* Other report types styles */
.prescription-body {
  border: 1px solid var(--line2);
  border-radius: 8px;
  padding: 24px;
  min-height: 300px;
  background: #fff;
}

.med-item-p {
  font-size: 14px;
}
</style>
