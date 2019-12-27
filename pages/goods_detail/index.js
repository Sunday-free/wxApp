import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { showToast } from "../../utils/util.js";

/* 
1.轮播图 大图预览功能 绑定点击事件
2.点击加入购物车 绑定点击事件 获取缓存中的购物车数据格式 
  先判断 当前 商品 是否存在购物车 如果存在了 修改数据 ++ 填充回缓存
  不存在 直接在购物车数据 添加 新元素   填充回缓存
  弹出提示
3.商品收藏
    1.当页面onShow的时候 加载缓存中 商品收藏的数据
    2.判断是否被收藏 再点击 删除/添加收藏  都要存入缓存中
*/

Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        isCollect: false  //商品是否被收藏
    },
    // 商品对象
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        //从页面栈获取 options
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        let options = currentPage.options

        const { goods_id } = options
        this.getGoodsDetail(goods_id)
    },

    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
        // 存下goods_id 放在 缓存中 做 浏览足迹
        let track = wx.getStorageSync('track') || []
        // // 先判断 足迹 是否已经有了该商品 
        let index = track.findIndex(v => v.goods_id === goodsObj.goods_id)
        if (index !== -1) {
            // 有则 把他 先删了
            track.splice(index, 1)
        }
        //  追加到数组最前面
        track.unshift(goodsObj)
        // 保存到 缓存
        wx.setStorageSync('track', track)

        this.GoodsInfo = goodsObj
        // 获取缓存中 商品 收藏的数组
        let collect = wx.getStorageSync('collect') || []
        // 判断是否被收藏
        let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)

        this.setData({
            goodsObj: {
                goods_name: goodsObj.goods_name,
                goods_price: goodsObj.goods_price,
                // iphone 手机 不识别 .webp图片格式
                // 自己改后缀 .webp-->.jpg 但是要确保 后台要有 .jps 图片格式 
                goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: goodsObj.pics
            },
            isCollect
        })
    },

    /* 点击轮播图 放大预览 */
    handlePrevewImage(e) {
        // 构造 urls 
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
            current,
            urls
        })
    },

    /* 点击加入购物车  */
    handleCartAdd(e) {
        // 1.获取缓存中的 购物车 数组 
        let cart = wx.getStorageSync('cart') || []
        // 2.判断商品对象是否存在 购物车 数组 
        let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
        if (index === -1) {
            // 3.不存在 或者是 第一次添加
            this.GoodsInfo.num = 1
            this.GoodsInfo.checked = true
            cart.push(this.GoodsInfo)
        } else {
            // 4.给已经存在的 财务处 数据 执行 num++
            cart[index].num++
        }
        // 5.把购物车数组 填充 会 缓存
        wx.setStorageSync('cart', cart)
        // 6.弹窗 提示 
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            mask: true  //掩膜 
        })
    },
    /* 点击商品收藏 */
    handleCollect() {
        let isCollect = false
        // 从缓存中获取收藏数组
        let collect = wx.getStorageSync('collect') || []
        // 判断当前商品对象id 是否存在 collect中
        let index = collect.findIndex(v => v.goods_id == this.GoodsInfo.goods_id)
        console.log(index);
        if (index !== -1) {
            //如果存在 点击之后 就要取消收藏
            collect.splice(index, 1)
            isCollect = false
            showToast({ title: "取消收藏" })
        } else {
            //如果不存在 点击之后 就要收藏
            collect.push(this.GoodsInfo)
            isCollect = true
            showToast({ title: "收藏成功" })
        }
        // 保存到data和缓存
        this.setData({ isCollect })
        wx.setStorageSync('collect', collect)
    },
    /* 点击立即购买 */
    async handlePay() {
        // 先把 该商品数据保存到 缓存中 然后再 跳转
        wx.setStorageSync('purchase', [this.GoodsInfo])
        // 跳转到支付页面
        wx.navigateTo({
            url: '/pages/pay/index?id=1'
        })
    }
})