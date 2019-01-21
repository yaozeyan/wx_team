//app.js
App({
	onShow : function(){
		const updateManager = wx.getUpdateManager();
		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success: function (res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})
	},
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
		click : true,
    // openid:openid,
    httpUrl: "http://192.168.2.5:8888/SY_WMSJ/reg_user/"
    // httpUrl: "https://wmsjzqsyxcx.wxgamemini.com/reg_user/"
  },
	ajax: function (url, data, fun,fun2) {
		var that = this;
		if (that.globalData.click)
			that.globalData.click = false,
				wx.showLoading({
					title: '加载中...',
				})
				wx.request({
					url: this.globalData.httpUrl + url,
					data: data,
					header: {
						'content-type': 'application/json'
					},
					success: function (res) {
						wx.hideLoading();
						that.globalData.click = true;
            // console.log(res.data.status)
						if (res.data.status == 1) {
							wx.showModal({
								title: '提示',
								content: res.data.msg,
								showCancel: false
							});
            } else if (res.data.status == 2){
              fun2();
            }else {
							fun(res.data.msg);
						}
					},
          fail:function(){
            wx.showModal({
              title: '提示',
              content: "数据请求失败，请检查网络连接",
              showCancel: false,
            })
          }
				})
	},
	wxlogin: function (team,fun,fun2) {
		var that = this;
		wx.login({
			success: res => {
        that.ajax('getOpenId', { "code": res.code, "team": team}, function (data) {
					fun(data);
        },fun2);
			}
		})
	},
  getFontIndex : function(list,openid){
    for(var key in list){
      if (list[key].openid == openid){
        return (Number(key)+1);
      }
    }
    return 1;
  }
})

/*"disableScroll": true*/