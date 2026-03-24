<script setup lang="ts">
import { ref, computed } from 'vue';
import { FileText, ImageIcon, ClipboardCheck } from 'lucide-vue-next';

const props = defineProps<{
  filter?: string;
  onAction?: (type: string, title: string) => void;
}>();

const emit = defineEmits(['action']);

const records = [
  { date: "2024-03-15", hosp: "常州市第一人民医院", dept: "心内科", type: "op", diag: "原发性高血压", cost: "¥386", reimb: "¥268", tags: ["门诊"] },
  { date: "2024-02-10", hosp: "南京大学医学院附属鼓楼医院", dept: "消化内科", type: "op", diag: "慢性胃炎", cost: "¥50", reimb: "¥45", tags: ["门诊"] },
  { date: "2024-01-05", hosp: "南京大学医学院附属鼓楼医院", dept: "呼吸内科", type: "op", diag: "上呼吸道感染", cost: "¥220", reimb: "¥154", tags: ["门诊"] },
  { date: "2023-11-20", hosp: "常州市第一人民医院", dept: "骨科", type: "op", diag: "腰肌劳损", cost: "¥180", reimb: "¥120", tags: ["门诊"] },
  { date: "2023-09-12", hosp: "南京大学医学院附属鼓楼医院", dept: "眼科", type: "op", diag: "结膜炎", cost: "¥65", reimb: "¥50", tags: ["门诊"] },
  
  { date: "2024-03-10", hosp: "常州市第一人民医院", dept: "心内科", type: "ip", diag: "急性下壁心肌梗死", cost: "¥12,450", reimb: "¥9,800", tags: ["住院"] },
  { date: "2023-05-10", hosp: "常州市第一人民医院", dept: "普外科", type: "ip", diag: "阑尾炎住院", cost: "¥8,420", reimb: "¥6,230", tags: ["住院"] },
  { date: "2022-12-01", hosp: "南京大学医学院附属鼓楼医院", dept: "呼吸内科", type: "ip", diag: "大叶性肺炎", cost: "¥5,600", reimb: "¥4,100", tags: ["住院"] },
  { date: "2022-08-15", hosp: "常州市第一人民医院", dept: "消化内科", type: "ip", diag: "急性胃肠炎", cost: "¥3,200", reimb: "¥2,400", tags: ["住院"] },
  { date: "2022-03-10", hosp: "常州市第一人民医院", dept: "骨伤科", type: "ip", diag: "左桡骨远端骨折", cost: "¥7,800", reimb: "¥5,900", tags: ["住院"] },
  
  { date: "2024-03-15", hosp: "常州市第一人民医院", dept: "检验科", type: "lab", diag: "生化常规检查", cost: "¥120", reimb: "¥100", tags: ["检验"] },
  { date: "2024-03-15", hosp: "常州市第一人民医院", dept: "检验科", type: "lab", diag: "血常规 (五分类)", cost: "¥80", reimb: "¥60", tags: ["检验"] },
  { date: "2023-12-15", hosp: "南京大学医学院附属鼓楼医院", dept: "检验科", type: "lab", diag: "尿常规", cost: "¥45", reimb: "¥35", tags: ["检验"] },
  { date: "2023-10-10", hosp: "常州市第一人民医院", dept: "检验科", type: "lab", diag: "凝血功能", cost: "¥150", reimb: "¥120", tags: ["检验"] },
  { date: "2023-05-20", hosp: "常州市第一人民医院", dept: "检验科", type: "lab", diag: "糖化血红蛋白", cost: "¥90", reimb: "¥70", tags: ["检验"] },
  
  { date: "2024-03-16", hosp: "常州市第一人民医院", dept: "放射科", type: "exam", diag: "胸部CT平扫", cost: "¥240", reimb: "¥180", tags: ["检查"] },
  { date: "2024-03-15", hosp: "常州市第一人民医院", dept: "心功能室", type: "exam", diag: "心电图检查", cost: "¥60", reimb: "¥40", tags: ["检查"] },
  { date: "2023-12-10", hosp: "南京大学医学院附属鼓楼医院", dept: "超声科", type: "exam", diag: "腹部超声", cost: "¥180", reimb: "¥140", tags: ["检查"] },
  { date: "2023-10-05", hosp: "常州市第一人民医院", dept: "内镜中心", type: "exam", diag: "胃镜检查", cost: "¥650", reimb: "¥520", tags: ["检查"] },
  { date: "2023-06-20", hosp: "常州市第一人民医院", dept: "放射科", type: "exam", diag: "腰椎MRI", cost: "¥580", reimb: "¥460", tags: ["检查"] },
  
  { date: "2024-03-15", hosp: "常州德仁堂药店", dept: "心内科", type: "med", diag: "高血压用药", cost: "¥158", reimb: "¥120", tags: ["药耗"] },
  { date: "2024-02-10", hosp: "南京益丰大药房", dept: "消化内科", type: "med", diag: "胃病用药", cost: "¥85", reimb: "¥65", tags: ["药耗"] },
  { date: "2024-01-05", hosp: "南京益丰大药房", dept: "呼吸内科", type: "med", diag: "感冒用药", cost: "¥42", reimb: "¥30", tags: ["药耗"] },
  { date: "2023-11-20", hosp: "常州万民药店", dept: "骨科", type: "med", diag: "止痛用药", cost: "¥110", reimb: "¥80", tags: ["药耗"] },
  { date: "2023-09-12", hosp: "南京益丰大药房", dept: "眼科", type: "med", diag: "眼药水", cost: "¥35", reimb: "¥25", tags: ["药耗"] },
  { id: "30", date: "2024-06-01", hosp: "常州爱康国宾体检中心", dept: "体检中心", type: "pe", diag: "年度员工健康体检", cost: "¥850", reimb: "¥0", tags: ["体检"], desc: "建议：1. 发现轻度脂肪肝，建议低脂饮食。2. 尿酸指标偏高，需控制嘌呤摄入。", metrics: [{label: "甘油三酯", value: "2.45", flag: "high"}, {label: "血尿酸", value: "468", flag: "high"}] },
  { id: "31", date: "2024-05-15", hosp: "常州美年大健康体检中心", dept: "体检中心", type: "pe", diag: "专项防癌筛查体检", cost: "¥1200", reimb: "¥0", tags: ["体检"], desc: "诊断：各项指标在正常范围内，未见明显异常。" },
];

