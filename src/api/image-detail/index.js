import { requestFn } from '../api'// 查询影像列表
import { withMock } from '@/mock'
import {
  buildReportList,
  buildApplyList,
  buildRecognitionPatient,
  buildTranceList,
  buildViewerUrl,
  buildApproveReason
} from '@/mock/image'

// 查询详情
export function queryImageDetail(params) {
  return requestFn('/study/detail', 'get', params)
}
// 互认清单
export function queryApproveList() {
  return withMock('互认理由清单', () => requestFn('/approve/reason_list', 'get'), () => buildApproveReason())
}

// 提交互认清单
export function submitApproveList(params) {
  return requestFn('/approve/trust', 'post', params)
}

// 查看器链接接口
export function getViewerUrl(params) {
  return withMock(
    '影像查看器地址',
    () => requestFn('/study/viewer_url', 'get', params),
    () => buildViewerUrl(params),
    params
  )
}

//复制引用数据埋点
export function copyRecord(params) {
  return requestFn('/report/record', 'post', params)
}

export function getPdf(params) {
  return requestFn('/1', 'get', params)
}

// 获取报告信息
export function getReportList (params) {
  return withMock(
    '影像报告详情',
    () => requestFn('/report/list', 'get', params),
    () => buildReportList(params),
    params
  )
}

// 获取申请单信息
export function getApplyList (params) {
  return withMock(
    '申请单信息',
    () => requestFn('/apply/list', 'get', params),
    () => buildApplyList(params),
    params
  )
}

//互认板块患者信息
export function getRecognitionPatient (params) {
  return withMock(
    '互认患者信息',
    () => requestFn('/recognition/patient_info', 'get', params),
    () => buildRecognitionPatient(params),
    params
  )
}

// 获取影像详情
export function getTranceList (params) {
  return withMock(
    '影像信息',
    () => requestFn('/report/list/without_trace', 'get', params),
    () => buildTranceList(params),
    params
  )
}
