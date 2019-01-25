<template>
  <div class="editCtn">
    <div class="header">
      <div class="main">
         <img src="@/assets/image/pic_logo_small.png" @click="$router.push('/home')"/>
         <div class="selfCtn">
            <el-dropdown @command="userOprate">
              <div class="imgCtn">
                <img class="unhover" src="@/assets/image/head.png" />
                <img class="hover" src="@/assets/image/heads.png" />
              </div>
              <i style="vertical-align:middle;line-height:44px;color:#ABDAFF" class="el-icon-arrow-down"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item commond='logout'>注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
      </div>
    </div>
    <div class="content">
      <div class="titleCtn">
        <div class="leftCtn">
          <span class="h1">贴片清单</span>
          <div v-if="role" class="button" @click="showWindowFlag=true">
            <i class="icon">+</i>
            <span>新建贴片</span>
          </div>
        </div>
        <div class="rightCtn">
          <el-input type="text" placeholder="请输入贴片名称" v-model="search"/>
          <img class="searchBtn" src="@/assets/image/icon_search_black.png" />
        </div>
      </div>
      <div class="select">
        <div class="leftCtn">
          <span :class="types==='待添加'?'button active':'button'" @click="types='待添加'">待添加</span>
          <span :class="types==='已添加'?'button active':'button'" @click="types='已添加'">已添加</span>
          <span :class="types==='已删除'?'button active':'button'" @click="types='已删除'">已删除</span>
        </div>
      </div>
      <!-- 表格 -->
      <div class="tableCtn">
        <el-table
          ref="filterTable"
          :data="showWhichList.filter(data => !search || data.applicationtitle.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%">
          <el-table-column
            label="贴片名称"
            width="440">
            <template slot="header" slot-scope="scope">
              <span style="text-align:left" class="headTitle" :key="scope.name">贴片名称</span>
            </template>
            <template slot-scope="scope">
              <span class="title">{{scope.row.applicationtitle}}</span>
              <span class="info">{{scope.row.applicationdescribe}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="picturesize"
            label="全部大小"
            width="120"
            align="center"
            :filters="[{text: '大', value: 'sizel'},{text: '中', value: 'sizem'},{text: '小', value: 'sizes'}]"
            :filter-method="filterHandler"
            >
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.picturesize">全部大小</span>
            </template>
            <template slot-scope="scope">
              <span class="normal">{{scope.row.picturesize|sizeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="picturetype"
            label="全部类型"
            width="120"
            align="center"
            :filters="[{text: '图标', value: 'style-icon'},{text: '数字', value: 'style-num'},{text: '文本信息', value: 'style-text'},{text: '数字列表', value: 'style-list'}]"
            :filter-method="filterHandlerIcon">
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.picturetype">全部类型</span>
            </template>
            <template slot-scope="scope">
              <span class="normal">{{scope.row.picturetype|typeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="bgcolor"
            label="全部颜色"
            width="120"
            align="center"
            :filters="[{text: '蓝色', value: 'bg-blue'},{text: '绿色', value: 'bg-green'},{text: '红色', value: 'bg-red'},{text: '橙色', value: 'bg-orange'}]"
            :filter-method="filterHandler">>
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.applicationtitle">全部颜色</span>
            </template>
            <template slot-scope="scope">
              <div class="circle" :class="scope.row.bgcolor"></div>
              <span class="normal">{{scope.row.bgcolor|colorFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="是否启用"
            width="120"
            align="center"
            :filters="[{text: '启用', value: true},{text: '停用', value: false}]"
            :filter-method="filterHandler">>
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.applicationenable">是否启用</span>
            </template>
            <template slot-scope="scope">
              <span class="normal">{{scope.row.applicationenable|addFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="250"
            align="center">
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.name">操作</span>
            </template>
            <template slot-scope="scope">
              <!-- 操作分已添加，待添加，已删除状态 -->
              <!-- 编辑操作已添加和待添加状态，管理员可以使用 -->
              <span v-if="role&&types!=='已删除'" :name="scope.row.name" class="opration opration1" @click="editModel(scope.row)">编辑</span>
              <!-- 添加操作只有待添加状态有 -->
              <span v-if="types==='待添加'" :name="scope.row.name" class="opration" :class="{'opration2':role}">
                <el-dropdown trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link">
                    添加
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in modelArr" :key="item.id" :command="{model:item,id:scope.row.pictureid}">{{item.title}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
              <!-- 删除操作只有待添加状态有 -->
              <span v-if="types==='待添加'" :name="scope.row.name" class="opration opration3" @click="deleteModel(scope.row.pictureid)">删除</span>
              <!-- 取消添加只有已添加状态有 -->
              <span v-if="types==='已添加'"  :name="scope.row.applicationtitle" class="opration" :class="{'opration4':role}" @click="cancelModel(scope.row.pictureid,0)">取消添加</span>
              <!-- 取消删除和彻底删除只有已删除状态有 -->
              <span v-if="types==='已删除'" :name="scope.row.applicationtitle" class="opration opration5" @click="cancelModel(scope.row.pictureid,1)">取消删除</span>
              <span v-if="role&&types==='已删除'" :name="scope.row.applicationtitle" class="opration opration6" @click="removeModel(scope.row.pictureid)">彻底删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <div class="line1">
        <!-- <span>帮助</span>
        <span>隐私</span>
        <span>条款</span> -->
      </div>
      <div class="line2">copyright©2018 银江股份</div>
    </div>
    <div class="window" v-show="showWindowFlag">
      <div class="main">
        <div class="head">
          <span>{{stepTitle}}</span>
          <span @click="initWindow()">X</span>
        </div>
        <div class="contentCtn">
          <div class="wContent" :class="{'wContentL':step>1,'wContentM':step===1,'wContentR':step<1}">
            <div class="line line1">
              <div class="info">
                <em>*</em>
                <span>类型：</span>
              </div>
              <div class="selcet" :class="{'active':newPatch.picturetype === 'style-icon'}">
                <i class="circle" @click="newPatch.picturetype='style-icon'"></i>
                <span @click="newPatch.picturetype='style-icon'">图标</span>
              </div>
              <div class="selcet" :class="{'active':newPatch.picturetype === 'style-num'}">
                <i class="circle" @click="newPatch.picturetype='style-num'"></i>
                <span @click="newPatch.picturetype='style-num'">数字</span>
              </div>
              <div class="selcet" :class="{'active':newPatch.picturetype === 'style-list'}">
                <i class="circle" @click="newPatch.picturetype='style-list'"></i>
                <span @click="newPatch.picturetype='style-list'">数字列表</span>
              </div>
              <div class="selcet" :class="{'active':newPatch.picturetype === 'style-text'}">
                <i class="circle" @click="newPatch.picturetype='style-text'"></i>
                <span @click="newPatch.picturetype='style-text'">文字列表</span>
              </div>
            </div>
            <div class="line line2">
              <div class="info">
                <em>*</em>
                <span>大小：</span>
              </div>
              <div class="imgCtn">
                <div class="boxCtn" :class="{'active':newPatch.picturesize === 'sizes'}" v-if="newPatch.picturetype==='style-icon'||newPatch.picturetype==='style-num'">
                  <img src="@/assets/image/pic_icon_small.png"/>
                  <span @click="newPatch.picturesize='sizes'">小</span>
                  <i class="circle" @click="newPatch.picturesize='sizes'"></i>
                </div>
                <div class="boxCtn" :class="{'active':newPatch.picturesize === 'sizem'}">
                  <img src="@/assets/image/pic_icon_middle.png"/>
                  <span @click="newPatch.picturesize='sizem'">中</span>
                  <i class="circle" @click="newPatch.picturesize='sizem'"></i>
                </div>
                <div class="boxCtn" :class="{'active':newPatch.picturesize === 'sizel'}">
                  <img src="@/assets/image/pic_icon_big.png"/>
                  <span @click="newPatch.picturesize='sizel'">大</span>
                  <i class="circle" @click="newPatch.picturesize='sizel'"></i>
                </div>
              </div>
            </div>
            <div class="line line3">
              <div class="info">
                <em>*</em>
                <span>颜色：</span>
              </div>
              <div class="colorbox">
                <div class="box" :class="{'active':newPatch.bgcolor === 'bg-blue'}" @click="newPatch.bgcolor='bg-blue'">
                  <div class="background"></div>
                </div>
              </div>
              <div class="colorbox">
                <div class="box" :class="{'active':newPatch.bgcolor === 'bg-orange'}" @click="newPatch.bgcolor='bg-orange'">
                  <div class="background"></div>
                </div>
              </div>
              <div class="colorbox">
                <div class="box" :class="{'active':newPatch.bgcolor === 'bg-green'}" @click="newPatch.bgcolor='bg-green'">
                  <div class="background"></div>
                </div>
              </div>
              <div class="colorbox">
                <div class="box" :class="{'active':newPatch.bgcolor === 'bg-red'}" @click="newPatch.bgcolor='bg-red'">
                  <div class="background"></div>
                </div>
              </div>
            </div>
          </div>
          <el-form :model="newPatch" ref="newPatch" label-width="100px"  class="wContent form" :class="{'wContentL':step>2,'wContentM':step===2,'wContentR':step<2}">
            <el-form-item label="系统名称：" prop="applicationtitle" :rules="[{ required: true, message: '系统名称不能为空'}, { validator: checkTitle, trigger: 'blur' }]">
              <el-input placeholder="请输入系统名称(必填项)" v-model="newPatch.applicationtitle"></el-input>
            </el-form-item>
            <el-form-item label="系统地址：" prop="applicationurl" :rules="[{ required: true, message: '系统地址不能为空'}, { type: 'url', message: '系统地址格式不正确', trigger: ['blur', 'change'] }]">
              <el-input placeholder="请输入系统地址(必填项)" v-model="newPatch.applicationurl">
              <el-button slot="append" @click="openUrl(newPatch.applicationurl)">测试</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="系统简介：">
              <el-input placeholder="请输入对于系统的介绍说明" v-model="newPatch.applicationdescribe"></el-input>
            </el-form-item>
            <el-form-item label="是否启用：">
               <el-switch v-model="newPatch.enable" active-color="#0078D7" inactive-color="#EEEEEE"></el-switch>
            </el-form-item>
            <el-form-item label="API地址：" prop="apiurl" :rules="[{ required: true, message: 'API地址不能为空'}, { type: 'url', message: 'API地址格式不正确', trigger: ['blur', 'change'] }]" v-if="newPatch.picturetype!=='style-icon'">
              <el-input placeholder="填写内容接口(必填项)" v-model="newPatch.apiurl">
              <el-button slot="append" @click="openUrl(newPatch.apiurl)">测试</el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <el-form :model="newPatch" ref="newPatch" label-width="100px"  class="wContent form" :class="{'wContentL':step>3,'wContentM':step===3,'wContentR':step<3}" v-if="newPatch.picturetype==='style-num'">
            <div class="explanation">
               <div class="explanation-title">填写说明：</div>
               <div class="explanation-content bg-num" v-if="newPatch.showExplanation"></div>
               <div class="explanation-fold" @click="newPatch.showExplanation=!newPatch.showExplanation">{{newPatch.showExplanation?'收起 ∧':'展开 ∨'}}</div>
            </div>
            <el-form-item label="内容标题：" prop="contentdata[0].title" :rules="[{ required: true, message: '内容标题不能为空'}]">
              <el-input placeholder="填写字段名称" v-model="newPatch.contentdata[0].title" ></el-input>
            </el-form-item>
            <el-form-item label="内容字段：" prop="contentdata[0].filedkey" :rules="[{ required: true, message: '内容字段不能为空'}]">
              <el-select v-model="newPatch.contentdata[0].filedkey" placeholder="请选择">
                <el-option v-for="(item,index) in apiContent" :key="index" :label="item.keyname" :value="item.keyname"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form :model="newPatch" ref="newPatch" label-width="100px"  class="wContent form" :class="{'wContentL':step>3,'wContentM':step===3,'wContentR':step<3}" v-if="newPatch.picturetype==='style-text'">
            <div class="explanation">
               <div class="explanation-title">填写说明：</div>
               <div class="explanation-content bg-text" v-if="newPatch.showExplanation"></div>
               <div class="explanation-fold" @click="newPatch.showExplanation=!newPatch.showExplanation">{{newPatch.showExplanation?'收起':'展开'}}</div>
            </div>
            <el-form-item label="时间类型：">
              <el-input v-model="newPatch.contentdata[0].title" disabled></el-input>
            </el-form-item>
            <el-form-item label="内容类型：">
                <el-input v-model="newPatch.contentdata[0].filedkey" disabled/>
            </el-form-item>
          </el-form>
          <el-form :model="newPatch" ref="newPatch" label-width="100px" :inline="true" class="wContent form" :class="{'wContentL':step>3,'wContentM':step===3,'wContentR':step<3}" v-if="newPatch.picturetype==='style-list'">
            <div class="explanation">
               <div class="explanation-title">填写说明：</div>
               <div class="explanation-content bg-list" v-if="newPatch.showExplanation"></div>
               <div class="explanation-fold" @click="newPatch.showExplanation=!newPatch.showExplanation">{{newPatch.showExplanation?'收起':'展开'}}</div>
            </div>
            <div style="width:100%;" v-for="(item,index) in newPatch.contentdata" :key="`title${index}`">
            <el-form-item label="内容标题：" :prop="`contentdata[${index}].title`" :rules="[{ required: true, message: '内容标题不能为空'}]">
              <el-input placeholder="填写字段名称" v-model="item.title"></el-input>
            </el-form-item>
            <el-form-item label="内容字段：" :prop="`contentdata[${index}].filedkey`" :rules="[{ required: true, message: '内容字段不能为空'}]">
              <el-select v-model="item.filedkey" placeholder="请选择字段">
                <el-option v-for="(item2,index2) in apiContent" :key="`option${index2}`" :label="item2.keyname" :value="item2.keyname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <i class="icon icon-add" @click="addContent(index)" v-if="newPatch.contentdata.length<=5"></i>
              <i class="icon icon-remove" @click="removeContent(index)" v-if="!(index===0&&newPatch.contentdata.length===1)"></i>
              <i class="icon icon-up" @click="upContent(index)" v-if="index!==0"></i>
              <i class="icon icon-down" @click="downContent(index)" v-if="index!==newPatch.contentdata.length-1"></i>
            </el-form-item>
            </div>
          </el-form>
          <div class="wContent" :class="{'wContentL':step>3,'wContentM':step===3,'wContentR':step<3}" v-if="newPatch.picturetype==='style-icon'">
            <div class="iconCtn">
              <div class="btnCtn">
                <span class="btn" :class="{'active':showWhich==='图标库'}" @click="showWhich='图标库'">图标库
                  <div class="whiteline"></div>
                </span>
                <span class="btn" :class="{'active':showWhich==='自定义图标'}" @click="showWhich='自定义图标'">自定义图标
                  <div class="whiteline"></div>
                </span>
              </div>
              <div class="storeCtn" v-show="showWhich==='图标库'">
                <div class="storeLeft">
                  <div class="imgCtn" :class="{'active':newPatch.photo===item.content}" v-for="item in iconList" :key="item.id" @click="newPatch.photo=item.content">
                    <img :src="imgFilter(item.content)" />
                  </div>
                </div>
                <div class="storeRight">
                  <span>图标预览：</span>
                  <div class="imgCtn active">
                    <img :src="imgFilter(newPatch.photo)" />
                  </div>
                </div>
              </div>
              <div class="selfCtn" v-show="showWhich==='自定义图标'">
                <div class="selfLeft">
                  <span class="label">上传自定义图标：</span>
                  <div class="upCtn">
                    <el-upload
                      class="upload-demo"
                      action=""
                      :accept="'image/jpeg,image/png'"
                      :auto-upload="false"
                      :show-file-list="false"
                      :on-change="fileChange"
                      :file-list="fileList"
                      >
                      <el-button size="small" type="primary" icon="el-icon-picture">选择图片</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2Mb</div>
                      <div slot="tip" class="el-upload__tip">最佳尺寸：150像素*150像素</div>
                    </el-upload>
                  </div>
                </div>
                <div class="selfRight">
                  <span>图标预览：</span>
                  <div class="imgCtn">
                    <img :src="imgFilter(newPatch.selfPhoto)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-form :model="newPatch" ref="newPatch" label-width="100px"  class="wContent form" :class="{'wContentL':step>4,'wContentM':step===4,'wContentR':step<4}">
            <el-form-item label="可见角色：" prop="roles" :rules="[{ required: true, message: '可见角色不能为空'}]">
              <el-select v-model="newPatch.roles" multiple placeholder="请选择">
                <el-option v-for="item in roleList" :key="item.roleid" :label="item.rolename" :value="item.roleid"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="opration">
          <div class="button button1" @click="next">{{step===4?editFlag?'确认':'完成':'下一步'}}</div>
          <div class="button button2" @click="initWindow()">取消</div>
          <div class="button button3" v-show="editFlag?step!==2:step!==1" @click="step--">上一步</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { patchList, deletePatch, cancelPatch, addPatch, removePatch, roleAndIcon, createPatch, editPatch, logout, userRole, validationTitle, validationApiInfo } from '@/api/api.js'
import { Message } from 'element-ui'
import defPhoto from '@/assets/image/defPhoto.js'
export default {
  data () {
    return {
      types: '待添加', // 展示哪个table
      showWhich: '图标库', // 编辑/新建状态下选择显示自定义/图标库
      step: 1, // 添加贴片的步骤
      fileList: [],
      showWindowFlag: false, // 是否展示新增/编辑弹窗
      editFlag: false, // 是否为编辑贴片状态
      modelArr: [], // 六个模块
      toAddList: [], // 待添加
      addedList: [], // 已添加
      deletedList: [], // 已删除
      iconList: [], // 图标库
      roleList: [], // 角色库
      role: false,
      realUrl: true, // 判断输入的网址是否为真
      realTitle: true, // 判断输入标题是否正确
      realApi: true, // 判断输入Api地址是否正确
      search: '', // 搜索
      newPatch: {
        photo: '', // 保存base64
        picturetype: 'style-icon', // 类型
        picturesize: 'sizes', // 大小
        bgcolor: 'bg-blue', // 背景默认蓝色
        enable: true,
        applicationtitle: '',
        applicationurl: '',
        applicationdescribe: '',
        roles: [],
        selfPhoto: defPhoto,
        pictureid: '',
        apiurl: '',
        showExplanation: true,
        refreshflag: 1,
        contentdata: [
          { title: '', filedkey: '', filedsort: 1 }
        ]
      }, // 新增贴片信息
      apiContent: ''
    }
  },
  watch: {
    // 磁贴类型变化时，修改磁贴的默认大小
    'newPatch.picturetype': function (newvalue, oldvalue) {
      if (newvalue === 'style-list' || newvalue === 'style-text') {
        this.newPatch.picturesize = 'sizem'
      }
      if (newvalue === 'style-icon' || newvalue === 'style-num') {
        this.newPatch.picturesize = 'sizes'
      }
    }
  },
  filters: {
    sizeFilter (val) {
      let map = {
        'sizes': '小',
        'sizem': '中',
        'sizel': '大'
      }
      return map[val]
    },
    typeFilter (val) {
      let map = {
        'style-num': '数字',
        'style-text': '文本',
        'style-icon': '图标',
        'style-list': '数字列表'
      }
      return map[val]
    },
    colorFilter (val) {
      let map = {
        'bg-blue': '蓝色',
        'bg-green': '绿色',
        'bg-red': '红色',
        'bg-orange': '橙色'
      }
      return map[val]
    },
    addFilter (val) {
      let map = {
        1: '是',
        0: '否'
      }
      return map[val]
    }
  },
  computed: {
    stepTitle () {
      let map = ['新建贴片--样式选择', '新建贴片--基本信息', '新建贴片--展示信息', '新建贴片--基本信息']
      let map2 = ['编辑贴片--基本信息', '编辑贴片--展示信息', '编辑贴片--基本信息']
      let str = ''
      // 判断是否编辑贴片，展示的提示信息不同
      if (this.editFlag) {
        str = map2[this.step - 2]
      } else {
        str = map[this.step - 1]
      }
      return str
    },
    showWhichList () {
      let list = []
      if (this.types === '待添加') {
        list = this.toAddList
      } else if (this.types === '已添加') {
        list = this.addedList
      } else if (this.types === '已删除') {
        list = this.deletedList
      }
      return list
    }
  },
  methods: {
    // 筛选列表
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    // 筛选图标需要特殊处理
    filterHandlerIcon (value, row, column) {
      const property = column['property']
      return row[property].split('-')[1] === value
    },
    // base64解码
    base64ToBlob (urlData, type) {
      let arr = urlData.split(',')
      let mime = arr[0].match(/:(.*?);/)[1] || type
      // 去掉url的头，并转化为byte
      let bytes = window.atob(arr[1])
      // 处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length)
      // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
      let ia = new Uint8Array(ab)
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], {
        type: mime
      })
    },
    // 显示图片filter
    imgFilter (val) {
      return 'data:image/png;base64,' + val
    },
    // 文件上传
    fileChange (file, fileList) {
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      if (isJPG && isLt2M) {
        let _this = this
        let reader = new FileReader()
        reader.onload = () => {
          let _base64 = reader.result
          _this.newPatch.selfPhoto = _base64.split(',')[1]
        }
        reader.readAsDataURL(file.raw)
      }
    },
    // 数据初始化
    async initData () {
      let res = await patchList()
      let data = res.data.data
      this.modelArr = data.groupList
      this.addedList = data.addedList
      this.deletedList = data.deletedList
      this.toAddList = data.toAddList
    },
    // 添加贴片操作
    handleCommand (command) {
      this.addModel(command.id, command.model.id, command.model.title)
    },
    // 删除贴片
    async deleteModel (id) {
      let res = await deletePatch({
        pictureid: id
      })
      this.callback(res)
    },
    // 彻底删除
    async removeModel (id) {
      let res = await removePatch({
        pictureid: id
      })
      this.callback(res)
    },
    // 取消删除/添加
    async cancelModel (id, status) {
      let res = await cancelPatch({
        pictureid: id,
        status: status
      })
      this.callback(res)
    },
    // 添加贴片接口
    async addModel (id, modelid, modeltitle) {
      let res = await addPatch({
        pictureid: id,
        modelid: modelid,
        modeltitle: modeltitle
      })
      this.callback(res)
    },
    // 新增/添加/取消添加/删除/彻底删除 回调函数(通知、刷新数据)
    callback (res) {
      Message({
        type: res.data.code === 1 ? 'success' : 'error',
        message: res.data.message,
        duration: 2000
      })
      this.initData()
    },
    // 添加列表字段
    addContent (index) {
      this.newPatch.contentdata.splice(index + 1, 0, { title: '', filedkey: '', filedsort: index + 2 })
    },
    // 删除列表字段
    removeContent (index) {
      this.newPatch.contentdata.splice(index, 1)
    },
    // 上移列表字段
    upContent (index) {
      let temp = this.newPatch.contentdata[index]
      this.$set(this.newPatch.contentdata, index, this.newPatch.contentdata[index - 1])
      this.$set(this.newPatch.contentdata, index - 1, temp)
    },
    // 下移列表字段
    downContent (index) {
      let temp = this.newPatch.contentdata[index]
      this.$set(this.newPatch.contentdata, index, this.newPatch.contentdata[index + 1])
      this.$set(this.newPatch.contentdata, index + 1, temp)
    },
    // 点击下一步/完成
    async next () {
      let newPatch = this.newPatch
      // 第一步
      if (this.step === 1) {
        this.step++
        return ''
      }
      // 第二步验证必填项是否为空
      if (this.step === 2) {
        if (newPatch.applicationtitle === '' || this.realTitle === false) {
          this.realTitle = false
          return ''
        }
        if (newPatch.applicationurl === '' || this.realUrl === false) {
          this.realUrl = false
          return ''
        }
        if (newPatch.picturetype !== 'style-icon') {
          if (newPatch.apiurl === '' || this.realApi === false) {
            this.realApi = false
            return ''
          }
          let res = await validationApiInfo({ apiurl: newPatch.apiurl })
          if (res.data.code === 1) {
            if (newPatch.picturetype === 'style-num' || newPatch.picturetype === 'style-list') {
              this.apiContent = res.data.data
            }
            if (newPatch.picturetype === 'style-text') {
              newPatch.contentdata[0].title = 'time'
              newPatch.contentdata[0].filedkey = 'content'
            }
          } else {
            Message({
              type: 'error',
              message: res.data.message,
              duration: 2000
            })
            return ''
          }
        }
        this.step++
        return ''
      }
      // 第三步
      if (this.step === 3) {
        this.step++
        return ''
      }
      // 第四步
      if (this.step === 4) {
        // 提交之前先验证必填项是否为空
        if (newPatch.roles.length === 0) {
          Message({
            type: 'error',
            message: '请选择可见角色',
            duration: 2000
          })
          return ''
        }
        // 先处理部分数据
        newPatch.enable = newPatch.enable === true ? 1 : 0
        // 判定最后选了哪个图
        let img = this.showWhich === '图标库' ? newPatch.photo : newPatch.selfPhoto === defPhoto ? newPatch.photo : newPatch.selfPhoto
        let editParams = {
          photo: img,
          picturetype: newPatch.picturetype,
          pictureid: newPatch.pictureid,
          enable: newPatch.enable,
          applicationtitle: newPatch.applicationtitle,
          applicationurl: newPatch.applicationurl,
          applicationdescribe: newPatch.applicationdescribe,
          roles: newPatch.roles,
          refreshflag: 1,
          apiurl: newPatch.apiurl,
          contentdata: newPatch.contentdata
        }
        let createParams = {
          photo: img,
          picturetype: newPatch.picturetype,
          picturesize: newPatch.picturesize,
          bgcolor: newPatch.bgcolor,
          enable: newPatch.enable,
          applicationtitle: newPatch.applicationtitle,
          applicationurl: newPatch.applicationurl,
          applicationdescribe: newPatch.applicationdescribe,
          roles: newPatch.roles,
          refreshflag: 1,
          apiurl: newPatch.apiurl,
          contentdata: newPatch.contentdata
        }
        let res = this.editFlag ? await editPatch(editParams) : await createPatch(createParams)
        Message({
          type: res.data.code === 1 ? 'success' : 'error',
          message: res.data.message,
          duration: 2000
        })
        this.initData()
        this.initWindow()
      }
    },
    // 点击取消或者右上角的关闭按钮需要初始化窗口信息
    initWindow () {
      // 初始化一下窗口页面并关闭
      this.newPatch = {
        photo: this.iconList[0].content,
        picturetype: 'style-icon', // 类型
        picturesize: 'sizes', // 大小
        bgcolor: 'bg-blue',
        enable: true,
        applicationtitle: '',
        applicationurl: '',
        applicationdescribe: '',
        roles: [],
        selfPhoto: defPhoto,
        pictureid: '',
        apiurl: '',
        showExplanation: true,
        refreshflag: 1,
        contentdata: [
          { title: '', filedkey: '', filedsort: 1 }
        ]
      }
      this.showWhich = '图标库'
      this.showWindowFlag = false
      this.editFlag = false
      this.step = 1
      this.realUrl = true
      this.realTitle = true
      this.realApi = true
      this.apiContent = []
    },
    // 编辑贴片
    editModel (info) {
      if (info.picturetype === 'style-icon') {
        let flag = false
        this.iconList.map((item) => {
          if (item.content === info.picturecontent) {
            flag = true
          }
        })
        if (flag) {
          this.newPatch.photo = info.picturecontent
          this.showWhich = '图标库'
        } else {
          this.newPatch.selfPhoto = info.picturecontent
          this.showWhich = '自定义图标'
        }
      }
      if (info.picturetype === 'style-list' || info.picturetype === 'style-num') {
        this.newPatch.apiurl = info.picturecontent.apiurl
        this.newPatch.contentdata = info.picturecontent.contentdata
      }
      if (info.picturetype === 'style-text') {
        this.newPatch.apiurl = info.picturecontent.apiurl
      }
      this.newPatch.picturetype = info.picturetype
      this.newPatch.pictureid = info.pictureid
      this.newPatch.enable = info.applicationenable === 1
      this.newPatch.applicationtitle = info.applicationtitle
      this.newPatch.applicationurl = info.applicationurl
      this.newPatch.applicationdescribe = info.applicationdescribe
      this.newPatch.roles = info.roles.map((item) => {
        return item.roleid
      })
      this.step = 2
      this.editFlag = true
      this.showWindowFlag = true
    },
    // 用户操作
    async userOprate () {
      let res = await logout()
      if (res.data.code === 1) {
        Message({
          type: 'success',
          message: '注销成功',
          duration: 2000
        })
        this.$router.push('/login')
      }
    },
    // 打开链接
    openUrl (url) {
      window.open(url)
    },
    // 检查标题是否重名
    async checkTitle (rule, value, callback) {
      let res = await validationTitle({
        pictureid: this.newPatch.pictureid,
        title: this.newPatch.applicationtitle,
        flag: this.editFlag ? 1 : 0
      })
      this.realTitle = res.data.code === 1
      res.data.code === 1 ? callback() : callback(new Error('系统名称不能重名'))
    }
  },
  async mounted () {
    // 初始化列表
    this.initData()
    // 初始化图标库
    let roleAndIconRes = await roleAndIcon()
    this.iconList = roleAndIconRes.data.data.icon
    // 初始化默认图
    this.newPatch.photo = this.iconList[0].content
    // 初始化权限角色列表
    this.roleList = roleAndIconRes.data.data.role
    // 初始化用户角色
    let userRoleRes = await userRole()
    this.role = userRoleRes.data.data.role
  }
}
</script>

<style>
.editCtn .el-table th, .el-table tr{
  background: transparent;
}
.editCtn .el-table__footer-wrapper, .el-table__header-wrapper{
  box-sizing: border-box;
  background: #FAFAFA;
  border:1px solid #E8E8E8;
  border-bottom: 0;
}
.editCtn .el-table__column-filter-trigger i{
  font-size: 16px;
  font-weight: bold;
  margin-left: 6px;
}
 /* table:before有一条线层级较高，影响弹框显示，暂时不知道这条线的用途 */
.editCtn .el-table::before{
  height: 0;
}
.editCtn .el-select{
  width: 80%;
}

.opration span{
  font-size: 16px!important;
}
.opration .el-dropdown{
  color: #63BAFF;
}

el-upload-list el-upload-list--text{
  display: none;
}
</style>
<style lang="less" scoped>
  @import '~@/assets/css/edit.less';
</style>
