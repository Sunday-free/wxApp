
/* 1.输入框 input事件
        获取输入框的值 合法性判断 打印到页面
    2.防抖 (防止抖动)  定时器  节流
        1.定义一个 全局的定时器id
        2.防抖 一般是 输入框 防止重复数去 重复发送请求
        3.节流 一般是 用于页面下拉和上拉
    3.页面重置 
 */

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
    data: {
        goods: [],
        // 显示 取消按钮
        isFocus: false,
        // 输入框的值
        inputValue: ''
    },

    /* 定时器 */
    TimeId: -1,

    /* 输入框的值改变则触发 */
    handleInput(e) {
        // 获取输入框的值
        const { value } = e.detail
        // 合法性验证 判断是否为 空字符串
        if (!value.trim()) {
            // 值不合法
            this.setData({
                goods: [],
                isFocus: false
            })
            return;
        }
        // 显示 取消 按钮
        this.setData({ isFocus: true })
        // 准备发送请求获取数据
        clearTimeout(this.TimeId)
        this.TimeId = setTimeout(() => {
            this.querySearch(value)
        }, 300);
    },

    /* 发送请求获取数据 */
    async querySearch(query) {
        const res = await request({ url: "/goods/qsearch", data: { query } })
        this.setData({
            goods: res
        })
    },
    /* 点击取消按钮 */
    handleCancel() {
        this.setData({
            inputValue: "",
            isFocus: false,
            goods: []
        })
    }
})