const currentPage = ref(1);
const itemsPerPage = 5;

const filteredRecords = computed(() => {
  let data = records;
  if (props.filter && props.filter !== 'all') {
    const map: Record<string, string> = {
      op: "门诊",
      ip: "住院",
      lab: "检验",
      exam: "检查",
      med: "药耗",
      pe: "体检"
    };
    const targetTag = map[props.filter];
    data = records.filter(r => r.tags.includes(targetTag));
  }
  return data;
});

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredRecords.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredRecords.value.length / itemsPerPage));

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const handleAction = (type: string, title: string, record: any) => {
  emit('action', type, title, record);
};
</script>

<template>
  <div style="display: flex; flex-direction: column;">
    <table class="tbl">
      <thead>
        <tr>
          <th>日期</th>
          <th>机构</th>
          <th>科室</th>
          <th>类型</th>
          <th>诊断</th>
          <th>总费用</th>
          <th>报销</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rec, idx) in paginatedRecords" :key="idx">
          <td>{{ rec.date }}</td>
          <td>{{ rec.hosp }}</td>
          <td>{{ rec.dept }}</td>
          <td>
            <span 
              :class="['tag', 
                rec.tags[0] === '门诊' ? 't-blue pointer' : 
                rec.tags[0] === '住院' ? 't-red pointer' : 
                rec.tags[0] === '随访' ? 't-green' : 
                rec.tags[0] === '检验' ? 't-amber pointer' :
                rec.tags[0] === '检查' ? 't-cyan pointer' :
                rec.tags[0] === '药耗' ? 't-purple' :
                rec.tags[0] === '体检' ? 't-blue' :
                't-slate']"
            >
              {{ rec.tags[0] }}
            </span>
          </td>
          <td>{{ rec.diag }}</td>
          <td>{{ rec.cost }}</td>
          <td style="color: var(--green); font-weight: 700">{{ rec.reimb }}</td>
          <td>
            <div class="tbl-actions">
              <template v-if="rec.type === 'op'">
                <button class="tbl-link-btn" @click="handleAction('op', '查看病历', rec)">查看病历</button>
              </template>
              <template v-else-if="rec.type === 'ip'">
                <button class="tbl-link-btn" @click="handleAction('ip_detail', '病案首页', rec)">病案首页</button>
              </template>
              <template v-else-if="rec.type === 'follow'">
                <button class="tbl-link-btn" @click="handleAction('op', '查看病历', rec)">查看病历</button>
              </template>
              <template v-else-if="rec.type === 'exam'">
                <button class="tbl-link-btn" @click="handleAction('exam_detail', '查看报告', rec)">查看报告</button>
                <button class="tbl-link-btn" @click="handleAction('dicom', '调阅影像', rec)">调阅影像</button>
              </template>
              <template v-else-if="rec.type === 'lab'">
                <button class="tbl-link-btn" @click="handleAction('lab_detail', '查看明细', rec)">查看明细</button>
              </template>
              <template v-else-if="rec.type === 'med'">
                <button class="tbl-link-btn" @click="handleAction('op', '电子处方', rec)">电子处方</button>
              </template>
              <template v-else-if="rec.type === 'pe'">
                <button class="tbl-link-btn" @click="handleAction('pe', '体检报告', rec)">体检报告</button>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; font-size: 13px; color: var(--ink3); padding: 0 16px 16px;">
      <div>共 {{ filteredRecords.length }} 条数据</div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button style="border: 1px solid var(--line); background: #fff; padding: 2px 8px; border-radius: 4px; cursor: pointer;" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
        <span v-for="page in totalPages" :key="page" 
              :style="{ background: currentPage === page ? 'var(--blue)' : 'transparent', color: currentPage === page ? '#fff' : 'var(--ink)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }"
              @click="changePage(page)">
          {{ page }}
        </span>
        <button style="border: 1px solid var(--line); background: #fff; padding: 2px 8px; border-radius: 4px; cursor: pointer;" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
        <span style="margin-left: 8px;">跳至</span>
        <input type="number" min="1" :max="totalPages" v-model.number="currentPage" @change="changePage(currentPage)" style="width: 40px; border: 1px solid var(--line); border-radius: 4px; text-align: center; padding: 2px;" />
        <span>页</span>
      </div>
    </div>
  </div>
</template>
