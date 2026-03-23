<template>
  <div class="annotation-container standard-card !bg-white !rounded-none !border-none !shadow-none" style="width: 100%; display: flex; justify-content: center; height: 100%;">
    <svg
      width="100%"
      height="100%"
      viewBox="10 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      style="display: block;"
    >
      <!-- 人体图片：在 990x2218 基础上再放大 5% -->
      <image
        v-if="bodyImageSrc"
        :href="bodyImageSrc"
        x="-120" y="-865"
        width="1040" height="2329"
        preserveAspectRatio="xMidYMid meet"
        style="opacity: 0.85"
      />

      <!-- 标注层：确保在人体图片之上 -->
      <g v-for="a in annotations" :key="a.id" style="pointer-events: none;">
        <!-- 呼吸灯动效层 -->
        <circle :cx="a.dotX" :cy="a.dotY" r="4" fill="none" :stroke="getColor(a.color)" stroke-width="2" style="opacity: 0">
          <animate attributeName="r" from="4" :to="String(a.ringMaxR)" :dur="`${a.ringDur}s`" :begin="`${a.ringDelay}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" :dur="`${a.ringDur}s`" :begin="`${a.ringDelay}s`" repeatCount="indefinite" />
        </circle>

        <!-- 核心标注点 -->
        <circle :cx="a.dotX" :cy="a.dotY" r="3.5" :fill="getColor(a.color)" stroke="#FFFFFF" stroke-width="1" />

        <!-- 连线 -->
        <polyline :points="getPoints(a)" fill="none" :stroke="getColor(a.color)" stroke-width="1" />

        <!-- 标注信息框 -->
        <g style="pointer-events: auto;">
          <rect :x="a.boxX" :y="a.boxY" :width="BOX_W" :height="BOX_H" rx="2" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="0.5" />
          
          <polyline :points="getTopLeftBracket(a)" fill="none" :stroke="getColor(a.color)" stroke-width="1" />
          <polyline :points="getBottomRightBracket(a)" fill="none" :stroke="getColor(a.color)" stroke-width="1" />

          <text :x="a.boxX + 10" :y="a.boxY + BOX_H * 0.35" dominant-baseline="central" style="font-size: 11px; font-weight: bold; fill: #1e293b">{{ a.title }}</text>
        <text :x="a.boxX + 10" :y="a.boxY + BOX_H * 0.72" dominant-baseline="central" style="font-size: 9px; fill: #64748b; font-weight: 500">{{ a.date }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Annotation {
  id: number; dotX: number; dotY: number; bendX: number; bendY: number;
  boxX: number; boxY: number; side: 'left' | 'right'; color: 'blue' | 'red' | 'yellow';
  title: string; date: string; ringMaxR: number; ringDur: number; ringDelay: number;
}

const BOX_W = 160;
const BOX_H = 50;
const COLORS: Record<string, string> = { blue: '#5A8FAA', red: '#9E6060', yellow: '#9E8A50' };

// 属性定义
const props = withDefaults(defineProps<{
  bodyImageSrc?: string;
  annotations?: Annotation[];
}>(), {
  bodyImageSrc: '',
  annotations: () => [
    // 重新校准后的 8 个坐标点，严格对齐人体解剖位置并适配 800x600 画布
    { id: 1, dotX: 405, dotY: 70,  bendX: 520, bendY: 70,  boxX: 540, boxY: 45,  side: 'right', color: 'blue',   title: '脑血管意外', date: '2023-10-27 (门诊)', ringMaxR: 30, ringDur: 4, ringDelay: 0.2 },
    { id: 2, dotX: 395, dotY: 110, bendX: 520, bendY: 110, boxX: 540, boxY: 100, side: 'right', color: 'yellow', title: '脑梗死', date: '2023-05-26 (住院)', ringMaxR: 36, ringDur: 5, ringDelay: 1.5 },
    { id: 3, dotX: 415, dotY: 180, bendX: 520, bendY: 180, boxX: 540, boxY: 185, side: 'right', color: 'red',    title: '高血压', date: '2023-02-17 (门诊)', ringMaxR: 32, ringDur: 4.5, ringDelay: 0.5 },
    { id: 4, dotX: 445, dotY: 260, bendX: 520, bendY: 260, boxX: 540, boxY: 275, side: 'right', color: 'blue',   title: '高血压', date: '2018-01-16 (专科)', ringMaxR: 24, ringDur: 3, ringDelay: 2.0 },
    { id: 8, dotX: 430, dotY: 550, bendX: 520, bendY: 550, boxX: 540, boxY: 525, side: 'right', color: 'yellow', title: '肱骨近端多发性骨折', date: '2023-10-29 (门诊)', ringMaxR: 24, ringDur: 3.5, ringDelay: 0.1 },
    
    { id: 5, dotX: 380, dotY: 270, bendX: 280, bendY: 270, boxX: 100, boxY: 245, side: 'left',  color: 'yellow', title: '尿毒症', date: '2023-10-27 (住院)', ringMaxR: 30, ringDur: 4, ringDelay: 0.8 },
    { id: 6, dotX: 385, dotY: 360, bendX: 280, bendY: 360, boxX: 100, boxY: 335, side: 'left',  color: 'red',    title: '糖尿病伴并发症', date: '2023-09-13 (门诊)', ringMaxR: 28, ringDur: 5, ringDelay: 3.0 },
    { id: 7, dotX: 395, dotY: 540, bendX: 280, bendY: 540, boxX: 100, boxY: 515, side: 'left',  color: 'blue',   title: '肢痛', date: '2018-05-26 (门诊)', ringMaxR: 36, ringDur: 4, ringDelay: 1.2 },
  ]
});

// 工具函数
const getColor = (c: string) => COLORS[c] || COLORS.blue;
const getBoxEdgeX = (a: Annotation) => (a.side === 'right' ? a.boxX : a.boxX + BOX_W);
const getBoxMidY = (a: Annotation) => a.boxY + BOX_H / 2;
const getPoints = (a: Annotation) => `${a.dotX},${a.dotY} ${a.bendX},${a.dotY} ${getBoxEdgeX(a)},${getBoxMidY(a)}`;
const getTopLeftBracket = (a: Annotation) => `${a.boxX},${a.boxY + 8} ${a.boxX},${a.boxY} ${a.boxX + 8},${a.boxY}`;
const getBottomRightBracket = (a: Annotation) => {
  const bx2 = a.boxX + BOX_W; const by2 = a.boxY + BOX_H;
  return `${bx2},${by2 - 8} ${bx2},${by2} ${bx2 - 8},${by2}`;
};
</script>
