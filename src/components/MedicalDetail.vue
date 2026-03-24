<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowLeft, User, Calendar, Clock, MapPin, Phone, FileText, Activity, ClipboardCheck, ChevronRight, Eye } from 'lucide-vue-next';

const props = defineProps<{
  patient: any;
  record: any;
}>();

const emit = defineEmits(['back', 'show-dicom']);

const opTimeline = [
  { id: 1, date: '2024-03-15', time: '09:30', title: '原发性高血压', dept: '心内科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'op' },
  { id: 2, date: '2024-02-10', time: '14:20', title: '慢性胃炎', dept: '消化内科', hosp: '南京大学医学院附属鼓楼医院', level: '一级', type: 'op' },
  { id: 3, date: '2024-01-05', time: '10:00', title: '上呼吸道感染', dept: '呼吸内科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'op' },
  { id: 4, date: '2023-11-20', time: '11:15', title: '腰肌劳损', dept: '骨科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'op' },
  { id: 5, date: '2023-09-12', time: '08:45', title: '结膜炎', dept: '眼科', hosp: '南京大学医学院附属鼓楼医院', level: '一级', type: 'op' },
  { id: 6, date: '2023-07-20', time: '15:30', title: '高脂血症复查', dept: '内分泌科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'op' },
  { id: 7, date: '2023-05-15', time: '10:20', title: '皮肤瘙痒症', dept: '皮肤科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'op' },
];

const ipTimeline = [
  { id: 101, date: '2024-03-10', time: '10:00', title: '急性下壁心肌梗死', dept: '心内科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'ip' },
  { id: 102, date: '2023-05-10', time: '08:00', title: '阑尾炎住院', dept: '普外科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'ip' },
  { id: 103, date: '2022-12-01', time: '09:00', title: '大叶性肺炎', dept: '呼吸内科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'ip' },
  { id: 104, date: '2022-08-15', time: '14:30', title: '急性胃肠炎', dept: '消化内科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'ip' },
  { id: 105, date: '2022-03-10', time: '11:00', title: '左桡骨远端骨折', dept: '骨伤科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'ip' },
  { id: 106, date: '2021-11-25', time: '10:30', title: '冠心病介入治疗', dept: '心内科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'ip' },
];

const labTimeline = [
  { id: 201, date: '2024-03-15', time: '08:30', title: '生化常规检查', dept: '检验科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'lab' },
  { id: 202, date: '2024-03-15', time: '08:35', title: '血常规 (五分类)', dept: '检验科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'lab' },
  { id: 203, date: '2023-12-15', time: '09:00', title: '尿常规', dept: '检验科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'lab' },
  { id: 204, date: '2023-10-10', time: '08:45', title: '凝血功能', dept: '检验科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'lab' },
  { id: 205, date: '2023-05-20', time: '10:15', title: '糖化血红蛋白', dept: '检验科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'lab' },
  { id: 206, date: '2023-03-12', time: '08:00', title: '血脂四项', dept: '检验科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'lab' },
];

const examTimeline = [
  { id: 301, date: '2024-03-16', time: '10:20', title: '胸部CT平扫', dept: '放射科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'exam' },
  { id: 302, date: '2024-03-15', time: '15:00', title: '心电图检查', dept: '心功能室', hosp: '常州市第一人民医院', level: '三级甲等', type: 'exam' },
  { id: 303, date: '2023-12-10', time: '09:00', title: '腹部超声', dept: '超声科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'exam' },
  { id: 304, date: '2023-10-05', time: '14:30', title: '胃镜检查', dept: '内镜中心', hosp: '常州市第一人民医院', level: '三级甲等', type: 'exam' },
  { id: 305, date: '2023-06-20', time: '11:00', title: '腰椎MRI', dept: '放射科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'exam' },
  { id: 306, date: '2023-04-18', time: '09:40', title: '颈部超声', dept: '超声科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'exam' },
];

const medTimeline = [
  { id: 401, date: '2024-03-15', time: '10:00', title: '高血压用药', dept: '心内科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'med' },
  { id: 402, date: '2024-02-10', time: '15:00', title: '胃病用药', dept: '消化内科', hosp: '南京大学医学院附属鼓楼医院', level: '一级', type: 'med' },
  { id: 403, date: '2024-01-05', time: '11:00', title: '感冒用药', dept: '呼吸内科', hosp: '南京大学医学院附属鼓楼医院', level: '三级甲等', type: 'med' },
  { id: 404, date: '2023-11-20', time: '12:00', title: '止痛用药', dept: '骨科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'med' },
  { id: 405, date: '2023-09-12', time: '09:30', title: '眼药水', dept: '眼科', hosp: '南京大学医学院附属鼓楼医院', level: '一级', type: 'med' },
  { id: 406, date: '2023-07-25', time: '14:00', title: '降脂用药', dept: '内分泌科', hosp: '常州市第一人民医院', level: '三级甲等', type: 'med' },
];

const currentTimeline = computed(() => {
  if (props.record?.type === 'ip') return ipTimeline;
  if (props.record?.type === 'lab') return labTimeline;
  if (props.record?.type === 'exam') return examTimeline;
  if (props.record?.type === 'med') return medTimeline;
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

const activeTimelineId = ref(currentTimeline.value[0]?.id);
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
              <span>第 {{ activeRecord.id === 101 ? '2' : '1' }} 次住院</span>
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
                <div class="ip-item" style="grid-column: span 2"><span class="ip-lbl">出院：</span><span class="ip-val">{{ activeRecord.id === 101 ? '2024-03-20' : '2023-05-18' }} 09:30</span></div>
                <div class="ip-item"><span class="ip-val">{{ activeRecord.dept }}</span></div>
                <div class="ip-item"><span class="ip-val">1201 / 22床</span></div>
                <div class="ip-item"><span class="ip-lbl">实际住院：</span><span class="ip-val" style="color: var(--blue);">{{ activeRecord.id === 101 ? '10' : '8' }}</span> 天</div>
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
                  <td style="font-weight: 700; color: var(--ink);">{{ activeRecord.id === 101 ? '急性下壁心肌梗死' : '急性阑尾炎' }}</td>
                  <td>{{ activeRecord.id === 101 ? 'I21.100' : 'K35.900' }}</td>
                  <td>有</td>
                </tr>
                <tr v-for="i in 3" :key="i">
                  <td class="ip-diag-type">其他诊断</td>
                  <td>{{ i === 1 ? (activeRecord.id === 101 ? '原发性高血压 3级' : '腹膜炎') : '-' }}</td>
                  <td>{{ i === 1 ? (activeRecord.id === 101 ? 'I10.x00' : 'K65.900') : '-' }}</td>
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
              {{ activeRecord.title.includes('高血压') ? '发现血压升高5年，伴头晕、心悸1周。' : (activeRecord.title.includes('胃炎') ? '反复上腹痛、反酸3个月。' : '咳嗽、咳痰伴发热2天。') }}
            </div>
          </div>

          <div class="report-section">
            <div class="rs-title">现病史：</div>
            <div class="rs-content">
              {{ activeRecord.title.includes('高血压') ? '患者于5年前体检时发现血压升高，最高达160/100mmHg，平时不规则服用“氨氯地平”治疗，血压波动在140-150/90-95mmHg。1周前无明显诱因出现头晕，呈阵发性，伴心悸、胸闷，无视物旋转、无恶心呕吐。为求进一步诊治，遂来我院门诊。' : '患者近3个月来无明显诱因出现反复上腹部隐痛，以餐后明显，伴有反酸、嗳气，偶有恶心。近期食欲欠佳，睡眠尚可，大小便正常，体重无明显变化。' }}
            </div>
          </div>

          <div class="report-section">
            <div class="rs-title">既往史：</div>
            <div class="rs-content">
              既往体健。否认“糖尿病、冠心病”等慢性病史。否认“肝炎、结核”等传染病史。否认手术、外伤及输血史。否认食物及药物过敏史。预防接种随社会进行。
            </div>
          </div>

          <div class="report-section">
            <div class="rs-title">初步诊断：</div>
            <div class="rs-content" style="font-weight: 700;">
              {{ activeRecord.title.includes('高血压') ? '1. 原发性高血压(2级，中危)；2. 高脂血症。' : '1. 慢性胃炎；2. 幽门螺杆菌感染。' }}
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
              <tr v-for="i in 5" :key="i">
                <td>{{ i === 1 ? '谷丙转氨酶' : (i === 2 ? '谷草转氨酶' : '总胆固醇') }}</td>
                <td :style="{ color: i === 1 ? 'var(--red)' : 'inherit', fontWeight: i === 1 ? '700' : 'normal' }">{{ i === 1 ? '45' : '22' }}</td>
                <td>U/L</td>
                <td>0 - 40</td>
                <td style="color: var(--red)">{{ i === 1 ? '↑' : '' }}</td>
              </tr>
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
