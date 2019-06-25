import { userRole, fallback, logout, updatePassword } from '@/api/api.js'
import { Message } from 'element-ui'
export default class mixin {
  static getMixin () {
    return {
      data () {
        return {
          updatePasswordVisible: false,
          password: {
            oldPass: '',
            newPass: '',
            confirmPass: ''
          },
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
          }
        }
      },
      methods: {
        // 获取用户信息
        async getUserRole () {
          const res = await userRole()
          if (res.data.code === 1) {
            this.name = res.data.data.name
            this.role = res.data.data.role
            this.seeyonToken = res.data.data.orgname
            this.initdesktopData()
          } else {
            this.showMessage('warning', res.data.message)
          }
        },
        // 显示消息
        showMessage (type, message, time) {
          Message({
            type: type || 'success',
            message: message || '未定义的消息内容',
            duration: time || 2000
          })
        },
        // 用户操作--桌面还原、用户退出
        async userOprate (cmd) {
          let _this = this
          if (cmd === 'fallback') {
            const res = await fallback()
            if (res.data.code === 1) {
              _this.showMessage('success', '还原成功')
              _this.initdesktopData()
            }
          }
          if (cmd === 'logout') {
            const res = await logout()
            if (res.data.code === 1) {
              _this.showMessage('success', '注销成功')
              location.href = res.data.data
            }
          }
          if (cmd === 'updatepw') {
            this.updatePasswordVisible = true
          }
        },
        confirmPass (rule, value, callback) {
          if (value === '') {
            callback(new Error('请再次输入密码'))
          } else if (value !== this.password.newPass) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        },
        checkform (formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.updatePassword()
            }
          })
        },
        resetForm (formName) {
          this.updatePasswordVisible = false
          this.$refs[formName].resetFields()
        },
        async updatePassword () {
          const res = await updatePassword({ oldPassword: this.password.oldPass, newPassword: this.password.newPass })
          if (res.data.code === 1) {
            this.updatePasswordVisible = false
            this.showMessage('success', '密码修改成功，请重新登录')
            const logoutRes = await logout()
            if (logoutRes.data.code === 1) {
              location.href = logoutRes.data.data
            }
          }
          if (res.data.code === 0) {
            this.showMessage('error', res.data.message)
          }
        }
      }
    }
  }
}
