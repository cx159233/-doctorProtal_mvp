import { requestFn } from '../api'
import { withMock } from '@/mock'
import { buildVitalList, buildVitalDetail } from '@/mock/vital'

// 体征记录接口
//体征列表
export function getVitalList(params) {
  return withMock(
    '体征记录列表',
    () => requestFn('/test-api/admin/vital/page', 'post', params),
    () => buildVitalList(params),
    params
  )
}

//穿戴设备监测报告
export function getVitalDetail(params) {
  return withMock(
    '体征监测报告',
    () => requestFn('/test-api/admin/vital/detail', 'get', params),
    () => buildVitalDetail(params),
    params
  )
}
