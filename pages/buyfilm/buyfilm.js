var sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置
var Zan = require('../../dist/index.js')

Page(Object.assign({}, Zan.NoticeBar,{
  data:{
     //tabbar
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

     //noticebar
    movable: {
      text:"-------------------------------------------------------------------------------暂无"
    },

    //detail
    theaterDates:[],
    theaterMovies:[],
    theaterDetail:[],


  },
   tabClick: function (e) {
      this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
      });
    },
  onLoad:function(options){
    //进行请求
    var that = this
    wx.getStorage({
      key:"theaterID",
      success:function(res){
        //发起请求
        var buyDetail = "https://m.maoyan.com/showtime/wrap.json"
        wx.request({
          url: buyDetail,
          header: {
              'content-type': 'application/json' // 默认值
          },
          method:'GET',
          dataType : 'json',
          data:{
            cinemaid: res.data,
          },
          success: function(res) {
            console.log(res.data)
            that.setData({
              theaterDates:res.data.data.Dates,
              theaterDetail:res.data.data.cinemaDetailModel,
              theaterMovies:res.data.data.movies,
              //连续set就不行？
            })
             wx.getSystemInfo({
              success: function(res) {
                  that.setData({
                      sliderLeft: (res.windowWidth / that.data.theaterDates.length - sliderWidth) / 2,
                      sliderOffset: res.windowWidth / that.data.theaterDates.length * that.data.activeIndex
                  });
              }
            })
            //放到这里反而可以
            if(that.data.theaterDetail.note!=""){
               that.setData({
                'movable.text':that.data.theaterDetail.note
              })
            }else{
              that.setData({
                'movable.text':'暂无相关信息'
              })
            }
           
          },
          fail: function(res) {
            console.log(res.data)
          }  
        })  
      }
    })
   

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
     // 滚动通告栏需要initScroll
    this.initZanNoticeBarScroll('movable');
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
}))