<template>
  <div class="annotation-container" style="width:100%;height:100%;display:flex;justify-content:center;">
    <svg
      width="100%"
      height="100%"
      viewBox="10 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      style="display: block;"
    >
      <!-- 人体图片 -->
      <image
        v-if="bodyImageSrc"
        :href="bodyImageSrc"
        x="-120" y="-865"
        width="1040" height="2329"
        preserveAspectRatio="xMidYMid meet"
        style="opacity: 0.85"
      />

      <!-- 标注层 -->
      <g v-for="btn in buttons" :key="btn.id" :style="{ cursor: btn.disabled ? 'not-allowed' : 'pointer', opacity: btn.disabled ? 0.4 : 1 }" @click="!btn.disabled && $emit('button-click', btn.id)">
        <!-- 呼吸灯动效层 -->
        <circle :cx="btn.dotX" :cy="btn.dotY" r="4" fill="none" :stroke="btn.color" stroke-width="2" style="opacity: 0">
          <animate attributeName="r" from="4" :to="String(btn.ringR ?? 26)" :dur="`${btn.ringDur ?? 3.5}s`" :begin="`${btn.ringDelay ?? 0}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" :dur="`${btn.ringDur ?? 3.5}s`" :begin="`${btn.ringDelay ?? 0}s`" repeatCount="indefinite" />
        </circle>

        <!-- 核心标注点 -->
        <circle :cx="btn.dotX" :cy="btn.dotY" r="3.5" :fill="btn.color" stroke="#FFFFFF" stroke-width="1" />

        <!-- 连线 -->
        <polyline :points="getPoints(btn)" fill="none" :stroke="btn.color" stroke-width="1" />

        <!-- 标注信息框 - 添加边框以便与背景区分 -->
        <rect :x="btn.boxX" :y="btn.boxY" :width="BOX_W" :height="getBoxHeight(btn)" rx="4" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="0.5" />
        
        <!-- 左侧边框（靠近中间的边框加强） -->
        <line v-if="btn.side === 'left'" :x1="btn.boxX + BOX_W" :y1="btn.boxY + 5" :x2="btn.boxX + BOX_W" :y2="btn.boxY + getBoxHeight(btn) - 5" :stroke="btn.color" stroke-width="1.5" />
        
        <!-- 右侧边框（靠近中间的边框加强） -->
        <line v-if="btn.side === 'right'" :x1="btn.boxX" :y1="btn.boxY + 5" :x2="btn.boxX" :y2="btn.boxY + getBoxHeight(btn) - 5" :stroke="btn.color" stroke-width="1.5" />

        <polyline :points="getTopLeftBracket(btn)" fill="none" :stroke="btn.color" stroke-width="1" />
        <polyline :points="getBottomRightBracket(btn, getBoxHeight(btn))" fill="none" :stroke="btn.color" stroke-width="1" />

        <!-- 标题和点击查看在同一行 -->
        <g :transform="`translate(${btn.boxX + 10}, ${btn.boxY + BOX_H * 0.45})`">
          <text dominant-baseline="central" style="font-size: 11px; font-weight: bold; fill: #1e293b;">{{ btn.label }}</text>
          <text :x="BOX_W - 55" dominant-baseline="central" :style="{ fontSize: '9px', fill: btn.disabled ? '#cbd5e1' : '#64748b', fontWeight: 500 }">{{ btn.disabled ? '暂不可用' : '点击查看' }}</text>
        </g>

        <!-- 近三次记录 -->
        <g v-if="btn.recentRecords && btn.recentRecords.length > 0">
          <line :x1="btn.boxX + 10" :y1="btn.boxY + BOX_H" :x2="btn.boxX + BOX_W - 10" :y2="btn.boxY + BOX_H" stroke="#E2E8F0" stroke-width="0.5" />
          <template v-for="(record, index) in btn.recentRecords" :key="index">
            <rect
              :x="btn.boxX + 2" :y="btn.boxY + BOX_H + 2 + index * 18"
              :width="BOX_W - 4" height="18" rx="2"
              fill="transparent" stroke="transparent"
              style="cursor: pointer;"
              @click.stop="record.record && $emit('record-click', record.record)"
              @mouseenter="(e) => { const el = (e.target as SVGElement); el.setAttribute('fill', '#f0f9ff'); }"
              @mouseleave="(e) => { const el = (e.target as SVGElement); el.setAttribute('fill', 'transparent'); }"
            />
            <text :x="btn.boxX + 11" :y="btn.boxY + BOX_H + 14 + index * 18" dominant-baseline="central" style="font-size: 9px; fill: #94a3b8; pointer-events: none;">{{ record.date.slice(5) }}</text>
            <text :x="btn.boxX + 44" :y="btn.boxY + BOX_H + 14 + index * 18" dominant-baseline="central" style="font-size: 9px; fill: #475569; pointer-events: none;">{{ record.type.length > 5 ? record.type.substring(0, 5) + '..' : record.type }}</text>
            <text :x="btn.boxX + 88" :y="btn.boxY + BOX_H + 14 + index * 18" dominant-baseline="central" style="font-size: 9px; fill: #06B6D4; pointer-events: none;">{{ record.result }}</text>
          </template>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">

export interface PortraitButton {
  id: string;
  label: string;
  icon: string;
  dotX: number;
  dotY: number;
  boxX: number;
  boxY: number;
  side: 'left' | 'right';
  color: string;
  ringR?: number;
  ringDur?: number;
  ringDelay?: number;
  disabled?: boolean;
  recentRecords?: {
    date: string;
    type: string;
    result: string;
    record?: any;
  }[];
}

const BOX_W = 160;
const BOX_H = 50;

const props = withDefaults(defineProps<{
  bodyImageSrc?: string;
  buttons?: PortraitButton[];
}>(), {
  bodyImageSrc: '',
  buttons: () => [],
});

defineEmits<{
  'button-click': [id: string];
  'record-click': [record: any];
}>();

function getBoxEdgeX(btn: PortraitButton) {
  return btn.side === 'right' ? btn.boxX : btn.boxX + BOX_W;
}
function getBoxMidY(btn: PortraitButton) {
  return btn.boxY + BOX_H / 2;
}
function getBoxHeight(btn: PortraitButton) {
  if (btn.recentRecords && btn.recentRecords.length > 0) {
    return BOX_H + 6 + btn.recentRecords.length * 18;
  }
  return BOX_H;
}
function getPoints(btn: PortraitButton) {
  const bendX = btn.side === 'right' ? btn.dotX + 30 : btn.dotX - 30;
  return `${btn.dotX},${btn.dotY} ${bendX},${btn.dotY} ${getBoxEdgeX(btn)},${getBoxMidY(btn)}`;
}
function getTopLeftBracket(btn: PortraitButton) {
  return `${btn.boxX},${btn.boxY + 8} ${btn.boxX},${btn.boxY} ${btn.boxX + 8},${btn.boxY}`;
}
function getBottomRightBracket(btn: PortraitButton, boxHeight: number = BOX_H) {
  const bx2 = btn.boxX + BOX_W;
  const by2 = btn.boxY + boxHeight;
  return `${bx2},${by2 - 8} ${bx2},${by2} ${bx2 - 8},${by2}`;
}
</script>
