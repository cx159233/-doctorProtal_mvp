<template>
  <div class="home-detail">
    <!-- 左侧 -->
    <div class="left">
      <!-- 报告信息 -->
      <div class="report-info" v-if="classify === 2">
        <a-card :title="showTitle" :bordered="false">
          <div class="card-contnet">
            <a-row class="card-content-row">
              <a-col :sm="smCol" :md="17" :xl="18" class="card-content-col">
                <div v-watermark="watermarkConfig">
                  <a-row class="header">
                    <!-- logo -->
                    <a-col class="logo" :sm="smCol" :md="mdCol" :xl="4">
                      <img :src="imgPic" alt="" v-if="reportInfo.is_hr !== '0'"/>
                    </a-col>
                    <!-- 大标题 -->
                    <a-col class="bigTitle" :sm="smCol" :md="mdCol" :xl="14">
                      <p>{{ reportInfo.hospital_name }}</p>
                      <p>{{ reportInfo.modality }}检查报告单</p>
                    </a-col>
                    <!-- 操作 -->
                    <a-col class="operation">
                      <a-button @click="viewImage" class="operation-btn">查看影像</a-button>
                    </a-col>
                  </a-row>
                  <!-- 病人信息 -->
                  <div class="info">
                    <a-row>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">病人姓名：</span>
                        <span>{{ reportInfo.patient_name }}</span>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">性别/年龄：</span>
                        <span title="男/20">{{ reportInfo.patient_sex }}/{{ reportInfo.patient_age }}</span>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">门诊号：</span>
                        <span>{{ reportInfo.accession_number }}</span>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">科室：</span>
                        <span>{{ reportInfo.visit_departments }}</span>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">床号：</span>
                        <span>{{ reportInfo.hospitalization_bed_number }}</span>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">住院号：</span>
                        <span>{{ reportInfo.study_request_no }}</span>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">病区：</span>
                        <span>{{ reportInfo.visit_departments }}</span>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">检查日期：</span>
                        <span>{{ reportInfo.study_date }}</span>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">报告日期：</span>
                        <span>{{ reportInfo.report_date }}</span>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">病人ID：</span>
                        <span>{{ reportInfo.out_patientId }}</span>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">检查号：</span>
                        <span>{{ reportInfo.record_num }}</span>
                      </a-col>
                    </a-row>
                  </div>
                  <!-- 报告呈现信息 -->
                  <div class="present">
                    <ul class="img-block">
                      <li><img :src="imgPic" alt="" /></li>
                      <li><img :src="imgPic" alt="" /></li>
                      <li><img :src="imgPic" alt="" /></li>
                    </ul>
                    <p class="title">
                      <span>检查部位：</span>
                      <span>{{ reportInfo.study_body_part }}</span>
                    </p>
                    <div class="image-present mr40">
                      <span class="title">影像表现</span>
                      <p>
                        {{ reportInfo.image_performance }}
                      </p>
                    </div>
                    <div class="suggestion mr40">
                      <span class="title">诊断意见</span>
                      <p>
                        {{ reportInfo.first_clinical_diagnosis }}
                      </p>
                    </div>
                  </div>
                  <!-- 底部信息 -->
                  <div class="footer">
                    <div class="doctor">
                      <div>
                        <span class="title">报告医师：</span>
                        <span>{{ reportInfo.report_doctor }}</span>
                      </div>
                      <div>
                        <span class="title">审核医师：</span>
                        <span>{{ reportInfo.study_doctor }}</span>
                      </div>
                    </div>
                    <p class="tip">*本报告仅作临床参考</p>
                  </div>
                </div>
              </a-col>
              <!-- 查看申请单 -->
              <div class="apply">
                <a class="btn" @click="openModal">查看申请单</a>
              </div>
            </a-row>
          </div>
        </a-card>
      </div>
      <!-- 影像信息 -->
      <div class="image-info" v-if="classify === 1">
        <a-card :title="showTitle" :bordered="false">
          <div slot="extra">
            <a-button type="primary" :disabled="reportInfo.if_dicom_upload && reportInfo.if_dicom_upload === '0'">查看大图</a-button>
          </div>
          <div class="iframe-content">
            <iframe src="" frameborder="0"></iframe>
          </div>
          <a-empty v-if="!reportInfo.if_dicom_upload || reportInfo.if_dicom_upload === '0'" style="margin-bottom: 32px;">
            <svg
              slot="image"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="106"
              height="91.693"
              viewBox="0 0 106 91.693">
              <defs>
                <clipPath id="clip-path">
                  <path id="Clip_2" data-name="Clip 2" d="M50.886,2V3.183a4,4,0,0,1-4,4H25l-.2-.005A4,4,0,0,1,21,3.183h0V2a2,2,0,0,0-2-2H0V22a4,4,0,0,0,4,4H68.1a4,4,0,0,0,4-4h0V0H52.887a2,2,0,0,0-2,2Z" transform="translate(0 0.999)" fill="none"/>
                </clipPath>
                <clipPath id="clip-path-2">
                  <path id="Clip_2-2" data-name="Clip 2" d="M0,12a10.277,10.277,0,0,0,2.305,6.4h0a1.006,1.006,0,0,1,.177.943h0L1.143,23.326l4.346-1.609a.993.993,0,0,1,.837.074h0A17.6,17.6,0,0,0,15,24h0c8.284,0,15-5.372,15-12h0C30,5.372,23.284,0,15,0h0C6.716,0,0,5.372,0,12Z" fill="none"/>
                </clipPath>
              </defs>
              <g id="编组_2" data-name="编组 2" transform="translate(0 -7)">
                <ellipse
                  id="椭圆形"
                  cx="44.5"
                  cy="9"
                  rx="44.5"
                  ry="9"
                  transform="translate(0 80.693)"
                  fill="#f6f6f8"/>
                <path id="矩形" d="M14.217,0H57.883L72.1,17.1H0Z" transform="translate(8.5 48.893)" fill="#aeb8c3"/>
                <rect
                  id="矩形-2"
                  data-name="矩形"
                  width="50"
                  height="47"
                  rx="2"
                  transform="translate(19.5 29.893)"
                  fill="#f5f5f7"/>
                <g id="编组" transform="translate(8.5 65.011)">
                  <path id="Clip_2-3" data-name="Clip 2" d="M50.886,2V3.183a4,4,0,0,1-4,4H25l-.2-.005A4,4,0,0,1,21,3.183h0V2a2,2,0,0,0-2-2H0V22a4,4,0,0,0,4,4H68.1a4,4,0,0,0,4-4h0V0H52.887a2,2,0,0,0-2,2Z" transform="translate(0 0.999)" fill="none"/>
                  <g id="编组-2" data-name="编组" clip-path="url(#clip-path)">
                    <path id="Fill_1" data-name="Fill 1" d="M0,36H82.1V0H0Z" transform="translate(-5 -4)" fill="#dce0e8"/>
                  </g>
                </g>
                <g id="编组-3" data-name="编组" transform="translate(76 7)">
                  <path id="Clip_2-4" data-name="Clip 2" d="M0,12a10.277,10.277,0,0,0,2.305,6.4h0a1.006,1.006,0,0,1,.177.943h0L1.143,23.326l4.346-1.609a.993.993,0,0,1,.837.074h0A17.6,17.6,0,0,0,15,24h0c8.284,0,15-5.372,15-12h0C30,5.372,23.284,0,15,0h0C6.716,0,0,5.372,0,12Z" fill="none"/>
                  <g id="编组-4" data-name="编组" clip-path="url(#clip-path-2)">
                    <path id="Fill_1-2" data-name="Fill 1" d="M0,34H40V0H0Z" transform="translate(-5 -5)" fill="#dce0e8"/>
                    <rect
                      id="矩形-3"
                      data-name="矩形"
                      width="4"
                      height="4"
                      transform="translate(-21 8)"
                      fill="#fff"/>
                  </g>
                </g>
                <rect
                  id="矩形-4"
                  data-name="矩形"
                  width="4"
                  height="4"
                  transform="translate(89.197 16.139)"
                  fill="#fff"/>
                <circle
                  id="椭圆形-2"
                  data-name="椭圆形"
                  cx="2"
                  cy="2"
                  r="2"
                  transform="translate(94.821 16.139)"
                  fill="#fff"/>
                <path id="三角形" d="M2,0,4,4H0Z" transform="translate(83.179 16.139)" fill="#fff"/>
                <g id="组_58" data-name="组 58" transform="translate(27.943 17.871)">
                  <path id="路径_3" data-name="路径 3" d="M27.036,20.041H6.114a3.626,3.626,0,0,0-3.626,3.626v17.14a1.09,1.09,0,0,0,0,.552v.931a3.627,3.627,0,0,0,3.626,3.624H27.036a3.626,3.626,0,0,0,3.624-3.624V23.665a3.626,3.626,0,0,0-3.624-3.624ZM6.114,22.248H27.036a1.423,1.423,0,0,1,1.417,1.417V37.431a24.284,24.284,0,0,0-2.846-3.284,2.594,2.594,0,0,0-2.211-.694c-1.317.188-2.759,1.284-4.407,3.342-.394.488-.75.977-1.04,1.394-1.45-2-4.3-5.7-6.722-7.4a2.544,2.544,0,0,0-2.342-.356,5.623,5.623,0,0,0-2.64,2.309,20.741,20.741,0,0,0-1.559,2.68V23.667a1.423,1.423,0,0,1,1.427-1.419Z" fill="#dedee7"/>
                  <path id="路径_4" data-name="路径 4" d="M677.888,282.092a1.918,1.918,0,1,0,1.918-1.918A1.918,1.918,0,0,0,677.888,282.092Z" transform="translate(-657.681 -253.295)" fill="#dedee7"/>
                </g>
              </g>
            </svg>
            <span slot="description">影像暂未上传</span>
          </a-empty>
        </a-card>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="right">
      <!-- 顶部 -->
      <div class="top">
        <!-- 标题 -->
        <a-row class="m-b-md">
          <a-col>
            <span class="flag"></span>
            <span class="title">{{ classify === '1' ? '影像互认' : '报告互认' }}</span>
          </a-col>
        </a-row>
        <!-- 按钮操作 -->
        <a-row class="m-b-md">
          <a-col>
            <a-radio-group v-model="radioValue" @change="radioChange" :disabled="radioDisabled">
              <a-radio :value="'1'">互认</a-radio>
              <a-radio :value="'2'">不互认</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
         <!-- 互认提示语 -->
        <a-row v-if="isShowTip1" style="margin-bottom: 24px;">
          <a-col style="color: #F5222D;">请选择互认意见</a-col>
        </a-row>
        <!-- 客观原因-报告 -->
        <a-row class="m-b-md" v-if="radioValue === '2'">
          <div class="reason reason1">
            <div class="all">
              <a-checkbox
                :indeterminate="indeterminate"
                :checked="checkAll"
                @change="onCheckAllChange"
                :disabled="radioDisabled"
              >
                客观原因
              </a-checkbox>
            </div>
            <div class="items" style="text-indent: 5px">
              <a-checkbox-group v-model="checkedList" @change="onChange" :disabled="radioDisabled">
                <div v-for="item in reasonCommon" :key="item.key">
                  <a-checkbox :value="item.key">{{ item.text }}</a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
          </div>
        </a-row>
        <!-- 互认提示语 -->
        <a-row v-if="isShowTip2" style="margin-bottom: 24px;">
          <a-col style="color: #F5222D;">请勾选客观原因</a-col>
        </a-row>
        <!-- 复制功能-影像 -->
        <a-row class="m-b-md" v-if="reasonCommon.length && radioValue === '2' && classify === 1">
          <a-col style="text-align: right">
            <a-button type="primary" @click="copy" class="copy-btn" :data-clipboard-text="copyText">复制</a-button>
          </a-col>
        </a-row>
        <!-- 其他理由 -->
        <a-row class="m-b-md">
          <p class="other-reason">其他理由</p>
          <a-textarea
            :disabled="radioDisabled"
            :maxLength="200"
            :rows="6"
            v-model="otherReason"
            placeholder="不能超过200个字符"
            class="reason-content"></a-textarea>
        </a-row>
      </div>
      <!-- 底部操作 -->
      <div class="bottom">
        <a-row style="margin-bottom: 0">
          <a-col style="text-align: right">
            <a-button style="margin-right: 8px" @click="back">返回</a-button>
            <a-button type="primary" @click="handleSubmit" :disabled="btnDisabled">提交</a-button>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 查看申请单对话框 -->
    <a-modal :visible="visible" :footer="null" :width="700" @cancel="cancelModal">
      <div class="wrap">
        <a-row class="big-title">
          <a-col :sm="smCol" :md="16" :xl="16" class="text-ellpisis">
            <p>{{ reportInfo.hospital_name }}</p>
            <p>{{ reportInfo.modality }}检查申请单</p>
          </a-col>
        </a-row>
        <a-row class="apply-num">
          <a-col :sm="smCol" :md="16" :xl="16">
            <span class="title">申请单号：</span>
            <span>{{ reportInfo.study_request_no }} </span>
          </a-col>
        </a-row>
        <a-row class="main-content">
          <div class="content">
            <a-row>
              <a-col :sm="smCol" :md="mdCol" :xl="mdCol" class="text-ellpisis">
                <span class="title">患者姓名：</span>
                <span>{{ reportInfo.patient_name }}</span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">性别：</span>
                <span>{{ reportInfo.patient_sex }}</span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">申请科室：</span>
                <span>{{ reportInfo.visit_departments }}</span>
              </a-col>
            </a-row>
            <a-row>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">病例号：</span>
                <span>{{ reportInfo.record_num }}</span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">就诊卡号：</span>
                <span>{{ reportInfo.record_num }}</span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title"> 费别： </span>
                <span></span>
              </a-col>
            </a-row>
            <a-row>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">主要诊断：</span>
                <span>{{ reportInfo.first_clinical_diagnosis }}</span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title"> 其它诊断： </span>
                <span></span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title"> 特病: </span>
                <span></span>
              </a-col>
            </a-row>
          </div>
          <div class="content">
            <a-row class="mr24">
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">主诉：</span>
                <span></span>
              </a-col>
            </a-row>
          </div>
          <div class="content">
            <a-row class="mr24">
              <a-col>
                <p>
                  <span class="title">病史摘要：</span>
                  <span>{{ reportInfo.chief_complaint }}</span>
                </p>
              </a-col>
            </a-row>
          </div>
          <div class="content">
            <a-row class="mr24">
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">检查目的：</span>
                <span></span>
              </a-col>
            </a-row>
          </div>
          <div>
            <a-row class="mr24">
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">序号</span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">检查项目</span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">检查部位</span>
              </a-col>
            </a-row>
            <a-row class="mr12">
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span>1</span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span>{{ reportInfo.modality }}</span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span>{{ reportInfo.item_name }}</span>
              </a-col>
            </a-row>
          </div>
        </a-row>
        <a-row class="footer mr24">
          <a-col :span="12" class="text-ellpisis">
            <span class="title">申请医师：</span>
            <span>{{ reportInfo.study_doctor }}</span>
          </a-col>
          <a-col :span="12" class="text-ellpisis apply-time">
            <span class="title">申请时间：</span>
            <span>{{ reportInfo.study_request_time }}</span>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <!-- 页面loading -->
     <PageLoading v-if="pageLoading"/>
  </div>
