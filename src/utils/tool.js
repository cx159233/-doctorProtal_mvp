
import Clipboard from 'clipboard'

const clipboardSuccess = (that) => {
  that.$message.success({
    content: '复制成功',
    duration: 2
  })
}

const clipboardError = (that) => {
  // console.log('error')
  that.$message.error({
    content: '复制失败',
    duration: 2
  })
}

export function handleClipboard(text, event, that) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(that)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError(that)
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
