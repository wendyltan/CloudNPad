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
    edit_mode : false,
    edit_index: "",
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

  submitInfo:function(){
    
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

  saveEvent:function(){
    
     //更新列表
    var title = this.data.event.title
    var Date = this.data.event.Date
    var Content = this.data.event.Content
    var index = this.data.edit_index
    var newList = []

    console.log("index: "+index)

    //判断字段是否为空
    if(title!=""&&Date!=""&&Content!=""){
      //if not empty,just update list  
      for(var i=0;i<this.data.eventList.length;i++){
        if(i==index){
          //replace the original event using new one
          newList.push(this.data.event)
        }else{
          newList.push(this.data.eventList[i])
        }     
      }
      

      this.setData({
        eventList : newList
      })
       //暂存在缓存中
      wx.setStorage({
        key:"eventList",
        data:this.data.eventList
      })

      //最后，清除缓存里的currentEvent，返回到主页面，提示修改成功
      wx.removeStorage({
        key:"currentEvent",
        success:function(res){
          wx.switchTab({
            url:"../index/index",
            success:function(res){
                wx.showToast({
                  title: '修改成功！',
                  icon: 'success',
                  duration: 2000
                })
              }
            })      
          }
        })

    }else{
      this.showZanTopTips('请填写必要的字段',2000)
    }    
  },


  onLoad:function(options){
   
   

    //读取上一次的事件列表继续添加
    var that = this
    that.getEventList(that)
    
    //设置显示的日期为默认是今天
    var time = util.formatTime(new Date())
    that.setData({
      'event.Date'  : time
    })

    //看能否获取编辑选项的内容，如果可以，就将详情显示到本页面
    wx.getStorage({
      key:"currentEvent",
      success: function(res) {
        that.data.event = res.data
        that.setData({
          event : that.data.event,
          'event.title' : that.data.event.title,
          'event.Content':that.data.event.Content,
           edit_mode : true //处于编辑模式而不是新建模式

        })
        wx.setNavigationBarTitle({
          title: '事件修改'
        })
      },
      fail: function(res) {
         wx.setNavigationBarTitle({
            title: '事件添加'
        })
      }
    })
    //获取传入的在列表中的位置

    wx.getStorage({
      key:"currentPage",
      success: function(res) {
        that.setData({
          edit_index: res.data
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
    //同样需要销毁缓存中的currentEvent,只要回到这个页面就清除缓存
    wx.removeStorage({
      key:"currentEvent"
    })
  }
}))