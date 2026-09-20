import { Spin } from 'ant-design-vue'
export const PageLoading = {
  name: 'PageLoading',
  props: {
    tip: {
      type: String,
      default: '加载中...'
    },
    size: {
      type: String,
      default: 'large'
    }
  },
  render () {
    const divStyle = { // div style
      textAlign: 'center',
      background: 'rgba(0,0,0,0.6)',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1100
    }
    const spinStyle = {
      position: 'absolute',
      left: '50%',
      top: '40%',
      transform: 'translate(-50%, -50%)'
    }
    return (
      <div style={ divStyle }>
        <Spin size={ this.size } tip={ this.tip } style={ spinStyle } />
      </div>
    )
  }
}