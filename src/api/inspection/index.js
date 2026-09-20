import { requestFn } from '../api'
import { withMock } from '@/mock'
import { buildTestList, buildTestDetail, buildTestCondition } from '@/mock/inspection'

// 检验接口
//检验列表
export function getAdminTestRpt(params) {
  return withMock(
    '检验列表',
    () => requestFn('/test-api/admin/testRpt/page', 'post', params),
    () => buildTestList(params),
    params
  )
}

//检验详情
export function getTestRptDetail(params) {
  return withMock(
    '检验报告详情',
    () => requestFn('/test-api/admin/testRpt/detail', 'get', params),
    () => buildTestDetail(params),
    params
  )
}

export function getAdminTestRptCondition(params) {
  return withMock(
    '检验查询条件',
    () => requestFn('/test-api/admin/testRpt/condition', 'post', params),
    () => buildTestCondition(),
    params
  )
}
