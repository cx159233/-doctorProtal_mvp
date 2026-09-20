import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 大屏直接引用主应用 src/mock 下的演示数据（在项目根目录之外），
  // 开发服务器默认只放行 root，这里补一条放行规则，否则 dev 下会 403
  server: {
    fs: {
      allow: ['..']
    }
  },
  // 主应用生产环境 publicPath 是 './'，产物会被放在任意子路径下，
  // 所以这里也必须是相对路径，否则 iframe 里的 js/css 会 404
  base: './',
  build: {
    // 相对项目根目录解析，产物直接进主应用的 public/，随主应用一起发布
    outDir: '../public/portrait',
    emptyOutDir: true
  }
})
