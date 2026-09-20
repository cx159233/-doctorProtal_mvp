/*
 * @Description: 
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-14 15:40:14
 * @LastEditors: renyong
 * @LastEditTime: 2022-05-18 16:56:27
 */
export default {
  // api 状态code
  code: {
    success: 200
  },
  // 分页参数
  page: {
    page: 'page',
    size: 'page_size'
  },
  // 01身份证,02户口本，03护照，04军官证，05驾驶证，06港澳通行证，07台湾通行证，99其他法定证件
  patientIdType: {
    '01': '身份证',
    '02': '户口本',
    '03': '护照',
    '04': '军官证',
    '05': '驾驶证',
    '06': '港澳通行证',
    '07': '台湾通行证',
    '99': '其他法定证件'
  },
  visitType: {
    '1': '门诊',
    '2': '急诊',
    '3': '住院',
    '4': '体检'
  },
  isPositive: {
    '1': '阴性',
    '2': '阳性',
    '3': '不确定'
  },
  mutualTrendType: {
    1: 'recognition_rate', // 检查结果互认率
    2: 'recognition_count', // 检查结果互认次数
    3: 'access_count', // 跨院调阅次数
    4: 'search_count', // 重复检查调阅次数
    5: 'view_count' // 重复检查提醒次数
  },
  isRecognition: {
    1: '互认',
    2: '不互认'
  }
}

export const feedbackType = [
  {
    name: '报告类异常',
    key: 'report-problem-feedback',
  },
  {
    name: '影像类异常',
    key: 'image-problem-feedback',
  },
  {
    name: '其他',
    key: 'other-problem-feedback',
  },
]
