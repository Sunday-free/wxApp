
/* 
    1.页面被打开 onShow 获取 url 上的 type 参数 发送请求
    2.点击不同的标题也要重新发送请求 
*/

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [
            {
                id: 0,
                value: "全部",
                isActive: true
            },
            {
                id: 1,
                value: "待付款",
                isActive: false
            },
            {
                id: 2,
                value: "待发货",
                isActive: false
            },
            {
                id: 3,
                value: "退款/退货",
                isActive: false
            }
        ],
        orders: {}
    },

    // 标题点击事件 从子组件传递过来
    handleTabsItemChange(e) {
        // 1 获取被点击的标题索引
        const { index } = e.detail;
        this.changeTitleIndex(index)
        // this.getOrders(index + 1)
    },

    /* 获取订单列表 */
    async getOrders(type) {
        const res = await request({ url: '/my/orders/all', data: { type } })
        this.setData({
            orders: res.orders.map(v => ({ ...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
        })
    },

    /* 根据标题索引来激活选中的 标题数组 */
    changeTitleIndex(index) {
        // 2 修改源数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        // 3 赋值到data中
        this.setData({
            tabs
        })
    },

    /* 
     options 只能存在于 onLoad  
     */
    onShow(options) {
        // 判断有没有token
        // const token = wx.getStorageSync('token')
        // if (!token) {
        //     wx.navigateTo({
        //         url: '/pages/auth/index'
        //     })
        //     return;
        // }
        // 1.获取小程序的页面 栈 -数组 长度最大 10页面  
        let pages = getCurrentPages()
        // 数组中 索引最大的就是当前页面
        let currentPage = pages[pages.length - 1]
        // 获取 url 的 type参数
        let { type } = currentPage.options
        // 激活选中页面标题
        this.changeTitleIndex(type - 1)
        // this.getOrders(type)
    }

})