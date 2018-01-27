//using util
var util = require('../../utils/util.js');
//using zan ui
var Zan = require('../../dist/index.js');

var tempFilePaths = "";
var savedFilePath = "";

Page(Object.assign({}, Zan.TopTips,{
  data:{
    title_hint : "事件名",
    textarea_hint:"事件详情",
    textarea_placeholder:"在此键入事件",
    date_picker_hint:"选择日期",
    categoryArray:['Life','Work','Private','Study'],
    category_picker_hint:"选择类别",
    eventList : [],

    event: {
      title:[],
      image : [],
      Date: "",
      category:'Life',
      index:0,
      Content : []
    },
    
  },
  bindTitle:function(e){
    this.setData({
      'event.title' :e.detail.value,
    })
  },
  
  textChange:function(e){
      this.setData({
       'event.Content' : e.detail.value,
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
  previewImage: function(e){
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: this.data.event.image // 需要预览的图片http链接列表
      })
  },
  getEventList:function(that){   
    wx.getStorage({
      key: 'eventList',
      success: function(res){
        // success
        that.setData({
          eventList : res.data
        })
        console.log(that.data.eventList)
      }
    })
  },

  submitInfo:function(e){
    
    //更新列表
    var title = this.data.event.title
    var Date = this.data.event.Date
    var Content = this.data.event.Content
    var newList = []

    //判断字段是否为空
    if(title!=""&&Date!=""&&Content!=""){
      //if not empty,push and update list  
      for(var i=0;i<this.data.eventList.length;i++){
          newList.push(this.data.eventList[i])
      }
      newList.push(this.data.event)

      this.setData({
        eventList : newList
      })
       //暂存在缓存中
      wx.setStorage({
        key:"eventList",
        data:this.data.eventList
      })

      wx.switchTab({
        url:'../index/index',
        success:function(res){
          //提示删除成功
          wx.showToast({
            title: '事件更新成功',
            icon: 'success', // loading
            duration: 2000,
            mask: true
          })
        }
      })

    }else{
      this.showZanTopTips('请填写必要的字段',2000)

    }   
    
  },


  onLoad:function(options){
   
    wx.setNavigationBarTitle({
      title: '事件添加'
    })

    //读取上一次的事件列表继续添加
    var that = this
    that.getEventList(that)
    
    //设置显示的日期为默认是今天
    var time = util.formatTime(new Date())
    that.setData({
      'event.Date'  : time
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
}))