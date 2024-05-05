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
		
		<view class="date">{{expirationDate}}</view>
		
		<template v-if="page == 2">
			<view class="brand">{{brand}} {{type}}</view>
			<view class="product">{{year}}｜{{product}}</view>
		</template>
		
	</view>
</template>

<script>
import { formatExpirationDate } from '@/utils/index.js'

const app = getApp()

export default {
	onShareAppMessage(res) {
	  return {
	    title: '车要试 让有车生活 · 更简单',
	    desc: '',
	    path: this.shareUrl,
	    imageUrl: '',
	  }
	},
	
	data() {
		return {
			custom: app.globalData.custom,
			page: 1, // 1.首页 2.汽车详情页
			userId: null,
			brand: '',
			type: '',
			year: '',
			product: '',
			productId: '',
			brandId: '',
			cityId: '',
			planId: '',
			qrCodeUrl: '',
			userInfo: {},
			shareUrl: '',
			expirationDate: '',
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
		this.page = options.page
		this.shareUrl = `/pages/home/choose-index?partnerId=${this.userId}`
		if (this.page == 2) {
			this.brand = options.brand
			this.type = options.type
			this.year = options.year
			this.product = options.product
			this.productId = options.productId
			this.brandId = options.brandId
			this.cityId = options.cityId
			this.planId = options.planId
			this.shareUrl = `/pages/home/profile/index?partnerId=${this.userId}&id=${this.productId}&cityId=${this.cityId}&qt=1&carBrandId=${this.brandId}`
		}
		
		
	},
	
	onShow() {
		const isLogin = uni.getStorageSync('isLogin')
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				this.userInfo = data
				this.getWecarsQrCode()
			})
		}
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
				scene = `${this.cityId}&${this.productId}&${this.userInfo.id}&${this.brandId}&&${this.planId}`
			}
			
			const res = await this.$getRequest(this.$url.createQrCode, 'POST', {
			  envVersion: 1,
				page,
				scene,
			})
			if (res.code == 0) {
				this.qrCodeUrl = res.data
				const date = formatExpirationDate(30)
				this.expirationDate = `有效期至 ${date.year}.${date.month}.${date.date} ${date.hour}:00`
			}
		},
	},
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
	.brand {
		margin-top: 64rpx;
		height: 48rpx;
		font-size: 32rpx;
		line-height: 48rpx;
		color: #505050;
	}
	.product {
		height: 36rpx;
		font-size: 22rpx;
		line-height: 36rpx;
		color: #727272;
	}
	.date {
		margin-top: 40rpx;
		height: 48rpx;
		font-size: 24rpx;
		font-weight: 500;
		line-height: 48rpx;
		color: #FFFFFF;
	}
}
</style>