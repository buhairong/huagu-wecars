<template>
	<view class="wrap">
		<view class="header">
			<view :style="{ height: custom.top + 'px' }"/>
			
			<view class="back-btn" @click="goHome" v-if="showHome">
				<image
					style="width: 48rpx;"
				  src="https://image.51cheyaoshi.com/xcx/app/static/partner/home_white.png"
					mode="widthFix"
				/>
			</view>
			<view class="back-btn" @click="back" v-else>
				<u-icon name="arrow-left" color="#ffffff" size="48"></u-icon>
			</view>
			
			<view class="title-wrap">
				<view class="title">全民合伙人</view>
				<view class="sub-title">让有车生活 · 更简单</view>
			</view>
		</view>
		
		<view class="card-wrap">
			<view class="card">
				<view class="card-title">申请成为WECARS全民合伙人</view>
				
				<!-- <view class="operator">
					<u-checkbox-group>
						<u-checkbox 
							v-model="isAgree" 
							name="1"
							shape="circle"
						>
							我已阅读并同意
							<text style="font-weight:500;color:#3446AA;" @click.stop="goAgreeMentPage">
								《全民合伙人协议》
							</text>
						</u-checkbox>
					</u-checkbox-group>
				</view> -->
				
				<view class="btn" @click="handleRegister" v-if="isAgree">成为全民合伙人</view>
				
				<view class="link-text" @click="goPartnerFaqPage">全民合伙人FAQ</view>
			</view>
		</view>
		
		<AgreeMentPopup :show.sync="showFirstPageAgreeMentPopup" @agree="handleAgree"/>
	</view>
</template>

<script>
import AgreeMentPopup from './components/AgreeMentPopup.vue'

const app = getApp()

export default {
	components: {
		AgreeMentPopup,
	},
	
	data() {
		return {
			userId: null,
			upUserId: '',
			custom: app.globalData.custom,
			isAgree: '',
			isHasOrder: '',
			isPartner: 0,
			isPartnerMsg: '您当前已是合伙人，无需再申请',
			scene: '',
			showFirstPageAgreeMentPopup: false,
			showHome: false,
			isAgree: false,
		}
	},
	onLoad(options) {
		this.userId = options.userId
		this.upUserId = options.upUserId || ''
		this.isHasOrder = options.isHasOrder
		
		//options.scene = '68'
		if(options.scene){
			this.scene = decodeURIComponent(options.scene)
			this.upUserId = this.scene
		}
		
		if (this.upUserId) {
			this.showHome = true
		}
	},
	
	onShow() {
		wx.getPrivacySetting({
			success: async res => {
				console.log('getPrivacySetting', res)
				// 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
				if (res.needAuthorization) {
					// 需要弹出隐私协议
					this.showFirstPageAgreeMentPopup = true
				} else {
					this.isAgree = true
				}
			},
			fail: () => {},
			complete: () => {}
		})
		
	  const isLogin = uni.getStorageSync('isLogin')
		
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				this.userId = data.id
				this.isPartner = data.isPartner
				if (this.isPartner === 1) {
					this.upUserId = ''
					this.showToast(this.isPartnerMsg)
				}
				//this.userId = 58
			})
		}
	},
	
	methods: {
		handleAgree() {
			this.isAgree = true
		},
		
		goHome() {
			uni.reLaunch({
				url: '/pages/home/choose-index'
			})
		},
		
		back() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		goAgreeMentPage() {
			uni.navigateTo({
				url: `/partner/agreement/partnerAgreement`
			})
		},
		
		handleRegister() {
			// if (this.isHasOrder == 1) {
			// 	this.register()
			// } else {
			// 	uni.navigateTo({
			// 		url: `/partner/register/uploadIdCardIdentity?userId=${this.userId}`
			// 	})
			// }
			
			if (this.userId) {
				if (this.isPartner === 1) {
					this.showToast(this.isPartnerMsg)
				} else {
					uni.navigateTo({
						url: `/partner/register/uploadCareer?userId=${this.userId}&upUserId=${this.upUserId}`
					})
				}
			} else {
				uni.navigateTo({
					url: '/pages/sign/sign',
				})
			} 
		},
		
		showToast(title) {
			uni.showToast({
				title,
				duration: 2000,
				icon: 'none'
			})
		},
		
		register() {
			// if(!this.isAgree) {
			// 	uni.showToast({
			// 			title: '请先阅读并同意《全民合伙人协议》',
			// 			duration: 2000,
			// 			icon: 'none'
			// 	})
			// 	return false
			// }
			
			const data = {
				userId: this.userId
			}
			
			
			this.$getRequest(this.$url.becomePartner, "GET", data).then(res => {
				if (res.code === 0) {
					getApp().globalData.userInfo.isPartner = 1
					uni.reLaunch({
						url: `/partner/register/registerSuccess?isHasOrder=1`
					})
				} else {
					uni.showToast({
						title: '保存失败',
						duration: 2000,
						icon: 'none',
					})
				}
			}).catch(err => {
				uni.showToast({
					title: '保存失败',
					duration: 2000,
					icon: 'none',
				})
			})
		},
		
		goPartnerFaqPage() {
			uni.setStorageSync('url', 'https://h5.51cheyaoshi.com/partner-FAQ/index.html')
			uni.navigateTo({
				url: `/pages/home/profile/wxbview`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	height: 100vh;
	.header {
		width: 100vw;
		height: 800rpx;
		background: linear-gradient(180deg, #31C37B 86%, rgba(196,196,196,0.00) 100%);
		.back-btn {
			width: 88rpx;
			height: 64rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.title-wrap {
			padding-top: 140rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.title {
				height: 44rpx;
				font-size: 40rpx;
				line-height: 44rpx;
				color: #FFFFFF;
			}
			.sub-title {
				padding-top: 24rpx;
				height: 40rpx;
				font-size: 24rpx;
				line-height: 40rpx;
				color: #FFFFFF;
			}
		}
	}
	
	.card-wrap {
		margin-top: -260rpx;
		padding: 0 32rpx;
		.card {
			display: flex;
			flex-direction: column;
			align-items: center;
			.card-title {
				display: block;
				padding-bottom: 150rpx;
				height: 44rpx;
				font-size: 32rpx;
				line-height: 44rpx;
				color: #0A0F2D;
			}
			.operator {
				padding-left: 32rpx;
				width: 100%;
				color: #5D5D5D;
				font-size: 28rpx;
				height: 44rpx;
				line-height: 44rpx;
				display: flex;
				::v-deep .u-checkbox__label {
					font-size: 28rpx;
					margin-right: 0;
				}
			}
			.btn {
				margin: 24rpx 0;
				width: 100%;
				height: 90rpx;
				border-radius: 45px;
				background: #31C37B;
				font-size: 28rpx;
				color: #FFFFFF;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.link-text {
				height: 44rpx;
				font-size: 24rpx;
				line-height: 44rpx;
				text-decoration: underline;
				color: #727272;
			}
		}
	}
}
</style>