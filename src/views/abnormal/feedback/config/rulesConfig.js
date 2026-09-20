export const rules = {
  contact_phone: [
    {
      type: 'string',
      required: true,
      message: '请输入手机号码',
      trigger: ['blur', 'change'],
    },
    {
      pattern: /^1\d{10}$/,
      message: '请输入正确的手机号码',
      trigger: ['blur', 'change'],
    },
  ],
  patient_name: [
    {
      type: 'string',
      required: true,
      message: '请输入患者姓名',
      trigger: ['blur', 'change'],
    },
  ],
  cardno: [
    {
      type: 'string',
      required: true,
      message: '请输入患者证件号',
      trigger: ['blur', 'change'],
    },
  ],
  modality: [
    {
      required: true,
      message: '请输入检查设备类型',
      trigger: ['blur', 'change'],
    },
  ],
  proj_name: [
    {
      required: true,
      message: '请输入检查项目名称',
      trigger: ['blur', 'change'],
    },
  ],
  hospital_name: [
    {
      required: true,
      message: '请输入检查医院',
      trigger: ['blur', 'change'],
    },
  ],
  chk_dt: [
    {
      required: true,
      message: '请选择检查时间',
      trigger: ['blur', 'change'],
    },
  ],
  issue_content: [
    {
      required: true,
      message: '请选择异常问题',
      trigger: ['blur', 'change'],
    },
  ],
  issue_description: [
    {
      required: true,
      message: '请输入异常描述',
      trigger: ['blur', 'change'],
    },
  ],
}
