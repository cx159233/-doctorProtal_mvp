<template>
  <div class="auth-modal-host">
    <!-- 第一步：协议确认 -->
    <a-modal
      :visible="visible && step === 'confirm'"
      :maskClosable="false"
      :footer="null"
      :closable="false"
      :getContainer="() => $el"
      class="auth-confirm-modal"
    >
      <div slot="title">
        <a-icon type="info-circle" style="color: #1890ff; margin-right: 9px"></a-icon>
        <span>请确认患者已授权！</span>
      </div>
      <div class="auth-agreement">
        感谢您信任并使用{{ sourceName }}个人医保云。请您在使用我们的服务前，认真地阅读和充分理解
        <a @click="viewAgreements(2)">《用户服务许可协议》</a>
        及
        <a @click="viewAgreements(3)">《数据隐私权政策》</a>
        ，特别是粗体字的条款。如您点击“患者已确认”按钮，即表示您已阅读并同意上述条款，我们将尽全力保证您的合法权益并继续为您提供优质的服务。如您不同意或未点击“患者已确认”按钮，将无法继续使用我们的服务。
        <br />
        <br />
        <p>同时请您注意，我们提供的患者影像资料服务仅供您参考使用，请您根据自己的专业能力独立地对患者做出判断。</p>
      </div>
      <div class="auth-bottom-btn">
        <a-button type="primary" @click="step = 'choose'">患者已确认</a-button>
      </div>
    </a-modal>

    <!-- 第二步：选择授权方式 -->
    <a-modal
      :visible="visible && step === 'choose'"
      :maskClosable="false"
      :footer="null"
      :closable="true"
      :getContainer="() => $el"
      class="auth-choose-modal"
      @cancel="onCancel"
    >
      <div slot="title">
        <span>
          <a-icon type="info-circle" style="color: #1890ff; margin-right: 9px"></a-icon>
        </span>
        <span class="auth-title-text">请确认患者已授权！</span>
        <span class="auth-title-tips">(根据患者自身情况，任选其一即可完成授权)</span>
      </div>
      <div class="auth-options">
        <a v-if="has('1')" @click="pick(1)">
          <img :src="img1" alt="" />
          <p class="tip1">{{ sourceLabel }}健康通授权</p>
          <p class="tip2">推荐使用该方式，更快捷</p>
        </a>
        <a v-if="has('2')" @click="pick(2)">
          <img :src="img2" alt="" />
          <p class="tip1">短信授权</p>
          <p class="tip2">适用于老年患者人群</p>
        </a>
        <a v-if="has('3')" @click="pick(3)">
          <img :src="img3" alt="" />
          <p class="tip1">医生辅助授权</p>
          <p class="tip2">适用于无法使用手机</p>
          <p class="tip2">网络信号不通畅等场景</p>
        </a>
        <a v-if="has('4')" @click="pick(5)">
          <img :src="img6" alt="" />
          <p class="tip1">第三方扫码授权</p>
          <p class="tip2">适用于医疗机构等</p>
          <p class="tip2">第三方实现的扫码授权场景</p>
        </a>
      </div>
    </a-modal>

    <!-- 第三步：具体授权 -->
    <a-modal
      :visible="visible && step === 'detail'"
      :maskClosable="false"
      :closable="true"
      :getContainer="() => $el"
      :width="860"
      class="auth-detail-modal"
      @cancel="onCancel"
    >
      <div slot="title" class="auth-title">
        <span>
          <span class="auth-title-text">{{ detailTitle }}</span>
          <span class="auth-title-tips" v-if="authorizeType === 1">(公众号或者APP均可完成授权)</span>
        </span>
        <a class="auth-other" @click="backToChoose">
          其他授权方式
          <a-icon type="right" />
        </a>
      </div>

      <!-- 江苏健康通授权：左边操作示意，右边二维码 -->
      <div class="content">
        <div v-if="authorizeType === 1" class="authorize-type1">
          <div class="type1-illustrations">
            <div class="type1-stack">
              <img :src="img5" alt="" />
              <img :src="img4" alt="" />
            </div>
            <div class="type1-text">
              <p>微信搜索「{{ sourceLabel }}健康通」公众号</p>
              <p>进入【互联网医疗】-【医疗服务】-【健康档案】-【影像报告】进行授权</p>
            </div>
          </div>
          <div class="type1-qr">
            <div class="auth-qr-box">
              <img class="auth-qr" :src="qrImgSrc" alt="" />
            </div>
            <p>以下扫码途径二选一即可：</p>
            <p>1、打开「{{ sourceLabel }}健康通」App左上角扫一扫</p>
            <p>2、打开「{{ sourceLabel }}健康通」公众号，点击菜单【我的】-【影像授权】扫描以上二维码进行授权</p>
          </div>
        </div>

        <!-- 短信授权 / 新增短信授权 -->
        <div v-else-if="isSms" class="authorize-type2">
          <div class="auth-row">
            <span class="auth-lbl">{{ authorizeType === 2 ? '历史手机号码' : '手机号码' }}</span>
            <a-select
              v-if="authorizeType === 2"
              v-model="phone"
              style="width: 220px"
              placeholder="请选择"
            >
              <a-select-option v-for="(item, index) in historyPhoneList" :key="index" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
            <a-input
              v-else
              v-model="phone"
              style="width: 220px"
              placeholder="请输入手机号码"
              :maxLength="11"
            />
          </div>
          <div class="auth-row">
            <span class="auth-lbl">验证码</span>
            <a-input class="auth-code-input" v-model="smsNum" placeholder="请输入验证码" />
            <a-button class="auth-code-btn" type="primary" :disabled="time > 0" @click="sendSms">
              <span v-if="!time">发送验证码</span>
              <span v-else>{{ time }}s后再次发送</span>
            </a-button>
            <span v-if="authorizeType === 2" class="auth-new-phone" @click="pick(4)">使用新的手机号码</span>
          </div>
        </div>

        <!-- 第三方扫码授权 -->
        <div v-else-if="authorizeType === 5" class="authorize-type5">
          <div class="type5-steps">
            <a-steps direction="vertical" size="small">
              <a-step
                title="第一步"
                description="请患者打开接入扫码授权服务的渠道应用，通过“扫码授权”功能，进行数据授权。"
              />
              <a-step title="第二步">
                <div slot="description">
                  请患者按照提示进行<span style="color: #1890ff">数据授权</span>。
                </div>
              </a-step>
              <a-step title="第三步" description="完成授权。" />
            </a-steps>
          </div>
          <div class="type5-qr">
            <img class="auth-qr" :src="qrImgSrc" alt="" />
            <div class="type5-txt">请患者打开第三方渠道应用，通过应用内的“扫码授权”功能，进行数据授权。</div>
          </div>
        </div>

        <!-- 医生辅助授权 -->
        <div v-else class="authorize-type3">
          感谢您信任并使用{{ sourceName }}个人医保云。请您在使用我们的服务前，认真地阅读和充分理解
          <a @click="viewAgreements(2)">《用户服务许可协议》</a>
          及
          <a style="font-weight: bold" @click="viewAgreements(3)">《数据隐私权政策》</a>
          ，特别是粗体字的条款。如您点击“同意辅助患者完成授权”按钮，即表示您已阅读并同意上述条款，我们将尽全力保证您的合法权益并继续为您提供优质的服务。如您不同意或未点击“同意辅助患者完成授权”按钮，将无法继续使用我们的服务。
          <br />
          <br />
          <p>同时请您注意，我们提供的患者影像资料服务仅供您参考使用，请您根据自己的专业能力独立地对患者做出判断。</p>
        </div>
      </div>

      <div slot="footer" class="auth-footer">
        <a-button v-if="isSms" type="primary" :disabled="!(phone && smsNum)" @click="finish">
          验证并授权
        </a-button>
        <a v-else @click="finish">
          {{ authorizeType === 1 || authorizeType === 5 ? '患者已授权' : '同意辅助患者完成授权' }}
        </a>
      </div>
    </a-modal>

    <!-- 协议正文：协议确认 / 医生辅助授权里的《用户服务许可协议》《数据隐私权政策》都点这里打开 -->
    <a-modal
      :visible="agreementsVisible"
      :maskClosable="false"
      :footer="null"
      :closable="false"
      :getContainer="() => $el"
      class="auth-agreements-modal"
    >
      <div slot="title">
        <a-icon type="info-circle" style="color: #1890ff; margin-right: 9px"></a-icon>
        <span>{{ agreementsTitle }}</span>
      </div>
      <div class="auth-agreements-body" v-html="agreementsHtml" />
      <div class="auth-bottom-btn">
        <a-button type="primary" @click="agreementsVisible = false">关闭协议</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
