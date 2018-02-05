//using zan ui
var Zan = require('../../dist/index.js')
var apiKey  = '631599923d56215aaca2a9c039b040ce'
var sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置

Page(Object.assign({},Zan.card ,{
  data: {

    //tabbar
    tabs: ["影片查询", "最新影片", "周边影城"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,

    //searchbar
     inputShowed: false,
     inputVal: "",
     if_serach:false,

     //search_film_info
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
     },
     //new film
     movies:[],
     //theater
     area:[],
     theater:[],

     //id for movie detail
     movieid:"",

     current_movie :0,

     theaterID:""
  },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
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
      //先把上次的置空
      that.setData({
        filmInfo : {}
      })
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
    //影片图片改变时
    imageChange:function(e){
      this.setData({
        current_movie : e.detail.current
      })
    },
    //图片改变时加载详情页面
    loadDetail:function(e){
      var that = this
      //获取当前点击的影片的id
      var id =  this.data.movies[this.data.current_movie].id
      that.setData({
          movieid : id
      })
      //将这个id存起来
      wx.setStorage({
        key:"movieID",
        data:that.data.movieid
      })
      //跳转到新的页面
      wx.navigateTo({
        url:"../newfilm/newfilm"
      })
      console.log(this.data.movies[this.data.current_movie].id)
  

    },
  onLoad:function(options){
    var that = this
    wx.setNavigationBarTitle({
      title: '电影专区'
    })

    wx.getSystemInfo({
        success: function(res) {
            that.setData({
                sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
            });
        }
    });


    //处理最新的电影信息，发出请求
    wx.request({
      url :"https://m.maoyan.com/movie/list.json",
      data:{
        type:"hot",
        offset:"0",
        limit:"1000"
      },
       header: {
        'content-type': 'application/json' // 默认值
      },
      dataType : 'json',
      success: function(res) {
        that.setData({
          movies : res.data.data.movies
        })
        console.log(that.data.movies)
      },
      fail: function(res) {
        wx.showToast({
            title: '请求失败',
            icon:"none",
            duration: 2000
        })
        console.log(res.data)
      }    
  
    })

    //处理附近的影院信息
    wx.request({
      url :"https://m.maoyan.com/cinemas.json",
       header: {
        'content-type': 'application/json' // 默认值
      },
      dataType : 'json',
      success: function(res) {
        that.setData({
           area : Object.entries(res.data.data)
        })
        var tempList=[]
        var tempvar = 1
        for(var i=0;i<that.data.area.length;i++){
          for(var j =0;j<that.data.area[i][tempvar].length;j++){
            tempList.push(that.data.area[i][tempvar][j])
          }
        }
    
        that.setData({
          theater : tempList
        })
        console.log(that.data.theater)
      },
      fail: function(res) {
        wx.showToast({
            title: '请求失败',
            icon:"none",
            duration: 2000
        })
        console.log(res.data)
      }    
  
    })
  
  },
  //处理被选中的电影院
  recordTID:function(e){
      var that = this
      var index = e.currentTarget.dataset.id
      wx.setStorage({
        key:"theaterID",
        data:that.data.theater[index].id,
        success: function(res) {
          wx.navigateTo({
            url:"../cinemaDetail/cinemaDetail"
          })
        },
        fail:function(res){
          wx.showToast({
            title:"请重试！",
            duration:2000,
            icon:"none"
          })
        }
      })
      

  },
  onShow:function() {
  
  },
   onUnload:function(){
    // 页面关闭
    //把电影信息置空
    this.setData({
      filmInfo : {}
    })
  }
}))
