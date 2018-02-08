Page({
  data:{
      currentIndex:1,//DEFAULT
      eventList : [],
      event: {
        title:"default",
        image : [],
        Date: "default",
        category:'default',
        index:0,
        Content : "default"
      }
  },
  //删除事件
  deleteEvent:function(e){
    var that = this
     wx.showModal({
          title: '删除事件',
          content: '请问你确定要删除这项事件吗，不能再恢复哦',
          confirmText: "确定",
          cancelText: "取消",
          success: function (res) {
              if (res.confirm) {
                  console.log('用户删除')
                  //构造新的列表
                  var newList = []
                  for(var i=0;i<that.data.eventList.length;i++){
                     if(i!=that.data.currentIndex){
                       newList.push(that.data.eventList[i])
                     }
                  }
                  //更新当前列表
                  that.setData({
                    eventList : newList
                  })
                  //更新缓存中的列表
                  that.setEventList()
                 
                  wx.switchTab({
                    url:'../index/index',
                    success:function(res){
                      //提示删除成功
                      wx.showToast({
                        title: '删除成功',
                        icon: 'success', // loading
                        duration: 2000,
                        mask: true
                      })
                    }
                  })
                  
                  
              }else{
                  console.log('用户取消删除')
              }
          }
      });
  },
  //编辑事件：将事件传到一个新的界面
  //注意这里跳转和存储的顺序非常重要
  editEvent:function(e){
      var that = this
      wx.setStorage({
        key:"currentEvent",
        data:that.data.event,
        success:function(res){
          wx.navigateTo({
            url:"../edit/edit"
          })
        }
      })
  },

  getEventList:function(){
    var that = this
     wx.getStorage({
      key:"eventList",
      success: function(res) {
        //必须要这样重新设置一下setData才会立即更新数据
        that.setData({
          eventList : res.data
        })
      }
    })
  },

  setEventList:function(){
    var that = this
    wx.setStorage({
      key:"eventList",
      data :that.data.eventList
    })
  },
  
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '事件详情'
    })
    var that = this
    that.getEventList()
    
     wx.getStorage({
      key:"currentPage",
      success:function(res){
        that.setData({
          currentIndex : res.data
        })
        //必须在success的回调函数中设置，否则无用。why？
        that.setData({
          event :  that.data.eventList[that.data.currentIndex]
        })
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