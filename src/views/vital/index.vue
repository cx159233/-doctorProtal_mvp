<template>
  <div class="home-page" ref="vitalPage">
    <!-- 搜索区 -->
    <div class="search-block">
      <div class="search-block-wrap">
        <!-- 搜索功能区 -->
        <a-row class="search">
          <a-col :sm="12" :md="mdCol" :xl="6" class="mr12">
            <a-input
              placeholder="请输入患者姓名"
              v-model="postData.patient_name"
              allowClear
              :disabled="true"
            >
            </a-input>
          </a-col>
          <a-col :sm="smCol" :md="mdCol" :xl="8" class="mr12">
            <a-input
              placeholder="请输入证件号"
              v-model="postData.patient_id_card"
              allowClear
              :disabled="true"
            >
            </a-input>
          </a-col>
          <a-col :span="2">
            <a-button
              type="primary"
              @click="handleSearch"
              :disabled="isBtnDisabled"
              :loading="searchBtnLoading"
            >
              搜索
            </a-button>
          </a-col>
        </a-row>
        <a-row class="top-tips">
          <a-alert type="warning" showIcon>
            <div slot="message">支持查询证件号包括身份证号、护照、军官证、港澳通行证、台湾居住证。(注:主要提供体征记录、穿戴设备监测数据调阅)</div>
          </a-alert>
        </a-row>
      </div>
    </div>
    <!-- 筛选条件 + 表格 -->
    <div class="wrap">
      <div class="form-query">
        <div class="filter-row">
          <div class="filter-item">
            <span class="filter-label">监测日期：</span>
            <a-range-picker
              v-model="filters.dateRange"
              valueFormat="YYYY-MM-DD"
              :placeholder="['开始日期', '结束日期']"
              allowClear
              style="width: 230px"
            />
          </div>
          <div class="filter-item">
            <span class="filter-label">数据来源：</span>
            <a-select
              v-model="filters.source"
              placeholder="全部"
              allowClear
              style="width: 150px"
            >
              <a-select-option v-for="item in sourceOptions" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">监测项目：</span>
            <a-select
              v-model="filters.title"
              placeholder="全部"
              allowClear
              style="width: 260px"
            >
              <a-select-option v-for="item in titleOptions" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </div>
          <a-button @click="resetFilters">重置</a-button>
        </div>
      </div>
      <div class="query-table">
        <Table
          ref="queryList"
          rowKey="id"
          :columns="columns"
          :dataSource="filteredData"
          :totalNum="filteredData.length"
          :pagination="pagination"
          :scrollX="1000"
          @changePageNum="changePageNum"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Table from '@/components/Table'
