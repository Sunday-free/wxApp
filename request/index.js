
// 同时发送异步代码的次数
let ajaxTimes = 0;
export const request = (pramas) => {
  // 判断 url 是否有 /my/ 请求的是私有的路径 带上 header token
  let header = { ...pramas.header }
  if (pramas.url.includes("/my/")) {
    //拼接header 带上 token
    header["Authorization"] = wx.getStorageSync('token')
  }
  ajaxTimes++
  // 显示加载效果
  wx.showLoading({
    title: '加载中',
    mask: true  //添加 mask 可以 防止用户操作页面
  })
  // 定义公共的url
  const baseUrl = 'https://api.zbztb.cn/api/public/v1'
  return new Promise((resolve, reject) => {
    wx.request({
      ...pramas,
      header,
      url: baseUrl + pramas.url,
      success: (result) => {
        resolve(result.data.message)
      },
      fail: (result) => {
        reject(result)
      },
      complete: () => {
        ajaxTimes--
        if (ajaxTimes === 0) {
          // 关闭等待图标
          wx.hideLoading()
        }
      }
    })
  })
}