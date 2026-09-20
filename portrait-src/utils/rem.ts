/* rem 适配：设计稿 1920 x 1080，1920 宽时 1rem = 16px（与 postcss-pxtorem 的 rootValue 保持一致）
   取宽高缩放比的较小值，保证内容整体等比缩放、既不裁剪也不出现滚动条 */
const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const ROOT_VALUE = 16

export const setupRem = () => {
  const update = () => {
    const scale = Math.min(
      window.innerWidth / DESIGN_WIDTH,
      window.innerHeight / DESIGN_HEIGHT
    )
    document.documentElement.style.fontSize = `${ROOT_VALUE * scale}px`
  }

  update()
  window.addEventListener('resize', update)
  window.addEventListener('orientationchange', update)
}
