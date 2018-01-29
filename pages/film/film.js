//using zan ui
var Zan = require('../../dist/index.js');
var apiKey  = '631599923d56215aaca2a9c039b040ce'

Page(Object.assign({}, Zan.NoticeBar, {
  data: {
    movable: {
      text: '====================================这块区域还在施工中!======================================='
    },

     inputShowed: false,
     inputVal: "",
     if_serach:false,

     filmInfo:{
       title: "",
       act:"",
       //主演详细信息
       act_s:[],
       //地区
       area:"",
       //封面
       cover:"",
       //简介
       desc:"",
       //导演
       dir:"",
       //标签
       tag:"",
       //年份
       year:""
     }
  },
   showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },

    //搜索处理
    handleSearch:function(){
      //使用搜索框中的名字进行搜索
      var that = this
       wx.request({
          url: 'https://op.juhe.cn/onebox/movie/video',
          header: {
              'content-type': 'application/json' // 默认值
          },
          data:{
            key: apiKey,
            q: this.data.inputVal
          },
          dataType : 'json',
          success: function(res) {
            if(res.data.reason =="查询成功"){
              console.log(res.data.result)
              that.setData({
                filmInfo : res.data.result
              })
              
              //看是否取得主演信息
              for(var i=0;i<that.data.filmInfo.act_s.length;i++){
                  console.log(that.data.filmInfo.act_s[i].name+'\n'
                  + that.data.filmInfo.act_s[i].image)
              }
              
            }else{
              console.log("查询不到影片信息")
            }

          },
          fail: function(res) {
            wx.showToast({
                title: '请求失败',
                duration: 2000
            })
            console.log(res.data)
          }
      })

    },
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '影片查询'
    })
  
  },
  onShow:function() {
    // 滚动通告栏需要initScroll
    this.initZanNoticeBarScroll('movable');
  }
}))
