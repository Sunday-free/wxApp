import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from '../../utils/util.js'
Page({

    /* 获取用户信息 */
    async handleGetUserInfo(e) {
        try {
            // 获取用户信息
            const { encryptedData, rawData, iv, signature } = e.detail
            // 获取小程序登陆成功之后的code
            const { code } = await login()
            const loginParams = { encryptedData, rawData, iv, signature, code }
            // 发送请求获取用户的token值
            const { token } = await request({ url: '/users/wxlogin', data: loginParams, method: 'post' })
            // 把token 存储到 缓存中 跳转到上一个页面
            wx.setStorageSync('token', token)
            wx.navigateBack({ delta: 1 })
        } catch (error) {
            console.log(error);
        }
    }
})