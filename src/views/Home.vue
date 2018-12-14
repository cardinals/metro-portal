<template>
  <div class="homeCtn">
    <div class="main">
      <div class="header">
        <div class="title">
          <!-- <h1 class="clip">松江司法行政大数据门户</h1> -->
          <img src="@/assets/image/title.png" />
        </div>
        <div class="rightCtn">
          <div class="searchCtn">
            <input type="text" placeholder="请输入搜索内容"/>
            <img class="searchBtn" src="@/assets/image/search.png" />
          </div>
          <div class="setBtn">
            <img class="unhover" src="@/assets/image/settings.png" />
            <img class="hover" src="@/assets/image/setting.png" />
          </div>
          <div class="selfCtn">
            <el-dropdown>
              <div class="imgCtn">
                <img class="unhover" src="@/assets/image/head.png" />
                <img class="hover" src="@/assets/image/heads.png" />
              </div>
              <i style="vertical-align:middle;line-height:44px;color:#ABDAFF" class="el-icon-arrow-down"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="opration">
        <div :class="editFlag?'button button1 active':'button button1'" @click="editFlag=!editFlag">{{editFlag?'保存桌面':'编辑桌面'}}</div>
        <div class="button button2">添加贴片</div>
      </div>
      <div :class="editFlag?'windows edit':'windows'">
        <div id="modelCtn1" :style="dragId==='modelCtn1'?'background:#56A6FF':''" class="modelCtn model1" @drop="drop" @dragover="allowDrop">
          <div class="marks" @dblclick="editTitle=true">
            <span v-show="!editTitle">{{title}}</span>
            <input v-show="editTitle" :value="title" @blur="editTitle=false"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
            <!-- background只支持网络地址 -->
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
        </div>
        <div id="modelCtn2" :style="dragId==='modelCtn2'?'background:#56A6FF':''" class="modelCtn model2" @drop="drop" @dragover="allowDrop">
          <div class="marks">
            <span>智慧司法</span>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <div id="6" class="drag drag1 style-num-m bg-red" :draggable="editFlag" @dragstart="drag">
            <span class="title">数字样式</span>
            <div class="numCtn">
              <span class="word">今日服务</span>
              <span class="number">4236<em>人</em></span>
            </div>
          </div>
          <div id="4" class="drag drag2 style-num-l bg-orange" :draggable="editFlag" @dragstart="drag">
            <span class="title">数字样式</span>
            <div class="numCtn">
              <span class="word">今日服务</span>
              <span class="number">4236<em>人</em></span>
            </div>
          </div>
          <div id="5" class="drag drag3 style-num-xl bg-blue" :draggable="editFlag" @dragstart="drag">
            <span class="title">数字样式</span>
            <div class="numCtn">
              <span class="word">今日服务</span>
              <span class="number">4236<em>人</em></span>
            </div>
          </div>
        </div>
        <div id="modelCtn3" :style="dragId==='modelCtn3'?'background:#56A6FF':''" class="modelCtn model3" @drop="drop" @dragover="allowDrop">
          <div class="marks">
            <span>智慧司法</span>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <div id="8" class="drag drag2 style-list-l bg-blue" :draggable="editFlag" @dragstart="drag">
            <span class="title">列表样式</span>
            <div class="listCtn">
              <div class="list">
                <span>今日新增</span>
                <span>13</span>
              </div>
              <div class="list">
                <span>今日新增</span>
                <span>1323</span>
              </div>
            </div>
          </div>
          <div id="9" class="drag drag3 style-list-xl bg-blue" :draggable="editFlag" @dragstart="drag">
            <span class="title">列表样式</span>
            <div class="listCtn">
              <div class="list">
                <span>今日新增</span>
                <span>13</span>
              </div>
              <div class="list">
                <span>今日新增</span>
                <span>1323</span>
              </div>
              <div class="list">
                <span>今日新增</span>
                <span>1323</span>
              </div>
              <div class="list">
                <span>今日新增</span>
                <span>1323</span>
              </div>
              <div class="list">
                <span>今日新增</span>
                <span>1323</span>
              </div>
            </div>
          </div>
          <div id="10" class="drag drag2 style-list-l bg-blue" :draggable="editFlag" @dragstart="drag">
            <span class="title">列表样式</span>
            <div class="listCtn">
              <div class="list">
                <span>今日新增</span>
                <span>13</span>
              </div>
              <div class="list">
                <span>今日新增</span>
                <span>1323</span>
              </div>
              <div class="list">
                <span>今日新增</span>
                <span>1323</span>
              </div>
            </div>
          </div>
        </div>
        <div id="modelCtn4" :style="dragId==='modelCtn4'?'background:#56A6FF':''" class="modelCtn model1" @drop="drop" @dragover="allowDrop">
          <div class="marks">
            <span>使用帮助</span>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <div id="11" class="drag drag1 style-text-m bg-orange" :draggable="editFlag" @dragstart="drag">
             <span class="title">文本样式</span>
             <div class="listCtn">
               <div class="list">
                <span class="time">11/26 08:31</span>
                <span class="content">张国民申请法律援助服务，请及时处理请及时处理</span>
              </div>
             </div>
          </div>
          <div id="12" class="drag drag2 style-text-l bg-red" :draggable="editFlag" @dragstart="drag">
            <span class="title">文本样式</span>
            <div class="listCtn">
              <div class="list">
                <span class="time">11/26 08:31</span>
                <span class="content">张国民申请法律援助服务，请及时处理请及时处理</span>
              </div>
              <div class="list">
                <span class="time">11/26 08:31</span>
                <span class="content">张国民申请法律援助服务，请及时处理请及时处理</span>
              </div>
             </div>
          </div>
          <div id="13" class="drag drag3 style-text-xl bg-blue" :draggable="editFlag" @dragstart="drag">
            <span class="title">文本样式</span>
            <div class="listCtn">
              <div class="list">
                <span class="time">11/26 08:31</span>
                <span class="content">张国民申请法律援助服务，请及时处理请及时处理</span>
              </div>
              <div class="list">
                <span class="time">11/26 08:31</span>
                <span class="content">张国民申请法律援助服务，请及时处理请及时处理</span>
              </div>
              <div class="list">
                <span class="time">11/26 08:31</span>
                <span class="content">张国民申请法律援助服务，请及时处理请及时处理</span>
              </div>
              <div class="list">
                <span class="time">11/26 08:31</span>
                <span class="content">张国民申请法律援助服务，请及时处理请及时处理</span>
              </div>
             </div>
          </div>
        </div>
        <div id="modelCtn5" :style="dragId==='modelCtn5'?'background:#56A6FF':''" class="modelCtn model2" @drop="drop" @dragover="allowDrop"></div>
        <div id="modelCtn6" :style="dragId==='modelCtn6'?'background:#56A6FF':''" class="modelCtn model3" @drop="drop" @dragover="allowDrop"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      editFlag: false,
      dragId: false,
      title: '智慧司法',
      editTitle: false,
      img: require('../assets/image/icon_shape.png')
    }
  },
  methods: {
    // 拖拽三连击
    allowDrop (ev) {
      ev.preventDefault()
      let target = this.findNode2(ev.target)
      this.dragId = target.id
    },
    drag (ev) {
      let id
      // 处理图片可以默认拖拽导致的问题
      if (ev.target.tagName === 'IMG') {
        id = ev.target.offsetParent.id
      } else {
        id = ev.target.id
      }
      ev.dataTransfer.setData('Text', id)
    },
    drop (ev) {
      ev.preventDefault()
      let data = ev.dataTransfer.getData('Text')
      let target = this.findNode(ev.target)
      if (target.classList[0] === 'drag') {
        this.insertAfter(document.getElementById(data), target)
      } else {
        target.appendChild(document.getElementById(data))
      }
      this.dragId = false
    },
    // 遍历父节点
    findNode (node) {
      if (node.classList[0] === 'drag' || node.classList[0] === 'modelCtn') {
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
    // 插入兄弟节点
    insertAfter (newElement, targetElement) {
      let parent = targetElement.parentNode
      if (parent.lastChild === targetElement) {
        // 如果最后的节点是目标元素，则直接添加。因为默认是最后
        parent.appendChild(newElement)
      } else {
        parent.insertBefore(newElement, targetElement.nextSibling)
        // 如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~@/assets/css/home.less';
</style>
