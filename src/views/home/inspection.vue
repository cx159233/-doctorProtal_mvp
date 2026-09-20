<template>
  <div class="home-page" ref="homePage">
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
              @change="changeName"
              @blur="blurName"
              @keyup.enter="handleSearch('search')"
            >
            </a-input>
          </a-col>
          <a-col :sm="smCol" :md="mdCol" :xl="8" class="mr12">
            <a-input
              placeholder="请输入证件号"
              v-model="postData.patient_id_card"
              allowClear
              :disabled="true"
              @keyup.enter="handleSearch('search')"
              @change="changeIdCard"
              @blur="blurIdCard"
            >
            </a-input>
          </a-col>
          <a-col :span="2">
            <a-button
              type="primary"
              @click="handleSearch('search')"
              :disabled="isBtnDisabled"
              :loading="searchBtnLoading"
            >
              搜索
            </a-button>
          </a-col>
        </a-row>
        <a-row class="top-tips">
          <a-alert type="warning" showIcon>
              <div slot="message">支持查询证件号包括身份证号、护照、军官证、港澳通行证、台湾居住证。(注:主要提供血液、体液、分泌物等各类检验数据调阅)</div>
            </a-alert>
        </a-row>
        <!-- <a-row class="tips">
          <a-col :sm="16" :md="16" :xl="15">
            <a-alert type="warning" showIcon>
              <div slot="message">支持查询证件号包括身份证号、护照、军官证、港澳通行证、台湾居住证。（注：目前主要提供CT、MR等放射类检查，超声、内镜等检查持续开放）</div>
            </a-alert>
          </a-col>
           <a-col :sm="4" :md="mdCol" :xl="8" class="mr12">
          </a-col>
           <a-col :span="2"></a-col>
        </a-row> -->
      </div>
    </div>
    <!-- 查询条件 -->
    <div class="wrap">
      <a-row v-if="tableTip">
        <a-col :span="24">
          <!-- 提示语 -->
          <a-alert type="info" showIcon>
            <div slot="message">患者的类似检查项目</div>
          </a-alert>
        </a-col>
      </a-row>
      <div class="form-query">
        <a-form
          ref="queryForm"
          :form="queryForm"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          @submit="handleSubmit"
          class="form"
        >
          <a-row class="row1 flex1">
            <!-- 医院名称 -->
            <a-col :sm="smCol" :md="mdCol" :xl="xsCol">
              <a-form-item label="医院名称：" class="hospital-name">
                <a-select
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  show-search
                  value
                  mode="multiple"
                  allow-clear
                  v-model="hospital_code"
                  :placeholder="`请选择`"
                  :filter-option="filterOptionHospitalName"
                  @search="(value) => fetch(value,'hospitalList','hospitals')"
                  :not-found-content="fetching ? undefined : null"
                  @focus="(value) => fetch(value,'hospitalList','hospitals')"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="item in hospitalList" :label="item.hospitalName" :key="item.hospitalCode">
                      {{ item.hospitalName }}
                    </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- 检验项目 -->
            <a-col :sm="smCol" :md="mdCol" :xl="xsCol" class="ckpt_name">
              <a-form-item label="检验项目：">
              <a-select
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                show-search
                value
                mode="multiple"
                allow-clear
                v-model="ckpt_name"
                :placeholder="`请选择`"
                :filter-option="false"
                @search="(value) => fetch(value,'ckptArr','projNames')"
                :not-found-content="fetching ? undefined : null"
                @focus="(value) => fetch(value,'ckptArr','projNames')"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option
                  v-for="item in ckptArr"
                  :key="item"
                  :value="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
            </a-col>
            <!-- 重置按钮紧跟筛选条件后面，和记录列表页位置一致 -->
            <a-button @click="handleSearch('search')">重置</a-button>
          </a-row>
        </a-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="query-table">
      <Table
        ref="queryList"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :totalNum="dataSource.length"
        :projectCode="project_code"
        @showTableTip="showTableTip"
        :pagination="pagination"
        @changePageNum="changePageNum"
      />
    </div>
    <!-- 协议内容 -->
    <div class="arguments-content">
      <a @click="viewAgreements(1)">⟪{{sourceName}}个人医保云用户协议⟫</a>
    </div>
    <!-- 用户确认遮罩层 -->
    <a-modal :visible.sync="visible" :maskClosable="false" :footer="null" :closable="false">
      <div slot="title">
        <span>
          <a-icon type="info-circle" style="color: #1890ff; margin-right: 9px"></a-icon>
        </span>
        <span>请确认患者已授权！</span>
      </div>
      <div class="modal-content-wrap">
        <div>
          感谢您信任并使用{{sourceName}}个人医保云。请您在使用我们的服务前，认真地阅读并充分理解
          <a @click="viewAgreements(2)">《用户服务许可协议》</a>
          及
          <a @click="viewAgreements(3)">《数据隐私权政策》</a>
          ，特别是粗体字的条款。如您点击“患者已确认”按钮，即表示您已阅读并同意上述条款，我们将尽全力保证您的合法权益并继续为您提供优质的服务。如您不同意或未点击“患者已确认”按钮，将无法继续使用我们的服务。
          <br />
          <br />
          <p>同时请您注意，我们提供的患者影像资料服务仅供您参考使用，请您根据自己的专业能力独立地对患者做出判断。</p>
        </div>
      </div>
      <div class="bottom-btn">
        <a-button type="primary" @click="cancelTip">患者已确认</a-button>
      </div>
    </a-modal>
    <!-- 协议遮罩层 -->
    <a-modal :visible.sync="agreementsVisible" :maskClosable="false" :footer="null" :closable="false">
      <div slot="title">
        <span>
          <a-icon type="info-circle" style="color: #1890ff; margin-right: 9px"></a-icon>
        </span>
        <span>
          {{viewType === 1 ? `${sourceName}个人医保云用户协议` : (viewType === 2 ? '用户服务许可协议' : '数据隐私权政策')}}
        </span>
      </div>
      <!-- 弹窗内容 -->
      <div class="modal-content-wrap">
        <div style="overflow: auto; height: 200px" v-if="viewType === 1">
          <div v-if="sourceyhxy" v-html="sourceyhxy"></div>
          <template v-else>
          欢迎您使用{{sourceName}}个人医保云。在成为本平台注册用户前，请您务必认真阅读并充分理解《用户服务许可协议》（下称“本协议”）和《数据隐私权政策》的各条款内容，特别是限制或免除我方责任的条款、对用户权利进行限制的条款、约定争议解决方式和司法管辖的条款等，以及开通或使用某项服务的单独协议或规则。对于限制、免除我方责任的条款、涉及您重大权益的条款以及其他我方认为需要特别提醒您注意的内容可能以加粗或加下划线等形式提示您重点关注。 除非您已充分阅读、完全理解并接受本协议所有条款，否则您无权使用本平台服务。若您点击“同意”或“下一步”，或您使用本平台服务，或者以其他任何明示或者默示方式表示接受本协议的，均视为您已阅读并同意签署本协议。本协议即在您与我方之间产生法律效力，成为对双方均具有约束力的法律文件。您不得以未仔细阅读本协议为由进行抗辩。 如果您因年龄、智力等因素而不具有完全民事行为能力，请勿点击“同意”或“下一步”。 
          一、【协议的范围】 
          1.1 本协议是您与我方间关于使用本平台服务所订立的协议。“我方”是指中电通商数字技术（上海）有限公司（为本协议之目的亦包括常州健康医疗大数据运营有限公司）。“用户”是指愿意接受或实际上已经接受我方的本平台服务的使用人，在本协议中更多地称为“您”。 
          1.2“本平台服务”是指我方向用户提供的，包括但不限于查询报告、调阅影像、影像对比、影像评估等服务，具体服务以我方实际提供的为准（下称“本服务”）。 
          1.3 本协议内容同时包括《数据隐私权政策》，以及您在使用本平台某一特定服务时，该服务可能会另有单独的协议、相关业务规则等（下称“单独协议”）。上述内容一经正式发布，即为本协议不可分割的组成部分，您同样应当遵守。您对前述任何单独协议的接受，即视为您对本协议全部的接受。您对本协议的接受，即视为您对《数据隐私权政策》的接受。 
          二、【账号与密码安全】 
          2.1您在使用本服务前需要由{{sourceName}}医疗资源保障局或我方完成首次账户密码登录授权，再由您使用本人身份信息做二次鉴权验证。
          2.2 账号的密码由您自行设定。我方特别提醒您应妥善保管您的账号和密码。当您使用完毕后，应安全退出。因您保管不善可能导致遭受被盗号或密码失窃，责任由您自行承担。 
          2.3 除前述各条款约定外，您还须妥善保管与账户及其密码相关的任何数字证书、手机动态口令或验证码、账户绑定的手机号码等一切信息和设备。如您更换、暂停或终止使用上述信息和/或设备，或遗失或泄露前述信息和/或设备的，您应及时采取必要措施，以减少可能发生的损失。您理解并同意，因上述原因所致损失需由您本人承担。 
          2.4 您承诺妥善保管可能用于账号、密码找回的各项信息或设备，以防止出现他人通过冒充您进行申诉的方式控制您的账号等类似情况。您理解并同意，因出现此类情况所致损失需由您本人承担。 
          2.5 您不得有偿或无偿以任何形式转让账号。否则，您应当自行承担由此产生的任何责任，同时我方保留追究上述行为人法律责任的权利。如果我方发现您并非账号初始申请注册人，我方有权在未经通知的情况下终止您使用该账号。 
          2.6 如您违反相关法律法规、本协议或其他相关协议、规则、我方有权限制、中止、冻结或终止您对账号的使用，并且根据实际情况决定您对账号的使用。 
          2.7 我方按照本协议、相关法律法规或其他相关协议、规则，对您采取限制、中止、冻结或终止您对账号的使用等措施，而由此给您带来的损失，由您自行承担。 
          三、【用户个人/患者信息保护】 
          3.1 保护用户个人/患者信息是我方的一项基本原则。我方将按照本协议及《数据隐私权政策》的规定收集、使用、保护、处理您的个人/患者信息。本协议对个人/患者信息保护相关内容未作明确规定的，均应以《数据隐私权政策》的内容为准。 
          3.2 您在二次鉴权或使用本服务的过程中，可能需要填写一些必要的信息。若国家法律法规有特殊规定的，您需要填写真实的身份信息。若您填写的信息不完整，则可能无法使用本服务或在使用过程中受到限制。 
          3.3 您应为上传至本平台的信息、资料的真实性、完整性及合法性负责，并承担由此产生的一切法律责任。您的资料发送变更时，您应第一时间在本平台上更新。通常情况下，您可根据平台规则浏览、修改自己提交的信息，但出于安全性和身份识别的考虑，您可能无法修改账户首次授权时提供的初始注册信息及其他验证信息。 
          3.4 我方将尽可能运用各种安全技术和程序建立完善的管理制度来保护您的个人/患者信息，以免遭受未经授权的访问、使用或披露。 
          3.5 我方不会将您的个人/患者信息转移或披露给未授权的第三方，除非： （1）相关法律法规或司法机关、行政机关要求。 （2）为完成合并、分立、收购或资产转让而转移。 （3）为提供您要求的服务所必需。 （4）依据《数据隐私权政策》或其他相关协议规则可以转移或披露给任何第三方的情形。 
          四、【使用本服务的方式】 
          4.1 本服务仅为您个人在医疗机构工作时使用，除非您与我方另有约定。 
          4.2 您依本协议条款所取得的权利不可转让。
          4.3 您不得使用任何方式（包括但不限于第三方软件、插件、设备等）对本服务进行干扰、破坏、修改或施加其他影响。 
          4.4 您应当通过我方提供或认可的方式使用本服务，不得通过任何未经我方授权的第三方软件、插件、设备等登录或使用本服务。 
          4.5 任何人未经我方授权不得使用任何第三方软件、插件、外挂、系统等查看、获取本服务中所包含的我方、各医疗机构或用户的任何相关信息、数据等内容。 
          五、【按现状提供服务】 您理解并同意，本服务是按照现有技术和条件所能达到的现状提供的。我方会尽最大努力保障服务的连贯性和安全性，但我方不能随时预见和防范法律、技术以及其他风险，我方对此类风险在法律允许的范围内免责，包括但不限于不可抗力、病毒、木马、黑客攻击、系统不稳定、第三方服务瑕疵、政府行为等原因可能导致的服务中断、数据丢失以及其他的损失和风险。 \
          六、【自备设备】 
          6.1 您应当理解，您使用本服务需自行准备与相关服务有关的终端设备（如电脑、移动终端和必要的网络接入设备等装置），并承担所需的费用（如上网费等费用）。 
          6.2 您理解并同意，您使用本服务时会耗用您的终端设备和带宽等资源。 
          七、【服务费用】 
          7.1 本服务由我方试用期间免收服务费用。试用期间由我方根据系统运行情况、用户体验等综合考虑确定。如试用期后需要收取服务费用，我方将根据法律法规规定提前告知您，与您协商并签署相关协议，请您遵守相关的协议。 
          7.2 我方可能根据实际需要对收费服务的收费标准、方式进行修改和变更，我方也可能会对部分免费服务开始收费。前述修改、变更或开始收费前，我方将会提前通知您所在单位或您。如果您不同意上述修改、变更或付费内容，则应停止使用该服务。 
          7.3 我方降低收费服务的收费标准或者将收费服务改为免费服务提供时，我方保留不对原付费用户提供退费或者费用调整之权利。 
          八、【软件相关约定】 若您使用高版本浏览器（支持H5），您无需安装软件或插件即可使用本服务；若您使用低版本浏览器，您可能需要安装软件或插件才可使用本服务，此时，您还应遵守以下约定： 
          8.1 您在使用本服务的过程中可能需要下载软件或插件，对于这些软件或插件，我方给予您一项个人的、不可转让及非排他性的许可。您仅可为使用本服务的目的而使用这些软件或插件。 
          8.2 为了改善用户体验、保障服务的安全性及产品功能的一致性等目的，我方可能会对软件进行更新。您应该将相关软件更新到最新版本，否则我方并不保证软件或服务能正常使用。 
          8.3 我方可能为不同的终端设备开发不同的软件版本，您应当根据实际情况选择下载合适的版本进行安装。您可以直接从本平台上获取软件，或从得到我方授权的第三方获取。如果您从未从本平台或从经我方授权的第三方获取软件或与软件名称相同的安装程序，我方无法保证该软件或服务能够正常使用，并对因此给您造成的损失不予负责。 
          8.4 除非我方书面许可，您不得从事下列任一行为： （1）删除软件及其副本上关于著作权的信息。 （2）对软件进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现软件的源代码。 （3）对我方拥有知识产权的内容进行使用、出租、出借、复制、修改、链接、转载、汇编、发表、出版、建立镜像站点等。 （4）对软件或者软件运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务器端的交互数据，以及软件运行所必需的系统数据，进行复制、修改、增加、删除、挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非经我方授权的第三方工具/服务接入软件和相关系统。 （5）通过修改或伪造软件运行中的指令、数据等任何方式，增加、删减、变动软件的功能或运行效果，或者将用于上述用途的软件、方法进行运营或向公众传播，无论这些行为是否为商业目的。 （6）通过非我方开发、授权的第三方软件、插件、设备等任何方式，登录或使用我方软件及服务，或制作、发布、传播非我方开发、授权的用于登录或使用我方软件及服务的第三方软件、插件、设备等。 
          九、【知识产权声明】 
          9.1 我方在本服务中提供的内容（包括但不限于文字、图片、影像、计算机软件等）的知识产权归我方或相关权利人所有，用户在使用本服务中所产生内容的知识产权归用户或相关权利人所有，除非您与我方另有约定。 
          9.2 除另有特别声明外，我方提供本服务时所依托软件的著作权、专利权及其他知识产权均归我方所有。 
          9.3 我方在本平台服务中所使用的本平台的全称、简称，本平台的logo、商标等商业标识，其著作权或商标权归我方所有。 
          9.4 上述及其他任何本服务包含的内容的知识产权均受到法律法规保护，未经我方、用户或相关权利人书面许可，任何人不得以任何形式进行使用或创造相关衍生作品。 
          十、【用户违法违规行为】 
          10.1 您在使用本服务时须遵守法律法规，不得制作、复制、发布、传播含有下列内容的信息或从事相关行为，也不得为制作、复制、发布、传播含有下列内容的信息或从事相关行为提供便利： （1）反对宪法所确定的基本原则的。 （2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的。 （3）损害国家荣誉和利益的。 （4）煽动民族仇恨、民族歧视，破坏民族团结的。 （5）破坏国家宗教政策，宣扬邪教和封建迷信的。 （6）散布谣言，扰乱社会秩序，破坏社会稳定的。 （7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的。 （8）侮辱或者诽谤他人，侵害他人合法权益的。 （9）违反法律法规底线、社会主义制度底线、国家利益底线、公民合法权益底线、社会公共秩序底线、道德风尚底线和信息真实性底线的“七条底线”要求的。 （10）相关法律法规或本协议、相关协议、规则等禁止的。
          10.2 您通过本服务查阅患者影像、报告前，应征得患者本人明示同意或授权，并输入患者姓名和身份证号码方可使用。若患者属于未成年人的，应征得未成年人父母（或其他监护人）的明示同意或授权。因可归咎于您的过错（包括但不限于未取得患者明示同意或授权情况下私自查阅、使用相关信息等）导致患者隐私泄露或发生其他违法行为的，您应当为此独立承担责任。 
          10.3 如果您在使用本服务过程中违反了相关法律法规或本协议约定，相关国家机关或机构可能会对您提起诉讼、罚款或采取其他制裁措施，并要求我方给予协助。因此给您或者他人造成损害的，您应自行承担全部责任，我方不承担任何责任。 
          10.4 如果您违反本协议约定，我方有权进行独立判断并采取相应措施，包括但不限于通过技术手段删除、屏蔽相关内容或断开链接等。同时，我方有权视用户的行为性质，采取包括但不限于暂停或终止向您提供服务，限制、中止、冻结或终止账号的使用，追究法律责任等措施。 
          10.5 您违反本协议约定，导致任何主体损失的，您应当独立承担责任；我方因此遭受损失的，您也应当一并赔偿。 
          十一、【遵守当地法律监管】 
          11.1 您在使用本服务过程中应当遵守当地相关的法律法规，并尊重当地的道德和风俗习惯。如果您的行为违反了当地法律法规或道德风俗，您应当为此独立承担责任。 
          11.2 您应避免因使用本服务而使我方违反法律法规或卷入政治和公共事件，否则我方有权暂停或终止对您的服务。 
          十二、【特别说明】 对于记录于平台上的报告、影像、数据，仅供您会诊、确诊、评估等工作过程中参考使用，我方不会对该等信息进行篡改，也不提供任何诊疗服务。因您本人原因导致的错误判断，您应独立承担责任，我方对此不承担责任。 
          十三、【不可抗力及其他免责事由】 
          13.1 您理解并同意，在使用本服务的过程中，可能会遇到不可抗力等风险因素，使本服务受到影响。不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行和风暴等以及社会事件如战争、动乱、政府行为等。出现上述情况时，我方将努力在第一时间与相关单位配合，争取及时进行处理，但是由此给您造成的损失我方在法律允许的范围内免责。 
          13.2 在法律允许的范围内，我方对以下情形导致的服务中断或受阻不承担责任： （1）受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏。 （2）用户或我方的电脑软件、系统、硬件和通信线路出现故障。 （3）用户操作不当或用户通过非我方授权的方式使用本服务。 （4）程序版本过时、设备的老化和/或其兼容性问题。 （5）其他我方无法控制或合理预见的情形。 
          13.3 我方依据本协议约定获得处理违法违规内容的权利，该权利不构成我方的义务或承诺，我方不能保证及时发现违法行为或进行相应处理。
          十四、【协议的生效与变更】 
          14.1 您点击“同意”或“下一步”或使用本服务或者以其他任何明示或者默示方式表示接受本协议的即视为您已阅读本协议并接受本协议的约束。 
          14.2 我方有权在必要时修改本协议条款，并通过合理的方式提前15日在服务页面提示修改内容。您可以在相关服务页面查阅最新版本的协议条款。 
          14.3 本协议条款变更后，如果您不同意我方所作的修改，您有权停止使用本平台服务，我方将及时进行服务费用结算（如有），如果您继续使用我方提供的软件或服务，即视为您已接受变更后的协议。 
          十五、【服务的变更、中断、终止】 
          15.1 您理解并同意，我方基于经营策略的调整，可能会对服务内容进行变更，也可能会中断、中止或终止服务。 
          15.2 在我方发生合并、分立、收购、资产转让时，我方可向第三方转让本平台服务下相关资产；我方也可在单方通知您后，将本协议下部分或全部服务及相应的权利义务转交由第三方运营或履行。具体受让主体以我方通知的为准。 
          15.3 如发生下列任何一种情形，我方有权不经通知而中断或终止向您提供服务： （1）根据法律法规规定您应提交真实信息，而您提供的个人资料不真实、或与注册时信息不一致又未能提供合理证明。 （2）您违反相关法律法规的规定或违反本协议的约定。 （3）按照法律法规规定，司法机关或主管部门的要求。 （4）出于安全的原因或其他必要的情形。 
          15.4 我方有权按本协议的约定进行收费。若您未按时足额付费，我方有权中断、中止或终止提供服务。 
          十六、【管辖与法律适用】 
          16.1 本协议的成立、生效、履行、解释及纠纷解决等相关事宜，均适用中华人民共和国大陆地区法律（不包括冲突法）。 
          16.2 本协议签订地为中华人民共和国{{sourceDetail}}。 
          16.3 若您和我方之间发生任何纠纷或争议，首先应友好协商解决；协商不成的，您同意将纠纷或争议提交本协议签订地有管辖权的人民法院管辖。 
          16.4 本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。 
          16.5 本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。 
          十七、【其他】 17.1 如果您对本协议或本服务有意见或建议，可发送邮件lvpin@cecinvestment.com与我方联系，我方会给予您必要的帮助。 
          常州健康医疗大数据运营有限公司 2025年 9月22日 数据隐私权政策 本《数据隐私权政策》（“本政策”）由中电通商数字技术（上海）有限公司（为本政策之目的亦包括平台的运营方常州健康医疗大数据运营有限公司，下称“我方”）制定并发布。本政策作为您（下称“您”或“用户”）成为{{sourceName}}个人医保云用户所需签订的《用户服务许可协议》的一部分。请您务必仔细阅读并透彻理解本政策，在确认充分理解并同意后再按照页面上的提示完成全部的二次鉴权程序。用户在进行二次鉴权程序过程中点击“同意”或“下一步”即表示用户完全接受本政策。如果您不同意本政策中的任何内容，或者无法准确理解我方对条款的解释，您应立即停止二次鉴权程序。 本政策将帮助您了解以下内容： 1.个人数据的范围和使用 2.个人数据的保护和处理 3.本政策如何更新 4.如何联系我方 一、个人数据的范围和使用 （一） 您如何使用患者医学影像数据 1. 本平台所提供的医学影像数据范围，包括{{sourceName}}医疗资源保障局下属医疗机构（后续将不时加入其他医疗机构）集中向本平台上传的患者影像、报告等信息，以及在本平台运行中产生的或存储的患者其他数据信息（“患者医学影像数据”）。 2. 患者医学影像数据的使用 您在使用患者医学影像数据前，须获得以下授权或同意（特别地，如属于个人敏感信息，须获得明示授权或同意）： （1）{{sourceName}}医疗资源保障局或相关法律法规规定的{{sourceName}}卫生主管部门的授权或同意； （2）医疗机构的授权或同意； （3）患者本人的授权或同意，并由患者提供患者本人姓名及身份证号等证件号码。 3. 禁止泄密义务 您在使用患者医学影像数据时，需遵守相关法律法规的规定，并在患者本人同意或授权的范围内使用。未征得法律法规规定的合法授权主体同意或授权前，不得将本平台所提供的患者医学影像数据擅自透露给除患者以外的第三人。 （二） 我方如何收集和使用用户信息 1. 用户信息的收集 (1) 您在登录本平台时，平台会同步您所在单位系统的账户信息，并收集您职业医师、技师工号或身份证等信息方便您登录使用。 (2) 在您使用我方服务过程中，为保障您的账号安全、识别账号异常状态、向您提供更契合您需求的服务，我方可能会自动收集用户的使用情况并存储应用程序ID、医院标识、账户标识信息、被调阅患者记录，以及调阅时间等信息。 (3) 鉴于我方提供的服务需要依赖部分信息才能得以运行，若您选择使用我方的服务，则需要向我方提供或允许我方收集必要信息。如拒绝提供相应信息或进行相应的数据使用申请或授权，将无法正常使用我方的全部或部分服务。 2. 用户信息的使用 我方收集用户信息，将在以下情形中使用： (1) 提供本平台服务：为向您提供所需的服务，我方在您使用本平台服务的过程中将根据需求并受限于本政策而使用所收集到的相关用户信息。 在您使用我方服务过程中，为保障您的账号安全、识别账号异常状态、向您提供更契合您需求的服务，我方可能会自动收集用户的使用情况并存储为网络日志信息（包括但不限于设备信息和所在位置相关信息）和服务日志信息（包括但不限于浏览、点击查看、搜索查询、发布信息，以及IP地址、浏览器类型、电信运营商、使用语言、访问日期和时间）。请注意，单独的设备信息、服务日志信息是无法识别特定自然人身份的信息。 (2) 用于政府部门的数据监管：作为{{sourceName}}医保影像云平台，本平台将用户上传、输入、记录、发布、生成于本平台的信息和数据依法定期汇报给相关政府主管部门用以实现对医学影像数据的实时动态监管、统计和分析。对于涉及个人信息的数据将脱敏处理后向相关政府主管部门披露。 (3) 提供安全保障及服务优化：为提高您使用我方及合作伙伴提供服务的安全性，保护用户人身财产安全免遭侵害，更好地预防钓鱼网站、欺诈、网络漏洞、计算机病毒、网络攻击、网络侵入等安全风险，更准确地识别违反法律法规或本平台相关协议规则的情况，我方可能使用或整合您的用户信息、上传、输入、记录、发布、生成于本平台的信息、设备信息、服务日志信息以及我方关联公司、合作伙伴取得您授权或依据法律共享的信息，来综合判断您的账号安全及使用情况，并依法采取必要的记录、审计、分析、处置措施。 为提升优化我方的服务，我方将基于您的操作行为对您的数据进行调查研究和分析。 二、个人数据的保护和处理 （一）个人数据保护 本平台根据国家法律法规的规定及相关主管部门的授权或同意，合法合理的收集、使用、处理患者医学影像数据及用户数据信息。您同意并遵守我方的包括但不限于以下个人数据保护制度或措施： 1. 本平台根据实际需要，为加强数据保护工作，制定数据相关管理制度。在该制度送达或通知您时，您应当遵守并执行； 2. 本平台会根据技术的不断迭代和发展，以及功能的优化，采取相应的个人数据的技术保护措施。您同意前述措施并在需要时更新相关软件或插件； 3. 其他应当采取的个人保护制度或措施。 （二）个人信息的处理 1. 对于平台收集的用户的个人信息及患者医学影像数据信息，除取得您或患者授权或法律法规另有规定外，我方会将这类信息做匿名化、去标识化处理。此外，我方也会为了不断改进和优化上述的功能来使用用户的上述信息。 2. 尽管我方会对个人信息进行脱敏处理，且不会向第三方提供用户信息未经脱敏的个人信息，但以下情况除外： （1）依法提供：我方可能会根据法律法规规定、诉讼、争议解决需要，或按行政、司法机关依法提出的要求（包括但不限于以下情形），向第三方提供个人信息且无需取得信息主体的同意： a) 与国家安全、国防安全有关的； b) 与公共安全、公共卫生、重大公共利益有关的； c) 用于相关政府部门进行数据监管的； d) 与犯罪侦查、起诉、审判和判决执行等司法或行政执法有关的； e) 出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的； （2）经信息主体主动选择或明确同意后提供：经信息主体主动选择/申请或者在获得信息主体的明确同意后，我方会根据信息主体的申请/授权范围进行个人信息的使用。 （3）已成为公开信息：对于信息主体已向社会公众公开的个人信息，或可以从合法公开披露的信息中收集到的个人信息（如合法的新闻报道、政府信息公开等渠道），我方可以在未经信息主体同意的情况下向第三方提供。 （4）为完成合并、分立、收购或资产转让而转移的信息：若我方或平台的所有权人或运营单位发生合并、分立、收购或资产转让的，我方可以在未经信息主体同意的情况下将该个人信息根据合并、分立、收购或资产转让的需要转移至第三方。 （5）根据《用户服务许可协议》，我方/本平台有权提供个人信息的其他情形。 3. 为实现本平台的功能与服务所披露：为更好地实现本平台的服务与功能，我方可能委托授权合作伙伴为您提供某些服务或代表我方履行职能，授权合作伙伴只能接触到其履行职责所需信息，且不得将此信息用于其他任何目的。目前，我方的授权合作伙伴及合作类型为：我方将无法识别到个人的相关信息发送给支持我方业务的供应商、服务提供商和其他合作伙伴，这些支持包括受我方委托提供的技术基础设施服务、分析我方服务的使用方式、衡量服务的有效性、提供客户服务、支付便利或进行学术研究和调查。 三、本政策的更新 本政策可能在必要时进行更新。我方会将对本政策所做的任何变更及时通知到您，通知方式包括但不限于在本平台的上发布，向您提供弹窗提示，或通过邮件方式等其他合理方式。 四、如何联系我方 如果您对本协议或本服务有意见或建议，可发送邮件至lvpin@cecinvestment.com与我方联系，我方会给予您必要的帮助。 常州健康医疗大数据运营有限公司 2025年 9月22日
          </template>
        </div>
        <div style="overflow: auto; height: 200px" v-if="viewType === 2">
          <div v-if="sourceyhfw" v-html="sourceyhfw"></div>
            <div v-else>
              {{ jsonStr.userAgreement }}
            </div>
        </div>
        <div style="overflow: auto; height: 200px" v-if="viewType === 3">
          <div v-if="sourceyhys" v-html="sourceyhys"></div>
            <div v-else>
              {{ jsonStr.userSecert }}
            </div>
        </div>
      </div>
      <div class="bottom-btn">
        <a-button type="primary" @click="cancelAgreements">关闭协议</a-button>
      </div>
    </a-modal>
    <!-- 确认患者已授权遮罩层 -->
    <a-modal
      :visible.sync="confirmVisible"
      :maskClosable="false"
      :footer="null"
      :closable="true"
      :getContainer="() => $refs.homePage "
      :class="['confirm-modal',[2,4].includes(authorizeType)&&'bg-white']"
      @cancel="closeAuth"
    >
      <div slot="title">
        <span>
          <a-icon type="info-circle" style="color: #1890ff; margin-right: 9px;"></a-icon>
        </span>
        <span class="text">
          请确认患者已授权！
        </span>
        <span class="tips">
          (根据患者自身情况，任选其一即可完成授权)
        </span>
      </div>
      <div class="content" :class="true&&'flex-center'">
        <a @click="authorizeClick(1)" v-if="authMethod.includes('1')">
          <img :src="img1" alt="">
          <p class="tip1">{{sourceLabel}}健康通授权</p>
          <p class="tip2">推荐使用该方式，更快捷</p>
        </a>
        <a @click="authorizeClick(2)" v-if="authMethod.includes('2')">
          <img :src="img2" alt="">
          <p class="tip1">短信授权</p>
          <p class="tip2">适用于老年患者人群</p>
        </a>
        <a @click="authorizeClick(3)" v-if="authMethod.includes('3')">
          <img :src="img3" alt="">
          <p class="tip1">医生辅助授权</p>
          <p class="tip2">适用于无法使用手机</p>
          <p class="tip2">网络信号不通畅等场景</p>
        </a>
        <a @click="authorizeClick(5)" v-if="authMethod.includes('4')">
          <img :src="img6" alt="">
          <p class="tip1">第三方扫码授权</p>
          <p class="tip2">适用于医疗机构等</p>
          <p class="tip2">第三方实现的扫码授权场景</p>
        </a>
      </div>
    </a-modal>
    <!-- 患者授权 -->
    <a-modal
      :visible.sync="authorizeVisible"
      :maskClosable="false"
      :closable="false"
      :getContainer="() => $refs.homePage"
      :class="['authorize-modal',[2,4].includes(authorizeType)&&'bg-white']"
      :width="860"
    >
      <div slot="title" class="title">
        <!-- 江苏健康通授权 -->
        <div v-if="authorizeType === 1">
          <span class="text">
            {{sourceLabel}}健康通授权
          </span>
          <span class="tips">
            (公众号或者APP均可完成授权)
          </span>
        </div>
        <!-- 短信授权 -->
        <div v-else-if="authorizeType === 2 || authorizeType===4">
          <span class="text">
            短信授权
          </span>
        </div>
        <!-- 第三方授权 -->
        <div v-else-if="authorizeType === 5">
          <span class="text">
            第三方扫码授权
          </span>
        </div>
        <div v-else>
          <span class="text">
            医生辅助授权
          </span>
        </div>
        <a @click="backToSms" class="other-authorize" v-if="authorizeType===4">
          返回，选择历史手机号码授权
          <a-icon type="right" />
        </a>
        <a @click="backToConfirmModal" class="other-authorize" v-else>
          其他授权方式
          <a-icon type="right" />
        </a>
      </div>
      <div class="content">
        <!-- 江苏健康通授权  -->
        <div v-if="authorizeType === 1" class="authorizeType1">
          <div class="img">
            <div class="img4-img5">
              <div class="img5">
                <img :src="img5"> 
              </div>
              <div>
                <img :src="img4">
              </div>
            </div>
            <div class="text">
              <p>微信搜索「{{sourceLabel}}健康通」公众号</p>
              <p>进入【互联网医疗】-【医疗服务】-【健康档案】-【影像报告】进行授权</p>
            </div>
          </div>
          <div class="qr">
            <div class="pic">
              <img :src="qrImgSrc">
            </div>
            <p>以下扫码途径二选一即可：</p>
            <p>1、打开「{{sourceLabel}}健康通」App左上角扫一扫</p>
            <p>2、打开「{{sourceLabel}}健康通」公众号，点击菜单【我的】-【影像授权】扫描以上二维码进行授权</p>
          </div>
        </div>
        <!--  短信授权 -->
        <div v-else-if="authorizeType === 2" class="authorizeType2">
          <a-row class="row mb8">
            <a-col style="width:110px;display:flex;align-items:center">
              <span class="home-input">历史手机号码</span>
            </a-col>
            <a-col :span="9">
              <a-select v-model="phone" style="width:100%" placeholder="请选择" ref="history">
                <a-select-option v-for="(item,index) in historyPhoneList" :key="index" :value="item">
                  {{item}}
                </a-select-option>
                </a-select>
            </a-col>
          </a-row>
          <a-row class="row">
            <a-col :span="12" style="margin-left: 50px">
              <span style="color: red;" v-if="isNaN(phone)">请选择历史检查中所留存的电话号码</span>
              <span v-if="telErrorMsg" style="color: red;">{{ telErrorMsg }}</span>
            </a-col>
          </a-row>
          <a-row class="row mt8" style="margin-left: 204px;">
            <a-col style="width:60px;" class="title">
              <span>验证码</span>
            </a-col>
            <a-col style="width:188px">
              <a-input
                placeholder="请输入验证码"
                v-model="smsNum"
              ></a-input>
            </a-col>
            <a-col style="text-align: right;margin-left:14px;" :span="4">
              <a-button type="primary" :disabled="checkBtnDisabled || !phone || isNaN(phone)" @click="sendSms"><span v-if="!time">发送验证码</span><span v-if="time">{{ time }}s后再次发送</span></a-button>
            </a-col>
            <a-col @click="selectSms" style="margin-left: 30px; line-height: 32px; width:120px;">
              <span style="color: #1890ff;cursor: pointer;">使用新的手机号码</span>
            </a-col>
          </a-row>
          <a-row class="row">
            <a-col :span="12" style="margin-left: 54px; line-height: 32px;">
              <span style="color: red;" v-if="isNaN(smsNum)">请输入正确的验证码</span>
              <span style="color: red;" v-if="checkErrorMsg">{{ checkErrorMsg }}</span>
            </a-col>
          </a-row>
        </div>
        <!--  新增短信授权 -->
        <div v-else-if="authorizeType === 4" class="authorizeType2">
          <a-row class="row mb8">
            <a-col style="width:80px;display:flex;align-items:center">
              <span class="home-input">手机号码</span>
            </a-col>
            <a-col :span="9">
              <a-input
                ref="newPhone"
                v-model="phone"
                placeholder="请输入手机号码"
                :maxLength="11"
              ></a-input>
            </a-col>
          </a-row>
          <a-row class="row">
            <a-col :span="12" style="margin-left: 20px">
              <span style="color: red;" v-if="isNaN(phone)">请输入正确的手机号</span>
              <span v-if="telErrorMsg" style="color: red;">{{ telErrorMsg }}</span>
            </a-col>
            </a-row>
          <a-row class="row mt8 mb8" style="margin-left:0px">
            <a-col style="width:60px" class="title">
              <span>验证码</span>
            </a-col>
            <a-col style="width:186px">
              <a-input
                placeholder="请输入验证码"
                v-model="smsNum"
              ></a-input>
            </a-col>
            <a-col :span="3" style="text-align: right;margin-left:14px">
              <a-button type="primary" :disabled="checkBtnDisabled || !phone || isNaN(phone)" @click="sendSms"><span v-if="!time">发送验证码</span><span v-if="time">{{ time }}s后再次发送</span></a-button>
            </a-col>
          </a-row>
          <a-row class="row" style="margin-left:22px">
            <a-col :span="12">
              <span style="color: red;" v-if="isNaN(smsNum)">请输入正确的验证码</span>
              <span style="color: red;" v-if="checkErrorMsg">{{ checkErrorMsg }}</span>
            </a-col>
           </a-row>
        </div>
        <!-- 第三方扫码授权 -->
        <div v-else-if="authorizeType === 5" class="authorizeType5">
          <a-steps direction="vertical" size="small">
          <a-step title="第一步" description="请患者打开接入扫码授权服务的渠道应用，通过“扫码授权”功能，进行数据授权。" />
          <a-step title="第二步">
            <div slot="description">
              请患者按照提示进行<span class="color">数据授权</span>。
            </div>
          </a-step>
          <a-step title="第三步" description="完成授权。" />
          </a-steps>  
          <div class="qr-wrapper">
           <div class="qr">
            <img :src="qrImgSrcThird" />
            </div>
           <div class="txt">请患者打开第三方渠道应用，通过应用内的“扫码授权”功能，进行数据授权。</div>  
          </div> 
        </div>
        <!-- 医生辅助授权 -->
        <div v-else class="authorizeType3">
          <div>
            感谢您信任并使用{{sourceName}}个人医保云。请您在使用我们的服务前，认真地阅读并充分理解
            <a @click="viewAgreements(2)">《用户服务许可协议》</a>
            及
            <a @click="viewAgreements(3)" style="font-weight: bold;">《数据隐私权政策》</a>
            ，特别是粗体字的条款。如您点击“同意辅助患者完成授权”按钮，即表示您已阅读并同意上述条款，我们将尽全力保证您的合法权益并继续为您提供优质的服务。如您不同意或未点击“同意辅助患者完成授权”按钮，将无法继续使用我们的服务。
            <br />
            <br />
            <p>同时请您注意，我们提供的患者影像资料服务仅供您参考使用，请您根据自己的专业能力独立地对患者做出判断。</p>
          </div>
        </div>
      </div>
      <div slot="footer" class="footer">
        <a-button v-if="[2,4].includes(authorizeType)" :disabled="!(phone && smsNum)" type="primary" @click="checkSms" :loading="checkSmsLoading">验证并授权</a-button>
        <a v-else @click="confirmAuthorize">
           <a-spin :spinning="confirmBtnLoading">
            <a-icon slot="indicator" type="loading" style="font-size: 24px color:rgba(0, 0, 0, 0.85);" spin />
            <span>
              {{
                authorizeType === 1 || authorizeType === 5  ? '患者已授权' : '同意辅助患者完成授权'
              }}
            </span>
          </a-spin>
        </a>
        <p class="tip-msg" v-if="authTipMsg">
          <span>{{ authTipMsg }}</span>
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {  decode } from 'js-base64'
import Table from '@/components/Table'
import { minxValidate } from './mixin'
import { getSms, getTimeRange, createAuth, getAuthStatus, confirmAuth, getAppQRCode, getMiniQRCode,smsValidate,getHistoryPhone,getAuthMethod } from '@/api/image-list'
import {getAdminTestRpt, getAdminTestRptCondition} from '@/api/inspection'
import { postNormalData, trimStrAll } from '@/utils/methods'
import { setCookie, getCookie, removeCookie } from '@/utils/cookie'
import { isOpenArr, dateRangeArr } from './datasource'
import { mapActions, mapGetters, mapState,mapMutations } from 'vuex'
import { dataTracking,getWaibuUserInfo } from '@/api'
// import { setCookie } from '@/utils/cookie'
import store from '@/store'
import imgIcon from '@/assets/home/recongize.svg'
import img1 from '@/assets/home/img1.png'
import img2 from '@/assets/home/img2.png'
import img3 from '@/assets/home/img3.png'
import img4 from '@/assets/home/img4.png'
import img5 from '@/assets/home/img5.png'
import img6 from '@/assets/home/img6.png'
// import dqIcon from '#/images/dq.png'
// import hrIcon from '#/images/hr.png'
import jsonStr from './config'
import { DEFAULT_PATIENT, OFFLINE_DEMO } from '@/config/demo'
// import { createFeedback } from '@/api/abnormal'
export default {
  name: 'inspection',
  components: {
    Table,
  },
  mixins: [minxValidate],
  data() {
    return {
      sourceyhxy: window.CONFIG.source.yhxy,
      sourceyhfw: window.CONFIG.source.yhfw,
      sourceyhys: window.CONFIG.source.yhys,
      sourceDetail: window.CONFIG.source.detail,
      sourceLabel: window.CONFIG.source.label,
      sourceName:window.CONFIG.source.text,
      authMethod:[], // 授权方式
      historyPhoneList:[],
      jsonStr,
      checkSmsLoading: false, // 验证码授权
      confirmVisible: false, // 确认患者已授权
      authorizeVisible: false, // 具体授权模态框是否展示
      infoBtnDisabled: true, // 验证并授权按钮是否禁用
      checkBtnDisabled: false, // 发送验证码
      authorizeType: 0, // 授权类型 1-江苏健康通授权 2-短信授权 3-医生辅助授权
      checkErrorMsg: '', // 验证失败提示信息
      time_view_range: '',
      imgIcon,
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      btnLoading: false,
      viewType: 1, // 默认为1
      agreementsVisible: false,
      searchBtnLoading: false, // 搜索按钮loading
      searchDisabled: false, // 搜索按钮是否禁用
      searchLoading: false, // 医院名称搜索loading
      isChange: 'init', // 默认为这个状态
      visible: false, // 遮罩层是否展示
      queryForm: this.$form.createForm(this, {
        name: 'queryForm',
      }),
      labelCol: {
        // 标题所在份数
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
      tableTip: false, // 是否展示table上方的提示语
      urlParams: {}, // url后面的参数
      project_code: '', // 项目编号-用于跟table中对应的item匹配
      isOpenArr,
      dateRangeArr,
      colSpan: 6,
      textAlign: 'center',
      isShowMore: false, // 是否展示其余条件
      smCol: 8,
      xsCol: 8,
      mdCol: 8,
      isDropdownChangeVisible: false, // 是否展开下拉
      beginDate: '', // 开始时间
      endDate: '', // 结束时间
      hospital_code: undefined, // 医院编码
      is_all: '0', // 默认180天 1-全部
      is_hr: '2', // '0'-没有互认 '1'-互认 '2'-全量
      patient_name: DEFAULT_PATIENT.name,
      patient_id_card: DEFAULT_PATIENT.idCard,
      urlStrs: '', // 查询参数
      // source: this.$route.query.source, // 来源
      postData: {
        // 提交给后端的数据
        patient_name: DEFAULT_PATIENT.name,
        time_view_range: '',
        patient_id_card: DEFAULT_PATIENT.idCard,
        source: '',
        // is_hr: '2',
        is_all: '0',
      },
      columns: [
      {
        title: '序号',
        key: 'index',
        width: '80px',
        dataIndex: 'index',
        customRender: (text, record, index) => {
          return index + 1
        },
      },
      {
        title: '检验项目名称',
        key: 'projName',
        width: '270px',
        // ellipsis: true,
        dataIndex: 'projName',
        customRender: (text, record, index) => {
          const textNode = this.$createElement(
            'span',
            {
              attrs: {
                title: text,
              },
              style: {
                cursor: 'pointer'
              },
            },
            text || '-'
          )
          return [textNode]
        },
      },
      {
        title: '检验时间',
        key: 'testDt',
        dataIndex: 'testDt',
        // defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(a.testDt).valueOf() - new Date(b.testDt).valueOf(),
      },
      {
        title: '医院名称',
        key: 'organName',
        dataIndex: 'organName',
        customRender: (text, record, index) => {
          return text || '-'
        }
      },
      {
        title: '医院等级',
        key: 'organLevel',
        dataIndex: 'organLevel',
        customRender: (text, record, index) => {
          return text || '-'
        }
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action',
        customRender: (text, record, index) => {
          const child2 = this.$createElement(
            'a',
            {
              attrs: {
              },
              on: {
                click: () => {
                  return this.viewDetail(record, 'report')
                },
              },
            },
            '查看报告'
          )
          return [child2]
        },
      },
    ],
      dataSource: [
      ], // 后端返回的接口数据
      checkTypeList: [], // 检查类型
      hospitalList: [], // 医院名称
      auth_id: '', // 授权id
      qrImgSrc: '', // 二维码图片地址
      authResult: '', // 授权结果
      authTipMsg: '', //授权提示
      confirmBtnLoading: false, // 点击授权按钮
      phone: undefined, // 电话号码
      smsNum: '', // 验证码
      telErrorMsg: '',
      time: 0,
      timer: null,
      ckptTimer:null, // 检验项目定时器
      fetching: false,//下拉框搜索
      ckptArr:[],//检验项目
      ckpt_name:undefined,//检验项目名称

      isFirstEnter: true, // 是否第一次进入
      doc_id: '', // 医生id
      is_authorize:'1',//是否授权
      enterTime:0,//进入页面时间
      pagination:{
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showLessItems: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        //切换每页显示数据时的回调
        onShowSizeChange: (current, pageSize) => {
          this.pagination.current = 1
          this.pagination.pageSize = pageSize
          this.getAllData()
        },
        // 切换分页时的回调
        onChange: (current) => {
          this.pagination.current = current
          this.getAllData()
        },
      },
      qrImgSrcThird: '' // 第三方授权二维码
    }
  },
  methods: {
    ...mapActions(['getTimeViewRange']), // 获取时间范围
    ...mapMutations(['SET_HOSPITALDATA']),
     // 下拉框搜索
    fetch(_value,arr,tag) {
      if(this[arr]&&this[arr].length>0){
        return false
      }
      if (this.ckptTimer) {
        clearTimeout(this.ckptTimer)
      }
      this.ckptTimer = setTimeout(async () => {
        this.fetching = true
        const {patient_id_card,patient_name}=this.postData||{}
        if(patient_id_card && patient_name){
          this.searchLoading = true
          const formData = {
            patientName: patient_name,
            patientIdCard: patient_id_card,
          }
          const { data = {} } = await getAdminTestRptCondition(formData)
          this[arr] = data?.[tag]||[]
          this.searchLoading = false
        }
          this.fetching = false
      })
    },
    //历史手机号码
     getHistoryPhoneList(){
     return new Promise(async(resolve)=>{
      const {code,data} = await getHistoryPhone(this.postData.patient_id_card)
        if(code === 200){
          const {doc_id,phones}=data||{}
          this.historyPhoneList = phones || []
          this.doc_id = doc_id||''
        }
        resolve(true)
     })
    },
    //解密传入的参数 is_encrypt为1时需要解密
    decodeUrl(url, name) {
      const { is_encrypt } = url
      if (name) {
        return (is_encrypt === '1'&& url[name]) ? decode(url[name]) : url[name]
      } else {
        if (is_encrypt === '1') {
          const obj = {}
          Object.keys(url).forEach((i) => {
            if (
              ['doctor_id_card', 'patient_id_card', 'phone'].includes(i)
            ) {
              obj[i] = decode(url[i])
            } else {
              obj[i] = url[i]
            }
          })
          return obj
        } else {
          return url
        }
      }
    },
    // 关闭授权弹窗
    closeAuth() {
      this.authTipMsg = ''
      this.smsNum = ''
      this.checkErrorMsg = ''
      this.telErrorMsg = ''
      this.phone =undefined
      this.time = 0
      this.confirmVisible = this.checkBtnDisabled =false
      this.authorizeVisible = this.confirmBtnLoading = false
      clearInterval(this.timer)
    },
    // 授权
    async authorizeClick(type) { // 1-江苏健康通授权 2-短信授权 3-医生辅助授权
      await this.getHistoryPhoneList()
      this.confirmVisible = false
      this.authorizeVisible = true
      this.authorizeType = type // 将类型传递过来，缓存授权类型
      if (type === 1) { // 江苏健康通
        this.getQRCode()
      }
      if(type === 5){
        this.getThirdQRCode()
      }
      console.log(this.authorizeType,'<<<<type')
    },
    // 点击确认授权按钮
    async confirmAuthorize() {
      this.authTipMsg = '' // 清空患者授权提示信息
      if (this.authorizeType === 1 || this.authorizeType === 5) { // 江苏健康通或者第三方授权
        const params = {
          name: this.postData.patient_name,
          cardno: this.postData.patient_id_card,
          auth_status: 1,
        }
        this.confirmBtnLoading = true
        const { data = {}, code = '', message } = await getAuthStatus(params)
        this.confirmBtnLoading = false
        if (data) {
          this.$message.success({
            content: '授权成功',
            duration: 3
          })
          this.setPoint('inspection_patient_data_check','authorize_success','',{authorize_type:`${this.authorizeType}`})
          this.authorizeVisible = false // 关闭弹窗
          this.getAllData() // 获取全量数据
        }
        if (!data) return this.authTipMsg = message // 授权不成功
      } else if (this.authorizeType === 3) { // 医生辅助授权
        this.confirmBtnLoading = true
        const { data = {}, code = '' } = await confirmAuth({
          name: this.postData.patient_name,
          cardno: this.postData.patient_id_card,
          auth_id: this.auth_id,
          auth_source: '1'
        })
        this.confirmBtnLoading = false
        this.authResult = data || '' // 存储患者授权结果
        if (data === 'ok') {
          this.$message.success({
            content: '授权成功',
            duration: 3
          })
          this.setPoint('inspection_patient_data_check','authorize_success','',{authorize_type:`${this.authorizeType}`})
          this.authorizeVisible = false // 关闭弹窗
          this.getAllData() // 获取全量数据
        }
        
        // console.log('data', data)
      }
    },
    backToSms(){
      this.authorizeType=2
      this.checkBtnDisabled =false
      this.resetData()
    },
    selectSms(){
      this.authorizeType=4
      this.checkBtnDisabled =false
      this.resetData()
    },
    resetData(){
      this.authTipMsg = ''
      this.smsNum = ''
      this.checkErrorMsg = ''
      this.telErrorMsg = ''
      this.phone = undefined
      this.time = 0
      clearInterval(this.timer)
    },
    // 返回患者确认授权模态框
    backToConfirmModal() {
      this.resetData()
      this.authorizeType=0
      this.checkBtnDisabled=false
      this.authorizeVisible = this.confirmBtnLoading = false
      this.confirmVisible = true
    },
    //
   async getAuthMethodX(){
      return new Promise(async(resolve)=>{
        const { data = null ,code} = await getAuthMethod()
        if (code===200) {
        this.authMethod = data||[]
        }
        resolve(true)
      })
    },
    // 获取授权状态
    async authStatus(params) {
      const {requestStart}=this.navigator||{}
      const {phone}=this.urlParams||{}
      const { data = null } = await getAuthStatus(params)
      if (!data) { // 未授权，要创建授权
        if (params.auth_status) delete params.auth_status // 不需要传这个参数
        if (phone && JSON.stringify(this.urlParams) !== '{}') params.phone = phone // 如果url中有mobile
        const {  data = null } = await createAuth(params)
        
        // console.log('createAuth', data)
        if (data && data.auth_id)  {
          this.auth_id = data.auth_id
          await this.getAuthMethodX()
          this.enterTime = new Date().getTime()-requestStart
            this.is_authorize = '0'
          this.confirmVisible = true // 打开授权弹窗
          this.setPoint('inspection_enter_js_iis','authorize_loading_success')
        }
      } else { // 授权成功，发起查询获取全量数据
        this.getAllData()
      }
      this.enterTime = new Date().getTime()-requestStart
    },
    // 获取健康通二维码
    async getQRCode() {
      const { data = {} } = await getAppQRCode({
          auth_request_id: this.auth_id
        })
      this.qrImgSrc = data && data.image_data && data.image_data
    },
        // 获取健康通二维码
    async getThirdQRCode() {
      const { data = {} } = await getMiniQRCode({
          auth_request_id: this.auth_id
        })
      this.qrImgSrcThird = data && data.image_data && data.image_data
    },
    // 点击发送验证码
    async sendSms() {
      this.smsNum = ''
      this.timer = null
      this.checkBtnDisabled = true
      const { data = {}, code = '', message } = await getSms({
        phone: this.phone
      })
      // this.smsNum = data && data
      this.time = 59
      this.timer = setInterval(() => {
        this.time--
        if (this.time === 0) {
          this.time = 0
          this.checkBtnDisabled = false
          clearInterval(this.timer)
        }
      }, 1000)
      if (!data) this.telErrorMsg = message
    },
    // 验证手机号码和验证号吗
    async checkSms() {
      if (isNaN(this.phone)) return
      this.checkSmsLoading = true
      const { data = {}, message = '' } = await smsValidate({
        cardno: this.postData.patient_id_card,
        phone: this.phone,
        code: this.smsNum,
        Name: this.postData.patient_name,
        doc_id:this.authorizeType === 4 ? this.doc_id : undefined,
      })
      this.checkSmsLoading = false
      if (data === 'ok') { // 授权成功
        const { data = {}, code = '', message = '' } = await confirmAuth({
          name: this.postData.patient_name,
          cardno: this.postData.patient_id_card,
          phone: this.phone,
          auth_id: this.auth_id,
          auth_source: '0'
        })
        if (data === 'ok') { // 确认授权成功
          this.$message.success({
            content: '授权成功',
            duration: 3
          })
          this.setPoint('inspection_patient_data_check','authorize_success','',{authorize_type:`2`})
          this.closeAuth()
          this.getAllData() // 查询全量数据
        } else { // 授权失败
          this.authTipMsg = message
        }
      } else { // 授权失败
        this.checkErrorMsg = message
      }
    },
    // 查询初始化
    initSearch(){
      this.reset()
      this.hospitalList = []
      this.handleSearch('search')
    },
    // 获取时间查看范围
    getTimeRangeData() {
      // console.log(1)
      if(getCookie('org_id')){
        getTimeRange().then(res=>{
          if(res.code === 200){
            this.time_view_range = res.data || ''
            if (res && res.data) this.getTimeViewRange(res.data) // 将获取到的时间范围存起来
            // console.log(this.timeViewRange)
            // 需要判断url带的时间查看范围与接口调用的时间查看范围进行对比
            // 需要先获取时间查看范围才能获取列表数据
            this.queryTimeRange(res.data) && this.initSearch()
          }
        })
      }
    },
    queryTimeRange(range){
      var { check_start_time, check_end_time , hospital_code } = this.urlParams||{}
      if(!check_start_time) return true
      if(!check_end_time) return true
      if(range === -1) return true
      check_start_time = check_start_time.replace(/-/g, '/')
      check_end_time = check_end_time.replace(/-/g, '/')
      const startTime = new Date(check_start_time).getTime()
      const endTime = new Date(check_end_time).getTime()
      const _day = (endTime - startTime) / 1000 / 60 / 60 / 24
      const org_id = getCookie('org_id')
      if(parseFloat(_day) > range && org_id === hospital_code){
        this.$warning({
          title: '该用户暂无权限',
          content: h => <div><p style="color: red;">该账号所属账户暂无此时间范围查看权限</p></div>,
          icon: h => <a-icon type="exclamation-circle" />,
          okText: '查看可看范围',
          centered: true,
          zIndex: 9999,
          onOk: () => {
            this.initSearch()
          }
        })
        return false
      }
      return true
    },
    // 协议查看
    viewAgreements(type) {
      this.agreementsVisible = true
      this.viewType = type
    },
    // 取消协议
    cancelAgreements() {
      this.agreementsVisible = false
    },
    // 是否展示table上方的提示语
    showTableTip(bol) {
      this.tableTip = bol
    },
    // 患者姓名失去焦点
    blurName(e) {
      this.postData.patient_name = e.target.value
    },
    // 患者证件号失去焦点
    blurIdCard(e) {
      this.postData.patient_id_card = e.target.value
    },
    //判断是否有权限
    async judgeChomn(){
      const {requestStart}=this.navigator||{}
      const {phone}=this.urlParams||{}
      return new Promise(async(res)=>{
        const {patient_name,patient_id_card}=this.postData
        if(!patient_name||!patient_id_card){
          res(true)
          return
        }
        const params={
          name: patient_name,
          cardno: patient_id_card,
          auth_status: 1 //  0：等待授权 1：授权成功 2：等待授权已过期 3：授权已失效
        }
        const { data = null } = await getAuthStatus(params)
        if (!data) { // 未授权，要创建授权
          if (params.auth_status) delete params.auth_status // 不需要传这个参数
          if (phone && JSON.stringify(this.urlParams) !== '{}') params.phone = phone// 如果url中有mobile
          const {  data = null } = await createAuth(params)
          // console.log('createAuth', data)
          if (data && data.auth_id)  {
            this.auth_id = data.auth_id
            this.enterTime = new Date().getTime()-requestStart
            this.is_authorize = '0'
            await this.getAuthMethodX()
            this.confirmVisible = true // 打开授权弹窗
            this.setPoint('inspection_enter_js_iis','authorize_loading_success')
          }
          res(false)
        }else{
          res(true)
        }
        this.enterTime = new Date().getTime()-requestStart
      })
    },
    // 重置表单数据
    reset() {
      this.$refs.queryForm.form.resetFields()
      this.postData.is_all = '0'
      this.postData.is_hr = '2'
    },
    changePageNum(obj) {
      this.pagination.current=obj.current
    },
    // 处理搜索 如果是查询列表
    handleSearch(type) {
      this.ckpt_name=undefined 
      this.hospital_code = undefined
      this.pagination.current=1
      const sending_time = +new Date() // 记录埋点开始时间
      if (this.isDropdownChangeVisible) return // 如果为true,不执行
      type === 'search' ? this.reset() : null // 初始化不用重置，点击搜索就重置
      if (this.postData.patient_name && this.postData.patient_id_card) { // 患者姓名和证件号都存在
        // 点击搜索重置
        this.postData.patient_name = trimStrAll(this.postData.patient_name)
        this.postData.patient_id_card = trimStrAll(this.postData.patient_id_card)
        this.SET_HOSPITALDATA({ patient_name: this.postData.patient_name, patient_id_card: this.postData.patient_id_card })
        // 点击搜索按钮埋点设置
        this.trackingEvent({
          sending_time,
          tm: +new Date(), // 记录触发事件
          appver: '1.0.1',
          type: 'pacs_search',
          action: 'inspection_search_btn_click',
          extension: {
            // doc_name: this.userInfo.user_name,
            doc_id: this.userInfo.uid,
            doc_hospital_id: getCookie('org_id'),
            patient_name: this.postData.patient_name,
            doc_name: this.userInfo.user_name,
            hospital_name: this.urlParams.hospital_name||this.$store.getters.hospitalName,
            patient_idcard: this.postData.patient_id_card,
          }
        })
        if (OFFLINE_DEMO) {
          // 离线演示：问不到授权状态，直接出列表（跟门诊/病理那几个查询页一个口径）
          this.getAllData()
        } else {
          // 先去查询授权状态
          this.authStatus({
            name: this.postData.patient_name,
            cardno: this.postData.patient_id_card,
            auth_status: 1 //  0：等待授权 1：授权成功 2：等待授权已过期 3：授权已失效
          })
        }
        // 将患者姓名和证件号缓存起来
        this.patient_name = this.postData.patient_name
        this.patient_id_card = this.postData.patient_id_card
        return
      }
    },
    // 埋点设置
    async trackingEvent(params) {
      const { data = null } = await dataTracking(params)
      console.log('data', data)
    },
    // 关闭弹窗
    cancelTip() {
      this.visible = false
    },
    // 打开弹窗
    openTip() {
      this.visible = true
    },
    // 获取全量数据
    getAllData() {
      const obj = {
        patient_name: this.postData.patient_name,
        time_view_range: this.time_view_range || -1,
        patient_id_card: this.postData.patient_id_card,
        source: this.urlParams.source || '3' // 来源 1:重复开单提醒；2：一键查询；3:IP访问或为空
      }
      if (this.urlParams.exam_item_code) { obj['exam_item_code'] = this.urlParams.exam_item_code }
      const formData = postNormalData(obj)
      this.queryList(formData)
    },
    // 切换弹窗状态
    toggleTip() {
      this.visible = !this.visible
    },
    // 提交要查询的数据并进行查询
    postFormData(postData) {
      this.queryList(postData)
    },
    // 获取患者姓名
    changeName(e) {
      this.postData.patient_name = e.target.value
    },
    // 获取证件号码
    changeIdCard(e) {
      this.postData.patient_id_card = e.target.value
      // console.log(this.postData.patient_id_card,this.patient_id_card)
    },
    // 远程搜索模糊查询医院名称
    filterOptionHospitalName(input, option) {
      return option.componentOptions.propsData.label.toLowerCase().indexOf(input.toLowerCase) > -1
    },
    // 日期改变
    changeDate(date, dateString) {
      this.beginDate = dateString[0]
      this.endDate = dateString[1]
    },
    // 提交查询
    handleSubmit(e) {
      e.preventDefault()
      this.queryForm.validateFields((err, values) => {
        if (!err) {
          let formData = null
          const obj2 = {
            time_view_range: this.time_view_range,
            patient_name: trimStrAll(this.patient_name),
            patient_id_card: trimStrAll(this.patient_id_card),
            hospital_code: this.hospital_code || '',
            is_hr: this.is_hr || '2',
            begin_date: this.beginDate,
            end_date: this.endDate,
          }
          formData = postNormalData(obj2)
          // console.log(formData)
          this.queryList(formData)
          // console.log(1)
        }
      })
    },
    // 切换条件
    toggleClick() {
      this.isShowMore = !this.isShowMore
      this.btnLoading = false
      this.$refs.queryList.loading = false
      if (!this.isShowMore) {
        // 如果是收起状态
        this.queryForm.setFieldsValue({
          hospital_code: '',
          checkDate: '',
        })
        this.beginDate = ''
        this.endDate = ''
      }
    },
    // 点击查看详情
    viewDetail(record,type) {
      this.setPoint('inspection_user_query_behavior','user_report_btn_click','',{study_primary_id:record.id})
       // 添加到tabPane标签页容器中, 添加之前比对有无重复添加标签页
       const text = record.name + ' ' + record.projName
      const obj = {
        // 组装数据
        id: record.rptId,
        text,
        status: record.hr_flag || '0',
        type,
        new_label:'0',
        key:`/detail/inspection/report?id=${record.rptId}&organCode=${record.organCode}&new_label=0&type=${type}&patient_name=${this.postData.patient_name}&patient_id_card=${this.postData.patient_id_card}`,
      }
      const tabPane = this.$store.getters.tabPane
      let bol = false
      tabPane.forEach((v, k) => {
        if (v.id === obj.id && v.type === obj.type) {
          if(v.report){
            this.$store.state.app.tabPane.splice(k,1)
          }else{
            bol = true
          }
        }
      })
      if (!bol) {
        // 如果都没有对应的key，则添加
        this.$store.dispatch('PushTabPane', obj) // 添加标签页
      }
      this.$router.push({
        path: '/detail/inspection/report',
        query: {
          id: record.rptId,
          organCode: record.organCode,
          new_label: '0',
          type: 'report',
          patient_name:this.postData.patient_name,
          patient_id_card:this.postData.patient_id_card,
        },
      })
    },
    // 查询接口
    async queryList(params) {
      const param = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }
      params.forEach((value, key) =>{
        if(key ==='patient_name'){
          param.patientName = value
        }else if(key ==='patient_id_card'){
          param.patientIdCard = value
        }else{
          param[key] = value
        }
      });
      ['hospital_code' , 'ckpt_name'].forEach(flag=>{
        const data=this[flag]
        if(data&&Array.isArray(data)){
          data.forEach(v=>{
            if(['ckpt_name'].includes(flag)) {
              if(!param.projNames) {
                param.projNames = []
                param.projNames.push(v)
              }else{
                param.projNames.push(v)
              }
            }else{
              if(!param.organCodes) {
                param.organCodes = []
                param.organCodes.push(v)
              }else{
                param.organCodes.push(v)
              }
            }
        })
        }
      })
      if (this.postData.patient_name && this.postData.patient_id_card) {
        this.searchBtnLoading = true
        this.btnLoading = true
        if (this.$refs.queryList) this.$refs.queryList.loading = true
        const obj = {
          sending_time: +new Date(),
          appver: '1.0.1',
          type: 'pacs_search',
            extension: {
            // doc_name: this.userInfo.user_name,
            doc_id: this.userInfo.uid,
            doc_hospital_id: getCookie('org_id'),
            patient_name: this.postData.patient_name
          }
        }
        const trackingParams = {}
        Object.assign(trackingParams,obj,{
          tm: +new Date(), // 记录触发事件
          action: 'search_start',
        })
        // 开始查询
        this.trackingEvent(trackingParams)
        const startTimeValue = new Date().getTime()
        const { data = [], code = '',meta={} } = await getAdminTestRpt(param)
        this.dataSource = (data && Array.isArray(data) && data) || []
        this.pagination.total = meta?.pagination?.total || 0
        this.pagination.pageNo = meta?.pagination?.current_page || 10
        let visit_data_time = ''
        const obj2 = {}
        if(this.isFirstEnter){
          visit_data_time = `${this.enterTime+new Date().getTime()-startTimeValue}`
          this.isFirstEnter=false
          obj2.visit_data_time = visit_data_time
        }
        obj2.is_authorize =this.is_authorize
        obj2.source = this.postData.source
        this.setPoint('inspection_patient_data_check','data_list_page_loading_success',new Date().getTime()-startTimeValue,obj2)
        if (this.$refs.queryList) this.$refs.queryList.loading = false
        this.btnLoading = false
        this.searchBtnLoading = false
        this.isDropdownChangeVisible = false
        this.tableTip = false
        if (code === 200) { // 埋点查询成功
          if(!data||(Array.isArray(data)&&data.length===0)){
            Object.assign(trackingParams, obj, {
            tm: +new Date(), // 时间戳
            action: 'inspection_search_succ_no_result',
          })
          this.trackingEvent(trackingParams)
          }else{
              Object.assign(trackingParams,obj,{
              tm: +new Date(), // 时间戳
              action: 'inspection_search_succ',
            })
            this.trackingEvent(trackingParams)
          }
        }
        // 超时查询
      } else {
        this.$message.warning({
          content: '患者姓名和证件号都不能为空',
          duration: 2,
        })
      }
    },
    // 改变tabPane[0]
    changeTabPane() {
      const tabPane = store.getters.tabPane
      const key = this.$route.fullPath
      const obj = {
        key,
        text: '查询列表',
      }
      if (key.includes('/home/index')) {
        tabPane.forEach((v, k) => {
          if (v.key.includes('/home/index')) {
            store.dispatch('ModifiedTabPane', obj)
          }
        })
      }
    },
    //当搜索栏变化时获取用户信息
    getUserInfo() {
        store.dispatch('GetInfo')
    },
    // 埋点
    setPoint(type,action,time='',obj={}){
        const sending_time = +new Date() // 记录埋点开始时间
        const tm=new Date().getTime() // 记录触发事件
        this.trackingEvent({
          sending_time,
            tm,
            appver: '1.0.1',
            type,
            action,
            extension: {
              doc_name: this.userInfo.user_name, 
              hospital_code: getCookie('org_id'),
              patient_name: this.postData.patient_name,
              cardno: this.postData.patient_id_card,
              app_dpt_name: this.urlParams.app_dpt_name,
              view_record_id: this.urlParams.view_record_id,
              data_request_duration: time?`${time}`:undefined,
              ...obj
            }
      })
    },
     async dealSearch(){
      this.pagination.current=1
      const formData = new FormData()
      this.postData.time_view_range = this.time_view_range
      if (this.urlParams.exam_item_code) this.postData.exam_item_code = this.urlParams.exam_item_code // 重复提醒
      // 将this.postData进行转化为普通的formData
      for (const key in this.postData) {
        const val = this.postData[key]
        formData.append(key, val)
      }
       // 请求接口 判断有没得权限
      const bool = await this.judgeChomn()
      if(bool){
        this.postFormData(formData)
      }
    },
    getWaibuUserInfoX(){
      const params=this.$route.query.params||getCookie('url_params')
      return new Promise(async(res)=>{
        if(params){
          const formData = new FormData()
          formData.append('encrypt_params', params)
          // 离线时这个接口必然失败、会 resolve 成 undefined，兜个空对象，别让解构直接抛错
          const {code,data}=(await getWaibuUserInfo(formData))||{}
          if(code===200){
            this.urlParams=data||{}
            setCookie('op_em_hp_ex_mark', data.op_em_hp_ex_mark || '')
            setCookie('url_params',params)
          }else{
            this.urlParams={}
            removeCookie('url_params', this.urlParams.source)
          }
        }else{
          this.urlParams={}
          removeCookie('url_params', this.urlParams.source)
        }
        // 无论解密成功与否都要放行：created() 在等这个 Promise，
        // 不 resolve 的话整个 created() 卡死在这，列表永远查不出来
        res()
      })
      }
    },
  async created() {
    await this.getWaibuUserInfoX()
    this.project_code= this.urlParams.study_project_code || ''
    this.postData.source=this.urlParams.source || '3' // 来源为空的时候
    if(this.urlParams && this.urlParams.source) {
      setCookie('app_dpt_name', this.urlParams.app_dpt_name)
      setCookie('view_record_id', this.urlParams.view_record_id)
      setCookie('source', this.urlParams.source)
    } else if(localStorage.getItem('url_params')){
      removeCookie('view_record_id', this.urlParams.view_record_id)
      removeCookie('source', this.urlParams.source)
      removeCookie('app_dpt_name', this.urlParams.app_dpt_name)
    }
    // this.getTimeRangeData() // 页面被刷新
    this.isChange = 'search'
    if (JSON.stringify(this.urlParams) !== '{}') {
      // 如果有url中携带了token
      if (this.urlParams.patient_name && this.urlParams.patient_id_card) {
        // 如果url有值
        this.postData.patient_name = trimStrAll(this.urlParams.patient_name)
        this.postData.patient_id_card = trimStrAll(this.urlParams.patient_id_card)
      }
    }
    if(this.hospital_data.patient_id_card && this.hospital_data.patient_name){
      this.postData.patient_name = trimStrAll(this.hospital_data.patient_name)
      this.postData.patient_id_card = trimStrAll(this.hospital_data.patient_id_card)
    }
    this.initSearch()
  },
  mounted() {
    // createFeedback()
    // 监听code改变...
    this.$bus.$on('codeChange', () => {
      this.getTimeRangeData()
      this.getUserInfo()
    })
  },
  destroyed() {
    clearTimeout(this.ckptTimer)
    this.$bus.$off('codeChange')
  },
  watch: {
    time_view_range(newVal){
      this.postData.time_view_range = newVal
    },
     ckpt_name(value){
      value&&this.dealSearch()
    },
     hospital_code(value){
      value&&this.dealSearch()
    },
    authorizeType(value){
      if(value===2){
        setTimeout(()=>{
          this.$refs.history.focus()
        },0)
      }else if(value===4){
        this.$nextTick(()=>{
          this.$refs.newPhone.focus()
        })
      }
    }
  },
  computed: {
    ...mapGetters(['timeViewRange', 'userInfo']),
    ...mapState({
      navigator: state => state.user.navigator,
      hospital_data: state => state.user.hospital_data,
    }),
    // 是否禁用搜索或者查询
    isBtnDisabled() {
      const bol = this.postData.patient_name.trim() && this.postData.patient_id_card.trim() ? false : true
      return bol
    }
  },
}
</script>

<style lang="less" scoped>
@import url('./style/index.less');
</style>