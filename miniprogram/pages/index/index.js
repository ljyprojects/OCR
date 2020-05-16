

//index.js
const app = getApp()
wx.cloud.init()

Page({
  data: {
    access_token: '',
    businessimg: '',
    infomation:{},
  },

  onLoad: function () {
    var that = this
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  businessLicense: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,
      complete: (res) => {
        console.log(res.tempFilePaths)
        this.setData({
          businessimg: res.tempFilePaths
        })
        console.log(that.data.businessimg)
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          console.log(res.tempFilePaths[i])
          wx.cloud.uploadFile({
            cloudPath: 'businessimg/' +(new Date()).getTime() + Math.floor(9 * Math.random())+'/' + ".jpg", // 上传至云端的路径
            filePath: res.tempFilePaths[i], // 小程序临时文件路径
            success: res => {
              // 返回文件 ID
              console.log('上传文件的FIleID',res.fileID)
              that.setData({
                businessimg:res.fileID
              })
              wx.cloud.getTempFileURL({
                fileList: [that.data.businessimg],
                success: res => {
                  console.log(res.fileList)
                  for (i in res.fileList) {
                    console.log(res.fileList[i].tempFileURL)
                    that.setData({
                      businessimg:res.fileList[i].tempFileURL
                    })
                    wx.cloud.callFunction({
                      name:'business',
                      data:{
                        businessimg:that.data.businessimg
                      },
                      success:res=>{
                        console.log(res)
                        that.setData({
                          infomation:res.result
                        })
                        console.log(that.data.infomation)
                      }
                    })
                  }
                }
              })
            },
          })
        }
      },
    })
  },


})