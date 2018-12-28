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
    goLogin () {
      let _this = this
      login({
        username: _this.username,
        password: _this.password
      }).then((res) => {
        console.log(res)
        if (res.data.code === 1) {
          _this.$router.push('/home')
        } else {
          Message({
            type: 'error',
            message: '请检查用户名或密码是否正确',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/login.less';
</style>
