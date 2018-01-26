//index.js
//获取应用实例
const app = getApp()
var eventList = []
Page({
  data: {
    userInfo: {},
    gotoedit:'点击编辑新事件',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    clickID : 1
  
  },

  //jump to edit page  
  anotherBindTap: function(){
    wx.navigateTo({
      url: '../edit/edit'
    })
  },

  passIndex:function(e){
    this.setData({
      clickID : e.currentTarget.dataset.id
    })
    
    console.log(this.data.clickID)

    wx.setStorage({
      key: "currentPage",
      data : this.data.clickID
    })
  },


  onShow:function(){
    var that = this
    wx.getStorage({
      key:"eventList",
      success: function(res) {
        that.setData({
          eventList: res.data
        })
      } 
    })
  },
  onLoad: function () {
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
   
   
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
