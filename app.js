//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    this.checkLogin(res => {
      console.log('is_login: ', res.is_login)
      if (!res.is_login) {
        this.login()
      }
    })
  },
  // 登录
  login: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("login code: " + res.code)
        wx.request({
          url: 'http://127.0.0.1:3000/login',
          method: 'post',
          data: {
            code: res.code
          },
          success: res => {
            console.log('token: ' + res.data.token)
            // 保存到全局数据
            this.globalData.token = res.data.token
            // 保存到缓存
            wx.setStorage({
              data: res.data.token,
              key: 'token',
            })
          }
        })
      }
    })
  },
  checkLogin: function (callback) {
    var token = this.globalData.token
    if (!token) {
      // 从数据库中获取 token
      token = wx.getStorageSync('token')
      if (token) {
        this.globalData.token = token
      } else {
        callback({
          is_login: false
        })
        return
      }
    }
    wx.request({
      url: 'http://127.0.0.1:3000/check_login',
      data: {
        token: token
      },
      success: res => {
        callback({
          is_login: res.data.is_login
        })
      }
    })
  },
  // 获取用户信息
  getUserInfo: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    token: null
  }
})