<template>
  <div class="bg_main">
    <!-- <img src="@/assets/loginAuth/cd_bg_top.png" alt="" class="bg_top" /> -->
    <!-- <div class="bg_center">
       <img :src="svgLogo" alt="" class="svg-logo" />
       <h3 class="title">健康险核查服务 - 平安医保</h3>
    </div> -->
    <div class="img_group" :style="{ transform: `scale(${scale})`, left: left }">
      <img src="@/assets/loginAuth/cd_bg_center.png" alt="" class="cd_bg_center" />
      <!-- <div class="poor">
        <img src="@/assets/cd_bg_center_poor.png" class="cd_bg_center" />
      </div> -->
      <!-- 组一 -->
      <div class="arrow_group group_1">
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_1" />
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_2" />
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_3" />
      </div>
      <div class="arrow_group group_2">
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_1" />
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_2" />
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_3" />
      </div>
      <div class="arrow_group arrow_group_invert group_3">
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_1" />
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_2" />
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_3" />
      </div>
      <div class="arrow_group arrow_group_invert group_4">
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_1" />
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_2" />
        <img src="@/assets/loginAuth/dark_arrow.png" alt="" class="arrow_3" />
      </div>
      <!-- logo -->
      <div class="img_logo">
        <div class="line_light"></div>
        <img src="@/assets/loginAuth/cd_bg_logo.png" />
      </div>
      <!-- 4根线运动的 -->
      <div class="line_main line_1">
        <div class="line"></div>
        <div class="line_light"></div>
      </div>
      <div class="line_main line_2">
        <div class="line"></div>
        <div class="line_light"></div>
      </div>
      <div class="line_main line_3">
        <div class="line"></div>
        <div class="line_light"></div>
      </div>
      <div class="line_main line_4">
        <div class="line"></div>
        <div class="line_light"></div>
      </div>
    </div>
  </div>
</template>
<script>
import svgLogo from '@/assets/svg-logo.svg'
export default {
  data() {
    return {
      scale: 1,
      top: 0,
      left: 0,
      svgLogo
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize, false)
  },
  mounted() {
    this.$nextTick(() => {
      this.resize()
    })
    this.init()
  },
  methods: {
    init() {
      window.addEventListener('resize', this.resize, false)
    },
    resize() {
      const _w = (document.body.offsetWidth * 68) / 100
      const _h = document.body.offsetHeight
      const imgW = document.querySelector('.bg_main .img_group').offsetWidth
      const imgH = document.querySelector('.bg_main .img_group').offsetHeight
      const _spaceH = _h - imgH
      //   console.log(_h, imgH, _spaceH)
      const _left = _w / 2 - imgW / 2
      const _scaleW = _w / imgW
      const _scaleH = _spaceH > 0 && _spaceH / 400 > 0.6 ? _spaceH / 400 : 0.6
      const _scale = _scaleW > _scaleH ? _scaleH : _scaleW
      //   console.log(document.body.offsetWidth, _left)
      this.left = _left + 'px'
      this.scale = _scale > 1.2 ? 1.2 : _scale
    }
  }
}
</script>

<style lang="less" scoped>
// @import url(~@/style/utils.less);
.keyframes (@prefix, @name, @content) when (@prefix=def) {
  @keyframes @name {
    @content();
  }
}

.keyframes (@prefix, @name, @content) when (@prefix=moz) {
  @-moz-keyframes @name {
    @content();
  }
}

.keyframes (@prefix, @name, @content) when (@prefix=o) {
  @-o-keyframes @name {
    @content();
  }
}

.keyframes (@prefix, @name, @content) when (@prefix=webkit) {
  @-webkit-keyframes @name {
    @content();
  }
}

.keyframes (@prefix, @name, @content) when (@prefix=all) {
  .keyframes(moz, @name, @content);
  .keyframes(o, @name, @content);
  .keyframes(webkit, @name, @content);
  .keyframes(def, @name, @content);
}

@opacity_1: 0.3;
@opacity_2: 0.7;

.bg_main {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
  width: 68%;

  .bg_top {
    // width: 642px;
    min-width: 370px;
    width: 40%;
    max-width: 642px;
  }
}

.bg_center {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    width: 60px;
    margin-right: 20px;
  }
  .title {
    font-size: 40px;
    font-weight: 500;
    margin-bottom: 0;
    color: #1990fe;
  }

  .sub_title {
    font-size: 32px;
    font-weight: 300;
    color: #1990fe;
  }

  .cd_bg_center {
    width: 70%;
  }
}

