<template>
  <div class="homeCtn">
    <div class="main">
      <div class="header">
        <div class="title">
          <!-- <h1 class="clip">松江司法行政大数据门户</h1> -->
          <img src="@/assets/image/title.png" />
        </div>
        <div class="rightCtn">
          <div v-if="false" class="searchCtn">
            <input type="text" placeholder="请输入搜索内容"/>
            <img class="searchBtn" src="@/assets/image/search.png" />
          </div>
          <div class="setBtn" @click="$router.push('/edit')">
            <img class="unhover" src="@/assets/image/settings.png" />
            <img class="hover" src="@/assets/image/setting.png" />
          </div>
          <div class="selfCtn">
            <el-dropdown @command="userOprate">
              <div class="imgCtn">
                <img class="unhover" src="@/assets/image/head.png" />
                <img class="hover" src="@/assets/image/heads.png" />
                <i style="vertical-align:middle;line-height:44px;color:#ABDAFF" class="el-icon-arrow-down"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item disabled>{{name}}</el-dropdown-item>
                <el-dropdown-item command='logout' divided>退出</el-dropdown-item>
                <el-dropdown-item v-if="!role" command='fallback'>一键还原</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="opration">
        <div :class="desktopEditFlag?'button button1 active':'button button1'" @click="saveDesktop">{{desktopEditFlag?'保存桌面':'编辑桌面'}}</div>
        <div  v-if="role" class="button button2" @click="$router.push('/edit')">添加贴片</div>
      </div>
      <!-- 六大模块 -->
      <div :class="desktopEditFlag?'desktop edit':'desktop'" v-if="loaded">
        <!-- targetFileId用于记录六大模块哪个模块变蓝，再执行drag函数的时候改变 -->
        <!-- 文件夹区域-->
        <div v-for="(model,modelKey,modelIndex) in desktopData"
          :key="modelKey"
          :id="'modelCtn'+(modelIndex+1)"
          :style="targetFileId===('modelCtn'+(modelIndex+1))?'background:#56A6FF':''"
          class="modelCtn"
          :class="'model'+(modelIndex+1)"
          @drop="drop"
          @dragover="dragover">
          <!-- 文件夹名称，上级出发修改，span标签变成input标签 -->
          <div class="marks">
            <!-- desktopEditFlag控制未命名文件夹在桌面编辑/未编辑状态 -->
            <!-- fileTitleEditFlag控制文件夹编辑/未编辑状态 -->
            <span v-if="!desktopEditFlag" v-show="!model.fileTitleEditFlag">{{model.title === ('未命名'+ (modelIndex+1)) ?'':model.title}}</span>
            <span v-if="desktopEditFlag" v-show="!model.fileTitleEditFlag">{{model.title}}</span>
            <input v-show="model.fileTitleEditFlag" v-model="model.title" @blur="saveFileTitle(modelKey,modelIndex)"/>
            <!-- 在css中控制显示状态 -->
            <img @click="model.fileTitleEditFlag=true" src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 磁贴区域 -->
          <div @click="openMetroUrl(item.applicationurl,item.applicationenable)" v-for="item in model.data" :id="item.pictureid" :key="item.pictureid" :class="item.picturesize + ' ' + item.picturetype + ' ' + item.bgcolor" :style="{'background':item.applicationenable===0?'#8b8f92!important':''}"  class="metro" :draggable="desktopEditFlag" @dragstart="dragstart">
            <!-- 取消添加，需要单独调用接口 -->
            <i class="cancle" @click.stop="cancleModel(item.pictureid)"><span>×</span></i>
            <el-tooltip v-if="item.picturesize==='sizes'?item.applicationtitle.length>6:item.applicationtitle.length>15" effect="dark" :content="item.applicationtitle" placement="top">
              <span class="title">{{item.applicationtitle}}</span>
            </el-tooltip>
            <span class="title" v-else>{{item.applicationtitle}}</span>
            <!-- 判断四种类型 -->
              <!-- 图标类型 -->
            <div v-if="item.picturetype === 'style-icon'" class="img" :style="{backgroundImage:'url(data:image/png;base64,' + item.picturecontent + ')'}"></div>
            <!-- 数字类型-->
            <div v-if="item.picturetype === 'style-num'" class="numCtn">
              <div v-for="(item2,index2) in asyncData[item.pictureid]['data']" :key="index2" v-show="index2<1">
                <span class="word">{{item2.name}}</span>
                <span class="number">
                  <ICountUp :startVal="ICountUp.startVal" :endVal="item2.value" :decimals="ICountUp.decimals"
                    :duration="ICountUp.duration" :options="ICountUp.options"/>
                  <em>{{item2.unit}}</em>
                </span>
              </div>
            </div>
            <!-- 数字列表-->
            <div v-if="item.picturetype === 'style-list'" class="listCtn">
              <div v-for="(item2,index2) in asyncData[item.pictureid]['data']" :key="index2" class="list" v-show="(item.picturesize==='sizem'&&index2<3)||(item.picturesize==='sizel'&&index2<6)">
                <span>{{item2.name}}</span>
                <span>
                  <ICountUp :startVal="ICountUp.startVal" :endVal="item2.value" :decimals="ICountUp.decimals"
                   :duration="ICountUp.duration" :options="ICountUp.options"/>
                </span>
                <span v-if="item2.unit!==''">{{item2.unit}}</span>
              </div>
            </div>
            <!-- 文字列表-->
            <div v-if="item.picturetype === 'style-text'" class="listCtn">
              <div v-for="(item2,index2) in asyncData[item.pictureid]['data']" :key="index2" class="list animated zoomInRight fast" v-show="(item.picturesize==='sizem'&&index2<2)||(item.picturesize==='sizel'&&index2<5)">
                <span class="time">{{item2.name}}</span>
                <span class="content">{{item2.value}}</span>
              </div>
            </div>
            <!-- 改变磁贴大小 -->
            <div class="changed changeSize">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font" v-if="item.picturetype === 'style-icon' || item.picturetype === 'style-num'" @click.stop="changeSize('S',item.pictureid)">S</div>
                <div class="font" @click.stop="changeSize('M',item.pictureid)">M</div>
                <div class="font" @click.stop="changeSize('L',item.pictureid)">L</div>
              </div>
            </div>
            <!-- 改变磁贴颜色 -->
            <div class="changed changeColor" >
              <div class="button">
                <img src="@/assets/image/changeColor.png"/>
              </div>
              <div class="list">
                <div class="rect" @click.stop="changeColor('blue',item.pictureid)">
                  <div class="border-box blue">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect" @click.stop="changeColor('green',item.pictureid)">
                  <div class="border-box green">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect" @click.stop="changeColor('red',item.pictureid)">
                  <div class="border-box red">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect" @click.stop="changeColor('orange',item.pictureid)">
                  <div class="border-box orange">
                    <div class="content-box"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initAdd, layoutInfo, savePatch, cancelPatch, logout, userRole, fallback } from '@/api/api.js'
