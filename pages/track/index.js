// pages/track/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        track: []
    },
    onShow: function () {
        let track = wx.getStorageSync("track") || [];
        this.setData({ track })
    },

})