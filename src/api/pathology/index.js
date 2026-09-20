import { requestFn } from '../api'
import { withMock } from '@/mock'
import { buildPathologyList, buildPathologyDetail } from '@/mock/pathology'

// 病理记录接口
//病理列表
export function getPathologyList(params) {
  return withMock(
    '病理记录列表',
    () => requestFn('/test-api/admin/pathology/page', 'post', params),
    () => buildPathologyList(params),
    params
  )
}

//病理检查报告
export function getPathologyDetail(params) {
  return withMock(
    '病理检查报告',
    () => requestFn('/test-api/admin/pathology/detail', 'get', params),
    () => buildPathologyDetail(params),
    params
  )
}
