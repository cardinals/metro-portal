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
              </div>
              <i style="vertical-align:middle;line-height:44px;color:#ABDAFF" class="el-icon-arrow-down"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="!role" style="text-align:center" command='fallback'>一键还原</el-dropdown-item>
                <el-dropdown-item style="text-align:center" command='logout'>注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="opration">
        <div :class="desktopEditFlag?'button button1 active':'button button1'" @click="saveDesktop">{{desktopEditFlag?'保存桌面':'编辑桌面'}}</div>
        <div  v-if="role" class="button button2" @click="$router.push('/edit')">添加贴片</div>
      </div>
      <!-- 六大模块定义好 -->
      <div :class="desktopEditFlag?'desktop edit':'desktop'">
        <!-- targetFileId用于记录六大模块哪个模块变蓝，再执行drag函数的时候改变 -->
          <!-- 文件夹区域-->
        <div id="modelCtn1" :style="targetFileId==='modelCtn1'?'background:#56A6FF':''" class="modelCtn model1" @drop="drop" @dragover="dragover">
          <!-- 文件夹名称，上级出发修改，span标签变成input标签 -->
          <div class="marks" @dblclick="desktopData.model1.fileTitleEditFlag=true">
            <!-- desktopEditFlag控制未命名文件夹在桌面编辑/未编辑状态 -->
            <!-- fileTitleEditFlag控制文件夹编辑/未编辑状态 -->
            <span v-if="!desktopEditFlag" v-show="!desktopData.model1.fileTitleEditFlag">{{desktopData.model1.title === '未命名1'?'':desktopData.model1.title}}</span>
            <span v-if="desktopEditFlag" v-show="!desktopData.model1.fileTitleEditFlag">{{desktopData.model1.title}}</span>
            <input v-show="desktopData.model1.fileTitleEditFlag" v-model="desktopData.model1.title" @blur="saveFileTitle('model1')"/>
            <!-- 在css中控制显示状态 -->
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 磁贴区域 -->
          <div @click="openMetroUrl(item.applicationurl)" v-for="item in desktopData.model1.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="metro" :draggable="desktopEditFlag" @dragstart="dragstart">
            <!-- 取消添加，需要单独调用接口 -->
            <i class="cancle" @click.stop="cancleModel(item.pictureid)"><span>×</span></i>
            <span class="title">{{item.applicationtitle}}</span>
            <!-- 判断四种类型  由于目前只有第一种类型数据，因此其他几种数据的字段不确定，后续维护需要手动更改-->
            <!-- 图标类型 -->
            <div v-if="item.picturetype === 'style-icon-m'||item.picturetype === 'style-icon-l'||item.picturetype === 'style-icon-xl'" class="img" :style="{backgroundImage:'url(data:image/png;base64,' + item.picturecontent + ')'}"></div>
            <!-- 数字类型 该版本未实现 -->
            <div v-if="item.picturetype === 'style-num-m'||item.picturetype === 'style-num-l'||item.picturetype === 'style-num-xl'" class="numCtn">
              <span class="word">{{item.list[0].name}}</span>
              <span class="number">{{item.list[0].number}}<em>{{item.list[0].unit}}</em></span>
            </div>
            <!-- 数字列表 该版本未实现 -->
            <div v-if="item.picturetype === 'style-list-l'||item.picturetype === 'style-list-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag2'&&index2<3)||(item.drag==='drag3'&&index2<6)">
                <span>{{item2.name}}</span>
                <span>{{item2.number}}</span>
              </div>
            </div>
            <!-- 文字列表 该版本未实现 -->
            <div v-if="item.picturetype === 'style-text-m'||item.picturetype === 'style-text-l'||item.picturetype === 'style-text-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag1'&&index2<1)||(item.drag==='drag2'&&index2<2)||(item.drag==='drag3'&&index2<6)">
                <span class="time">{{item2.time}}</span>
                <span class="content">{{item2.text}}</span>
              </div>
            </div>
            <!-- 改变磁贴大小 -->
            <div class="changed changeSize">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font" v-if="item.type !== 'style-list-l'&&item.type !== 'style-list-xl'" @click.stop="changeSize('S',item.pictureid)">S</div>
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
          <!-- 备份 -->
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeColor.png"/>
              </div>
              <div class="list">
                <div class="rect">
                  <div class="border-box blue">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box green">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box red">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box orange">
                    <div class="content-box"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div> -->
        </div>
        <div id="modelCtn2" :style="targetFileId==='modelCtn2'?'background:#56A6FF':''" class="modelCtn model2" @drop="drop" @dragover="dragover">
          <div class="marks" @dblclick="desktopData.model2.fileTitleEditFlag=true">
            <span v-if="!desktopEditFlag" v-show="!desktopData.model2.fileTitleEditFlag">{{desktopData.model2.title === '未命名2'?'':desktopData.model2.title}}</span>
            <span v-if="desktopEditFlag" v-show="!desktopData.model2.fileTitleEditFlag">{{desktopData.model2.title}}</span>
            <input v-show="desktopData.model2.fileTitleEditFlag" v-model="desktopData.model2.title" @blur="saveFileTitle('model2')"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 测试 -->
          <div @click="openMetroUrl(item.applicationurl)" v-for="item in desktopData.model2.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="metro" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle" @click.stop="cancleModel(item.pictureid)"><span>×</span></i>
            <span class="title">{{item.applicationtitle}}</span>
            <!-- 判断四种类型  由于目前只有第一种类型数据，因此其他几种数据的字段不确定，后续维护需要手动更改-->
            <div v-if="item.picturetype === 'style-icon-m'||item.picturetype === 'style-icon-l'||item.picturetype === 'style-icon-xl'" class="img" :style="{backgroundImage:'url(data:image/png;base64,' + item.picturecontent + ')'}"></div>
            <div v-if="item.picturetype === 'style-num-m'||item.picturetype === 'style-num-l'||item.picturetype === 'style-num-xl'" class="numCtn">
              <span class="word">{{item.list[0].name}}</span>
              <span class="number">{{item.list[0].number}}<em>{{item.list[0].unit}}</em></span>
            </div>
            <div v-if="item.picturetype === 'style-list-l'||item.picturetype === 'style-list-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag2'&&index2<3)||(item.drag==='drag3'&&index2<6)">
                <span>{{item2.name}}</span>
                <span>{{item2.number}}</span>
              </div>
            </div>
            <div v-if="item.picturetype === 'style-text-m'||item.picturetype === 'style-text-l'||item.picturetype === 'style-text-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag1'&&index2<1)||(item.drag==='drag2'&&index2<2)||(item.drag==='drag3'&&index2<6)">
                <span class="time">{{item2.time}}</span>
                <span class="content">{{item2.text}}</span>
              </div>
            </div>
            <div class="changed changeSize">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font" v-if="item.type !== 'style-list-l'&&item.type !== 'style-list-xl'" @click.stop="changeSize('S',item.pictureid)">S</div>
                <div class="font" @click.stop="changeSize('M',item.pictureid)">M</div>
                <div class="font" @click.stop="changeSize('L',item.pictureid)">L</div>
              </div>
            </div>
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
          <!-- 备份 -->
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeColor.png"/>
              </div>
              <div class="list">
                <div class="rect">
                  <div class="border-box blue">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box green">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box red">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box orange">
                    <div class="content-box"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div> -->
        </div>
        <div id="modelCtn3" :style="targetFileId==='modelCtn3'?'background:#56A6FF':''" class="modelCtn model3" @drop="drop" @dragover="dragover">
          <div class="marks" @dblclick="desktopData.model3.fileTitleEditFlag=true">
            <span v-if="!desktopEditFlag" v-show="!desktopData.model3.fileTitleEditFlag">{{desktopData.model3.title === '未命名3'?'':desktopData.model3.title}}</span>
            <span v-if="desktopEditFlag" v-show="!desktopData.model3.fileTitleEditFlag">{{desktopData.model3.title}}</span>
            <input v-show="desktopData.model3.fileTitleEditFlag" v-model="desktopData.model3.title" @blur="saveFileTitle('model3')"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 测试 -->
          <div @click="openMetroUrl(item.applicationurl)" v-for="item in desktopData.model3.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="metro" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle" @click.stop="cancleModel(item.pictureid)"><span>×</span></i>
            <span class="title">{{item.applicationtitle}}</span>
            <!-- 判断四种类型  由于目前只有第一种类型数据，因此其他几种数据的字段不确定，后续维护需要手动更改-->
            <div v-if="item.picturetype === 'style-icon-m'||item.picturetype === 'style-icon-l'||item.picturetype === 'style-icon-xl'" class="img" :style="{backgroundImage:'url(data:image/png;base64,' + item.picturecontent + ')'}"></div>
            <div v-if="item.picturetype === 'style-num-m'||item.picturetype === 'style-num-l'||item.picturetype === 'style-num-xl'" class="numCtn">
              <span class="word">{{item.list[0].name}}</span>
              <span class="number">{{item.list[0].number}}<em>{{item.list[0].unit}}</em></span>
            </div>
            <div v-if="item.picturetype === 'style-list-l'||item.picturetype === 'style-list-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag2'&&index2<3)||(item.drag==='drag3'&&index2<6)">
                <span>{{item2.name}}</span>
                <span>{{item2.number}}</span>
              </div>
            </div>
            <div v-if="item.picturetype === 'style-text-m'||item.picturetype === 'style-text-l'||item.picturetype === 'style-text-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag1'&&index2<1)||(item.drag==='drag2'&&index2<2)||(item.drag==='drag3'&&index2<6)">
                <span class="time">{{item2.time}}</span>
                <span class="content">{{item2.text}}</span>
              </div>
            </div>
            <div class="changed changeSize">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font" v-if="item.type !== 'style-list-l'&&item.type !== 'style-list-xl'" @click.stop="changeSize('S',item.pictureid)">S</div>
                <div class="font" @click.stop="changeSize('M',item.pictureid)">M</div>
                <div class="font" @click.stop="changeSize('L',item.pictureid)">L</div>
              </div>
            </div>
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
          <!-- 备份 -->
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeColor.png"/>
              </div>
              <div class="list">
                <div class="rect">
                  <div class="border-box blue">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box green">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box red">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box orange">
                    <div class="content-box"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div> -->
        </div>
        <div id="modelCtn4" :style="targetFileId==='modelCtn4'?'background:#56A6FF':''" class="modelCtn model1" @drop="drop" @dragover="dragover">
          <div class="marks" @dblclick="desktopData.model4.fileTitleEditFlag=true">
            <span v-if="!desktopEditFlag" v-show="!desktopData.model4.fileTitleEditFlag">{{desktopData.model4.title === '未命名4'?'':desktopData.model4.title}}</span>
            <span v-if="desktopEditFlag" v-show="!desktopData.model4.fileTitleEditFlag">{{desktopData.model4.title}}</span>
            <input v-show="desktopData.model4.fileTitleEditFlag" v-model="desktopData.model4.title" @blur="saveFileTitle('model4')"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 测试 -->
          <div @click="openMetroUrl(item.applicationurl)" v-for="item in desktopData.model4.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="metro" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle" @click.stop="cancleModel(item.pictureid)"><span>×</span></i>
            <span class="title">{{item.applicationtitle}}</span>
            <!-- 判断四种类型  由于目前只有第一种类型数据，因此其他几种数据的字段不确定，后续维护需要手动更改-->
            <div v-if="item.picturetype === 'style-icon-m'||item.picturetype === 'style-icon-l'||item.picturetype === 'style-icon-xl'" class="img" :style="{backgroundImage:'url(data:image/png;base64,' + item.picturecontent + ')'}"></div>
            <div v-if="item.picturetype === 'style-num-m'||item.picturetype === 'style-num-l'||item.picturetype === 'style-num-xl'" class="numCtn">
              <span class="word">{{item.list[0].name}}</span>
              <span class="number">{{item.list[0].number}}<em>{{item.list[0].unit}}</em></span>
            </div>
            <div v-if="item.picturetype === 'style-list-l'||item.picturetype === 'style-list-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag2'&&index2<3)||(item.drag==='drag3'&&index2<6)">
                <span>{{item2.name}}</span>
                <span>{{item2.number}}</span>
              </div>
            </div>
            <div v-if="item.picturetype === 'style-text-m'||item.picturetype === 'style-text-l'||item.picturetype === 'style-text-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag1'&&index2<1)||(item.drag==='drag2'&&index2<2)||(item.drag==='drag3'&&index2<6)">
                <span class="time">{{item2.time}}</span>
                <span class="content">{{item2.text}}</span>
              </div>
            </div>
            <div class="changed changeSize">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font" v-if="item.type !== 'style-list-l'&&item.type !== 'style-list-xl'" @click.stop="changeSize('S',item.pictureid)">S</div>
                <div class="font" @click.stop="changeSize('M',item.pictureid)">M</div>
                <div class="font" @click.stop="changeSize('L',item.pictureid)">L</div>
              </div>
            </div>
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
          <!-- 备份 -->
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeColor.png"/>
              </div>
              <div class="list">
                <div class="rect">
                  <div class="border-box blue">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box green">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box red">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box orange">
                    <div class="content-box"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div> -->
        </div>
        <div id="modelCtn5" :style="targetFileId==='modelCtn5'?'background:#56A6FF':''" class="modelCtn model2" @drop="drop" @dragover="dragover">
          <div class="marks" @dblclick="desktopData.model5.fileTitleEditFlag=true">
            <span v-if="!desktopEditFlag" v-show="!desktopData.model5.fileTitleEditFlag">{{desktopData.model5.title === '未命名5'?'':desktopData.model5.title}}</span>
            <span v-if="desktopEditFlag" v-show="!desktopData.model5.fileTitleEditFlag">{{desktopData.model5.title}}</span>
            <input v-show="desktopData.model5.fileTitleEditFlag" v-model="desktopData.model5.title" @blur="saveFileTitle('model5')"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 测试 -->
          <div @click="openMetroUrl(item.applicationurl)" v-for="item in desktopData.model5.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="metro" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle" @click="cancleModel(item.pictureid)"><span>×</span></i>
            <span class="title">{{item.applicationtitle}}</span>
            <!-- 判断四种类型  由于目前只有第一种类型数据，因此其他几种数据的字段不确定，后续维护需要手动更改-->
            <div v-if="item.picturetype === 'style-icon-m'||item.picturetype === 'style-icon-l'||item.picturetype === 'style-icon-xl'" class="img" :style="{backgroundImage:'url(data:image/png;base64,' + item.picturecontent + ')'}"></div>
            <div v-if="item.picturetype === 'style-num-m'||item.picturetype === 'style-num-l'||item.picturetype === 'style-num-xl'" class="numCtn">
              <span class="word">{{item.list[0].name}}</span>
              <span class="number">{{item.list[0].number}}<em>{{item.list[0].unit}}</em></span>
            </div>
            <div v-if="item.picturetype === 'style-list-l'||item.picturetype === 'style-list-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag2'&&index2<3)||(item.drag==='drag3'&&index2<6)">
                <span>{{item2.name}}</span>
                <span>{{item2.number}}</span>
              </div>
            </div>
            <div v-if="item.picturetype === 'style-text-m'||item.picturetype === 'style-text-l'||item.picturetype === 'style-text-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag1'&&index2<1)||(item.drag==='drag2'&&index2<2)||(item.drag==='drag3'&&index2<6)">
                <span class="time">{{item2.time}}</span>
                <span class="content">{{item2.text}}</span>
              </div>
            </div>
            <div class="changed changeSize">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font" v-if="item.type !== 'style-list-l'&&item.type !== 'style-list-xl'" @click.stop="changeSize('S',item.pictureid)">S</div>
                <div class="font" @click.stop="changeSize('M',item.pictureid)">M</div>
                <div class="font" @click.stop="changeSize('L',item.pictureid)">L</div>
              </div>
            </div>
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
          <!-- 备份 -->
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeColor.png"/>
              </div>
              <div class="list">
                <div class="rect">
                  <div class="border-box blue">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box green">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box red">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box orange">
                    <div class="content-box"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div> -->
        </div>
        <div id="modelCtn6" :style="targetFileId==='modelCtn6'?'background:#56A6FF':''" class="modelCtn model3" @drop="drop" @dragover="dragover">
          <div class="marks" @dblclick="desktopData.model6.fileTitleEditFlag=true">
            <span v-if="!desktopEditFlag" v-show="!desktopData.model6.fileTitleEditFlag">{{desktopData.model6.title === '未命名6'?'':desktopData.model6.title}}</span>
            <span v-if="desktopEditFlag" v-show="!desktopData.model6.fileTitleEditFlag">{{desktopData.model6.title}}</span>
            <input v-show="desktopData.model6.fileTitleEditFlag" v-model="desktopData.model6.title" @blur="saveFileTitle('model6')"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 测试 -->
          <div @click="openMetroUrl(item.applicationurl)" v-for="item in desktopData.model6.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="metro" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle" @click="cancleModel(item.pictureid)"><span>×</span></i>
            <span class="title">{{item.applicationtitle}}</span>
            <!-- 判断四种类型  由于目前只有第一种类型数据，因此其他几种数据的字段不确定，后续维护需要手动更改-->
            <div v-if="item.picturetype === 'style-icon-m'||item.picturetype === 'style-icon-l'||item.picturetype === 'style-icon-xl'" class="img" :style="{backgroundImage:'url(data:image/png;base64,' + item.picturecontent + ')'}"></div>
            <div v-if="item.picturetype === 'style-num-m'||item.picturetype === 'style-num-l'||item.picturetype === 'style-num-xl'" class="numCtn">
              <span class="word">{{item.list[0].name}}</span>
              <span class="number">{{item.list[0].number}}<em>{{item.list[0].unit}}</em></span>
            </div>
            <div v-if="item.picturetype === 'style-list-l'||item.picturetype === 'style-list-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag2'&&index2<3)||(item.drag==='drag3'&&index2<6)">
                <span>{{item2.name}}</span>
                <span>{{item2.number}}</span>
              </div>
            </div>
            <div v-if="item.picturetype === 'style-text-m'||item.picturetype === 'style-text-l'||item.picturetype === 'style-text-xl'" class="listCtn">
              <div v-for="(item2,index2) in item.list" :key="index2" class="list" v-show="(item.drag==='drag1'&&index2<1)||(item.drag==='drag2'&&index2<2)||(item.drag==='drag3'&&index2<6)">
                <span class="time">{{item2.time}}</span>
                <span class="content">{{item2.text}}</span>
              </div>
            </div>
            <div class="changed changeSize">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font" v-if="item.type !== 'style-list-l'&&item.type !== 'style-list-xl'" @click.stop="changeSize('S',item.pictureid)">S</div>
                <div class="font" @click.stop="changeSize('M',item.pictureid)">M</div>
                <div class="font" @click.stop="changeSize('L',item.pictureid)">L</div>
              </div>
            </div>
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
          <!-- 备份 -->
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="desktopEditFlag">
              <div class="button">
                <img src="@/assets/image/changeColor.png"/>
              </div>
              <div class="list">
                <div class="rect">
                  <div class="border-box blue">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box green">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box red">
                    <div class="content-box"></div>
                  </div>
                </div>
                <div class="rect">
                  <div class="border-box orange">
                    <div class="content-box"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="desktopEditFlag" @dragstart="dragstart">
            <i class="cancle"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initAdd, layoutInfo, savePatch, cancelPatch, logout, userRole, fallback } from '@/api/api.js'
