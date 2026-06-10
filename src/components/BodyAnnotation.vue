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
      <g v-for="btn in buttons" :key="btn.id" style="cursor: pointer;" @click="$emit('button-click', btn.id)">
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
          <text :x="BOX_W - 55" dominant-baseline="central" style="font-size: 9px; fill: #64748b; font-weight: 500;">点击查看</text>
        </g>

        <!-- 近三次记录 - 往左移动 -->
        <g v-if="btn.recentRecords && btn.recentRecords.length > 0">
          <line :x1="btn.boxX + 10" :y1="btn.boxY + BOX_H" :x2="btn.boxX + BOX_W - 10" :y2="btn.boxY + BOX_H" stroke="#E2E8F0" stroke-width="0.5" />
          <template v-for="(record, index) in btn.recentRecords" :key="index">
            <text :x="btn.boxX + 10" :y="btn.boxY + BOX_H + 14 + index * 18" dominant-baseline="central" style="font-size: 7.5px; fill: #94a3b8;">{{ record.date }}</text>
            <text :x="btn.boxX + 50" :y="btn.boxY + BOX_H + 14 + index * 18" dominant-baseline="central" style="font-size: 7.5px; fill: #475569;">{{ record.type }}</text>
            <text :x="btn.boxX + 85" :y="btn.boxY + BOX_H + 14 + index * 18" dominant-baseline="central" style="font-size: 7.5px; fill: #06B6D4;">{{ record.result }}</text>
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
  recentRecords?: {
    date: string;
    type: string;
    result: string;
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
