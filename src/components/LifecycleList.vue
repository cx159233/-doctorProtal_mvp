<script setup lang="ts">
import { ref, computed } from 'vue';
import { FileText, ImageIcon, ClipboardCheck } from 'lucide-vue-next';
import { healthRecords as defaultRecords } from '../data';

const props = defineProps<{
  filter?: string;
  records?: any[];
  onAction?: (type: string, title: string) => void;
}>();

const emit = defineEmits(['action']);

const currentPage = ref(1);
const itemsPerPage = 5;

const sourceRecords = computed(() => props.records && props.records.length > 0 ? props.records : defaultRecords);

const filteredRecords = computed(() => {
  let data = sourceRecords.value;
  if (props.filter && props.filter !== 'all') {
    const map: Record<string, string> = {
      op: "门诊",
      ip: "住院",
      lab: "检验",
      exam: "检查",
      med: "药耗",
      pe: "体检",
      wd: "穿戴"
    };
    const targetTag = map[props.filter];
    data = sourceRecords.value.filter(r => r.tags.includes(targetTag));
  }
  return [...data].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
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
                rec.tags[0] === '穿戴' ? 't-green' :
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
              <template v-else-if="rec.type === 'wd'">
                <button class="tbl-link-btn" @click="handleAction('wd', '查看详情', rec)">查看详情</button>
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
