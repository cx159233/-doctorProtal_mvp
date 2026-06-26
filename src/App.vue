<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import LifecycleList from './components/LifecycleList.vue';
import RecordList from './components/RecordList.vue';
import MedicalDetail from './components/MedicalDetail.vue';
import DicomViewer from './components/DicomViewer.vue';
import BodyAnnotation from './components/BodyAnnotation.vue';
import type { PortraitButton } from './components/BodyAnnotation.vue';
import type { ConfigProviderProps } from 'ant-design-vue';
import { 
  UserCircle, 
  Activity, 
  CreditCard, 
  Info, 
  Stethoscope, 
  Hospital, 
  ClipboardCheck, 
  Microscope, 
  Pill,
  Plane,
  UserCheck,
  ChevronRight,
  Search,
  Filter,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  X,
  UserPlus,
  Trash2,
  Settings,
  ShieldCheck,
  CreditCard as CreditCardIcon,
  Plus,
  ChevronLeft,
  CircleDot,
  Menu,
  Calendar,
  RefreshCw,
  Radar,
  ZoomIn,
  Hand,
  Contrast,
  Briefcase,
  HeartPulse,
  ChevronDown,
  ChevronUp,
  Target,
  Users,
  Maximize2,
  Scan,
  Database,
  Cpu,
  Zap,
  Move,
  Droplets,
  FlaskConical,
  AlertTriangle,
  Tags
} from 'lucide-vue-next';

const patients = [
  { id: 1, name: "陈 ** 明", age: 42, gender: "男", status: "就诊中", tags: ["高血压", "门诊"], av: "👨", avBg: "#EFF6FF", tagColors: ["t-amber", "t-blue"] },
  { id: 2, name: "王 ** 芳", age: 35, gender: "女", status: "待诊", tags: ["糖尿病", "复查"], av: "👩", avBg: "#ECFDF5", tagColors: ["t-purple", "t-blue"] },
  { id: 3, name: "张 ** 国", age: 68, gender: "男", status: "已诊", tags: ["心衰", "随访"], av: "👴", avBg: "#FFF7E6", tagColors: ["t-red", "t-amber"] },
  { id: 4, name: "赵 ** 敏", age: 28, gender: "女", status: "待诊", tags: ["孕32周", "产检"], av: "👧", avBg: "#F5F3FF", tagColors: ["t-green", "t-cyan"] },
  { id: 5, name: "刘 ** 阳", age: 55, gender: "男", status: "待诊", tags: ["冠心病", "门诊"], av: "👦", avBg: "#FEF2F2", tagColors: ["t-red", "t-blue"] },
];

type RecordType = Record<string, any>;
type ModalState =
  | { type: 'outpatient'; item: RecordType }
  | { type: 'inpatient'; item: RecordType }
  | { type: 'exam'; item: RecordType }
  | { type: 'lab'; item: RecordType }
  | { type: 'medicine'; item: RecordType }
  | null;

const antdTheme = computed<ConfigProviderProps['theme']>(() => ({
  token: {
    colorPrimary: '#2563eb',
    borderRadius: 12,
    colorBgLayout: '#f8fafc',
    colorBgContainer: '#ffffff',
    colorText: '#0f172a',
    colorTextSecondary: '#475569',
    colorBorder: '#e2e8f0',
  },
}));

const isPatientPanelCollapsed = ref(true);
const searchPatientName = ref('');
const searchPatientId = ref('');
const showOutpatientDetail = ref(false);
const selectedRecordForDetail = ref<any>(null);
const showInsuranceClaimModal = ref(false);
const showExpiredInsuranceModal = ref(false);
const showMetricDetailModal = ref(false);
const selectedMetric = ref<string>('血压');
const selectedMetricRange = ref('近三月');
const showCommercialInsuranceDetail = ref(false);
const selectedCommercialInsurance = ref<any>(null);
const showBasicInsuranceDetail = ref(false);
const warningItems = [
  { level: 'red', label: '药物相互作用', text: '阿司匹林 + 布洛芬，GI 出血高风险' },
  { level: 'red', label: '检验危急值', text: '血钾 5.8 mmol/L ↑，高于正常上限' },
  { level: 'amber', label: '过敏警示', text: '青霉素过敏史，避免 β-内酰胺类' },
  { level: 'amber', label: '共病风险', text: '冠心病+糖尿病+高血压，CVD 复合风险极高危' },
  { level: 'amber', label: '重复检查', text: '胸部 CT 30天内重复，建议评估必要性' },
];

const aiSearchType = ref<'name' | 'id'>('name');

// --- New State from doctorDashboard ---
const recordTab = ref<'outpatient' | 'inpatient' | 'exam' | 'lab' | 'medicine' | 'wearable'>('outpatient');
const recordTabOptions = [
  { id: 'outpatient', label: '门诊' },
  { id: 'inpatient', label: '住院' },
  { id: 'exam', label: '检查' },
  { id: 'lab', label: '检验' },
  { id: 'medicine', label: '药耗' },
  { id: 'wearable', label: '穿戴' },
] as const;

const portraitButtons: PortraitButton[] = [
  // 右侧按钮
  { id: 'outpatient', label: '门诊记录', icon: '🏥', dotX: 428, dotY: 115, boxX: 540, boxY: 83,  side: 'right', color: '#3B82F6', ringR: 28, ringDur: 3.2, ringDelay: 0.0 },
  { id: 'inpatient',  label: '住院记录', icon: '🛏️', dotX: 435, dotY: 225, boxX: 540, boxY: 193, side: 'right', color: '#8B5CF6', ringR: 32, ringDur: 3.8, ringDelay: 0.8 },
  { id: 'medicine',   label: '药耗记录', icon: '💊', dotX: 435, dotY: 345, boxX: 540, boxY: 313, side: 'right', color: '#F59E0B', ringR: 26, ringDur: 3.0, ringDelay: 1.6 },
  { id: 'physical',   label: '体检记录', icon: '🩺', dotX: 428, dotY: 460, boxX: 540, boxY: 428, side: 'right', color: '#10B981', ringR: 30, ringDur: 3.5, ringDelay: 2.4, disabled: true },
  // 左侧按钮 - 下移避免与AI辅助诊断重叠
  { id: 'exam',       label: '检查记录', icon: '🔍', dotX: 372, dotY: 250, boxX: 100, boxY: 218, side: 'left',  color: '#06B6D4', ringR: 28, ringDur: 3.6, ringDelay: 0.4, 
    recentRecords: [
      { date: '2024-01-15', type: 'CT平扫', result: '未见异常' },
      { date: '2023-12-20', type: 'MRI', result: '轻度脑萎缩' },
      { date: '2023-11-05', type: 'X光胸片', result: '双肺纹理增多' }
    ]
  },
  { id: 'lab',         label: '检验记录', icon: '🧪', dotX: 377, dotY: 390, boxX: 100, boxY: 358, side: 'left',  color: '#EF4444', ringR: 34, ringDur: 4.0, ringDelay: 1.2,
    recentRecords: [
      { date: '2024-01-15', type: '血常规', result: 'WBC 7.2' },
      { date: '2023-12-20', type: '血糖', result: '5.8 mmol/L' },
      { date: '2023-11-05', type: '血脂', result: '4.2 mmol/L' }
    ]
  },
  { id: 'wearable',    label: '穿戴数据', icon: '⌚', dotX: 377, dotY: 530, boxX: 100, boxY: 498, side: 'left',  color: '#EC4899', ringR: 30, ringDur: 3.4, ringDelay: 2.0 },
];

const portraitTabMap: Record<string, { recordTab: string; lifecycleTab: string }> = {
  outpatient: { recordTab: 'outpatient', lifecycleTab: 'op' },
  inpatient:  { recordTab: 'inpatient',  lifecycleTab: 'ip' },
  medicine:   { recordTab: 'medicine',   lifecycleTab: 'med' },
  physical:   { recordTab: 'wearable',   lifecycleTab: 'wd' },
  exam:       { recordTab: 'exam',       lifecycleTab: 'exam' },
  lab:         { recordTab: 'lab',         lifecycleTab: 'lab' },
  wearable:    { recordTab: 'outpatient', lifecycleTab: 'op' },
};

function onPortraitButtonClick(id: string) {
  const mapping = portraitTabMap[id];
  if (mapping) {
    recordTab.value = mapping.recordTab as any;
    activeLifecycleTab.value = mapping.lifecycleTab as any;
  }
  activeView.value = 'health';
}

const activeModal = ref<ModalState>(null);
const showDicom = ref(false);
const isVizExpanded = ref(false);
const isRecordsExpanded = ref(false);
const showFullProfile = ref(false);
const currentTime = ref(new Date());
let timer: number | undefined;

const timeText = computed(() => currentTime.value.toLocaleTimeString([], { hour12: false }));

const tabLabelMap: Record<string, string> = {
  outpatient: '门诊',
  inpatient: '住院',
  exam: '检查',
  lab: '检验',
  medicine: '药耗',
  physical: '体检',
  wearable: '穿戴'
};

const recordTabLabel = computed(() => tabLabelMap[recordTab.value] || recordTab.value);

const insuranceTabs = [
  { id: 'status', label: '参保状态', icon: ShieldCheck },
  { id: 'commercial', label: '商业保险', icon: Briefcase },
  { id: 'longterm', label: '长护险', icon: HeartPulse },
] as const;
type InsuranceTab = (typeof insuranceTabs)[number]['id'];
const insuranceTab = ref<InsuranceTab>('status');

const expandedLabIds = ref<Set<string>>(new Set());
const expandedMedicineIds = ref<Set<string>>(new Set());

function toggleSet(setRef: any, id: string) {
  const next = new Set(setRef.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  setRef.value = next;
}

function openModal(type: any, item: RecordType) {
  activeModal.value = { type, item } as any;
}

const commercialInsuranceData: Record<string, any> = {
  yihuibao: {
    name: '江苏医惠保1号',
    shortName: '医惠保',
    company: '江苏银保',
    policyNo: 'PA202401000123',
    color: '#ea580c',
    colorLight: '#fb923c',
    colorBg: 'from-orange-50 to-white',
    colorBorder: 'border-orange-200',
    colorHover: 'hover:border-orange-300',
    insured: '陈志明',
    period: '2024-01-01 至 2025-12-31',
    premium: '¥1,280.00',
    coverage: '¥10,000',
    totalCoverage: '200万',
    coverageTypes: [
      { category: '住院医疗保障', items: [
        { name: '床位费', limit: '每日限额500元', covered: true },
        { name: '膳食费', limit: '每日限额100元', covered: true },
        { name: '护理费', limit: '全额报销', covered: true },
        { name: '检查检验费', limit: '全额报销', covered: true },
        { name: '手术费', limit: '全额报销', covered: true },
        { name: '药品费', limit: '全额报销（不含丙类）', covered: true },
      ]},
      { category: '特殊门诊保障', items: [
        { name: '门诊手术', limit: '全额报销', covered: true },
        { name: '门诊肾透析', limit: '全额报销', covered: true },
        { name: '门诊恶性肿瘤治疗', limit: '全额报销', covered: true },
        { name: '器官移植后抗排异治疗', limit: '全额报销', covered: true },
      ]},
      { category: '重疾保障', items: [
        { name: '重大疾病医疗', limit: '额外200万', covered: true },
        { name: '恶性肿瘤特药', limit: '全额报销', covered: true },
        { name: '质子重离子医疗', limit: '全额报销', covered: true },
      ]},
    ],
    exclusions: [
      { name: '既往症', desc: '投保前已患疾病' },
      { name: '生育相关', desc: '产检、分娩、流产等' },
      { name: '整形美容', desc: '整容、美容、矫正等' },
      { name: '体检保健', desc: '健康体检、预防保健等' },
      { name: '牙科治疗', desc: '牙齿治疗、修复等' },
      { name: '精神疾病', desc: '心理治疗、精神障碍等' },
    ],
    claims: [
      { id: 'CL20240315001', date: '2024-03-15', type: '住院医疗', amount: '15,000', status: '已赔付' },
      { id: 'CL20240120002', date: '2024-01-20', type: '门诊检查', amount: '2,800', status: '已赔付' },
    ],
  },
  lexiang: {
    name: '乐享健康重疾险',
    shortName: '乐享',
    company: '平安健康险',
    policyNo: 'PA202401000123',
    color: '#2563eb',
    colorLight: '#60a5fa',
    colorBg: 'from-blue-50 to-white',
    colorBorder: 'border-blue-200',
    colorHover: 'hover:border-blue-300',
    insured: '陈志明',
    period: '2024-05-20 至 2025-05-19',
    premium: '¥3,200.00',
    coverage: '¥0',
    totalCoverage: '50万',
    coverageTypes: [
      { category: '重大疾病保障', items: [
        { name: '恶性肿瘤', limit: '全额赔付50万', covered: true },
        { name: '急性心肌梗塞', limit: '全额赔付50万', covered: true },
        { name: '脑中风后遗症', limit: '全额赔付50万', covered: true },
        { name: '重大器官移植', limit: '全额赔付50万', covered: true },
        { name: '冠状动脉搭桥术', limit: '全额赔付50万', covered: true },
        { name: '终末期肾病', limit: '全额赔付50万', covered: true },
      ]},
      { category: '特定疾病保障', items: [
        { name: '轻症疾病', limit: '额外30%保额', covered: true },
        { name: '中症疾病', limit: '额外50%保额', covered: true },
        { name: '特定肿瘤', limit: '额外30%保额', covered: true },
      ]},
      { category: '身故/全残保障', items: [
        { name: '疾病身故', limit: '全额赔付50万', covered: true },
        { name: '意外身故', limit: '全额赔付50万', covered: true },
        { name: '全残保障', limit: '全额赔付50万', covered: true },
      ]},
    ],
    exclusions: [
      { name: '等待期出险', desc: '等待期内发生的疾病' },
      { name: '投保前未如实告知', desc: '故意隐瞒既往病史' },
      { name: '违法行为', desc: '酒驾、吸毒等' },
      { name: '高风险运动', desc: '潜水、攀岩等' },
      { name: '战争暴乱', desc: '战争、军事冲突等' },
      { name: '核辐射', desc: '核爆炸、核污染等' },
    ],
    claims: [
      { id: 'CL20240620001', date: '2024-06-20', type: '轻症理赔', amount: '15,000', status: '已赔付' },
    ],
  },
};

function openCommercialInsuranceDetail(id: string) {
  selectedCommercialInsurance.value = commercialInsuranceData[id];
  showCommercialInsuranceDetail.value = true;
}

function closeCommercialInsuranceDetail() {
  showCommercialInsuranceDetail.value = false;
  selectedCommercialInsurance.value = null;
}

function openBasicInsuranceDetail() {
  showBasicInsuranceDetail.value = true;
}

function closeBasicInsuranceDetail() {
  showBasicInsuranceDetail.value = false;
}

function openAIAssistant() {
  const url = new URL(window.location.href);
  url.searchParams.set('view', 'ai-diagnosis');
  window.open(url.toString(), '_blank');
}

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = new Date();
  }, 1000);

  // 检查 URL 参数，如果存在 view 参数，则设置对应的视图
  const urlParams = new URLSearchParams(window.location.search);
  const viewParam = urlParams.get('view');
  if (viewParam === 'ai-diagnosis') {
    activeView.value = 'ai-diagnosis';
  }
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});

const filteredRecords = computed(() => {
  const map: Record<string, string> = {
    outpatient: "门诊",
    inpatient: "住院",
    lab: "检验",
    exam: "检查",
    medicine: "药耗",
    wearable: "穿戴"
  };
  const targetTag = map[recordTab.value];
  
  // Define record types for clinical records
  const typeMap: Record<string, string> = {
    outpatient: "op",
    inpatient: "ip",
    lab: "lab",
    exam: "exam",
    medicine: "med",
    wearable: "wd"
  };
  const currentType = typeMap[recordTab.value];

  // Map LifecycleList records to Clinical Center format
  const lifecycleRecords = [
    { id: "1", date: "2024-05-15", hosp: "常州市第一人民医院", dept: "心内科", type: "op", diag: "冠心病常规复诊", cost: "¥386", reimb: "¥268", tags: ["门诊"], desc: "1. 冠状动脉粥样硬化性心脏病 2. 高血压病3级（极高危）" },
    { id: "2", date: "2024-03-22", hosp: "常州市第一人民医院", dept: "骨科", type: "op", diag: "腰椎间盘突出治疗", cost: "¥50", reimb: "¥45", tags: ["门诊"], desc: "腰椎间盘突出症 (L4/L5)" },

    { id: "6", date: "2024-03-10", dateEnd: "2024-03-20", hosp: "常州市第一人民医院", dept: "心内科", type: "ip", diag: "急性心肌梗死住院记录", cost: "¥12,450", reimb: "¥9,800", tags: ["住院"], desc: "主要诊断：入院后急诊PCI术，于前降支植入支架一枚。术后予以抗血小板、调脂、改善心肌重构等治疗。", status: "已出院" },
    { id: "7", date: "2021-08-05", dateEnd: "2021-08-12", hosp: "常州市第一人民医院", dept: "内分泌科", type: "ip", diag: "血糖平衡调节", cost: "¥8,420", reimb: "¥6,230", tags: ["住院"], desc: "主要诊断：II型糖尿病，血糖控制不佳", status: "已出院" },
    
    { id: "11", date: "2024-05-16", hosp: "常州市第一人民医院", dept: "检验科", type: "lab", diag: "生化常规检查", cost: "¥120", reimb: "¥100", tags: ["检验"], metrics: [{label: "谷丙转氨酶 (ALT)", value: "45", unit: "U/L", flag: "high"}, {label: "总胆固醇 (TC)", value: "6.2", unit: "mmol/L", flag: "high"}], moreCount: 3 },
    { id: "12", date: "2024-04-12", hosp: "南京大学医学院附属鼓楼医院", dept: "检验科", type: "lab", diag: "糖化血红蛋白", cost: "¥80", reimb: "¥60", tags: ["检验"], metrics: [{label: "糖化血红蛋白", value: "5.8", unit: "%", flag: ""}] },
    
    { id: "16", date: "2024-05-16", hosp: "常州市第一人民医院", dept: "放射科", type: "exam", diag: "胸部CT平扫", cost: "¥240", reimb: "¥180", tags: ["放射科"], desc: "诊断结论：双肺纹理增多；建议结合临床，必要时随访。" },
    { id: "17", date: "2024-03-12", hosp: "南京大学医学院附属鼓楼医院", dept: "超声科", type: "exam", diag: "心脏彩超", cost: "¥60", reimb: "¥40", tags: ["超声科"], desc: "诊断结论：左房稍大，左室壁节段性运动异常，EF 52%。" },
    { id: "18", date: "2024-04-12", hosp: "南京大学医学院附属鼓楼医院", dept: "超声科", type: "exam", diag: "彩色多普勒超声", cost: "¥180", reimb: "¥140", tags: ["超声科"], desc: "结论：颈动脉内膜毛糙，未见明显斑块。建议定期复查。" },
    
    { id: "21", date: "2024-05-17", hosp: "常州德仁堂药店", dept: "心内科", type: "med", diag: "长期用药处方", cost: "¥158", reimb: "¥120", tags: ["药耗"], items: [{name: "阿司匹林肠溶片", count: "1盒"}, {name: "阿托伐他汀钙片", count: "2盒"}], moreCount: 1 },
    { id: "22", date: "2024-04-15", hosp: "常州万民药店", dept: "门诊部", type: "med", diag: "门诊处方详单", cost: "¥85", reimb: "¥65", tags: ["药耗"], items: [{name: "一次性使用无菌注射器 5ml", count: "1具"}] },

    { id: "wd1", date: "2026-06-25", hosp: "Apple Watch S9", dept: "个人穿戴", type: "wd", diag: "24h动态心电监测", tags: ["穿戴"], desc: "窦性心律，平均心率72bpm，偶发室性早搏(2次/24h)。", metrics: [{label: "平均心率", value: "72", unit: "bpm", flag: ""}, {label: "HRV(SDNN)", value: "86", unit: "ms", flag: ""}] },
    { id: "wd2", date: "2026-06-24", hosp: "华为手环 9", dept: "个人穿戴", type: "wd", diag: "睡眠呼吸监测", tags: ["穿戴"], desc: "AHI指数3.2，SpO2最低93%，鼾声时长占比8%。", metrics: [{label: "AHI指数", value: "3.2", flag: ""}, {label: "最低血氧", value: "93", unit: "%", flag: "high"}] },
  ];

  return lifecycleRecords.filter(r => r.type === currentType);
});
// -------------------------------------

const familyMembers = ref([
  { name: "李 **", rel: "配偶", id: "3204**********1234", status: "已激活", balance: true, av: "👩", color: "#FEE2E2" },
  { name: "陈 **", rel: "子女", id: "3204**********5678", status: "已激活", balance: true, av: "👦", color: "var(--blue-l)" },
  { name: "陈 ** 华", rel: "父亲", id: "3204**********9012", status: "待确认", balance: false, av: "👴", color: "var(--purple-l)" },
]);

const familyTreeMembers = [
  { id: 'ft1', name: '张德厚', relation: '父亲', age: 78, gender: '男', avatar: '父', health: '高血压', healthColor: '#F59E0B', generation: 0 },
  { id: 'ft2', name: '李秀兰', relation: '母亲', age: 75, gender: '女', avatar: '母', health: '糖尿病', healthColor: '#F59E0B', generation: 0 },
  { id: 'ft3', name: '王国强', relation: '本人', age: 54, gender: '男', avatar: '本', health: '冠心病', healthColor: '#EF4444', generation: 1, isSelf: true },
  { id: 'ft4', name: '陈美玲', relation: '配偶', age: 52, gender: '女', avatar: '妻', health: '健康', healthColor: '#10B981', generation: 1 },
  { id: 'ft5', name: '王小明', relation: '儿子', age: 28, gender: '男', avatar: '子', health: '健康', healthColor: '#10B981', generation: 2 },
  { id: 'ft6', name: '王小丽', relation: '女儿', age: 25, gender: '女', avatar: '女', health: '过敏性鼻炎', healthColor: '#8B5CF6', generation: 2 },
];

const authorizedMeMembers = ref([
  { name: "陈 ** 强", rel: "兄弟", id: "3204**********4321", status: "已激活", av: "👨", color: "var(--cyan-l)" },
]);

const expiredInsurancePolicies = ref([
  {
    name: '平安e生保·长期医疗',
    id: '保单号：PASH20230312001',
    status: '已到期',
    amount: '¥400.00万',
    deductible: '¥1.00万',
    expiry: '2024-03-11',
    logo: '🛡️'
  },
  {
    name: '泰康在线·百万医疗险',
    id: '保单号：TKZX20220512001',
    status: '已到期',
    amount: '¥300.00万',
    deductible: '¥1.00万',
    expiry: '2023-05-11',
    logo: '🏥'
  }
]);