.img_group {
  width: 1101px;
  height: 771px;
  top: 22vh;
  left: 20%;
  transform-origin: top center;
  position: relative;

  .poor {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    // animation: mymove ease-out 1.5s infinite;
  }

  .img_logo {
    position: absolute;
    width: 77px;
    height: 73px;
    top: 271px;
    left: 545px;
    overflow: hidden;

    .line_light {
      position: absolute;
      top: 0;
      left: -50px;
      width: 200%;
      height: 10px;
      transform-origin: center 0;
      transform: rotate(-45deg);
      //   background: rgba(223, 241, 255, 0.5);
      //   box-shadow: 2px 10px rgba(255, 255, 255, 0.5);
      animation: light_frame 3s linear infinite;
      background: linear-gradient(to bottom,
          rgba(223, 241, 255, 0.1),
          rgba(223, 241, 255, 1),
          rgba(223, 241, 255, 0.1));
    }
  }

  .line_main {
    position: absolute;
    width: 46px;
    height: 4px;

    overflow: hidden;

    .line {
      width: 100%;
      margin-top: 1px;
      height: 2px;
      // background: rgba(255,255,255,.2);
      //   background: red;
      //   background: linear-gradient(to right, rgba(51, 154, 255, 1), rgba(24, 92, 255, 1), rgba(51, 154, 255, 1));
    }

    .line_light {
      position: absolute;
      width: 20px;
      height: 20px;
      top: -10px;
      animation-delay: 1.5s;
    }
  }

  .line_1 {
    left: 451px;
    top: 421px;
    transform: rotate(-32deg);

    .line_light {
      border-top-left-radius: 10px;
      background: linear-gradient(to right, rgba(80, 239, 255, 1), rgba(80, 239, 255, 0));
      animation: light_line 3s linear infinite;
    }
  }

  .line_2 {
    left: 634px;
    width: 68px;
    top: 431px;
    transform: rotate(30deg);

    .line_light {
      background: linear-gradient(to left, rgba(80, 239, 255, 1), rgba(80, 239, 255, 0));
      animation: light_line_2 3s linear infinite;
    }
  }

  .line_3 {
    left: 661px;
    width: 75px;
    top: 300px;
    transform: rotate(-31deg);

    .line_light {
      background: linear-gradient(to left, rgba(80, 239, 255, 1), rgba(80, 239, 255, 0));
      animation: light_line_2 3s linear infinite;
    }
  }

  .line_4 {
    left: 420px;
    width: 65px;
    top: 293px;
    transform: rotate(31deg);

    .line_light {
      background: linear-gradient(to right, rgba(80, 239, 255, 1), rgba(80, 239, 255, 0));
      animation: light_line 3s linear infinite;
    }
  }
}

// 箭头
.arrow_group {
  position: absolute;
  width: 100px;
  height: 100px;
  transform: rotate(-9deg);

  &.arrow_group_invert {
    transform: rotate(171deg);
  }

  &.group_1 {
    top: 384px;
    left: 278px;
  }

  &.group_2 {
    top: 509px;
    left: 472px;
  }

  &.group_3 {
    top: 122px;
    right: 405px;
  }

  &.group_4 {
    top: 242px;
    right: 210px;
  }

  img {
    width: 37px;
    height: 32px;
  }

  .arrow_1 {
    position: absolute;
    opacity: @opacity_1;
    animation-delay: 3s;
    animation: group_arrow_1 linear 3s infinite;
  }

  .arrow_2 {
    position: absolute;
    top: 8px;
    left: 8px;
    animation-delay: 3s;
    animation: group_arrow_2 linear 3s infinite;
  }

  .arrow_3 {
    position: absolute;
    top: 16px;
    left: 16px;
    animation-delay: 3s;
    animation: group_arrow_3 linear 3s infinite;
  }
}

// .keyframes(all, mymove, {from{top: 4px;} to{top: -10px;}});
.keyframes(all,
  group_arrow_1,
  {
  0% {
    opacity: @opacity_1
  }

  70% {
    opacity: @opacity_1
  }

  71% {
    opacity: @opacity_1
  }

  80% {
    opacity: @opacity_2
  }

  90% {
    opacity: 1
  }

  100% {
    opacity: @opacity_1
  }
});

.keyframes(all,
  group_arrow_2,
  {
  0% {
    opacity: @opacity_2
  }

  70% {
    opacity: @opacity_2
  }

  71% {
    opacity: @opacity_2
  }

  80% {
    opacity: 1
  }

  90% {
    opacity: @opacity_1
  }

  100% {
    opacity: @opacity_2
  }
});

.keyframes(all,
  group_arrow_3,
  {
  0% {
    opacity: 1
  }

  70% {
    opacity: 1
  }

  71% {
    opacity: 1
  }

  80% {
    opacity: @opacity_1
  }

  90% {
    opacity: @opacity_2
  }

  100% {
    opacity: 1
  }
});

.keyframes(all,
  light_frame,
  {
  0% {
    top: 10px;
  }

  30% {
    top: 100%; opacity: 0.5;
  }

  31% {
    top: 100%; opacity: 0;
  }

  100% {
    top: 200%; opacity: 0;
  }
});

.keyframes(all,
  light_line,
  {
  0% {
    left: 43px; opacity: 0
  }

  30% {
    left: 43px; opacity: 0;
  }

  31% {
    left: 43px; opacity: 1;
  }

  70% {
    left: -13px; opacity: 1;
  }

  71% {
    left: -13px; opacity: 0;
  }

  100% {
    left: -43px; opacity: 0;
  }
});

.keyframes(all,
  light_line_2,
  {
  0% {
    left: 0; opacity: 0
  }

  30% {
    left: 0; opacity: 0;
  }

  31% {
    left: 0; opacity: 1;
  }

  70% {
    left: 100%; opacity: 1;
  }

  71% {
    left: 100%; opacity: 0;
  }

  100% {
    left: 100%; opacity: 0;
  }
});
</style>
