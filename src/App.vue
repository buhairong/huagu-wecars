<!--
 * @Author: your name
 * @Date: 2021-11-01 20:05:38
 * @LastEditTime: 2022-01-22 17:05:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /butler-super/src/App.vue
-->
<script>
import { url, getRequest } from './util'

export default {
    onLaunch: function() {
        wx.getSystemInfo({
            success: (e) => {
								this.globalData.deviceInfo = e
                const custom = wx.getMenuButtonBoundingClientRect()
                this.globalData.custom = custom
            },
        });
    },
    onShow: function() {
        // console.log("App Show");
    },
    onHide: function() {
        // console.log("App Hide");
    },
    globalData: {
				showFirstPageAgreeMentPopup: true,
				// userInfo: userID userSig token phone
				imUserInfo: null,
				// 个人信息
				userProfile: null,
				isTUIKit: true,
				headerHeight: 0,
				statusBarHeight: 0,
				SDKAppID: null,
				
        openId: '',
        userInfo: null,
        route: '',
        getMemberInfo( mobile, imageUrl, name, cb, partnerId='', nickname='') {
					let data = {
							openId: this.openId,
							partnerId,
							appUserEntity: {}
					}
					if(mobile) {
							data.appUserEntity.mobile = mobile
					}
					if(imageUrl) {
							data.appUserEntity.imageUrl = imageUrl
					}
					if(name) {
							data.appUserEntity.name = name
					}
					if(nickname) {
							data.appUserEntity.nickname = nickname
					}
					
					getRequest(url.wechatLoginByOpenId, 'POST', data).then((result) => {
							if(result.code == '3403') {
									cb && cb(null); 
							} else {
									uni.setStorageSync('token', result.token);
									this.userInfo = result.data;
									cb && cb(result.data);
							}
							uni.hideLoading()
					})
        },
        getUserInfo(cb, partnerId="") {
            const self = this;
           // if(getApp().globalData.userInfo) {
           //     typeof cb == 'function' && cb(getApp().globalData.userInfo, partnerId)
           // } else {
                if(self.openId) {
                    self.getMemberInfo('','','', cb, partnerId);
                } else {
                    uni.login({
                        provider: 'weixin',
                        success(loginRes) {
														getRequest(url.getOpenId, 'POST', {
                                code: loginRes.code,
																partnerId
                            }).then((res) => {
																self.openId = res.data.openid
																self.getMemberInfo('','','',cb, partnerId, '')
                            })
                        }
                    })
                }
           // }
        }
    },
};
</script>

<style lang="scss">
@import "uview-ui/index.scss";
@import "./styles/common.scss";

.fiPage {
  .m-info-row {
    .u-row {
      line-height: 22px !important;
      padding: 4px 0 !important;
      .u-col {
        padding: 0px !important;
      }
    }
  }
  .m-ser-pop-title {
    margin: 5px;
    font-weight: 500;
    font-size: 17px;
    line-height: 24px;
    text-align: center;
    color: rgba(0, 0, 0, 0.9);
  }
  
  .u-mode-center-box scroll-view {
    height: auto;
  }
  .m-btn-row {
    .u-row {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      height: 56px !important;
      font-weight: 500;
      font-size: 17px;
      line-height: 24px;
      text-align: center;
    }
    .m-btn-col-left {
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      line-height: 48px;
      text-align: center;
      color: rgba(0, 0, 0, 0.9);
    }
    .m-btn-col-right {
      line-height: 48px;
      text-align: center;
      color: #576B95;
    }
  }
}

.color {
    color: #0A0F2D;
}
.color-red {
    color: #F5194B;
}
.color-base {
    color: #0AEB7D;
    font-weight: 500;
}
.color-rgba {
    color: rgba(10, 15, 45, 0.5);
}
/* 一些常用的css */
.line-through {
    text-decoration: line-through;
}
.fw {
    font-weight: 500;
}

/*每个页面公共css */

.content {
    padding: 0 32rpx;
    color: rgba(10, 15, 45, 0.8);
    font-size: 24rpx;
}
.price-base {
    font-size: 28rpx;
    line-height: 60rpx;
    color: #f5194b;
    text {
        font-size: 50rpx;
        font-weight: 500;
        font-family: DIN;
    }
}
.divider-x {
    position: relative;
    &:after {
        content: "";
        background: rgba(10, 15, 45, 0.04);
        border-radius: 1px;
        width: 1px;
        height: 20px;
        position: absolute;
        right: 0;
        top: 20rpx;
        z-index: 2;
    }
    &:last-child {
        &:after {
            display: none;
        }
    }
}
.btu {
    background: rgba(10, 15, 45, 0.3);
    border-radius: 8rpx;
    font-weight: 500;
    font-size: 34rpx;
    padding: 34rpx 0;
    text-align: center;
    color: #fff;
    margin-top: 32rpx;
}
.btu-active {
    background: #0A0F2D;
}

.icon-r {
    width: 24rpx;
    height: 32rpx;
    background: url('https://image.51cheyaoshi.com/xcx/app/static/icon4.png') no-repeat;
    background-size: 100%;
    vertical-align: middle;
    display: inline-block;
    margin-left: 12rpx;
}
.foot-sticky {
    position: fixed;
    bottom: 68rpx;
    left: 0;
    right: 0;
    z-index: 200;
}
.foot-but {
    background: #0A0F2D;
    border-radius: 16rpx;
    margin: 0 32rpx;
    padding: 30rpx 32rpx;
    margin-top: 70rpx;
    .foot-but-l {
        color: #fff;
        font-size: 24rpx;
        .price {
            font-size: 34rpx;
            font-weight: 500;
        }
    }
    .foot-but-r {
        color: #fff;
        font-size: 34rpx;
        font-weight: 500;
    }
}

.dsh-ellipsis {
    display: block;
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.u-checkbox__icon-wrap--checked {
    background: #0A0F2D!important;
    border-color: #0A0F2D!important;
}
.count-down ::v-deep view {
    color: #5F19F5 !important;
}
.search-brand-list .u-col {
    float: none;
    display: flex;
    flex-direction: column;
    align-items: normal !important;
    .letters {
        margin-left: 20rpx;
        color: rgba(10, 15, 45, 0.5);
        font-size: 24rpx;
    }
    .thumb-box {
        background: none !important;
        padding: 6rpx 14rpx !important;
        align-self: baseline;
        font-size: 30rpx !important;
        color: rgba(10, 15, 45, 0.8) !important;
    }
}
.more-section  .u-section__title {
    font-size: 34rpx !important;
}
.more-section .u-section__right-info {
    font-size: 24rpx !important;
}
.box-down-time .u-countdown-item {
    padding: 0 !important;
}
.tag-box .u-tag {
    font-size: 24rpx !important;
    border-radius: 8rpx !important;
}
.banner .u-indicator-item-round {
    height: 8rpx !important;
}

</style>
