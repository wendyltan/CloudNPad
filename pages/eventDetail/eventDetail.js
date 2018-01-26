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
  deleteEvent:function(e){
     wx.showModal({
          title: '删除事件',
          content: '请问你确定要删除这项事件吗，不能再恢复哦',
          confirmText: "确定",
          cancelText: "取消",
          success: function (res) {
              console.log(res);
              if (res.confirm) {
                  console.log('用户删除')
              }else{
                  console.log('用户取消删除')
              }
          }
      });
  },
  editEvent:function(e){

  },
  onLoad:function(options){
    var that = this
    wx.getStorage({
      key:"eventList",
      success: function(res) {
        //必须要这样重新设置一下setData才会立即更新数据
        that.data.eventList = res.data
        that.setData({
          eventList : that.data.eventList
        })
      }
    })
    
     wx.getStorage({
      key:"currentPage",
      success:function(res){
        that.data.currentIndex = res.data
        that.setData({
          currentIndex : that.data.currentIndex
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