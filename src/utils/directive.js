import Vue from 'vue'
/**
 * author: 任勇
 * 水印
 * text：水印文字
 * font：字体
 * textColor：文字颜色
 * width：宽度
 * height：高度
 * textRotate：偏转度 -90到0， 负数值，不包含-90
 */

Vue.directive('watermark', (el, binding) => {
  // console.log('watermark')
  const { text, font, textColor, width, height, textRotate } = binding.value
  const addWaterMarker = (parentNode) => {
    const can = document.createElement('canvas') // 创建画布
    parentNode.appendChild(can) // 添加
    can.width = width
    can.height = height
    // console.log(can.width, can.height)
    can.style.display = 'none'
    const cans = can.getContext('2d')
    cans.rotate(textRotate * Math.PI / 180) // 设置旋转度
    cans.font = font
    cans.fillStyle = textColor
    cans.textAlign = 'left'
    cans.textBaseline = 'middle'
    cans.fillText(text, 0, can.height)
    // console.log(cans)
    parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')'
  }
  addWaterMarker(el)
})