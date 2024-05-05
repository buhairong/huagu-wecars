<template>
	<view class="page">
		<image
			class="img"
			src="https://image.51cheyaoshi.com/xcx/merchant/static/home/success-icon.png"
		/>
		
		<view class="title">已提交{{applyService}}申请</view>
		<view class="sub-title">{{applyService}}申请结果会通过短信形式及时通知您，请您耐心等待。</view>
		
		<view class="card" v-if="hasGuarantor == 1">
			<view class="card-title">
				<view class="label">担保人信息</view>
				<view class="context" @click="changeGuarantor">更换担保人</view>
			</view>
			<view class="card-item">
				<view class="label">姓名</view>
				<view class="context">{{guarantorName}}</view>
			</view>
			<view class="card-item">
				<view class="label">手机号</view>
				<view class="context">{{guarantorMobile}}</view>
			</view>
		</view>
		
		<view class="btn" @click="updateUserSubscribeStatus" v-if="orderServiceType == 1">个性化定制</view>
		<view class="btn" @click="goHome" v-else>回到首页</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderServiceType: 1,
			applyService: '',
			userId: '',
			hasGuarantor: '',
			guarantorName: '',
			guarantorMobile: '',
		}
	},
	
	onLoad(options) {
		this.orderServiceType = options.orderServiceType || 1
		if (options.orderServiceType == 1) {
			this.applyService = '车辆免押金'
		} else if (options.orderServiceType == 2) {
			this.applyService = '会员租车'
		}
		this.userId = options.userId || ''
		this.hasGuarantor = options.hasGuarantor || ''
		let guarantorName = options.guarantorName || ''
		let guarantorMobile = options.guarantorMobile || ''
		
		if (guarantorName) {
			if (guarantorName.length > 1) {
				guarantorName = guarantorName.substr(0, 1) + "*" + guarantorName.substr(2)
			}
			this.guarantorName = guarantorName
		}
		if (guarantorMobile) {
			const reg = /(\d{3})(\d{4})(\d{4})/
			this.guarantorMobile = guarantorMobile.replace(reg, '$1****$3')
		}
	},
	
	onShow() {
		
	},
	
	methods: {
		changeGuarantor() {
			uni.navigateTo({
				url: `/pagesOrder/depositFree/applyDepositFreeByPerson?orderServiceType=${this.orderServiceType}&userId=${this.userId}&hasGuarantor=1&step=3`
			})
		},
		
		async updateUserSubscribeStatus() {
			const url = uni.getStorageSync("identityPath")
			uni.reLaunch({
				url,
			})
		},
		
		goHome() {
			uni.reLaunch({
				url: '/pages/home/choose-index'
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.page {
	padding: 140rpx 32rpx 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	.img {
		width: 120rpx;
		height: 120rpx;
	}
	.title {
		margin-top: 32rpx;
		height: 48rpx;
		font-size: 32rpx;
		line-height: 48rpx;
		color: rgba(0, 0, 0, 0.6);
	}
	.sub-title {
		margin-top: 36rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
	}
	.card {
		margin-top: 80rpx;
		width: 100%;
		margin-bottom: 0;
		.card-title {
			height: 48rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.label {
				font-size: 28rpx;
				font-weight: 500;
				color: #0A0F2D;
			}
			.context {
				font-size: 24rpx;
				text-decoration: underline;
				color: #3446AA;
			}
		}
		.card-item {
			margin-top: 32rpx;
			height: 44rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.label {
				font-size: 28rpx;
				color: rgba(10, 15, 45, 0.5);
			}
			.context {
				font-size: 28rpx;
				color: rgba(10, 15, 45, 0.8);
			}
		}
	}
	.btn {
		margin-top: 100rpx;
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		font-size: 32rpx;
		font-weight: 500;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
