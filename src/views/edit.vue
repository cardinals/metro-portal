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
          <div v-if="role" class="button" @click="createFlag=true">
            <i class="icon">+</i>
            <span>新建贴片</span>
          </div>
        </div>
        <div class="rightCtn">
          <input type="text" placeholder="请输入贴片名称" v-model="search"/>
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
      <div class="tableCtn">
        <!-- 待添加 -->
        <el-table
          v-show="types==='待添加'"
          ref="filterTable"
          :data="toAddList.filter(data => !search || data.applicationtitle.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%">
          <el-table-column
            label="切片名称"
            width="440">
            <template slot="header" slot-scope="scope">
              <span style="text-align:left" class="headTitle" :key="scope.name">切片名称</span>
            </template>
            <template slot-scope="scope">
              <span class="title">{{scope.row.applicationtitle}}</span>
              <span class="info">{{scope.row.applicationdescribe}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="drag"
            label="全部大小"
            width="120"
            align="center"
            :filters="[{text: '大', value: 'drag3'},{text: '中', value: 'drag2'},{text: '小', value: 'drag1'}]"
            :filter-method="filterHandler"
            >
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.applicationtitle">全部大小</span>
            </template>
            <template slot-scope="scope">
              <span class="normal">{{scope.row.drag|sizeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="picturetype"
            label="全部类型"
            width="120"
            align="center"
            :filters="[{text: '图标', value: 'icon'},{text: '数字', value: 'num'},{text: '文本信息', value: 'text'},{text: '数字列表', value: 'list'}]"
            :filter-method="filterHandlerIcon">
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.applicationtitle">全部类型</span>
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
            width="90"
            align="center">
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.applicationtitle">是否启用</span>
            </template>
            <template slot-scope="scope">
              <span class="normal">{{scope.row.applicationenable|addFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="280"
            align="center">
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.name">操作</span>
            </template>
            <template slot-scope="scope">
              <span v-if="role" :name="scope.row.name" class="opration opration1" @click="editModel(scope.row)">编辑</span>
              <span :name="scope.row.name" class="opration" :class="{'opration2':role}">
                <el-dropdown trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link">
                    添加
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in modelArr" :key="item.id" :command="{model:item,id:scope.row.pictureid}">{{item.title}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
              <span :name="scope.row.name" class="opration opration3" @click="deleteModel(scope.row.pictureid)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已添加 -->
        <el-table
          v-show="types==='已添加'"
          ref="filterTable"
          :data="addedList.filter(data => !search || data.applicationtitle.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%">
          <el-table-column
            label="切片名称"
            width="440">
            <template slot="header" slot-scope="scope">
              <span style="text-align:left" class="headTitle" :key="scope.name">切片名称</span>
            </template>
            <template slot-scope="scope">
              <span class="title">{{scope.row.applicationtitle}}</span>
              <span class="info">{{scope.row.applicationdescribe}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="drag"
            label="全部大小"
            width="120"
            align="center"
            :filters="[{text: '大', value: 'drag3'},{text: '中', value: 'drag2'},{text: '小', value: 'drag1'}]"
            :filter-method="filterHandler"
            >
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.applicationtitle">全部大小</span>
            </template>
            <template slot-scope="scope">
              <span class="normal">{{scope.row.drag|sizeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="picturetype"
            label="全部类型"
            width="120"
            align="center"
            :filters="[{text: '图标', value: 'icon'},{text: '数字', value: 'num'},{text: '文本信息', value: 'text'},{text: '数字列表', value: 'list'}]"
            :filter-method="filterHandlerIcon">
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.applicationtitle">全部类型</span>
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
            width="90"
            align="center">
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.applicationtitle">是否启用</span>
            </template>
            <template slot-scope="scope">
              <span class="normal">{{scope.row.applicationenable|addFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="size"
            label="操作"
            width="280"
            align="center">
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.name">操作</span>
            </template>
            <template slot-scope="scope">
              <span v-if="role" :name="scope.row.applicationtitle" class="opration opration1" @click="editModel(scope.row)">编辑</span>
              <span :name="scope.row.applicationtitle" class="opration" :class="{'opration4':role}" @click="cancelModel(scope.row.pictureid,0)">取消添加</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已删除 -->
        <el-table
          v-show="types==='已删除'"
          ref="filterTable"
          :data="deletedList.filter(data => !search || data.applicationtitle.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%">
          <el-table-column
            label="切片名称"
            width="440">
            <template slot="header" slot-scope="scope">
              <span style="text-align:left" class="headTitle" :key="scope.name">切片名称</span>
            </template>
            <template slot-scope="scope">
              <span class="title">{{scope.row.applicationtitle}}</span>
              <span class="info">{{scope.row.applicationdescribe}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="drag"
            label="全部大小"
            width="150"
            align="center"
            :filters="[{text: '大', value: 'drag3'},{text: '中', value: 'drag2'},{text: '小', value: 'drag1'}]"
            :filter-method="filterHandler"
            >
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.applicationtitle">全部大小</span>
            </template>
            <template slot-scope="scope">
              <span class="normal">{{scope.row.drag|sizeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="picturetype"
            label="全部类型"
            width="150"
            align="center"
            :filters="[{text: '图标', value: 'icon'},{text: '数字', value: 'num'},{text: '文本信息', value: 'text'},{text: '数字列表', value: 'list'}]"
            :filter-method="filterHandlerIcon">
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.applicationtitle">全部类型</span>
            </template>
            <template slot-scope="scope">
              <span class="normal">{{scope.row.picturetype|typeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="bgcolor"
            label="全部颜色"
            width="150"
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
            prop="size"
            label="操作"
            width="280"
            align="center">
            <template slot="header" slot-scope="scope">
              <span class="headTitle" :key="scope.name">操作</span>
            </template>
            <template slot-scope="scope">
              <span :name="scope.row.applicationtitle" class="opration opration5" @click="cancelModel(scope.row.pictureid,1)">取消删除</span>
              <span v-if="role" :name="scope.row.applicationtitle" class="opration opration6" @click="removeModel(scope.row.pictureid)">彻底删除</span>
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
    <div class="window" v-show="createFlag">
      <div class="main">
        <div class="head">
          <span>{{stepTitle}}</span>
          <span @click="initWindow">X</span>
        </div>
        <div class="contentCtn">
          <div class="wContent" :class="{'wContentL':step>1,'wContentM':step===1,'wContentR':step<1}">
            <div class="line line1">
              <div class="info">
                <em>*</em>
                <span>类型：</span>
              </div>
              <div class="selcet" :class="{'active':newPatch.picturetype === 'icon'}">
                <i class="circle"></i>
                <span @click="newPatch.picturetype='icon'">图标</span>
              </div>
              <!-- 数字 数字列表 文字列表 类型暂未启用 -->
              <div class="selcet" :class="{'active':newPatch.picturetype === 'num'}">
                <i class="circle"></i>
                <span @click="showTips">数字</span>
              </div>
              <div class="selcet" :class="{'active':newPatch.picturetype === 'list'}">
                <i class="circle"></i>
                <span @click="showTips">数字列表</span>
              </div>
              <div class="selcet" :class="{'active':newPatch.picturetype === 'text'}">
                <i class="circle"></i>
                <span @click="showTips">文字列表</span>
              </div>
            </div>
            <div class="line line2">
              <div class="info">
                <em>*</em>
                <span>大小：</span>
              </div>
              <div class="imgCtn">
                <div class="boxCtn" :class="{'active':newPatch.drag === 'drag1'}">
                  <img src="@/assets/image/pic_icon_small.png"/>
                  <span @click="newPatch.drag='drag1'">小</span>
                  <i class="circle" @click="newPatch.drag='drag1'"></i>
                </div>
                <div class="boxCtn" :class="{'active':newPatch.drag === 'drag2'}">
                  <img src="@/assets/image/pic_icon_middle.png"/>
                  <span @click="newPatch.drag='drag2'">中</span>
                  <i class="circle" @click="newPatch.drag='drag2'"></i>
                </div>
                <div class="boxCtn" :class="{'active':newPatch.drag === 'drag3'}">
                  <img src="@/assets/image/pic_icon_big.png"/>
                  <span @click="newPatch.drag='drag3'">大</span>
                  <i class="circle" @click="newPatch.drag='drag3'"></i>
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
          <div class="wContent" :class="{'wContentL':step>2,'wContentM':step===2,'wContentR':step<2}">
            <div class="line line4">
              <div class="info">
                <em>*</em>
                <span>系统名称：</span>
              </div>
              <div class="inputCtn" :class="{'errorTitle':!realTitle}">
                <input placeholder="请输入系统名称(必填项)" type="text" v-model="newPatch.applicationtitle" @blur="testTitle"/>
              </div>
            </div>
            <div class="line line4">
              <div class="info">
                <em>*</em>
                <span>系统地址：</span>
              </div>
              <div class="inputCtn address" :class="{'errorUrl':!realUrl}">
                <input placeholder="请输入系统地址(必填项)" type="text" v-model="newPatch.applicationurl" @blur="testUrl"/>
                <div class="btn" @click="openUrl">测试</div>
              </div>
            </div>
            <div class="line line4">
              <div class="info">
                <em style="visibility:hidden;">*</em>
                <span>系统简介：</span>
              </div>
              <div class="inputCtn">
                <input placeholder="请输入对于系统的介绍说明" type="text" v-model="newPatch.applicationdescribe"/>
              </div>
            </div>
            <div class="line line4">
              <div class="info">
                <em style="visibility:hidden;">*</em>
                <span>是否启用：</span>
              </div>
              <div class="inputCtn" style="line-height:38px">
                <el-switch
                  v-model="newPatch.enable"
                  active-color="#0078D7"
                  inactive-color="#EEEEEE">
                </el-switch>
              </div>
            </div>
          </div>
          <div class="wContent" :class="{'wContentL':step>3,'wContentM':step===3,'wContentR':step<3}">
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
                      accept="image/jpeg,image/png"
                      :auto-upload="false"
                      :show-file-list="true"
                      :on-change="fileChange"
                      :file-list="fileList"
                      >
                      <el-button size="small" type="primary" icon="el-icon-picture">选择图片</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过100kb</div>
                      <div slot="tip" class="el-upload__tip">最佳尺寸：150像素*150像素</div>
                    </el-upload>
                  </div>
                </div>
                <div class="selfRight">
                  <span>图标预览：</span>
                  <div class="imgCtn">
                    <img :src="newPatch.selfPhoto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="wContent" :class="{'wContentL':step>4,'wContentM':step===4,'wContentR':step<4}">
            <div class="line line5">
              <div class="info">
                <em>*</em>
                <span>可见角色：</span>
              </div>
              <div class="selCtn">
                <el-select v-model="newPatch.roles" multiple placeholder="请选择">
                  <el-option
                    v-for="item in roleList"
                    :key="item.roleid"
                    :label="item.rolename"
                    :value="item.roleid">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class="opration">
          <div class="button button1" v-if="editFlag" @click="next">{{step===4?'确认':'下一步'}}</div>
          <div class="button button1" v-if="!editFlag"  @click="next">{{step===4?'完成':'下一步'}}</div>
          <div class="button button2" @click="initWindow">取消</div>
          <div class="button button3" v-if="editFlag" v-show="step!==2" @click="step--">上一步</div>
          <div class="button button3" v-if="!editFlag" v-show="step!==1" @click="step--">上一步</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { patchList, deletePatch, cancelPatch, addPatch, removePatch, roleAndIcon, createPatch, editPatch, logout, userRole, validationTitle } from '@/api/api.js'
import { Message } from 'element-ui'
export default {
  data () {
    return {
      types: '待添加',
      showWhich: '图标库',
      step: 1, // 添加贴片的步骤
      fileList: [],
      createFlag: false, // 是否展示编辑/新增贴片
      editFlag: false, // 是否编辑贴片
      modelArr: [], // 六个模块
      toAddList: [], // 待添加
      addedList: [], // 已添加
      deletedList: [], // 已删除
      iconList: [], // 图标库
      roleList: [], // 角色库
      role: false,
      realUrl: true, // 判断输入的网址是否为真
      realTitle: true, // 判断输入标题是否正确
      search: '', // 搜索
      newPatch: {
        photo: '', // 保存base64
        picturetype: 'icon', // 类型
        drag: 'drag1', // 大小
        bgcolor: 'bg-blue',
        enable: true,
        applicationtitle: '',
        applicationurl: '',
        applicationdescribe: '',
        roles: [],
        selfPhoto: require('@/assets/image/defPhoto.png'),
        selfBase64: '',
        pictureid: ''
      } // 新增贴片信息
    }
  },
  filters: {
    sizeFilter (val) {
      let map = {
        'drag1': '小',
        'drag2': '中',
        'drag3': '大'
      }
      return map[val]
    },
    typeFilter (val) {
      let arr = val.split('-')
      let map = {
        'num': '数字',
        'text': '文本',
        'icon': '图标',
        'list': '数字列表'
      }
      return map[arr[1]]
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
      return map[this.step - 1]
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
      return window.URL.createObjectURL(this.base64ToBlob('data:image/png;base64,' + val, 'image/png'))
    },
    // 转base64
    getBase64Image (img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
      var dataURL = canvas.toDataURL('image/' + ext)
      return dataURL
    },
    // 文件上传
    fileChange (file, fileList) {
      let _this = this
      this.newPatch.selfPhoto = URL.createObjectURL(file.raw)
      let reader = new FileReader()
      reader.onload = () => {
        let _base64 = reader.result
        _this.newPatch.selfBase64 = _base64
        console.log(_base64)
      }
      reader.readAsDataURL(file.raw)
    },
    // 数据初始化
    initData () {
      let _this = this
      patchList().then((res) => {
        let data = res.data.data
        _this.modelArr = data.groupList
        _this.addedList = data.addedList
        _this.deletedList = data.deletedList
        _this.toAddList = data.toAddList
        console.log(res)
      })
    },
    // 删除贴片
    deleteModel (id) {
      let _this = this
      deletePatch({
        pictureid: id
      }).then((res) => {
        if (res.data.code === 1) {
          Message({
            type: 'success',
            message: '恭喜您删除贴片成功',
            duration: 2000
          })
          _this.initData()
        } else {
          Message({
            type: 'error',
            message: '删除失败，请联系管理员',
            duration: 2000
          })
        }
      })
    },
    // 取消删除/添加
    cancelModel (id, status) {
      let _this = this
      cancelPatch({
        pictureid: id,
        status: status
      }).then((res) => {
        if (res.data.code === 1) {
          Message({
            type: 'success',
            message: res.data.message,
            duration: 2000
          })
          _this.initData()
        } else {
          Message({
            type: 'error',
            message: '删除失败，请联系管理员',
            duration: 2000
          })
        }
      })
    },
    // 添加贴片接口
    addModel (id, modelid, modeltitle) {
      let _this = this
      addPatch({
        pictureid: id,
        modelid: modelid,
        modeltitle: modeltitle
      }).then((res) => {
        if (res.data.code === 1) {
          Message({
            type: 'success',
            message: res.data.message,
            duration: 2000
          })
          _this.initData()
        } else {
          Message({
            type: 'error',
            message: '添加失败，请联系管理员',
            duration: 2000
          })
        }
      })
    },
    // 添加贴片操作
    handleCommand (command) {
      this.addModel(command.id, command.model.id, command.model.title)
    },
    // 彻底删除
    removeModel (id) {
      let _this = this
      removePatch({
        pictureid: id
      }).then((res) => {
        if (res.data.code === 1) {
          Message({
            type: 'success',
            message: res.data.message,
            duration: 2000
          })
          _this.initData()
        } else {
          Message({
            type: 'error',
            message: '删除失败，请联系管理员',
            duration: 2000
          })
        }
      })
    },
    // 点击下一步/完成
    next () {
      let _this = this
      if (this.step !== 4) {
        this.step++
      } else {
      // 先判断必填项是否为空
        let newPatch = this.newPatch
        if (newPatch.applicationtitle === '') {
          Message({
            type: 'error',
            message: '请先填写应用标题',
            duration: 2000
          })
        } else if (newPatch.applicationurl === '') {
          Message({
            type: 'error',
            message: '请先填写应用地址',
            duration: 2000
          })
        } else if (newPatch.roles.length === 0) {
          Message({
            type: 'error',
            message: '请选择可见角色',
            duration: 2000
          })
        } else {
          // 先处理部分数据
          newPatch.enable = newPatch.enable === true ? 1 : 0
          if (newPatch.drag === 'drag1') {
            newPatch.picturetype = 'style-' + newPatch.picturetype + '-m'
          } else if (newPatch.drag === 'drag2') {
            newPatch.picturetype = 'style-' + newPatch.picturetype + '-l'
          } else {
            newPatch.picturetype = 'style-' + newPatch.picturetype + '-xl'
          }
          // 判定最后选了哪个图
          let img = ''
          if (this.showWhich === '图标库') {
            img = newPatch.photo
          } else {
            img = newPatch.selfBase64.split(',')[1]
          }
          // 判断是编辑还是添加
          if (this.editFlag) {
            editPatch({
              photo: img,
              pictureid: newPatch.pictureid,
              enable: newPatch.enable,
              applicationtitle: newPatch.applicationtitle,
              applicationurl: newPatch.applicationurl,
              applicationdescribe: newPatch.applicationdescribe,
              roles: newPatch.roles
            }).then((res) => {
              if (res.data.code === 1) {
                Message({
                  type: 'success',
                  message: res.data.message,
                  duration: 2000
                })
                _this.initData()
                _this.initWindow()
              } else {
                Message({
                  type: 'error',
                  message: '编辑失败，请联系管理员',
                  duration: 2000
                })
              }
            })
          } else {
            createPatch({
              photo: img,
              picturetype: newPatch.picturetype,
              drag: newPatch.drag,
              bgcolor: newPatch.bgcolor,
              enable: newPatch.enable,
              applicationtitle: newPatch.applicationtitle,
              applicationurl: newPatch.applicationurl,
              applicationdescribe: newPatch.applicationdescribe,
              roles: newPatch.roles
            }).then((res) => {
              if (res.data.code === 1) {
                Message({
                  type: 'success',
                  message: res.data.message,
                  duration: 2000
                })
                _this.initData()
                _this.initWindow()
              } else {
                Message({
                  type: 'error',
                  message: '创建失败，请联系管理员',
                  duration: 2000
                })
              }
            })
          }
        }
      }
    },
    // 点击取消或者右上角的关闭按钮需要初始化窗口信息
    initWindow () {
      // 初始化一下窗口页面并关闭
      this.newPatch = {
        photo: '', // 保存base64
        picturetype: 'icon', // 类型
        drag: 'drag1', // 大小
        bgcolor: 'bg-blue',
        enable: true,
        applicationtitle: '',
        applicationurl: '',
        applicationdescribe: '',
        roles: [],
        selfPhoto: require('@/assets/image/defPhoto.png'),
        selfBase64: '',
        pictureid: ''
      }
      this.createFlag = false
      this.editFlag = false
      this.step = 1
      this.realUrl = true
      this.realTitle = true
    },
    // 选择贴片样式时的提示信息
    showTips () {
      Message({
        type: 'error',
        message: '该贴片样式暂不可用',
        duration: 2000
      })
    },
    // 编辑贴片
    editModel (info) {
      this.newPatch.photo = info.picturecontent
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
      this.createFlag = true
    },
    // 用户操作
    userOprate () {
      logout().then((res) => {
        if (res.data.code === 1) {
          Message({
            type: 'success',
            message: '注销成功',
            duration: 2000
          })
          this.$router.push('/login')
        }
      })
    },
    // 打开链接
    openUrl () {
      window.open(this.newPatch.applicationurl)
    },
    testUrl () {
      let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&amp;:/~+#]*[\w\-@?^=%&amp;/~+#])?/
      this.realUrl = reg.test(this.newPatch.applicationurl)
    },
    testTitle () {
      let _this = this
      let flag = this.editFlag ? 1 : 0
      validationTitle({
        pictureid: _this.newPatch.pictureid,
        title: _this.newPatch.applicationtitle,
        flag: flag
      }).then((res) => {
        if (res.data.code !== 1) {
          _this.realTitle = false
        } else {
          _this.realTitle = true
        }
      })
    }
  },
  mounted () {
    let _this = this
    // 初始化列表
    _this.initData()
    // 初始化图标库
    roleAndIcon().then((res) => {
      let data = res.data.data
      _this.iconList = data.icon
      // 初始化默认图
      _this.newPatch.photo = _this.iconList[0].content
      _this.roleList = data.role
    })
    userRole().then((res) => {
      if (res.data.code !== 1) {
        _this.$router.push('/login')
      } else {
        _this.role = res.data.data.role
      }
    })
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
</style>
<style lang="less" scoped>
  @import '~@/assets/css/edit.less';
</style>
