import { requestFn } from '../api'
import { withMock } from '@/mock'
import { buildStayList, buildStayDetail } from '@/mock/inpatient'

// 住院记录接口
//住院列表
export function getInpatientList(params) {
  return withMock(
    '住院记录列表',
    () => requestFn('/test-api/admin/inpatient/page', 'post', params),
    () => buildStayList(params),
    params
  )
}

//住院病案首页
export function getInpatientDetail(params) {
  return withMock(
    '住院病案首页',
    () => requestFn('/test-api/admin/inpatient/detail', 'get', params),
    () => buildStayDetail(params),
    params
  )
}
