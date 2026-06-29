<template>
  <div class="dicom-page">
    <div class="dicom-header">
      <div class="dh-left" @click="$emit('back')">
        <ChevronLeft :size="20" />
        <span class="dh-title">影像阅片中心</span>
      </div>
      <div class="dh-center">
        <div class="dh-patient">
          <span class="dhp-name">{{ patient?.name }}</span>
          <span class="dhp-meta">{{ patient?.gender }} / {{ patient?.age }}岁 / ID: {{ patient?.id }}</span>
        </div>
      </div>
      <div class="dh-right">
        <button class="dh-btn"><Share2 :size="16" /> 分享</button>
        <button class="dh-btn"><Download :size="16" /> 下载</button>
        <button class="dh-btn-p" @click="$emit('back')">退出阅片</button>
      </div>
    </div>

    <div class="dicom-container">
      <!-- Left Sidebar: Thumbnails -->
      <div class="dicom-side">
        <div class="ds-title">序列 (4)</div>
        <div class="ds-list">
          <div v-for="i in 4" :key="i" :class="['ds-item', i === 1 ? 'on' : '']">
            <div class="ds-thumb">
              <img :src="dicomImage" alt="Thumb" referrerPolicy="no-referrer" />
              <div class="ds-badge">{{ 12 * i }}</div>
            </div>
            <div class="ds-info">
              <div class="ds-name">Series {{ i }}</div>
              <div class="ds-meta">{{ modalityFull }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Viewer -->
      <div class="dicom-viewport">
        <div class="dv-tools">
          <div class="dv-tool-group">
            <button class="dv-tool-btn active"><MousePointer2 :size="18" /> 选择</button>
            <button class="dv-tool-btn"><Search :size="18" /> 缩放</button>
            <button class="dv-tool-btn"><Sun :size="18" /> 窗宽窗位</button>
            <button class="dv-tool-btn"><Move :size="18" /> 平移</button>
          </div>
          <div class="dv-tool-group">
            <button class="dv-tool-btn"><Ruler :size="18" /> 测量</button>
            <button class="dv-tool-btn"><Type :size="18" /> 标注</button>
            <button class="dv-tool-btn"><RotateCw :size="18" /> 旋转</button>
            <button class="dv-tool-btn"><FlipHorizontal :size="18" /> 镜像</button>
          </div>
          <div class="dv-tool-group">
            <button class="dv-tool-btn"><LayoutGrid :size="18" /> 布局</button>
            <button class="dv-tool-btn"><Play :size="18" /> 播放</button>
          </div>
        </div>

        <div class="dv-stage">
          <div class="dv-img-container">
            <img :src="dicomImage" class="dv-img" alt="Main DICOM" referrerPolicy="no-referrer" />

            <!-- Overlays -->
            <div class="dv-overlay dv-tl">
              <div>{{ patient?.name }} [{{ patient?.gender }}, {{ patient?.age }}Y]</div>
              <div>ID: {{ patient?.id }}</div>
              <div>DOB: 1982-05-12</div>
            </div>
            <div class="dv-overlay dv-tr">
              <div>{{ record?.hosp || '南京大学医学院附属鼓楼医院' }}</div>
              <div>{{ examName }}</div>
              <div>{{ record?.date || '2024-05-16 10:24:15' }}</div>
            </div>
            <div class="dv-overlay dv-bl" v-if="!isUltrasound">
              <div>KV: 120</div>
              <div>mAs: 250</div>
              <div>Thick: 1.5mm</div>
              <div>Loc: -142.50mm</div>
            </div>
            <div class="dv-overlay dv-bl" v-else>
              <div>Freq: 9.0 MHz</div>
              <div>Depth: 4.0 cm</div>
              <div>Gain: 55 dB</div>
              <div>PRF: 5.0 kHz</div>
            </div>
            <div class="dv-overlay dv-br">
              <div v-if="!isUltrasound">W: 1500</div>
              <div v-if="!isUltrasound">L: -500</div>
              <div>Se: 4 Im: 12/48</div>
            </div>

            <!-- Orientation markers -->
            <div class="dv-marker dv-m-t">S</div>
            <div class="dv-marker dv-m-b">I</div>
            <div class="dv-marker dv-m-l">R</div>
            <div class="dv-marker dv-m-r">L</div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar: Info/Report -->
      <div class="dicom-info">
        <div class="di-tabs">
          <div :class="['di-tab', activeTab === 'info' ? 'on' : '']" @click="activeTab = 'info'">检查信息</div>
          <div :class="['di-tab', activeTab === 'ai' ? 'on' : '']" @click="activeTab = 'ai'">AI 辅助诊断</div>
        </div>
        <div class="di-content">
          <div v-if="activeTab === 'info'">
            <div class="di-section">
              <div class="di-sec-hd">项目信息</div>
              <div class="di-grid">
                <div class="di-row"><span>项目：</span>{{ examName }}</div>
                <div class="di-row"><span>设备：</span>{{ equipment }}</div>
                <div class="di-row"><span>部位：</span>{{ bodyPart }}</div>
                <div class="di-row"><span>日期：</span>{{ record?.date || '2024-05-16' }}</div>
              </div>
            </div>
            <div class="di-section">
              <div class="di-sec-hd">临床诊断</div>
              <div class="di-text">{{ isUltrasound ? '头晕待查，颈部血管评估。' : '高血压，心影增大待查。' }}</div>
            </div>
            <div class="di-section">
              <div class="di-sec-hd">影像表现</div>
              <div class="di-text">{{ isUltrasound ? '颈总动脉内径正常，内膜-中膜厚度（IMT）1.2mm，内膜毛糙，未见明显斑块形成。颈内动脉、颈外动脉血流频谱形态正常，流速在正常范围内。椎动脉血流方向正常，阻力指数正常。' : '双肺纹理增多、增粗，走行尚自然。肺野内未见明显实质性浸润影。左肺下叶见一直径约3mm微小结节影，边界清晰。气管及主要支气管通畅。纵隔未见明显肿大淋巴结。心影增大。双侧胸膜无增厚，胸腔未见积液。' }}</div>
            </div>
            <div class="di-section">
              <div class="di-sec-hd">诊断结论</div>
              <div class="di-text" style="color: var(--red); font-weight: 600">{{ isUltrasound ? '1. 颈动脉内膜毛糙；2. IMT增厚，建议定期复查；3. 未见明显斑块及狭窄。' : '1. 双肺纹理增多；2. 左肺下叶微小结节，建议随访；3. 心影增大，请结合临床。' }}</div>
            </div>
          </div>
          
          <div v-if="activeTab === 'ai'" class="ai-report">
            <!-- CT: 结节检测 -->
            <template v-if="!isUltrasound">
              <div class="di-section">
                <div class="di-sec-hd" style="display: flex; align-items: center; gap: 4px;">
                  <Activity :size="14" style="color: var(--blue);" />
                  AI 结节检测
                </div>
                <div class="ai-stat-box">
                  <div class="ai-stat-item">
                    <div class="ai-stat-val">1</div>
                    <div class="ai-stat-lbl">检出结节</div>
                  </div>
                  <div class="ai-stat-item">
                    <div class="ai-stat-val" style="color: var(--amber)">低</div>
                    <div class="ai-stat-lbl">恶性风险</div>
                  </div>
                </div>
              </div>

              <div class="di-section">
                <div class="di-sec-hd">检出详情 (1)</div>
                <div class="ai-nodule-card">
                  <div class="anc-header">
                    <span class="anc-id">#1</span>
                    <span class="anc-type">实性结节</span>
                    <span class="anc-prob">恶性概率: 12%</span>
                  </div>
                  <div class="anc-body">
                    <div class="anc-row"><span>位置：</span>左肺下叶</div>
                    <div class="anc-row"><span>大小：</span>3.2mm x 2.8mm</div>
                    <div class="anc-row"><span>密度：</span>35 HU</div>
                    <div class="anc-row"><span>特征：</span>边界清晰, 无分叶</div>
                  </div>
                </div>
              </div>

              <div class="di-section">
                <div class="di-sec-hd">AI 辅助建议</div>
                <div class="ai-text-box">
                  该结节较小，形态规则，恶性概率较低。建议根据 Lung-RADS 分级进行定期随访 (建议 6-12 个月复查)。
                </div>
              </div>
            </template>

            <!-- Ultrasound: 血管评估 -->
            <template v-else>
              <div class="di-section">
                <div class="di-sec-hd" style="display: flex; align-items: center; gap: 4px;">
                  <Activity :size="14" style="color: var(--blue);" />
                  AI 血管分析
                </div>
                <div class="ai-stat-box">
                  <div class="ai-stat-item">
                    <div class="ai-stat-val">1.2</div>
                    <div class="ai-stat-lbl">IMT (mm)</div>
                  </div>
                  <div class="ai-stat-item">
                    <div class="ai-stat-val" style="color: var(--amber)">轻度</div>
                    <div class="ai-stat-lbl">增厚程度</div>
                  </div>
                </div>
              </div>

              <div class="di-section">
                <div class="di-sec-hd">血流动力学评估</div>
                <div class="ai-nodule-card">
                  <div class="anc-header">
                    <span class="anc-id">CCA</span>
                    <span class="anc-type">颈总动脉</span>
                    <span class="anc-prob">PSV: 85 cm/s</span>
                  </div>
                  <div class="anc-body">
                    <div class="anc-row"><span>EDV：</span>22 cm/s</div>
                    <div class="anc-row"><span>RI：</span>0.74</div>
                    <div class="anc-row"><span>斑块：</span>未见明显斑块</div>
                    <div class="anc-row"><span>狭窄率：</span>&lt; 50%</div>
                  </div>
                </div>
              </div>

              <div class="di-section">
                <div class="di-sec-hd">AI 辅助建议</div>
                <div class="ai-text-box">
                  颈动脉内膜轻度增厚，未见明显斑块及狭窄，血流动力学参数正常。建议控制血压血脂，每年复查颈部血管超声。
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChevronLeft,
  Share2,
  Download,
  MousePointer2,
  Search,
  Sun,
  Move,
  Ruler,
  Type,
  RotateCw,
  FlipHorizontal,
  LayoutGrid,
  Play,
  Activity
} from 'lucide-vue-next';

