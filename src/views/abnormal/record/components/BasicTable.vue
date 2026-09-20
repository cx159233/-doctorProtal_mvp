<template>
  <sk-table
    ref="sk-table"
    :tableSearch="tableSearch"
    :getDataMethod="getDataMethod"
    :columns="columns"
    :dataSource="dataSource"
    :pageNo="pageNo"
    :pageSize="pageSize"
    :total="total"
    :searchTitleWidth="100"
    :scroll="2000"
  >
    <template #action1="record">
      <!-- ，RUNNING（处理中）/FINISHED   已处理   REVOKED  已取消 -->
      <span v-if="!status[record.row.status]">--</span>
      <a-badge v-else :status="status[record.row.status][1]" :text="status[record.row.status][0]" />
    </template>
    <template #action="record">
      <a-space>
        <a-button type="link" class="link-btn" @click="see(record.row)">查看详情</a-button>
        <a-button
          type="link"
          class="link-btn"
          v-if="record.row.status === 'RUNNING'"
          @click="cancelFeedback(record.row)"
        >
          取消
        </a-button>
      </a-space>
    </template>
  </sk-table>
</template>
<script>
import { queryFeedback, cancelFeedbackById } from '@/api/abnormal'
export default {
  props: {
    feedbackType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      status: {
        RUNNING: ['处理中', 'processing'],
        FINISHED: ['已完成', 'success'],
        REVOKED: ['已取消', 'default'],
      },
      tableSearchUnshift: [
        {
          title: '患者姓名',
          dataIndex: 'patient_name',
          type: 'input',
        },
        {
          title: '检查医院',
          dataIndex: 'hospital_name',
          type: 'input',
        },
      ],
      tableSearch: [
        {
          title: '反馈时间',
          dataIndex: 'time',
          type: 'a-range-picker',
          searchValue: [],
        },
        {
          title: '处理状态',
          dataIndex: 'status',
          type: 'select',
          // 状态枚举，RUNNING（处理中）/FINISHED（已结束）/REVOKED（已撤销
          selectOptions: [
            {
              label: '处理中',
              value: 'RUNNING',
            },
            {
              label: '已完成',
              value: 'FINISHED',
            },
            {
              label: '已取消',
              value: 'REVOKED',
            },
          ],
        },
        {
          type: 'operation',
          data: ['find', 'reset'],
        },
      ],
      columnsProp: {
        status: {},
      },
      columns: [
        {
          title: '序号',
          fixed: 'left',
          customRender: (_text, _record, index) => `${index + 1}`,
        },
        {
          title: '患者姓名',
          dataIndex: 'patient_name',
        },
        { title: '患者证件号', dataIndex: 'cardno' },
        {
          title: '检查设备类型',
          dataIndex: 'modality',
        },
        { title: '检查项目名称', dataIndex: 'proj_name' },
        { title: '检查医院', dataIndex: 'hospital_name' },
        {
          title: '检查时间',
          dataIndex: 'chk_dt',
        },
        { title: '异常问题', dataIndex: 'issue_content' },
        {
          title: '反馈时间',
          dataIndex: 'create_time',
        },
        {
          title: '处理状态',
          dataIndex: 'status',
          fixed: 'right',
          scopedSlots: { customRender: 'action1' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 200,
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ], // 展示的列
      columnsOther: [
        {
          title: '序号',
          fixed: 'left',
          customRender: (_text, _record, index) => `${index + 1}`,
        },
        { title: '异常描述', dataIndex: 'issue_description' },
        {
          title: '反馈时间',
          dataIndex: 'create_time',
        },
        {
          title: '处理状态',
          dataIndex: 'status',
          fixed: 'right',
          scopedSlots: { customRender: 'action1' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 200,
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      dataSource: [], // 数据源
      total: 0, // 总数量
      pageNo: 1,
      pageSize: 10,
    }
  },
  mounted() {
    if (this.feedbackType === 'other-problem-feedback') {
      this.columns = this.columnsOther
    } else this.tableSearch = [...this.tableSearchUnshift, ...this.tableSearch]
    this.queryData()
  },
  methods: {
    queryData() {
      this.$refs['sk-table'].handleQuery()
    },
    // 查询方法
    getDataMethod(params) {
      // 工单业务类型（反馈类型）枚举值 报告类 report-problem-feedback 影像类 image-problem-feedback 其他类 other--problem-feedback
      return new Promise(async (resolve) => {
        const { time } = params
        if (time) {
          const [createdTime, updatedTime] = time.split(',')
          params.begin_time = createdTime
          params.end_time = updatedTime
          delete params.time
        }
        const res = await queryFeedback({ ...params, feedback_type: this.feedbackType })
        if (res?.code) {
          this.dataSource = res.data || []
          this.total = res.meta.pagination.total
          resolve()
        }
      })
    },
    // 取消
    cancelFeedback(item) {
      const _this = this
      this.$confirm({
        title: '提示',
        content: '您反馈的异常问题正在处理中，是否确认取消？',
        onOk() {
          cancelFeedbackById({
            sn: item.sn,
          }).then((res) => {
            if (res.code === 200) {
              _this.queryData()
            }
          })
        },
        onCancel() {},
      })
    },
    see(item) {
      this.$emit('seeClick', item)
    },
  },
}
</script>
<style lang="less" scoped>
.link-btn {
  margin: 0;
  padding: 0;
}
</style>
