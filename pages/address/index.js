import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/util.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    data: {
        address: {}
    },
    onShow() {
        const address = wx.getStorageSync("address");
        this.setData({ address });
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
})