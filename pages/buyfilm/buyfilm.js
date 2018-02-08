//using zan ui
var Zan = require('../../dist/index.js');
Page({
  data:{
    showInfo:[],
    sections:[],
    seatType:[],
    leftSeat:""
  },
  onLoad:function(options){
    //取出这个场次的电影信息
    var that = this
    wx.getStorage({
      key:"filmCinema",
      success:function(res){
        that.setData({
          showInfo:res.data.showInfo,
          sections:res.data.sections[0].seatRows
        })
         //set page title
        wx.setNavigationBarTitle({
          title: that.data.showInfo.cinemaName
        })
      }
    })
    
  },
  onReady:function(){
    //获取具体的座位情况并放入列表中，对空位计数
    var tempList =[]
    var count = 0
    for(var i=0;i<this.data.sections.length;i++){
      var list=[]
      for(var j=0;j<this.data.sections[i].seats.length;j++){
        list.push(this.data.sections[i].seats[j].type)
        if(this.data.sections[i].seats[j].type=='N'){
          count++
        }
      }
      tempList.push(list)
      
    }
    this.setData({
      seatType:tempList,
      leftSeat:count
    })


    
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})