<!--
 * @Author: lufeng
 * @Date: 2021-11-01 17:52:29
 * @LastEditTime: 2022-01-09 21:52:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /butler-super/src/pages/index/index.vue
-->
<template>
    <view class="sign">
        <view class="sign-logo">
            <u-image
                width="360rpx"
                height="120rpx"
                src="https://image.51cheyaoshi.com/xcx/app/static/logo.png"
            />
        </view>
        <view class="slogan">
            让有车生活·更简单
        </view>
        <view class="btu-wx">
            <u-button
								v-if="isAgree"
                :ripple="true"
                type="primary"
                open-type="getPhoneNumber"
                @getphonenumber="handleLogin"
            >
                <!-- <u-image
                    width="56rpx"
                    mode="aspectFit"
                    height="70rpx"
                    class="wx-icon"
                    src="https://image.51cheyaoshi.com/xcx/app/static/wx_icon.png"
                >
                    <u-loading slot="loading" />
                </u-image> -->
                手机号快捷登录
            </u-button>
						
						<view v-else class="btn" @click="handlerTip">
							<!-- <u-image
							    width="56rpx"
							    mode="aspectFit"
							    height="70rpx"
							    class="wx-icon"
							    src="https://image.51cheyaoshi.com/xcx/app/static/wx_icon.png"
							>
							    <u-loading slot="loading" />
							</u-image> -->
							手机号快捷登录
						</view>
        </view>
				
        <view class="operator">
        	<u-checkbox-group>
        		<u-checkbox 
        			v-model="isAgree" 
        			name="1"
        			shape="circle"
        		>
        			已阅读、并自愿同意
							<text style="font-weight:500;color:#3D3D3D;" @click.stop="goAgreeMentPage">
								《WECARS隐私政策》
							</text>
        		</u-checkbox>
        	</u-checkbox-group>
        </view>
				
				<AgreeMentPopup :show.sync="showFirstPageAgreeMentPopup" @agree="handleAgree"/>
				
				<u-popup border-radius="14" mode="center" v-model="showCouponPopup" @close="close">
					<view class="popup-wrap">
						<view class="item">
							<view class="label">兑换码</view>
							<view class="content">{{couponParams.code}}</view>
						</view>
						
						<view v-if="userInfo.riskAuditStatus != 5">
							<view class="item">
								<view class="label">姓名</view>
								<view class="content">
									<u-input
										v-model="couponParams.name"
										placeholder="请输入姓名"
									/>
								</view>
							</view>
							
							<view class="item">
								<view class="label">手机号</view>
								<view class="content">
									<u-input
										v-model="couponParams.mobile"
										placeholder="请输入手机号"
										type="number"
									/>
								</view>
							</view>
						</view>
						
						
						<view class="btn-wrap">
							<view class="btn" @click="handleComfirm">
								立即领取
							</view>
						</view>
					</view>
				</u-popup>
				
				<u-popup border-radius="14" mode="center" v-model="showInviteStaffPopup" @close="closeInviteStaffPopup">
					<view class="popup-wrap">
						<view class="company">
							您已加入了 {{inviteCompany.userCompanyEntity.companyName}}
						</view>
						
						<view class="btn-wrap">
							<view class="btn" @click="handleComfirmInviteStaffPopup">
								确定
							</view>
						</view>
					</view>
				</u-popup>
    </view> 
</template>

<script>
import AgreeMentPopup from '@/pages/agreement/components/AgreeMentPopup.vue'

