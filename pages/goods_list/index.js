import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/goods_list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [
            {
                id: 0,
                value: "综合",
                isActive: true
            },
            {
                id: 1,
                value: "销量",
                isActive: false
            },
            {
                id: 2,
                value: "价格",
                isActive: false
            }
        ],
        // 商品列表数据
        goodsList: [],
    },
    // 接口 需要的参数
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },
    // 总页数
    totalPages: 1,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.QueryParams.cid = options.cid || ""
        this.QueryParams.query = options.query || ""
        this.getGoodsList()
    },

    // 获取商品列表数据
    async getGoodsList() {
        const res = await request({ url: '/goods/search', data: this.QueryParams })
        // 获取总条数
        const total = res.total
        // 计算总页数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
        this.setData({
            goodsList: [...this.data.goodsList, ...res.goods]
        })
        // 关闭 下拉刷新 窗口  如果没有调用 下拉动作 直接调用 关闭的也不会出错
        wx.stopPullDownRefresh()
    },

    // 标题点击事件 从子组件传递过来
    handleTabsItemChange(e) {
        // 1 获取被点击的标题索引
        const { index } = e.detail;
        // 2 修改源数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        // 3 赋值到data中
        this.setData({
            tabs
        })
    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        // 重置数据
        this.setData({
            goodsList: []
        })
        // 重置页码
        this.QueryParams.pagenum = 1
        this.getGoodsList()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        // 判断还没有下一页数据  当前页码和总页数
        if (this.QueryParams.pagenum >= this.totalPages) {
            // 没有下一页
            wx.showToast({
                title: '没有下一页数据'
            })
        } else {
            this.QueryParams.pagenum++
            this.getGoodsList()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})