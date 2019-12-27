
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //  左侧的菜单数据
        leftMenuList: [],
        // 右侧的商品数据
        rightContent: [],
        // 被点击的左侧菜单
        currentIndex: 0,
        // 右侧内容滚动条距离顶部的距离
        scrollTop: 0
    },

    //接口返回的数据
    Cates: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        /* 
        web 和 小程序 本地存储的区别 ：
            web:localStorage.setItem("key",val)
            wx.setStorageSync('key', { time: Date.now(), data: this.Cates })
            web 存要转为 字符串
            wx 存的是什么类型的 拿出来就是什么类型的

         */

        /* 
        
         第一次发送请求之前 判断本地存储中 有没有旧的数据
         {time:Date.now(),data:[...]}
         没有 就发送请求
         有 旧的数据 同时 旧的数据 没有过期 就用旧的数据 */

        //  1.获取本地村粗的数据  (微信小程序的 本地存储技术)
        const Cates = wx.getStorageSync('cates')
        // 2.判断
        if (!Cates) {
            // 不存在则发送请求
            this.getCates()
        } else {
            // 有旧的数据 定义一个 过期时间  5分钟
            if (Date.now() - Cates.time > 1000 * 10) {
                this.getCates()
            } else {
                this.Cates = Cates.data
                let leftMenuList = this.Cates.map(v => v.cat_name)
                let rightContent = this.Cates[0].children
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }

        }

    },

    // 获取分类数据
    async getCates() {
        // request({
        //     url: "/categories"
        // })
        //     .then(res => {
        //         this.Cates = res.data.message;
        //         // 把接口数据 存放到本地存储
        //         wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
        //         //构造左侧的菜单数据
        //         let leftMenuList = this.Cates.map(v => v.cat_name)
        //         //构造右侧的商品数据  默认是第一个
        //         let rightContent = this.Cates[0].children
        //         this.setData({
        //             leftMenuList,
        //             rightContent
        //         })
        //     })

        // 使用 ES7
        const res = await request({ url: "/categories" })
        this.Cates = res;
        // 把接口数据 存放到本地存储
        wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
        //构造左侧的菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name)
        //构造右侧的商品数据  默认是第一个
        let rightContent = this.Cates[0].children
        this.setData({
            leftMenuList,
            rightContent
        })
    },

    // 左侧菜单的点击事件
    handleItemTap(e) {
        // 获取被点击target的索引
        // 给data的currentIndex赋值
        const { index } = e.currentTarget.dataset;
        // 改变右侧商品列表数据
        let rightContent = this.Cates[index].children
        this.setData({
            currentIndex: index,
            rightContent,
            scrollTop: 0  //点击后 重新设置 
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})