export default {
    name: "SignLogin",
		components: {
			AgreeMentPopup,
		},
    data() {
        return {
			isAgree: '',
            title: "login",
            form: {
                name: "",
            },
            openId: '',
            session_key: '',
			partnerId: '',
			redirectUrl: '',
			showFirstPageAgreeMentPopup: false,
			sceneParams: {
				type: '', // 1.个人分享小程序  2 企业分享小程序  3.企业邀请员工  
				userId: '',
				companyId: '',
			},
			isHaveMobile: true,
			couponParams: {
				userId: '',
				exchangeUserId: '',
				code: '',
				name: '',
				mobile: '',
			},
			userInfo: {},
			showCouponPopup: false,
			showInviteStaffPopup: false,
			inviteCompany: {
				userCompanyEntity: {
					companyNam: '',
				}
			},
        };
    },
    onLoad(option) {
		//option.scene = '3&1099&20'
		// type=couponCode&userId=1135&couponCode=9ii9SwkC
		
		if(option.scene){
			const scene = decodeURIComponent(option.scene)
			const sceneParams = scene.split("&")
			this.sceneParams.type = sceneParams[0]
			this.sceneParams.userId = sceneParams[1]
			this.sceneParams.companyId = sceneParams[2] || ''
		}
		
		if(option.type == 'couponCode') {
			this.couponParams = {
				userId: option.userId,
				code: option.couponCode
			}
		}
		
		
			this.partnerId = option.partnerId || ''
			this.redirectUrl = option.redirectUrl || ''
			wx.getPrivacySetting({
				success: async res => {
					// 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
					console.log('getPrivacySetting', res) 
					if (res.needAuthorization) {
						// 需要弹出隐私协议
						this.showFirstPageAgreeMentPopup = true
					} else {
						// 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
						
						  uni.login({
						      provider: 'weixin',
						      onlyAuthorize: true,
						      success: (loginRes) => {
						          this.$getRequest(this.$url.getOpenId, 'POST', {
						              code: loginRes.code,
						          }).then( async (res) => {
						              this.openId = res.data.openid
						              this.session_key = res.data.session_key
									  this.isHaveMobile = res.data.isHaveMobile
													
													// this.openId = 'oMHQK5VTaP68ByhJbDLamnGwUzxM'
						          })
						      }
						  })
						
						  getApp().globalData.getUserInfo((data) => {
						      this.userInfo = data;
						  }, this.partnerId)
					}
				},
				fail: () => {},
				complete: () => {}
			})
			
			
    },
    methods: {
				closeAgreeMentPopup() {
					this.showFirstPageAgreeMentPopup = false
				},
				
				handleAgree() {
					
				},
				
        handleMobileSign() {
            this.$u.route('/pages/sign/mobile-sign')
        },
        async login(data) {
          const pageThis = this
            uni.setStorageSync('token', data.token);
            const userInfo = uni.getStorageSync('userInfo')
						getApp().globalData.openId = this.openId;
            
            let mt = setInterval(intLogin, 500)
            
            function intLogin() {
              getApp().globalData.getMemberInfo(data.phoneNumber, userInfo.avatarUrl, '', function(data) {
				if(data && data.id) {
					pageThis.userInfo = data;
					clearInterval(mt)
					uni.setStorageSync('openId', data.openId)
					uni.setStorageSync('isLogin', true)
					uni.setStorageSync('userInfo', data)
                    uni.showToast({
                        title: '登录成功',
                        duration: 1000,
                        success: async () => {
							if(pageThis.sceneParams.type) {
								if (pageThis.sceneParams.type == 1 || pageThis.sceneParams.type == 2) {
									if(pageThis.isHaveMobile === false) {
										uni.showLoading({
											title: '加载中'
										})
										
										const params = {
											companyId: pageThis.sceneParams.companyId,
											userId: pageThis.sceneParams.userId,
											inviteUserId: data.id
										}
										
										const res = await pageThis.$getRequest(pageThis.$url.inviteGift, "GET", params)
										uni.hideLoading()
										if (res.code == 0) {
											uni.reLaunch({
												url: '/pages/home/choose-index'
											})
											
										}
									} else {
										uni.reLaunch({
											url: '/pages/home/choose-index'
										})
									}
								} else if (pageThis.sceneParams.type == 3){
									uni.showLoading({
										title: '加载中'
									})
									
									const params = {
										companyId: pageThis.sceneParams.companyId,
										userId: data.id,
									}
									
									const res = await pageThis.$getRequest(pageThis.$url.addStaff, "GET", params)
									uni.hideLoading()
									if (res.code == 0) {
										uni.setStorageSync('inviteCompanyInfo', res.data)
										uni.reLaunch({
											url: '/pages/home/choose-index'
										})
										// pageThis.inviteCompany = res.data
										// pageThis.showInviteStaffPopup = true
									}
									
									
								}
							} else if (pageThis.couponParams.code) {
								pageThis.couponParams.exchangeUserId = data.id
								pageThis.couponParams.name = data.name
								pageThis.couponParams.mobile = data.mobile
								pageThis.showCouponPopup = true
							} else {
								pageThis.$u.route({
								    type: 'navigateBack',
								    delta: 1,
								})
							}
                            
							pageThis.getLocation()
                        }
                    })
                  }
              }, this.partnerId, userInfo.nickname)
            }
        },
		
		closeInviteStaffPopup() {
			this.handleComfirmInviteStaffPopup()
			this.showInviteStaffPopup = false
		},
		
		handleComfirmInviteStaffPopup() {
			uni.reLaunch({
				url: '/pages/home/choose-index'
			})
		},
		
		close() {
			this.showCouponPopup = false
		},
		
		handleComfirm() {
			if(!this.couponParams.name) {
				uni.showToast({
					title: '请输入姓名',
					duration: 2000,
					icon: 'none'
				})
				return false;
			}
			
			if(!this.couponParams.mobile) {
				uni.showToast({
					title: '请输入手机号',
					duration: 2000,
					icon: 'none'
				})
				return false;
			}
			
			uni.showLoading({
				title: '加载中'
			})
			
			this.$getRequest(this.$url.exchangeCode, "GET", this.couponParams).then(res => {
				uni.hideLoading()
				if (res.code == 0) {
					uni.showToast({
						title: '领取红包成功',
						duration: 2000,
						icon: "none"
					})
					uni.reLaunch({
						url: '/pagesOrder/account/personAccount'
					})
				} else {
					uni.showToast({
						title: res.msg || '领取红包失败',
						duration: 2000,
						icon: "none"
					})
				}
			}).catch(() => {
				uni.hideLoading()
			})
		},
		
        async handleLogin(e) {
					const self = this
					console.log('handleLogin', e)
					const  {encryptedData, iv } = e.detail
					const data =  await this.$getRequest(this.$url.decryptData, 'POST', {
						encryptedData: encryptedData,
						iv: iv,
						sessionKey: this.session_key
					})
					
					if(data.code != 0) {
						uni.showToast({
								title: '手机号获取失败',
								duration: 2000,
								icon: 'none'
						})
						return false
					}else{
						uni.setStorageSync('phoneNumber', data.data.phoneNumber)
					}
					self.login(data.data)
        },
				
				goAgreeMentPage() {
					uni.navigateTo({
						url: `/pages/agreement/privacyAgreement`
					})
				},
				
				handlerTip() {
					uni.showModal({
						title: '温馨提示',
						content: '阅读并同意《WECARS隐私政策》可以继续登录',
						confirmColor: '#576B95',
					})
				},
				
				getLocation() {
					uni.getLocation({
				    type: 'wgs84',
				    success: async (res) => {
				      console.log('getLocation', res)
							uni.setStorageSync("locationAddress", res.result)
				    },
				    fail: async (err) =>{
							console.log('fail', err)
				    }
				  });
				},
    },
};
</script>

