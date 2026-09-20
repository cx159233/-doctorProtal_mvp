// import { idCardReg } from '@/reg'
const minxValidate = {
  methods: {
    validatePatientName(rule, value, cb) {
      // console.log(1)
      if (!value) {
        cb(new Error('请输入患者姓名'))
      }
      cb()
    },
    validateIdcard(rule, value, cb) {
      if (!value) {
        cb(new Error('请输入证件号码'))
      }
      cb()
    }
  }
}
export {
  minxValidate
}