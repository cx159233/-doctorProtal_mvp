/* rem 适配的另一半：src/rem.js 负责按视口缩放 html 的字号，
   这里负责把设计稿里的 px 全部换算成 rem，两边 rootValue 都是 16
   （设计稿 1920 宽时 1rem = 16px）。
   少了这一步，画布尺寸会跟着字号缩放、字号和间距却钉死在 px，
   大屏一换分辨率就会「框缩了字没缩」 */
export default {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 14,
      propList: ['*'],
      // 换算的是设计稿尺寸，写进 CSS 变量里的 px 也要一起转，
      // 否则 --fs-10 这类字号仍然不随视口缩放
      mediaQuery: false,
    },
  },
}
