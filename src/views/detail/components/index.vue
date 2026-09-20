<template>
  <div class="image-detail">
    <!-- 左侧 -->
    <div class="left">
      <!-- 报告信息 -->
      <div class="report-info" v-if="classify === 2">
        <a-card :bordered="false" :loading="cardLoading">
          <div slot="title" class="header-title">
            <a-row style="width: 100%;">
              <a-col :span="6" style="margin:0;">
                <span>{{ showTitle }}</span>
              </a-col>
              <a-col :span="10" style="margin:0; display:flex; justify-content:center;">
                <div class="middle" v-if="reportDataList.length">
                  <!-- 简单分页 -->
                  <SimplePagination :totalPage="reportDataList.length" @backClick="backClick" @nextClick="nextClick" />
                </div>
              </a-col>
              <a-col :span="8" style="margin:0;">
                <a-button type="primary" @click="goRecordView" style="float:right">异常反馈</a-button>
              </a-col>
            </a-row>
            <!-- <div class="extra">
              <a-button class="mr16" @click="viewImage" :disabled="has_dicom === '0'">查看影像</a-button>
              <a-button class="mr16" @click="openModal">查看申请单</a-button>
              <a-button :disabled="!reportInfo.snapshot_url" @click="openModal1">报告PDF</a-button>
            </div> -->
          </div>
          <div class="card-contnet" style="user-select: none;">
            <a-row class="card-content-row" style="display: flex; justify-content: center;">
              <a-col :sm="smCol" :md="17" :xl="18" class="card-content-col" :style="styleColLeft">
                <div v-watermark="watermarkConfig" class="water-mark">
                  <a-row class="header">
                    <!-- logo -->
                    <a-col class="logo" :sm="smCol" :md="mdCol" :xl="4">
                      <div>
                        <span style="font-weight:bold;">患者主ID：</span>
                        <span class="title">{{ reportInfo.system_patient_id || '-' }}</span>
                      </div>
                    </a-col>
                    <!-- 大标题 -->
                    <a-col class="bigTitle" :sm="smCol" :md="mdCol" :xl="14">
                      <p>{{ reportInfo.organ_name }}</p>
                      <p>{{ reportInfo.proj_name }}检查报告单</p>
                    </a-col>
                    <a-col :sm="smCol" :md="mdCol" :xl="6" style="display:flex; justify-content:center;">
                      <div v-if="reportInfo.rpt_share === '1'">
                        <p>
                          <img :src="jsHrIcon" alt="" style="height:32px;"/>
                        </p>
                        <p style="text-align:center; font-size: 14px; margin-top:10px;">业务质控</p>
                      </div>
                      <!-- 数据质控的图标和文字已去掉；原来分隔「业务质控 / 数据质控」的竖线也一并去掉 -->
                    </a-col>
                  </a-row>
                  <!-- 病人信息 -->
                  <div class="info">
                    <a-row>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">患者姓名：</span>
                        <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{ reportInfo.name || '-' }}</span>
                          </template>
                          <span>{{ reportInfo.name || '-' }}</span>
                        </a-tooltip>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">年龄/性别：</span>
                         <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{ reportInfo.age || '-' }}/{{ reportInfo.sex || '-' }}</span>
                          </template>
                          <span>{{ reportInfo.age || '-' }}/{{ reportInfo.sex || '-' }}</span>
                        </a-tooltip>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">检查项目：</span>
                        <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{ reportInfo.item_name || '-' }}</span>
                          </template>
                          <span>{{ reportInfo.item_name || '-' }}</span>
                        </a-tooltip>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">就诊类别：</span>
                        <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{ reportInfo.op_em_hp_ex_mark || '-' }}</span>
                          </template>
                          <span>{{ reportInfo.op_em_hp_ex_mark || '-' }}</span>
                        </a-tooltip>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">就诊科室：</span>
                        <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{ reportInfo.chk_dpt_name || '-' }}</span>
                          </template>
                          <span>{{ reportInfo.chk_dpt_name || '-' }}</span>
                        </a-tooltip>
                      </a-col>
                       <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">检查号：</span>
                         <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{ reportInfo.ris_study_id || '-' }}</span>
                          </template>
                          <span>{{ reportInfo.ris_study_id || '-' }}</span>
                        </a-tooltip>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol">
                        <span class="title">门诊/住院号：</span>
                         <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{ reportInfo.op_em_hp_ex_no || '-' }}</span>
                          </template>
                          <span>{{ reportInfo.op_em_hp_ex_no  || '-' }}</span>
                        </a-tooltip>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol">
                        <span class="title">检查日期：</span>
                         <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{ reportInfo.chk_dt || '-' }}</span>
                          </template>
                          <span>{{ reportInfo.chk_dt || '-' }}</span>
                        </a-tooltip>
                      </a-col>
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol">
                        <span class="title">报告日期：</span>
                        <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{ reportInfo.rpt_dt || '-' }}</span>
                          </template>
                          <span>{{ reportInfo.rpt_dt
                            || '-' }}</span>
                        </a-tooltip>
                      </a-col>
                    </a-row>
                    <a-row class="last-row">
                      <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                        <span class="title">检查部位：</span>
                        <a-tooltip placement="top">
                          <template slot="title">
                            <span>{{ reportInfo.ckpt_name || '-' }}</span>
                          </template>
                          <span>{{ reportInfo.ckpt_name || '-' }}</span>
                        </a-tooltip>
                      </a-col>
                    </a-row>
                  </div>
                  <!-- 报告呈现信息 -->
                  <div class="present">
                    <div class="image-present">
                      <span class="title" style="display: inline-block;">影像表现</span>
                      <ul class="img-block" v-if="reportInfo.thumb_img && reportInfo.thumb_img.length">
                        <li v-for="(item, index) in reportInfo.thumb_img" :key="index">
                          <img :src="item" alt="" />
                        </li>
                      </ul>
                      <p style="word-break: break-all;">
                        {{ reportInfo.rpt_descrip || '-' }}
                      </p>
                    </div>
                    <div class="suggestion mr40">
                      <span class="title">诊断意见</span>
                      <p style="word-break: break-all;">
                        {{ reportInfo.rpt_seeing || '-' }}
                      </p>
                    </div>
                    <!-- <div class="mr40">
                      <span class="title">检查结果：</span>
                      <span>{{ reportInfo.rpt_remark || '-' }}</span>
                    </div> -->
                  </div>
                  <!-- 底部信息 -->
                  <div class="footer">
                    <div class="doctor">
                      <div>
                        <span class="title">检查医生：</span>
                        <span>{{ reportInfo.chk_doc_name || '-' }}</span>
                      </div>
                      <div class="name">
                        <span class="title">审核医师：</span>
                        <span>{{ reportInfo.rv_name || '-' }}</span>
                      </div>
                    </div>
                    <div class="doctor mb24">
                      <div>
                        <span class="title">报告医师：</span>
                        <span>{{ reportInfo.rpt_name || '-' }}</span>
                      </div>
                      <div class="name">
                        <span class="title">二审医师：</span>
                        <span>{{ reportInfo.rv2_name || '-'}}</span>
                      </div>
                    </div>
                    <p class="tip">*本报告仅作临床参考</p>
                  </div>
                </div>
              </a-col>
              <!-- 查看申请单 -->
              <div class="apply">
                <a class="btn" @click="openModal">
                  <img :src="applyIcon" alt="">
                  <span>申请单</span>
                </a>
                <a @click="viewImage" class="btn" :class="has_dicom === '0' ? 'disabled-btn' : ''">
                  <img :src="imgIcon" alt="">
                  <span>影像详情</span>
                </a>
                <!-- <a class="btn" :class="!reportInfo.snapshot_url ? 'disabled-btn' : ''" @click="openModal1">报告快照</a> -->
              </div>
            </a-row>
          </div>
        </a-card>
      </div>
      <!-- 影像信息 -->
      <div class="image-info" v-if="classify === 1">
        <a-card :title="showTitle" :bordered="false" :loading="cardLoading">
          <div slot="extra">
            <a-space>
              <a-button type="primary" @click="goRecordView">异常反馈</a-button>
              <a-button icon="fullscreen" @click="imageFull">全屏</a-button>
            </a-space>
          </div>
          <div class="iframe-content" v-if="iframeSrc">
            <iframe :src="iframeSrc" frameborder="0" class="iframe-wrap" id="imageIframe"></iframe>
          </div>
          <a-empty v-if="!iframeSrc && (!reportInfo.if_dicom_upload || reportInfo.if_dicom_upload === '0')" style="margin-bottom: 32px;margin-top: 32px;">
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
         <!-- 修改复制功能 START -->
        <a-row class="m-b-md">
          <a-col>
            <span class="flag"></span>
            <span class="title">引用</span>
          </a-col>
        </a-row>
        <a-row class="m-b-md">
          <a-checkbox-group v-model="checkedList1" @change="onChange1">
            <a-checkbox  v-for="(item, index) in reportReason" :key="item.key" :value="item.key"  :disabled="index === 0">{{ item.label }}</a-checkbox>
          </a-checkbox-group>
        </a-row>
        <a-row class="m-b-md" style="margin-bottom: 48px;">
          <a-col style="text-align: right">
            <a-button ref="copy" type="primary" @click="copy(copyText, $event)">一键复制</a-button>
          </a-col>
        </a-row>
        <!-- 修改复制功能 END -->
        <!-- 检查结果互认整块（标题 / 接诊患者信息 / 互认单选 / 理由）按产品要求隐藏。
             这块和下面的「返回、提交」是一套互认流程，一起收起；
             用 v-if 关掉而不是删掉，和本文件里其他被隐藏的块保持同一种做法 -->
        <template v-if="false">
        <!-- 标题 -->
        <!-- <template v-if="source!=='2'"> -->
        <a-row class="m-b-md">
          <a-col>
            <span class="flag"></span>
            <span class="title">检查结果互认</span>
            <a-tooltip>
              <template slot="title">
                <article>
                  <!-- 根据《关于印发医疗机构检查检验结果互认管理办法的通知》国卫医发〔2022〕6号，检查结果指：通过超声、X线、核磁共振成像、电生理、核医学等手段对人体进行检查，所得到的图像或数据信息。检查结果互认，以检查产生的图像信息为互认主体。 -->
                  根据《关于印发医疗机构检查检验结果互认管理办法的通知》国卫医发〔2022〕6号，检查结果指：通过超声、X线、核磁共振成像、电生理、核医学等手段对人体进行检查，所得到的图像或数据信息。检查结果互认，以检查产生的图像信息为互认主体。根据《关于做好{{sourceName}}医保数据共享中心检查结果互认医疗机构间互认工作的通知苏卫医政[2022]18号》文件要求：
                  1. 二级乙等及以下医疗机构间、二级甲等及以上医疗机构间 医学影像检查结果予以互认。二级乙等及以下医疗机构对二级甲等及以上医疗机构医学影像检查结果予以认可。
                  2. 城市医联体、县域医共体内各医疗机构对医学影像检查结果予以互认。
                  如二级及以下医疗机构的医学影像检查结果符合诊断结果的质量要求，三级医院也可以认可。
                </article>
              </template>
              <a-icon type="question-circle" />
            </a-tooltip>
          </a-col>
        </a-row>
        <a-row class="m10">
          <div class="patient-info patient-before">接诊患者信息
            <span class="patient-info-title" @click="changePatientInfo">
              <template v-if="showPatientInfo">
                <a-icon type="up" />
              </template>
              <template v-else>
                <a-icon type="down" />
              </template>
            </span>
          </div>
          <div v-if="showPatientInfo" class="ml-10">
            <p>调阅流水号：{{patientInfo.view_record_id ||'-'}}</p>
            <p class="mt-8">就诊时间：{{patientInfo.study_request_time ||'-'}}</p>
            <p class="mt-8">就诊科室：{{patientInfo.dpt_name ||'-'}}</p>
            <p class="mt-8">检查部位：{{patientInfo.ckpt_name ||'-'}}</p>
            <p class="mt-8">检查设备类型：{{patientInfo.modality ||'-'}}</p>
            <p class="mt-8">开单检查项目：{{patientInfo.proj_name ||'-'}}</p>
          </div>
        </a-row>
        <a-row class="mb-10 patient-before">检查结果互认</a-row>
        <!-- 按钮操作 -->
        <a-row class="m-b-md">
          <a-col>
            <a-radio-group v-model="radioValue" @change="radioChange" :disabled="radioDisabled">
              <a-radio :value="'1'">互认</a-radio>
              <a-radio :value="'2'">不互认</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
        <!-- 互认理由 -->
         <!-- 因为产品需要需要改变，别人的代码，直接隐藏吧 -->
        <a-row class="m-b-md" v-if="radioValue === '1' && false">
          <div class="hr-reason">
            <a-checkbox-group v-model="checkedList1" @change="onChange1" :disabled="btnDisabled" >
              <div
                v-for="(item, index) in reportReason"
                :key="item.key"
                class="hr-reason-row"
              >
                <a-checkbox :value="item.key" :disabled="index === 0">{{ item.text }}</a-checkbox>
              </div>
            </a-checkbox-group>
          </div>
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
        <!-- 产品需要：关闭这个复制按钮 -->
        <!-- <a-row class="m-b-md" v-if="radioValue === '1'" style="margin-bottom: 48px;">
          <a-col style="text-align: right">
            <a-button ref="copy" type="primary" @click="copy(copyText, $event)">复制</a-button>
          </a-col>
        </a-row> -->
        <!-- 其他理由 -->
        <a-row class="m-b-md" v-if="radioValue === '2' && checkedList.indexOf(reasonCommon.length + '') !== -1">
          <p class="other-reason">其他理由</p>
          <a-textarea
            :disabled="radioDisabled"
            :maxLength="200"
            :rows="6"
            v-model="otherReason"
            placeholder="不能超过200个字符"
            class="reason-content"
            :class="radioDisabled ? 'reason-content-disabled' : ''"
            ></a-textarea>
        </a-row>
        </template>
      </div>
      <!-- 底部操作 -->
      <div class="bottom">
        <a-row style="margin-bottom: 0">
          <a-col style="text-align: right">
            <a-button type="primary" v-if="btnDisabled" @click="viewList">互认历史清单</a-button>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 查看申请单对话框 -->
    <a-modal :visible="visible" :footer="null" :width="700" @cancel="cancelModal">
      <div slot="title" v-if="applyDataList.length">
         <div class="title-wrap">
            <SimplePagination :totalPage="applyDataList.length" @backClick="backClick1" @nextClick="nextClick1" />
          </div>
      </div>
      <!-- 电子申请单 -->
      <div class="wrap" v-if="applyInfo && applyInfo.apply_type === 2">
        <a-row class="big-title">
          <a-col :sm="smCol" :md="16" :xl="16" class="text-ellpisis">
            <p>{{ applyInfo.organ_name }}</p>
            <p>{{ applyInfo.proj_name }}检查申请单</p>
          </a-col>
        </a-row>
        <a-row class="apply-num">
          <a-col :sm="smCol" :md="24" :xl="24">
            <span class="title">申请单号：</span>
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ applyInfo.exam_id || '-' }}</span>
              </template>
              <span>{{ applyInfo.exam_id || '-' }}</span>
            </a-tooltip>
          </a-col>
        </a-row>
        <a-row class="main-content">
          <div class="content">
            <a-row>
              <a-col :sm="smCol" :md="mdCol" :xl="mdCol" class="text-ellpisis">
                <span class="title">患者姓名：</span>
                 <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ applyInfo.name || '-' }}</span>
                  </template>
                  <span>{{ applyInfo.name || '-' }}</span>
                </a-tooltip>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">年龄/性别：</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ applyInfo.age }}/{{ applyInfo.sex }}</span>
                  </template>
                  <span>{{ applyInfo.age }}/{{ applyInfo.sex }}</span>
                </a-tooltip>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">申请科室：</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ applyInfo.app_dpt_name || '-' }}</span>
                  </template>
                  <span>{{ applyInfo.app_dpt_name || '-' }}</span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">证件类型：</span>
                <span>{{ applyInfo.cardtype || '-' }}</span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">证件号码：</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ applyInfo.cardno || '-' }}</span>
                  </template>
                  <span>{{ applyInfo.cardno || '-' }}</span>
                </a-tooltip>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">医保卡号：</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ applyInfo.idcard_hos || '-' }}</span>
                  </template>
                  <span>{{ applyInfo.idcard_hos || '-' }}</span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">就诊类别：</span>
                 <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ applyInfo.op_em_hp_ex_mark|| '-' }}</span>
                  </template>
                  <span>{{ applyInfo.op_em_hp_ex_mark || '-' }}</span>
                </a-tooltip>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">过敏史：</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ applyInfo.allergy_history || '-' }}</span>
                  </template>
                  <span>{{ applyInfo.allergy_history || '-' }}</span>
                </a-tooltip>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">检查项目：</span>
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ applyInfo.item_name || '-' }}</span>
                  </template>
                  <span>{{ applyInfo.item_name || '-' }}</span>
                </a-tooltip>
              </a-col>
            </a-row>
          </div>
          <div class="content">
            <a-row class="mr24">
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol">
                <span class="title">主诉：</span>
                <span>{{ applyInfo.subj_complaint || '-' }}</span>
              </a-col>
            </a-row>
          </div>
          <div class="content">
            <a-row class="mr24">
              <a-col>
                <p>
                  <span class="title">病史摘要：</span>
                  <span>{{ applyInfo.symptom || '-' }}</span>
                </p>
              </a-col>
            </a-row>
          </div>
          <div class="content">
            <a-row class="mr24">
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol">
                <span class="title">检查目的：</span>
                <span>{{ applyInfo.app_remark || '-'}}</span>
              </a-col>
            </a-row>
          </div>
          <div class="content">
            <a-row class="mr24">
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">检查项目</span>
              </a-col>
              <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">检查部位</span>
              </a-col>
               <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                <span class="title">操作</span>
              </a-col>
            </a-row>
            <div v-if="applyInfo.apply_study_list && applyInfo.apply_study_list.length" class="ch-proj-name" ref="chPro">
              <a-row class="mr12"  v-for="(item, index) in applyInfo.apply_study_list" :key="index">
                <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ item.proj_name || '-' }}</span>
                    </template>
                    <span>{{ item.proj_name || '-' }}</span>
                  </a-tooltip>
                </a-col>
                <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ item.ckpt_name || '-' }}</span>
                    </template>
                    <span>{{ item.ckpt_name || '-' }}</span>
                  </a-tooltip>
                </a-col>
                <a-col :sm="smCol" :md="mdCol" :xl="xlCol" class="text-ellpisis">
                  <a class="aDisable" v-if="item.is_current_study === '1'">当前检查</a>
                  <div v-if="item.is_current_study === '0'">
                    <a class="view-image" :class="item.has_dicom === '0' ? 'aDisable' : ''" @click="viewApply(item, 'dicom')">影像详情</a>
                    <a class="view-report" @click="viewApply(item, 'report')">查看报告</a>
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-row>
        <a-row class="footer mr24">
          <a-col :span="12" class="text-ellpisis">
            <span class="title">申请医师：</span>
            <span>{{ applyInfo.app_doc_name || '-'}}</span>
          </a-col>
          <a-col :span="12" class="text-ellpisis apply-time">
            <span class="title">申请时间：</span>
            <span>{{ applyInfo.apply_dt || '-'}}</span>
          </a-col>
        </a-row>
      </div>
      <!-- 扫描申请单url -->
      <div class="wrap" v-else>
        <a-row class="big-title mb24">
          <a-col :sm="smCol" :md="16" :xl="16" class="text-ellpisis">
            <p>{{ applyInfo && applyInfo.organ_name }}</p>
            <p>{{ applyInfo && applyInfo.ckpt_name }}检查申请单</p>
          </a-col>
        </a-row>
        <a-empty v-if="!applyInfo.scan_report_url" description="暂无申请单信息"></a-empty>
        <img v-else :src="applyInfo.scan_report_url" />
      </div>
    </a-modal>
    <!-- 查看报告PDF -->
    <a-modal :visible="visible1" :footer="null" :width="700" @cancel="cancelModal1">
      <div slot="title">
        <!-- <span>报告PDF</span> -->
        <div class="title-wrap">
          <SimplePagination :totalPage="reportPDFList.length" @backClick="backClick2" @nextClick="nextClick2" />
        </div>
      </div>
      <img v-if="reportInfo.snapshot_type === '1'" :src="reportInfo.snapshot_url" alt="">
      <iframe v-if="reportInfo.snapshot_url && reportInfo.snapshot_type === '2'" :src="reportInfo.snapshot_url" frameborder="0" style="width: 100%; height: 600px;"></iframe>
      <a-empty v-if="!reportInfo.snapshot_url" description="报告快照未上传"></a-empty>
    </a-modal>
    <!-- 页面loading -->
     <!-- <PageLoading v-if="pageLoading" /> -->
  </div>