const props = defineProps<{
  patient: any;
  record: any;
}>();

defineEmits(['back']);

const activeTab = ref('ai');

const isUltrasound = computed(() => {
  const dept = props.record?.dept || '';
  const diag = props.record?.diag || props.record?.title || '';
  return dept === '超声科' || diag.includes('超声') || diag.includes('彩超');
});

const dicomImage = computed(() => isUltrasound.value ? '/超声.png' : '/dicom.png');

const modalityLabel = computed(() => isUltrasound.value ? 'US' : 'CT');
const modalityFull = computed(() => isUltrasound.value ? 'Ultrasound' : 'CT Chest');
const examName = computed(() => props.record?.diag || props.record?.title || (isUltrasound.value ? '彩色多普勒超声' : '胸部CT平扫'));
const equipment = computed(() => isUltrasound.value ? 'Philips EPIQ 7' : 'GE Revolution CT');
const bodyPart = computed(() => isUltrasound.value ? '颈部血管' : '胸部');
</script>

<style scoped>
.dicom-page {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  color: #fff;
}

.dicom-header {
  height: 56px;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;
}

.dh-left {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.dh-left:hover {
  opacity: 0.8;
}

.dh-title {
  font-size: 16px;
  font-weight: 600;
}

.dh-patient {
  text-align: center;
}

.dhp-name {
  font-size: 15px;
  font-weight: 600;
  margin-right: 12px;
}

.dhp-meta {
  font-size: 12px;
  color: #aaa;
}

.dh-right {
  display: flex;
  gap: 12px;
}

.dh-btn {
  background: #333;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.dh-btn:hover {
  background: #444;
}

.dh-btn-p {
  background: var(--blue);
  border: none;
  color: #fff;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.dicom-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.dicom-side {
  width: 160px;
  background: #111;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.ds-title {
  padding: 12px;
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ds-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
}

.ds-item {
  margin-bottom: 16px;
  cursor: pointer;
}

.ds-thumb {
  position: relative;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  aspect-ratio: 1;
}

.ds-item.on .ds-thumb {
  border-color: var(--blue);
}

.ds-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ds-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0,0,0,0.6);
  padding: 2px 4px;
  font-size: 10px;
  border-radius: 2px;
}