/*
 * 患者授权弹窗 —— 从「医保健康档案」页（src/views/home/index.vue）的三步授权流程抽出来的公共件。
 *
 * 三步：协议确认 → 选授权方式 → 具体授权。
 * 这里**不接任何接口**（演示用）：验证码是本地的 60 秒倒计时，末了的按钮点了就直接
 * emit('success')，由调用方决定授权结果怎么落地。
 */
import img1 from '@/assets/home/img1.png'
import img2 from '@/assets/home/img2.png'
import img3 from '@/assets/home/img3.png'
import img4 from '@/assets/home/img4.png'
import img5 from '@/assets/home/img5.png'
import img6 from '@/assets/home/img6.png'
/* 协议正文沿用「医保健康档案」页本地兜底的那份，避免再抄一遍上万字的条款 */
import agreements from '@/views/home/config'

/* 演示用二维码：真二维码由接口下发，这里用固定种子的伪随机点阵画成 SVG 图片占个位，
   只为把版式撑起来，扫不出东西 */
const QR_SVG = (() => {
  const size = 25
  const finders = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7]
  ]
  const inFinder = (x, y) =>
    finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7)
  let seed = 20240920
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed / 2147483648
  }
  const rect = (x, y, w, h, fill) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`
  const parts = [rect(0, 0, size, size, '#fff')]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (inFinder(x, y)) continue
      if (rand() > 0.5) parts.push(rect(x, y, 1, 1, '#000'))
    }
  }
  finders.forEach(([x, y]) => {
    parts.push(
      rect(x, y, 7, 7, '#000'),
      rect(x + 1, y + 1, 5, 5, '#fff'),
      rect(x + 2, y + 2, 3, 3, '#000')
    )
  })
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">` +
    parts.join('') +
    '</svg>'
  )
})()
const QR_IMG_SRC = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(QR_SVG)

