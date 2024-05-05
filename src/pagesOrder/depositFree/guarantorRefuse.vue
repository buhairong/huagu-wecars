<template>
	<view class="page">
		<view class="title">担保人拒绝</view>
		<view class="content">很抱歉，您所添加的担保人已拒绝为您提供担保。您可以重新添加其他担保人，您可以选择重新添加担保人或取消申请。</view>
		<view class="btn" @click="changeGuarantor">重新添加担保人</view>
		<view class="link-text" @click="cancelDepositFree">取消车辆免押申请</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userId: '',
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
	},
	
	onShow() {
		
	},
	
	methods: {
		changeGuarantor() {
			uni.navigateTo({
				url: `/pagesOrder/depositFree/applyDepositFreeByPerson?userId=${this.userId}&hasGuarantor=1&step=3`
			})
		},
		
		cancelDepositFree() {
				this.$getRequest(this.$url.cancelDepositFree, 'GET', {
					userId: this.userId,
				}).then(res => {
					if (res.code === 0) {
						uni.navigateBack({
							delta: 1
						})
					}
				})
		},
		
	}
}
</script>

<style lang="scss" scoped>
.page {
	padding: 0 32rpx;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.title {
		height: 48rpx;
		font-size: 32rpx;
		line-height: 48rpx;
		color: rgba(0, 0, 0, 0.6);
	}
	.content {
		padding-top: 36rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
	}
	.btn {
		margin-top: 192rpx;
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		font-size: 34rpx;
		font-weight: 500;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.link-text {
		padding: 36rpx 0;
		height: 48rpx;
		font-size: 28rpx;
		line-height: 48rpx;
		text-decoration: underline;
		color: rgba(61, 61, 61, 0.8);
	}
}
</style>
