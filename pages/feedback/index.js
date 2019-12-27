
/* 
    1.点击 "+" 按钮 触发
        调用小程序内置 选择图片 api 
        获取 到 图片路径 的数组 存到 data中 循环发给 子组件  
    2.点击 自定义 图片 组件 删除  
        获取被点击 的 索引 --> 获取图片数组-->根据索引删除对应元素-->重新设置会data
    3.点击 "提交"
        获取文本域内容  
            1.data中定义遍历 表示 输入框的内容
            2.文本域 绑定 输入事件 触发 把输入的内容 保存到变量
        验证 内容 合法性  
        验证通过 把用户选择的图片 上传到专门的图片服务器  返回外网的连接
            遍历 逐个上传 
            新建图片数组 存放 外网链接
        文本域 和 外网的图片路径 一起提交到服务器
        清空当前页面  返回上一页
 */

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { showToast } from '../../utils/util.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [
            {
                id: 0,
                value: "体验问题",
                isActive: true
            },
            {
                id: 1,
                value: "商品、商家投诉",
                isActive: false
            }
        ],
        // 存放被选中图片的路径 数组
        chooseImgs: [],
        // 文本域的内容
        textVal: ""
    },

    // 外网图片路径数组
    UpLoadImgs: [],

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
    /* 点击 + 选择图片 */
    handleChooseImg() {
        // 调用小程序内置的 选择图片 api
        wx.chooseImage({
            count: 9,	// 默认为9 同时选中的图片最大数量
            sizeType: ['original', 'compressed'],	// 指定原图或者压缩图
            sourceType: ['album', 'camera'],	// 指定图片来源 相册 或者 照相机
            success: (result) => {
                this.setData({
                    chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
                })
            }
        })
    },
    /* 点击自定义组件 删除图片 */
    handleRemoveImg(e) {
        // 获取索引
        const { index } = e.currentTarget.dataset
        // 获取data中图片 数组
        let { chooseImgs } = this.data
        // 删除元素
        chooseImgs.splice(index, 1)
        this.setData({ chooseImgs })
    },
    /* 文本域的输入事件 */
    handleTextInput(e) {
        this.setData({
            textVal: e.detail.value
        })
    },
    /* 点击按钮提交 */
    handleFormSubmit() {
        // 获取文本域内容 图片数组
        const { textVal, chooseImgs } = this.data
        // 合法性验证
        if (!textVal.trim()) {
            //不合法
            showToast({ title: "输入不合法" })
            return;
        }
        // 显示正在等待的图标
        wx.showLoading({
            title: "正在上传中",
            icon: "none",
            mask: true,
        })
        // 判断是否有需要 上传的数组
        if (chooseImgs.length != 0) {
            // 上传图片 到 专门的图片服务器
            //  微信 的 上传文件 的api不支持 多文件 上传 ---> 遍历数组 一个一个上传 
            chooseImgs.forEach((v, i) => {
                wx.uploadFile({
                    url: 'https://images.ac.cn/Home/Index/UploadAction/',   //图片上传的地址  新浪图床
                    filePath: v,   //被上传的文件路径
                    name: 'file',   //上传文件的名称 后台用于获取该文件
                    formData: {},   //顺带的文本信息
                    success: (result) => {
                        let url = JSON.parse(result.data).url
                        this.UpLoadImgs.push(url)

                        // 所有图片上传完毕蔡触发
                        if (i === chooseImgs.length - 1) {
                            /* 关闭弹窗 */
                            wx.hideLoading()
                            // 把文本内容和外网图片路径提交到后台
                            // 重置页面
                            this.setData({
                                textVal: "",
                                chooseImgs: []
                            })
                            // 返回上一个页面
                            wx.navigateBack({
                                delta: 1, // 回退前 delta(默认为1) 页面
                            })
                        }
                    }
                })
            })
        } else {
            console.log("提交文本");
            /* 关闭弹窗 */
            wx.hideLoading()
            // 把文本内容和外网图片路径提交到后台
            // 重置页面
            this.setData({
                textVal: "",
                chooseImgs: []
            })
            // 返回上一个页面
            wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
            })
        }
    }
})