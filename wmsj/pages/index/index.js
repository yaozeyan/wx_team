//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    page: "model1",
    hasUserInfo: false,
    iphonex: "",
    ruleClose: false, //规则弹窗变量
    man: false, //队伍满员变量
    kon: true, //成为队长按钮变量
    teamlist: null, //主态的list
    mylist: null, //自己的list
    list: null, //list
    openId: "", //用户openid
    count: 0, //队伍人数
    countmy : 0,
    team: null, //队伍信息
    num: 0,
    imgIndex: 0, //动图角标
    nickName: "", // 用户昵称
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    shareTempFilePath: "",
    canvasBg: "../image/bac.png",
    ewm: "../image/ewm.png",
    teamSuccess: "../image/team-success.png",
    userPic1: "", //用户头像路劲
    userPic2: "",
    userPic3: "",
    userPic4: "",
    userPic5: "",
    userPic6: "",
    canvasPicMan: false, //绘图头像是否满员
    height: "", //屏幕高度变量
    audio: true, //音频开关
    state: false, //是否预约
    sessionKey: "", //用户sessionKey
    end: false, //活动结束变量
    formId: "", // 用户form表单id  通知用户使用
    headUrls: [],
    fontIndex : null,//诗句的索引
    fontIndexClass : "s"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  changeFontIndex : function(e){
    var index = e.target.dataset.index;
    var src = e.target.dataset.src;
    var that = this;
    if (src != "" && (index+1) != that.data.fontIndex){
      that.setData({
        fontIndex: null,
        fontIndexClass: ""
      })
      setTimeout(function(){
        that.setData({
          fontIndex: index+1,
          fontIndexClass : "s"
        })
      },200);
    }
  },
  onHide:function(){
    // wx.pauseBackgroundAudio()
    wx.stopBackgroundAudio()
},
  onLoad: function(options) {
    //console.log(options)
    var that = this;
    if(options.nickName){
      var src = options.nickName;
      // console.log(str)
      if (src.length > 3) {
        src = src.substring(0, 3)+"...";
        that.setData({
          nickName: src
        })
      } else {
        that.setData({
          nickName: src
        })
      }
    }
   var res = wx.getSystemInfoSync();
    that.setData({
      height: res.screenHeight + "px",
    })
    wx.getSystemInfo({
      success: function(res) {
        var name = 'iPhone X'
        if (res.model.indexOf(name) > -1) {
          that.setData({
            iphonex: 'iphonex'
          });
          //console.log("是X");
        } else {
          //console.log("不是X");
        }
      }
    });

    // 背景音乐
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    // player()
    function player(){
      backgroundAudioManager.title = '完美世界赏月小程序'
      backgroundAudioManager.epname = '完美世界赏月小程序'
      backgroundAudioManager.singer = '完美世界赏月小程序'
      backgroundAudioManager.coverImgUrl = 'https://game.gtimg.cn/images/wmsj/cp/a20180918wmsjsy/share.jpg'
      backgroundAudioManager.src = 'https://game.gtimg.cn/images/wmsj/cp/a20180918wmsjsy/1.mp3' // 设置了 src 之后会自动播放*/
      backgroundAudioManager.startTime = 10
      backgroundAudioManager.onEnded(() => {
        player()
      })
    }
   

    /* play */
    app.wxlogin(options.team, function(data) {
      //console.log(data);
      // var str = that.data.userInfo.nickName;
      // // console.log(str)
      // if (str.length > 3) {
      //   str = str.substring(0, 3);
      //   that.setData({
      //     nickName: str
      //   })
      // }else {
      //   that.setData({
      //     nickName: str
      //   })
      // }
      that.setData({
        mylist: data.listmy,
        countmy : data.countmy
      })
      //客态  
       if (options.team) {
        //判断是否满员
        if (data.count == 6) {
          that.setData({
            man: true,
            kon: false
          })
        }
        that.setData({
          teamlist: data.list,
          mylist: data.listmy,
          list: data.list,
          openId: data.openid,
          page: "model3",
          team: options.team,
          num: data.teamCount,
          state: data.state,
          count: data.count,
          sessionKey: data.sessionKey,
          fontIndex: app.getFontIndex(data.list, options.team),
          nickName: src
          // count:data.count
        })
        //客态
        if (data.team != null) {
          if (data.team != options.team) {
            //你已经有队伍了
            wx.showModal({
              title: '提示',
              content: "你已经有队伍了",
              showCancel:false,
              success: function(res) {
                if (res.confirm) {
                  that.setData({
                    teamlist: data.listmy,
                    mylist: data.listmy,
                    list: data.list,
                    openId: data.openid,
                    page: "model1",
                    team: data.team,
                    count: data.countmy,
                    fontIndex: app.getFontIndex(data.listmy, data.openid),
                    nickName: src
                  });
                  if (data.countmy == 6) {
                    that.setData({
                      man: false,
                      kon: false,
                      page: "model2",
                    })
                  }
                }
              }
            });
          } else {
            if (data.countmy == 6) {
              that.setData({
                page: "model2",
                man: false,
                kon: false
              })
            } else {
              that.setData({
                page: "model1"
              })
            }
            that.setData({
              teamlist: data.listmy,
              mylist: data.listmy,
              list: data.list,
              openId: data.openid,
              count: data.countmy,
              team: data.team,
              num: data.teamCount,
              fontIndex: app.getFontIndex(data.listmy, data.openid),
              nickName: src
            })
          }
        }
      } else {
        //主态
        if (data.countmy == 6) {
          that.setData({
            page: "model2",
          })
        }
        that.setData({
          teamlist: data.listmy,
          mylist: data.listmy,
          list: data.list,
          openId: data.openid,
          count: data.countmy,
          team: data.team,
          num: data.teamCount,
          sessionKey: data.sessionKey,
          state: data.state,
          fontIndex: app.getFontIndex(data.list, data.openid)
        })
      }
    }, function() {
      that.setData({
        end: true
      });
    });
    /* stop */
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        var str = app.globalData.userInfo.nickName;
        // console.log(str)
        if (str.length > 3) {
          str = str.substring(0, 3);
          that.setData({
            nickName: str
          })
        } else {
          that.setData({
            nickName: str
          })
        }
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo != null) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },
  ruleClose: function() {
    this.setData({
      ruleClose: false,
    })
  },
  ruleOpen: function() {
    this.setData({
      ruleClose: true
    })
  },
  open_win: function(event) {
    this.setData({
      page: event.target.dataset['win']
    });
  },
  createTeam: function() {
    var that = this;
    var sessionKey = "";
    if (!that.data.state) {
      sessionKey = that.data.sessionKey;
    }
    app.ajax('createTeam', {
      "openid": that.data.openId,
      "pic": that.data.userInfo.avatarUrl,
      "session_key": sessionKey,
      "formId": that.data.formId
    }, function(data) {
      that.setData({
        teamlist: data.list,
        team: data.team,
        count: data.count
      });
    });
  },
  getHeadUrls: function(list, call) {
    var that = this;
    that.data.headUrls = [];

    var j = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].pic != '')
        j++;
      wx.getImageInfo({
        src: list[i].pic == '' ? 'null' : list[i].pic,
        complete: (res) => {
          if (!!res.path) {
            var headUrls = that.data.headUrls;
            headUrls[headUrls.length] = res.path;
            that.setData({
              headUrls: headUrls
            });
          }
          if (that.data.headUrls.length >= j)
            call();
        },
      })
    }
  },
  onShareAppMessage: function(res) {
    var that = this;
    if (that.data.team == null) {
      that.setData({
        team: that.data.openId,
      });
    }
    return {
      title: '组队赏月得绝版称号“天外飞仙”！',
      path: '/pages/index/index?team=' + that.data.team + '&nickName=' + app.globalData.userInfo.nickName,
      imageUrl: 'https://game.gtimg.cn/images/wmsj/cp/a20180918wmsjsy/share.jpg',
      query: '',
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    }
  },
  addTeam: function() {
    var that = this;
    var sessionKey = "";
    if (!that.data.state) {
      sessionKey = that.data.sessionKey;
    }
    // console.log("addTeam");
    app.ajax("addTeam", {
      "openid": that.data.openId,
      "pic": that.data.userInfo.avatarUrl,
      "team": that.data.team,
      "session_key": sessionKey,
      "formId": that.data.formId
    }, function(data) {
      console.log(data)
      if (data.teamCount) {
        that.setData({
          num: data.teamCount
        })
      }
      if (data.count == 6) {
        that.setData({
          page: "model2",
        })
      } else {
        that.setData({
          page: "model1",
        })
      }
      that.setData({
        teamlist: data.list,
        count: data.count
      })
    })
  },
  creatTeam: function() {
    var that = this;
    that.setData({
      page: "model1",
      teamlist: that.data.mylist,
      team: that.data.openId,
      count: that.data.countmy
    })
  },
  shareCanvas: function(fun) {
    var that = this;
    var res = wx.getSystemInfoSync();
    var px_rpx = 750 / res.screenWidth;
    const ctxA = wx.createCanvasContext("share");
    var bgW = 750 / px_rpx;
    var bgH = 1125 / px_rpx;
    var p1W = 30 / px_rpx;
    var p2W = 153 / px_rpx;
    var p3W = 274 / px_rpx;
    var p4W = 395 / px_rpx;
    var p5W = 517 / px_rpx;
    var p6W = 639 / px_rpx;
    // var p6W = 34 / px_rpx;
    var p1h = 972 / px_rpx;
    var tl = 373 / px_rpx;
    var tt = 944 / px_rpx;
    var tl1 = 383 / px_rpx;
    var tt1 = 1100 / px_rpx;
    var ewmW = 258 / px_rpx;
    var ewmh = 258 / px_rpx;
    var ewmt = 640 / px_rpx;
    var ewml = 254 / px_rpx;

    var avatarurl_width = 80 / px_rpx; 
    //绘制的头像宽度
    var avatarurl_heigth = 80 / px_rpx; 
    //绘制的头像高度
    var suc_w = 122 / px_rpx; 
    //绘制成功宽度
    var suc_h = 71 / px_rpx; 
    //绘制成功高度
    var sucW = 316 / px_rpx; 
    //绘制成功宽度
    var sucH = 972 / px_rpx; 
    //绘制成功高度
    // console.log("dsadsa",this.data.userPic1);

    for (var i in that.data.mylist) {
      // console.log("userPic1",that.data.mylist[i].pic)
      var pic = that.data.mylist[i].pic;
      if (pic == "") pic = "../image/a.jpg";
      var left = p1W;
      if (i == 0) left = p1W;
      if (i == 1) left = p2W;
      if (i == 2) left = p3W;
      if (i == 3) left = p4W;
      if (i == 4) left = p5W;
      if (i == 5) left = p6W;
      console.log(this.data.headUrls.length);
      if (this.data.headUrls.length > i) {
        ctxA.drawImage(this.data.headUrls[i], left, p1h, avatarurl_width, avatarurl_heigth);
      }
    }
    ctxA.drawImage(this.data.canvasBg, 0, 0, bgW, bgH);
    // ctxA.drawImage(this.data.ewm, ewml, ewmt, ewmW, ewmh);
    // console.log(that.data.mylist[5].pic);

    //  绘制文字
    ctxA.setFillStyle("#c2cce1")
    ctxA.setTextAlign('center')
    ctxA.setFontSize(12) //设置字体大小，默认10
      var str = this.data.userInfo.nickName;
      if (str.length > 3) {
        str = str.substring(0, 4);
      }
    ctxA.fillText(str + "...的赏月邀约，扫一扫前往", tl, tt);
    ctxA.fillText("万流城已聚集" + this.data.num + "支队伍，已获得绝版称号“天外飞仙”", tl1, tt1);
    if (that.data.mylist[5].pic != "") {
      ctxA.drawImage(this.data.teamSuccess, sucW, sucH, suc_w, suc_h);
    }
    ctxA.draw();
    setTimeout(function() {
      fun();
    }, 1000);
  },
  dialog: function() {
    var that = this;
    if (that.data.team == null) {
      that.setData({
        team: that.data.openId,
      });
    }
    var sessionKey = "";
    if (!that.data.state) {
      // console.log("-------------------------" + that.data.sessionKey);
      sessionKey = that.data.sessionKey;
    }

    // console.log(sessionKey);
    app.ajax('createTeam', {
      "openid": that.data.openId,
      "pic": that.data.userInfo.avatarUrl,
      "session_key": sessionKey,
      "formId": that.data.formId
    }, function(data) {
      wx.showLoading({
        title: '加载中...',
      });
      that.setData({
        teamlist: data.list,
        mylist: data.list,
        team: data.team,
        count: data.count
      });
      that.getHeadUrls(that.data.mylist, (res) => {
        that.shareCanvas(function() {
          wx.canvasToTempFilePath({
            canvasId: 'share',
            success: (res) => {
              //console.log(res.tempFilePath)
              that.setData({
                shareTempFilePath: res.tempFilePath
              })
              // console.log(this.data.shareTempFilePath)
            }
          });
          setTimeout(function() {
            that.draw();
          }, 2000);
        });
      });
    });


  },
  draw: function() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareTempFilePath,
      success: (res) => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '图片已保存至相册，发送朋友圈邀请好友组队！',
          showCancel: false
        });
      },
      fail: (err) => {
        wx.hideLoading();
        console.log(err)
        if (err.errMsg ==="saveImageToPhotosAlbum:fail auth deny"){
          console.log("再次发送请求")
          wx.openSetting({
            success(res){
              console.log(res)
            }
          })
        }
        wx.showModal({
          title: '提示',
          content: '您点击了拒绝授权，将无法正常使用体验。请10分钟后再次点击授权，或者删除小程序重新进入。',
          showCancel: false
        })
      }
    })
  },
  // //循环播放头图
  img: function() {
    var that = this
    var max = 11;
    var width = 750;
    var index = 1;

    setInterval(function() {
      if (index >= max) {
        index = -1;
      }
      index++;
      var left = index * 750;
      // console.log(that.data.imgIndex);
      that.setData({
        imgIndex: -left + "rpx"
      });
    }, 2000/12);
  },
  audioFlage: function() {
    if (this.data.audio) {
      wx.pauseBackgroundAudio()
      this.setData({
        audio: false
      })
    } else {
      wx.playBackgroundAudio()
      this.setData({
        audio: true
      })
    }
  },
  submit: function(e) {
    var that = this;
    console.log(e.target.dataset.type)
    this.setData({
      formId: e.detail.formId
    });
    var typeStr = e.target.dataset.type;
    if (typeStr == "share") {
      that.createTeam();
    } else if (typeStr == "dialog") {
      that.dialog();
    } else if (typeStr == "ok") {
      that.addTeam();
    }
  },
})