import { getVitalList } from '@/api/vital'
import { DEFAULT_PATIENT } from '@/config/demo'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'vital',
  components: {
    Table,
  },
  data() {
    return {
      smCol: 8,
      mdCol: 8,
      searchBtnLoading: false,
      postData: {
        patient_name: DEFAULT_PATIENT.name,
        patient_id_card: DEFAULT_PATIENT.idCard,
      },
      filters: {
        dateRange: [],
        source: undefined,
        title: undefined,
      },
      columns: [
        {
          title: '序号',
          key: 'index',
          width: '70px',
          dataIndex: 'index',
          customRender: (text, record, index) => {
            return index + 1
          },
        },
        {
          title: '监测日期',
          key: 'monitorDate',
          dataIndex: 'monitorDate',
          width: '120px',
          sorter: (a, b) => new Date(a.monitorDate).valueOf() - new Date(b.monitorDate).valueOf(),
        },
        {
          title: '监测时间',
          key: 'monitorTime',
          dataIndex: 'monitorTime',
          width: '100px',
        },
        {
          title: '监测项目',
          key: 'title',
          dataIndex: 'title',
          width: '240px',
          customRender: (text) => text || '-',
        },
        {
          title: '设备名称',
          key: 'device',
          dataIndex: 'device',
          width: '230px',
          customRender: (text) => text || '-',
        },
        {
          title: '数据来源',
          key: 'source',
          dataIndex: 'source',
          width: '120px',
          customRender: (text) => text || '-',
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          width: '120px',
          customRender: (text, record) => {
            const view = this.$createElement(
              'a',
              {
                on: {
                  click: () => this.viewDetail(record),
                },
              },
              '查看监测报告'
            )
            return [view]
          },
        },
      ],
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showLessItems: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        onShowSizeChange: (current, pageSize) => {
          this.pagination.current = 1
          this.pagination.pageSize = pageSize
        },
        onChange: (current) => {
          this.pagination.current = current
        },
      },
    }
  },
  computed: {
    ...mapState({
      hospital_data: (state) => state.user.hospital_data,
    }),
    isBtnDisabled() {
      return !(this.postData.patient_name && this.postData.patient_id_card)
    },
    sourceOptions() {
      return [...new Set(this.dataSource.map((item) => item.source).filter(Boolean))]
    },
    titleOptions() {
      return [...new Set(this.dataSource.map((item) => item.title).filter(Boolean))]
    },
    filteredData() {
      const { dateRange, source, title } = this.filters
      const [start, end] = Array.isArray(dateRange) ? dateRange : []
      return this.dataSource.filter((item) => {
        if (start && item.monitorDate < start) return false
        if (end && item.monitorDate > end) return false
        if (source && item.source !== source) return false
        if (title && item.title !== title) return false
        return true
      })
    },
  },
  methods: {
    ...mapMutations(['SET_HOSPITALDATA']),
    // 分页变化
    changePageNum(obj) {
      this.pagination.current = obj.current
    },
    // 清空筛选条件
    resetFilters() {
      this.filters = {
        dateRange: [],
        source: undefined,
        title: undefined,
      }
    },
    // 查询列表
    async queryList() {
      const { patient_name, patient_id_card } = this.postData
      if (!patient_name || !patient_id_card) {
        this.$message.warning({
          content: '患者姓名和证件号都不能为空',
          duration: 2,
        })
        return
      }
      this.searchBtnLoading = true
      if (this.$refs.queryList) this.$refs.queryList.loading = true
      const { data = [] } = await getVitalList({
        patientName: patient_name,
        patientIdCard: patient_id_card,
      })
      this.dataSource = (data && Array.isArray(data) && data) || []
      this.pagination.current = 1
      this.pagination.total = this.filteredData.length
      this.searchBtnLoading = false
      if (this.$refs.queryList) this.$refs.queryList.loading = false
    },
    // 点击搜索
    handleSearch() {
      this.SET_HOSPITALDATA({
        patient_name: this.postData.patient_name,
        patient_id_card: this.postData.patient_id_card,
      })
      this.queryList()
    },
    // 点击查看监测报告
    viewDetail(record) {
      const obj = {
        id: record.id,
        text: `${record.name} ${record.title}`,
        status: '0',
        type: 'report',
        typeName: '报告',
        new_label: '0',
        key: `/detail/vital/report?id=${record.id}&type=report&patient_name=${this.postData.patient_name}&patient_id_card=${this.postData.patient_id_card}`,
      }
      // 已存在同名页签就不再新增，避免重复打开
      const tabPane = this.$store.getters.tabPane
      const bol = tabPane.some((v) => v.id === obj.id && v.type === obj.type)
      if (!bol) this.$store.dispatch('PushTabPane', obj)
      this.$router.push({
        path: '/detail/vital/report',
        query: {
          id: record.id,
          type: 'report',
          patient_name: this.postData.patient_name,
          patient_id_card: this.postData.patient_id_card,
        },
      })
    },
  },
  created() {
    if (this.hospital_data.patient_id_card && this.hospital_data.patient_name) {
      this.postData.patient_name = this.hospital_data.patient_name
      this.postData.patient_id_card = this.hospital_data.patient_id_card
    }
    this.queryList()
    this.SET_HOSPITALDATA({
      patient_name: this.postData.patient_name,
      patient_id_card: this.postData.patient_id_card,
    })
  },
  watch: {
    // 筛选条件改变后回到第一页，并同步分页总数
    filteredData() {
      this.pagination.current = 1
      this.pagination.total = this.filteredData.length
    },
  },
}
</script>

<style lang="less" scoped>
@import url('../home/style/index.less');
.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 16px;
  // 每个子项留同样的下边距，换行时行间才均匀，重置按钮也能和输入框居中对齐
  > * {
    margin-bottom: 8px;
  }
}
.filter-item {
  display: flex;
  align-items: center;
  margin-right: 16px;
}
.filter-label {
  margin-right: 8px;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
}
</style>
