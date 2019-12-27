
import { request } from '../../request/index.js'

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数组
    floorList: [],

  },
  onLoad: function (options) {
    //发送异步请求 获取 轮播图数据  优化手段 ES6 promise 
    // wx.request({
    //   url: '/home/swiperdata',
    //   data: {},
    //   method: 'GET',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // }) 
    this.getSwiperList();  //获取轮播图数据
    this.getCatesList()    // 导航分类
    this.getFloorList()       //楼层数据
  },

  //获取 轮播图数据
  getSwiperList() {
    request({
      url: "/home/swiperdata"
    })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },

  //获取 分类导航数据
  getCatesList() {
    request({
      url: "/home/catitems"
    })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },

  //获取 楼层数据
  getFloorList() {
    request({
      url: "/home/floordata"
    })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  },

})