export default {
  name: 'AuthModal',
  props: {
    // .sync 用法：<AuthModal :visible.sync="showAuth" @success="onAuth" />
    visible: {
      type: Boolean,
      default: false
    },
    // 后端 getAuthMethod 返回的可用方式（1健康通 2短信 3医生辅助 4第三方扫码）。
    // 演示里只开放短信授权和医生辅助授权，其余两个的图文版式留在组件里备用
    authMethod: {
      type: Array,
      default: () => ['2', '3']
    },
    // 从哪一步开始：confirm=先让医生确认协议，choose=直接挑授权方式（HIS 进来时用）
    startStep: {
      type: String,
      default: 'confirm'
    },
    sourceName: {
      type: String,
      default: '江苏省'
    },
    sourceLabel: {
      type: String,
      default: '江苏'
    }
  },
  data() {
    return {
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      qrImgSrc: QR_IMG_SRC,
      step: 'confirm',
      // 协议弹窗：2=用户服务许可协议，3=数据隐私权政策
      agreementsVisible: false,
      agreementsType: 2,
      authorizeType: 0,
      phone: '',
      smsNum: '',
      time: 0,
      // 演示用：真接口会返回该患者的就诊留存号码
      historyPhoneList: ['138****6521', '159****3078'],
      timer: null
    }
  },
  computed: {
    detailTitle() {
      if (this.authorizeType === 1) return `${this.sourceLabel}健康通授权`
      if (this.authorizeType === 2) return '短信授权'
      if (this.authorizeType === 4) return '新增短信授权'
      if (this.authorizeType === 5) return '第三方扫码授权'
      return '医生辅助授权'
    },
    isSms() {
      return this.authorizeType === 2 || this.authorizeType === 4
    },
    agreementsTitle() {
      return this.agreementsType === 3 ? '数据隐私权政策' : '用户服务许可协议'
    },
    agreementsHtml() {
      const source = (window.CONFIG && window.CONFIG.source) || {}
      if (this.agreementsType === 3) return source.yhys || agreements.userSecert
      return source.yhfw || agreements.userAgreement
    }
  },
  watch: {
    /* 每次重新打开都回到起始步，不留上一次的残留状态。
       必须 immediate：调用方通常在自己的 created 里就把 showAuth 置 true，
       等到本组件挂载时 visible 已经是 true，普通 watch 收不到这次「变化」，
       step 就会停在 data 里的初始值，startStep 形同虚设。 */
    visible: {
      immediate: true,
      handler(val) {
        if (val) this.reset()
      }
    }
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    has(method) {
      return this.authMethod.includes(method)
    },
    reset() {
      this.step = this.startStep
      this.authorizeType = 0
      this.phone = ''
      this.smsNum = ''
      this.agreementsVisible = false
      this.agreementsType = 2
      this.clearTimer()
      this.time = 0
    },
    viewAgreements(type) {
      this.agreementsType = type
      this.agreementsVisible = true
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    pick(type) {
      this.authorizeType = type
      this.phone = ''
      this.smsNum = ''
      this.step = 'detail'
    },
    backToChoose() {
      this.clearTimer()
      this.time = 0
      this.step = 'choose'
    },
    sendSms() {
      if (this.time > 0) return
      this.time = 60
      this.timer = setInterval(() => {
        this.time -= 1
        if (this.time <= 0) this.clearTimer()
      }, 1000)
    },
    finish() {
      this.$emit('update:visible', false)
      this.$emit('success')
    },
    onCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
/*
 * scoped + getContainer 指回本组件根节点：antd 默认把弹窗 portal 到 body，
 * 那样 scoped 的 data 属性够不到弹窗内部，样式会全丢。
 */
.auth-modal-host {
  position: relative;
}

/deep/ .ant-modal-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .ant-modal {
  top: 0;
  padding-bottom: 0;
}

/* 第一步：协议确认 */
.auth-confirm-modal {
  /deep/ .ant-modal {
    width: 620px;
  }
  .auth-agreement {
    line-height: 1.8;
    color: rgba(0, 0, 0, 0.85);
  }
  .auth-bottom-btn {
    margin-top: 24px;
    text-align: center;
  }
}

/* 第二步：选授权方式 */
/* 卡片居中而不是两端对齐：只开两种授权方式时，两端对齐会把两张卡推到弹窗两边，
   中间空出一大块，看着比例失衡。宽度交给内容撑，别再叠 max-width */
.auth-choose-modal {
  /deep/ .ant-modal {
    width: auto;
    min-width: 620px;
  }
  .auth-title-text {
    font-size: 18px;
  }
  .auth-title-tips {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.35);
  }
  .auth-options {
    display: flex;
    justify-content: center;
    padding: 48px 0 48px 48px;
    a {
      width: 210px;
      padding: 20px;
      display: inline-block;
      color: rgba(0, 0, 0, 0.85);
      border-radius: 6px;
      box-shadow: 8px 8px 20px #d9ddec, -8px -8px 20px rgba(255, 255, 255, 0.85);
      text-align: center;
      margin-right: 48px;
      img {
        width: 100px;
        height: 100px;
        margin-bottom: 12px;
      }
      .tip1 {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 4px;
      }
      .tip2 {
        color: rgba(0, 0, 0, 0.65);
      }
    }
    a:hover {
      box-shadow: 8px 8px 20px #d9ddec inset, -8px -8px 20px rgba(255, 255, 255, 0.65) inset;
    }
  }
}

/* 协议正文 */
.auth-agreements-modal {
  /deep/ .ant-modal {
    width: 620px;
  }
  .auth-agreements-body {
    height: 200px;
    overflow: auto;
    line-height: 1.8;
    color: rgba(0, 0, 0, 0.85);
    white-space: pre-wrap;
  }
}

/* 第三步：具体授权 */
.auth-detail-modal {
  .auth-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .auth-title-text {
      font-size: 18px;
    }
    .auth-title-tips {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.35);
    }
    .auth-other {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .auth-row {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .auth-lbl {
    width: 110px;
    flex-shrink: 0;
  }
  .auth-qr {
    display: block;
    width: 133px;
    height: 133px;
  }
  .auth-qr-box {
    display: flex;
    justify-content: center;
    margin-bottom: 18px;
  }
}

/* 江苏健康通：左边操作示意，右边二维码 */
.authorize-type1 {
  display: flex;
  justify-content: space-between;
  padding: 21px 0;

  .type1-illustrations {
    width: 70%;
    display: flex;
    justify-content: space-between;
    .type1-stack {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      img {
        display: block;
        margin-bottom: 24px;
      }
    }
    .type1-text {
      margin-left: 20px;
      padding-right: 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-right: 1px solid rgba(0, 0, 0, 0.06);
      p {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
  .type1-qr {
    flex: 1;
    margin-left: 30px;
    p {
      margin-top: 0;
    }
  }
}

/* 短信授权 / 新增短信授权 */
.authorize-type2 {
  padding: 12px 0;
  .auth-row {
    margin-bottom: 16px;
    justify-content: flex-start;
    padding-left: 48px;
  }
  .auth-code-input {
    width: 188px;
  }
  .auth-code-btn {
    margin-left: 14px;
  }
  .auth-new-phone {
    margin-left: 30px;
    line-height: 32px;
    color: #1890ff;
    cursor: pointer;
  }
}

/* 第三方扫码授权 */
.authorize-type5 {
  display: flex;
  .type5-steps {
    flex: 1;
  }
  .type5-qr {
    flex: 0 0 49%;
    padding-left: 20px;
    margin-left: 20px;
    border-left: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .type5-txt {
      margin-top: 16px;
      color: #333;
      text-align: center;
    }
  }
}

/* 医生辅助授权 */
.authorize-type3 {
  padding: 12px 0;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.85);
}

.auth-footer {
  padding: 16px 0;
  text-align: center;
  a {
    padding: 8px 18px;
    display: inline-block;
    color: rgba(0, 0, 0, 0.85);
    border-radius: 6px;
    box-shadow: 8px 8px 20px #d9ddec, -8px -8px 20px rgba(255, 255, 255, 0.85);
  }
  a:hover {
    box-shadow: 8px 8px 20px #d9ddec inset, -8px -8px 20px rgba(255, 255, 255, 0.65) inset;
  }
}
</style>