<style lang="scss" scoped>
.sign {
		text-align: center;
		.sign-logo {
				display: inline-block;
				margin-top: 240rpx;
				margin-bottom: 80rpx;
		}
		.slogan {
				letter-spacing: 16rpx;
				color: rgba(10, 15, 45, 0.5);
				margin-bottom: 80rpx;
				font-size: 34rpx;
		}
		.mobile-sign {
				margin-top: 40rpx;
				color: rgba(10, 15, 45, 0.8);
		}
		.wx-icon {
				margin-right: 24rpx;
		}
}
.btu-wx {
		margin: 0 80rpx;
		border-radius: 16rpx;
		overflow: hidden;
}
.btu-wx ::v-deep button {
		background: #0A0F2D;
		color: #fff;
		height: 116rpx;
		line-height: 116rpx;
		font-size: 34rpx;
		font-weight: 500;
		border-radius: 16rpx;
}
.operator {
	margin-top: 32px;
	color: #5D5D5D;
	font-size: 12px;
	height: 44rpx;
	line-height: 44rpx;
	display: flex;
	justify-content: center;
	::v-deep .u-checkbox__label {
		font-size: 12px;
		margin-right: 0;
	}
}

.btn {
	background: #0A0F2D;
	color: #fff;
	height: 116rpx;
	font-size: 34rpx;
	font-weight: 500;
	border-radius: 16rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.popup-wrap {
	padding: 48rpx;
	width: 560rpx;
	.item {
		margin-bottom: 32rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		font-size: 14px;
		.label {
			color: #64696F;
			width: 120rpx;
			text-align: right;
		}
		.content {
			color: #141414;
		}
	}
	.company {
		margin-bottom: 32rpx;
		line-height: 56rpx;
		font-size: 30rpx;
		color: #64696F;
		text-align: left;
	}
	.btn-wrap {
		margin-top: 80rpx;
		.btn {
			width: 100%;
			height: 80rpx;
			border-radius: 16rpx;
			background: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			color: #FFFFFF;
		}
	}
}
</style>
