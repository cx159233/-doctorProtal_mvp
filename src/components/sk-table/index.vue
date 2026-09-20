<template>
  <div class="table">
    <p class="table-title" v-if="title">
      {{ title }}
    </p>
    <div class="search-row" v-if="tableSearch.length > 0">
      <div class="frame" v-for="(el, index) in beforeTableSearch" :key="index">
        <div class="label" :style="`width:${searchTitleWidth}px`">{{ el.title }}：</div>
        <a-input
          v-if="el.type === 'input'"
          v-model="el.searchValue"
          :placeholder="`请输入${el.title}`"
          :style="`width: ${searchWidth}px`"
          :maxLength="el.inputMaxLength || null"
          allow-clear
          @change="changeInput(el)"
        />
        <a-select
          v-if="el.type === 'select'"
          v-model="el.searchValue"
          :placeholder="`请选择${el.title}`"
          :style="`width: ${searchWidth}px`"
          :options="el.selectOptions"
          allow-clear
          @change="dealSelect(el, el.hander)"
        />
        <a-date-picker
          v-if="el.type === 'time-picker'"
          v-model="el.searchValue"
          :style="`width: ${searchWidth}px`"
          format="YYYY-MM-DD"
          allow-clear
        />
        <a-range-picker
          v-if="el.type === 'a-range-picker'"
          v-model="el.searchValue"
          :style="`width: ${searchWidth}px`"
          allow-clear
          format="YYYY-MM-DD"
          :disabled-date="el.isDisable && disabledDate"
          @change="(data) => handleChange(el, data)"
        />
        <a-select
          v-if="el.type === 'a-select'"
          show-search
          value
          allow-clear
          v-model="el.searchValue"
          :placeholder="`请选择${el.title}`"
          :style="`width: ${searchWidth}px`"
          :filter-option="false"
          @search="(value) => fetch(el, el.hander, value)"
          :not-found-content="fetching ? undefined : null"
          @focus="(value) => fetch(el, el.hander, value)"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="item in el.selectOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
        <div class="error" :style="`left:${searchTitleWidth}px`" v-if="el.error">
          {{ el.error }}
        </div>
      </div>
      <div class="flex">
        <div class="frame" v-for="(el, index) in afterTableSearch" :key="index">
          <template v-if="el.type !== 'operation'">
            <div class="label" :style="`width:${searchTitleWidth}px`">{{ el.title }}：</div>
            <a-input
              v-if="el.type === 'input'"
              v-model="el.searchValue"
              :placeholder="`请输入${el.title}`"
              :style="`width: ${searchWidth}px`"
              :maxLength="el.inputMaxLength || null"
              allow-clear
              @change="changeInput(el)"
            />
            <a-select
              v-if="el.type === 'select'"
              v-model="el.searchValue"
              :placeholder="`请选择${el.title}`"
              :style="`width: ${searchWidth}px`"
              :options="el.selectOptions"
              allow-clear
              @change="dealSelect(el, el.hander)"
            />
            <a-date-picker
              v-if="el.type === 'time-picker'"
              v-model="el.searchValue"
              :style="`width: ${searchWidth}px`"
              format="YYYY-MM-DD"
              allow-clear
            />
            <a-range-picker
              v-if="el.type === 'a-range-picker'"
              v-model="el.searchValue"
              :style="`width: ${searchWidth}px`"
              allow-clear
              format="YYYY-MM-DD"
              :disabled-date="el.isDisable && disabledDate"
              @change="(data) => handleChange(el, data)"
            />
            <a-select
              v-if="el.type === 'a-select'"
              show-search
              value
              allow-clear
              v-model="el.searchValue"
              :placeholder="`请选择${el.title}`"
              :style="`width: ${searchWidth}px`"
              :filter-option="false"
              @search="(value) => fetch(el, el.hander, value)"
              :not-found-content="fetching ? undefined : null"
              @focus="(value) => fetch(el, el.hander, value)"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="item in el.selectOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
            <div class="error" :style="`left:${searchTitleWidth}px`" v-if="el.error">
              {{ el.error }}
            </div>
          </template>
          <div v-else class="flex">
            <div :style="{ width: `${searchTitleWidth}px`, textAlign: 'right' }">
              <a-button class="btn" type="primary" @click="handleQuery" v-if="el.data.includes('find')"> 查询</a-button>
            </div>
            <a-button class="btn" @click="handleReset" v-if="el.data.includes('reset')"> 重置</a-button>
          </div>
        </div>
      </div>
    </div>
    <div class="mb24 mr24" v-if="action.length > 0">
      <a-button v-for="(item, index) in action" :key="index" class="btn" @click="item.fallback" type="primary">
        {{ item.title }}</a-button
      >
    </div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="isShowFooter ? form : false"
      @change="pageChange"
      class="list"
      :rowClassName="setRowClassName"
      :scroll="{ x: scroll, y: scrollY ? scrollY : null }"
      :loading="loading"
      :rowKey="
        (record, index) => {
          return index
        }
      "
      :row-selection="isSelect ? { type, selectedRowKeys: selectedRowKeys, onChange: onSelectChange } : null"
    >
      <template slot="courseName" slot-scope="text, record">
        <slot name="courseName" :record="record" />
      </template>
      <template slot="number" slot-scope="text, record">
        <slot name="number" :record="(record, text)" />
      </template>
      <span slot="isShow" slot-scope="text">{{ text ? '是' : '否' }}</span>
      <span slot="name" slot-scope="text">{{ dealName(text) }}</span>
      <span slot="type" slot-scope="text">{{ dealType(text) }}</span>
      <div slot="courseStatus" slot-scope="text">
        <span :style="{ background: dealCourseStatus(text, 'color') }" class="tag"></span>
        <span>{{ dealCourseStatus(text, 'label') }}</span>
      </div>
      <span slot="sex" slot-scope="text">{{ dealSex(text) }}</span>
      <span slot="opEmHpExMark" slot-scope="text">{{ dealOpEmHpExMark(text) }}</span>
      <div slot="status" slot-scope="text">
        <span :style="{ background: dealStatus(text, 'color') }" class="tag"></span>
        <span>{{ dealStatus(text, 'label', 1) }}</span>
      </div>
      <div slot="heartStatus" slot-scope="text">
        <span :style="{ background: dealStatus(text, 'color') }" class="tag"></span>
        <span>{{ dealStatus(text, 'label', 2) }}</span>
      </div>
      <div slot="taskAction" slot-scope="text">
        <span :style="{ background: dealTaskAction(text, 'color') }" class="tag"></span>
        <span>{{ dealTaskAction(text, 'label') }}</span>
      </div>
      <template slot="action" slot-scope="text, record">
        <slot name="action" :row="record" />
      </template>
      <template slot="action1" slot-scope="text, record">
        <slot name="action1" :row="record" />
      </template>
    </a-table>
    <div></div>
  </div>