import { Message } from 'element-ui'
import http from '@/plugins/axios.js'
import ICountUp from 'vue-countup-v2'
export default {
  name: 'home',
  components: {
    ICountUp
  },
  data () {
    return {
      desktopEditFlag: false, // 是否进入编辑操作
      targetFileId: false, // 控制拖拽父容器是否高亮显示
      dragDom: '', // 当前拖拽元素信息
      dropDomIndex: 0, // 这个数据主要用于记录放置到某个drag元素后面
      oldFatherId: '', // 存储元素被拖拽时的初始father容器
      fileTitleEditFlag: false,
      loaded: false, // 数据加载完毕
      name: '',
      role: null, // 角色信息
      // 数字滚动配置项
      ICountUp: {
        startVal: 0,
        decimals: 0,
        duration: 3,
        options: {
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.',
          prefix: '',
          suffix: ''
        }
      },
      asyncData: {}, // 异步数据
      // 备份区域的测试数据
      testData: {
        model1: {
          title: '模块1',
          fileTitleEditFlag: false,
          data: []
        },
        model2: {
          title: '模块2',
          fileTitleEditFlag: false,
          data: [{
            picturesize: 'sizem',
            picturetype: 'style-num',
            bgcolor: 'bg-blue',
            applicationtitle: '数字样式1',
            pictureid: 'test4',
            picturecontent: {
              apiurl: 'http://192.168.91.13:3000/mock/112/portal/list',
              contentdata: [
                {
                  title: '今日新增',
                  filedkey: 'today'
                }
              ]
            }
          }]
        },
        model3: {
          title: '模块3',
          fileTitleEditFlag: false,
          data: [{
            picturesize: 'sizem',
            picturetype: 'style-list',
            bgcolor: 'bg-orange',
            applicationtitle: '数字样式2',
            pictureid: 'test8',
            picturecontent: {
              apiurl: 'http://192.168.91.13:3000/mock/112/portal/list',
              contentdata: [
                {
                  title: '昨日新增',
                  filedkey: 'yesterday'
                },
                {
                  title: '今日新增',
                  filedkey: 'today'
                }
              ]
            }
          }]
        },
        model4: {
          title: '模块4',
          fileTitleEditFlag: false,
          data: [{
            picturesize: 'sizel',
            picturetype: 'style-text',
            bgcolor: 'bg-orange',
            applicationtitle: '文本样式3',
            pictureid: 'test12',
            picturecontent: {
              apiurl: 'http://192.168.91.13:3000/mock/112/portal/text',
              contentdata: [
                {
                  title: '昨日新增',
                  filedkey: 'yesterday'
                }
              ]
            }
          }]
        },
        model5: {
          title: '',
          fileTitleEditFlag: false,
          data: []
        },
        model6: {
          title: '',
          fileTitleEditFlag: false,
          data: []
        }
      },
      // 桌面需要的数据格式
      desktopData: {
        model1: {
          title: '',
          fileTitleEditFlag: false,
          data: []
        },
        model2: {
          title: '',
          fileTitleEditFlag: false,
          data: []
        },
        model3: {
          title: '',
          fileTitleEditFlag: false,
          data: []
        },
        model4: {
          title: '',
          fileTitleEditFlag: false,
          data: []
        },
        model5: {
          title: '',
          fileTitleEditFlag: false,
          data: []
        },
        model6: {
          title: '',
          fileTitleEditFlag: false,
          data: []
        }
      },
      setInterval: ''
    }
  },
  methods: {
    // 拖拽过程
    dragover (ev) {
      ev.preventDefault()
      let target = this.findNode2(ev.target)
      // 拖拽过程中更新targetFileId，用于显示蓝色的背景色
      this.targetFileId = target.id
    },
    // 开始拖拽
    dragstart (ev) {
      // 初始化拖拽时的父容器id
      this.oldFatherId = ev.target.offsetParent.id
      // 保存拖拽元素的id
      ev.dataTransfer.setData('id', ev.target.id)
    },
    // 放下操作
    drop (ev) {
      ev.preventDefault()
      // 拿到拖拽元素的id
      let data = ev.dataTransfer.getData('id')
      // 根据拖拽元素的id去查询该元素，信息保存在this.dragDom中
      this.getDragDomData(this.desktopData, data)
      // 拿到放置元素的父容器
      let target = this.findNode(ev.target)
      // 父容器id和数据映射关系
      let map = {
        'modelCtn1': 'model1',
        'modelCtn2': 'model2',
        'modelCtn3': 'model3',
        'modelCtn4': 'model4',
        'modelCtn5': 'model5',
        'modelCtn6': 'model6'
      }
      // 先把原来的节点数据删除
      this.desktopData[map[this.oldFatherId]].data.splice(this.dragDom.index, 1)
      // 然后根据添加的位置判断添加到哪里去
      if (target.classList[0] === 'metro') {
        this.getDragDomNewIndex(this.desktopData, target.id)
        this.desktopData[map[target.parentNode.id]].data.splice(this.dropDomIndex, 0, this.dragDom.json)
      } else {
        this.desktopData[map[target.id]].data.push(this.dragDom.json)
      }
      this.targetFileId = false
    },
    // 找到拖拽磁贴的数据信息(包括现在所在文件夹中的位置)
    getDragDomData (json, id) {
      if (typeof (json) === 'object') {
        for (let item in json) {
          if (json[item].pictureid === id) {
            this.dragDom = {
              'json': json[item],
              'index': item
            }
          } else {
            this.getDragDomData(json[item], id)
          }
        }
      }
    },
    // 找到拖拽磁贴在新文件夹下的新下标
    getDragDomNewIndex (json, id) {
      if (typeof (json) === 'object') {
        for (let item in json) {
          if (json[item].pictureid === id) {
            this.dropDomIndex = item
          } else {
            this.getDragDomNewIndex(json[item], id)
          }
        }
      }
    },
    // 遍历父节点
    findNode (node) {
      if (node.classList[0] === 'metro' || node.classList[0] === 'modelCtn') {
        return node
      } else {
        return this.findNode(node.parentNode)
      }
    },
    // 遍历到modelCtn父节点
    findNode2 (node) {
      if (node.classList[0] === 'modelCtn') {
        return node
      } else {
        return this.findNode2(node.parentNode)
      }
    },
    // 删除模块
    cancleModel (id) {
      for (let item in this.desktopData) {
        this.desktopData[item].data.forEach((item2, index) => {
          if (item2.pictureid === id) {
            this.desktopData[item].data.splice(index, 1)
          }
        })
      }
      cancelPatch({
        pictureid: id,
        status: 0
      }).then((res) => {
        if (res.data.code === 1) {
          Message({
            type: 'success',
            message: '删除图标成功',
            duration: 2000
          })
        }
      })
    },
    // 保存桌面
    saveDesktop () {
      this.desktopEditFlag = !this.desktopEditFlag
      // 处理数据，添加顺序字段
      if (!this.desktopEditFlag) {
        let desktopData = this.desktopData
        for (let item in desktopData) {
          if (desktopData[item].title === '') {
            desktopData[item].title = '未命名' + item.substr(item.length - 1, 1)
          }
          desktopData[item].data.forEach((item2, index) => {
            item2.modulesort = index + 1
          })
        }
        savePatch(desktopData).then((res) => {
          if (res.data.code === 1) {
            Message({
              type: 'success',
              message: '保存桌面成功',
              duration: 2000
            })
          }
        })
      }
    },
    // 保存标题
    saveFileTitle (model, index) {
      if (this.desktopData[model].title.length > 8) {
        Message({
          type: 'error',
          message: '标题不能超过八个字',
          duration: 2000
        })
        this.desktopData[model].title = '请重新命名'
      } else {
        this.desktopData[model].fileTitleEditFlag = false
      }
    },
    // 改颜色
    changeColor (color, id) {
      for (let item in this.desktopData) {
        this.desktopData[item].data.forEach((item) => {
          if (item.pictureid === id) {
            item.bgcolor = 'bg-' + color
          }
        })
      }
    },
    // 改大小
    changeSize (size, id) {
      let map = {
        'S': 'sizes',
        'M': 'sizem',
        'L': 'sizel'
      }
      for (let item in this.desktopData) {
        this.desktopData[item].data.forEach((item) => {
          if (item.pictureid === id) {
            item.picturesize = map[size]
          }
        })
      }
    },
    // 打开磁贴对应链接
    openMetroUrl (url, applicationenable) {
      if (applicationenable === 0) {
        this.$message.error('该模块暂未启用')
      } else {
        if (!this.desktopEditFlag) {
          window.open(url)
        }
      }
    },
    // 页面初始化
    async initdesktopData () {
      let _this = this
      let initRes = await initAdd()
      if (initRes.data.code !== 1) {
        Message({
          type: 'error',
          message: initRes.data.message,
          duration: 2000
        })
        return ''
      }
      if (initRes.data.code === 1) {
        let layoutRes = await layoutInfo()
        if (layoutRes.data.code === 1) {
          let data = layoutRes.data.data
          _this.asyncData = {}
          for (let item in data) {
            data[item].fileTitleEditFlag = false
            data[item].data.map(item => {
              if (item.picturetype !== 'style-icon') {
                _this.$set(_this.asyncData, item.pictureid, { type: item.picturetype, apiurl: item.picturecontent.apiurl, contentdata: item.picturecontent.contentdata, data: [] })
              }
            })
          }
          _this.desktopData = data
          this.loaded = true
          _this.asyncTimingTack()
        }
      }
    },
    // 用户操作--桌面还原、用户退出
    userOprate (cmd) {
      let _this = this
      if (cmd === 'fallback') {
        fallback().then((res) => {
          if (res.data.code === 1) {
            Message({
              type: 'success',
              message: '还原成功',
              duration: 2000
            })
            _this.initdesktopData()
          }
        })
      }
      if (cmd === 'logout') {
        logout().then((res) => {
          if (res.data.code === 1) {
            Message({
              type: 'success',
              message: '注销成功',
              duration: 2000
            })
            location.href = res.data.data
          }
        })
      }
    },
    // 异步定时任务
    asyncTimingTack () {
      let _this = this
      if (_this.setInterval !== '') {
        // 清空旧计数器
        clearInterval(_this.setInterval)
        _this.setInterval = ''
      }
      // 第一次获取数据
      _this.ergodic()
      // 每隔60s定时更新数据
      _this.setInterval = setInterval(function () {
        _this.ergodic()
      }, 60000)
    },
    // 遍历异步磁贴
    ergodic () {
      Object.keys(this.asyncData).map(item => {
        this.getAsyncData(item)
      })
    },
    // 获取异步磁贴的数据
    async getAsyncData (key) {
      let res = await http.get(this.asyncData[key]['apiurl'])
      let data = []
      if (this.asyncData[key]['type'] === 'style-num' || this.asyncData[key]['type'] === 'style-list') {
        this.asyncData[key]['contentdata'].map((item) => {
          res.data.data.map((item2) => {
            if (item.filedkey === item2.keyname) {
              data.push({ name: item.title, value: item2.number, unit: item2.unit })
            }
          })
        })
      }
      if (this.asyncData[key]['type'] === 'style-text') {
        res.data.data.map((item2) => {
          data.push({ name: item2.time, value: item2.content })
        })
      }
      this.$set(this.asyncData[key], 'data', data)
    }
  },
  mounted () {
    let _this = this
    userRole().then((res) => {
      if (res.data.code === 1) {
        _this.name = res.data.data.name
        _this.role = res.data.data.role
        _this.initdesktopData()
      } else {
        Message({
          type: 'warning',
          message: res.data.message,
          duration: 2000
        })
      }
    })
  },
  beforeDestroy () {
    clearInterval(this.setInterval)
    this.setInterval = ''
  }
}
</script>
<style lang="less">
  @import '~@/assets/css/home.less';
</style>