</template>

<script>
import ENUM from '@/enum'
import '@/utils/directive'
import imgPic from '@/assets/detail/icon.png'
import mqIcon from '@/assets/detail/mq.png'
import applyIcon from '@/assets/detail/apply.png'
import imgIcon from '@/assets/detail/image.png'
import jsHrIcon from '@/assets/detail/js-hr.svg'
import {copyToClipbord} from '@/utils/methods'
import { handleClipboard } from '@/utils/tool'
import { queryImageDetail, queryApproveList, submitApproveList, getViewerUrl, copyRecord, getReportList, getApplyList, getRecognitionPatient, getTranceList } from '@/api/image-detail'
import { postNormalData, arrTransferStr, jsonTransfer, strToArr } from '@/utils/methods'
// import { PageLoading } from '@/components/PageLoading'
import SimplePagination from '@/components/SimplePagination'
import { dataTracking, commonTracking } from '@/api'
import { getCookie } from '@/utils/cookie'
import { mapGetters,mapState } from 'vuex'
import axios from 'axios'
export default {
  name: 'HomeDetail',
  components: {
    // PageLoading,
    SimplePagination
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
      sourceName: window.CONFIG.source.text,
      traceList: null,// 影像信息
      timer: null,
      iframeImage:null,//影像
      new_label:this.$route.query.new_label,
      patientInfo:{},//患者信息
      source:getCookie('source'),//来源
      view_record_id: this.$route.query.view_record_id || '',
      activeKey:'1',
      page: 1, // 当前页码
      totalPage: 3, // 总页数
      smCol: 24,
      mdCol: 8,
      xlCol: 8,
      ENUM, // 证件类型
      imgPic, // 图片
      mqIcon,
      applyIcon,
      imgIcon,
      jsHrIcon,
      pdfSrc: '', // pdfSrc
      iframeSrc: '',
      visible1: false,
      hospital_code: this.$route.query.hospital_code || '',
      has_dicom: this.$route.query.has_dicom || '', // 是否有影像
      accession_number: this.$route.query.accession_number, // 申请单号
      report_no: this.$route.query.report_no, // 报告单号
      styleColLeft: {
        marginTop: '24px',
        padding:' 53px 36px',
        border: '1px solid #E3E3E3',
        borderRadius: '2px',
        fontSize: '16px',
        background: '#FCFCFC'
      },
      cardLoading: false, // iframe的存在需要加个loading
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
      indeterminate1: false, // 多选框样式
      checkAll1: false, // 是否勾选全部
      checkedList1: [], // 勾选项-互认
      btnDisabled: false, // 提交按钮是否禁用
      visible: false, // 是否展示申请单对话框
      checkedList: [], // 勾选项-不互认
      otherReason: '', // 其他理由
      reasonCommon: [], // 客观原因-从后端返回的
      copyText: '', // 复制文本的内容
      activatedFlag: false, // 激活标志
      in_patient_Id: '',
      reportDataList: [], // 报告数据
      applyDataList: [], // 申请单数据
      reportPDFList: [], // 报告pdf
      applyInfo: {}, // 单个申请单信息
      reportInfo: { // 单个报告单信息
      },
      reportReason: [], // 互认理由
      imgReason: [], // 影像-互认理由
      watermarkConfig: {
        text: '',
        font: '16px Vedana',
        textColor: '#e0e9f8',
        width: 330,
        height: 150,
        textRotate: -30,
      },
      showPatientInfo:true,//是否展示流水信息
      // title: '报告详情'
      initTime:new Date().getTime(),
    }
  },
  methods: {
    // 获取影像详情
    getTranceList(){
      if(this.classify === 2) return
      getTranceList({
        study_primary_id: this.study_id
      }).then(res=>{
        if(res.code === 200){
          this.traceList = res.data ? res.data [0] : {}
        }
      })
    },
    // 点击异常反馈 跳转到异常反馈中的反馈记录页面
    // 反馈类型（报告类异常）、患者姓名、患者证件号、检查设备类型、检查项目名称、检查医院、检查时间，带入内容允许用户调整。
    goRecordView(){
      const _obj  = this.classify === 2 ? this.reportInfo :  this.traceList
      this.$router.push({
        path: '/abnormal/feedback',
        query: {
          issue_type: this.classify === 1 ? 'image-problem-feedback' : 'report-problem-feedback',// 反馈类型
          patient_name: _obj.name, // 患者姓名
          cardno: this.$route.query?.patient_id_card, // 患者证件号
          modality: _obj.proj_name, // 检查设备类型  不要看参数名字会错意，找了后端确认的
          proj_name: _obj.item_name,// 检查项目名称
          hospital_name: _obj.organ_name, // 检查医院
          chk_dt: _obj.chk_dt,// 检查时间
          ris_study_id:_obj.ris_study_id // ris_study_id
        }
      })
    },
    //是否展示流水信息
    changePatientInfo(){
      this.showPatientInfo=!this.showPatientInfo
    },
    // 互认板块患者信息
    async getRecognitionPatientX(){
        const {data, code } = await getRecognitionPatient({view_record_id:this.view_record_id||getCookie('view_record_id'),study_primary_id: this.study_id})
        if(code===200){
          this.patientInfo=data||{}
          this.handleData(data)
        }
    },
    imageFull () {
      window.open(this.iframeSrc)
    },
    /**
     * @Description: 查看历史互认清单
     * @return {*}
     * @author: renyong
     */    
    viewList() {
      this.$router.push({
        path: '/mutual-statisic/history-mutual',
        query: {
          name: this.reportInfo && this.reportInfo.name
        }
      })
    },
    async getDataAll() { // 获取所有数据
      this.cardLoading = true
      Promise.all([
        this.queryReportList(),
      ]).then(() => {
        this.cardLoading = false
      })
    },
    // 申请单内部查看影像或者报告
    viewApply(record, type) {
      this.visible = false
     // 添加到tabPane标签页容器中, 添加之前比对有无重复添加标签页
      const text = record.pat_name + ' ' + record.ckpt_name
      const obj = {
        // 组装数据
        id: record.study_primary_id,
        text,
        // status: record.hr_flag || '0',
        type,
        key:
          type === 'dicom'
            ? `/detail/image?uid=${this.userInfo.uid}&id=${record.study_primary_id}&type=dicom&pat_name=${record.pat_name}&item_name=${record.ckpt_name}&has_dicom=${record.has_dicom}&has_report=${record.has_report}&hospital_code=${record.hospital_code}`
            : `/detail/report?uid=${this.userInfo.uid}&id=${record.study_primary_id}&type=report&pat_name=${record.pat_name}&item_name=${record.ckpt_name}&has_dicom=${record.has_dicom}&has_report=${record.has_report}&hospital_code=${record.hospital_code}`,
      }
      const tabPane = this.$store.getters.tabPane
      const bol = tabPane.some((item) => item.id === obj.id && item.type === type) // 如果匹配其中一项
      if (!bol) {
        // 如果都没有对应的key，则添加
        this.$store.dispatch('PushTabPane', obj) // 添加标签页
      }
      this.$router.push({
        path: type === 'dicom' ? '/detail/image' : '/detail/report',
        query: {
          id: record.study_primary_id,
          type,
          pat_name: record.pat_name,
          item_name: record.ckpt_name,
          has_dicom: record.has_dicom,
          has_report: record.has_report,
          hospital_code: record.hospital_code
        },
      })
    },
    /* 报告单 start----------- */
    // 点击上一页
    backClick(page) {
      this.getReportInfo(page)
    },
    // 点击下一页
    nextClick(page) {
      this.getReportInfo(page)
    },
    /* 报告单 end------------- */
    getReportInfo(page) {
      this.reportInfo = this.reportDataList.find((item, index) => index + 1 === page)
      this.handleData(this.reportInfo)
    },
    /*  申请单 start------------*/
    // 申请单点击上一页
    backClick1(page) {
      this.getApplyInfo(page)
      // console.log('back1', page)
    },
    // 
    nextClick1(page) {
      this.getApplyInfo(page)
      // console.log('next1', page)
    },
    /* 申请单 end ------------ */
    getApplyInfo(page) {
      this.applyInfo = this.applyDataList.find((item, index) => index + 1 === page)
    },
    /* 报告pdf start */
    backClick2(page) {
      this.getReportPdf(page)
      // console.log('back2', page)
    },
    nextClick2(page) {
      this.getReportPdf(page)
      // console.log('next2', page)
    },
    // 获取pdf
    getReportPdf(page) {
      this.reportInfo.snapshot_url = this.reportPDFList.find((item, index) => index + 1 === page)
    },
    /* 报告pdf end */
     // 获取pdf
    async getDdfData() {
      const mimeMap = {
        zip: 'application/zip',
        pdf: 'application/pdf',
        png: 'application/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        csv: 'application/csv',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        bmp: 'image/bmp',
        gif: 'image/gif',
      }
      // console.log(1)
      const { data = null } = await axios({
        url: '/1',
        method: 'get',
        responseType: 'arraybuffer',
      })
      const mimeType = mimeMap.pdf
      this.resolveBlob(data, mimeType)
      // console.log(data)
    },
    /**
   * 解析blob响应内容并下载
   * @param {*} res blob响应内容
   * @param {String} mimeType MIME类型
   */
    resolveBlob(res, mimeType) {
      // const aLink = document.createElement('a')
      const blob = new Blob([res], { type: mimeType })
      // 视情况而定
      // console.log(blob)
      const url = URL.createObjectURL(blob)
      this.pdfSrc = url
      // console.log('pdfSrc',this.pdfSrc)
    },
    cancelModal1() {
      this.visible1 = false
    },
     // 查询互认清单
    async queryApprove() {
      const { data = {} } = await queryApproveList()
      const obj = !!data && data 
      // const { img, report, reprotObj, imgObj } = data && data
      // const obj = this.classify === 1 ? (img && img.common) : (report && report.common)
      this.reasonCommon = jsonTransfer(obj) // 不互认理由
      // console.log('reason', this.reasonCommon)
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
      this.otherReason = this.checkedList.indexOf('0000') == -1 ? '' : this.otherReason
    },
    async getViewerUrlData(prop) {
      this.iframeSrc = '' // iframeSrc 先清空
      this.cardLoading = true
      const { data = '' } = await getViewerUrl(prop)
      this.cardLoading = false
      this.iframeSrc = `${data || ''}`
      this.$nextTick(() => {
        this.iframeLoad()
      })
    },
    // 判断iframe是否加载完成
    iframeLoad() {
      const _this=this
      const {requestStart}=this.navigator||{}
      const timeLength=(this.new_label==='1'?requestStart:this.initTime)
      const num = 10000 - Math.abs(new Date().getTime()-timeLength)
      this.iframeImage = document.getElementById('imageIframe')
      let isRequest=true
      const {chk_modality,item_name}=this.$route.query||{}
      this.timer=setTimeout(()=>{
        isRequest=false
        clearTimeout(this.timer)
        _this.setPoint('image_viewer','image_viewer_loading_success','',{viewer_request_duration:`${new Date().getTime()- timeLength}`,viewer_loading_state:'0',chk_modality,proj_name:item_name})
      },num)
      if(this.iframeImage){
        // 处理兼容行问题 兼容IE
        if (this.iframeImage.attachEvent) {
          this.iframeImage.attachEvent('onload', function() {
            console.log('ieiframe加载完毕以后执行操作')
          // iframe加载完毕以后执行操作
          isRequest&&_this.iframePoint({viewer_request_duration:`${new Date().getTime()- timeLength}`,viewer_loading_state:'1'})
          })
        } else {
          this.iframeImage.onload = function(e,e1) {
          // iframe加载完毕以后执行操作
          console.log('iframe加载完毕以后执行操作')
          isRequest&&_this.iframePoint({viewer_request_duration:`${new Date().getTime()- timeLength}`,viewer_loading_state:'1'})
          }
        }
      }
    },
    iframePoint(time){
      const {chk_modality,item_name}=this.$route.query||{}
       clearTimeout(this.timer)
        this.setPoint('image_viewer','image_viewer_loading_success','',{...time,chk_modality,proj_name:item_name})
    },
    // 渲染text
    renderText(text) {
      return (
        <a-tooltip placement="top">
          <template slot="title">
            <span>{ text || '-' }</span>
          </template>
          <span>{ text || '-' }</span>
        </a-tooltip>
      )
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
     // 埋点设置
    async trackingEvent(params) {
      const { data = null } = await dataTracking(params)
      console.log('data', data)
    },
    // 查看影像
    viewImage() {
      if (this.has_dicom === '0') return
      // 设置查看影像埋点
      const sending_time = +new Date()
      const trackingParams = {}
      const trackingObj = {
        sending_time,
        appver: '1.0.1',
        type: 'pacs_view',
        extension: {
          doc_id: this.userInfo.uid,
          doc_hospital_id: getCookie('org_id'),
          patient_name: this.reportInfo.name
        }
      }
      Object.assign(trackingParams,trackingObj, {
        tm: +new Date(), // 记录触发事件
        action: 'pacs_view_click',
      })
      // 记录查看影像埋点
      this.trackingEvent(trackingParams)

      // 判断store中是否有该key 用id和type来判断
      const id = this.$route.query.id
      const type = 'dicom'
      const pat_name = this.$route.query.pat_name
      const item_name = this.$route.query.item_name
      const has_dicom = this.$route.query.has_dicom
      const has_report = this.$route.query.has_report
      const hospital_code = this.$route.query.hospital_code
      const query = {
        uid: this.userInfo.uid,
        id,
        type,
        has_dicom,
        has_report,
        hospital_code,
        pat_name,
        item_name,
      }
      const obj = { // 往store中组装数据
        id,
        key: `/detail/image?uid=${this.userInfo.uid}&id=${id}&type=${type}&has_dicom=${has_dicom}&has_report=${has_report}&hospital_code=${hospital_code}&pat_name=${pat_name}&item_name=${item_name}&report=1`,
        status: this.$route.query.hr_flag,
        text: `${this.$route.query.pat_name} ${this.$route.query.item_name}`,
        type: 'dicom',
        report:'1'
      }
      const tabPane = this.$store.getters.tabPane
      let flag = false
      tabPane.forEach((v, k) => {
        if (v.id === obj.id && v.type === obj.type) {
          if(v.new_label){
            this.$store.state.app.tabPane.splice(k,1)
          }else{
            flag = true
          }
        }
      })
      if (!flag) {
        // 如果都没有对应的key，则添加
        this.$store.dispatch('PushTabPane', obj) // 添加标签页
      }
      // const newPage = this.$router.resolve({
      //   path: '/detail/image',
      //   query: {
      //     ...query,
      //     new_label: '1'
      //   }
      // })
      // window.open(newPage.href, '_blank')
      // console.log(newPage.href)
      this.$router.push({
        path: '/detail/image',
        query: {
          ...query,
          report: '1'
        }
      })
    },
    onChange1(checkedList) {
      this.checkedList1 = checkedList
    },
    // 切换勾选
    // 报告互认-客观原因勾选不是全部时
    onChange(checkedList) {
      this.checkedList = checkedList
      this.indeterminate = !!checkedList.length && checkedList.length < this.reasonCommon.length
      this.checkAll = checkedList.length === this.reasonCommon.length
      this.isShowTip2 = !this.checkedList.length
      this.otherReason = ~this.checkedList.indexOf(this.reasonCommon.length + '') ? '' : this.otherReason
    },
    // 按钮值改变之后
    radioChange(e) {
      this.radioValue = e.target.value
      this.isShowTip1 = this.isShowTip2 = false
      this.checkedList = []
      this.checkedList1 = [this.reportReason[0].key]
      this.indeterminate = false
    },
    // 点击返回
    back() {
      const self = this
      const path = this.$store.getters.tabPane[0].key.includes('/home/index') ? this.$store.getters.tabPane[0].key : '/home/index'// 获取url
      if (!this.btnDisabled) {
        // 如果没进行互认操作
        this.$confirm({
          title: '提示',
          content: (h) =>
            `当前页面有${
              !self.radioValue ? '未完成' : '未提交'
            }的互认评价，是否确定退出？`,
          icon: (h) => <a-icon type="exclamation-circle" />,
          onOk() {
            self.$router.push({
              path
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
      const _obj  = this.classify === 2 ? {...(this.reportInfo || {})} :  {...(this.traceList|| {})}
      const {type,patient_id_card,app_dpt_name,id,patient_name,view_record_id,item_name}=this.$route.query
      e.preventDefault()
      const sending_time = +new Date()
      const arr = []
      let not_recognition_reason= ''
      this.reasonCommon.forEach((item) => {
        if (this.checkedList.includes(item.key)) {
          arr.push(item.text)
        }
      })
      if(this.radioValue === '2'){
        not_recognition_reason = arr.join(',')
        if(this.otherReason){
          not_recognition_reason = `${not_recognition_reason},${this.otherReason}`
        }
      }
      commonTracking(
        {
            event_id: `iis.${window.CONFIG.apiPath}.index.click`,
            sending_time,
            tm:new Date().getTime(), // 记录触发事件
            appver: '1.0.1',
            type:'mutual_recognition',
            action:'get_retrieval_request',
            source:type == 'dicom'? 'image_page_get_request':'report_page_get_request',
            extension: {
              doc_name: this.user_name, 
              hospital_code: getCookie('org_id'),
              patient_name,
              cardno: patient_id_card,
              app_dpt_name,
              view_record_id,
              study_primary_id: id,
              proj_name:item_name,
              is_recognition: `${this.radioValue||''}`,
              not_recognition_reason: not_recognition_reason,
              source: this.source || '3' // 来源 1:重复开单提醒；2：一键查询；3:IP访问或为空
          }
        }
      )
      if (!this.radioValue) { // 如果没有值
        this.isShowTip1 = true
        return
      } else { // 如果有值
        if (this.radioValue === '2') { // 不互认
          if (!this.checkedList.length) {
            return this.isShowTip2 = true
          }
        }
      }
      const arrStr = arrTransferStr(this.checkedList)
      const obj = {
        report_id:  this.$route.query.id,
        // report_id: this.classify === 1 ? this.reportInfo.study_primary_id : ([this.reportInfo.study_primary_id, this.reportInfo.rpt_code].join(',')),
        organ_code: this.$route.query.hospital_code,
        is_recognition_image: this.radioValue || '',
        response_for_image:  arrStr || '',
        remark_for_image: this.otherReason || '',
        // is_recognition_image: this.classify === 1 ? (this.radioValue || '') : '',
        // response_for_image: this.classify === 1 ? (arrStr || 0) : 0,
        // remark_for_image: this.classify === 1 ? (this.otherReason || 0) : 0,
        // is_recognition_report: this.classify === 2 ? (this.radioValue || '') : '',
        // response_for_report: this.classify === 2 ? (arrStr || 0) : 0,
        // remark_for_report:this.classify === 2 ? (this.otherReason || 0) : 0
      }
      const formData = postNormalData(obj)
      try {
        this.pageLoading = true
        const { code = '' } = await submitApproveList(formData)
        if (code === 200) {
          this.radioDisabled = true
          this.$message.success({
            content: '提交成功',
            duration: 2
          })
          this.getDataAll() // 重新查询
          this.getRecognitionPatientX()
          // 成功之后埋点数据
          const trackingParams = {}
          const {id, patient_name, patient_id_card, app_dpt_name, view_record_id} = this.$route.query
          const op_em_hp_ex_mark = getCookie('op_em_hp_ex_mark')
          const trackingObj = {
            sending_time: +new Date(),
            appver: '1.0.1',
            type: 'report_huren', // 报告互认
            extension: {
              doc_hospital_id: getCookie('org_id'),
              patient_name: patient_name,
              op_em_hp_ex_mark: op_em_hp_ex_mark ? decodeURIComponent(op_em_hp_ex_mark) : '',
              is_recognition: `${this.radioValue||''}`,
              recognition_type: this.classify === 2 ? 'report': 'image',
              not_recognition_reason: not_recognition_reason,
              study_primary_ID: id,
              proj_name: this.patientInfo.proj_name,
              ckpt_name: this.patientInfo.ckpt_name,
              chk_modality: this.patientInfo.modality,
              doc_name: this.user_name,
              cardno: patient_id_card,
              app_dpt_name,
              view_record_id,
              source: this.source || '3' // 来源 1:重复开单提醒；2：一键查询；3:IP访问或为空
            },
          }
          Object.assign(trackingParams, trackingObj, {
            tm: +new Date(), // 记录触发事件
            action: this.radioValue === '1' ? 'huren_confirm' : 'huren_deny',
          })
          // 记录查看影像埋点
          this.trackingEvent(trackingParams)
        }
        setTimeout(() => {
          this.pageLoading = false
        }, 300)
      } catch (error) {
        console.log(error)
      }
    },
    // 打开模态框
   async  openModal() {
      if(this.applyDataList.length<1){
        await this.queryApplyList()
      }
      const timeLength=new Date().getTime()
      this.visible = true
      this.setPoint('user_query_behavior','user_application_btn_click','')
      this.$nextTick(()=>{
        this.setPoint('user_query_behavior','application_page_loading_success',this.applyDataList.length>0?'1':'0',{application_request_duration:`${new Date().getTime()- timeLength}`})
      })
    },
    // 打开报告快照
    openModal1() {
      if (!this.reportInfo.snapshot_url) return
      this.visible1 = true
    },
    // 取消模态框
    cancelModal() {
      this.visible = false
    },
    // 复制操作
    async copy(text, event) {
      if(this.reportDataList.length<1){
        await this.getReport()
      }
      const {
        rpt_code, // 报告id
        study_primary_id, // 影像id
        name, // 姓名
        chk_dt, // 检查日期
        rpt_dt, // 报告日期
        organ_name, // 机构名称
        ckpt_name, // 检查名称
        chk_dpt_name, // 检查部门
        rpt_descrip, // 影像表现
        rpt_name, // 报告医师
        proj_name, // 检查项
        rpt_seeing, // 诊断意见
      } = this.reportDataList[0]||{}
           
      // this.btnDisabled = this.radioDisabled = (this.classify === 1 ? (image_hr === '0' || !image_hr) : (report_hr === '0' || !report_hr))
      const isImage = this.classify === 1 // 是否是影像
      // 拼接互认理由
      const obj = {
        '0' : `该条${isImage ? '影像检查号' : '报告ID'}：${isImage ? study_primary_id : rpt_code}，${isImage ? `报告单号：${study_primary_id}` : ``}病人：${name}，检查日期：${chk_dt}，${!isImage ? `报告日期：${rpt_dt}` : ``}，在${organ_name}${chk_dpt_name}进行了${ckpt_name}${proj_name}检查${isImage ? `` : `，`}${!isImage ? `报告医师为：${rpt_name} ` : ``}`,
        '1' : `影像表现如下：${rpt_descrip}`,
        '2' : `诊断意见如下：${rpt_seeing}`
      }
      // const self = this
      // const clipboard = new Clipboard(event.target, {
      //   text: () => text
      // })
      const arr = [] // 存储需要复制的文本值
      this.reportReason.forEach((item)=>{
        if(this.checkedList1.includes(item.key)){
          arr.push(obj[item.key])
        }
      })
      // this.checkedList1.forEach((v, k) => {
      //   this.reportReason.forEach((a, b) => {
      //     if (v === a.key) { // 如果序号匹配
      //       arr.push(a.text) // 将内容push进去
      //     }
      //   })
      // })
      arr.push(`数字服务支持来自${window.CONFIG.source.text}个人医保云`)
      text = arr.join('\r')
      copyToClipbord(text)
      // 复制成功
      this.$message.success({
          content: '复制成功',
          duration: 2,
        })
      this.copyBuriedPoint()
    },
    // 是否再次请求
    requestAgain() {
      // console.log('xcvcv',this.$route.query)
      this.study_id = this.$route.query.id
      this.hospital_code = this.$route.query.hospital_code
      this.type = this.$route.query.type
      this.has_dicom = this.$route.query.has_dicom
      if (this.type == 'dicom') {
        this.getViewerUrlData({
          hospital_code: this.$route.query.hospital_code,
          study_primary_id: this.study_id
        })
      } else {
        this.queryReportList()
      }
    },
    // 复制数据埋点
    copyBuriedPoint() {
      // 传参
      const _data = {
        uid: this.$store.state.user.userLoginInfo && this.$store.state.user.userLoginInfo.uid, // 用户姓名
        org_code: getCookie('org_id') || '', // 调阅人所在账户组织
        type: this.type,  // 类型 dicom-影像 report-报告
        study_id: this.reportInfo.study_primary_id,// 被调阅数据id
        hcode: this.reportInfo && this.reportInfo.organ_code || '', // 检查所属机构
      }
      copyRecord(postNormalData(_data)) // 因为是后台背部处理数据统计，报错等信息无需提供给用户
    },
    // 查询报告列表
    async queryReportList() {
      if(this.$route.query.type === 'report'){
        this.getReport()
      }
     },
     async getReport(){
        this.reportInfo = {}
        this.reportDataList = []
        const reportPDFList = []
        const  time=new Date().getTime()
        const { data = null } = await getReportList({
          study_primary_id: this.study_id
        })
        this.$nextTick(()=>{
          this.setPoint('user_query_behavior','report_page_loading_success',(data&&data.length > 0) ? '1' : '0', {'report_request_duration':`${new Date().getTime()- time}`})
        })
        data && data.forEach(item => {
          item.snapshot_url && reportPDFList.push(item.snapshot_url)
          if (item.thumb_img && Array.isArray(item.thumb_img)) {
            // 这里已经修改为绝对路径了，不需要我们增加前缀
            // item.thumb_img = item.thumb_img.map(item => `/jskydy-org-view${item}`)
          }
        })
        this.reportDataList = data || []
        this.reportInfo = (data && data[0]) || {}
        this.reportPDFList = reportPDFList
        this.handleData(this.reportInfo)
     },
     // 处理返回data
    handleData(data) {
      const {
        response_for_image, // 影像勾选项
        remark_for_image, // 影像-其他理由
        image_has_hr, // 影像是否操作过
        image_hr, // 影像是否互认 1-互认 2-不互认
      } = data
      // console.log('image_hr', image_hr)
      // this.radioValue = this.classify === 1 ? image_hr : report_hr
      this.radioValue = image_hr // 无论是影像还是报告，都取值image_hr(需求变更)
      if (this.classify === 1) { // 影像
        if (image_has_hr === '1') { // 影像操作过
          this.btnDisabled = this.radioDisabled = image_has_hr === '1'
          if (!this.radioDisabled) { // 没有被禁用,放开操作
            Object.assign(this, {
              indeterminate: false,
              checkAll: false,
              checkedList: [], // 影像互认
              otherReason: ''
            })
          } else { // 影像操作被禁用
            const arr = response_for_image // 影像勾选的
            const str = remark_for_image // 其他理由-文本输入
            Object.assign(this, {
              checkedList: strToArr(arr) || [],
              indeterminate: (strToArr(arr).length && strToArr(arr).length !== this.reasonCommon.length),
              checkAll: strToArr(arr).length === this.reasonCommon.length,
              otherReason: str === '0' ? '' : str,
              isShowTip2: false,
              isShowTip1: false
            })
          }
        } else { // 影像没操作过
          this.resetData() // 重置数据
        }
      } else { // 报告
        if (image_has_hr === '1') { // 报告操作过 - 影像和报告都去 image_has_hr
          this.btnDisabled = this.radioDisabled = image_has_hr === '1'
          if (!this.radioDisabled) { // 没有被禁用,放开操作
            Object.assign(this, {
              indeterminate: false,
              checkAll: false,
              checkedList: [], // 报告互认
              otherReason: ''
            })
          } else { // 报告操作被禁用 - 现在都取影像
            // const arr = response_for_report // 报告勾选的
            // const str = remark_for_report // 其他理由-文本输入
            const arr = response_for_image // 影像勾选的
            const str = remark_for_image // 其他理由-文本输入
            Object.assign(this, {
              checkedList: strToArr(arr) || [],
              indeterminate: (strToArr(arr).length && strToArr(arr).length !== this.reasonCommon.length),
              checkAll: strToArr(arr).length === this.reasonCommon.length,
              otherReason: str === '0' ? '' : str,
              isShowTip2: false,
              isShowTip1: false
            })
          }
        } else {
          this.resetData() // 重置数据
        }
      }
    },
    // 获取申请单信息
    async queryApplyList() {
      return new Promise(async (resolve)=>{
        this.applyInfo = {}
        this.applyDataList = []
        const { data = null } = await getApplyList({
          study_primary_id: this.study_id
        })
        resolve()
        // 这里已经修改为绝对路径了，不需要我们增加前缀
        // data && (data.forEach(item => item.scan_report_url && (item.scan_report_url = `/jskydy-org-view${item.scan_report_url}`)))
        this.applyDataList = data || []
        this.applyInfo = (data && data[0]) || {}
      })
    },
    init(){
      const arr1 = [ //报告
        {
          key: '0',
          label: '基本信息',
        },
        {
          key: '1',
          label: '影像表现',
        },
        {
          key: '2',
          label: '诊断意见',
        }
      ]
      const arr2 = [ // 影像
        {
          key: '0',
          label: '基本信息',
        },
      ]
      this.reportReason = this.classify === 1 ? arr2 : arr1
      this.onChange1([this.reportReason[0].key]) // 默认勾选
      this.getTranceList()
    },
        // 埋点
    setPoint(type,action,time='',obj={}){
        const {patient_id_card,app_dpt_name,id,patient_name,view_record_id}=this.$route.query
        const sending_time = +new Date() // 记录埋点开始时间
        this.trackingEvent({
          sending_time,
            tm:new Date().getTime(), // 记录触发事件
            appver: '1.0.1',
            type,
            action,
            extension: {
              doc_name: this.user_name, 
              hospital_code: getCookie('org_id'),
              patient_name,
              cardno: patient_id_card,
              app_dpt_name,
              view_record_id,
              study_primary_id: id,
              is_data_return: time?`${time}`:'',
              ...obj
            }
      })
    }
  },
  watch:{
    '$route.query': {
      handler(newVal, oldVal) {
        // console.log(newVal)
        this.requestAgain()
      }
    },
    '$store.getters.hospitalName': {
      handler(newVal, oldVal) {
        if (!oldVal) return // 防止重复执行查询
        if (newVal !== oldVal) {
          // this.queryDetail()
          this.queryReportList()
        }
        // console.log(newVal, oldVal)
      },
      immediate: true,
      deep: true
    },
  },
  async created() {
    const {type}=this.$route.query
    const {requestStart}=this.navigator||{}
    const timeLength=this.new_label==='1'?requestStart:new Date().getTime()
    await Promise.all([this.getDataAll(), this.queryApprove(), this.getRecognitionPatientX()])
    if (type == 'dicom') {
      await this.getViewerUrlData({
        hospital_code: this.$route.query.hospital_code,
        study_primary_id: this.study_id
      })
      this.setPoint('user_query_behavior','image_page_loading_success',this.iframeSrc?'1':'0',{image_request_duration:`${new Date().getTime()- timeLength}`})
    }
    this.init()
    
  },
  deactivated() { // 未激活
    // console.log('detail deactivated')
  },
  activated() {
   
    // console.log('detail component activated')
  },
  destroyed() {
    if(this.iframeImage){
      // 处理兼容行问题 兼容IE
      if (this.iframeImage.attachEvent) {
        this.iframeImage.detachEvent('onload')
      } else {
        this.iframeImage.onload = null
      }
      clearTimeout(this.timer)
      this.iframeImage = null
    }
  },
  computed: {
    showTitle() {
      return this.classify === 1 ? '影像详情' : '报告详情'
    },
    ...mapGetters(['userInfo']),
    ...mapState({
      navigator: state => state.user.navigator,
    }),
  },
}
</script>
<style lang="less" scoped>
@import url('../style/index.less');
</style>