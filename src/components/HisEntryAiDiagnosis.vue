<script setup lang="ts">
/**
 * HIS 门诊医生站 → 统一入口 → AI辅助诊断
 * 独立组件，可直接嵌入其他 Vue 3 + Ant Design Vue + Tailwind CSS 项目
 *
 * 依赖: vue, lucide-vue-next, ant-design-vue
 * 静态资源需要: /logo.png, /his.png, /his1.png, /his2.png, /his3.png
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  UserCircle, Activity, CreditCard, Info, ChevronRight, ChevronLeft,
  Image as ImageIcon, FileText, Users, Calendar, Pill, ShieldCheck,
  AlertTriangle, Radar, Cpu, Plus
} from 'lucide-vue-next';

// ═══════════════════════════════════════════════════════
// Props & Emits
// ═══════════════════════════════════════════════════════
const props = withDefaults(defineProps<{
  logoPath?: string;
  defaultView?: string;
}>(), {
  logoPath: '/logo.png',
  defaultView: 'his',
});

const emit = defineEmits<{
  (e: 'navigate', view: string): void;
}>();

// ═══════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════
type ViewType = "his" | "his1" | "his2" | "his3" | "unified-entry" | "model-detail" | "ai-diagnosis";

type ModelItem = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  bgClass: string;
  iconBgClass: string;
  iconTextClass: string;
};

type ModelVendor = {
  id: string;
  name: string;
  models: ModelItem[];
};

type HisMedicalTab = 'chief' | 'past' | 'exam' | 'diag' | 'treat';

type HisPatient = {
  id: number;
  listAge: string;
  listMeta: string;
  name: string;
  meta: string;
  diagTag: string;
  allergyTag: string;
  chief: string;
  present: string;
  allergy: string;
  pastDisease: string;
  pastSurgery: string;
  pastFamily: string;
  pastPersonal: string;
  vitals: string;
  examGeneral: string;
  examSpecialty: string;
  diagList: string[];
  treatList: string[];
  prescription: string[][];
};

// ═══════════════════════════════════════════════════════
// State
// ═══════════════════════════════════════════════════════
const activeView = ref<ViewType>(props.defaultView as ViewType);
const activeNavTab = ref("imaging");
const showHisDropdown = ref(false);

function setActiveView(v: ViewType) { activeView.value = v; }
function isActiveView(v: ViewType) { return activeView.value === v; }

// ═══════════════════════════════════════════════════════
// AI 模型数据
// ═══════════════════════════════════════════════════════
function getModelIconComponent(icon: string) {
  const map: Record<string, any> = {
    image: ImageIcon, path: Radar, file: FileText, remote: Users,
    followup: Calendar, pill: Pill, qc: ShieldCheck, alert: AlertTriangle,
  };
  return map[icon] || Cpu;
}

const modelVendors: ModelVendor[] = [
  {
    id: 'iflytek', name: '讯飞医疗',
    models: [
      { id: 'iflytek-imaging', name: '影像AI辅助分析', desc: 'CT/MRI 多部位一扫多筛，自动标记可疑异常', icon: 'image', color: 'cyan', bgClass: 'from-cyan-50 to-white', iconBgClass: 'bg-cyan-100', iconTextClass: 'text-cyan-600' },
      { id: 'iflytek-clinical', name: '临床路径推荐', desc: '基于诊断智能推荐诊疗路径与方案', icon: 'path', color: 'amber', bgClass: 'from-amber-50 to-white', iconBgClass: 'bg-amber-100', iconTextClass: 'text-amber-600' },
      { id: 'iflytek-emr', name: '历史病历快读', desc: 'AI 总结既往就诊、用药、检查检验', icon: 'file', color: 'blue', bgClass: 'from-blue-50 to-white', iconBgClass: 'bg-blue-100', iconTextClass: 'text-blue-600' },
    ],
  },
  {
    id: 'tencent', name: '腾讯健康',
    models: [
      { id: 'tencent-remote', name: '远程诊断', desc: '跨机构远程会诊与影像调阅', icon: 'remote', color: 'indigo', bgClass: 'from-indigo-50 to-white', iconBgClass: 'bg-indigo-100', iconTextClass: 'text-indigo-600' },
      { id: 'tencent-followup', name: '随访计划', desc: '慢病随访自动排期与提醒', icon: 'followup', color: 'teal', bgClass: 'from-teal-50 to-white', iconBgClass: 'bg-teal-100', iconTextClass: 'text-teal-600' },
    ],
  },
  {
    id: 'ali', name: '阿里健康',
    models: [
      { id: 'ali-medication', name: '智能用药', desc: '处方审核与用药风险预警', icon: 'pill', color: 'rose', bgClass: 'from-rose-50 to-white', iconBgClass: 'bg-rose-100', iconTextClass: 'text-rose-600' },
      { id: 'ali-qc', name: '智能质控', desc: '病历与处方质量自动核查', icon: 'qc', color: 'green', bgClass: 'from-green-50 to-white', iconBgClass: 'bg-green-100', iconTextClass: 'text-green-600' },
    ],
  },
  {
    id: 'baidu', name: '百度灵医',
    models: [
      { id: 'baidu-conflict', name: '预警冲突', desc: '药物相互作用与危急值实时拦截', icon: 'alert', color: 'red', bgClass: 'from-red-50 to-white', iconBgClass: 'bg-red-100', iconTextClass: 'text-red-600' },
    ],
  },
];

const allModels = computed(() => modelVendors.flatMap(v => v.models.map(m => ({ ...m, vendorId: v.id, vendorName: v.name }))));
const visibleWorkbenchModels = computed(() => allModels.value);
const selectedModelId = ref<string>('');
const selectedModel = computed(() => allModels.value.find(m => m.id === selectedModelId.value) || null);

function enterModel(model: { id: string }) {
  selectedModelId.value = model.id;
  setActiveView('model-detail');
}

// ═══════════════════════════════════════════════════════
// HIS 门诊医生站：患者数据与交互
// ═══════════════════════════════════════════════════════
const hisPatients: HisPatient[] = [
  {
    id: 1, listAge: '男 42岁', listMeta: '心内科 · 高血压',
    name: '陈志明', meta: '男 · 42岁 · 医保', diagTag: '高血压3级', allergyTag: '过敏史: 青霉素',
    chief: '发现血压升高10年,伴头晕1周。',
    present: '患者10年前体检发现血压升高,最高160/100mmHg,平时服用苯磺酸氨氯地平片,血压控制在140/90mmHg左右。1周前无明显诱因出现头晕,呈持续性胀痛,休息后稍缓解。',
    allergy: '青霉素类 - 极度敏感',
    pastDisease: '高血压病史10年,冠心病史5年。否认糖尿病、肝炎、结核等传染病史。',
    pastSurgery: '2019年行冠脉支架植入术。',
    pastFamily: '父亲有高血压病史,母亲有糖尿病病史。',
    pastPersonal: '吸烟史20年,每日10支;偶饮酒。否认药物依赖。',
    vitals: 'T 36.5℃  P 78次/分  R 18次/分  BP 155/95mmHg',
    examGeneral: '神志清楚,发育正常,营养中等,自主体位,查体合作。',
    examSpecialty: '颈软,双肺呼吸音清,未闻及干湿性啰音。心界不大,心率78次/分,律齐,各瓣膜听诊区未闻及病理性杂音。腹软,无压痛,双下肢无水肿。',
    diagList: ['高血压3级(极高危)', '冠心病(支架术后)'],
    treatList: ['低盐低脂饮食,适当运动', '监测血压每日2次', '2周后门诊复诊'],
    prescription: [['注射用阿莫西林钠', '1.0g/支', '静脉滴注', '2.0g', 'bid', '3天', '12支'], ['苯磺酸氨氯地平片', '5mg', '口服', '5mg', 'qd', '14天', '14片'], ['缬沙坦胶囊', '80mg', '口服', '80mg', 'qd', '14天', '14粒']],
  },
  {
    id: 2, listAge: '女 65岁', listMeta: '内分泌 · 糖尿病',
    name: '王秀兰', meta: '女 · 65岁 · 医保', diagTag: '2型糖尿病', allergyTag: '过敏史: 无',
    chief: '口干、多饮、多尿10年,加重1月。',
    present: '患者10年前无明显诱因出现口干、多饮、多尿,查空腹血糖12.5mmol/L,诊断为2型糖尿病。平时服用二甲双胍、格列美脲,血糖控制在7-8mmol/L。1月前症状加重,伴乏力,查空腹血糖11.2mmol/L。',
    allergy: '无',
    pastDisease: '2型糖尿病史10年,高血压史8年。否认冠心病、肝炎、结核等传染病史。',
    pastSurgery: '否认手术外伤史。',
    pastFamily: '父亲有糖尿病史,兄弟姐妹中有2人患糖尿病。',
    pastPersonal: '否认吸烟饮酒史。喜甜食,运动较少。',
    vitals: 'T 36.3℃  P 82次/分  R 18次/分  BP 140/85mmHg',
    examGeneral: '神志清楚,体型偏胖,BMI 26.5,皮肤黏膜无黄染。',
    examSpecialty: '双肺呼吸音清。心界不大,心率82次/分,律齐。腹软,无压痛。双足背动脉搏动减弱,双下肢痛觉减退,10g尼龙丝试验阳性。',
    diagList: ['2型糖尿病(并发周围神经病变)', '高血压2级(高危)'],
    treatList: ['糖尿病饮食,控制总热量', '每日监测血糖4次(空腹+3餐后2h)', '1月后复查糖化血红蛋白'],
    prescription: [['二甲双胍缓释片', '0.5g', '口服', '1.0g', 'bid', '30天', '60片'], ['格列美脲片', '2mg', '口服', '2mg', 'qd', '30天', '30片'], ['甲钴胺片', '0.5mg', '口服', '0.5mg', 'tid', '30天', '90片']],
  },
  {
    id: 3, listAge: '男 55岁', listMeta: '神经内科 · 头痛',
    name: '张伟', meta: '男 · 55岁 · 医保', diagTag: '偏头痛', allergyTag: '过敏史: 磺胺类',
    chief: '反复头痛3年,加重伴恶心3天。',
    present: '患者3年前无明显诱因出现头痛,以双侧颞部为主,呈搏动性,持续数小时可缓解,每月发作2-3次。3天前头痛加重,伴恶心、呕吐胃内容物1次,无畏寒发热,无意识障碍。',
    allergy: '磺胺类 - 皮疹',
    pastDisease: '偏头痛病史3年。否认高血压、糖尿病、冠心病史。否认肝炎、结核等传染病史。',
    pastSurgery: '否认手术外伤史。',
    pastFamily: '母亲有偏头痛病史。',
    pastPersonal: '吸烟史15年,每日20支;饮酒史10年。工作压力大,常熬夜。',
    vitals: 'T 36.6℃  P 75次/分  R 18次/分  BP 125/80mmHg',
    examGeneral: '神志清楚,痛苦面容,查体合作。',
    examSpecialty: '双侧瞳孔等大等圆,对光反射灵敏。颈软,克氏征、布氏征阴性。心肺腹查体无异常。四肢肌力5级,病理征阴性。',
    diagList: ['偏头痛(发作期)'],
    treatList: ['避免诱因(劳累、饮酒、特定食物)', '发作时安静休息', '必要时神经内科随访'],
    prescription: [['布洛芬缓释胶囊', '0.3g', '口服', '0.3g', 'bid', '5天', '10粒'], ['佐米曲普坦片', '2.5mg', '口服', '2.5mg', '必要时', '5天', '6片'], ['甲钴胺片', '0.5mg', '口服', '0.5mg', 'tid', '14天', '42片']],
  },
  {
    id: 4, listAge: '女 38岁', listMeta: '呼吸科 · 咳嗽',
    name: '李芳', meta: '女 · 38岁 · 医保', diagTag: '急性支气管炎', allergyTag: '过敏史: 无',
    chief: '咳嗽、咳痰伴发热5天。',
    present: '患者5天前受凉后出现咳嗽,初为干咳,后转为黄痰,量中等,不易咳出,伴发热,体温最高38.2℃,无胸痛、咯血,无呼吸困难。',
    allergy: '无',
    pastDisease: '否认慢性支气管炎、哮喘、肺结核等呼吸系统疾病史。否认高血压、糖尿病等慢性病史。',
    pastSurgery: '否认手术外伤史。',
    pastFamily: '否认家族遗传病史。',
    pastPersonal: '否认吸烟饮酒史。无特殊嗜好。',
    vitals: 'T 36.8℃  P 80次/分  R 18次/分  BP 115/70mmHg',
    examGeneral: '神志清楚,咽部充血,双侧扁桃体无肿大。',
    examSpecialty: '双肺呼吸音粗,未闻及明显干湿性啰音。心界不大,心率80次/分,律齐。腹软,无压痛。',
    diagList: ['急性支气管炎', '急性上呼吸道感染'],
    treatList: ['多休息,多饮水', '注意保暖', '5天后复诊,如症状加重及时就诊'],
    prescription: [['阿莫西林胶囊', '0.25g', '口服', '0.5g', 'tid', '5天', '30粒'], ['氨溴索口服液', '30mg/10ml', '口服', '10ml', 'tid', '5天', '5瓶'], ['右美沙芬糖浆', '15mg/5ml', '口服', '10ml', 'tid', '5天', '5瓶']],
  },
  {
    id: 5, listAge: '男 70岁', listMeta: '骨科 · 腰痛',
    name: '刘建国', meta: '男 · 70岁 · 医保', diagTag: '腰椎间盘突出', allergyTag: '过敏史: 无',
    chief: '反复腰痛5年,加重伴右下肢放射痛1周。',
    present: '患者5年前无明显诱因出现腰部酸痛,弯腰及久坐后加重,休息后缓解,未系统治疗。1周前搬重物后腰痛加重,伴右下肢放射痛,沿大腿后侧至小腿外侧,行走困难,无大小便障碍。',
    allergy: '无',
    pastDisease: '腰椎间盘突出症病史5年。高血压史10年。否认糖尿病、冠心病史。',
    pastSurgery: '5年前行腰椎间盘突出保守治疗,无手术史。',
    pastFamily: '否认家族遗传病史。',
    pastPersonal: '吸烟史30年,每日15支;偶饮酒。从事体力劳动。',
    vitals: 'T 36.5℃  P 76次/分  R 18次/分  BP 145/85mmHg',
    examGeneral: '神志清楚,扶入病房,痛苦面容,被迫卧位。',
    examSpecialty: '腰椎生理曲度变直,L4-5、L5-S1棘突间及右侧旁开1.5cm压痛(+),叩击痛(+),右下肢直腿抬高试验40°(+),加强试验(+)。右小腿外侧皮肤痛觉减退,右足背伸肌力4级。',
    diagList: ['腰椎间盘突出症(急性发作)', '高血压2级(高危)'],
    treatList: ['卧床休息2-3周', '佩戴腰围保护', '必要时骨科复诊,评估是否需要手术'],
    prescription: [['塞来昔布胶囊', '0.2g', '口服', '0.2g', 'bid', '14天', '28粒'], ['甲钴胺片', '0.5mg', '口服', '0.5mg', 'tid', '14天', '42片'], ['洛索洛芬钠贴剂', '1贴', '外用', '1贴', 'qd', '7天', '7贴']],
  },
];

const hisSelectedPatientId = ref<number>(1);
const hisSelectedPatient = computed<HisPatient>(() => hisPatients.find(p => p.id === hisSelectedPatientId.value) || hisPatients[0]);
const hisMedicalTab = ref<HisMedicalTab>('chief');

function selectHisPatient(id: number) {
  hisSelectedPatientId.value = id;
  hisMedicalTab.value = 'chief';
}

function switchHisMedicalTab(tab: HisMedicalTab) {
  hisMedicalTab.value = tab;
}

const hisMedicalTabs: { key: HisMedicalTab; label: string }[] = [
  { key: 'chief', label: '主诉/现病史' },
  { key: 'past', label: '既往史' },
  { key: 'exam', label: '体格检查' },
  { key: 'diag', label: '诊断' },
  { key: 'treat', label: '处置' },
];

// ═══════════════════════════════════════════════════════
// URL 路由 & openAIAssistant
// ═══════════════════════════════════════════════════════
function openAIAssistant() {
  const url = new URL(window.location.href);
  url.searchParams.set('view', 'ai-diagnosis');
  window.open(url.toString(), '_blank');
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const viewParam = urlParams.get('view');
  if (viewParam === 'ai-diagnosis') {
    activeView.value = 'ai-diagnosis';
  }
});

// ═══════════════════════════════════════════════════════
// 对外暴露方法
// ═══════════════════════════════════════════════════════
defineExpose({ activeView, setActiveView, openAIAssistant });
</script>

<template>
  <div class="his-entry-root">
    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- HIS 门诊医生站 -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <div v-if="activeView === 'his'" class="flex flex-col h-screen w-screen" style="font-family: 'Microsoft YaHei', sans-serif; background: #f0f2f5; color: #333; overflow: hidden;">
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
                  <div class="px-3 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-800 cursor-pointer whitespace-nowrap" @click="showHisDropdown = false; activeView = 'unified-entry'">统一入口</div>
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
          <div class="flex-1 overflow-y-auto" style="scrollbar-width: thin;">
            <div
              v-for="p in hisPatients" :key="p.id"
              class="px-2 py-1.5 border-b border-gray-100 cursor-pointer hover:bg-blue-50"
              :style="hisSelectedPatientId === p.id ? 'background: #b9cceb;' : ''"
              @click="selectHisPatient(p.id)"
            >
              <div class="flex justify-between items-center"><span class="text-xs font-bold">{{ p.id }} {{ p.name }}</span><span class="text-[10px] text-gray-500">{{ p.listAge }}</span></div>
              <div class="text-[10px] text-gray-500 mt-0.5">{{ p.listMeta }}</div>
            </div>
          </div>
        </aside>

        <main class="flex-1 flex flex-col overflow-hidden">
          <div class="bg-white border-b border-gray-300 px-4 py-1.5 flex items-center justify-between shrink-0">
            <div class="flex items-center space-x-4 text-xs">
              <span class="font-bold text-blue-800">{{ hisSelectedPatient.name }}</span>
              <span class="text-gray-500">{{ hisSelectedPatient.meta }}</span>
              <span class="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px]">{{ hisSelectedPatient.diagTag }}</span>
              <span class="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-[10px]">{{ hisSelectedPatient.allergyTag }}</span>
            </div>
            <div class="flex items-center space-x-2 text-[10px]">
              <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-300">病历</button>
              <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-300">处方</button>
              <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-300">检查</button>
              <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-300">检验</button>
              <button class="px-2 py-1 bg-gray-100 text-gray-600 rounded border border-gray-300">治疗</button>
            </div>
          </div>

          <div class="bg-white border-b border-gray-300 flex text-xs shrink-0">
            <div
              v-for="tab in hisMedicalTabs" :key="tab.key"
              class="px-4 py-2 cursor-pointer"
              :class="hisMedicalTab === tab.key ? 'text-blue-800 font-bold border-b-2 border-blue-800' : 'text-gray-500 hover:text-blue-800'"
              @click="switchHisMedicalTab(tab.key)"
            >{{ tab.label }}</div>
          </div>

          <div class="flex-1 bg-white p-4 overflow-y-auto" style="scrollbar-width: thin;">
            <div v-show="hisMedicalTab === 'chief'">
              <div class="mb-3"><label class="text-xs font-bold text-gray-600 block mb-1">主诉</label><div class="text-sm p-2 bg-gray-50 border border-gray-200 rounded min-h-[40px]">{{ hisSelectedPatient.chief }}</div></div>
              <div class="mb-3"><label class="text-xs font-bold text-gray-600 block mb-1">现病史</label><div class="text-sm p-2 bg-gray-50 border border-gray-200 rounded min-h-[60px]">{{ hisSelectedPatient.present }}</div></div>
              <div class="mb-3"><label class="text-xs font-bold text-gray-600 block mb-1">过敏史</label><div class="text-sm p-2 bg-red-50 border border-red-200 rounded text-red-700">{{ hisSelectedPatient.allergy }}</div></div>
            </div>
            <div v-show="hisMedicalTab === 'past'">
              <div class="mb-3"><label class="text-xs font-bold text-gray-600 block mb-1">既往疾病史</label><div class="text-sm p-2 bg-gray-50 border border-gray-200 rounded min-h-[40px]">{{ hisSelectedPatient.pastDisease }}</div></div>
              <div class="mb-3"><label class="text-xs font-bold text-gray-600 block mb-1">手术外伤史</label><div class="text-sm p-2 bg-gray-50 border border-gray-200 rounded min-h-[40px]">{{ hisSelectedPatient.pastSurgery }}</div></div>
              <div class="mb-3"><label class="text-xs font-bold text-gray-600 block mb-1">家族史</label><div class="text-sm p-2 bg-gray-50 border border-gray-200 rounded min-h-[40px]">{{ hisSelectedPatient.pastFamily }}</div></div>
              <div class="mb-3"><label class="text-xs font-bold text-gray-600 block mb-1">个人史</label><div class="text-sm p-2 bg-gray-50 border border-gray-200 rounded min-h-[40px]">{{ hisSelectedPatient.pastPersonal }}</div></div>
            </div>
            <div v-show="hisMedicalTab === 'exam'">
              <div class="mb-3"><label class="text-xs font-bold text-gray-600 block mb-1">生命体征</label><div class="text-sm p-2 bg-gray-50 border border-gray-200 rounded min-h-[40px]">{{ hisSelectedPatient.vitals }}</div></div>
              <div class="mb-3"><label class="text-xs font-bold text-gray-600 block mb-1">一般检查</label><div class="text-sm p-2 bg-gray-50 border border-gray-200 rounded min-h-[40px]">{{ hisSelectedPatient.examGeneral }}</div></div>
              <div class="mb-3"><label class="text-xs font-bold text-gray-600 block mb-1">专科检查</label><div class="text-sm p-2 bg-gray-50 border border-gray-200 rounded min-h-[60px]">{{ hisSelectedPatient.examSpecialty }}</div></div>
            </div>
            <div v-show="hisMedicalTab === 'diag'">
              <div class="space-y-2">
                <div v-for="(d, i) in hisSelectedPatient.diagList" :key="i" class="text-sm p-2 bg-blue-50 border border-blue-200 rounded flex items-center">
                  <span class="text-blue-800 font-bold mr-2">{{ i + 1 }}.</span><span>{{ d }}</span>
                </div>
              </div>
            </div>
            <div v-show="hisMedicalTab === 'treat'">
              <div class="space-y-2">
                <div v-for="(t, i) in hisSelectedPatient.treatList" :key="i" class="text-sm p-2 bg-gray-50 border border-gray-200 rounded flex items-start">
                  <span class="text-blue-800 font-bold mr-2">{{ i + 1 }}.</span><span>{{ t }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white border-t border-gray-300 shrink-0" style="max-height: 200px; overflow-y: auto;">
            <table class="w-full text-[11px]">
              <thead>
                <tr class="bg-gray-100 border-b border-gray-300">
                  <th class="py-1 px-2 text-left font-bold">药品名称</th><th class="py-1 px-2 text-left font-bold">规格</th><th class="py-1 px-2 text-left font-bold">用法</th><th class="py-1 px-2 text-left font-bold">用量</th><th class="py-1 px-2 text-left font-bold">频次</th><th class="py-1 px-2 text-left font-bold">天数</th><th class="py-1 px-2 text-left font-bold">数量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in hisSelectedPatient.prescription" :key="i" class="border-b border-gray-100">
                  <td v-for="(cell, j) in row" :key="j" class="py-1 px-2">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- HIS1 个人医保云数据共享 -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <div v-else-if="activeView === 'his1'" class="flex flex-col h-screen w-screen bg-white">
      <header class="his-top-nav-bar">
        <div class="his-top-nav-header flex items-center shrink-0 h-full">
          <img :src="logoPath" class="h-12" alt="Logo" />
          <span class="his-top-nav-title">个人医保云数据共享</span>
        </div>
        <nav class="flex h-full items-center flex-1 his-ant-header-menu">
          <a class="his-ant-menu-item" :class="activeNavTab === 'imaging' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging'"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询</span></a>
          <a class="his-ant-menu-item" :class="activeNavTab === 'imaging-cross' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging-cross'"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询(跨省)</span></a>
          <a class="his-ant-menu-item" :class="activeNavTab === 'inspection' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'inspection'"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>检验查询</span></a>
          <a class="his-ant-menu-item" :class="activeNavTab === 'overview' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'overview'; emit('navigate', 'overview')"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>参保人画像</span></a>
        </nav>
        <div class="his-top-nav-user"><span class="font-normal">陈**鑫</span><span class="opacity-20">|</span><span>常州市第七人民医院</span><span class="text-[9px] opacity-60 select-none">▼</span></div>
      </header>
      <div class="flex-1 relative" style="background: url('/his1.png') top center / 100% 100% no-repeat;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 360px; height: 280px; cursor: pointer;" @click="activeView = 'his2'"></div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- HIS2 授权确认 -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <div v-else-if="activeView === 'his2'" class="flex flex-col h-screen w-screen bg-white">
      <header class="his-top-nav-bar">
        <div class="his-top-nav-header flex items-center shrink-0 h-full">
          <img :src="logoPath" class="h-12" alt="Logo" />
          <span class="his-top-nav-title">个人医保云数据共享</span>
        </div>
        <nav class="flex h-full items-center flex-1 his-ant-header-menu">
          <a class="his-ant-menu-item" :class="activeNavTab === 'imaging' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging'"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询</span></a>
          <a class="his-ant-menu-item" :class="activeNavTab === 'imaging-cross' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging-cross'"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询(跨省)</span></a>
          <a class="his-ant-menu-item" :class="activeNavTab === 'inspection' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'inspection'"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>检验查询</span></a>
          <a class="his-ant-menu-item" :class="activeNavTab === 'overview' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'overview'; emit('navigate', 'overview')"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>参保人画像</span></a>
        </nav>
        <div class="his-top-nav-user"><span class="font-normal">陈**鑫</span><span class="opacity-20">|</span><span>常州市第七人民医院</span><span class="text-[9px] opacity-60 select-none">▼</span></div>
      </header>
      <div class="flex-1 relative" style="background: url('/his2.png') top center / 100% 100% no-repeat;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 360px; height: 280px; cursor: pointer;" @click="activeView = 'his3'"></div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- HIS3 授权结果 -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <div v-else-if="activeView === 'his3'" class="flex flex-col h-screen w-screen bg-white">
      <header class="his-top-nav-bar">
        <div class="his-top-nav-header flex items-center shrink-0 h-full">
          <img :src="logoPath" class="h-12" alt="Logo" />
          <span class="his-top-nav-title">个人医保云数据共享</span>
        </div>
        <nav class="flex h-full items-center flex-1 his-ant-header-menu">
          <a class="his-ant-menu-item" :class="activeNavTab === 'imaging' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging'"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询</span></a>
          <a class="his-ant-menu-item" :class="activeNavTab === 'imaging-cross' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'imaging-cross'"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>影像查询(跨省)</span></a>
          <a class="his-ant-menu-item" :class="activeNavTab === 'inspection' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'inspection'"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>检验查询</span></a>
          <a class="his-ant-menu-item" :class="activeNavTab === 'overview' ? 'his-ant-menu-item-selected' : ''" @click="activeNavTab = 'overview'; emit('navigate', 'overview')"><i class="his-ant-menu-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></i><span>参保人画像</span></a>
        </nav>
        <div class="his-top-nav-user"><span class="font-normal">陈**鑫</span><span class="opacity-20">|</span><span>常州市第七人民医院</span><span class="text-[9px] opacity-60 select-none">▼</span></div>
      </header>
      <div class="flex-1 overflow-hidden" style="background: url('/his3.png') top center / 100% 100% no-repeat;"></div>
    </div>

    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- 统一服务入口 / 工作台 -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <div v-else-if="activeView === 'unified-entry'" class="flex flex-col h-screen w-screen bg-slate-50 overflow-hidden">
      <header class="his-top-nav-bar">
        <div class="his-top-nav-header flex items-center shrink-0 h-full">
          <img :src="logoPath" class="h-12" alt="Logo" />
          <span class="his-top-nav-title">统一服务入口</span>
        </div>
        <nav class="flex h-full items-center his-ant-header-menu">
          <a class="his-ant-menu-item his-ant-menu-item-selected"><i class="his-ant-menu-item-icon"><UserCircle :size="14" /></i><span>工作台</span></a>
        </nav>
        <div class="flex-1"></div>
        <a-dropdown trigger="click">
          <div class="his-top-nav-user"><span class="font-normal">陈**鑫</span><span class="opacity-20">|</span><span>常州市第七人民医院</span><span class="text-[9px] opacity-60 select-none">▼</span></div>
          <template #overlay>
            <a-menu @click="({ key }) => emit('navigate', key)">
              <a-menu-item key="medintercept">用药实时拦截</a-menu-item>
              <a-menu-item key="rulesadapt">医保规则智能适配</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </header>

      <main class="flex-1 overflow-y-auto his-custom-scrollbar">
        <div class="max-w-[1400px] mx-auto px-8 py-8">
          <div class="mb-6 flex items-end justify-between">
            <div>
              <h1 class="text-2xl font-bold text-slate-900 tracking-tight">智能服务</h1>
              <p class="text-sm text-slate-500 mt-1">当前机构已授权的智能模型，点击进入对应业务系统</p>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-sm font-medium">{{ visibleWorkbenchModels.length }} 个可用模型</span>
            </div>
          </div>

          <div v-if="visibleWorkbenchModels.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="model in visibleWorkbenchModels" :key="model.id"
              class="group relative bg-white rounded-2xl p-5 shadow-sm border border-slate-100 cursor-pointer hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all overflow-hidden"
              @click="enterModel(model)"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm" :class="model.iconBgClass">
                  <component :is="getModelIconComponent(model.icon)" :size="26" :class="model.iconTextClass" />
                </div>
                <span class="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{{ model.vendorName }}</span>
              </div>
              <h3 class="text-base font-bold text-slate-900 mb-1.5">{{ model.name }}</h3>
              <p class="text-xs text-slate-500 leading-relaxed line-clamp-2">{{ model.desc }}</p>
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[10px] text-slate-400 font-medium">点击进入</span>
                <ChevronRight :size="14" class="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br opacity-[0.04] group-hover:opacity-[0.08] transition-opacity" :class="model.bgClass"></div>
            </div>
          </div>

          <div v-else class="bg-white rounded-2xl border border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center">
            <div class="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4"><Cpu :size="24" class="text-slate-300" /></div>
            <p class="text-sm font-bold text-slate-600 mb-1">当前机构暂无可用模型</p>
            <p class="text-xs text-slate-400">请联系管理员配置模型权限</p>
          </div>
        </div>
      </main>
    </div>

    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- 模型详情 -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <div v-else-if="activeView === 'model-detail'" class="flex flex-col h-screen w-screen bg-slate-50 overflow-hidden">
      <header class="his-top-nav-bar">
        <div class="his-top-nav-header flex items-center shrink-0 h-full">
          <img :src="logoPath" class="h-12" alt="Logo" />
          <span class="his-top-nav-title">统一服务入口</span>
        </div>
        <nav class="flex h-full items-center his-ant-header-menu">
          <a class="his-ant-menu-item his-ant-menu-item-selected"><i class="his-ant-menu-item-icon"><UserCircle :size="14" /></i><span>工作台</span></a>
        </nav>
        <div class="flex-1"></div>
        <a-dropdown trigger="click">
          <div class="his-top-nav-user"><span class="font-normal">陈**鑫</span><span class="opacity-20">|</span><span>常州市第七人民医院</span><span class="text-[9px] opacity-60 select-none">▼</span></div>
          <template #overlay><a-menu /></template>
        </a-dropdown>
      </header>

      <main class="flex-1 overflow-y-auto his-custom-scrollbar">
        <div class="max-w-[1400px] mx-auto px-8 py-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2 text-xs text-slate-400">
              <span class="cursor-pointer hover:text-blue-600" @click="setActiveView('unified-entry')">工作台</span>
              <ChevronRight :size="12" />
              <span class="text-slate-600 font-medium">{{ selectedModel?.name || '模型详情' }}</span>
            </div>
            <button @click="setActiveView('unified-entry')" class="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors">
              <ChevronLeft :size="14" /> 返回工作台
            </button>
          </div>

          <div v-if="selectedModel" class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
            <div class="flex items-start gap-5">
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" :class="selectedModel.iconBgClass">
                <component :is="getModelIconComponent(selectedModel.icon)" :size="30" :class="selectedModel.iconTextClass" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h1 class="text-xl font-bold text-slate-900">{{ selectedModel.name }}</h1>
                  <span class="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{{ selectedModel.vendorName }}</span>
                </div>
                <p class="text-sm text-slate-500 leading-relaxed">{{ selectedModel.desc }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button class="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">使用文档</button>
                <button class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1"><Plus :size="12" /> 新建任务</button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4 mb-5">
            <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p class="text-[11px] text-slate-500 font-medium uppercase tracking-wider">今日调用</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">128 <span class="text-xs text-slate-400 font-normal">次</span></p>
              <p class="text-[11px] text-emerald-600 mt-1 font-medium">↑ 12.5% vs 昨日</p>
            </div>
            <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p class="text-[11px] text-slate-500 font-medium uppercase tracking-wider">本月累计</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">3,420 <span class="text-xs text-slate-400 font-normal">次</span></p>
              <p class="text-[11px] text-emerald-600 mt-1 font-medium">↑ 8.3% vs 上月</p>
            </div>
            <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p class="text-[11px] text-slate-500 font-medium uppercase tracking-wider">平均耗时</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">2.3 <span class="text-xs text-slate-400 font-normal">秒</span></p>
              <p class="text-[11px] text-slate-500 mt-1 font-medium">P95: 4.1s</p>
            </div>
            <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p class="text-[11px] text-slate-500 font-medium uppercase tracking-wider">采纳率</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">86.4 <span class="text-xs text-slate-400 font-normal">%</span></p>
              <p class="text-[11px] text-emerald-600 mt-1 font-medium">↑ 2.1% vs 上月</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 class="text-base font-bold text-slate-900">最近任务</h3>
              <div class="flex items-center gap-2">
                <select class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-blue-400">
                  <option>全部状态</option><option>已完成</option><option>处理中</option><option>失败</option>
                </select>
                <button class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">查询</button>
              </div>
            </div>
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500">
                  <th class="px-5 py-3 text-left font-semibold">任务编号</th><th class="px-5 py-3 text-left font-semibold">患者</th><th class="px-5 py-3 text-left font-semibold">就诊类型</th><th class="px-5 py-3 text-left font-semibold">调用时间</th><th class="px-5 py-3 text-left font-semibold">耗时</th><th class="px-5 py-3 text-left font-semibold">状态</th><th class="px-5 py-3 text-right font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in [
                  { id: 'T20260728001', patient: '陈志明', visit: '门诊', time: '2026-07-28 09:23:15', dur: '2.1s', status: '已完成' },
                  { id: 'T20260728002', patient: '王秀兰', visit: '住院', time: '2026-07-28 10:15:42', dur: '2.8s', status: '已完成' },
                  { id: 'T20260728003', patient: '张伟', visit: '门诊', time: '2026-07-28 11:02:08', dur: '1.9s', status: '已完成' },
                  { id: 'T20260728004', patient: '李芳', visit: '门诊', time: '2026-07-28 11:48:33', dur: '3.2s', status: '处理中' },
                  { id: 'T20260728005', patient: '刘建国', visit: '住院', time: '2026-07-28 13:21:09', dur: '2.5s', status: '已完成' },
                ]" :key="i" class="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td class="px-5 py-3 font-mono text-xs text-slate-500">{{ row.id }}</td>
                  <td class="px-5 py-3 font-bold text-slate-900">{{ row.patient }}</td>
                  <td class="px-5 py-3"><span class="text-[11px] font-medium px-2 py-0.5 rounded-full" :class="row.visit === '门诊' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-purple-50 text-purple-700 border border-purple-100'">{{ row.visit }}</span></td>
                  <td class="px-5 py-3 text-slate-600 text-xs">{{ row.time }}</td>
                  <td class="px-5 py-3 text-slate-600 font-mono text-xs">{{ row.dur }}</td>
                  <td class="px-5 py-3"><span class="text-[11px] font-medium px-2 py-0.5 rounded-full" :class="row.status === '已完成' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'">{{ row.status }}</span></td>
                  <td class="px-5 py-3 text-right"><button class="text-xs text-blue-600 hover:text-blue-700 font-medium">查看</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- ════════════════════════════════════════════════════════════ -->
    <!-- AI辅助诊断 -->
    <!-- ════════════════════════════════════════════════════════════ -->
    <div v-else-if="activeView === 'ai-diagnosis'" class="flex flex-col h-screen w-screen bg-white overflow-hidden">
      <header class="his-top-nav-bar">
        <div class="his-top-nav-header flex items-center shrink-0 h-full">
          <img :src="logoPath" class="h-12" alt="Logo" />
          <span class="his-top-nav-title">个人医保云数据共享</span>
          <span class="his-top-nav-sep"></span>
          <span class="his-top-nav-subtitle">AI辅助诊断</span>
        </div>
        <nav class="flex h-full items-center his-ant-header-menu">
          <a class="his-ant-menu-item" @click="emit('navigate', 'overview')"><i class="his-ant-menu-item-icon"><UserCircle :size="14" /></i><span>参保人画像</span></a>
          <a class="his-ant-menu-item" @click="emit('navigate', 'health')"><i class="his-ant-menu-item-icon"><Activity :size="14" /></i><span>医保健康档案</span></a>
          <a class="his-ant-menu-item" @click="emit('navigate', 'finance')"><i class="his-ant-menu-item-icon"><CreditCard :size="14" /></i><span>医保财务档案</span></a>
          <a class="his-ant-menu-item" @click="emit('navigate', 'info')"><i class="his-ant-menu-item-icon"><Info :size="14" /></i><span>医保信息档案</span></a>
        </nav>
        <a-dropdown trigger="click">
          <div class="his-top-nav-user"><span class="font-normal">张兮兮</span><span class="opacity-20">|</span><span>常州市第七人民医院</span><span class="text-[9px] opacity-60 select-none">▼</span></div>
          <template #overlay>
            <a-menu @click="({ key }) => emit('navigate', key)">
              <a-menu-item key="medintercept">用药实时拦截</a-menu-item>
              <a-menu-item key="rulesadapt">医保规则智能适配</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </header>

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
            <option>全部状态</option><option>待诊断</option><option>诊断中</option><option>已完成</option>
          </select>
          <select class="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>全部科室</option><option>内科</option><option>外科</option><option>急诊科</option>
          </select>
          <button class="px-4 py-2 bg-blue-600 text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" style="color: #fff">查询</button>
          <button class="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            重置
          </button>
        </div>
      </div>

      <div style="flex: 1; padding: 20px; overflow-y: auto; background: #f1f5f9;">
        <div style="margin-bottom: 16px;">
          <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            AI诊断结果列表
          </h3>
        </div>

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
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span></td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">CT肺结节AI筛查</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-15 10:23:15</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">陈志明</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3204**********1263</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">男</td><td style="padding: 12px 16px; font-size: 12px; color: #64748b;">42</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">门诊</td><td style="padding: 12px 16px; font-size: 12px; color: #334155;">放射科</td>
                <td style="padding: 12px 16px;"><div class="flex items-center gap-2"><span class="text-xs font-bold text-purple-600">89.5</span><svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div></td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2</td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-blue-100 text-blue-700 text-[11px] font-medium rounded-full">诊断中</span></td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">心电图AI智能分析</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-15 09:45:22</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">王小红</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3205**********8741</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">女</td><td style="padding: 12px 16px; font-size: 12px; color: #64748b;">35</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">门诊</td><td style="padding: 12px 16px; font-size: 12px; color: #334155;">心内科</td>
                <td style="padding: 12px 16px;"><div class="flex items-center gap-2"><span class="text-xs font-bold text-purple-600">82.3</span><svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div></td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-blue-100 text-blue-700 text-[11px] font-medium rounded-full">进行中</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">3</td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span></td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">病理切片AI筛查</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-15 08:30:12</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">李明华</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3206**********5628</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">男</td><td style="padding: 12px 16px; font-size: 12px; color: #64748b;">58</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">住院</td><td style="padding: 12px 16px; font-size: 12px; color: #334155;">病理科</td>
                <td style="padding: 12px 16px;"><div class="flex items-center gap-2"><span class="text-xs font-bold text-purple-600">94.1</span><svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div></td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">4</td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span></td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">临床决策支持</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-14 16:22:33</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">张丽华</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3207**********9834</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">女</td><td style="padding: 12px 16px; font-size: 12px; color: #64748b;">62</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">住院</td><td style="padding: 12px 16px; font-size: 12px; color: #334155;">内科</td>
                <td style="padding: 12px 16px;"><div class="flex items-center gap-2"><span class="text-xs font-bold text-purple-600">87.8</span><svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div></td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">5</td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-amber-100 text-amber-700 text-[11px] font-medium rounded-full">待审核</span></td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">用药风险AI评估</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-14 14:15:47</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">刘海波</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3208**********6721</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">男</td><td style="padding: 12px 16px; font-size: 12px; color: #64748b;">47</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">门诊</td><td style="padding: 12px 16px; font-size: 12px; color: #334155;">药剂科</td>
                <td style="padding: 12px 16px;"><div class="flex items-center gap-2"><span class="text-xs font-bold text-purple-600">91.2</span><svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div></td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-amber-100 text-amber-700 text-[11px] font-medium rounded-full">待审核</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">6</td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-blue-100 text-blue-700 text-[11px] font-medium rounded-full">诊断中</span></td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">慢病风险预测</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-14 11:05:30</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">赵云龙</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3209**********3451</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">男</td><td style="padding: 12px 16px; font-size: 12px; color: #64748b;">56</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">体检</td><td style="padding: 12px 16px; font-size: 12px; color: #334155;">内分泌科</td>
                <td style="padding: 12px 16px;"><div class="flex items-center gap-2"><span class="text-xs font-bold text-purple-600">76.4</span><span style="font-size: 10px; color: #94a3b8;">—</span></div></td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-blue-100 text-blue-700 text-[11px] font-medium rounded-full">进行中</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">7</td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span></td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">检验结果智能解读</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-13 09:20:18</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">孙晓芬</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3210**********7294</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">女</td><td style="padding: 12px 16px; font-size: 12px; color: #64748b;">51</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">门诊</td><td style="padding: 12px 16px; font-size: 12px; color: #334155;">检验科</td>
                <td style="padding: 12px 16px;"><div class="flex items-center gap-2"><span class="text-xs font-bold text-purple-600">95.8</span><svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div></td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-green-100 text-green-700 text-[11px] font-medium rounded-full">已完成</span></td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">8</td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-amber-100 text-amber-700 text-[11px] font-medium rounded-full">待审核</span></td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">手术风险评估</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">2024-06-13 15:42:05</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #334155;">周国强</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-family: monospace;">3211**********5083</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">男</td><td style="padding: 12px 16px; font-size: 12px; color: #64748b;">68</td>
                <td style="padding: 12px 16px; font-size: 12px; color: #64748b;">住院</td><td style="padding: 12px 16px; font-size: 12px; color: #334155;">普外科</td>
                <td style="padding: 12px 16px;"><div class="flex items-center gap-2"><span class="text-xs font-bold text-purple-600">73.6</span><span style="font-size: 10px; color: #f59e0b;">⚠</span></div></td>
                <td style="padding: 12px 16px;"><span class="px-2 py-1 bg-amber-100 text-amber-700 text-[11px] font-medium rounded-full">待审核</span></td>
              </tr>
            </tbody>
          </table>

          <div style="padding: 16px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: flex-end; gap: 12px;">
            <span class="text-xs text-slate-500">显示 1-5 条，共 128 条记录</span>
            <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">上一页</button>
            <button class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">1</button>
            <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">2</button>
            <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">3</button>
            <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">...</button>
            <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">26</button>
            <button class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">下一页</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════
   顶部导航栏（个人医保云 / 统一服务入口 通用）
   ═══════════════════════════════════════════════════════ */
.his-top-nav-bar {
  width: 100%;
  height: 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  position: relative;
  flex-shrink: 0;
}

.his-top-nav-header {
  height: 64px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 64px;
  font-feature-settings: "tnum";
  margin: 0 0 0 12px;
}

.his-top-nav-title {
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

.his-top-nav-subtitle {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-left: 0;
  white-space: nowrap;
}

.his-top-nav-sep {
  width: 1px;
  height: 14px;
  background: #e5e7eb;
  margin: 0 8px;
}

.his-top-nav-user {
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

.his-top-nav-user:hover {
  color: rgba(0, 0, 0, 0.85);
}

/* Ant Design 风格菜单 */
.his-ant-header-menu {
  margin-left: 24px;
}

.his-ant-menu-item {
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

.his-ant-menu-item:hover {
  color: #1890ff;
}

.his-ant-menu-item-selected {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.his-ant-menu-item-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  font-size: 14px;
}

.his-ant-menu-item-icon svg {
  display: block;
}

.his-ant-menu-item:focus,
.his-ant-menu-item:active,
.his-ant-menu-item:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* 自定义滚动条（隐藏） */
.his-custom-scrollbar::-webkit-scrollbar {
  display: none;
}

.his-custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