</template>
<script>
/**
 *
 * 统一 table 组件
 * @description 有事v我华英雄 不小心格式化了，组件是华英雄的，有事v他哈哈哈哈
 *
 */
import moment from 'moment'

export default {
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    }, // 展示的数据
    columns: {
      type: Array,
      default: () => [],
    }, // 展示的列
    tableSearch: {
      type: Array,
      default: () => [],
    }, // 搜索的数据
    getDataMethod: {
      require: true,
      type: Function,
      default: () => [],
    }, // 搜索的方法
    total: {
      type: Number,
      default: 0,
    }, // 总数量
    pageNo: {
      type: Number,
      default: 0,
    }, // 当前页
    pageSize: {
      type: Number,
      default: 10,
    }, // 每页数量
    title: {
      type: String,
      default: '',
    }, // 页面标题
    searchTitleWidth: {
      type: Number,
      default: 80,
    }, // 搜索列表标签长度
    searchWidth: {
      type: Number,
      default: 220,
    }, // 搜索列表长度
    setRowClassNameFallback: {
      type: Function,
      default: () => '',
    }, // 改变选择行的样式
    tableChange: {
      type: Function,
      default: () => '',
    }, // table数据变化时
    scroll: {
      type: Number,
      default: 0,
    }, // 列表的宽度
    action: {
      type: Array,
      default: () => [],
    }, // 操作方法
    type: {
      type: String,
      default: 'radio',
    },
    isSelect: {
      type: Boolean,
      default: false,
    },
    selectedRowKeys: {
      type: Array,
      default: () => [],
    }, // 操作方法
    isShowFooter: {
      type: Boolean,
      default: true,
    }, // 是否显示分页
    scrollY: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        current: this.pageNo,
        pageSize: this.pageSize,
        total: this.total,
        showTotal: () => `共 ${this.total}条`,
        showSizeChanger: true,
        showQuickJumper: true,
        showLessItems: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      },
      loading: false,
      fetching: false, // 搜索下拉框loading
      timer: null, // 防抖处理
    }
  },
  computed: {
    // 搜索条件
    beforeTableSearch() {
      return this.tableSearch.slice(0, this.tableSearch.length - 2)
    },
    //  搜索条件
    afterTableSearch() {
      return this.tableSearch.slice(this.tableSearch.length - 2, this.tableSearch.length)
    },
  },
  methods: {
    onSelectChange(selectedRowKeys, arr) {
      this.$emit('onSelectChange', selectedRowKeys, arr)
    },
    handleChange(el, data) {
      el.searchValue = [moment(), moment()]
      el.searchValue = data
    },
    // 搜索选择条件变化时触发
    dealSelect(el, fallback) {
      if (el.hander) {
        fallback(this.tableSearch)
      }
    },
    // 下拉框搜索
    fetch(el, fallback, value) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(async () => {
        this.fetching = true
        el.selectOptions = await fallback(value, this.tableSearch)
        this.fetching = false
      })
    },
    // 输入框变化时
    changeInput(el) {
      if (el.rule) {
        if (!el.rule.hander(el.searchValue || '') && el.searchValue) {
          el.error = el.rule.title
        } else {
          el.error = ''
        }
      }
    },
    // 不允许选择的时间范围
    disabledDate(current) {
      return current && current > moment(moment(new Date().getTime()).format('YYYY-MM-DD')).endOf('day')
    },
    // 处理性别
    dealSex(text) {
      const obj = {
        1: '男',
        2: '女',
        9: '未知',
      }
      return obj[text]
    },
    // 处理患者类型
    dealOpEmHpExMark(text) {
      const obj = {
        1: '门诊',
        2: '急诊',
        3: '住院',
        4: '体检',
      }
      if (text === '2') {
        return '急诊'
      }
      if (obj[text]) {
        return `普通(${obj[text]})`
      }
      return `普通`
    },
    // 任务类型
    dealTaskAction(text, value) {
      const status = {
        apply: { color: '#0369FC', label: '申请', key: 0 },
        reject: { color: '#E1251B', label: '拒绝', key: 1 },
        accept: { color: '#00D6CD', label: '接受', key: 2 },
        complete_report: { color: '#4DBF13', label: '完成报告', key: 2 },
        enter_diagnose: { color: '#00D6CD', label: '进入诊断', key: 3 },
        enter_consutation: { color: '#00C6CD', label: '进入会诊', key: 4 },
        comment: { color: '#4DBF13', label: '评价', key: 5 },
        apply_again: { color: ' #0369FC', label: '再次申请', key: 6 },
      }
      return status[text] && status[text][value]
    },
    // 处理状态
    dealStatus(text, value, num) {
      const status = {
        0: { color: '#0369FC', label: '调度中', key: 0 },
        1: { color: '#999999', label: '待接受', key: 1 },
        2: { color: '#1D4AD4', label: '进行中', key: 2 },
        3: { color: '#4DBF13', label: '已完成', key: 3 },
        4: { color: '#00D6CD', label: '已双向评价', key: 4 },
        5: { color: '#E1251B', label: '调度失败', key: 5 },
        6: { color: '#4DBF13', label: '申请医师已评价', key: 6 },
        7: {
          color: '#4DBF13',
          label: num === 2 ? '帮扶医师已评价' : '报告医师已评价',
          key: 7,
        },
        19: { color: '#7633FF', label: '人工调度中', key: 19 },
      }
      return status[text] && status[text][value]
    },
    // 处理课程状态
    dealCourseStatus(text, value) {
      const status = {
        0: { color: '#52C41A', label: '报名中', key: 0 },
        1: { color: '#0369FC', label: '开课中', key: 1 },
        2: { color: '#FFA600', label: '已结束', key: 2 },
        9: { color: '#52C41A', label: '课程取消', key: 3 },
      }
      return status[text] && status[text][value]
    },
    // 处理类型
    dealType(text) {
      const obj = {
        DIAGNOSE: '远程诊断',
        CONSULTATION: '远程会诊',
      }
      return obj[text]
    },
    // 处理年龄
    dealName(text) {
      if (!text) {
        return 0
      }
      const currentTime = new Date()
      const lastTime = new Date(text)
      const year = currentTime.getFullYear() - lastTime.getFullYear()
      const month = currentTime.getMonth() - lastTime.getMonth()
      if (year > 0) {
        return `${year}`
      }
      return `${month}个月`
    },
    // 行样式设置
    setRowClassName(record, index) {
      return this.setRowClassNameFallback(record)
    },
    // 页数变化
    onShowSizeChange(_pageNo, pageSize) {
      this.pageSize = pageSize
    },
    // 重置
    handleReset() {
      this.form.current = 1
      this.form.pageSize = this.pageSize
      this.form.total = this.total
      this.tableSearch.forEach((el) => {
        delete el.error
        // eslint-disable-next-line valid-typeof
        if (['a-range-picker'].includes(el.type)) {
          el.searchValue = []
        } else if (['time-picker'].includes(el.type)) {
          el.searchValue = undefined
        } else {
          delete el.searchValue
        }
      })
      this.queryData()
    },
    // 表格参数值处理
    getDefaultSearchParam() {
      const obj = {}
      let bool = true
      // 表格选择搜索
      let tableData = []
      tableData = this.tableSearch.map((item) => {
        if (item.rule && item.searchValue) {
          if (!item.rule.hander(item.searchValue || '')) {
            bool = false
            item.error = item.rule.title
          }
        }
        if (item.searchValue || item.searchValue === 0) {
          if (item.type === 'time-picker') {
            obj[item.dataIndex] = `${moment(item.searchValue).format('YYYY-MM-DD')}`
          } else if (item.type === 'a-range-picker') {
            if (item.searchValue.length > 0) {
              const [time0, time1] = item.searchValue || []
              obj[item.dataIndex] = `${moment(time0).format('YYYY-MM-DD')} 00:00:00,${moment(time1).format(
                'YYYY-MM-DD'
              )} 23:59:59`
            }
          } else {
            obj[item.dataIndex] = typeof item.searchValue === 'string' ? item.searchValue.trim() : item.searchValue
          }
        }
        return item
      })
      if (!bool) {
        this.tableChange(tableData)
      }
      return {
        isSearch: bool,
        getParams: obj,
      }
    },
    pageChange(pageParam) {
      this.form.current = pageParam.current
      this.form.pageSize = pageParam.pageSize
      this.queryData()
    },
    // 查询
    handleQuery() {
      this.form.current = 1
      this.queryData()
    },
    changeLoading() {
      this.loading = !this.loading
    },
    // 查询
    async queryData() {
      const { isSearch, getParams } = this.getDefaultSearchParam()
      if (isSearch) {
        this.loading = true
        const basicData = {
          page: this.form.current,
          page_size: this.form.pageSize,
        } // 是否带有分页搜索
        await this.getDataMethod({
          ...getParams,
          ...basicData,
        })
        this.form.total = this.total
        this.loading = false
      }
    },
  },
}
</script>
<style scoped lang="less">
/deep/ .red {
  background: rgba(255, 77, 79, 0.05) !important;
  color: red !important;
}
/deep/ .blue {
  position: relative;
  background: rgba(3, 105, 252, 0.05) !important;
}
.tag {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 8px;
}
.table {
  width: 100%;
  background: white;
  padding: 24px 0 0 24px;
  .list {
    padding: 0 24px 60px 0;
  }
  &-title {
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(0, 0, 0, 0.85);
    line-height: 16px;
    margin: 0;
  }
  &-title::before {
    content: '';
    vertical-align: middle;
    display: inline-block;
    width: 4px;
    height: 16px;
    background: #0369fc;
    border-radius: 2px;
    margin-right: 8px;
  }
  .search-row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 24px;
    .frame {
      margin-top: 24px;
      margin-right: 80px;
      display: flex;
      align-items: center;
      position: relative;
      .error {
        position: absolute;
        top: 30px;
        color: red;
      }
      .btn {
        margin-right: 8px;
      }
      .label {
        display: inline-block;
        text-align: right;
      }
    }
  }
}
</style>