const metricData = computed(() => {
  const data = [];
  let count = 7;
  if (selectedMetricRange.value === '近一周') count = 7;
  else if (selectedMetricRange.value === '近一月') count = 15;
  else if (selectedMetricRange.value === '近三月') count = 30;
  else if (selectedMetricRange.value === '近一年') count = 50;

  for (let i = 1; i <= count; i++) {
    const row: any = { date: `2022-06-${28 - i}` };
    if (selectedMetric.value === '血压') {
      row.v1 = 120 + Math.floor(Math.random() * 20);
      row.v2 = 70 + Math.floor(Math.random() * 15);
    } else if (selectedMetric.value === '血糖') {
      row.v1 = parseFloat((5 + Math.random() * 2).toFixed(1));
      row.v2 = parseFloat((8 + Math.random() * 3).toFixed(1));
    } else if (selectedMetric.value === '心率') {
      row.v1 = 70 + Math.floor(Math.random() * 20);
    } else if (selectedMetric.value === '体重') {
      row.v1 = parseFloat((50 + Math.random() * 5).toFixed(1));
    } else if (selectedMetric.value === '身高') {
      row.v1 = 168;
    } else if (selectedMetric.value === 'BMI') {
      row.v1 = parseFloat((20 + Math.random() * 2).toFixed(1));
    }
    row.source = getRandomSource();
    data.push(row);
  }
  return data.reverse(); 
});

const chartPaths = computed(() => {
  const data = metricData.value;
  if (!data.length) return { p1: '', p2: '' };
  
  const width = 800;
  const height = 250;
  const padX = 50;
  const padY = 30;
  
  // Find min/max to scale
  let min = Infinity, max = -Infinity;
  data.forEach(d => {
    if (d.v1 !== undefined) { min = Math.min(min, d.v1); max = Math.max(max, d.v1); }
    if (d.v2 !== undefined) { min = Math.min(min, d.v2); max = Math.max(max, d.v2); }
  });
  
  if (max === min) { max += 10; min -= 10; }
  const range = max - min;
  
  const getX = (i: number) => padX + (i / (data.length - 1)) * (width - 2 * padX);
  const getY = (val: number) => height - padY - ((val - min) / range) * (height - 2 * padY);
  
  let p1 = '', p2 = '';
  data.forEach((d, i) => {
    const x = getX(i);
    if (d.v1 !== undefined) {
      const y = getY(d.v1);
      p1 += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    }
    if (d.v2 !== undefined) {
      const y = getY(d.v2);
      p2 += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    }
  });
  
  return { p1, p2 };
});
const metricConfig = computed(() => {
  const m = selectedMetric.value;
  const data = metricData.value;
  const v1s = data.map(d => d.v1).filter(v => v !== undefined);
  const v2s = data.map(d => d.v2).filter(v => v !== undefined);

  const getStats = (vals: number[], prefix: string) => {
    if (!vals.length) return [];
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
    return [
      { label: `${prefix}最大值`, val: max.toString() },
      { label: `${prefix}最小值`, val: min.toString() },
      { label: `${prefix}平均值`, val: avg.toString() },
    ];
  };

  switch (m) {
    case '血压':
      return {
        unit: 'mmHg',
        stats: [...getStats(v1s, '收缩压'), ...getStats(v2s, '舒张压')],
        columns: ['时间', '收缩压 (mmHg)', '舒张压 (mmHg)', '来源'],
        legend: [
          { label: '收缩压 (mmHg)', color: 'var(--blue)' },
          { label: '舒张压 (mmHg)', color: 'var(--green)' },
        ],
        hasDoubleLine: true,
        sourceInfo: '以诊室血压测量结果为主要诊断依据：首诊发现收缩压 ≥ 140 mmHg和/或舒张压 ≥ 90 mmHg，建议在4周内复查2次，非同日3次测量均达到上述诊断界值，即可确诊。\n数据来源：国家心血管病中心 国家基层高血压管理办公室发布的《国家基层高血压防治管理指南2020版》'
      };
    case '血糖':
      return {
        unit: 'mmol/L',
        stats: [...getStats(v1s, '空腹血糖'), ...getStats(v2s, '餐后2h血糖')],
        columns: ['时间', '空腹血糖 (mmol/L)', '餐后2h血糖 (mmol/L)', '来源'],
        legend: [
          { label: '空腹血糖 (mmol/L)', color: 'var(--blue)' },
          { label: '餐后2h血糖 (mmol/L)', color: 'var(--green)' },
        ],
        hasDoubleLine: true,
        sourceInfo: '糖尿病诊断标准：典型糖尿病症状加上空腹血糖≥7.0 mmol/L或加上餐后2h血糖≥11.1 mmol/L。无糖尿病典型症状者，需改日复查确认。\n中华医学会糖尿病学分会《中国2型糖尿病防治指南2020版》'
      };
    case '心率':
      return {
        unit: '次/分',
        stats: getStats(v1s, '心率'),
        columns: ['时间', '心率 (次/分)', '来源'],
        legend: [
          { label: '心率 (次/分)', color: 'var(--blue)' },
        ],
        hasDoubleLine: false,
        sourceInfo: '正常成年人安静时的心率有显著的个体差异，平均在75次/分左右(60—100次/分之间)。\n数据来源：健康档案/数据来源与治理的系统'
      };
    case '体重':
      return {
        unit: 'kg',
        stats: getStats(v1s, '体重'),
        columns: ['时间', '体重 (kg)', '来源'],
        legend: [
          { label: '体重 (kg)', color: 'var(--blue)' },
        ],
        hasDoubleLine: false,
        sourceInfo: '体重是反映和衡量一个人健康状况的重要标志之一。过胖和过瘦都不利于健康。\n数据来源：健康档案/数据来源与治理的系统'
      };
    case '身高':
      return {
        unit: 'cm',
        stats: [
          { label: '身高最大值', val: Math.max(...v1s).toString() },
          { label: '身高最小值', val: Math.min(...v1s).toString() },
          { label: '身高变化值', val: (Math.max(...v1s) - Math.min(...v1s)).toString() },
        ],
        columns: ['时间', '身高 (cm)', '来源'],
        legend: [
          { label: '身高 (cm)', color: 'var(--blue)' },
        ],
        hasDoubleLine: false,
        sourceInfo: '身高受遗传、环境、营养、运动等多种因素影响。\n数据来源：健康档案/数据来源与治理的系统'
      };
    case 'BMI':
      return {
        unit: 'kg/m²',
        stats: getStats(v1s, '体质指数'),
        columns: ['时间', '体质指数(BMI)(kg/m²)', '来源'],
        legend: [
          { label: '体质指数(BMI)(kg/m²)', color: 'var(--blue)' },
        ],
        hasDoubleLine: false,
        sourceInfo: 'BMI≥28.0为肥胖，24.0≤BMI＜28.0为超重，18.5≤BMI＜24为体重正常，BMI＜18.5为体重过低。\n中华人民共和国国家卫生和计划生育委员会发布的WS/T 428-2013 成人体重判定。本标准适用于成人超重和肥胖的判定，不适用某些特殊人群，如运动员、孕产妇等。'
      };
    default:
      return { stats: [], columns: [], legend: [] };
  }
});

const getRandomSource = () => {
  const sources = ['LIS', 'PACS', 'HIS', '医保', '健康档案'];
  return sources[Math.floor(Math.random() * sources.length)];
};
const claimStep = ref(1);
const claimForm = ref({
  type: '住院医疗',
  amount: '42840.00',
  bank: '中国工商银行',
  account: '6222 **** **** 8832'
});

type ViewType = "his" | "his1" | "his2" | "his3" | "overview" | "health" | "finance" | "info" | "logout" | "medintercept" | "rulesadapt" | "ai-diagnosis";
type LifecycleTab = "all" | "op" | "ip" | "lab" | "exam" | "med" | "wd";

const activeView = ref<ViewType>("his");
function isActiveView(v: ViewType) { return activeView.value === v; }
function setActiveView(v: ViewType) { activeView.value = v; }
const activeNavTab = ref("imaging");
const showHisDropdown = ref(false);
const showMedInterceptPopup = ref(true);
const showRulesAdaptPopup = ref(true);
const selectedPatientId = ref(1);
const selectedPatient = computed(() => {
  return patients.find(p => p.id === selectedPatientId.value) || patients[0];
});
const activeLifecycleTab = ref<LifecycleTab>("op");
const showDetail = ref<{ type: string; title: string } | null>(null);
const showRefillModal = ref(false);
const showHealthRefillModal = ref(false);
const showReimbursementModal = ref(false);
const showFamilyManagementModal = ref(false);
const showAccountFlowModal = ref(false);
const showDicomViewer = ref(false);
const selectedCity = ref("changzhou");
const selectedYear = ref("2026");
const selectedRecordType = ref("门诊");
const currentPage = ref(1);
const itemsPerPage = 5;

const cbCurrentPage = ref(1);
const cbItemsPerPage = 5;

const cbReimbursementData = [
  { date: "2026-01-15", name: "平安e生保·长期医疗", hosp: "常州市第一人民医院", type: "住院理赔", typeTag: "t-red", amount: "1,250.00", status: "已打款", statusTag: "t-green" },
  { date: "2025-06-20", name: "泰康在线·百万医疗险", hosp: "常州市第一人民医院", type: "门诊理赔", typeTag: "t-blue", amount: "450.00", status: "已打款", statusTag: "t-green" }
];

const paginatedCbReimbursementData = computed(() => {
  const start = (cbCurrentPage.value - 1) * cbItemsPerPage;
  const end = start + cbItemsPerPage;
  return cbReimbursementData.slice(start, end);
});

const cbTotalPages = computed(() => Math.ceil(cbReimbursementData.length / cbItemsPerPage));

const changeCbPage = (page: number) => {
  if (page >= 1 && page <= cbTotalPages.value) {
    cbCurrentPage.value = page;
  }
};

const reimbursementData = [
  { date: "2026-03-05 14:20:31", hosp: "常州市第一人民医院", type: "门诊", total: "386.00", cash: "38.00", fund: "268.00", account: "80.00", deduct: "0.00", other: "0.00", ratio: "69.4%" },
  { date: "2026-02-18 09:12:05", hosp: "南京大学医学院附属鼓楼医院", type: "门诊", total: "50.00", cash: "0.00", fund: "45.00", account: "5.00", deduct: "0.00", other: "0.00", ratio: "90.0%" },
  { date: "2025-08-05 11:07:05", hosp: "常州市第一人民医院", type: "住院", total: "6101.50", cash: "3310.86", fund: "2790.64", account: "0.00", deduct: "0.00", other: "0.00", ratio: "45.7%" },
  { date: "2025-07-20 09:30:12", hosp: "南京大学医学院附属鼓楼医院", type: "门诊", total: "420.00", cash: "120.00", fund: "300.00", account: "0.00", deduct: "0.00", other: "0.00", ratio: "71.4%" },
  { date: "2025-06-15 14:22:45", hosp: "常州市第一人民医院", type: "药店", total: "158.50", cash: "0.00", fund: "0.00", account: "158.50", deduct: "0.00", other: "0.00", ratio: "0.0%" },
  { date: "2025-05-10 10:15:30", hosp: "常州市第一人民医院", type: "门诊", total: "850.00", cash: "250.00", fund: "600.00", account: "0.00", deduct: "0.00", other: "0.00", ratio: "70.6%" },
  { date: "2025-04-02 08:45:00", hosp: "南京大学医学院附属鼓楼医院", type: "住院", total: "12500.00", cash: "3500.00", fund: "9000.00", account: "0.00", deduct: "0.00", other: "0.00", ratio: "72.0%" },
];

const filteredReimbursementData = computed(() => {
  return reimbursementData.filter(item => item.type === selectedRecordType.value);
});

const paginatedReimbursementData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredReimbursementData.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredReimbursementData.value.length / itemsPerPage));

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const updateFinancialData = () => {
  // Logic to update financial data based on selectedCity and selectedYear
  console.log("Updating data for", selectedCity.value, selectedYear.value);
  // In a real app, this would fetch new data. Here we could randomize or filter.
};

const activeFamilyTab = ref(0);
const activeFlowTab = ref('全部');
const activeInsuranceType = ref<"职工" | "居民">("职工");

const accountFlows = [
  { date: '2026-06-25', type: '支出', desc: '配偶门诊统筹支付', target: '常州市第一人民医院·心内科', amount: '186.00', balance: '12,264.00' },
  { date: '2026-06-20', type: '划拨', desc: '个人账户资金划拨', target: '医保中心·年度注入', amount: '2,400.00', balance: '12,450.00' },
  { date: '2026-06-12', type: '支出', desc: '子女门诊购药', target: '常州德仁堂药店', amount: '85.00', balance: '10,050.00' },
  { date: '2026-06-05', type: '退款', desc: '门诊结算退费', target: '常州市第一人民医院', amount: '32.50', balance: '10,135.00' },
  { date: '2026-05-28', type: '支出', desc: '配偶检查费统筹支付', target: '南京鼓楼医院·超声科', amount: '140.00', balance: '10,102.50' },
  { date: '2026-05-15', type: '支出', desc: '父亲慢病用药', target: '常州万民药店', amount: '210.00', balance: '10,242.50' },
  { date: '2026-05-01', type: '划拨', desc: '个人账户资金划拨', target: '医保中心·月度注入', amount: '200.00', balance: '10,452.50' },
  { date: '2026-04-22', type: '支出', desc: '配偶门诊治疗费', target: '常州市第一人民医院·内分泌科', amount: '320.00', balance: '10,252.50' },
];

const recordTabs = [
  { id: "op", label: "门诊", icon: Stethoscope },
  { id: "ip", label: "住院", icon: Hospital },
  { id: "exam", label: "检查", icon: ClipboardCheck },
  { id: "lab", label: "检验", icon: Microscope },
  { id: "med", label: "药耗", icon: Pill },
];

const lifecycleTabs = [
  { id: "op", label: "门诊" },
  { id: "ip", label: "住院" },
  { id: "lab", label: "检验" },
  { id: "exam", label: "检查" },
  { id: "med", label: "药耗" },
  { id: "wd", label: "穿戴" },
] as const;

const viewTitle = computed(() => {
  switch (activeView.value) {
    case "overview": return "参保人画像";
    case "health": return "医保健康档案";
    case "finance": return "医保财务档案";
    case "info": return "医保信息档案";
    case "logout": return "退出登录";
    case "medintercept": return "用药实时拦截";
    case "rulesadapt": return "医保规则智能适配";
    default: return "";
  }
});

const handlePatientSearch = () => {
  if (searchPatientName.value && searchPatientId.value) {
    // TODO: implement search
  }
};

const showToast = ref(false);
const toastMessage = ref('');

const handleAction = (type: string, title: string, record?: any) => {
  if (type === 'toast') {
    toastMessage.value = title;
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 2000);
    return;
  }
  
  if (type === 'op' || type === 'ip_detail' || type === 'lab_detail' || type === 'exam_detail') {
    selectedRecordForDetail.value = record;
    showOutpatientDetail.value = true;
  } else if (type === 'dicom') {
    selectedRecordForDetail.value = record;
    showDicomViewer.value = true;
  } else {
    showDetail.value = { type, title };
  }
};

</script>

