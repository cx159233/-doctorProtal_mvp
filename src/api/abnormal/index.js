import { requestFn } from '../api'

// 反馈记录查询
export function queryFeedback(params) {
  return requestFn('/feedback/list', 'get', params)
}

// 反馈记录详情
export function queryFeedbackById(params) {
  return requestFn('/feedback/detail', 'get', params)
}

// 取消接口
export function cancelFeedbackById(params) {
  return requestFn('/feedback/cancel', 'post', params, '', {
    'Content-Type': 'application/json; charset=utf-8',
  })
}

// 创建异常反馈
export function createFeedback(params) {
  return requestFn('/feedback/create', 'post', params, '', {
    'Content-Type': 'application/json; charset=utf-8',
  })
}

// 文件上传
export function uploadFile(params) {
  return requestFn('/feedback/upload', 'post', params)
}

// 异常问题枚举
export function feedbackEnum(params) {
  return requestFn('/feedback/enum', 'get', params)
}
