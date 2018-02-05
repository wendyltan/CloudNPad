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

    theaterDateShow:[],
    theaterShow:[],
    showIds:[],


  },
   tabClick: function (e) {
      this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
      });
    },
   buy:function(e){
     var that = this
     //选座
     var showid = e.currentTarget.dataset.showid
     var buyDetail = "https://m.maoyan.com/show/seats"
     var date = this.data.theaterDates[this.data.activeIndex].slug

     console.log(showid)


     wx.request({
       url:buyDetail,
       header:{
         'content-type': 'application/json' // 默认值
       },
        data:{
          showId: showid,
          showDate: date
        },
        method:'GET',
        success:function(res){
         if(res.data==""){
           console.log("网络错误或停止售票")
           wx.showToast({
              title: '网络错误，请重试',
              icon:"none",
              duration: 2000
           })
         }else{
           wx.setStorage({
            key:"filmCinema",
            data:res.data,
            success:function(){
              wx.navigateTo({
                url:'../buyfilm/buyfilm'
              })  
            }
          })
         }
         
        },
        fail:function(res){
          console.log(res.data)
        }
     })

    
   },
  onLoad:function(options){
    //进行请求
    var that = this
    wx.getStorage({
      key:"theaterID",
      success:function(res){
        //发起请求
        var showDetail = "https://m.maoyan.com/showtime/wrap.json"
        wx.request({
          url: showDetail,
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
              theaterDateShow:Object.entries(res.data.data.DateShow)
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
            //获取放映的影片的每天的id列表
            var tempList=[]
            for(var i=0;i<that.data.theaterDateShow.length;i++){
              var list = []
              for(var j=0;j<that.data.theaterDateShow[i][1].length;j++){
                // var id = that.data.theaterDateShow[i][1][j].sellPrStr.replace('<span class="m3 true2"><i>','').replace('</i></span>','')
                var id = that.data.theaterDateShow[i][1][j].showId
                list.push(id)
              }  
              tempList.push(list)      
            }

            that.setData({
              showIds:tempList
            }) 
            //获取影院的场次信息
            var tempList=[]
            for(var i=0;i<that.data.theaterDateShow.length;i++){
              var list=[]
              for(var j=0;j<that.data.theaterDateShow[i][1].length;j++){
                list.push(that.data.theaterDateShow[i][1][j])
              }
              tempList.push(list)
            }
            that.setData({
              theaterShow:tempList
            })

           
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