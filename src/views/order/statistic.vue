<template>
  <div class="statistic">
    <header>
      <p class="header-title">个人开单统计
        <a-tooltip placement="topLeft">
          <template slot="title">
            <span>显示用户当前所选执业医疗机构互认数据概况，多点执业用户需切换执业机构查看对应数据</span>
          </template>
          <a-icon type="question-circle" />
        </a-tooltip>
      </p>
      <div class="header-content">
        <div
          v-for="(item,index) in orderList"
          :key="index"
          class="item"
        >
          <img
            :src="item.img"
            class="item-img"
          />
          <div class="item-right">
            <p>{{item.title}}
              <a-tooltip placement="topLeft">
                <template slot="title">
                  <span>{{item.tip}}</span>
                </template>
                <a-icon type="question-circle" />
              </a-tooltip>
            </p>
            <p class="item-wide">{{item.content}}<span class="item-small">次</span></p>

          </div>
        </div>
      </div>
    </header>
    <sk-table
      ref="sk-table"
      :tableSearch="tableSearch"
      :getDataMethod="getDataMethod"
      :columns="columns"
      :dataSource="dataSource"
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      title="个人开单记录"
      :searchTitleWidth="100"
      :scroll="1600"
    >
    </sk-table>
  </div>
</template>
<script>
import { queryOrderRecord, queryOrderStatistics } from '@/api/order-statistic'

export default {
  customReadyNotify: false,
  name: 'orderStatistic',
  data() {
    return {
      orderList: [
        {
          img: require('./images/a.png'),
          tip: '累计减少的重复检查项目数',
          title: '减少开单项目数',
          content: '--',
          key: 'orderReduce',
        },
        {
          img: require('./images/b.png'),
          tip: '累计实际开单次数',
          title: '实际开单次数',
          content: '--',
          key: 'orderActual',
        },
        {
          img: require('./images/c.png'),
          tip: '累计开单时查询患者近期类似检查项目次数',
          title: '预开单次数',
          content: '--',
          key: 'preOrder',
        },
        {
          img: require('./images/d.png'),
          tip: '累计通过“跨院调阅”按钮主动查询患者历史影像数据次数',
          title: '主动查询次数',
          content: '--',
          key: 'searchCount',
        },
      ], //统计数据
      tableSearch: [
        {
          title: '患者姓名',
          dataIndex: 'patient_name',
          type: 'input',
        },
        {
          title: '就诊时间',
          dataIndex: 'time',
          type: 'a-range-picker',
          searchValue: [],
        },
        {
          type: 'operation',
          data: ['find', 'reset'],
        },
      ],
      columns: [
        {
          title: '序号',
          fixed: 'left',
          customRender: (_text, _record, index) => `${index + 1}`,
        },
        {
          title: '患者姓名',
          dataIndex: 'patientName',
        },
        { title: '身份证号', dataIndex: 'cardno' },
        {
          title: '就诊时间',
          dataIndex: 'accessTime',
        },
        { title: '检查部位', dataIndex: 'category_name' },
        { title: '就诊科室', dataIndex: 'department' },
        {
          title: '预开单项目',
          dataIndex: 'preOrder',
        },
        { title: '实际开单项目', dataIndex: 'actualOrder' },
        {
          title: '减少开单项目',
          dataIndex: 'reduceOrder',
        },
      ], // 展示的列
      dataSource: [], // 数据源
      total: 0, // 总数量
      pageNo: 1,
      pageSize: 10,
    }
  },
  destroyed() {
    this.$bus.$off('codeChange')
  },
  mounted() {
    this.queryData()
    this.queryOrderStatisticsX()
    this.$bus.$on('codeChange', () => {
      this.queryData()
      this.queryOrderStatisticsX()
    })
  },
  methods: {
    //查询个人开单统计
    async queryOrderStatisticsX() {
      const { code, data } = await queryOrderStatistics()
      if (code === 200) {
        this.orderList = this.orderList.map((i) => {
          i.content = data[i.key]
          return i
        })
      }
    },
    // 查询列表数据
    queryData() {
      this.$refs['sk-table'].handleQuery()
    },
    // 查询方法
    getDataMethod(params) {
      return new Promise(async (resolve) => {
        const { time } = params
        if (time) {
          const [createdTime, updatedTime] = time.split(',')
          params.begin_time = createdTime
          params.end_time = updatedTime
          delete params.time
        }
        const { code, data, meta } = await queryOrderRecord(params)
        if (code) {
          this.dataSource = data || []
          this.total = meta.pagination.total
          resolve()
        }
      })
    },
  },
}
</script>
<style scoped lang="less">
.statistic {
  background: white;
  width: 100%;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.39);
  header {
    width: 100%;
    background: #ffffff;
    border-radius: 2px;
    margin: 24px 0;
    padding: 27px 0 32px 24px;
    .header-title {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
    .header-title::before {
      content: '';
      vertical-align: middle;
      display: inline-block;
      width: 4px;
      height: 16px;
      background: #0369fc;
      border-radius: 2px;
      margin-right: 8px;
    }
    .header-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .item {
        display: flex;
        align-items: center;
        // margin-right: 100px;
        margin-top: 32px;
        &-img {
          width: 60px;
          height: 60px;
        }
        &-right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 32px;
        }
        &-wide {
          font-size: 30px;
          font-family: HelveticaNeue;
          color: rgba(0, 0, 0, 0.85);
        }
        &-small {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
