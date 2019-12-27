// pages/user/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo: {},
        // 收藏的商品数
        collectNum: 0,
        // 足迹数量
        trackNum: 0
    },

    onShow() {
        const userinfo = wx.getStorageSync('userinfo')
        const collect = wx.getStorageSync('collect')
        const track = wx.getStorageSync('track')
        this.setData({
            userinfo,
            collectNum: collect.length,
            trackNum: track.length
        })
    }
})