.ds-info {
  margin-top: 6px;
}

.ds-name {
  font-size: 12px;
  font-weight: 600;
}

.ds-meta {
  font-size: 10px;
  color: #666;
}

.dicom-viewport {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #000;
}

.dv-tools {
  height: 48px;
  background: #222;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 24px;
  border-bottom: 1px solid #333;
}

.dv-tool-group {
  display: flex;
  gap: 4px;
}

.dv-tool-btn {
  background: transparent;
  border: none;
  color: #aaa;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0;
}

.dv-tool-btn:hover {
  background: #333;
  color: #fff;
}

.dv-tool-btn.active {
  background: #444;
  color: var(--blue);
}

.dv-stage {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.dv-img-container {
  position: relative;
  max-width: 100%;
  max-height: 100%;
}

.dv-img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}

.dv-overlay {
  position: absolute;
  padding: 12px;
  font-size: 12px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  pointer-events: none;
  line-height: 1.5;
  font-family: monospace;
}

.dv-tl { top: 0; left: 0; }
.dv-tr { top: 0; right: 0; text-align: right; }
.dv-bl { bottom: 0; left: 0; }
.dv-br { bottom: 0; right: 0; text-align: right; }

.dv-marker {
  position: absolute;
  font-size: 14px;
  font-weight: 700;
  color: var(--amber);
  pointer-events: none;
}

