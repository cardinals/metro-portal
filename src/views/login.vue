<template>
  <div class="loginCtn">
    <div class="header">
      <img src="../assets/image/login.png" />
    </div>
    <div class="contentCtn">
      <img class="img" src='../assets/image/point.png'/>
      <div class="line1">用户登录</div>
      <div class="line2">
        <div class="icon"></div>
        <input type="text" placeholder="请输入用户名" v-model="username" />
      </div>
      <div class="line2">
        <div class="icon psd"></div>
        <input type="password" placeholder="请输入密码" v-model="password" />
      </div>
      <div class="button" @click="goLogin">登录</div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/api.js'
import { Message } from 'element-ui'
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    // 显示消息
    showMessage (type, message, time) {
      Message({
        type: type || 'success',
        message: message || '未定义的消息内容',
        duration: time || 2000
      })
    },
    async goLogin () {
      const res = await login({
        username: this.username,
        password: this.password
      })
      if (res.data.code === 1) {
        this.$router.push('/home')
      } else {
        this.showMessage('error', '请检查用户名或密码是否正确')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/login.less';
</style>