import { Message } from 'element-ui'
export default {
  name: 'home',
  data () {
    return {
      desktopEditFlag: false, // 是否进入编辑操作
      targetFileId: false, // 控制拖拽父容器是否高亮显示
      dragDom: '', // 当前拖拽元素信息
      dropDomIndex: 0, // 这个数据主要用于记录放置到某个drag元素后面
      oldFatherId: '', // 存储元素被拖拽时的初始father容器
      fileTitleEditFlag: false,
      role: null, // 角色信息
      // 备份区域的测试数据
      testData: {
        model1: {
          title: '模块1',
          fileTitleEditFlag: false,
          data: [{
            drag: 'drag1',
            type: 'style-icon-m',
            bg: 'bg-blue',
            name: '图标样式1',
            id: 'test1',
            img: require('../assets/image/icon_shape.png')
          }, {
            drag: 'drag2',
            type: 'style-icon-l',
            bg: 'bg-orange',
            name: '图标样式2',
            id: 'test2',
            img: require('../assets/image/icon_shape.png')
          }, {
            drag: 'drag3',
            type: 'style-icon-xl',
            bg: 'bg-green',
            name: '图标样式3',
            id: 'test3',
            img: require('../assets/image/icon_shape.png')
          }]
        },
        model2: {
          title: '模块2',
          fileTitleEditFlag: false,
          data: [{
            drag: 'drag1',
            type: 'style-num-m',
            bg: 'bg-blue',
            name: '数字样式1',
            id: 'test4',
            list: [{
              name: '昨日服务',
              number: 4136,
              unit: '人'
            }]
          }, {
            drag: 'drag2',
            type: 'style-num-l',
            bg: 'bg-orange',
            name: '数字样式2',
            id: 'test5',
            list: [{
              name: '今日服务',
              number: 426,
              unit: '人'
            }]
          }, {
            drag: 'drag3',
            type: 'style-num-xl',
            bg: 'bg-green',
            name: '数字样式3',
            id: 'test6',
            list: [{
              name: '明日服务',
              number: 296,
              unit: '人'
            }]
          }]
        },
        model3: {
          title: '模块3',
          fileTitleEditFlag: false,
          data: [{
            drag: 'drag2',
            type: 'style-list-l',
            bg: 'bg-blue',
            name: '数字样式1',
            id: 'test7',
            list: [{
              name: '今日新增',
              number: 4236
            }, {
              name: '今日新增',
              number: 4236
            }]
          }, {
            drag: 'drag2',
            type: 'style-list-l',
            bg: 'bg-orange',
            name: '数字样式2',
            id: 'test8',
            list: [{
              name: '今日新增',
              number: 4236
            }, {
              name: '今日新增',
              number: 4236
            }, {
              name: '今日新增',
              number: 4236
            }, {
              name: '今日新增',
              number: 4236
            }, {
              name: '今日新增',
              number: 4236
            }, {
              name: '今日新增',
              number: 4236
            }]
          }, {
            drag: 'drag3',
            type: 'style-list-xl',
            bg: 'bg-green',
            name: '数字样式3',
            id: 'test9',
            list: [{
              name: '今日新增',
              number: 4236
            }, {
              name: '今日新增',
              number: 4236
            }, {
              name: '今日新增',
              number: 4236
            }, {
              name: '今日新增',
              number: 4236
            }, {
              name: '今日新增',
              number: 4236
            }, {
              name: '今日新增',
              number: 4236
            }]
          }]
        },
        model4: {
          title: '模块4',
          fileTitleEditFlag: false,
          data: [{
            drag: 'drag1',
            type: 'style-text-m',
            bg: 'bg-green',
            name: '文本样式1',
            id: 'test10',
            list: [{
              time: '11/26 08:31',
              text: '张国民申请法律援助服务，请及时处理请及时处理'
            }]
          }, {
            drag: 'drag2',
            type: 'style-text-l',
            bg: 'bg-blue',
            name: '文本样式2',
            id: 'test11',
            list: [{
              time: '11/26 08:31',
              text: '张国民申请法律援助服务，请及时处理请及时处理'
            }, {
              time: '11/26 08:31',
              text: '张国民申请法律援助服务，请及时处理请及时处理'
            }]
          }, {
            drag: 'drag3',
            type: 'style-text-xl',
            bg: 'bg-orange',
            name: '文本样式3',
            id: 'test12',
            list: [{
              time: '11/26 08:31',
              text: '张国民申请法律援助服务，请及时处理请及时处理'
            }, {
              time: '11/26 08:31',
              text: '张国民申请法律援助服务，请及时处理请及时处理'
            }, {
              time: '11/26 08:31',
              text: '张国民申请法律援助服务，请及时处理请及时处理'
            }, {
              time: '11/26 08:31',
              text: '张国民申请法律援助服务，请及时处理请及时处理'
            }]
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
      }
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
    saveFileTitle (model) {
      if (this.desktopData[model].title.length === 0) {
        Message({
          type: 'error',
          message: '标题不能为空',
          duration: 2000
        })
        this.desktopData[model].title = '请重新命名'
      } else if (this.desktopData[model].title.length > 8) {
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
        'S': 'm',
        'M': 'l',
        'L': 'xl'
      }
      let map2 = {
        'S': 'drag1',
        'M': 'drag2',
        'L': 'drag3'
      }
      for (let item in this.desktopData) {
        this.desktopData[item].data.forEach((item) => {
          if (item.pictureid === id) {
            let arr = item.picturetype.split('-')
            let str = arr[0] + '-' + arr[1] + '-' + map[size]
            item.picturetype = str
            item.drag = map2[size]
          }
        })
      }
    },
    // 打开磁贴对应链接
    openMetroUrl (url) {
      if (!this.desktopEditFlag) {
        window.open(url)
      }
    },
    // 页面初始化
    initdesktopData () {
      let _this = this
      initAdd().then((res) => {
        if (res.data.code !== 1) {
          Message({
            type: 'error',
            message: res.data.message,
            duration: 2000
          })
        } else {
          layoutInfo().then((res) => {
            if (res.data.code === 1) {
              let data = res.data.data
              for (let item in data) {
                data[item].fileTitleEditFlag = false
              }
              _this.desktopData = data
            }
          })
        }
      })
    },
    // 退出登录
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
      } else {
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
      }
    }
  },
  mounted () {
    let _this = this
    userRole().then((res) => {
      if (res.data.code !== 1) {
        _this.$router.push('/login')
      } else {
        _this.role = res.data.data.role
      }
    })
    this.initdesktopData()
  }
}
</script>
<style lang="less" scoped>
  @import '~@/assets/css/home.less';
</style>
