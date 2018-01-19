var tempFilePaths = "";
var savedFilePath = "";
var eventList = [];
Page({
  data:{
    textarea_hint:"事件：",
    textarea_placeholder:"在此键入事件",
    date_picker_hint:"选择日期",
    categoryArray:['Life','Work','Private','Study'],
    category_picker_hint:"选择类别",
    event: {
      image : "",
      Date: '2016-09-01',
      category:'Life',
      index:0,
      Content : ""
    }
   
    
  },
  
  textChange:function(e){
      this.setData({
       'event.Content' : e.detail.value
      })
  },
  bindDate:function(e){
    this.setData({
     'event.Date' : e.detail.value
    })
  },
  bindCategory:function(e){
    this.setData({
      'event.category' : this.data.categoryArray[e.detail.value],
      'event.index' : e.detail.value
    })
  },
  selectImage:function(){
      var that = this
      wx.chooseImage({
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          tempFilePaths = res.tempFilePaths
          that.setData({
             'event.image':tempFilePaths
          })
        } 
     })
  },

  submitInfo:function(e){
    
    this.setData({
      eventList : eventList.push(this.data.event)
    })
    //for test only

    for(var i=0;i<eventList.length;i++){
      console.log(eventList[i].image+'\n'+
      eventList[i].Date+'\n'+
       eventList[i].Content+'\n'+
       eventList[i].index+'\n'+
       eventList[i].category)
    }
    
    wx.setStorage({
      key:"eventList",
      data:eventList
    })


    wx.showToast({
      title: '事件更新成功',
      icon: 'success',
      duration: 2000,
    })
   
    
  },

  onLoad:function(options){
    //页面初始化 options为页面跳转所带来的参数
    //读取上一次的事件列表继续添加
     var that = this
     wx.getStorage({
        key:"eventList",
        success:function(res){
          that.setData({
            eventList : res.data
          })
          console.log(eventList)
        }
      })
  },
  onReady:function(){
    // 页面渲染完成
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