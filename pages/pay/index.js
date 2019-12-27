
/* 
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据  checked=true 
2 微信支付
  1 哪些人 哪些帐号 可以实现微信支付
    1 企业帐号 
    2 企业帐号的小程序后台中 必须 给开发者 添加上白名单 
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限  
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token 。。。
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 
 */
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/util.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
    data: {
        address: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0
    },
    onShow() {
        // 1 获取缓存中的收货地址信息
        const address = wx.getStorageSync("address");

        //从页面栈获取 options
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        let options = currentPage.options
        let { id } = options

        let cart = []
        // 总价格 总数量
        let totalPrice = 0;
        let totalNum = 0;

        //  获取缓存中的购物车数据
        // 判断是从购物车还是点击立即购买 跳转的 
        if (id == 1) {
            // id = 1 是从 商品详情 跳转过来的
            cart = wx.getStorageSync("purchase") || [];
            totalPrice = cart[0].goods_price;
            totalNum = 1;
        } else if (id == 0) {
            // id = 0 是从购物车跳转过来的
            cart = wx.getStorageSync("cart") || [];
            // 过滤后的购物车数组
            cart = cart.filter(v => v.checked);
            cart.forEach(v => {
                totalPrice += v.num * v.goods_price;
                totalNum += v.num;
            })
        }
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        });
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
    // 点击 支付 
    async handleOrderPay() {
        try {
            const address = wx.getStorageSync('address')
            // 判断是否有收货地址
            if (!address.userName) {
                await showToast({ title: "没有选收货地址" })
                return;
            }
            // 1 判断缓存中有没有token 
            const token = wx.getStorageSync("token");
            // 2 判断
            if (!token) {
                wx.navigateTo({
                    url: '/pages/auth/index'
                });
                return;
            }
            // 3 创建订单
            // 3.1 准备 请求头参数
            // const header = { Authorization: token };
            // 3.2 准备 请求体参数
            const order_price = this.data.totalPrice;
            const consignee_addr = this.data.address.all;
            const cart = this.data.cart;
            let goods = [];
            cart.forEach(v => goods.push({
                goods_id: v.goods_id,
                goods_number: v.num,
                goods_price: v.goods_price
            }))
            const orderParams = { order_price, consignee_addr, goods };
            // 4 准备发送请求 创建订单 获取订单编号
            const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
            // 5 发起 预支付接口
            const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
            // 6 发起微信支付 
            await requestPayment(pay);
            // 7 查询后台 订单状态
            const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
            await showToast({ title: "支付成功" });
            // 8 手动删除缓存中 已经支付了的商品
            let newCart = wx.getStorageSync("cart");
            newCart = newCart.filter(v => !v.checked);
            wx.setStorageSync("cart", newCart);

            // 8 支付成功了 跳转到订单页面
            wx.navigateTo({
                url: '/pages/order/index'
            });

        } catch (error) {
            await showToast({ title: "支付失败" })
            console.log(error);
        }
    }
})