</template>

<script>
import '@/utils/directive'
import imgPic from '@/assets/detail/icon.png'
import Clipboard from 'clipboard'
import { queryImageDetail, queryApproveList, submitApproveList } from '@/api/image-detail'
import { postNormalData, arrTransferStr, jsonTransfer, strToArr } from '@/utils/methods'
import { PageLoading } from '@/components/PageLoading'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'HomeDetail',
  components: {
    PageLoading
  },
  props: {
    classify: {
      // 类型分类 1-查看影像 2-查看报告
      type: Number,
      default: 1, // 默认为查看影像
    }
  },
  data() {
    return {
      smCol: 24,
      mdCol: 8,
      xlCol: 8,
      imgPic, // 图片
      isFirst: true, // 是否是第一次
      pageLoading: false, // 页面加载
      isShowTip1: false, // 是否展示提示语
      isShowTip2: false,
      study_id: this.$route.query.id || '', // 查询id
      type: this.$route.query.type || '', // 类型 dicom-影像 report-报告
      user_name: this.$store.getters.userInfo.user_name,
      radioValue: 0, // 是否确认过
      radioDisabled: false, // 是否禁用
      indeterminate: false, // 多选框样式
      checkAll: false, // 是否勾选全部
      btnDisabled: false, // 提交按钮是否禁用
      visible: false, // 是否展示申请单对话框
      checkedList: [], // 勾选项
      otherReason: '', // 其他理由
      reasonCommon: [], // 客观原因-从后端返回的
      copyText: '123', // 复制文本的内容
      activatedFlag: false, // 激活标志
      reportInfo: {
        hospital_name: '',
        modality: '',
        patient_id_card: '',
        visit_departments: '',
        study_body_part: '',
        patient_age: '',
        patient_sex: '',
        patient_name: '',
        out_patientId: '',
        first_clinical_diagnosis: '',
        accession_number: '', // 申请单号
        study_date: '', // 申请时间
        study_doctor: '', // 申请医师
        report_date: '', // 报告时间
        is_hr: '', // 开放互认
        report_doctor: '', // 报告医师
        report_approver: '', // 审核医师
        report_diagnoses: '', // 检查所见
        image_performance: '', // 申请信息病史描述
        chief_complaint: '', // 病史描述
        study_request_time: '', // 检查时间
        has_hr: '', // 是否操作过该条数据的互认，已经操作过过1，未操作过为0
        study_request_no: '', // 申请单号
        if_dicom_upload: '', // 是否上传影像
        image_hr: '', // 影像互认
        report_hr: '', // 报告互认
        response_for_report: '', // 报告互认-客观原因
        remark_for_report: '', // 报告互认-不符合质控标准
        remark_for_image: '', // 影像互认-不符合质控标准
        response_for_image: '', // 影像互认-客观原因
        record_num: '', // 报告号 展示报告是否有无
        hospital_code: ''
      },
      watermarkConfig: {
        text: '',
        font: '16px Vedana',
        textColor: '#e0e9f8',
        width: 200,
        height: 150,
        textRotate: -30,
      },
      // title: '报告详情'
    }
  },
  methods: {
     // 查询互认清单
    async queryApprove() {
      const { data = {} } = await queryApproveList()
      const { img, report } = data && data
      const obj = this.classify === 1 ? (img && img.common) : (report && report.common)
      this.reasonCommon = jsonTransfer(obj)
    },
    // 全部勾选-客观原因
    onCheckAllChange(e) {
      const arr = this.reasonCommon.map(item => item && item.key)
      Object.assign(this, {
        checkedList: e.target.checked ? arr : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
      this.isShowTip2 = !this.checkedList.length? true : false
    },
    // 查询详情
    async queryDetail() {
      const { data = {} } = await queryImageDetail({
        study_id: this.study_id,
        type: this.type
      })
      // this.isFirst = false
      // console.log(data)
      const  {
        hospital_name,
        modality,
        patient_id_card,
        visit_departments,
        study_body_part,
        patient_age,
        patient_sex,
        patient_name,
        out_patientId,
        first_clinical_diagnosis,
        accession_number, // 申请单号
        study_date, // 申请时间
        study_doctor, // 申请医师
        report_date, // 报告时间
        is_hr, // 开放互认
        report_doctor, // 报告医师
        report_approver, // 审核医师
        report_diagnoses, // 检查所见
        image_performance, // 申请信息病史描述
        chief_complaint, // 病史描述
        study_request_time, // 检查时间
        has_hr, // 是否操作过该条数据的互认，已经操作过过1，未操作过为0
        study_request_no, // 申请单号
        if_dicom_upload, // 是否上传影像
        image_hr, // 影像互认
        report_hr, // 报告互认
        response_for_report, // 报告互认-客观原因
        remark_for_report, // 报告互认-不符合质控标准
        remark_for_image, // 影像互认-不符合质控标准
        response_for_image, // 影像互认-客观原因
        record_num, // 报告号 展示报告是否有无
        hospital_code,
        hospitalization_bed_number // 床号
      } = data && data
      this.watermarkConfig.text = this.user_name + '-' + hospital_name
      this.reportInfo.out_patientId = out_patientId
      this.reportInfo.patient_id_card = patient_id_card
      this.reportInfo.report_diagnoses = report_diagnoses
      this.reportInfo.report_approver = report_approver
      this.reportInfo.chief_complaint = chief_complaint
      this.reportInfo.has_hr = has_hr
      this.reportInfo.is_hr = is_hr
      this.reportInfo.image_hr = image_hr
      this.reportInfo.report_hr = report_hr
      this.reportInfo.response_for_report = response_for_report
      this.reportInfo.response_for_image = response_for_image
      this.reportInfo.remark_for_report = remark_for_report
      this.reportInfo.remark_for_image = remark_for_image
      this.reportInfo.hospital_code = hospital_code
      this.reportInfo.hospital_name = hospital_name
      this.reportInfo.modality = modality
      this.reportInfo.patient_name = patient_name
      this.reportInfo.patient_sex = patient_sex
      this.reportInfo.patient_age = patient_age
      this.reportInfo.accession_number = accession_number
      this.reportInfo.visit_departments = visit_departments
      this.reportInfo.hospitalization_bed_number = hospitalization_bed_number
      this.reportInfo.study_request_no = study_request_no
      this.reportInfo.record_num = record_num
      this.reportInfo.report_date = report_date
      this.reportInfo.out_patientId = out_patientId
      this.reportInfo.study_body_part = study_body_part
      this.reportInfo.image_performance = image_performance
      this.reportInfo.first_clinical_diagnosis = first_clinical_diagnosis
      this.reportInfo.report_doctor = report_doctor
      this.reportInfo.study_doctor = study_doctor
      this.reportInfo.study_date = study_date
      this.reportInfo.if_dicom_upload = if_dicom_upload
      this.reportInfo.study_request_time = study_request_time

      this.radioValue = this.classify === 1 ? image_hr : report_hr
      // console.log('detail',data)
       if (this.reportInfo.has_hr === '1') { // 如果都操作过
        this.radioDisabled = (this.classify === 1 ? (image_hr === '0' || !image_hr) : (report_hr === '0' || !report_hr)) ? false : true
        this.btnDisabled = this.radioDisabled ? true : false
        // 当前url变化hr_flag
        // this.changeUrlQuery(has_hr)
        // 匹配vuex中的状态 has_hr
        // console.log(decodeURIComponent(this.$route.fullPath))
        // const key = this.modifiedPath(decodeURIComponent(this.$route.fullPath), has_hr)
        const key = decodeURIComponent(this.$route.fullPath)
        const obj = {
          id: this.study_id,
          type: this.type,
          key, 
          status: this.classify === 1 ? image_hr : report_hr
        }
        this.$store.dispatch('ModifiedTabPane', obj)
        if (!this.radioDisabled) { // 如果没有被禁用,放开操作
          Object.assign(this, {
            indeterminate: false,
            checkAll: false,
            checkedList: [], // 影像互认
            otherReason: ''
          })
        } else { // 操作被禁用
          const arr = this.classify === 1 ? response_for_image : response_for_report
          const str = this.classify === 1 ? remark_for_image : remark_for_report
          Object.assign(this, {
            checkedList: strToArr(arr) || [],
            indeterminate: (strToArr(arr).length && strToArr(arr).length !== this.reasonCommon.length) ? true : false,
            checkAll: strToArr(arr).length === this.reasonCommon.length ? true : false,
            otherReason: str === '0' ? '' : str,
            isShowTip2: false,
            isShowTip1: false
          })
        }
      } else { // 如果没操作过
        this.resetData() // 重置数据
      }
    },
    // 修改path
    modifiedPath(path, hr_flag) {
      const arr = path.split('?')
      const queryArr = arr[1].split('&')
      queryArr.splice(queryArr.length - 1, 1)
      const queryStr = queryArr.join('&')
      const pathStr = arr[0] + '?' + queryStr + '&hr_flag=' + hr_flag
      return pathStr
    },
    // 强行改变url
    changeUrlQuery(has_flag) {
      const query = this.$router.history.current.query
      const path = this.$router.history.current.path
      const newQuery = JSON.parse(JSON.stringify(query))
      if (has_flag) {
        newQuery['hr_flag'] = has_flag
      }
      this.$router.push({
        path,
        query: newQuery
      })
    },
    // 重置右侧数据
    resetData() {
      Object.assign(this, {
        checkedList: [], // 互认
        indeterminate: false,
        checkAll: false,
        radioValue: 0, // 互认单选框
        radioDisabled: false,
        btnDisabled: false,
        isShowTip1: false, // 是否展示互认意见
        isShowTip2: false,
        otherReason: ''
      })
    },
    // 查看影像
    viewImage() {},
    // 切换勾选
    // 报告互认-客观原因勾选不是全部时
    onChange(checkedList) {
      this.checkedList = checkedList
      this.indeterminate = !!checkedList.length && checkedList.length < this.reasonCommon.length
      this.checkAll = checkedList.length === this.reasonCommon.length
      this.isShowTip2 = !this.checkedList.length ? true : false
    },
    // 按钮值改变之后
    radioChange(e) {
      this.radioValue = e.target.value
      this.isShowTip1 = this.isShowTip2 = false
    },
    // 点击返回
    back() {
      const self = this
      if (!this.btnDisabled) {
        // 如果没进行互认操作
        this.$confirm({
          title: '提示',
          content: (h) =>
            `当前页面有${
              !(self.reportRadioValue || self.imageRadioValue) ? '未完成' : '未提交'
            }的互认评价，是否确定退出？`,
          icon: (h) => <a-icon type="exclamation-circle" />,
          onOk() {
            self.$router.push({
              path: '/home/index',
            })
          },
          onCancel() {},
          class: 'test',
        })
      } else {
        self.$router.push({
          path: '/home/index',
        })
      }
    },
    // 提交
    async handleSubmit(e) {
      e.preventDefault()
      if (!this.radioValue) { // 如果没有值
        this.isShowTip1 = true
        return
      } else { // 如果有值
        if (this.radioValue === '2') { // 不互认
        // console.log('has value')
          if (!this.checkedList.length) {
            return this.isShowTip2 = true
          }
        }
      }
      const arrStr = arrTransferStr(this.checkedList)
      const obj = {
        ris_exam_id: this.study_id,
        is_recognition_image: this.classify === 1 ? (this.radioValue || '') : '',
        response_for_image: this.classify === 1 ? (arrStr || 0) : 0,
        remark_for_image: this.classify === 1 ? (this.otherReason || 0) : 0,
        is_recognition_report: this.classify === 2 ? (this.radioValue || '') : '',
        response_for_report: this.classify === 2 ? (arrStr || 0) : 0,
        remark_for_report:this.classify === 2 ? (this.otherReason || 0) : 0
      }
      const formData = postNormalData(obj)
      this.pageLoading = true
      const { code = '' } = await submitApproveList(formData)
      if (code === 200) {
        this.radioDisabled = true
        this.$message.success({
          content: '提交成功',
          duration: 2
        })
        this.queryDetail() // 重新查询
      }
      this.pageLoading = false
    },
    // 打开模态框
    openModal() {
      this.visible = true
    },
    // 取消模态框
    cancelModal() {
      this.visible = false
    },
    // 复制操作
    copy() {
      const self = this
      const clipboard = new Clipboard('.copy-btn')
      clipboard.on('success', () => {
        // 复制成功
        self.$message.success({
          content: '复制成功',
          duration: 2,
        })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        // 不支持复制
        self.$message.error({
          content: '该浏览器不支持复制功能',
          duration: 2,
        })
        // 释放
        clipboard.destroy()
      })
    },
    // 是否再次请求
    requestAgain() {
      this.study_id = this.$route.query.id
      this.type = this.$route.query.type
      this.queryDetail()
    }
  },
  // // 路由守卫
  beforeRouteEnter(to, from, next) {
    // console.log('to',to)
    // console.log('from',from)
  },
  beforeRouteLeave(to, from, next) {
    // console.log('to',to)
    // console.log('from',from)
  },
  watch:{
    $route(to, from) {
      // console.log('route')
      // console.log('to',to)
      // console.log('from',from)
      if (decodeURIComponent(to.fullPath).includes('/home/index')) return
      this.requestAgain()
    }
  },
  created() {
    this.queryApprove()
    this.requestAgain()
  },
  mounted() {
    // console.log('mouted')
  },
  deactivated() { // 未激活
    // this.activatedFlag = true
    // this.isFirst = true
    // console.log('detail deactivated')
  },
  activated() {
    // this.activatedFlag = true
    // this.isFirst = false // 不是第一次
    // console.log('detail component activated')
  },
  destroyed() {
    // console.log('detail component destroyed')
  },
  computed: {
    showTitle() {
      return this.classify === 1 ? '影像详情' : '报告详情'
    },
    ...mapGetters(['userInfo'])
  },
}
</script>
<style lang="less" scoped>
@import url('../style/index.less');
</style>