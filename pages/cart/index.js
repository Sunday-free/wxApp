/* 
1.获取用户收货地址
    1.绑定事件
    2.调用小程序内置的API 获取用户的收货地址  wx.chooseAddress
    3.获取用户 对小程序 所授予的 获取收货地址权限 状态 scope 
        1.假设 用户 点击获取收货地址的提示框 确定  authSetting
            scope : true 
        2.假设用户前几获取收货地址的提示框 取消
            scope : false
            1.诱导用户 wx.openSetting 自己 打开 授权设置页面 当用户重新基于 收货地址权限的时候
            2.获取收货地址
        3.假设用户 从来 没有调用过 收货地址的 api 
            scope : undefined
    4.把获取到的地址存放到缓存
2.购物车   获取缓存的购物车数据  onShow
3.全选功能的实现  数据展示  onShow 
4.总价格和总数量 都需要 商品被选中的时候 才会 被计算
5.商品的选中功能  绑定 change 事件 取反 查询 填充回 data(setData) 和缓存 中 
6.全选和反选 全选复选框 change事件 allChecked 取反 遍历购物车数组 商品选中与 allChecked相同 重新设置会data和缓存
7.商品数量编辑 - + 按钮 绑定同一个点击事件 通过 一个自定义属性值 区分 - +  还有传递商品id
8.商品结算功能
*/

import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/util.js";
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        allChecked: false,
        totalPrice: 0,
        totalNum: 0
    },

    /* 小程序显示的时候 */
    onShow() {
        // 获取缓存的收货地址信息
        const address = wx.getStorageSync('address')
        // 获取购物车数据
        const cart = wx.getStorageSync('cart') || []
        this.setData({
            address
        })
        this.setCart(cart)
    },
    /* 点击 收货地址  */
    async handleChooseAddress() {
        try {
            // 1.获取权限状态
            const res1 = await getSetting()
            const scopeAddress = res1.authSetting["scope.address"]
            // 2.判断 权限状态
            if (scopeAddress === false) {
                // 3.先让用户打开 获取权限
                await openSetting()
            }
            // 4.调用获取收获地址的 api
            const address = await chooseAddress()
            // 5.存到缓存
            wx.setStorageSync('address', address)

        } catch (error) {
            console.log(error);
        }
    },
    /* 商品的选中功能 */
    handleItemChange(e) {
        //获取被修改商品的id
        const goods_id = e.currentTarget.dataset.id
        let { cart } = this.data
        let index = cart.findIndex(v => v.goods_id === goods_id)
        cart[index].checked = !cart[index].checked
        // 重新设置data和缓存数据
        this.setCart(cart)
    },
    /* 设置购物车状态 重新计算 底部 全选 总价 总数 */
    setCart(cart) {
        // 计算全选
        // 如果是一个空数组 调用了 every 方法 返回值 就是 true
        // const allChecked = cart.length ? cart.every(v => v.checked) : false
        // 计算总价格 和 总数量
        let allChecked = true
        let totalPrice = 0
        let totalNum = 0
        cart.forEach(v => {
            if (v.checked) {
                totalPrice += v.num * v.goods_price
                totalNum += v.num
            } else {
                allChecked = false
            }
        })
        // 判断是否为空
        allChecked = cart.length ? allChecked : false
        this.setData({
            cart,
            allChecked,
            totalPrice,
            totalNum
        })
        wx.setStorageSync('cart', cart)
    },
    /* 商品全选功能 */
    handleItemAllCheck() {
        //获取data数据 
        let { cart, allChecked } = this.data
        // 修改
        allChecked = !allChecked
        // 循环 修改商品 数据
        cart.forEach(v => v.checked = allChecked)
        // 保存
        this.setCart(cart)
    },
    /* 数量编辑 */
    async handleItemNumEdit(e) {
        // 获取参数 id  operation
        const { operation, id } = e.currentTarget.dataset
        let { cart } = this.data
        const index = cart.findIndex(v => v.goods_id === id)
        if (cart[index].num === 1 && operation === -1) {
            // 4.1 弹窗提示
            const res = await showModal({ content: "您是否要删除？" });
            if (res.confirm) {
                cart.splice(index, 1);
                this.setCart(cart);
            }
        } else {
            // 4  进行修改数量
            cart[index].num += operation;
            // 5 设置回缓存和data中
            this.setCart(cart);
        }
    },
    /* 点击结算 */
    async handlePay() {

        const { address, totalNum } = this.data
        // 判断是否有收货地址
        if (!address.userName) {
            await showToast({ title: "没有选收货地址" })
            return;
        }
        // 判断是否勾选商品
        if (totalNum === 0) {
            await showToast({ title: "您没有选购商品" })
            return;
        }
        // 跳转到支付页面
        wx.navigateTo({
            url: '/pages/pay/index?id=0'
        })
    }
})