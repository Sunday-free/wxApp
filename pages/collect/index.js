
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
                value: "商品收藏",
                isActive: true
            },
            {
                id: 1,
                value: "品牌收藏",
                isActive: false
            },
            {
                id: 2,
                value: "店铺收藏",
                isActive: false
            }
        ],
        collect: []
    },

    onShow() {
        const collect = wx.getStorageSync('collect') || []
        this.setData({ collect })
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


})