.dv-m-t { top: 10px; left: 50%; transform: translateX(-50%); }
.dv-m-b { bottom: 10px; left: 50%; transform: translateX(-50%); }
.dv-m-l { left: 10px; top: 50%; transform: translateY(-50%); }
.dv-m-r { right: 10px; top: 50%; transform: translateY(-50%); }

.dicom-info {
  width: 300px;
  background: #1a1a1a;
  border-left: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.di-tabs {
  display: flex;
  border-bottom: 1px solid #333;
  background: #111;
}

.di-tab {
  flex: 1;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  color: #999;
  transition: all 0.15s;
  font-weight: 500;
}

.di-tab:hover {
  color: #ddd;
}

.di-tab.on {
  color: #fff;
  border-bottom: 2px solid #3b82f6;
  font-weight: 600;
}

.di-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.di-section {
  margin-bottom: 20px;
}

.di-sec-hd {
  font-size: 14px;
  color: #ddd;
  margin-bottom: 10px;
  font-weight: 600;
}

.di-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.di-row {
  font-size: 13px;
  color: #fff;
}

.di-row span {
  color: #aaa;
}

.di-text {
  font-size: 13px;
  line-height: 1.7;
  color: #fff;
}

/* AI Report */
.ai-report {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-stat-box {
  display: flex;
  gap: 12px;
  background: #222;
  padding: 16px 12px;
  border-radius: 8px;
  margin-top: 8px;
  border: 1px solid #444;
}

.ai-stat-item {
  flex: 1;
  text-align: center;
}

.ai-stat-val {
  font-size: 22px;
  font-weight: 700;
  color: #60a5fa;
}

.ai-stat-lbl {
  font-size: 12px;
  color: #ddd;
  margin-top: 4px;
  font-weight: 500;
}

.ai-nodule-card {
  background: #222;
  border-radius: 8px;
  padding: 14px;
  border-left: 3px solid #3b82f6;
}

.anc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
}

.anc-id {
  font-weight: 700;
  color: #60a5fa;
  font-size: 15px;
}

.anc-type {
  color: #fff;
  font-weight: 600;
}

.anc-prob {
  color: #aaa;
  font-size: 11px;
}

.anc-body {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.anc-row {
  font-size: 13px;
  color: #fff;
  line-height: 1.5;
}

.anc-row span {
  color: #aaa;
}

.ai-text-box {
  background: #222;
  border: 1px solid #444;
  padding: 14px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.7;
  color: #fff;
}
</style>
