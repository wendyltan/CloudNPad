//using zan ui
var Zan = require('../../dist/index.js');

Page(Object.assign({}, Zan.NoticeBar, {
  data: {
    movable: {
      text: '====================================这块区域还在施工中!======================================='
    },
  },
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '最新电影'
    })
  },
  onShow:function() {
    // 滚动通告栏需要initScroll
    this.initZanNoticeBarScroll('movable');
  }
}))
