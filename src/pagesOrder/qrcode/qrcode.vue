<template>
	<view class="wrap">
		<view :style="{ height: custom.top + 'px' }"/>
		
		<view class="back-btn-wrap">
			<view class="back-btn" @click="back">
				<u-icon name="arrow-left" color="rgba(0, 0, 0, 0.9)" size="48"></u-icon>
			</view>
		</view>
		
		<view class="title">微信扫码进入WECARS小程序</view>
		
		<view class="line"></view>
		
		<view class="image-wrap">
			<image
				style="width:100%;height:100%;"
				:src="qrCodeUrl"
			/>
		</view>
	</view>
</template>

<script>
	const app = getApp()
	
	export default {
		data() {
			return {
				type: '', // 1.个人分享小程序  2 企业分享小程序  3.企业邀请员工  
				custom: app.globalData.custom,
				userId: '',
				companyId: '',
				companyName: '',
				qrCodeUrl: '',
			}
		},
		
		onLoad(options) {
			this.type = options.type
			this.userId = options.userId
			this.companyId = options.companyId
			this.companyName = options.companyName
		},
		
		onShow() {
			this.getWecarsQrCode()
		},
		
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			// 获取小程序码
			async getWecarsQrCode() {
				let page = 'pages/home/choose-index'
				let scene = `${this.userId}`
				
				if (this.page == 2) {
					page = 'pages/home/profile/index'
					scene = ``
				}
				
				const res = await this.$getRequest(this.$url.createQrCode, 'POST', {
					envVersion: 1,
					page,
					scene,
				})
				
				if (res.code == 0) {
					this.qrCodeUrl = res.data
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	height: 100vh;
	background: linear-gradient(180deg, #31C37B 53%, rgba(219,219,219,0.00) 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
	.back-btn-wrap {
		width: 100%;
	}
	.back-btn {
		width: 88rpx;
		height: 64rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.title {
		padding: 120rpx 0;
		height: 48rpx;
		font-size: 40rpx;
		line-height: 48rpx;
		color: #FFFFFF;
	}
	.line {
		width: 600rpx;
		height: 34rpx;
		border-radius: 17rpx;
		background: rgba(0, 0, 0, 0.8);
	}
	.image-wrap {
		margin-top: -17rpx;
		width: 560rpx;
		height: 560rpx;
		background: #fff;
		border-radius: 0px 0px 20rpx 20rpx;
	}
}
</style>
