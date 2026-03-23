<script setup lang="ts">
import { Stethoscope, Hospital, ClipboardCheck, Microscope, Pill } from 'lucide-vue-next';

const props = defineProps<{
  type: string;
}>();

const emit = defineEmits(['action']);

const handleAction = (type: string, title: string, record?: any) => {
  emit('action', type, title, record);
};

const opRecords = [
  { id: 1, date: '2024-03-15 09:30', hosp: '常州市第一人民医院', dept: '心内科', type: 'op', diag: '原发性高血压', tags: ['门诊'] },
  { id: 2, date: '2024-02-10 14:20', hosp: '天宁区青龙街道社区卫生服务中心', dept: '消化内科', type: 'op', diag: '慢性胃炎', tags: ['门诊'] },
  { id: 3, date: '2024-01-05 10:00', hosp: '常州市第二人民医院', dept: '呼吸内科', type: 'op', diag: '上呼吸道感染', tags: ['门诊'] },
  { id: 4, date: '2023-11-20 11:15', hosp: '常州市第一人民医院', dept: '骨科', type: 'op', diag: '腰肌劳损', tags: ['门诊'] },
  { id: 5, date: '2023-09-12 08:45', hosp: '天宁区青龙街道社区卫生服务中心', dept: '眼科', type: 'op', diag: '结膜炎', tags: ['门诊'] }
];

const ipRecords = [
  { id: 101, date: '2024-03-10 ~ 2024-03-20', hosp: '常州市第一人民医院', dept: '心内科', type: 'ip', diag: '急性下壁心肌梗死', tags: ['住院'] },
  { id: 102, date: '2023-05-10 ~ 2023-05-18', hosp: '常州市第一人民医院', dept: '普外科', type: 'ip', diag: '阑尾炎住院', tags: ['住院'] },
  { id: 103, date: '2022-12-01 ~ 2022-12-15', hosp: '常州市第二人民医院', dept: '呼吸内科', type: 'ip', diag: '大叶性肺炎', tags: ['住院'] },
  { id: 104, date: '2022-08-15 ~ 2022-08-22', hosp: '常州市第一人民医院', dept: '消化内科', type: 'ip', diag: '急性胃肠炎', tags: ['住院'] },
  { id: 105, date: '2022-03-10 ~ 2022-03-18', hosp: '常州市中医院', dept: '骨伤科', type: 'ip', diag: '左桡骨远端骨折', tags: ['住院'] }
];

const examRecords = [
  { id: 301, date: '2024-03-16 10:20', hosp: '常州市第一人民医院', dept: '放射科', type: 'exam', diag: '胸部CT平扫', tags: ['检查'] },
  { id: 302, date: '2024-03-15 15:00', hosp: '常州市第一人民医院', dept: '心功能室', type: 'exam', diag: '心电图检查', tags: ['检查'] },
  { id: 303, date: '2023-12-10 09:00', hosp: '常州市第二人民医院', dept: '超声科', type: 'exam', diag: '腹部超声', tags: ['检查'] },
  { id: 304, date: '2023-10-05 14:30', hosp: '常州市第一人民医院', dept: '内镜中心', type: 'exam', diag: '胃镜检查', tags: ['检查'] },
  { id: 305, date: '2023-06-20 11:00', hosp: '常州市中医院', dept: '放射科', type: 'exam', diag: '腰椎MRI', tags: ['检查'] }
];

const labRecords = [
  { id: 201, date: '2024-03-15 08:30', hosp: '常州市第一人民医院', dept: '检验科', type: 'lab', diag: '生化常规检查', tags: ['检验'] },
  { id: 202, date: '2024-03-15 08:35', hosp: '常州市第一人民医院', dept: '检验科', type: 'lab', diag: '血常规 (五分类)', tags: ['检验'] },
  { id: 203, date: '2023-12-15 09:00', hosp: '常州市第二人民医院', dept: '检验科', type: 'lab', diag: '尿常规', tags: ['检验'] },
  { id: 204, date: '2023-10-10 08:45', hosp: '常州市第一人民医院', dept: '检验科', type: 'lab', diag: '凝血功能', tags: ['检验'] },
  { id: 205, date: '2023-05-20 10:15', hosp: '常州市中医院', dept: '检验科', type: 'lab', diag: '糖化血红蛋白', tags: ['检验'] }
];

