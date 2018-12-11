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
          <img class="setBtn" src="@/assets/image/setting.png" />
          <div class="selfCtn">个人中心</div>
        </div>
      </div>
      <div class="opration">
        <div class="button">编辑桌面</div>
        <div class="button">添加贴片</div>
      </div>
      <div class="windows">
        <div class="modelCtn model1">
          <div class="drag3"></div>
          <div class="drag2"></div>
          <div class="drag1"></div>
        </div>
        <div class="modelCtn model2">

        </div>
        <div class="modelCtn model3"></div>
        <div class="modelCtn model1"></div>
        <div class="modelCtn model2"></div>
        <div class="modelCtn model3"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {}
}
</script>
<style lang="less" scoped>
  @import '~@/assets/css/home.less';
</style>