<template>
  <a-config-provider :theme="antdTheme">
  <!-- ════════════════════════════════════════════════════════════════════════ -->
  <!-- HIS 界面还原设计 — 首次进入系统展示的门诊医生站界面，后续可删除此区块 -->
  <!-- ════════════════════════════════════════════════════════════════════════ -->
  <div v-if="activeView === 'his'" class="flex flex-col h-screen w-screen" style="font-family: 'Microsoft YaHei', sans-serif; background: #f0f2f5; color: #333; overflow: hidden;">
    <!-- 顶层蓝色工具栏 -->
    <header style="background: #1e5494; color: #fff;" class="flex justify-between items-center px-4 h-10 shrink-0">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-1 font-bold text-sm">
          <i class="fas fa-hospital"></i>
          <span>门诊医生站</span>
        </div>
        <nav class="flex space-x-4 text-xs opacity-90">
          <div class="flex items-center space-x-1 cursor-pointer hover:opacity-100 hover:bg-white/20 px-2 py-0.5 rounded-sm transition"><i class="fas fa-user-friends"></i><span>转诊</span></div>
          <div class="flex items-center space-x-1 cursor-pointer hover:opacity-100 hover:bg-white/20 px-2 py-0.5 rounded-sm transition"><i class="fas fa-stethoscope"></i><span>首诊测压</span></div>
          <div class="flex items-center space-x-1 cursor-pointer hover:opacity-100 hover:bg-white/20 px-2 py-0.5 rounded-sm transition"><i class="fas fa-history"></i><span>历史处方</span></div>
          <div class="flex items-center space-x-1 cursor-pointer hover:opacity-100 hover:bg-white/20 px-2 py-0.5 rounded-sm transition"><i class="fas fa-file-medical"></i><span>入院单</span></div>
          <div class="relative" @mouseenter="showHisDropdown = true" @mouseleave="showHisDropdown = false">
            <div class="flex items-center space-x-1 cursor-pointer hover:opacity-100 hover:bg-white/20 px-2 py-0.5 rounded-sm transition"><i class="fas fa-th-large"></i><span>其他</span><i class="fas fa-caret-down text-[10px] ml-0.5"></i></div>
            <div v-if="showHisDropdown" class="absolute top-full left-0 pt-1 z-50">
            <div class="bg-white text-gray-700 rounded shadow-lg border border-gray-200 py-1 min-w-[200px]">
              <div class="px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-800 cursor-pointer whitespace-nowrap">医生工作量查血</div>
              <div class="px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-800 cursor-pointer whitespace-nowrap">门诊病人范围设置</div>
              <div class="px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-800 cursor-pointer whitespace-nowrap">报告卡管理</div>
              <div class="px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-800 cursor-pointer whitespace-nowrap" @click="showHisDropdown = false; activeView = 'his1'">个人医保云数据共享</div>
              <div class="px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-800 cursor-pointer whitespace-nowrap">卫生健康应用服务</div>
              <div class="px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-800 cursor-pointer whitespace-nowrap">应用市场</div>
            </div>
            </div>
          </div>
          <div class="flex items-center space-x-1 cursor-pointer hover:opacity-100 hover:bg-white/20 px-2 py-0.5 rounded-sm transition"><i class="fas fa-file-alt"></i><span>单据</span></div>
        </nav>
      </div>
      <div class="flex items-center space-x-4 text-xs">
        <div class="text-right whitespace-nowrap">测血压 · 专家</div>
        <div class="flex items-center space-x-1 border-l border-blue-400 pl-4">
          <i class="fas fa-user-circle text-lg"></i>
          <span>工程师</span>
          <i class="fas fa-comment-dots"></i>
        </div>
        <div class="flex space-x-3 text-sm ml-4">
          <i class="fas fa-cog cursor-pointer"></i>
          <i class="fas fa-lock cursor-pointer"></i>
          <i class="fas fa-user cursor-pointer"></i>
          <i class="fas fa-minus cursor-pointer"></i>
          <i class="fas fa-power-off cursor-pointer"></i>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧边栏：患者列表 -->
      <aside class="w-48 bg-white border-r border-gray-300 flex flex-col shrink-0">
        <div class="p-2 border-b border-gray-300 flex justify-between items-center bg-gray-50">
          <span class="text-xs font-bold text-blue-800">患者列表</span>
          <i class="fas fa-thumbtack text-gray-400 text-[10px]"></i>
        </div>
        <div class="p-2 border-b border-gray-300">
          <div class="flex">
            <select class="text-[11px] border border-gray-300 rounded px-1 py-0.5 flex-1 bg-white">
              <option>医保卡</option><option>身份证</option><option>就诊卡</option>
            </select>
            <button class="ml-1 bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded border border-gray-300">读卡</button>
          </div>
          <input class="mt-1 w-full text-[11px] border border-gray-300 rounded px-1 py-0.5" placeholder="姓名/卡号查询" />
        </div>
        <div class="flex text-[10px] border-b border-gray-300 bg-gray-50">
          <div class="flex-1 text-center py-1 text-blue-800 font-bold border-b-2 border-blue-800">候诊(<span class="text-red-500">5</span>)</div>
          <div class="flex-1 text-center py-1 text-gray-500">诊中(<span>2</span>)</div>
          <div class="flex-1 text-center py-1 text-gray-500">已诊(<span>8</span>)</div>
        </div>
        <!-- 患者列表项 -->
        <div class="flex-1 overflow-y-auto" style="scrollbar-width: thin;">
          <div class="px-2 py-1.5 border-b border-gray-100 cursor-pointer hover:bg-blue-50" style="background: #b9cceb;">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">1 陈志明</span><span class="text-[10px] text-gray-500">男 42岁</span></div>
            <div class="text-[10px] text-gray-500 mt-0.5">心内科 · 高血压</div>
          </div>
          <div class="px-2 py-1.5 border-b border-gray-100 cursor-pointer hover:bg-blue-50">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">2 王秀兰</span><span class="text-[10px] text-gray-500">女 65岁</span></div>
            <div class="text-[10px] text-gray-500 mt-0.5">内分泌 · 糖尿病</div>
          </div>
          <div class="px-2 py-1.5 border-b border-gray-100 cursor-pointer hover:bg-blue-50">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">3 张伟</span><span class="text-[10px] text-gray-500">男 55岁</span></div>
            <div class="text-[10px] text-gray-500 mt-0.5">神经内科 · 头痛</div>
          </div>
          <div class="px-2 py-1.5 border-b border-gray-100 cursor-pointer hover:bg-blue-50">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">4 李芳</span><span class="text-[10px] text-gray-500">女 38岁</span></div>
            <div class="text-[10px] text-gray-500 mt-0.5">呼吸科 · 咳嗽</div>
          </div>
          <div class="px-2 py-1.5 border-b border-gray-100 cursor-pointer hover:bg-blue-50">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">5 刘建国</span><span class="text-[10px] text-gray-500">男 70岁</span></div>
            <div class="text-[10px] text-gray-500 mt-0.5">骨科 · 腰痛</div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- 患者信息栏 -->
        <div class="bg-white border-b border-gray-300 px-4 py-1.5 flex items-center justify-between shrink-0">
          <div class="flex items-center space-x-4 text-xs">
            <span class="font-bold text-blue-800">陈志明</span>
            <span class="text-gray-500">男 · 42岁 · 医保</span>
            <span class="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px]">高血压3级</span>
            <span class="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-[10px]">过敏史: 青霉素</span>
          </div>
          <div class="flex items-center space-x-2 text-[10px]">
            <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-300">病历</button>
            <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-300">处方</button>
            <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-300">检查</button>
            <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-300">检验</button>
            <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-300">治疗</button>
          </div>
        </div>

        <!-- Tab 栏 -->
        <div class="bg-white border-b border-gray-300 flex text-xs shrink-0">
          <div class="px-4 py-2 text-blue-800 font-bold border-b-2 border-blue-800 cursor-pointer">主诉/现病史</div>
          <div class="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-800">既往史</div>
          <div class="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-800">体格检查</div>
          <div class="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-800">诊断</div>
          <div class="px-4 py-2 text-gray-500 cursor-pointer hover:text-blue-800">处置</div>
        </div>

        <!-- 编辑区 -->
        <div class="flex-1 bg-white p-4 overflow-y-auto" style="scrollbar-width: thin;">
          <div class="mb-3">
            <label class="text-xs font-bold text-gray-600 block mb-1">主诉</label>
            <div class="text-sm p-2 bg-gray-50 border border-gray-200 rounded min-h-[40px]">发现血压升高10年，伴头晕1周。</div>
          </div>
          <div class="mb-3">
            <label class="text-xs font-bold text-gray-600 block mb-1">现病史</label>
            <div class="text-sm p-2 bg-gray-50 border border-gray-200 rounded min-h-[60px]">患者10年前体检发现血压升高，最高160/100mmHg，平时服用苯磺酸氨氯地平片，血压控制在140/90mmHg左右。1周前无明显诱因出现头晕，呈持续性胀痛，休息后稍缓解。</div>
          </div>
          <div class="mb-3">
            <label class="text-xs font-bold text-gray-600 block mb-1">过敏史</label>
            <div class="text-sm p-2 bg-red-50 border border-red-200 rounded text-red-700">青霉素类 — 极度敏感</div>
          </div>
        </div>

        <!-- 底部处方表格 -->
        <div class="bg-white border-t border-gray-300 shrink-0" style="max-height: 200px; overflow-y: auto;">
          <table class="w-full text-[11px]">
            <thead>
              <tr class="bg-gray-100 border-b border-gray-300">
                <th class="py-1 px-2 text-left font-bold">药品名称</th>
                <th class="py-1 px-2 text-left font-bold">规格</th>
                <th class="py-1 px-2 text-left font-bold">用法</th>
                <th class="py-1 px-2 text-left font-bold">用量</th>
                <th class="py-1 px-2 text-left font-bold">频次</th>
                <th class="py-1 px-2 text-left font-bold">天数</th>
                <th class="py-1 px-2 text-left font-bold">数量</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-100">
                <td class="py-1 px-2">注射用阿莫西林钠</td>
                <td class="py-1 px-2">1.0g/支</td>
                <td class="py-1 px-2">静脉滴注</td>
                <td class="py-1 px-2">2.0g</td>
                <td class="py-1 px-2">bid</td>
                <td class="py-1 px-2">3天</td>
                <td class="py-1 px-2">12支</td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="py-1 px-2">苯磺酸氨氯地平片</td>
                <td class="py-1 px-2">5mg</td>
                <td class="py-1 px-2">口服</td>
                <td class="py-1 px-2">5mg</td>
                <td class="py-1 px-2">qd</td>
                <td class="py-1 px-2">14天</td>
                <td class="py-1 px-2">14片</td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="py-1 px-2">缬沙坦胶囊</td>
                <td class="py-1 px-2">80mg</td>
                <td class="py-1 px-2">口服</td>
                <td class="py-1 px-2">80mg</td>
                <td class="py-1 px-2">qd</td>
                <td class="py-1 px-2">14天</td>
                <td class="py-1 px-2">14粒</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
  <!-- HIS 界面还原设计 END — 以上为 HIS 门诊医生站模拟界面，后续可删除 -->
  <!-- HIS1 界面还原设计 — 个人医保云数据共享界面 -->
  <div v-else-if="activeView === 'his1'" class="flex flex-col h-screen w-screen bg-white">
    <header class="top-nav-bar">
      <div class="top-nav-header flex items-center shrink-0 h-full">
        <img src="/logo.png" class="h-12" alt="Logo" />
        <span class="top-nav-title">个人医保云数据共享</span>
      </div>
      <nav class="flex h-full items-center flex-1 ant-header-menu">
        <a class="ant-menu-item" :class="activeNavTab === 'imaging' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询</span></a>
        <a class="ant-menu-item" :class="activeNavTab === 'imaging-cross' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging-cross'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询(跨省)</span></a>
        <a class="ant-menu-item" :class="activeNavTab === 'inspection' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'inspection'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>检验查询</span></a>
        <a class="ant-menu-item" :class="activeNavTab === 'overview' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'overview'; activeView = 'overview'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>参保人画像</span></a>
      </nav>
      <div class="top-nav-user"><span class="font-normal">陈**明</span><span class="opacity-20">|</span><span>常州市第七人民医院</span><span class="text-[9px] opacity-60 select-none">▼</span></div>
    </header>
    <div class="flex-1 relative" style="background: url('/his1.png') top center / 100% 100% no-repeat;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 360px; height: 280px; cursor: pointer;" @click="activeView = 'his2'"></div>
    </div>
  </div>
  <!-- HIS1 界面还原设计 END -->
  <!-- HIS2 界面还原设计 — 授权确认界面 -->
  <div v-else-if="activeView === 'his2'" class="flex flex-col h-screen w-screen bg-white">
    <header class="top-nav-bar">
      <div class="top-nav-header flex items-center shrink-0 h-full">
        <img src="/logo.png" class="h-12" alt="Logo" />
        <span class="top-nav-title">个人医保云数据共享</span>
      </div>
      <nav class="flex h-full items-center flex-1 ant-header-menu">
        <a class="ant-menu-item" :class="activeNavTab === 'imaging' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询</span></a>
        <a class="ant-menu-item" :class="activeNavTab === 'imaging-cross' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging-cross'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询(跨省)</span></a>
        <a class="ant-menu-item" :class="activeNavTab === 'inspection' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'inspection'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>检验查询</span></a>
        <a class="ant-menu-item" :class="activeNavTab === 'overview' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'overview'; activeView = 'overview'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>参保人画像</span></a>
      </nav>
      <div class="top-nav-user"><span class="font-normal">陈**明</span><span class="opacity-20">|</span><span>常州市第七人民医院</span><span class="text-[9px] opacity-60 select-none">▼</span></div>
    </header>
    <div class="flex-1 relative" style="background: url('/his2.png') top center / 100% 100% no-repeat;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 360px; height: 280px; cursor: pointer;" @click="activeView = 'his3'"></div>
    </div>
  </div>
  <!-- HIS2 界面还原设计 END -->
  <!-- HIS3 界面还原设计 — 授权结果界面 -->
  <div v-else-if="activeView === 'his3'" class="flex flex-col h-screen w-screen bg-white">
    <header class="top-nav-bar">
      <div class="top-nav-header flex items-center shrink-0 h-full">
        <img src="/logo.png" class="h-12" alt="Logo" />
        <span class="top-nav-title">个人医保云数据共享</span>
      </div>
      <nav class="flex h-full items-center flex-1 ant-header-menu">
        <a class="ant-menu-item" :class="activeNavTab === 'imaging' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询</span></a>
        <a class="ant-menu-item" :class="activeNavTab === 'imaging-cross' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging-cross'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询(跨省)</span></a>
        <a class="ant-menu-item" :class="activeNavTab === 'inspection' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'inspection'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>检验查询</span></a>
        <a class="ant-menu-item" :class="activeNavTab === 'overview' ? 'ant-menu-item-selected' : ''" @click="activeNavTab = 'overview'; activeView = 'overview'"><i class="ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>参保人画像</span></a>
      </nav>
      <div class="top-nav-user"><span class="font-normal">陈**明</span><span class="opacity-20">|</span><span>常州市第七人民医院</span><span class="text-[9px] opacity-60 select-none">▼</span></div>
    </header>
    <div class="flex-1 overflow-hidden" style="background: url('/his3.png') top center / 100% 100% no-repeat;"></div>
  </div>
  <!-- HIS3 界面还原设计 END -->
  <div v-else-if="activeView === 'medintercept'" style="position: relative; width: 100vw; height: 100vh; background: url('/his.png') center / cover no-repeat;">
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4 pointer-events-none">
      <transition enter-active-class="animate__animated animate__fadeInRight" leave-active-class="animate__animated animate__fadeOutRight">
        <div v-if="showMedInterceptPopup" class="pointer-events-auto glass-card w-96 rounded-xl overflow-hidden border-red-200 alert-pulse">
          <div class="bg-red-500 p-3 text-white flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
              <span class="font-bold">用药安全实时拦截</span>
            </div>
            <button @click="showMedInterceptPopup = false" class="text-white hover:text-gray-200">✕</button>
          </div>
          <div class="p-4">
            <h3 class="text-red-700 font-bold mb-3 flex items-center text-sm">
              检测到 2 项高危用药风险：
            </h3>

            <div class="mb-3 bg-red-50 p-3 rounded-lg border border-red-100">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">风险 1：严重过敏</span>
              </div>
              <p class="text-sm text-red-800">拟开具：<span class="font-bold">注射用阿莫西林钠</span></p>
              <p class="text-xs text-red-600 mt-1 font-medium italic">风险：患者对青霉素类药物极度敏感</p>
            </div>

            <div class="mb-4 bg-orange-50 p-3 rounded-lg border border-orange-100">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">风险 2：重复用药</span>
              </div>
              <p class="text-sm text-orange-800">拟开具：<span class="font-bold">阿司匹林肠溶片</span></p>
              <p class="text-xs text-orange-600 mt-1 font-medium italic">风险：与正在服用的抗凝类药物存在配伍禁忌</p>
            </div>

            <div class="bg-blue-50 p-3 rounded border border-blue-100 shadow-inner">
              <div class="flex items-center text-blue-700 text-xs font-bold mb-2">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                个人医保云实时分析
              </div>
              <ul class="text-[11px] text-blue-800 space-y-1.5 leading-tight">
                <li class="flex items-start">
                  <span class="mr-1">•</span>
                  <span>检索画像发现：患者 2022-05 在 <span class="font-bold">省中医院</span> 有明确青霉素休克史。</span>
                </li>
                <li class="flex items-start">
                  <span class="mr-1">•</span>
                  <span>处方同步显示：患者 3 天前在 <span class="font-bold">市一院</span> 已开具【氯吡格雷】，本次开药将导致双抗风险。</span>
                </li>
              </ul>
            </div>

            <div class="mt-4 flex space-x-2">
              <button @click="showMedInterceptPopup = false" class="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-md">删除医嘱</button>
              <button class="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition">坚持开具(需理由)</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
  <div v-else-if="activeView === 'rulesadapt'" style="position: relative; width: 100vw; height: 100vh; background: url('/his.png') center / cover no-repeat;">
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4 pointer-events-none">
      <transition enter-active-class="animate__animated animate__fadeInRight" leave-active-class="animate__animated animate__fadeOutRight">
        <div v-if="showRulesAdaptPopup" class="pointer-events-auto glass-card w-96 rounded-xl overflow-hidden border-blue-200">
          <div class="bg-blue-600 p-3 text-white flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <span class="font-bold">医保规则智能适配</span>
            </div>
            <button @click="showRulesAdaptPopup = false" class="text-white">✕</button>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <p class="text-gray-800 font-bold text-sm">【头部MRI平扫】报销限制</p>
              <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">预警</span>
            </div>
            <p class="text-xs text-gray-600 mb-3 leading-relaxed">该项目在当前医保待遇【门诊统筹】下需满足“偏头痛史”或“外伤史”方可报销。</p>
            
            <div class="bg-green-50 p-3 rounded border border-green-100 mb-3">
              <div class="flex items-center text-green-700 text-xs font-bold mb-1">
                个人医保云实时分析
              </div>
              <p class="text-xs text-green-800 font-medium">系统调取个人医保云显示：患者历史病历中包含“慢性偏头痛”诊断（2023-11），符合报销规则。建议补充临床诊断以通过机审。</p>
            </div>

            <div class="flex justify-between items-center text-xs text-gray-500 py-2 border-t border-dashed">
              <span>预估报销：85%</span>
              <span>预计个人负担：<span class="text-blue-600 font-bold">¥42.50</span></span>
            </div>
            <button @click="showRulesAdaptPopup = false" class="w-full mt-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-200 hover:bg-blue-100 transition">补充诊断并开具</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
  <div v-else-if="activeView === 'logout'" style="width: 100vw; height: 100vh; background: url('/his.png') center / cover no-repeat;"></div>
  
  <!-- AI辅助诊断页面 -->
  <div v-else-if="activeView === 'ai-diagnosis'" class="flex flex-col h-screen w-screen bg-white overflow-hidden">
    <!-- 顶部导航栏 - 与主页面保持一致 -->
    <header class="top-nav-bar">
      <div class="top-nav-header flex items-center shrink-0 h-full">
        <img src="/logo.png" class="h-12" alt="Logo" />
        <span class="top-nav-title">个人医保云数据共享</span>
        <span class="top-nav-sep"></span>
        <span class="top-nav-subtitle">AI辅助诊断</span>
      </div>
      <nav class="flex h-full items-center ant-header-menu">
        <a class="ant-menu-item" :class="isActiveView('overview') ? 'ant-menu-item-selected' : ''" @click="setActiveView('overview')"><i class="ant-menu-item-icon"><UserCircle :size="14" /></i><span>参保人画像</span></a>
        <a class="ant-menu-item" :class="isActiveView('health') ? 'ant-menu-item-selected' : ''" @click="setActiveView('health')"><i class="ant-menu-item-icon"><Activity :size="14" /></i><span>医保健康档案</span></a>
        <a class="ant-menu-item" :class="isActiveView('finance') ? 'ant-menu-item-selected' : ''" @click="setActiveView('finance')"><i class="ant-menu-item-icon"><CreditCard :size="14" /></i><span>医保财务档案</span></a>
        <a class="ant-menu-item" :class="isActiveView('info') ? 'ant-menu-item-selected' : ''" @click="setActiveView('info')"><i class="ant-menu-item-icon"><Info :size="14" /></i><span>医保信息档案</span></a>
      </nav>
      <a-dropdown trigger="click">
        <div class="top-nav-user"><span class="font-normal">张兮兮</span><span class="opacity-20">|</span><span>常州市第七人民医院</span><span class="text-[9px] opacity-60 select-none">▼</span></div>
        <template #overlay>
          <a-menu @click="({ key }) => { if (key === 'medintercept') { setActiveView('medintercept'); showMedInterceptPopup = true; showRulesAdaptPopup = false } else if (key === 'rulesadapt') { setActiveView('rulesadapt'); showRulesAdaptPopup = true; showMedInterceptPopup = false } }">
            <a-menu-item key="medintercept">用药实时拦截</a-menu-item>
            <a-menu-item key="rulesadapt">医保规则智能适配</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </header>

    <!-- 功能按钮栏 -->
    <div style="padding: 12px 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 12px;">
      <button class="px-4 py-2 bg-blue-600 text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" style="color: #fff">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        新增病例
      </button>
      <button class="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        导入病历
      </button>
      <button class="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        AI辅助诊断
      </button>
      <div class="flex-1"></div>
      <div class="flex items-center gap-2">
        <select class="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>全部状态</option>
          <option>待诊断</option>
          <option>诊断中</option>
          <option>已完成</option>
        </select>
        <select class="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>全部科室</option>
          <option>内科</option>
          <option>外科</option>
          <option>急诊科</option>
        </select>
        <button class="px-4 py-2 bg-blue-600 text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" style="color: #fff">
          查询
        </button>
        <button class="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          重置
        </button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div style="flex: 1; padding: 20px; overflow-y: auto; background: #f1f5f9;">
      <!-- AI诊断结果列表标题 -->
      <div style="margin-bottom: 16px;">
        <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          AI诊断结果列表
        </h3>
      </div>

      <!-- 表格 -->
      <div style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">序号</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">诊断状态</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">诊断类型</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">AI诊断时间</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">姓名</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">身份证号</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">性别</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">年龄</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">就诊类型</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">诊断科室</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">影像评分</th>
              <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b;">任务状态</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">1</td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span>
              </td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">CT肺结节AI筛查</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-15 10:23:15</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">陈志明</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3204**********1263</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">男</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">42</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">门诊</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">放射科</td>
              <td style="padding: 12px 16px;">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-purple-600">89.5</span>
                  <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2</td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-[11px] font-medium rounded-full">诊断中</span>
              </td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">心电图AI智能分析</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-15 09:45:22</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">王小红</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3205**********8741</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">女</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">35</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">门诊</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">心内科</td>
              <td style="padding: 12px 16px;">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-purple-600">82.3</span>
                  <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-[11px] font-medium rounded-full">进行中</span>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">3</td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span>
              </td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">病理切片AI筛查</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-15 08:30:12</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">李明华</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3206**********5628</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">男</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">58</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">住院</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">病理科</td>
              <td style="padding: 12px 16px;">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-purple-600">94.1</span>
                  <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">4</td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span>
              </td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">临床决策支持</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-14 16:22:33</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">张丽华</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3207**********9834</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">女</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">62</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">住院</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">内科</td>
              <td style="padding: 12px 16px;">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-purple-600">87.8</span>
                  <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">5</td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-amber-100 text-amber-700 text-[11px] font-medium rounded-full">待审核</span>
              </td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">用药风险AI评估</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-14 14:15:47</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">刘海波</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3208**********6721</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">男</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">47</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">门诊</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">药剂科</td>
              <td style="padding: 12px 16px;">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-purple-600">91.2</span>
                  <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-amber-100 text-amber-700 text-[11px] font-medium rounded-full">待审核</span>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">6</td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-[11px] font-medium rounded-full">诊断中</span>
              </td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">慢病风险预测</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-14 11:05:30</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">赵云龙</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3209**********3451</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">男</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">56</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">体检</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">内分泌科</td>
              <td style="padding: 12px 16px;">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-purple-600">76.4</span>
                  <span style="font-size: 10px; color: #94a3b8;">—</span>
                </div>
              </td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-[11px] font-medium rounded-full">进行中</span>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">7</td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span>
              </td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">检验结果智能解读</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-13 09:20:18</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">孙晓芬</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3210**********7294</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">女</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">51</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">门诊</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">检验科</td>
              <td style="padding: 12px 16px;">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-purple-600">95.8</span>
                  <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">8</td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-amber-100 text-amber-700 text-[11px] font-medium rounded-full">待审核</span>
              </td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">手术风险评估</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-13 15:42:05</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">周国强</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3211**********5083</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">男</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">68</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">住院</td>
              <td style="padding: 12px 16px; font-size: 12px; color: #334155;">普外科</td>
              <td style="padding: 12px 16px;">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-purple-600">73.6</span>
                  <span style="font-size: 10px; color: #f59e0b;">⚠</span>
                </div>
              </td>
              <td style="padding: 12px 16px;">
                <span class="px-2 py-1 bg-amber-100 text-amber-700 text-[11px] font-medium rounded-full">待审核</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 分页 -->
        <div style="padding: 16px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: flex-end; gap: 12px;">
          <span class="text-xs text-slate-500">显示 1-5 条，共 128 条记录</span>
          <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
            上一页
          </button>
          <button class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">1</button>
          <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">2</button>
          <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">3</button>
          <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">...</button>
          <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">26</button>
          <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="layout">
    <!-- ════ Top Navigation ════ -->
    <header class="top-nav-bar">
      <div class="top-nav-header flex items-center shrink-0 h-full">
        <img src="/logo.png" class="h-12" alt="Logo" />
        <span class="top-nav-title">个人医保云数据共享</span>
        <span class="top-nav-sep"></span>
        <span class="top-nav-subtitle">参保人全息视图</span>
      </div>
      <nav class="flex h-full items-center ant-header-menu">
        <a class="ant-menu-item" :class="activeView === 'overview' ? 'ant-menu-item-selected' : ''" @click="activeView = 'overview'"><i class="ant-menu-item-icon"><UserCircle :size="14" /></i><span>参保人画像</span></a>
        <a class="ant-menu-item" :class="activeView === 'health' ? 'ant-menu-item-selected' : ''" @click="activeView = 'health'"><i class="ant-menu-item-icon"><Activity :size="14" /></i><span>医保健康档案</span></a>
        <a class="ant-menu-item" :class="activeView === 'finance' ? 'ant-menu-item-selected' : ''" @click="activeView = 'finance'"><i class="ant-menu-item-icon"><CreditCard :size="14" /></i><span>医保财务档案</span></a>
        <a class="ant-menu-item" :class="activeView === 'info' ? 'ant-menu-item-selected' : ''" @click="activeView = 'info'"><i class="ant-menu-item-icon"><Info :size="14" /></i><span>医保信息档案</span></a>
      </nav>
      <div class="flex-1"></div>
      <div class="flex items-center gap-1.5 mr-3">
        <input v-model="searchPatientName" type="text" placeholder="患者姓名" class="border border-slate-200 rounded-xl px-3 py-1.5 text-xs w-24 outline-none focus:border-blue-400 transition-colors" />
        <input v-model="searchPatientId" type="text" placeholder="证件号码" class="border border-slate-200 rounded-xl px-3 py-1.5 text-xs w-36 outline-none focus:border-blue-400 transition-colors" />
        <button @click="handlePatientSearch" class="bg-blue-600 text-xs px-3 py-1.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap font-medium" style="color: #fff;">
          <Search :size="12" /> 查询
        </button>
      </div>
      <a-dropdown trigger="click">
        <div class="top-nav-user"><span class="font-normal">陈**明</span><span class="opacity-20">|</span><span>常州市第七人民医院</span><span class="text-[9px] opacity-60 select-none">▼</span></div>
        <template #overlay>
          <a-menu @click="({ key }) => { if (key === 'medintercept') { activeView = 'medintercept'; showMedInterceptPopup = true; showRulesAdaptPopup = false } else if (key === 'rulesadapt') { activeView = 'rulesadapt'; showRulesAdaptPopup = true; showMedInterceptPopup = false } }">
            <a-menu-item key="medintercept">用药实时拦截</a-menu-item>
            <a-menu-item key="rulesadapt">医保规则智能适配</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </header>

    <!-- ════ Main ════ -->
    <main class="main">
      <div class="main-container">

        <!-- Content -->
        <div :class="['content', activeView === 'overview' ? 'overflow-hidden flex flex-col' : '']" style="height: calc(100vh - 64px);">
          <!-- ── Page Header ── -->
          <div class="page-header">
            <div class="ph-breadcrumb">
              首页 / {{ viewTitle }}
            </div>
          </div>

          <div :class="['content-inner', activeView === 'overview' ? 'flex-1 overflow-hidden' : '']">
            <!-- Overview View (New 3-Column Layout) -->
            <div v-if="activeView === 'overview'" class="v on flex-layout flex-1 flex gap-4 overflow-hidden">
              <!-- Left Column: Profile + Insurance -->
              <aside class="w-[320px] flex flex-col shrink-0">
                  <!-- Profile Card -->
                  <div class="standard-card p-5 relative overflow-y-auto custom-scrollbar flex-1 flex flex-col">
                    <p class="absolute top-5 right-5 text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      P88001235
                    </p>
                    
                    <div class="flex gap-4 mb-5">
                      <div class="relative w-14 h-14 rounded-full bg-blue-50 border border-blue-100 p-1 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                        <UserCircle :size="32" :stroke-width="1.5" />
                      </div>
                      <div class="flex flex-col justify-center h-14">
                        <h2 class="text-xl font-bold text-slate-900 tracking-tight">{{ selectedPatient.name }}</h2>
                        <span class="text-xs text-slate-500 font-medium">{{ selectedPatient.gender }} · {{ selectedPatient.age }}岁</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-4 gap-1 mb-5">
                      <div class="flex flex-col items-center justify-center gap-0.5 p-1.5 rounded-lg bg-gradient-to-b from-amber-50 to-white border border-amber-100 shadow-sm group hover:shadow-md transition-all cursor-default">
                        <div class="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform shadow-inner">
                          <ClipboardCheck :size="12" />
                        </div>
                        <span class="text-[8px] font-bold text-slate-700">门慢特病</span>
                        <span class="text-[7px] text-slate-400 leading-none">门诊慢特病备案</span>
                      </div>
                      <div class="flex flex-col items-center justify-center gap-0.5 p-1.5 rounded-lg bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 shadow-sm group hover:shadow-md transition-all cursor-default">
                        <div class="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-inner">
                          <ShieldCheck :size="12" />
                        </div>
                        <span class="text-[8px] font-bold text-slate-700">信用就医</span>
                        <span class="text-[7px] text-slate-400 leading-none">信用就医白名单</span>
                      </div>
                      <div class="flex flex-col items-center justify-center gap-0.5 p-1.5 rounded-lg bg-gradient-to-b from-blue-50 to-white border border-blue-100 shadow-sm group hover:shadow-md transition-all cursor-default">
                        <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-inner">
                          <Plane :size="12" />
                        </div>
                        <span class="text-[8px] font-bold text-slate-700">异地就医</span>
                        <span class="text-[7px] text-slate-400 leading-none">备案地：上海</span>
                      </div>
                      <div class="flex flex-col items-center justify-center gap-0.5 p-1.5 rounded-lg bg-gradient-to-b from-purple-50 to-white border border-purple-100 shadow-sm group hover:shadow-md transition-all cursor-default">
                        <div class="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shadow-inner">
                          <UserCheck :size="12" />
                        </div>
                        <span class="text-[8px] font-bold text-slate-700">签约医生</span>
                        <span class="text-[7px] text-slate-400 leading-none">李华 (家医)</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-1 mb-1.5">
                      <div class="bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400 rounded-lg py-1.5 px-2.5 shadow-md hover:scale-[1.02] transition-all relative overflow-hidden group">
                        <p class="text-[10px] text-blue-100 font-medium flex items-center gap-1 mb-0.5 relative z-10">
                          <CircleDot :size="5" class="text-blue-200" />
                          个人账户余额
                        </p>
                        <p class="flex items-baseline gap-0.5 font-bold font-mono leading-none text-white relative z-10"><span class="text-base">5,240</span><span class="text-blue-100/80 text-[9px]">.50</span></p>
                      </div>
                      <div class="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-lg py-1.5 px-2.5 shadow-md hover:scale-[1.02] transition-all relative overflow-hidden group">
                        <p class="text-[10px] text-slate-300 font-medium flex items-center gap-1 mb-0.5 relative z-10">
                          <Target :size="5" class="text-slate-400" />
                          本年统筹支付
                        </p>
                        <p class="flex items-baseline gap-0.5 font-bold font-mono leading-none text-white relative z-10"><span class="text-base">1,850</span><span class="text-slate-400 text-[9px]">.00</span></p>
                      </div>
                    </div>

                    <!-- Family Mutual Aid Account -->
                    <div class="pt-4 border-t border-slate-100 mt-3 pb-2">
                      <div class="flex items-center gap-2 mb-3">
                        <Users :size="13" class="text-blue-600" />
                        <span class="text-[11px] font-bold text-blue-600 tracking-widest uppercase">家庭共济账户</span>
                      </div>
                      <div class="flex items-center justify-between px-1">
                        <div class="flex -space-x-2">
                          <div class="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-blue-600 shadow-sm relative z-30">本</div>
                          <div class="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-500 shadow-sm relative z-20">妻</div>
                          <div class="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-500 shadow-sm relative z-10">子</div>
                        </div>
                        <div class="text-right">
                          <p class="text-[9px] text-slate-400 font-bold mb-0.5">家庭账户余额</p>
                          <p class="text-base font-bold font-mono text-slate-900 leading-none">
                            <span class="text-[10px] mr-0.5 text-slate-500 font-normal">¥</span>12,450<span class="text-[10px] text-slate-400">.00</span>
                          </p>
                        </div>
                      </div>
                      <div class="mt-3 space-y-2">
                        <div class="px-2.5 py-2 bg-amber-50 rounded-lg space-y-2 border border-amber-200">
                          <div class="text-[10px] font-bold text-amber-700 flex items-center gap-1"><Cpu :size="11" /> 智能支付评估</div>
                          <div class="space-y-1.5">
                            <div class="flex items-center justify-between">
                              <span class="text-[9px] text-amber-600">共济使用率</span>
                              <span class="text-[9px] font-bold text-amber-700">34%<span class="text-amber-500 font-normal"> / 已用 ¥4,230</span></span>
                            </div>
                            <div class="w-full h-1 bg-amber-200 rounded-full overflow-hidden">
                              <div class="h-full bg-amber-500 rounded-full" style="width: 34%;"></div>
                            </div>
                            <div class="flex items-center justify-between mt-1">
                              <span class="text-[9px] text-amber-600">本月预估支出</span>
                              <span class="text-[9px] font-bold text-amber-700">¥800-1,200</span>
                            </div>
                            <div class="flex items-center justify-between">
                              <span class="text-[9px] text-amber-600">慢病用药覆盖</span>
                              <span class="text-[9px] font-bold text-green-600">可覆盖</span>
                            </div>
                          </div>
                        </div>
                        <a-button
                          type="primary"
                          block
                          class="rounded-xl h-10 text-xs font-bold shadow-sm"
                          @click="showAccountFlowModal = true"
                        >
                          查看家庭账户明细
                        </a-button>
                      </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100 mt-3 pb-1">
                      <div class="flex items-center gap-2 mb-3">
                        <Tags :size="13" class="text-blue-600" />
                        <span class="text-[11px] font-bold text-blue-600 tracking-widest uppercase">标签画像</span>
                      </div>
                      <div class="px-0.5 space-y-4">
                        <!-- 智能标签（智能体打标） -->
                        <div>
                          <p class="text-[11px] text-slate-700 font-semibold tracking-widest uppercase mb-1.5">智能标签 · AI打标</p>
                          <div class="flex flex-wrap gap-1.5">
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #EFF6FF; color: #2563EB;">高依从性</span>
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #FEFCE8; color: #CA8A04;">复诊规律</span>
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #F0FDF4; color: #16A34A;">健康素养良好</span>
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #FEF2F2; color: #DC2626;">用药风险·中</span>
                          </div>
                        </div>
                        <!-- 既往史 -->
                        <div>
                          <p class="text-[11px] text-slate-700 font-semibold tracking-widest uppercase mb-1.5">既往史</p>
                          <div class="flex flex-wrap gap-1.5">
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #FFF7ED; color: #EA580C;">家族史 · 高血压家族史</span>
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #FEF2F2; color: #DC2626;">过敏史 · 青霉素过敏</span>
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #F8FAFC; color: #64748B;">手术史 · 结肠息肉切除术</span>
                          </div>
                        </div>
                        <!-- 疾病标签 -->
                        <div>
                          <p class="text-[11px] text-slate-700 font-semibold tracking-widest uppercase mb-1.5">疾病标签</p>
                          <div class="flex flex-wrap gap-1.5">
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #FEF2F2; color: #DC2626;">冠心病</span>
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #FFF7ED; color: #EA580C;">高血压3级</span>
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #FEFCE8; color: #CA8A04;">2型糖尿病</span>
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #F0FDF4; color: #16A34A;">高脂血症</span>
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #F8FAFC; color: #64748B;">腰椎间盘突出</span>
                          </div>
                        </div>
                        <!-- 风险分层 -->
                        <div>
                          <p class="text-[11px] text-slate-700 font-semibold tracking-widest uppercase mb-1.5">风险分层</p>
                          <div class="flex flex-wrap gap-1.5">
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #FEF2F2; color: #DC2626;">心血管：极高危</span>
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #FFF7ED; color: #EA580C;">脑卒中：中危</span>
                            <span class="text-[10px] px-2.5 py-1 rounded-full font-bold" style="background: #F0FDF4; color: #16A34A;">肾脏：低危</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex-1 min-h-0"></div>
                  </div>
              </aside>

              <!-- Center Column: Visualization + AI -->
              <section class="flex-1 flex flex-col gap-4 overflow-hidden relative">
                  <div class="flex-1 min-h-0 relative standard-card !bg-white/80 overflow-hidden group">
                    <div class="w-full h-full flex items-center justify-center">
                      <div class="relative w-full h-full flex items-center justify-center p-3">
                        <BodyAnnotation body-image-src="/body.png" :buttons="portraitButtons" @button-click="onPortraitButtonClick" />
                      </div>
                    </div>

                    <div class="absolute top-4 left-4 z-10 flex flex-col gap-4">
                      <!-- Real-time Metrics -->
                      <div class="bg-white/80 backdrop-blur-md border border-slate-200 rounded-lg p-3 shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition-all" @click="showMetricDetailModal = true">
                        <h3 class="text-[10px] font-bold text-blue-700 uppercase tracking-widest" style="margin-bottom: 12px;">健康体征数据</h3>
                        <div class="flex items-start justify-between gap-1">
                          <div class="flex flex-col items-center gap-0.5 flex-1">
                            <HeartPulse :size="14" class="text-red-400" />
                            <span class="text-slate-500 text-[8px]">血压</span>
                            <span class="font-mono font-bold text-[11px] text-slate-800">128/82</span>
                            <span class="text-[7px] text-slate-400">mmHg</span>
                          </div>
                          <span class="w-px h-4 bg-slate-100 self-center"></span>
                          <div class="flex flex-col items-center gap-0.5 flex-1">
                            <Droplets :size="14" class="text-green-400" />
                            <span class="text-slate-500 text-[8px]">血糖</span>
                            <span class="font-mono font-bold text-[11px] text-slate-800">5.8</span>
                            <span class="text-[7px] text-slate-400">mmol/L</span>
                          </div>
                          <span class="w-px h-4 bg-slate-100 self-center"></span>
                          <div class="flex flex-col items-center gap-0.5 flex-1">
                            <FlaskConical :size="14" class="text-yellow-400" />
                            <span class="text-slate-500 text-[8px]">血脂</span>
                            <span class="font-mono font-bold text-[11px] text-slate-800">4.2</span>
                            <span class="text-[7px] text-slate-400">mmol/L</span>
                          </div>
                        </div>
                      </div>

                      <!-- 影像AI辅助分析 -->
                      <div class="w-full bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-2.5 shadow-sm cursor-pointer hover:border-violet-400 hover:shadow-md transition-all" @click="openAIAssistant">
                        <div class="flex items-center gap-2 mb-1.5">
                          <div class="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center">
                            <svg class="w-3 h-3 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          </div>
                          <span class="text-[10px] font-bold text-violet-700">影像AI辅助分析</span>
                          <span class="text-[8px] font-bold text-violet-500 px-1.5 py-0.5 rounded-full bg-violet-100">新</span>
                        </div>
                        <div class="text-[9px] text-violet-600 font-medium mb-1.5">胸部CT（06-10）· 发现2项可疑异常</div>
                        <div class="flex items-center gap-1 text-[8px] text-violet-400">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          <span>影像一扫多筛智能体</span>
                          <span class="mx-1">·</span>
                          <span>刚刚</span>
                        </div>
                      </div>

                      <!-- 体征数据AI辅助分析 -->
                      <div class="w-full bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-lg p-2.5 shadow-sm cursor-pointer hover:border-cyan-400 hover:shadow-md transition-all" @click="openAIAssistant">
                        <div class="flex items-center gap-2 mb-1.5">
                          <div class="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center">
                            <svg class="w-3 h-3 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                          </div>
                          <span class="text-[10px] font-bold text-cyan-700">体征数据AI辅助分析</span>
                          <span class="text-[8px] font-bold text-cyan-500 px-1.5 py-0.5 rounded-full bg-cyan-100">4项异常</span>
                        </div>
                        <div class="text-[9px] text-cyan-600 font-medium mb-1.5">心率过快112次/分 · 血压偏高162/95mmHg</div>
                        <div class="flex items-center gap-1 text-[8px] text-cyan-400">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          <span>穿戴健康监测智能体</span>
                          <span class="mx-1">·</span>
                          <span>2小时前</span>
                        </div>
                      </div>

                      <!-- 智能用药辅助分析 -->
                      <div class="w-full bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-2.5 shadow-sm cursor-pointer hover:border-orange-400 hover:shadow-md transition-all" @click="openAIAssistant">
                        <div class="flex items-center gap-2 mb-1.5">
                          <div class="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                            <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                          </div>
                          <span class="text-[10px] font-bold text-orange-700">智能用药辅助分析</span>
                          <span class="text-[8px] font-bold text-orange-500 px-1.5 py-0.5 rounded-full bg-orange-100">3项风险</span>
                        </div>
                        <div class="text-[9px] text-orange-600 font-medium mb-1.5">阿司匹林+华法林出血风险 · 建议调整</div>
                        <div class="flex items-center gap-1 text-[8px] text-orange-400">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          <span>临床用药安全智能体</span>
                          <span class="mx-1">·</span>
                          <span>今日</span>
                        </div>
                      </div>

                      <!-- 患者健康预警已隐藏，后续可能恢复 -->
                    </div>

                    <div class="absolute bottom-2 left-4 right-4 z-10">
                      <div class="flex items-center gap-x-3" style="font-size: 10px;">
                        <div class="text-slate-500 font-medium shrink-0">
                          归集自以下系统，实时清洗入档：
                        </div>
                        <div class="chips flex-1 min-w-0">
                          <div class="chip"><div class="cdot" style="background: var(--blue)"></div>HIS 门急诊</div>
                          <div class="chip"><div class="cdot" style="background: var(--green)"></div>PACS 影像</div>
                          <div class="chip"><div class="cdot" style="background: var(--amber)"></div>LIS 检验</div>
                          <div class="chip"><div class="cdot" style="background: var(--purple)"></div>EMR 病历</div>
                          <div class="chip"><div class="cdot" style="background: #EC4899"></div>公卫档案</div>
                          <div class="chip"><div class="cdot" style="background: var(--cyan)"></div>可穿戴设备</div>
                          <div class="chip"><div class="cdot" style="background: #6B7280"></div>药店购药</div>
                        </div>
                      </div>
                    </div>
                  </div>

                <!-- 智能服务快捷入口 -->
                <div class="standard-card p-3 bg-white">
                  <div class="flex items-center mb-2">
                    <h3 class="text-[13px] font-bold text-[#2563eb] uppercase tracking-widest flex items-center gap-2">
                      <Cpu class="w-4 h-4" />
                      智能服务快捷入口
                    </h3>
                  </div>

                  <div class="flex gap-2">
                    <!-- 左侧：历史病历快读（蓝色背景） -->
                    <div class="w-80 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-3 shadow-md flex flex-col cursor-pointer hover:shadow-lg transition-all" @click="setActiveView('ai-diagnosis')">
                      <div class="flex items-center gap-1.5 mb-3">
                        <span class="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center text-white text-[9px] font-bold">AI</span>
                        <span class="text-[11px] font-bold text-white">历史病历快读</span>
                      </div>
                      <div class="space-y-2 flex-1">
                        <div class="bg-white/15 rounded-lg px-2.5 py-1.5">
                          <span class="text-[8px] text-blue-100">近期诊断</span>
                          <div class="flex items-center gap-2 mt-0.5">
                            <span class="text-[12px] font-bold text-white">高血压II级</span>
                            <span class="text-[8px] px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">慢病</span>
                          </div>
                        </div>
                        <div class="bg-white/15 rounded-lg px-2.5 py-1.5">
                          <span class="text-[8px] text-blue-100">用药情况</span>
                          <div class="flex flex-wrap gap-1 mt-0.5">
                            <span class="text-[9px] px-2 py-0.5 rounded bg-white/20 text-white">阿司匹林</span>
                            <span class="text-[9px] px-2 py-0.5 rounded bg-white/20 text-white">阿托伐他汀</span>
                            <span class="text-[9px] px-2 py-0.5 rounded bg-white/20 text-white">缬沙坦</span>
                          </div>
                        </div>
                        <div class="bg-white/15 rounded-lg px-2.5 py-1.5">
                          <span class="text-[8px] text-blue-100">就诊频次</span>
                          <div class="text-[10px] text-white mt-0.5">门诊 <span class="font-bold">8次</span> · 住院 <span class="font-bold">2次</span></div>
                        </div>
                        <div class="bg-white/15 rounded-lg px-2.5 py-1.5">
                          <span class="text-[8px] text-blue-100">检查检验</span>
                          <div class="text-[10px] text-white mt-0.5">CT×2 | 血常规×4 | 血脂×3</div>
                        </div>
                      </div>
                    </div>

                    <!-- 右侧：服务卡片 -->
                    <div class="flex-1 grid grid-cols-5 grid-rows-2 gap-2">
                      <div class="col-span-3 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-3 cursor-pointer hover:shadow-sm transition-all" @click="setActiveView('ai-diagnosis')">
                        <div class="flex items-center gap-2 mb-2">
                          <div class="w-5 h-5 rounded-md bg-red-100 flex items-center justify-center shrink-0">
                            <svg class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.66 1.732-3L13.732 4c-.77-1.34-2.694-1.34-3.464 0L3.34 16c-.77 1.34.192 3 1.732 3z"></path></svg>
                          </div>
                          <span class="text-sm font-bold text-slate-700">预警冲突</span>
                          <span class="text-[10px] font-bold text-red-600 px-1.5 py-0.5 rounded-full bg-red-200 ml-auto">5</span>
                        </div>
                        <div class="space-y-1">
                          <div v-for="(item, i) in warningItems.slice(0, 3)" :key="i" class="flex items-start gap-2">
                            <span class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" :class="item.level === 'red' ? 'bg-red-400' : 'bg-amber-400'"></span>
                            <div>
                              <span class="text-xs font-bold" :class="item.level === 'red' ? 'text-red-600' : 'text-amber-600'">{{ item.label }}</span>
                              <span class="text-[11px] text-slate-500 ml-1.5">{{ item.text }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-xl p-3 cursor-pointer hover:shadow-sm transition-all flex items-center gap-3 relative overflow-hidden group" @click="setActiveView('ai-diagnosis')">
                        <div class="w-1/4 aspect-square rounded-lg bg-cyan-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <svg class="w-1/2 h-1/2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <span class="text-sm font-bold text-slate-700">影像AI</span>
                        <svg class="w-12 h-12 text-cyan-300/15 absolute -right-3 -bottom-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <div class="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-3 cursor-pointer hover:shadow-sm transition-all flex items-center gap-3 relative overflow-hidden group" @click="setActiveView('ai-diagnosis')">
                        <div class="w-1/4 aspect-square rounded-lg bg-amber-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <svg class="w-1/2 h-1/2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <span class="text-sm font-bold text-slate-700">临床路径</span>
                        <svg class="w-12 h-12 text-amber-300/15 absolute -right-3 -bottom-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </div>
                      <div class="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-3 cursor-pointer hover:shadow-sm transition-all flex items-center gap-3 relative overflow-hidden group" @click="setActiveView('ai-diagnosis')">
                        <div class="w-1/4 aspect-square rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <svg class="w-1/2 h-1/2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <span class="text-sm font-bold text-slate-700">远程诊断</span>
                        <svg class="w-12 h-12 text-indigo-300/15 absolute -right-3 -bottom-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      </div>
                      <div class="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl p-3 cursor-pointer hover:shadow-sm transition-all flex items-center gap-3 relative overflow-hidden group" @click="setActiveView('ai-diagnosis')">
                        <div class="w-1/4 aspect-square rounded-lg bg-teal-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <svg class="w-1/2 h-1/2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                        </div>
                        <span class="text-sm font-bold text-slate-700">随访计划</span>
                        <svg class="w-12 h-12 text-teal-300/15 absolute -right-3 -bottom-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                      </div>
                      <div class="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3 cursor-pointer hover:shadow-sm transition-all flex items-center gap-3 relative overflow-hidden group" @click="setActiveView('ai-diagnosis')">
                        <div class="w-1/4 aspect-square rounded-lg bg-green-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <svg class="w-1/2 h-1/2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <span class="text-sm font-bold text-slate-700">智能质控</span>
                        <svg class="w-12 h-12 text-green-300/15 absolute -right-3 -bottom-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                      </div>
                      <div class="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 cursor-pointer hover:shadow-sm transition-all flex items-center gap-3 relative overflow-hidden group" @click="setActiveView('ai-diagnosis')">
                        <div class="w-1/4 aspect-square rounded-lg bg-purple-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <svg class="w-1/2 h-1/2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h6v6H3zM15 3h6v6h-6zM9 9h6v6H9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15h18v6H3z"/></svg>
                        </div>
                        <span class="text-sm font-bold text-slate-700">智能用药</span>
                        <svg class="w-12 h-12 text-purple-300/15 absolute -right-3 -bottom-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h6v6H3zM15 3h6v6h-6zM9 9h6v6H9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15h18v6H3z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- DRG/DIP智能反馈已隐藏，后续可能恢复 -->
              </section>

              <!-- Right Column: Clinical Records -->
              <aside class="w-[450px] flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar transition-all duration-500 ease-in-out" :class="isRecordsExpanded ? 'flex-1' : 'w-[450px]'">
                <div class="flex-1 standard-card flex flex-col overflow-hidden relative min-h-[540px]">
                  <div class="flex items-center justify-between p-4 pb-0 mb-4">
                    <h3 class="text-[13px] font-bold text-[#2563eb] uppercase tracking-widest flex items-center gap-2">
                      <Database class="w-4 h-4" />
                      医保健康档案
                    </h3>
                    <button type="button" class="text-[13px] font-normal text-[#2563EB] flex items-center gap-1 transition-colors hover:opacity-80" style="color: #2563EB !important; font-size: 13px; font-weight: 400;" @click="activeView = 'health'">
                      查看更多
                      <ChevronRight :size="12" />
                    </button>
                  </div>

                  <div class="flex p-1 bg-slate-100 rounded-xl mx-4 mb-4 border border-slate-200/50 shadow-inner">
                    <button 
                      v-for="t in recordTabOptions" 
                      :key="t.id"
                      class="flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-300"
                      :class="recordTab === t.id ? 'bg-white text-blue-600 shadow-sm transform scale-[1.02]' : 'text-slate-500 hover:text-slate-700'"
                      @click="recordTab = t.id"
                    >
                      {{ t.label }}
                    </button>
                  </div>

                  <div class="flex items-center justify-between px-4 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
                    <span>近三月 {{ recordTabLabel }} 记录</span>
                    <span class="bg-slate-100 px-2 py-0.5 rounded text-slate-600">数量: {{ filteredRecords.length }}</span>
                  </div>

                  <div class="flex-1 overflow-y-auto px-4 pb-3 custom-scrollbar">
                    <div v-if="filteredRecords.length === 0" class="h-full flex flex-col items-center justify-center opacity-40 py-10">
                      <Database class="w-8 h-8 mb-2" />
                      <span class="text-[10px] font-bold uppercase tracking-widest">暂无记录</span>
                    </div>

                    <div v-else class="relative pl-4 ml-2 border-l-2 border-slate-100 space-y-6 pt-2 pb-4">
                      <div
                        v-for="record in filteredRecords"
                        :key="record.id"
                        class="relative"
                      >
                        <!-- Timeline Dot -->
                        <div class="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10"
                             :class="{
                               'bg-blue-500': record.type === 'op',
                               'bg-purple-500': record.type === 'ip',
                               'bg-emerald-500': record.type === 'exam',
                               'bg-orange-500': record.type === 'lab',
                               'bg-rose-500': record.type === 'med',
                               'bg-indigo-500': record.type === 'wd'
                             }">
                        </div>

                        <!-- Date & Hospital Header -->
                        <div class="flex items-center gap-2 mb-2">
                          <span class="text-[10px] font-bold font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            <span v-if="record.dateEnd">{{ record.date }} ~ {{ record.dateEnd }}</span>
                            <span v-else>{{ record.date }}</span>
                          </span>
                          <span class="text-[10px] font-bold text-slate-400 truncate">{{ record.hosp }}</span>
                        </div>

                        <!-- Record Card -->
                        <div 
                          class="bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                          @click="handleAction(record.type === 'med' ? 'op' : (record.type === 'lab' ? 'lab_detail' : (record.type === 'exam' ? 'exam_detail' : (record.type === 'ip' ? 'ip_detail' : 'op'))), record.diag, record)"
                        >
                          <div class="flex items-start justify-between gap-3 mb-2">
                            <div class="flex items-center gap-2">
                              <div class="w-6 h-6 rounded-lg flex items-center justify-center"
                                   :class="{
                                     'bg-blue-50 text-blue-500': record.type === 'op',
                                     'bg-purple-50 text-purple-500': record.type === 'ip',
                                     'bg-emerald-50 text-emerald-500': record.type === 'exam',
                                     'bg-orange-50 text-orange-500': record.type === 'lab',
                                     'bg-rose-50 text-rose-500': record.type === 'med',
                                     'bg-indigo-50 text-indigo-500': record.type === 'wd'
                                   }">
                                <Stethoscope v-if="record.type === 'op'" :size="14" />
                                <Hospital v-else-if="record.type === 'ip'" :size="14" />
                                <Scan v-else-if="record.type === 'exam'" :size="14" />
                                <Microscope v-else-if="record.type === 'lab'" :size="14" />
                                <Pill v-else-if="record.type === 'med'" :size="14" />
                                <Cpu v-else-if="record.type === 'wd'" :size="14" />
                              </div>
                              <div class="text-sm font-bold text-slate-900 truncate">{{ record.diag }}</div>
                            </div>
                            <span v-if="record.type === 'ip'" class="text-[9px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 font-bold">{{ record.status || '住院' }}</span>
                            <span v-else-if="record.type === 'exam'" class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">{{ record.tags[0] }}</span>
                          </div>

                          <div class="border-t border-slate-100 pt-2 text-xs text-slate-700">
                            <div v-if="record.type === 'op'" class="space-y-1">
                              <div class="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">诊断：{{ record.desc }}</div>
                            </div>
                            <div v-else-if="record.type === 'ip'" class="space-y-2">
                              <div class="text-[11px] text-slate-600 leading-relaxed">{{ record.desc }}</div>
                              <div class="flex items-center gap-2 pt-1">
                                <button class="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" @click.stop="handleAction('ip_detail', '入院记录', record)">入院记录</button>
                                <button class="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" @click.stop="handleAction('ip_detail', '首次病程', record)">首次病程</button>
                                <button class="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" @click.stop="handleAction('ip_detail', '出院小结', record)">出院小结</button>
                              </div>
                            </div>
                            <div v-else-if="record.type === 'exam'" class="space-y-2">
                              <div class="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{{ record.desc }}</div>
                              <div class="flex items-center gap-2 pt-1">
                                <button class="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" @click.stop="handleAction('exam_detail', '查看报告', record)">查看报告</button>
                                <button class="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors" @click.stop="handleAction('dicom', '调阅影像', record)">调阅影像</button>
                              </div>
                            </div>
                            <div v-else-if="record.type === 'lab'" class="space-y-1">
                              <div class="flex flex-col gap-1 mt-1">
                                <div v-for="(m, i) in record.metrics" :key="i" class="flex justify-between items-center p-1.5 rounded-lg text-[11px] bg-slate-50 group-hover:bg-blue-50/30 transition-colors">
                                  <span class="text-slate-600">{{ m.label }}</span>
                                  <span class="font-mono font-bold" :class="m.flag === 'high' ? 'text-red-600' : m.flag === 'low' ? 'text-yellow-600' : 'text-slate-700'">
                                    {{ m.value }} {{ 'unit' in m ? m.unit : '' }} {{ m.flag === 'high' ? '↑' : m.flag === 'low' ? '↓' : '' }}
                                  </span>
                                </div>
                              </div>
                              <div v-if="record.moreCount" class="text-center pt-1.5 text-[10px] text-slate-400 font-bold group-hover:text-blue-500 transition-colors flex items-center justify-center gap-1">
                                展开剩余 {{ record.moreCount }} 项指标 <ChevronDown :size="10" />
                              </div>
                            </div>
                            <div v-else-if="record.type === 'wd'" class="space-y-1">
                              <div class="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{{ record.desc }}</div>
                              <div class="flex flex-wrap gap-2 mt-2">
                                <div v-for="metric in record.metrics" :key="metric.label" class="warning-tag flex items-center">
                                    {{ metric.label }} {{ metric.value }} ↑
                                </div>
                              </div>
                            </div>
                            <div v-else class="space-y-1">
                              <div class="flex flex-col gap-1 mt-1">
                                <div v-for="(it, i) in record.items" :key="i" class="flex justify-between items-center p-1.5 rounded-lg text-[11px] bg-slate-50 group-hover:bg-blue-50/30 transition-colors">
                                  <span class="text-slate-600">{{ it.name }}</span>
                                  <span class="font-mono font-bold text-slate-700">x{{ it.count }}</span>
                                </div>
                              </div>
                              <div v-if="record.moreCount" class="text-center pt-1.5 text-[10px] text-slate-400 font-bold group-hover:text-blue-500 transition-colors flex items-center justify-center gap-1">
                                展开剩余 {{ record.moreCount }} 项 <ChevronDown :size="10" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                  <!-- Insurance Archive Center -->
                  <div class="standard-card p-5 relative flex-shrink-0">
                    <div class="flex items-center justify-between mb-4">
                      <h3 class="text-[13px] font-bold text-[#2563eb] uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck class="w-4 h-4" />
                        医保信息档案
                      </h3>
                      <button class="text-[13px] font-normal text-[#2563EB] flex items-center gap-1 transition-colors hover:opacity-80" style="color: #2563EB !important; font-size: 13px; font-weight: 400;" @click="activeView = 'info'">
                        查看更多
                        <ChevronRight :size="12" />
                      </button>
                    </div>

                    <div class="flex p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200/50 shadow-inner">
                      <button 
                        v-for="t in insuranceTabs" 
                        :key="t.id"
                        class="flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-300"
                        :class="insuranceTab === t.id ? 'bg-white text-blue-600 shadow-sm transform scale-[1.02]' : 'text-slate-500 hover:text-slate-700'"
                        @click="insuranceTab = t.id"
                      >
                        {{ t.label }}
                      </button>
                    </div>

                    <div class="flex-1 overflow-hidden">
                      <div v-if="insuranceTab === 'status'">
                        <div class="flex items-center justify-between mb-4 mt-1">
                          <span class="text-slate-700 font-semibold tracking-widest text-xs uppercase">参保状态</span>
                          <div class="flex items-center gap-1.5">
                            <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                            <span class="text-[9px] font-bold text-green-700 tracking-wider">正常参保(在缴)</span>
                          </div>
                        </div>
                        <div class="space-y-5">
                          <div>
                            <div class="mb-3">
                              <p class="text-[9px] text-slate-500 uppercase mb-1 font-bold tracking-widest">参保类型</p>
                              <h3 class="text-lg font-bold text-slate-900 tracking-tight">职工基本医疗保险</h3>
                            </div>
                            <div>
                              <p class="text-[9px] text-slate-500 uppercase mb-1 font-bold tracking-widest">统筹区</p>
                              <p class="text-lg font-bold text-slate-900 tracking-tight">常州市 (3204)</p>
                            </div>
                          </div>
                          <div class="pt-2">
                            <p class="text-slate-700 font-semibold tracking-widest text-xs uppercase mb-4">医保年度累计</p>
                            <div class="space-y-4 pb-2">
                              <div>
                                <div class="flex justify-between text-[11px] mb-1.5 font-mono">
                                  <span class="text-slate-600">门诊统筹额度</span>
                                  <span class="text-blue-600">1,900 / 10,000</span>
                                </div>
                                <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                  <div class="h-full bg-gradient-to-r from-blue-600 to-blue-400 w-[19%]"></div>
                                </div>
                              </div>
                              <div>
                                <div class="flex justify-between text-[11px] mb-1.5 font-mono">
                                  <span class="text-slate-600">住院统筹额度</span>
                                  <span class="text-green-600">14,800 / 400,000</span>
                                </div>
                                <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                  <div class="h-full bg-gradient-to-r from-green-600 to-green-400 w-[3.7%]"></div>
                                </div>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                      <div v-else-if="insuranceTab === 'commercial'">
                        <div class="mb-4 mt-1"><span class="text-slate-700 font-semibold tracking-widest text-xs uppercase">商业保险管理</span></div>
                        <div class="space-y-4">
                          <!-- 江苏医惠保1号 -->
                          <div 
                            class="relative rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-white border border-orange-200 p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-orange-300 transition-all duration-200"
                            @click="openCommercialInsuranceDetail('yihuibao')"
                          >
                            <div class="flex justify-between items-start mb-4">
                              <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-orange-100 shadow-sm text-xl">
                                  🛡️
                                </div>
                                <div>
                                  <h4 class="text-sm font-bold text-slate-900">江苏医惠保1号</h4>
                                  <p class="text-[10px] text-slate-500">保单号：PASH20240312001</p>
                                </div>
                              </div>
                              <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                            <div class="grid grid-cols-4 gap-2 border-t border-orange-100 pt-3">
                              <div>
                                <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">保障状态</p>
                                <p class="text-[10px] font-bold text-green-600">保障中</p>
                              </div>
                              <div>
                                <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">年度保额</p>
                                <p class="text-[10px] font-bold text-slate-900">400万</p>
                              </div>
                              <div>
                                <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">免赔额</p>
                                <p class="text-[10px] font-bold text-slate-900">1.0万</p>
                              </div>
                              <div>
                                <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">到期日期</p>
                                <p class="text-[10px] font-bold text-slate-900">25-03-11</p>
                              </div>
                            </div>
                          </div>

                          <!-- 乐享健康重疾险 -->
                          <div 
                            class="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-blue-200 p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
                            @click="openCommercialInsuranceDetail('lexiang')"
                          >
                            <div class="flex justify-between items-start mb-4">
                              <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-blue-100 shadow-sm text-xl">
                                  🛡️
                                </div>
                                <div>
                                  <h4 class="text-sm font-bold text-slate-900">乐享健康重疾险</h4>
                                  <p class="text-[10px] text-slate-500">保单号：LXJK20240520008</p>
                                </div>
                              </div>
                              <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                            <div class="grid grid-cols-4 gap-2 border-t border-blue-100 pt-3">
                              <div>
                                <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">保障状态</p>
                                <p class="text-[10px] font-bold text-green-600">保障中</p>
                              </div>
                              <div>
                                <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">年度保额</p>
                                <p class="text-[10px] font-bold text-slate-900">50万</p>
                              </div>
                              <div>
                                <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">免赔额</p>
                                <p class="text-[10px] font-bold text-slate-900">0</p>
                              </div>
                              <div>
                                <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">到期日期</p>
                                <p class="text-[10px] font-bold text-slate-900">25-05-19</p>
                              </div>
                            </div>
                          </div>

                          <!-- AI 医保条款分析建议已隐藏，后续可能恢复 -->
                        </div>
                      </div>
                      <div v-else>
                        <div class="mb-4 mt-1"><span class="text-slate-700 font-semibold tracking-widest text-xs uppercase">长期护理保险</span></div>
                        <div class="bg-white border border-green-200 rounded-xl p-4 shadow-sm mb-2 bg-gradient-to-br from-green-50/50 to-white">
                          <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-green-100 shadow-sm text-xl">🦽</div>
                            <div>
                              <h4 class="text-sm font-bold text-slate-900">常州市长期护理保险</h4>
                              <p class="text-[10px] text-slate-500">评定等级：重度失能 II 级</p>
                            </div>
                          </div>
                          <div class="grid grid-cols-4 gap-2 border-t border-green-100 pt-3">
                            <div>
                              <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">待遇状态</p>
                              <p class="text-[10px] font-bold text-green-600">享受中</p>
                            </div>
                            <div>
                              <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">服务方式</p>
                              <p class="text-[10px] font-bold text-slate-900">居家护理</p>
                            </div>
                            <div>
                              <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">服务频次</p>
                              <p class="text-[10px] font-bold text-slate-900">3次/周</p>
                            </div>
                            <div>
                              <p class="text-[8px] text-slate-400 uppercase font-bold mb-0.5">定点机构</p>
                              <p class="text-[10px] font-bold text-slate-900 truncate" title="常州安心养老服务中心">常州安心...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </aside>
            </div>

        <!-- Health View -->
        <div v-if="activeView === 'health'" class="v on">
          <div class="card g-full">
            <div class="ch">
              <div class="ch-l">
                <div class="ch-stripe" style="background: var(--blue)"></div>
                <div class="ch-title">全生命周期诊疗记录</div>
              </div>
            </div>
            <div class="filter-header" style="display: flex; justify-content: flex-start; gap: 16px; padding: 12px 16px; border-bottom: 1px solid var(--line); align-items: center; background: #fff;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 13px; color: var(--ink3); font-weight: 500;">机构：</span>
                <select class="ch-sel" style="width: 140px; max-width: 140px; border: 1px solid var(--line); border-radius: 6px; padding: 6px 10px; font-size: 13px; background: #f8fafc; outline: none; cursor: pointer; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                  <option>常州市第一人民医院</option>
                  <option>市第二人民医院</option>
                  <option>南京大学医学院附属鼓楼医院</option>
                </select>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 13px; color: var(--ink3); font-weight: 500;">时间：</span>
                <select class="ch-sel" style="width: 110px; border: 1px solid var(--line); border-radius: 6px; padding: 6px 10px; font-size: 13px; background: #f8fafc; outline: none; cursor: pointer;">
                  <option>近1年</option>
                  <option>近3年</option>
                  <option>全部</option>
                </select>
              </div>
              <button class="btn-p" style="padding: 6px 16px; font-size: 13px; margin-left: 8px;">导出记录</button>
            </div>
            <div class="lifecycle-tabs-container">
              <div class="lifecycle-tabs">
                <div
                  v-for="tab in lifecycleTabs"
                  :key="tab.id"
                  :class="['lt-item', activeLifecycleTab === tab.id ? 'on' : '']"
                  @click="activeLifecycleTab = tab.id"
                >
                  {{ tab.label }}
                </div>
              </div>
            </div>
            <div class="cb scroll-x" style="padding: 0">
              <LifecycleList :filter="activeLifecycleTab" @action="handleAction" />
            </div>
          </div>
          <div class="g2">
            <div class="card">
              <div class="ch">
                <div class="ch-l">
                  <div class="ch-stripe" style="background: var(--purple)"></div>
                  <div class="ch-title">当前用药清单</div>
                </div>
                <span class="ch-r" style="color: #2563EB !important; font-size: 12px;" @click="showHealthRefillModal = true">开具续药处方 →</span>
              </div>
              <div class="cb">
                <div class="di">
                  <div class="di-ico">💊</div>
                  <div class="di-info">
                    <div class="di-name">苯磺酸氨氯地平片</div>
                    <div class="di-spec">5mg × 30片 · 每日1次</div>
                  </div>
                  <div class="di-days">
                    <div class="di-dn" style="color: var(--red)">3天</div>
                    <div class="di-dl">剩余</div>
                  </div>
                </div>
                <div class="di">
                  <div class="di-ico">💊</div>
                  <div class="di-info">
                    <div class="di-name">缬沙坦胶囊</div>
                    <div class="di-spec">80mg × 7粒 · 每日1次</div>
                  </div>
                  <div class="di-days">
                    <div class="di-dn" style="color: var(--amber)">8天</div>
                    <div class="di-dl">剩余</div>
                  </div>
                </div>
                <div class="di">
                  <div class="di-ico">💊</div>
                  <div class="di-info">
                    <div class="di-name">阿司匹林肠溶片</div>
                    <div class="di-spec">100mg × 30片 · 每日1次</div>
                  </div>
                  <div class="di-days">
                    <div class="di-dn" style="color: var(--green)">22天</div>
                    <div class="di-dl">剩余</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="ch">
                <div class="ch-l">
                  <div class="ch-stripe" style="background: var(--green)"></div>
                  <div class="ch-title">关键健康指标</div>
                </div>
                <span class="ch-r" style="color: #2563EB !important; font-size: 12px;" @click="showMetricDetailModal = true">查看更多 →</span>
              </div>
              <div class="cb">
                <div class="hi-grid">
                  <div class="hi" @click="showMetricDetailModal = true; selectedMetric = '血压'">
                    <div class="hi-top">
                      <span class="hi-ico">❤️</span>
                      <span class="hi-s hi-warn">偏高</span>
                    </div>
                    <div class="hi-val" style="color: var(--red)">148/92</div>
                    <div class="hi-lbl">血压 mmHg</div>
                  </div>
                  <div class="hi" @click="showMetricDetailModal = true; selectedMetric = '血糖'">
                    <div class="hi-top">
                      <span class="hi-ico">🩸</span>
                      <span class="hi-s hi-ok">正常</span>
                    </div>
                    <div class="hi-val" style="color: var(--green)">5.2</div>
                    <div class="hi-lbl">血糖 mmol/L</div>
                  </div>
                  <div class="hi" @click="showMetricDetailModal = true; selectedMetric = '体重'">
                    <div class="hi-top">
                      <span class="hi-ico">⚖️</span>
                      <span class="hi-s hi-warn">超重</span>
                    </div>
                    <div class="hi-val" style="color: var(--amber)">27.4</div>
                    <div class="hi-lbl">BMI</div>
                  </div>
                  <div class="hi" @click="showMetricDetailModal = true; selectedMetric = '心率'">
                    <div class="hi-top">
                      <span class="hi-ico"><HeartPulse :size="16" /></span>
                      <span class="hi-s hi-ok">正常</span>
                    </div>
                    <div class="hi-val" style="color: var(--green)">72</div>
                    <div class="hi-lbl">心率 bpm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Finance View -->
        <div v-if="activeView === 'finance'" class="v on">
          <div class="filter-header" style="display: flex; justify-content: flex-start; gap: 16px; margin-bottom: 20px; padding: 12px; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 13px; color: var(--ink3); font-weight: 500;">年度：</span>
              <select class="ch-sel" style="width: 110px; border: 1px solid var(--line); border-radius: 6px; padding: 6px 10px; font-size: 13px; background: #f8fafc; outline: none; cursor: pointer;" v-model="selectedYear" @change="updateFinancialData">
                <option value="2026">2026年度</option>
                <option value="2025">2025年度</option>
                <option value="2024">2024年度</option>
              </select>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 13px; color: var(--ink3); font-weight: 500;">地区：</span>
              <select class="ch-sel" style="width: 110px; border: 1px solid var(--line); border-radius: 6px; padding: 6px 10px; font-size: 13px; background: #f8fafc; outline: none; cursor: pointer;" v-model="selectedCity" @change="updateFinancialData">
                <option value="changzhou">常州市</option>
                <option value="nanjing">南京市</option>
                <option value="wuxi">无锡市</option>
              </select>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 13px; color: var(--ink3); font-weight: 500;">类型：</span>
              <select class="ch-sel" style="width: 110px; border: 1px solid var(--line); border-radius: 6px; padding: 6px 10px; font-size: 13px; background: #f8fafc; outline: none; cursor: pointer;" v-model="selectedRecordType">
                <option value="门诊">门诊</option>
                <option value="住院">住院</option>
                <option value="药店">药店</option>
              </select>
            </div>
          </div>
          <div class="g4" style="margin-bottom: 14px">
            <div class="mc">
              <div class="mc-lbl">💰 年度费用总额</div>
              <div class="mc-val" style="color: var(--blue)">{{ selectedYear === '2026' ? '¥10,250.00' : '¥8,540.00' }}</div>
              <div class="mc-sub">包含所有就医费用</div>
              <div class="mc-trend tr-flat">→ 较去年增长 15%</div>
            </div>
            <div class="mc">
              <div class="mc-lbl">🏥 医保支付总额</div>
              <div class="mc-val" style="color: var(--green)">{{ selectedYear === '2026' ? '¥6,320.00' : '¥5,100.00' }}</div>
              <div class="mc-sub">报销额度比例 38%</div>
              <div class="mc-trend tr-up">↑ 统筹+个账支付</div>
            </div>
            <div class="mc">
              <div class="mc-lbl">👤 个人支付金额</div>
              <div class="mc-val" style="color: var(--amber)">{{ selectedYear === '2026' ? '¥3,930.00' : '¥3,440.00' }}</div>
              <div class="mc-sub">自费+自付部分</div>
              <div class="mc-trend tr-down">↓ 门槛费已过线</div>
            </div>
            <div class="mc">
              <div class="mc-lbl">📈 医保报销总额</div>
              <div class="mc-val" style="color: var(--blue)">{{ selectedYear === '2026' ? '¥6,320' : '¥5,100' }}</div>
              <div class="mc-sub">统筹年度封顶线</div>
              <div class="mc-trend tr-up">↑ 已用 {{ selectedYear === '2026' ? '¥6,320' : '¥5,100' }} / ¥200,000</div>
            </div>
          </div>
          <div class="g-full">
            <div class="card">
              <div class="ch">
                <div class="ch-l">
                  <div class="ch-stripe" style="background: var(--blue)"></div>
                  <div class="ch-title">使用记录</div>
                </div>
              </div>
              <div class="cb">
                <!-- Ring Charts Row -->
                <div style="display: flex; justify-content: space-around; align-items: center; padding: 20px 0; border-bottom: 1px dashed var(--line); margin-bottom: 20px">
                  <!-- Inpatient Ring -->
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                    <div style="position: relative; width: 100px; height: 100px">
                      <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg)">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--blue-l)" stroke-width="3"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--blue)" stroke-width="3" stroke-dasharray="98.7, 100" stroke-linecap="round"></circle>
                      </svg>
                      <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: var(--blue)">
                        住院 98.7%
                      </div>
                    </div>
                  </div>
                  <!-- Outpatient Ring -->
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                    <div style="position: relative; width: 100px; height: 100px">
                      <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg)">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--green-l)" stroke-width="3"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--green)" stroke-width="3" stroke-dasharray="1.3, 100" stroke-linecap="round"></circle>
                      </svg>
                      <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: var(--green)">
                        门诊 1.3%
                      </div>
                    </div>
                  </div>
                  <!-- Pharmacy Ring -->
                  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                    <div style="position: relative; width: 100px; height: 100px">
                      <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg)">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--cyan-l)" stroke-width="3"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--cyan)" stroke-width="3" stroke-dasharray="0, 100" stroke-linecap="round"></circle>
                      </svg>
                      <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: var(--cyan)">
                        药店 0%
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Table Row -->
                <div class="scroll-x" style="margin: 0 -18px">
                  <table class="tbl">
                    <thead>
                      <tr>
                        <th>日期</th>
                        <th>机构</th>
                        <th>类型</th>
                        <th>总费用(元)</th>
                        <th>现金支付(元)</th>
                        <th>基金支付(元)</th>
                        <th>个账支付(元)</th>
                        <th>账户抵扣金额(元)</th>
                        <th>其他支付金额(元)</th>
                        <th>报销比例</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, i) in paginatedReimbursementData" :key="i">
                        <td style="font-size: 11px; color: var(--ink4)">{{ item.date }}</td>
                        <td>{{ item.hosp }}</td>
                        <td><span :class="['tag', item.type === '门诊' ? 't-blue' : (item.type === '住院' ? 't-red' : 't-cyan')]">{{ item.type }}</span></td>
                        <td style="font-weight: 700; color: var(--ink)">{{ item.total }}</td>
                        <td style="color: var(--ink); font-weight: 600">{{ item.cash }}</td>
                        <td style="color: var(--blue); font-weight: 600">{{ item.fund }}</td>
                        <td style="color: var(--blue); font-weight: 600">{{ item.account }}</td>
                        <td style="color: var(--ink); font-weight: 600">{{ item.deduct }}</td>
                        <td style="color: var(--ink); font-weight: 600">{{ item.other }}</td>
                        <td>
                          <div style="display: flex; align-items: center; gap: 4px">
                            <div style="position: relative; width: 24px; height: 24px;">
                              <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg)">
                                <circle cx="18" cy="18" r="16" fill="none" stroke="var(--line)" stroke-width="4"></circle>
                                <circle cx="18" cy="18" r="16" fill="none" stroke="var(--blue)" stroke-width="4" :stroke-dasharray="parseFloat(item.ratio) + ', 100'" stroke-linecap="round"></circle>
                              </svg>
                            </div>
                            <span style="font-size: 11px; color: var(--ink4); font-weight: 600">{{ item.ratio }}</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Pagination -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; font-size: 13px; color: var(--ink3);">
                  <div>共 {{ filteredReimbursementData.length }} 条数据</div>
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
            </div>
            
            <!-- 商保报销记录 -->
            <div class="card" style="margin-top: 14px">
              <div class="ch">
                <div class="ch-l">
                  <div class="ch-stripe" style="background: var(--purple)"></div>
                  <div class="ch-title">商保报销记录</div>
                </div>
              </div>
              <div class="cb">
                <div class="scroll-x" style="margin: 0 -18px">
                  <table class="tbl">
                    <thead>
                      <tr>
                        <th>报销日期</th>
                        <th>保险名称</th>
                        <th>就诊机构</th>
                        <th>理赔类型</th>
                        <th>理赔金额(元)</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(rec, idx) in paginatedCbReimbursementData" :key="idx">
                        <td style="font-size: 11px; color: var(--ink4)">{{ rec.date }}</td>
                        <td>{{ rec.name }}</td>
                        <td>{{ rec.hosp }}</td>
                        <td><span :class="['tag', rec.typeTag]">{{ rec.type }}</span></td>
                        <td style="font-weight: 700; color: var(--blue)">{{ rec.amount }}</td>
                        <td><span :class="['tag', rec.statusTag]">{{ rec.status }}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination for Commercial Insurance -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; font-size: 13px; color: var(--ink3);">
                  <div>共 {{ cbReimbursementData.length }} 条数据</div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <button style="border: 1px solid var(--line); background: #fff; padding: 2px 8px; border-radius: 4px; cursor: pointer;" @click="changeCbPage(cbCurrentPage - 1)" :disabled="cbCurrentPage === 1">&lt;</button>
                    <span v-for="page in cbTotalPages" :key="page" 
                          :style="{ background: cbCurrentPage === page ? 'var(--blue)' : 'transparent', color: cbCurrentPage === page ? '#fff' : 'var(--ink)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }"
                          @click="changeCbPage(page)">
                      {{ page }}
                    </span>
                    <button style="border: 1px solid var(--line); background: #fff; padding: 2px 8px; border-radius: 4px; cursor: pointer;" @click="changeCbPage(cbCurrentPage + 1)" :disabled="cbCurrentPage === cbTotalPages">&gt;</button>
                    <span style="margin-left: 8px;">跳至</span>
                    <input type="number" min="1" :max="cbTotalPages" v-model.number="cbCurrentPage" @change="changeCbPage(cbCurrentPage)" style="width: 40px; border: 1px solid var(--line); border-radius: 4px; text-align: center; padding: 2px;" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info View -->
        <div v-if="activeView === 'info'" class="v on">
          <div class="g4" style="margin-bottom: 20px;">
            <div class="mc">
              <div class="mc-lbl">🏦 个人账户余额</div>
              <div class="mc-val" style="color: var(--blue)">888.59</div>
              <div class="mc-sub">最近一次划拨时间</div>
              <div class="mc-trend tr-flat">→ 2026-03-01</div>
            </div>
            <div class="mc">
              <div class="mc-lbl">🌍 异地就医备案</div>
              <div class="mc-val" style="color: var(--blue)">已备案</div>
              <div class="mc-sub">上海市、南京市</div>
              <div class="mc-trend" style="background: rgba(34, 197, 94, 0.1); color: var(--green); display: inline-block; padding: 2px 8px; border-radius: 10px;">→ 长期有效</div>
            </div>
            <div class="mc">
              <div class="mc-lbl">💳 信用就医</div>
              <div class="mc-val" style="color: var(--green)">已开通</div>
              <div class="mc-sub">授信额度 ¥5,000</div>
              <div class="mc-trend" style="background: rgba(34, 197, 94, 0.1); color: var(--green); display: inline-block; padding: 2px 8px; border-radius: 10px;">→ 当前可用 ¥5,000</div>
            </div>
          </div>
          <div class="g2">
            <div style="display: flex; flex-direction: column; gap: 20px">
              <!-- 参保基本信息 -->
              <div class="card">
                <div class="ch">
                  <div class="ch-l">
                    <div class="ch-stripe" style="background: var(--blue)"></div>
                    <div class="ch-title">参保基本信息</div>
                  </div>
                  <span 
                    class="ch-r" 
                    style="cursor: pointer; background: var(--amber); color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px;"
                    @click="activeInsuranceType = activeInsuranceType === '职工' ? '居民' : '职工'"
                  >
                    <RefreshCw :size="14" />
                    {{ activeInsuranceType === '职工' ? '切换居民' : '切换职工' }}
                  </span>
                </div>
                <div class="cb">
                  <!-- 职工医保展示信息 -->
                  <div v-if="activeInsuranceType === '职工'" style="display: flex; flex-direction: column; gap: 0">
                    <div style="display: flex; justify-content: space-between; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px dashed var(--line2);">
                      <div style="flex: 1; text-align: center; border-right: 1px solid var(--line2);">
                        <div style="font-size: 16px; font-weight: 700; color: var(--blue); margin-bottom: 4px;">职工基本医疗保险</div>
                        <div style="font-size: 12px; color: var(--ink4); padding-top: 8px;">参保类型</div>
                      </div>
                      <div style="flex: 1; text-align: center; border-right: 1px solid var(--line2);">
                        <div style="font-size: 20px; font-weight: 700; color: var(--blue); margin-bottom: 4px;">888.59</div>
                        <div style="font-size: 12px; color: var(--ink4);">个人账户余额 ℹ️</div>
                      </div>
                      <div style="flex: 1; text-align: center;">
                        <div style="font-size: 20px; font-weight: 700; color: var(--blue); margin-bottom: 4px;">7378.00</div>
                        <div style="font-size: 12px; color: var(--ink4); padding-top: 8px;">月缴费基数(元) ℹ️</div>
                      </div>
                    </div>
                    
                    <div style="font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                      <div style="width: 4px; height: 14px; background: var(--blue); border-radius: 2px;"></div>
                      参保信息
                    </div>

                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--line2)">
                      <span style="color: var(--ink4); font-size: 13px;">参保单位</span>
                      <span style="font-size: 13px; font-weight: 600; text-align: right;">常州某科技有限公司</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--line2)">
                      <span style="color: var(--ink4); font-size: 13px;">参保时间</span>
                      <span style="font-size: 13px; font-weight: 600; text-align: right;">201306</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed var(--line2)">
                      <span style="color: var(--ink4); font-size: 13px;">参保状态</span>
                      <span style="font-size: 13px; font-weight: 600; color: var(--ink); text-align: right;">正常参保</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--line2); margin-top: 8px;">
                      <span style="color: var(--ink4); font-size: 13px;">缴费总数</span>
                      <span style="font-size: 13px; font-weight: 600; color: var(--blue); text-align: right;">774.69 元</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--line2)">
                      <span style="color: var(--ink4); font-size: 13px;">个人缴费</span>
                      <span style="font-size: 13px; font-weight: 600; color: var(--blue); text-align: right;">147.56 元</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0;">
                      <span style="color: var(--ink4); font-size: 13px;">单位缴费</span>
                      <span style="font-size: 13px; font-weight: 600; color: var(--blue); text-align: right;">627.13 元</span>
                    </div>

                    <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--line2); cursor: pointer; display: flex; align-items: center; justify-content: flex-end;" @click="openBasicInsuranceDetail">
                      <span style="font-size: 12px; color: var(--blue); display: flex; align-items: center; gap: 2px;">保单详情 <ChevronRight :size="12" /></span>
                    </div>
                  </div>
                  
                  <!-- 居民医保展示信息 -->
                  <div v-else style="display: flex; flex-direction: column; gap: 0">
                    <div style="display: flex; justify-content: space-between; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px dashed var(--line2);">
                      <div style="flex: 1; text-align: center; border-right: 1px solid var(--line2);">
                        <div style="font-size: 16px; font-weight: 700; color: var(--amber); margin-bottom: 4px;">城乡居民基本医疗保险</div>
                        <div style="font-size: 12px; color: var(--ink4); padding-top: 8px;">参保类型</div>
                      </div>
                      <div style="flex: 1; text-align: center; border-right: 1px solid var(--line2);">
                        <div style="font-size: 16px; font-weight: 700; color: var(--amber); margin-bottom: 4px;">暂停参保</div>
                        <div style="font-size: 12px; color: var(--ink4);">参保状态</div>
                      </div>
                      <div style="flex: 1; text-align: center;">
                        <div style="font-size: 16px; font-weight: 700; color: var(--amber); margin-bottom: 4px;">暂无数据</div>
                        <div style="font-size: 12px; color: var(--ink4);">参保身份</div>
                      </div>
                    </div>
                    
                    <div style="font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                      <div style="width: 4px; height: 14px; background: var(--amber); border-radius: 2px;"></div>
                      参保信息
                    </div>

                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--line2)">
                      <span style="color: var(--ink4); font-size: 13px;">单位名称</span>
                      <span style="font-size: 13px; font-weight: 600; text-align: right;">常州市天宁区青龙街道</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--line2)">
                      <span style="color: var(--ink4); font-size: 13px;">参保时间</span>
                      <span style="font-size: 13px; font-weight: 600; text-align: right;">201201</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--line2)">
                      <span style="color: var(--ink4); font-size: 13px;">应缴金额</span>
                      <span style="font-size: 13px; font-weight: 600; text-align: right;">110.00 元</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0;">
                      <span style="color: var(--ink4); font-size: 13px;">个人应缴</span>
                      <span style="font-size: 13px; font-weight: 600; text-align: right;">110.00 元</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 家庭共济成员 -->
              <div class="card">
                <div class="ch">
                  <div class="ch-l">
                    <div class="ch-stripe" style="background: var(--amber)"></div>
                    <div class="ch-title">家庭共济成员</div>
                  </div>
                  <span class="ch-r" @click="showFamilyManagementModal = true">管理 →</span>
                </div>
                <div class="cb">
                  <div style="font-size: 12px; color: var(--ink4); margin-bottom: 12px; font-weight: 500">个账余额可供成员在定点机构使用</div>
                  <div class="fam-row">
                    <div class="fm" @click="showFamilyManagementModal = true">
                      <div class="fm-av" style="background: #FEE2E2; border: 2px solid #FECACA">👩<div class="fm-badge" style="background: var(--green)">✓</div></div>
                      <div><div class="fm-name">李 **</div><div class="fm-rel">配偶</div></div>
                    </div>
                    <div class="fm" @click="showFamilyManagementModal = true">
                      <div class="fm-av" style="background: var(--blue-l); border: 2px solid #BFDBFE">👦<div class="fm-badge" style="background: var(--green)">✓</div></div>
                      <div><div class="fm-name">陈 **</div><div class="fm-rel">子女</div></div>
                    </div>
                    <div class="fm" @click="showFamilyManagementModal = true">
                      <div class="fm-av" style="background: var(--purple-l); border: 2px solid #E9D5FF">👴<div class="fm-badge" style="background: var(--amber)">!</div></div>
                      <div><div class="fm-name">陈 ** 华</div><div class="fm-rel">父亲</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 20px">
              <!-- 商业保险管理 -->
              <div class="card">
                <div class="ch">
                  <div class="ch-l">
                    <div class="ch-stripe" style="background: var(--red)"></div>
                    <div class="ch-title">商业保险管理</div>
                  </div>
                  <span class="ch-r" @click="showExpiredInsuranceModal = true">到期保单管理 →</span>
                </div>
                <div class="cb">
                  <div style="font-size: 12px; color: var(--ink4); margin-bottom: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="已关联商业保险，支持一键理赔直付">已关联商业保险，支持一键理赔直付</div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="ins-card-v2 cursor-pointer hover:shadow-lg transition-shadow" style="background: #FFF7ED; border: 1px solid #FFEDD5; box-shadow: 0 4px 20px rgba(0,0,0,0.05);" @click="openCommercialInsuranceDetail('yihuibao')">
                      <div class="ins-v2-top" style="border-bottom: 1px dashed #FFEDD5; padding-bottom: 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <div class="ins-v2-logo" style="background: #fff; border: 1px solid #f1f5f9; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🛡️</div>
                          <div class="ins-v2-info">
                            <div class="ins-v2-name" style="font-size: 16px; font-weight: 700; color: #1e293b;" title="江苏医惠保1号">江苏医惠保1号</div>
                            <div class="ins-v2-id" style="font-size: 12px; color: #94a3b8;" title="保单号：PASH20240312001">保单号：PASH20240312001</div>
                          </div>
                        </div>
                        <ChevronRight :size="18" class="text-orange-400 flex-shrink-0" />
                      </div>
                      <div class="ins-v2-body" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
                        <div class="ins-v2-item">
                          <div class="ins-v2-lbl" style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;" title="保障状态">保障状态</div>
                          <div class="ins-v2-val" style="font-size: 13px; font-weight: 700; color: #10b981;" title="保障中">保障中</div>
                        </div>
                        <div class="ins-v2-item">
                          <div class="ins-v2-lbl" style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;" title="年度保额">年度保额</div>
                          <div class="ins-v2-val" style="font-size: 15px; font-weight: 700; color: #1e293b;" title="¥400.00万">¥400.00万</div>
                        </div>
                        <div class="ins-v2-item">
                          <div class="ins-v2-lbl" style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;" title="免赔额">免赔额</div>
                          <div class="ins-v2-val" style="font-size: 15px; font-weight: 700; color: #1e293b;" title="¥1.00万">¥1.00万</div>
                        </div>
                        <div class="ins-v2-item">
                          <div class="ins-v2-lbl" style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;" title="到期日期">到期日期</div>
                          <div class="ins-v2-val" style="font-size: 15px; font-weight: 700; color: #1e293b;" title="2025-03-11">2025-03-11</div>
                        </div>
                      </div>
                    </div>

                    <div class="ins-card-v2 cursor-pointer hover:shadow-lg transition-shadow" style="background: #EFF6FF; border: 1px solid #DBEAFE; box-shadow: 0 4px 20px rgba(0,0,0,0.05);" @click="openCommercialInsuranceDetail('lexiang')">
                      <div class="ins-v2-top" style="border-bottom: 1px dashed #DBEAFE; padding-bottom: 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <div class="ins-v2-logo" style="background: #fff; border: 1px solid #f1f5f9; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🛡️</div>
                          <div class="ins-v2-info">
                            <div class="ins-v2-name" style="font-size: 16px; font-weight: 700; color: #1e293b;" title="乐享健康重疾险">乐享健康重疾险</div>
                            <div class="ins-v2-id" style="font-size: 12px; color: #94a3b8;" title="保单号：LXJK20240520008">保单号：LXJK20240520008</div>
                          </div>
                        </div>
                        <ChevronRight :size="18" class="text-blue-400 flex-shrink-0" />
                      </div>
                      <div class="ins-v2-body" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
                        <div class="ins-v2-item">
                          <div class="ins-v2-lbl" style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;" title="保障状态">保障状态</div>
                          <div class="ins-v2-val" style="font-size: 13px; font-weight: 700; color: #10b981;" title="保障中">保障中</div>
                        </div>
                        <div class="ins-v2-item">
                          <div class="ins-v2-lbl" style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;" title="年度保额">年度保额</div>
                          <div class="ins-v2-val" style="font-size: 15px; font-weight: 700; color: #1e293b;" title="¥50.00万">¥50.00万</div>
                        </div>
                        <div class="ins-v2-item">
                          <div class="ins-v2-lbl" style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;" title="免赔额">免赔额</div>
                          <div class="ins-v2-val" style="font-size: 15px; font-weight: 700; color: #1e293b;" title="¥0.00">¥0.00</div>
                        </div>
                        <div class="ins-v2-item">
                          <div class="ins-v2-lbl" style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;" title="到期日期">到期日期</div>
                          <div class="ins-v2-val" style="font-size: 15px; font-weight: 700; color: #1e293b;" title="2025-05-19">2025-05-19</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- AI 医保条款分析建议已隐藏，后续可能恢复 -->
                </div>
              </div>

              <!-- 增加长护险区域 -->
              <div class="card">
                <div class="ch">
                  <div class="ch-l">
                    <div class="ch-stripe" style="background: var(--cyan)"></div>
                    <div class="ch-title">长期护理保险</div>
                  </div>
                </div>
                <div class="cb">
                  <div style="font-size: 12px; color: var(--ink4); margin-bottom: 12px; font-weight: 500">为重度失能人员提供基本生活照料和医疗护理服务</div>
                  <div class="ins-card-v2" style="background: #F0FDF4; border: 1px solid #BBF7D0;">
                    <div class="ins-v2-top">
                      <div class="ins-v2-logo" style="background: #DCFCE7;">🦽</div>
                      <div class="ins-v2-info">
                        <div class="ins-v2-name">常州市长期护理保险</div>
                        <div class="ins-v2-id">评定等级：重度失能 II 级</div>
                      </div>
                    </div>
                    <div class="ins-v2-body">
                      <div class="ins-v2-item">
                        <div class="ins-v2-lbl">待遇状态</div>
                        <div class="ins-v2-val" style="color: var(--green)">享受中</div>
                      </div>
                      <div class="ins-v2-item">
                        <div class="ins-v2-lbl">服务方式</div>
                        <div class="ins-v2-val">居家上门护理</div>
                      </div>
                      <div class="ins-v2-item">
                        <div class="ins-v2-lbl">服务频次</div>
                        <div class="ins-v2-val">3次/周</div>
                      </div>
                      <div class="ins-v2-item">
                        <div class="ins-v2-lbl">定点机构</div>
                        <div class="ins-v2-val" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px;" title="常州安心养老服务中心">常州安心养老...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

  <!-- Detail Modal -->
  <a-modal
    v-model:open="showDetail"
    :title="showDetail?.title"
    :footer="null"
    width="800px"
    @cancel="showDetail = null"
  >
    <div class="modal-body" v-if="showDetail">
        <div v-if="showDetail.type === 'op'" class="emr-mock">
          <div class="emr-header">门诊电子病历</div>
          <div class="emr-info-grid">
            <div class="emr-row"><span>姓名：</span>陈 ** 明</div>
            <div class="emr-row"><span>性别：</span>男</div>
            <div class="emr-row"><span>年龄：</span>42岁</div>
            <div class="emr-row"><span>科室：</span>心内科</div>
            <div class="emr-row"><span>日期：</span>2024-05-15</div>
            <div class="emr-row"><span>医生：</span>王建国</div>
          </div>
          <div class="emr-section"><div class="emr-sec-hd">主诉</div><div class="emr-sec-bd">发现血压升高10年，伴头晕1周。</div></div>
          <div class="emr-section"><div class="emr-sec-hd">现病史</div><div class="emr-sec-bd">患者10年前体检发现血压升高，最高160/100mmHg，平时服用苯磺酸氨氯地平片，血压控制在140/90mmHg左右。1周前无明显诱因出现头晕，呈持续性胀痛，休息后稍缓解。</div></div>
          <div class="emr-section"><div class="emr-sec-hd">体格检查</div><div class="emr-sec-bd">T: 36.5℃, P: 72次/分, R: 18次/分, BP: 148/92mmHg。神志清，双肺呼吸音清，未闻及干湿啰音。心界不大，心率72次/分，律齐，各瓣膜听诊区未闻及病理性杂音。</div></div>
          <div class="emr-section"><div class="emr-sec-hd">初步诊断</div><div class="emr-sec-bd">1. 原发性高血压 3级（极高危）；2. 冠状动脉粥样硬化性心脏病。</div></div>
          <div class="emr-section"><div class="emr-sec-hd">处理意见</div><div class="emr-sec-bd">1. 苯磺酸氨氯地平片 5mg qd；2. 缬沙坦 80mg qd；3. 建议低盐低脂饮食，监测血压。</div></div>
        </div>
        <div v-if="showDetail.type === 'ip'" class="emr-mock">
          <div class="emr-header">病案首页</div>
          <div class="emr-info-grid">
            <div class="emr-row"><span>医疗机构：</span>南京大学医学院附属鼓楼医院</div>
            <div class="emr-row"><span>住院号：</span>IP20240310001</div>
            <div class="emr-row"><span>入院日期：</span>2024-03-10</div>
            <div class="emr-row"><span>出院日期：</span>2024-03-20</div>
            <div class="emr-row"><span>入院科室：</span>心内科</div>
            <div class="emr-row"><span>主治医生：</span>刘明远</div>
          </div>
          <div class="emr-section"><div class="emr-sec-hd">主要诊断</div><div class="emr-sec-bd">急性下壁心肌梗死；心功能II级（Killip分级）。</div></div>
          <div class="emr-section"><div class="emr-sec-hd">其他诊断</div><div class="emr-sec-bd">原发性高血压 3级；2型糖尿病。</div></div>
          <div class="emr-section"><div class="emr-sec-hd">手术操作</div><div class="emr-sec-bd">经皮冠状动脉支架植入术(PCI) - 2024-03-10。</div></div>
          <div class="emr-section"><div class="emr-sec-hd">出院情况</div><div class="emr-sec-bd">患者神志清，精神可，无胸闷胸痛。切口愈合良好，生命体征平稳。</div></div>
        </div>
        <div v-if="showDetail.type === 'exam'" class="emr-mock">
          <div class="emr-header">检查报告单</div>
          <div class="emr-info-grid">
            <div class="emr-row"><span>项目名称：</span>胸部CT平扫</div>
            <div class="emr-row"><span>检查部位：</span>胸部</div>
            <div class="emr-row"><span>检查日期：</span>2024-05-16</div>
            <div class="emr-row"><span>报告日期：</span>2024-05-16</div>
            <div class="emr-row"><span>检查号：</span>CT2024051608</div>
            <div class="emr-row"><span>审核医生：</span>赵红</div>
          </div>
          <div class="emr-section"><div class="emr-sec-hd">影像表现</div><div class="emr-sec-bd">双肺纹理增多、增粗，走行尚自然。肺野内未见明显实质性浸润影。左肺下叶见一直径约3mm微小结节影，边界清晰。气管及主要支气管通畅。纵隔未见明显肿大淋巴结。心影增大。双侧胸膜无增厚，胸腔未见积液。</div></div>
          <div class="emr-section"><div class="emr-sec-hd">诊断结论</div><div class="emr-sec-bd">1. 双肺纹理增多；2. 左肺下叶微小结节，建议随访；3. 心影增大，请结合临床。</div></div>
        </div>
        <div v-if="showDetail.type === 'dicom'" class="dicom-viewer">
          <div class="dicom-tools">
            <div class="dt-btn">🔍 缩放</div><div class="dt-btn">☀️ 亮度</div><div class="dt-btn">📏 测量</div><div class="dt-btn">🔄 旋转</div><div class="dt-btn">🎞️ 序列</div><div class="dt-btn">📤 导出</div>
          </div>
          <div class="dicom-main">
            <div class="dicom-img">
              <img src="https://picsum.photos/seed/ct-scan/800/600" alt="DICOM" referrerPolicy="no-referrer" />
              <div class="dicom-overlay-tl">陈 ** 明 [M, 42Y]<br/>ID: 320404...<br/>2024-05-16</div>
              <div class="dicom-overlay-tr">常州市第一人民医院<br/>CT Chest<br/>Se: 4 Im: 12/48</div>
              <div class="dicom-overlay-bl">KV: 120<br/>mAs: 250<br/>Thick: 1.5mm</div>
              <div class="dicom-overlay-br">W: 1500<br/>L: -500</div>
            </div>
          </div>
          <div class="dicom-footer">阅片器：正在查看 胸部CT 序列 004 · 图像 12/48</div>
        </div>
        <div v-if="showDetail.type === 'lab'" class="emr-mock">
          <div class="emr-header">检验明细报告</div>
          <div class="emr-info-grid">
            <div class="emr-row"><span>项目名称：</span>生化常规检查</div>
            <div class="emr-row"><span>标本类型：</span>血清</div>
            <div class="emr-row"><span>采样时间：</span>2024-05-16 08:30</div>
            <div class="emr-row"><span>报告时间：</span>2024-05-16 11:20</div>
            <div class="emr-row"><span>检验号：</span>LIS2024051601</div>
            <div class="emr-row"><span>审核医生：</span>孙美玲</div>
          </div>
          <table class="tbl" style="margin-top: 14px">
            <thead><tr><th>项目</th><th>结果</th><th>单位</th><th>参考值</th><th>状态</th></tr></thead>
            <tbody>
              <tr><td>谷丙转氨酶 (ALT)</td><td style="color:var(--red); font-weight: 700">45</td><td>U/L</td><td>0-40</td><td>↑</td></tr>
              <tr><td>谷草转氨酶 (AST)</td><td>32</td><td>U/L</td><td>0-40</td><td>-</td></tr>
              <tr><td>总胆固醇 (TC)</td><td style="color:var(--red); font-weight: 700">6.2</td><td>mmol/L</td><td>3.1-5.2</td><td>↑</td></tr>
              <tr><td>甘油三酯 (TG)</td><td>1.8</td><td>mmol/L</td><td>0.5-1.7</td><td>↑</td></tr>
              <tr><td>低密度脂蛋白 (LDL-C)</td><td style="color:var(--red); font-weight: 700">4.1</td><td>mmol/L</td><td>0-3.4</td><td>↑</td></tr>
              <tr><td>高密度脂蛋白 (HDL-C)</td><td>1.1</td><td>mmol/L</td><td>1.0-1.6</td><td>-</td></tr>
              <tr><td>空腹血糖 (FBG)</td><td>5.4</td><td>mmol/L</td><td>3.9-6.1</td><td>-</td></tr>
              <tr><td>肌酐 (CREA)</td><td>82</td><td>umol/L</td><td>57-97</td><td>-</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </a-modal>

    <!-- Refill Modal -->
    <a-modal
      v-model:open="showRefillModal"
      title="复诊续费"
      :footer="null"
      @cancel="showRefillModal = false"
    >
      <div class="modal-body">
        <div class="refill-info">
          <div class="ri-row"><span>患者姓名：</span>陈 ** 明</div>
          <div class="ri-row"><span>诊断：</span>原发性高血压 3级</div>
          <div class="ri-row"><span>上次就诊：</span>2024-05-15 常州市第一人民医院</div>
        </div>
        <div class="refill-section">
          <div class="rs-hd">续药清单</div>
          <div class="rs-list">
            <div class="rs-item">
              <div class="rs-check">✅</div>
              <div class="rs-med"><div class="rs-name">苯磺酸氨氯地平片</div><div class="rs-spec">5mg × 30片</div></div>
              <div class="rs-qty">x 1</div>
              <div class="rs-price">¥28.50</div>
            </div>
            <div class="rs-item">
              <div class="rs-check">✅</div>
              <div class="rs-med"><div class="rs-name">缬沙坦胶囊</div><div class="rs-spec">80mg × 7粒</div></div>
              <div class="rs-qty">x 4</div>
              <div class="rs-price">¥112.00</div>
            </div>
          </div>
        </div>
        <div class="refill-summary">
          <div class="ry-row"><span>药品总额：</span>¥140.50</div>
          <div class="ry-row"><span>诊察费：</span>¥20.00</div>
          <div class="ry-total"><span>应付总额：</span>¥160.50</div>
        </div>
        <div class="refill-actions">
          <button class="refill-btn-cancel" @click="showRefillModal = false">取消</button>
          <button class="refill-btn-confirm" @click="showRefillModal = false">确认开具并支付</button>
        </div>
      </div>
    </a-modal>

    <!-- Health Record Refill Modal -->
    <a-modal
      v-model:open="showHealthRefillModal"
      title="开具续药处方"
      :footer="null"
      @cancel="showHealthRefillModal = false"
    >
      <div class="modal-body">
        <div class="refill-info">
          <div class="ri-row"><span>患者姓名：</span>陈 ** 明</div>
          <div class="ri-row"><span>诊断：</span>原发性高血压 3级</div>
          <div class="ri-row"><span>上次就诊：</span>2024-05-15 常州市第一人民医院</div>
        </div>
        <div class="refill-section">
          <div class="rs-hd">续药清单</div>
          <div class="rs-list">
            <div class="rs-item">
              <div class="rs-check">✅</div>
              <div class="rs-med"><div class="rs-name">苯磺酸氨氯地平片</div><div class="rs-spec">5mg × 30片</div></div>
              <div class="rs-qty">x 1</div>
              <div class="rs-price">¥28.50</div>
            </div>
            <div class="rs-item">
              <div class="rs-check">✅</div>
              <div class="rs-med"><div class="rs-name">缬沙坦胶囊</div><div class="rs-spec">80mg × 7粒</div></div>
              <div class="rs-qty">x 4</div>
              <div class="rs-price">¥112.00</div>
            </div>
          </div>
        </div>
        <div class="refill-summary">
          <div class="ry-row"><span>药品总额：</span>¥140.50</div>
          <div class="ry-row"><span>诊察费：</span>¥20.00</div>
          <div class="ry-total"><span>应付总额：</span>¥160.50</div>
        </div>
        <div class="refill-actions">
          <button class="refill-btn-cancel" @click="showHealthRefillModal = false">取消</button>
          <button class="refill-btn-confirm" @click="showHealthRefillModal = false">确认开具并支付</button>
        </div>
      </div>
    </a-modal>

    <!-- Reimbursement Details Modal -->
    <a-modal
      v-model:open="showReimbursementModal"
      title="报销申请明细记录"
      :footer="null"
      width="800px"
      @cancel="showReimbursementModal = false"
    >
      <div class="modal-body" style="padding: 0">
        <div class="modal-filter-bar">
          <div class="filter-group"><label>时间范围：</label><select class="ch-sel"><option>近半年</option><option>近一年</option><option>全部</option></select></div>
          <div class="filter-group"><label>结算类型：</label><select class="ch-sel"><option>全部</option><option>门诊</option><option>住院</option></select></div>
          <div class="filter-stats">累计报销：<span style="color: var(--green); font-weight: 700">¥12,450.00</span></div>
        </div>
        <div class="scroll-y" style="max-height: 500px">
          <table class="tbl">
            <thead>
              <tr>
                <th>日期</th>
                <th>机构</th>
                <th>类型</th>
                <th>总费用</th>
                <th>现金支付</th>
                <th>基金支付</th>
                <th>个账支付</th>
                <th>账户抵扣</th>
                <th>其他支付</th>
                <th>比例</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in reimbursementData" :key="i">
                <td style="font-size: 11px; color: var(--ink4)">{{ item.date }}</td>
                <td>{{ item.hosp }}</td>
                <td><span :class="['tag', item.type === '门诊' ? 't-blue' : 't-red']">{{ item.type }}</span></td>
                <td style="font-weight: 700">¥{{ item.total }}</td>
                <td style="color: var(--red); font-weight: 600">¥{{ item.cash }}</td>
                <td style="color: var(--blue); font-weight: 600">¥{{ item.fund }}</td>
                <td style="color: var(--green); font-weight: 600">¥{{ item.account }}</td>
                <td>¥{{ item.deduct }}</td>
                <td>¥{{ item.other }}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 4px">
                    <div class="prog-track" style="width: 40px; height: 4px">
                      <div class="prog-bar" :style="{ width: item.ratio, background: 'var(--blue)' }"></div>
                    </div>
                    <span style="font-size: 10px; color: var(--ink4)">{{ item.ratio }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-ft">
        <button class="btn-p" @click="showReimbursementModal = false">关闭</button>
      </div>
    </a-modal>

    <!-- Expired Insurance Modal -->
    <a-modal
      v-model:open="showExpiredInsuranceModal"
      title="到期保单管理"
      :footer="null"
      width="500px"
      @cancel="showExpiredInsuranceModal = false"
    >
      <div class="modal-body" style="background: #f8fafc">
        <div style="font-size: 12px; color: var(--ink4); margin-bottom: 16px; padding: 0 4px">
          以下是已到期的商业保险保单，建议及时续保以维持保障
        </div>
        <div class="expired-ins-list" style="display: flex; flex-direction: column; gap: 12px">
          <div v-for="(ins, i) in expiredInsurancePolicies" :key="i" class="ins-card-v2 expired">
            <div class="ins-v2-top">
              <div class="ins-v2-logo">{{ ins.logo }}</div>
              <div class="ins-v2-info">
                <div class="ins-v2-name">{{ ins.name }}</div>
                <div class="ins-v2-id">{{ ins.id }}</div>
              </div>
              <div class="tag t-gray">已到期</div>
            </div>
            <div class="ins-v2-body">
              <div class="ins-v2-item">
                <div class="ins-v2-lbl">年度保额</div>
                <div class="ins-v2-val">{{ ins.amount }}</div>
              </div>
              <div class="ins-v2-item">
                <div class="ins-v2-lbl">免赔额</div>
                <div class="ins-v2-val">{{ ins.deductible }}</div>
              </div>
              <div class="ins-v2-item">
                <div class="ins-v2-lbl">到期日期</div>
                <div class="ins-v2-val" style="color: var(--red)">{{ ins.expiry }}</div>
              </div>
            </div>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--line2); display: flex; justify-content: flex-end">
              <button class="btn-p" style="padding: 6px 16px; font-size: 12px" @click="handleAction('toast', '暂未开通', null)">立即续保</button>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- Account Flow Modal -->
    <a-modal
      v-model:open="showAccountFlowModal"
      title="家庭共济账户流水"
      :footer="null"
      width="620px"
      @cancel="showAccountFlowModal = false"
    >
      <div class="modal-body fam-mgmt-v2">
        <div class="fam-v2-header">
          <div class="fam-v2-user">
            <div class="fam-v2-av">👨‍⚕️</div>
            <div class="fam-v2-info">
              <div class="fam-v2-name">陈 ** 明 <span class="fam-v2-tag">主授权人</span></div>
              <div class="fam-v2-id">共济账户号：GJ3204********1234</div>
            </div>
          </div>
          <div class="fam-v2-balance">
            <div class="fam-v2-bal-lbl">共济余额</div>
            <div class="fam-v2-bal-val">¥ 12,450.00</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; margin-top: 16px;">
          <div style="display: flex; gap: 8px;">
            <button v-for="tab in ['全部', '支出', '划拨', '退款']" :key="tab"
              :style="{
                padding: '4px 12px', borderRadius: '14px', border: '1px solid var(--line)', fontSize: '12px',
                background: activeFlowTab === tab ? 'var(--blue)' : '#fff',
                color: activeFlowTab === tab ? '#fff' : 'var(--ink3)',
                cursor: 'pointer'
              }"
              @click="activeFlowTab = tab"
            >{{ tab }}</button>
          </div>
          <span style="font-size: 11px; color: var(--ink4);">共 {{ accountFlows.length }} 笔</span>
        </div>

        <div style="max-height: 360px; overflow-y: auto;">
          <div v-for="(flow, i) in accountFlows" :key="i"
            style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--line2);"
          >
            <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
              <div :style="{
                width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: flow.type === '支出' ? 'rgba(239,68,68,0.1)' : flow.type === '划拨' ? 'rgba(37,99,235,0.1)' : 'rgba(34,197,94,0.1)',
                color: flow.type === '支出' ? 'var(--red)' : flow.type === '划拨' ? 'var(--blue)' : 'var(--green)',
                fontSize: '12px', fontWeight: 700
              }">
                {{ flow.type === '支出' ? '↙' : flow.type === '划拨' ? '↘' : '↖' }}
              </div>
              <div>
                <div style="font-size: 13px; font-weight: 600; color: var(--ink);">{{ flow.desc }}</div>
                <div style="font-size: 11px; color: var(--ink4); margin-top: 2px;">{{ flow.date }} · {{ flow.target }}</div>
              </div>
            </div>
            <div style="text-align: right;">
              <div :style="{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace',
                color: flow.type === '支出' ? 'var(--red)' : flow.type === '划拨' ? 'var(--blue)' : 'var(--green)'
              }">
                {{ flow.type === '退款' ? '+' : '-' }}¥{{ flow.amount }}
              </div>
              <div style="font-size: 10px; color: var(--ink4); margin-top: 2px;">余额 ¥{{ flow.balance }}</div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- Family Management Modal -->
    <a-modal
      v-model:open="showFamilyManagementModal"
      title="家庭共济成员管理"
      :footer="null"
      width="600px"
      @cancel="showFamilyManagementModal = false"
    >
      <div class="modal-body fam-mgmt-v2">
        <div class="fam-v2-header">
          <div class="fam-v2-user">
            <div class="fam-v2-av">👨‍⚕️</div>
            <div class="fam-v2-info">
              <div class="fam-v2-name">陈 ** 明 <span class="fam-v2-tag">主授权人</span></div>
              <div class="fam-v2-id">身份证号：3204**********1234</div>
            </div>
          </div>
          <div class="fam-v2-balance">
            <div class="fam-v2-bal-lbl">个账余额</div>
            <div class="fam-v2-bal-val">¥ 12,450.00</div>
          </div>
        </div>

        <div class="fam-v2-tabs">
          <div :class="['fam-v2-tab', activeFamilyTab === 0 ? 'active' : '']" @click="activeFamilyTab = 0">我授权的亲属 ({{ familyMembers.length }})</div>
          <div :class="['fam-v2-tab', activeFamilyTab === 1 ? 'active' : '']" @click="activeFamilyTab = 1">授权给我使用的亲属 ({{ authorizedMeMembers.length }})</div>
        </div>

        <div class="fam-v2-list" v-if="activeFamilyTab === 0">
          <div v-for="(member, i) in familyMembers" :key="i" class="fam-v2-card">
            <div class="fam-v2-card-top">
              <div class="fam-v2-card-user">
                <div class="fam-v2-card-av" :style="{ background: member.color }">{{ member.av }}</div>
                <div class="fam-v2-card-info">
                  <div class="fam-v2-card-name">{{ member.name }} <span class="tag t-blue">{{ member.rel }}</span></div>
                  <div class="fam-v2-card-id">{{ member.id }}</div>
                </div>
              </div>
              <div :class="['tag', member.status === '已激活' ? 't-green' : 't-amber']">{{ member.status }}</div>
            </div>
            
            <div class="fam-v2-permissions">
              <div class="fam-v2-perm-hd">权限设置</div>
              <div class="fam-v2-perm-list">
                <div class="fam-v2-perm-item">
                  <span>使用我的个账余额</span>
                  <div :class="['toggle', member.balance ? 'on' : '']"></div>
                </div>
                <div class="fam-v2-perm-item">
                  <span>代办医保业务授权</span>
                  <div :class="['toggle', member.balance ? 'on' : '']"></div>
                </div>
              </div>
            </div>

            <div class="fam-v2-card-actions">
              <button class="fam-v2-btn" @click="handleAction('toast', '暂未开通', null)">解绑</button>
              <button class="fam-v2-btn" @click="handleAction('toast', '暂未开通', null)">支付明细</button>
              <button class="fam-v2-btn p-color" @click="handleAction('toast', '暂未开通', null)">共济缴费</button>
            </div>
          </div>
        </div>

        <div class="fam-v2-list" v-else>
          <div v-for="(member, i) in authorizedMeMembers" :key="i" class="fam-v2-card">
            <div class="fam-v2-card-top">
              <div class="fam-v2-card-user">
                <div class="fam-v2-card-av" :style="{ background: member.color }">{{ member.av }}</div>
                <div class="fam-v2-card-info">
                  <div class="fam-v2-card-name">{{ member.name }} <span class="tag t-blue">{{ member.rel }}</span></div>
                  <div class="fam-v2-card-id">{{ member.id }}</div>
                </div>
              </div>
              <div :class="['tag', member.status === '已激活' ? 't-green' : 't-amber']">{{ member.status }}</div>
            </div>
            
            <div class="fam-v2-card-actions">
              <button class="fam-v2-btn" @click="handleAction('toast', '暂未开通', null)">支付明细</button>
            </div>
          </div>
        </div>

        <div class="fam-v2-footer">
          <button class="fam-v2-foot-btn" @click="handleAction('toast', '暂未开通', null)"><Search :size="16" /> 查询共济支出</button>
          <button class="fam-v2-foot-btn p-bg" @click="handleAction('toast', '暂未开通', null)"><Plus :size="16" /> 添加家庭成员</button>
        </div>
      </div>
    </a-modal>

    <!-- Medical Detail Page (Full Screen Overlay) -->
    <MedicalDetail 
      v-if="showOutpatientDetail" 
      :patient="selectedPatient" 
      :record="selectedRecordForDetail"
      @back="showOutpatientDetail = false"
      @show-dicom="showDicomViewer = true"
    />

    <!-- DICOM Viewer Page (Full Screen Overlay) -->
    <DicomViewer
      v-if="showDicomViewer"
      :patient="selectedPatient"
      :record="selectedRecordForDetail"
      @back="showDicomViewer = false"
    />

    <!-- Insurance Claim Modal -->
    <a-modal
      v-model:open="showInsuranceClaimModal"
      title="一键直赔申请"
      :footer="null"
      width="500px"
      @cancel="showInsuranceClaimModal = false; claimStep = 1"
    >
      <div class="claim-modal">
        <div class="claim-steps">
          <div :class="['cs-item', claimStep >= 1 ? 'on' : '']">1. 确认信息</div>
          <div class="cs-line"></div>
          <div :class="['cs-item', claimStep >= 2 ? 'on' : '']">2. 提交申请</div>
          <div class="cs-line"></div>
          <div :class="['cs-item', claimStep >= 3 ? 'on' : '']">3. 审核中</div>
        </div>

        <div v-if="claimStep === 1" class="claim-body">
          <div class="claim-info-box">
            <div class="ci-row"><span>理赔类型</span><strong>{{ claimForm.type }}</strong></div>
            <div class="ci-row"><span>预估赔付</span><strong style="color: var(--red)">¥{{ claimForm.amount }}</strong></div>
            <div class="ci-row"><span>收款银行</span><strong>{{ claimForm.bank }}</strong></div>
            <div class="ci-row"><span>收款账号</span><strong>{{ claimForm.account }}</strong></div>
          </div>
          <div class="claim-notice">
            <ShieldCheck :size="14" />
            <span>基于医保大数据，已自动为您匹配诊疗记录及发票，无需手动上传。</span>
          </div>
          <button class="btn-p w-full" style="margin-top: 20px" @click="claimStep = 2">确认并下一步</button>
        </div>

        <div v-if="claimStep === 2" class="claim-body">
          <div style="text-align: center; padding: 20px 0">
            <div style="font-size: 40px; margin-bottom: 10px">📄</div>
            <div style="font-size: 16px; font-weight: 700">正在生成理赔申请书...</div>
            <div style="font-size: 12px; color: var(--ink4); margin-top: 6px">我们将自动调取您的电子发票、费用明细及病历资料</div>
          </div>
          <button class="btn-p w-full" @click="claimStep = 3">立即提交申请</button>
        </div>

        <div v-if="claimStep === 3" class="claim-body">
          <div style="text-align: center; padding: 30px 0">
            <div style="font-size: 48px; color: var(--green); margin-bottom: 16px">✅</div>
            <div style="font-size: 18px; font-weight: 700">申请已提交</div>
            <div style="font-size: 13px; color: var(--ink4); margin-top: 8px; line-height: 1.6">
              您的理赔申请已进入快速审核通道。<br/>
              预计 1-3 个工作日内完成审核并打款。
            </div>
          </div>
          <button class="btn-p w-full" @click="showInsuranceClaimModal = false; claimStep = 1">返回</button>
        </div>
      </div>
    </a-modal>

    <!-- ════ DICOM Viewer Modal ════ -->
    <a-modal
      :open="showDicom"
      :footer="null"
      :closable="false"
      width="100%"
      wrap-class-name="dicom-wrap"
      :body-style="{ padding: 0 }"
      @cancel="showDicom = false"
    >
      <div class="fixed inset-0 z-[600] bg-white/95 backdrop-blur-md flex flex-col font-sans select-none">
        <div class="h-12 bg-white/80 border-b border-slate-200/80 flex items-center justify-between px-4 flex-shrink-0">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <Radar :size="18" class="text-blue-600" />
              <span class="text-slate-900 font-black text-sm tracking-tighter">个人医保云数据共享</span>
              <div class="h-3.5 w-[1px] bg-slate-300 mx-0.5"></div>
              <span class="text-blue-700/70 text-xs font-light tracking-widest uppercase">参保人全息视图</span>
            </div>
            <div class="h-3.5 w-[1px] bg-slate-200"></div>
            <span class="text-[10px] text-slate-500 font-mono">DICOM · 张伟 · Head CT · 2024-05-10</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200">
              <button class="p-1 text-slate-500 hover:text-slate-900 transition-colors rounded hover:bg-slate-100" type="button">
                <ZoomIn :size="13" />
              </button>
              <div class="w-[1px] h-3 bg-slate-200"></div>
              <button class="p-1 text-slate-500 hover:text-slate-900 transition-colors rounded hover:bg-slate-100" type="button">
                <Hand :size="13" />
              </button>
              <div class="w-[1px] h-3 bg-slate-200"></div>
              <button class="p-1 text-slate-500 hover:text-slate-900 transition-colors rounded hover:bg-slate-100" type="button">
                <Contrast :size="13" />
              </button>
            </div>
            <button type="button" class="text-slate-500 hover:text-red-600 p-1 hover:bg-red-500/10 rounded transition-all" @click="showDicom = false">
              <X :size="15" />
            </button>
          </div>
        </div>

        <div class="flex-1 flex overflow-hidden">
          <div class="w-14 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-3 gap-4 text-[8px] font-mono text-slate-500">
            <div class="text-center"><div class="text-orange-500 font-bold">120</div><div>kV</div></div>
            <div class="text-center"><div class="text-orange-500 font-bold">200</div><div>mA</div></div>
            <div class="text-center"><div class="text-blue-600/60 font-bold">5.0</div><div>mm</div></div>
            <div class="text-center"><div class="text-blue-600/60 font-bold">W:350</div><div>L:50</div></div>
            <div class="flex-1"></div>
            <div class="text-center text-slate-500"><div>12/28</div><div>SL</div></div>
          </div>

          <div class="flex-1 relative bg-[#060809] flex items-center justify-center">
            <div
              class="absolute inset-0 pointer-events-none"
              :style="{
                backgroundImage:
                  'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }"
            />
            <button class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors z-10 bg-white/5 hover:bg-white/10 rounded p-1" type="button">
              <ChevronRight :size="22" class="rotate-180" />
            </button>
            <div class="relative" style="width: min(70vh, 100%); aspect-ratio: 1">
              <img src="/dicom.png" alt="CT Scan" class="w-full h-full object-cover" />
            </div>
            <button class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors z-10 bg-white/5 hover:bg-white/10 rounded p-1" type="button">
              <ChevronRight :size="22" />
            </button>
          </div>

          <div class="w-64 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-200">
              <h3 class="text-slate-900 text-xs font-bold flex items-center gap-2">
                <Radar :size="13" class="text-blue-600 animate-pulse" />
                AI 辅助诊断报告
              </h3>
            </div>
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              <div class="bg-red-500/10 border border-red-500/25 p-3 rounded">
                <div class="flex items-center gap-1.5 text-red-600 text-[9px] font-bold mb-2 uppercase tracking-wider">
                  <Activity :size="10" />
                  异常发现
                </div>
                <p class="text-[10px] text-slate-700 leading-relaxed">右侧基底节区可见斑点状低密度影，边界模糊，提示轻度腔隙性脑梗死。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- ════ Clinical Record Detail Modal (DELETED) ════ -->

    <!-- Global Toast -->
    <div v-if="showToast" class="global-toast">
      {{ toastMessage }}
    </div>

    <!-- ════ Health Metric Detail Modal ════ -->
    <a-modal v-model:open="showMetricDetailModal" width="1000px" :footer="null">
      <div class="metric-detail">
        <div class="md-modal-title" style="font-size: 16px; font-weight: 700; margin-bottom: 20px;">体征数据</div>
        
        <div class="md-body">
          <div class="md-sidebar">
            <div :class="['md-tab', selectedMetric === '血压' ? 'on' : '']" @click="selectedMetric = '血压'">血压</div>
            <div :class="['md-tab', selectedMetric === '血糖' ? 'on' : '']" @click="selectedMetric = '血糖'">血糖</div>
            <div :class="['md-tab', selectedMetric === '心率' ? 'on' : '']" @click="selectedMetric = '心率'">心率</div>
            <div :class="['md-tab', selectedMetric === '体重' ? 'on' : '']" @click="selectedMetric = '体重'">体重</div>
            <div :class="['md-tab', selectedMetric === '身高' ? 'on' : '']" @click="selectedMetric = '身高'">身高</div>
            <div :class="['md-tab', selectedMetric === 'BMI' ? 'on' : '']" @click="selectedMetric = 'BMI'">体质指数(BMI)</div>
          </div>
          
          <div class="md-content">
            <div class="md-toolbar">
              <div class="md-ranges">
                <span 
                  v-for="range in ['近一周', '近一月', '近三月', '近一年']" 
                  :key="range"
                  :class="['md-range', { on: selectedMetricRange === range }]"
                  @click="selectedMetricRange = range"
                >{{ range }}</span>
              </div>
              <div class="md-date-picker">
                <input type="text" :value="selectedMetricRange === '近三月' ? '2022-03-27 - 2022-06-27' : '自定义时间范围'" readonly />
                <Calendar :size="14" />
              </div>
            </div>
            
            <div class="md-chart-container">
              <!-- Mock Chart -->
              <div class="md-chart-placeholder">
                <svg viewBox="0 0 800 250" class="md-svg">
                  <!-- Grid lines -->
                  <line x1="50" y1="30" x2="750" y2="30" stroke="#eee" stroke-dasharray="4" />
                  <line x1="50" y1="93" x2="750" y2="93" stroke="#eee" stroke-dasharray="4" />
                  <line x1="50" y1="156" x2="750" y2="156" stroke="#eee" stroke-dasharray="4" />
                  <line x1="50" y1="220" x2="750" y2="220" stroke="#eee" stroke-dasharray="4" />
                  
                  <path :d="chartPaths.p1" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path v-if="metricConfig.hasDoubleLine" :d="chartPaths.p2" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  
                  <!-- Dots -->
                  <circle v-for="(p, i) in metricData" :key="'p1'+i" :cx="50 + (i / (metricData.length - 1)) * 700" :cy="250 - 30 - ((p.v1 - (chartPaths.p1 ? Math.min(...metricData.map(d => Math.min(d.v1 || Infinity, d.v2 || Infinity))) : 0)) / (Math.max(...metricData.map(d => Math.max(d.v1 || -Infinity, d.v2 || -Infinity))) - Math.min(...metricData.map(d => Math.min(d.v1 || Infinity, d.v2 || Infinity))) || 1)) * 190" r="4" fill="var(--blue)" />
                  <template v-if="metricConfig.hasDoubleLine">
                    <circle v-for="(p, i) in metricData" :key="'p2'+i" :cx="50 + (i / (metricData.length - 1)) * 700" :cy="250 - 30 - ((p.v2 - Math.min(...metricData.map(d => Math.min(d.v1 || Infinity, d.v2 || Infinity)))) / (Math.max(...metricData.map(d => Math.max(d.v1 || -Infinity, d.v2 || -Infinity))) - Math.min(...metricData.map(d => Math.min(d.v1 || Infinity, d.v2 || Infinity))) || 1)) * 190" r="4" fill="var(--green)" />
                  </template>
                </svg>
                <div class="md-chart-legend">
                  <span v-for="leg in metricConfig.legend" :key="leg.label" class="md-leg-item">
                    <i :style="{ background: leg.color }"></i> {{ leg.label }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="md-stats-grid" :style="{ gridTemplateColumns: `repeat(${metricConfig.stats.length}, 1fr)` }">
              <div v-for="stat in metricConfig.stats" :key="stat.label" class="md-stat-card">
                <div class="md-stat-val">{{ stat.val }} <small>{{ metricConfig.unit }}</small></div>
                <div class="md-stat-lbl">{{ stat.label }}</div>
              </div>
            </div>
            
            <div class="md-source-info">
              <div style="white-space: pre-line">{{ metricConfig.sourceInfo }}</div>
            </div>
            
            <div class="md-table-container">
              <table class="md-table">
                <thead>
                  <tr>
                    <th v-for="col in metricConfig.columns" :key="col">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in metricData" :key="i">
                    <td>{{ row.date }}</td>
                    <td v-if="row.v1 !== undefined">{{ row.v1 }}</td>
                    <td v-if="row.v2 !== undefined">{{ row.v2 }}</td>
                    <td class="t-blue">{{ row.source }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>

  <!-- 商保详情弹窗 -->
  <a-modal
    v-model:open="showCommercialInsuranceDetail"
    :footer="null"
    :width="900"
    :mask-closable="true"
    :destroy-on-close="true"
    :centered="true"
    :body-style="{ padding: 0, maxHeight: '85vh', overflow: 'hidden' }"
    class="commercial-insurance-detail-modal"
  >
    <div v-if="selectedCommercialInsurance" style="background: #f8fafc; max-height: 85vh; overflow-y: auto;">
      <!-- 顶部保单信息卡 -->
      <div :style="`background: linear-gradient(135deg, ${selectedCommercialInsurance.color}25 0%, ${selectedCommercialInsurance.colorLight}15 100%); padding: 24px;`">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg" :style="`background: ${selectedCommercialInsurance.color}15`">
              🛡️
            </div>
            <div>
              <div class="text-lg font-bold text-slate-900">{{ selectedCommercialInsurance.name }}</div>
            </div>
          </div>
          <button 
            @click="closeCommercialInsuranceDetail"
            class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="text-[10px] text-slate-500 mb-4">保单号：{{ selectedCommercialInsurance.policyNo }}</div>
        <div class="flex justify-between items-end">
          <div class="grid grid-cols-4 gap-6 flex-1">
            <div>
              <div class="text-[10px] text-slate-500">保障状态</div>
              <div class="text-sm font-bold mt-0.5 text-green-600">保障中</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-500">年度保额</div>
              <div class="text-sm font-bold mt-0.5 text-slate-900">{{ selectedCommercialInsurance.totalCoverage }}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-500">免赔额</div>
              <div class="text-sm font-bold mt-0.5 text-slate-900">{{ selectedCommercialInsurance.coverage }}</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-500">到期日期</div>
              <div class="text-sm font-bold mt-0.5 text-slate-900">{{ selectedCommercialInsurance.period.split('至')[1].trim() }}</div>
            </div>
          </div>
          <div class="text-right ml-6">
            <div class="text-[10px] text-slate-500">保额剩余</div>
            <div class="text-2xl font-bold text-slate-900">{{ selectedCommercialInsurance.totalCoverage }}</div>
          </div>
        </div>
      </div>

      <div class="p-5 space-y-4">
        <!-- 商保直赔快捷操作 -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-1.5 mb-1">
            <svg class="w-4 h-4" :style="`color: ${selectedCommercialInsurance.color}`" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <span class="text-sm font-bold text-slate-900">商保直赔</span>
          </div>
          <p class="text-[10px] text-slate-500 mb-3">一键直赔，无需垫付医疗费用</p>
          
          <div class="grid grid-cols-3 gap-3">
            <div class="border rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-shadow" :class="selectedCommercialInsurance.colorBorder">
              <div class="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" :style="`background: ${selectedCommercialInsurance.color}15`">
                <svg class="w-5 h-5" :style="`color: ${selectedCommercialInsurance.color}`" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div class="text-xs font-bold text-slate-900">申请直赔</div>
              <div class="text-[10px] text-slate-500 mt-0.5">住院时申请直赔</div>
            </div>
            <div class="border border-blue-200 bg-blue-50/30 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-shadow">
              <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <div class="text-xs font-bold text-slate-900">医院直付</div>
              <div class="text-[10px] text-slate-500 mt-0.5">保险公司直接向医院支付</div>
            </div>
            <div class="border border-green-200 bg-green-50/30 rounded-lg p-3 text-center cursor-pointer hover:shadow-md transition-shadow">
              <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
              </div>
              <div class="text-xs font-bold text-slate-900">无需垫付</div>
              <div class="text-[10px] text-slate-500 mt-0.5">减轻患者经济压力</div>
            </div>
          </div>
        </div>

        <!-- 保障范围 -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-1.5 mb-1">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-sm font-bold text-slate-900">保障范围</span>
          </div>
          <p class="text-[10px] text-slate-500 mb-3">高保额高保障范围，帮助医生和患者了解开药和治疗方案</p>
          
          <div v-for="(ctg, idx) in selectedCommercialInsurance.coverageTypes" :key="idx" class="mb-3 last:mb-0">
            <div class="flex items-center gap-1.5 mb-2">
              <span class="w-0.5 h-3 rounded-full" :style="`background: ${selectedCommercialInsurance.color}`"></span>
              <span class="text-xs font-bold text-slate-700">{{ ctg.category }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div 
                v-for="(item, i) in ctg.items" 
                :key="i"
                class="border border-green-200 bg-green-50/30 rounded-lg p-2.5 relative"
              >
                <div class="flex items-start justify-between mb-1">
                  <span class="text-xs font-bold text-slate-900">{{ item.name }}</span>
                  <svg class="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div class="flex items-center gap-1 text-[10px] text-slate-500">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>{{ item.limit }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 不保内容 -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-1.5 mb-1">
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <span class="text-sm font-bold text-slate-900">不保内容</span>
          </div>
          <p class="text-[10px] text-slate-500 mb-3">以下情况不在保障范围内</p>
          
          <div class="grid grid-cols-3 gap-2">
            <div 
              v-for="(item, i) in selectedCommercialInsurance.exclusions" 
              :key="i"
              class="border border-red-200 bg-red-50/30 rounded-lg p-2.5 relative"
            >
              <div class="flex items-start justify-between mb-1">
                <span class="text-xs font-bold text-slate-900">{{ item.name }}</span>
                <svg class="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div class="text-[10px] text-slate-500">{{ item.desc }}</div>
            </div>
          </div>
        </div>

        <!-- 理赔记录 -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div class="flex items-center gap-1.5 mb-1">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <span class="text-sm font-bold text-slate-900">理赔记录</span>
          </div>
          <p class="text-[10px] text-slate-500 mb-3">历史理赔情况</p>
          
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="text-slate-500 border-b border-slate-200">
                  <th class="text-left font-bold py-2 px-2">理赔单号</th>
                  <th class="text-left font-bold py-2 px-2">申请日期</th>
                  <th class="text-left font-bold py-2 px-2">理赔类型</th>
                  <th class="text-left font-bold py-2 px-2">理赔金额</th>
                  <th class="text-left font-bold py-2 px-2">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(claim, i) in selectedCommercialInsurance.claims" :key="i" class="border-b border-slate-100 last:border-0">
                  <td class="py-2.5 px-2 font-mono text-slate-700">{{ claim.id }}</td>
                  <td class="py-2.5 px-2 text-slate-600">{{ claim.date }}</td>
                  <td class="py-2.5 px-2 text-slate-700">{{ claim.type }}</td>
                  <td class="py-2.5 px-2 text-green-600 font-bold">¥{{ claim.amount }}</td>
                  <td class="py-2.5 px-2">
                    <span class="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">{{ claim.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </a-modal>

  <!-- 基本医保保单详情弹窗 -->
  <a-modal
    v-model:open="showBasicInsuranceDetail"
    title="基本医保保单详情"
    :footer="null"
    :width="720"
    :mask-closable="true"
    :destroy-on-close="true"
    :centered="true"
    @cancel="closeBasicInsuranceDetail"
  >
    <div class="p-2">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-900">常州职工基本医疗保险</h3>
          <p class="text-xs text-slate-500">保单号：ZB20230601001</p>
        </div>
        <span class="ml-auto text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">保障中</span>
      </div>

      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-slate-50 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-slate-900">50万</div>
          <div class="text-[10px] text-slate-500 mt-1">年度最高限额</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-slate-900">1,300元</div>
          <div class="text-[10px] text-slate-500 mt-1">起付线</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-slate-900">85%</div>
          <div class="text-[10px] text-slate-500 mt-1">报销比例</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-3 text-center">
          <div class="text-lg font-bold text-slate-900">30万</div>
          <div class="text-[10px] text-slate-500 mt-1">大病保险额度</div>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-4">
        <div class="text-sm font-bold text-slate-900 mb-3">参保信息</div>
        <div class="grid grid-cols-2 gap-x-8 gap-y-3">
          <div class="flex justify-between">
            <span class="text-xs text-slate-500">参保类型</span>
            <span class="text-xs font-semibold text-slate-800">职工基本医疗保险</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-slate-500">参保单位</span>
            <span class="text-xs font-semibold text-slate-800">常州某科技有限公司</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-slate-500">参保时间</span>
            <span class="text-xs font-semibold text-slate-800">2013年6月</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-slate-500">参保状态</span>
            <span class="text-xs font-semibold text-green-600">正常参保（在缴）</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-slate-500">统筹区</span>
            <span class="text-xs font-semibold text-slate-800">常州市（3204）</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-slate-500">月缴费基数</span>
            <span class="text-xs font-semibold text-slate-800">7,378.00 元</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-slate-500">个人缴费</span>
            <span class="text-xs font-semibold text-blue-600">147.56 元</span>
          </div>
          <div class="flex justify-between">
            <span class="text-xs text-slate-500">单位缴费</span>
            <span class="text-xs font-semibold text-blue-600">627.13 元</span>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-4 mt-4">
        <div class="text-sm font-bold text-slate-900 mb-3">保障范围</div>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="item in ['门诊统筹', '住院统筹', '大病保险', '门诊慢性病', '特殊病种门诊', '生育保险']" :key="item" class="bg-green-50 border border-green-100 rounded-lg p-2.5 text-center">
            <svg class="w-3.5 h-3.5 text-green-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            <span class="text-[10px] font-semibold text-slate-700">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
  </a-config-provider>
</template>

<style>
/* 商保详情弹窗样式 */
.commercial-insurance-detail-modal .ant-modal-content {
  padding: 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
.commercial-insurance-detail-modal .ant-modal-close {
  display: none;
}
.commercial-insurance-detail-modal .ant-modal-body {
  padding: 0;
}

/* 优化 Ant Design Tabs 样式 */
.ant-tabs-nav::before {
  border-bottom: 1px solid #f1f5f9 !important;
}

.ant-tabs-tab {
  padding: 8px 16px !important;
  margin: 0 4px 0 0 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border-radius: 8px 8px 0 0 !important;
}

.ant-tabs-tab-active {
  background: #f8fafc !important;
}

.ant-tabs-tab-active .ant-tabs-tab-btn {
  color: var(--blue) !important;
  font-weight: 700 !important;
  text-shadow: 0 0 0.25px currentColor !important;
}

.ant-tabs-ink-bar {
  height: 3px !important;
  border-radius: 3px 3px 0 0 !important;
  background: var(--blue) !important;
}

.dicom-wrap .ant-modal {
  max-width: none;
  top: 0;
  padding-bottom: 0;
}
.dicom-wrap .ant-modal-content {
  height: 100vh;
  border-radius: 0;
}
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 30s linear infinite;
}

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(229, 231, 235, 1);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
.alert-pulse {
  animation: pulse-red 2s infinite;
}
@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
.animate__animated {
  animation-duration: 0.35s;
  animation-fill-mode: both;
}
.animate__fadeInRight {
  animation-name: fadeInRight;
}
.animate__fadeOutRight {
  animation-name: fadeOutRight;
}
@keyframes fadeInRight {
  from { opacity: 0; transform: translate3d(24px, 0, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes fadeOutRight {
  from { opacity: 1; transform: translate3d(0, 0, 0); }
  to { opacity: 0; transform: translate3d(24px, 0, 0); }
}
</style>

<style scoped>
/* 顶部导航栏 */
.top-nav-bar {
  width: 100%;
  height: 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  select-none: none;
  position: relative;
  flex-shrink: 0;
}

.top-nav-header {
  height: 64px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 64px;
  font-feature-settings: "tnum";
  margin: 0 0 0 12px;
}

.top-nav-title {
  font-size: 16px;
  font-weight: 600;
  color: #002140;
  line-height: 64px;
  font-feature-settings: "tnum";
  margin-left: 8px;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.top-nav-subtitle {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-left: 0;
  white-space: nowrap;
}

.top-nav-sep {
  width: 1px;
  height: 14px;
  background: #e5e7eb;
  margin: 0 8px;
}

.top-nav-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
  height: 100%;
  padding: 0 20px;
  white-space: nowrap;
  margin-left: auto;
}

.top-nav-user:hover {
  color: rgba(0, 0, 0, 0.85);
}

/* Ant Design 风格菜单 */
.ant-header-menu {
  margin-left: 24px;
}

.ant-menu-item {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
  transition: color 0.3s, border-color 0.3s;
  border-bottom: 2px solid transparent;
  text-decoration: none;
  position: relative;
  top: 1px;
  white-space: nowrap;
}

.ant-menu-item:hover {
  color: #1890ff;
}

.ant-menu-item-selected {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.ant-menu-item-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  font-size: 14px;
}

.ant-menu-item-icon svg {
  display: block;
}

.ant-menu-item:focus,
.ant-menu-item:active,
.ant-menu-item:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.v.on.flex-layout {
  display: flex !important;
}

.pt-panel {
  position: relative;
  transition: width 0.3s ease;
}

.pt-collapse-btn {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: #fff;
  border: 1px solid var(--line);
  border-left: none;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: var(--ink3);
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
}

.pt-collapse-btn:hover {
  color: var(--blue);
}

.warning-tag {
  background-color: #FEF3C7; /* amber-100 */
  color: #92400E; /* amber-800 */
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

.t-indigo {
  background: var(--indigo-l);
  color: var(--indigo);
}

.chips .chip {
  font-size: 9px;
  padding: 2px 6px;
}

.chips .cdot {
  width: 6px;
  height: 6px;
}
</style>