const medRecords = [
  { id: 401, date: '2024-03-15 10:00', hosp: '常州市第一人民医院', dept: '心内科', type: 'med', diag: '高血压用药', tags: ['药耗'] },
  { id: 402, date: '2024-02-10 15:00', hosp: '天宁区青龙街道社区卫生服务中心', dept: '消化内科', type: 'med', diag: '胃病用药', tags: ['药耗'] },
  { id: 403, date: '2024-01-05 11:00', hosp: '常州市第二人民医院', dept: '呼吸内科', type: 'med', diag: '感冒用药', tags: ['药耗'] },
  { id: 404, date: '2023-11-20 12:00', hosp: '常州市第一人民医院', dept: '骨科', type: 'med', diag: '止痛用药', tags: ['药耗'] },
  { id: 405, date: '2023-09-12 09:30', hosp: '天宁区青龙街道社区卫生服务中心', dept: '眼科', type: 'med', diag: '眼药水', tags: ['药耗'] }
];
</script>

<template>
  <div v-if="type === 'op'" class="record-list">
    <div v-for="(rec, idx) in opRecords" :key="idx" class="tl-card-box" @click="handleAction('op', '病历', rec)">
      <div class="tl-meta">
        <span class="tl-date">{{ rec.date }}</span>
        <span class="tl-hosp">{{ rec.hosp }}</span>
      </div>
      <div class="tl-card-top">
        <span class="tl-card-ico"><Stethoscope :size="18" color="var(--blue)" /></span>
        <div class="tl-card-title-group">
          <span class="tl-card-title">{{ rec.dept }}门诊 - {{ idx === 0 ? '高血压常规复诊' : '腰椎间盘突出治疗' }}</span>
          <div class="tl-card-sub">接诊医生：{{ idx === 0 ? '王建国 主任医师' : '张志强 副主任医师' }} | 费用：{{ idx === 0 ? '¥128.00' : '¥245.50' }}</div>
        </div>
        <span class="tag t-blue">门诊</span>
      </div>
      <div class="tl-card-diag">
        <strong>诊断：</strong>{{ rec.diag }}
      </div>
    </div>
  </div>

  <div v-else-if="type === 'ip'" class="record-list">
    <div v-for="(rec, idx) in ipRecords" :key="idx" class="tl-card-box">
      <div class="tl-meta">
        <span class="tl-date">{{ rec.date }} (10天)</span>
        <span class="tl-hosp">{{ rec.hosp }}</span>
      </div>
      <div class="tl-card-top">
        <span class="tl-card-ico"><Hospital :size="18" color="var(--red)" /></span>
        <div class="tl-card-title-group">
          <span class="tl-card-title">{{ rec.dept }} - 急性心肌梗死住院记录</span>
          <div class="tl-card-sub">主治医生：刘明远 | 住院号：IP20240310001 | 费用：¥42,840.00</div>
        </div>
        <span class="tag t-green">已出院</span>
      </div>
      <div class="tl-card-diag">
        <strong>主要诊断：</strong>{{ rec.diag }}
        <br />
        <strong>手术操作：</strong>经皮冠状动脉支架植入术(PCI) - 2024-03-10
      </div>
      <div class="tl-card-btns">
        <button class="tl-link-btn" @click="handleAction('ip_detail', '住院详情', rec)">病案首页</button>
      </div>
    </div>
  </div>

  <div v-else-if="type === 'exam'" class="record-list">
    <div v-for="(rec, idx) in examRecords" :key="idx" class="tl-card-box">
      <div class="tl-meta">
        <span class="tl-date">{{ rec.date }}</span>
        <span class="tl-hosp">{{ rec.hosp }}</span>
      </div>
      <div class="tl-card-top">
        <span class="tl-card-ico"><ClipboardCheck :size="18" color="var(--purple)" /></span>
        <div class="tl-card-title-group">
          <span class="tl-card-title">{{ rec.diag.split(' ')[0] }}</span>
          <div class="tl-card-sub">检查部位：{{ idx === 0 ? '胸部' : '心脏' }} | 检查号：{{ idx === 0 ? 'CT2024051608' : 'ECG2024051512' }} | 费用：{{ idx === 0 ? '¥320.00' : '¥40.00' }}</div>
        </div>
        <span class="tag t-slate">{{ idx === 0 ? '放射科' : '心功能室' }}</span>
      </div>
      <div class="tl-card-diag">
        <strong>结论：</strong>{{ rec.diag }}
      </div>
      <div class="tl-card-btns">
        <button class="btn-s" @click="handleAction('exam_detail', '查看报告', rec)">查看报告</button>
        <button v-if="idx === 0" class="btn-p" style="margin-left: 8px" @click="handleAction('dicom', '阅片器', rec)">调阅影像</button>
      </div>
    </div>
  </div>

  <div v-else-if="type === 'lab'" class="record-list">
    <div v-for="(rec, idx) in labRecords" :key="idx" class="tl-card-box" @click="handleAction('lab_detail', '检验明细', rec)">
      <div class="tl-meta">
        <span class="tl-date">{{ rec.date }}</span>
        <span class="tl-hosp">{{ rec.hosp }}</span>
      </div>
      <div class="tl-card-top">
        <span class="tl-card-ico"><Microscope :size="18" color="var(--amber)" /></span>
        <div class="tl-card-title-group">
          <span class="tl-card-title">{{ rec.diag }}</span>
          <div class="tl-card-sub">标本：{{ idx === 0 ? '血清' : '全血' }} | 采样：08:30 | 报告：{{ idx === 0 ? '11:20' : '09:10' }} | 费用：{{ idx === 0 ? '¥185.00' : '¥25.00' }}</div>
        </div>
        <span :class="['tag', idx === 0 ? 't-red' : 't-green']">{{ idx === 0 ? '3项异常' : '全部正常' }}</span>
      </div>
      <div v-if="idx === 0" class="tl-lab-results">
        <div class="lab-res-row"><span>谷丙转氨酶 (ALT)</span><span class="lab-val-bad">45 U/L ↑</span></div>
        <div class="lab-res-row"><span>总胆固醇 (TC)</span><span class="lab-val-bad">6.2 mmol/L ↑</span></div>
        <div class="lab-res-row"><span>低密度脂蛋白 (LDL-C)</span><span class="lab-val-bad">4.1 mmol/L ↑</span></div>
      </div>
      <div v-else class="tl-lab-results">
        <div class="lab-res-row"><span>白细胞计数 (WBC)</span><span>6.2 x10^9/L</span></div>
        <div class="lab-res-row"><span>血红蛋白 (HGB)</span><span>145 g/L</span></div>
        <div class="lab-res-row"><span>血小板计数 (PLT)</span><span>210 x10^9/L</span></div>
      </div>
    </div>
  </div>

  <div v-else-if="type === 'med'" class="record-list">
    <div class="tl-card-box">
      <div class="tl-meta">
        <span class="tl-date">2024-05-15</span>
        <span class="tl-hosp">常州市第一人民医院</span>
      </div>
      <div class="tl-card-top">
        <span class="tl-card-ico"><Pill :size="18" color="var(--purple)" /></span>
        <div class="tl-card-title-group">
          <span class="tl-card-title">心内科长期用药处方</span>
          <div class="tl-card-sub">处方医生：王建国 | 处方号：RX20240515001 | 费用：¥342.50</div>
        </div>
        <span class="tag t-purple">药耗</span>
      </div>
      <div class="tl-med-list">
        <div class="med-item">
          <div class="med-name">苯磺酸氨氯地平片 (络活喜)</div>
          <div class="med-meta">5mg * 7片/盒 | x4盒 | 1片 qd</div>
        </div>
        <div class="med-item">
          <div class="med-name">缬沙坦胶囊 (代文)</div>
          <div class="med-meta">80mg * 7粒/盒 | x4盒 | 1粒 qd</div>
        </div>
      </div>
      <div class="tl-card-btns" style="margin-top: 12px; border-top: 1px dashed var(--line); padding-top: 12px; display: flex; justify-content: flex-end;">
        <button class="btn-s" @click="handleAction('op', '电子处方', null)">电子处方</button>
      </div>
    </div>
  </div>
</template>
