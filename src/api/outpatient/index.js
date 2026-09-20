import { requestFn } from '../api'
import { withMock } from '@/mock'
import { buildVisitList, buildVisitDetail } from '@/mock/outpatient'

// 门诊记录接口
//门诊列表
export function getOutpatientList(params) {
  return withMock(
    '门诊记录列表',
    () => requestFn('/test-api/admin/outpatient/page', 'post', params),
    () => buildVisitList(params),
    params
  )
}

//门诊病历详情
export function getOutpatientDetail(params) {
  return withMock(
    '门诊病历详情',
    () => requestFn('/test-api/admin/outpatient/detail', 'get', params),
    () => buildVisitDetail(params),
    params
  )
}
