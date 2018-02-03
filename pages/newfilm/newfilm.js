//using zan ui
var Zan = require('../../dist/index.js');

Page(Object.assign({}, Zan.Tag,{
  data:{
     movieid:"",
     //放置影片详情
     movieDetail:[],
     tag :[],
     intro:"",

  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    //获取存储在缓存中的movieid
    wx.getStorage({
      key:"movieID",
      success:function(res){
        that.setData({
          movieid : res.data
        })
        
        //获取电影详细资料
        var urlDetail = "https://m.maoyan.com/movie/"+ that.data.movieid+ ".json"
        wx.request({
          url: urlDetail,
          header: {
              'content-type': 'application/json' // 默认值
            },
          dataType : 'json',
          success: function(res) {
            that.setData({
              movieDetail : res.data.data.MovieDetailModel
            })
            console.log(that.data.movieDetail)

            //处理一下tag
            var tagArray = that.data.movieDetail.cat.split(',')
            that.setData({
              tag:tagArray
            })

            //处理一下介绍的语句，去掉html标签
            var dealDra = that.data.movieDetail.dra.replace('<p>',"").replace('</p>',"")
            that.setData({
              intro : dealDra
            })
            //设置标题
             wx.setNavigationBarTitle({
              title: that.data.movieDetail.nm
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
    this.videoContext = wx.createVideoContext('movieVideo')
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
    //清除缓存的电影院
    wx.removeStorage({
      key:"theaterID"
    })
  }
}))