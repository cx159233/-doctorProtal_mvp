<template>
  <div class="home-page" ref="inpatientPage">
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
            <div slot="message">支持查询证件号包括身份证号、护照、军官证、港澳通行证、台湾居住证。(注:主要提供住院就诊记录、住院病案首页数据调阅)</div>
          </a-alert>
        </a-row>
      </div>
    </div>
    <!-- 筛选条件 + 表格 -->
    <div class="wrap">
      <div class="form-query">
        <div class="filter-row">
          <div class="filter-item">
            <span class="filter-label">入院日期：</span>
            <a-range-picker
              v-model="filters.dateRange"
              valueFormat="YYYY-MM-DD"
              :placeholder="['开始日期', '结束日期']"
              allowClear
              style="width: 230px"
            />
          </div>
          <div class="filter-item">
            <span class="filter-label">医院名称：</span>
            <a-select
              v-model="filters.organName"
              placeholder="全部"
              allowClear
              style="width: 190px"
            >
              <a-select-option v-for="item in organOptions" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </div>
          <div class="filter-item">
            <span class="filter-label">住院科室：</span>
            <a-select
              v-model="filters.dept"
              placeholder="全部"
              allowClear
              style="width: 150px"
            >
              <a-select-option v-for="item in deptOptions" :key="item" :value="item">
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
          :scrollX="1390"
          @changePageNum="changePageNum"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Table from '@/components/Table'
import { getInpatientList } from '@/api/inpatient'
import { DEFAULT_PATIENT } from '@/config/demo'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'inpatient',
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
        organName: undefined,
        dept: undefined,
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
          title: '入院日期',
          key: 'inDate',
          dataIndex: 'inDate',
          width: '120px',
          sorter: (a, b) => new Date(a.inDate).valueOf() - new Date(b.inDate).valueOf(),
        },
        {
          title: '出院日期',
          key: 'outDate',
          dataIndex: 'outDate',
          width: '120px',
        },
        {
          title: '医院名称',
          key: 'organName',
          dataIndex: 'organName',
          width: '230px',
          customRender: (text) => text || '-',
        },
        {
          title: '医院等级',
          key: 'organLevel',
          dataIndex: 'organLevel',
          width: '100px',
          customRender: (text) => text || '-',
        },
        {
          title: '住院科室',
          key: 'dept',
          dataIndex: 'dept',
          width: '110px',
          customRender: (text) => text || '-',
        },
        {
          title: '入院诊断',
          key: 'diag',
          dataIndex: 'diag',
          width: '170px',
          customRender: (text) => text || '-',
        },
        {
          title: '主治医师',
          key: 'doctor',
          dataIndex: 'doctor',
          width: '100px',
          customRender: (text) => text || '-',
        },
        {
          title: '医疗费用(元)',
          key: 'cost',
          dataIndex: 'cost',
          width: '120px',
          customRender: () => '***',
        },
        {
          title: '医保报销(元)',
          key: 'reimb',
          dataIndex: 'reimb',
          width: '120px',
          customRender: () => '***',
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          width: '130px',
          customRender: (text, record) => {
            const view = this.$createElement(
              'a',
              {
                on: {
                  click: () => this.viewDetail(record),
                },
              },
              '查看病案首页'
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
    organOptions() {
      return [...new Set(this.dataSource.map((item) => item.organName).filter(Boolean))]
    },
    deptOptions() {
      return [...new Set(this.dataSource.map((item) => item.dept).filter(Boolean))]
    },
    filteredData() {
      const { dateRange, organName, dept } = this.filters
      const [start, end] = Array.isArray(dateRange) ? dateRange : []
      return this.dataSource.filter((item) => {
        if (start && item.inDate < start) return false
        if (end && item.inDate > end) return false
        if (organName && item.organName !== organName) return false
        if (dept && item.dept !== dept) return false
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
        organName: undefined,
        dept: undefined,
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
      const { data = [] } = await getInpatientList({
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
    // 点击查看病案首页
    viewDetail(record) {
      const obj = {
        id: record.stayId,
        text: `${record.name} ${record.dept}`,
        status: '0',
        type: 'report',
        typeName: '病案首页',
        new_label: '0',
        key: `/detail/inpatient/report?id=${record.stayId}&organCode=${record.organCode}&new_label=0&type=report&patient_name=${this.postData.patient_name}&patient_id_card=${this.postData.patient_id_card}`,
      }
      // 已存在同名页签就不再新增，避免重复打开
      const tabPane = this.$store.getters.tabPane
      const bol = tabPane.some((v) => v.id === obj.id && v.type === obj.type)
      if (!bol) this.$store.dispatch('PushTabPane', obj)
      this.$router.push({
        path: '/detail/inpatient/report',
        query: {
          id: record.stayId,
          organCode: record.organCode,
          new_label: '0',
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
