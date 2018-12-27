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
            <el-dropdown @command="logout">
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
        <div :class="editFlag?'button button1 active':'button button1'" @click="saveWindow">{{editFlag?'保存桌面':'编辑桌面'}}</div>
        <div  v-if="role" class="button button2" @click="$router.push('/edit')">添加贴片</div>
      </div>
      <!-- 六大模块定义好 -->
      <div :class="editFlag?'windows edit':'windows'">
        <div id="modelCtn1" :style="dragId==='modelCtn1'?'background:#56A6FF':''" class="modelCtn model1" @drop="drop" @dragover="allowDrop">
          <div class="marks" @dblclick="window.model1.editTitle=true">
            <span v-if="!editFlag" v-show="!window.model1.editTitle">{{window.model1.title === '未命名1'?'':window.model1.title}}</span>
            <span v-if="editFlag" v-show="!window.model1.editTitle">{{window.model1.title}}</span>
            <input v-show="window.model1.editTitle" v-model="window.model1.title" @blur="saveTitle('model1')"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 测试 -->
          <div @click="openUrl(item.applicationurl)" v-for="item in window.model1.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="drag" :draggable="editFlag" @dragstart="drag">
            <i class="delete" @click.stop="deleteModel(item.pictureid)"><span>×</span></i>
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
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="editFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="editFlag">
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
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div> -->
        </div>
        <div id="modelCtn2" :style="dragId==='modelCtn2'?'background:#56A6FF':''" class="modelCtn model2" @drop="drop" @dragover="allowDrop">
          <div class="marks" @dblclick="window.model2.editTitle=true">
            <span v-if="!editFlag" v-show="!window.model2.editTitle">{{window.model2.title === '未命名2'?'':window.model2.title}}</span>
            <span v-if="editFlag" v-show="!window.model2.editTitle">{{window.model2.title}}</span>
            <input v-show="window.model2.editTitle" v-model="window.model2.title" @blur="saveTitle('model2')"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 测试 -->
          <div @click="openUrl(item.applicationurl)" v-for="item in window.model2.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="drag" :draggable="editFlag" @dragstart="drag">
            <i class="delete" @click.stop="deleteModel(item.pictureid)"><span>×</span></i>
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
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="editFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="editFlag">
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
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div> -->
        </div>
        <div id="modelCtn3" :style="dragId==='modelCtn3'?'background:#56A6FF':''" class="modelCtn model3" @drop="drop" @dragover="allowDrop">
          <div class="marks" @dblclick="window.model3.editTitle=true">
            <span v-if="!editFlag" v-show="!window.model3.editTitle">{{window.model3.title === '未命名3'?'':window.model3.title}}</span>
            <span v-if="editFlag" v-show="!window.model3.editTitle">{{window.model3.title}}</span>
            <input v-show="window.model3.editTitle" v-model="window.model3.title" @blur="saveTitle('model3')"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 测试 -->
          <div @click="openUrl(item.applicationurl)" v-for="item in window.model3.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="drag" :draggable="editFlag" @dragstart="drag">
            <i class="delete" @click.stop="deleteModel(item.pictureid)"><span>×</span></i>
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
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="editFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="editFlag">
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
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div> -->
        </div>
        <div id="modelCtn4" :style="dragId==='modelCtn4'?'background:#56A6FF':''" class="modelCtn model1" @drop="drop" @dragover="allowDrop">
          <div class="marks" @dblclick="window.model4.editTitle=true">
            <span v-if="!editFlag" v-show="!window.model4.editTitle">{{window.model4.title === '未命名4'?'':window.model4.title}}</span>
            <span v-if="editFlag" v-show="!window.model4.editTitle">{{window.model4.title}}</span>
            <input v-show="window.model4.editTitle" v-model="window.model4.title" @blur="saveTitle('model4')"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 测试 -->
          <div @click="openUrl(item.applicationurl)" v-for="item in window.model4.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="drag" :draggable="editFlag" @dragstart="drag">
            <i class="delete" @click.stop="deleteModel(item.pictureid)"><span>×</span></i>
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
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="editFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="editFlag">
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
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div> -->
        </div>
        <div id="modelCtn5" :style="dragId==='modelCtn5'?'background:#56A6FF':''" class="modelCtn model2" @drop="drop" @dragover="allowDrop">
          <div class="marks" @dblclick="window.model5.editTitle=true">
            <span v-if="!editFlag" v-show="!window.model5.editTitle">{{window.model5.title === '未命名5'?'':window.model5.title}}</span>
            <span v-if="editFlag" v-show="!window.model5.editTitle">{{window.model5.title}}</span>
            <input v-show="window.model5.editTitle" v-model="window.model5.title" @blur="saveTitle('model5')"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 测试 -->
          <div @click="openUrl(item.applicationurl)" v-for="item in window.model5.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="drag" :draggable="editFlag" @dragstart="drag">
            <i class="delete" @click="deleteModel(item.pictureid)"><span>×</span></i>
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
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="editFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="editFlag">
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
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div> -->
        </div>
        <div id="modelCtn6" :style="dragId==='modelCtn6'?'background:#56A6FF':''" class="modelCtn model3" @drop="drop" @dragover="allowDrop">
          <div class="marks" @dblclick="window.model6.editTitle=true">
            <span v-if="!editFlag" v-show="!window.model6.editTitle">{{window.model6.title === '未命名6'?'':window.model6.title}}</span>
            <span v-if="editFlag" v-show="!window.model6.editTitle">{{window.model6.title}}</span>
            <input v-show="window.model6.editTitle" v-model="window.model6.title" @blur="saveTitle('model6')"/>
            <img src="@/assets/image/icon_edit_blue.png" />
          </div>
          <!-- 测试 -->
          <div @click="openUrl(item.applicationurl)" v-for="item in window.model6.data" :id="item.pictureid" :key="item.pictureid" :class="item.drag + ' ' + item.picturetype + ' ' + item.bgcolor"  class="drag" :draggable="editFlag" @dragstart="drag">
            <i class="delete" @click="deleteModel(item.pictureid)"><span>×</span></i>
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
          <!-- <div id="1" class="drag drag1 style-icon-m bg-blue" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
            <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
            <div class="changed changeSize" v-show="editFlag">
              <div class="button">
                <img src="@/assets/image/changeSize.png"/>
              </div>
              <div class="list">
                <div class="font">S</div>
                <div class="font">M</div>
                <div class="font">L</div>
              </div>
            </div>
            <div class="changed changeColor" v-show="editFlag">
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
          <div id="2" class="drag drag2 style-icon-l bg-green" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
            <span class="title">议案一档</span>
             <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          </div>
          <div id="3" class="drag drag3 style-icon-xl bg-orange" :draggable="editFlag" @dragstart="drag">
            <i class="delete"><span>×</span></i>
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
      editFlag: false, // 是否进入编辑操作
      dragId: false, // 控制拖拽父容器是否高亮显示
      dragDom: '', // 当前拖拽元素信息
      dropDomIndex: 0, // 这个数据主要用于记录放置到某个drag元素后面
      oldFatherId: '', // 存储元素被拖拽时的初始father容器
      title: '智慧司法',
      editTitle: false,
      role: null, // 角色信息
      img: require('../assets/image/icon_shape.png'),
      testData: {
        model1: {
          title: '模块1',
          editTitle: false,
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
          editTitle: false,
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
          editTitle: false,
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
          editTitle: false,
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
          editTitle: false,
          data: []
        },
        model6: {
          title: '',
          editTitle: false,
          data: []
        }
      },
      window: {
        model1: {
          title: '',
          editTitle: false,
          data: []
        },
        model2: {
          title: '',
          editTitle: false,
          data: []
        },
        model3: {
          title: '',
          editTitle: false,
          data: []
        },
        model4: {
          title: '',
          editTitle: false,
          data: []
        },
        model5: {
          title: '',
          editTitle: false,
          data: []
        },
        model6: {
          title: '',
          editTitle: false,
          data: []
        }
      }
    }
  },
  methods: {
    // 允许拖拽
    allowDrop (ev) {
      ev.preventDefault()
      let target = this.findNode2(ev.target)
      this.dragId = target.id
    },
    // 拖拽操作
    drag (ev) {
      // 初始化拖拽时的父容器id
      this.oldFatherId = ev.target.offsetParent.id
      // 保存拖拽元素的id
      ev.dataTransfer.setData('Text', ev.target.id)
    },
    // 放下操作
    drop (ev) {
      ev.preventDefault()
      let data = ev.dataTransfer.getData('Text') // 拿到拖拽元素的id
      this.getData(this.window, data) // 根据拖拽元素的id去查询该元素，信息保存在this.dragDom中
      let target = this.findNode(ev.target) // 拿到放置元素的父容器
      // 父容器id和测试数据映射关系
      let map = {
        'modelCtn1': 'model1',
        'modelCtn2': 'model2',
        'modelCtn3': 'model3',
        'modelCtn4': 'model4',
        'modelCtn5': 'model5',
        'modelCtn6': 'model6'
      }
      // 先把原来的节点数据删除
      this.window[map[this.oldFatherId]].data.splice(this.dragDom.index, 1)
      // 然后根据添加的位置判断添加到哪里去
      if (target.classList[0] === 'drag') {
        this.getData2(this.window, target.id)
        this.window[map[target.parentNode.id]].data.splice(this.dropDomIndex, 0, this.dragDom.json)
        // this.insertAfter(document.getElementById(data), target)
      } else {
        this.window[map[target.id]].data.push(this.dragDom.json)
        // target.appendChild(document.getElementById(data))
      }
      this.dragId = false
    },
    // 在data中寻找某个值所在的对象的index
    getData (json, id) {
      if (typeof (json) === 'object') {
        for (let item in json) {
          if (json[item].pictureid === id) {
            this.dragDom = {
              'json': json[item],
              'index': item
            }
          } else {
            this.getData(json[item], id)
          }
        }
      }
    },
    getData2 (json, id) {
      if (typeof (json) === 'object') {
        for (let item in json) {
          if (json[item].pictureid === id) {
            this.dropDomIndex = item
          } else {
            this.getData2(json[item], id)
          }
        }
      }
    },
    // 遍历父节点
    findNode (node) {
      if (node.classList[0] === 'drag' || node.classList[0] === 'modelCtn') {
        return node
      } else {
        return this.findNode(node.parentNode)
      }
    },
    // 遍历到modelCtn父节点 弃用
    findNode2 (node) {
      if (node.classList[0] === 'modelCtn') {
        return node
      } else {
        return this.findNode2(node.parentNode)
      }
    },
    // 插入兄弟节点 弃用
    insertAfter (newElement, targetElement) {
      let parent = targetElement.parentNode
      if (parent.lastChild === targetElement) {
        // 如果最后的节点是目标元素，则直接添加。因为默认是最后
        parent.appendChild(newElement)
      } else {
        parent.insertBefore(newElement, targetElement.nextSibling)
        // 如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
      }
    },
    // 删除模块
    deleteModel (id) {
      for (let item in this.window) {
        this.window[item].data.forEach((item2, index) => {
          if (item2.pictureid === id) {
            this.window[item].data.splice(index, 1)
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
    saveWindow () {
      this.editFlag = !this.editFlag
      // 处理数据，添加顺序字段
      if (!this.editFlag) {
        let window = this.window
        for (let item in window) {
          window[item].data.forEach((item2, index) => {
            item2.modulesort = index + 1
          })
        }
        savePatch(window).then((res) => {
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
    saveTitle (model) {
      if (this.window[model].title.length === 0) {
        Message({
          type: 'error',
          message: '标题不能为空',
          duration: 2000
        })
        this.window[model].title = '请重新命名'
      } else if (this.window[model].title.length > 8) {
        Message({
          type: 'error',
          message: '标题不能超过八个字',
          duration: 2000
        })
        this.window[model].title = '请重新命名'
      } else {
        this.window[model].editTitle = false
      }
    },
    // 改颜色
    changeColor (color, id) {
      for (let item in this.window) {
        this.window[item].data.forEach((item) => {
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
      for (let item in this.window) {
        this.window[item].data.forEach((item) => {
          if (item.pictureid === id) {
            let arr = item.picturetype.split('-')
            let str = arr[0] + '-' + arr[1] + '-' + map[size]
            item.picturetype = str
            item.drag = map2[size]
          }
        })
      }
    },
    // 打开链接
    openUrl (url) {
      window.open(url)
    },
    // 页面初始化
    initWindow () {
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
                data[item].editTitle = false
              }
              _this.window = data
            }
          })
        }
      })
    },
    // 退出登录
    logout (cmd) {
      let _this = this
      if (cmd === 'fallback') {
        fallback().then((res) => {
          if (res.data.code === 1) {
            Message({
              type: 'success',
              message: '还原成功',
              duration: 2000
            })
            _this.initWindow()
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
    this.initWindow()
  }
}
</script>
<style lang="less" scoped>
  @import '~@/assets/css/home.less';
</style>
