<template>
	<view class="yuyue-s">
		<view class="yy-s-img">
			<image src="https://image.51cheyaoshi.com/xcx/app/static/img/success.png"></image>
			<text>预定成功</text>
		</view>
		<view class="yy-content">
			<view>尊敬的  <text style="font-size:36rpx;">  {{userName || ''}}先生/女士</text></view>
			<view style="margin-top:26rpx;">
				<view>
					<image style="width:12rpx;height:12rpx;" src="https://image.51cheyaoshi.com/xcx/app/static/left.png"></image>
				</view>
				<view style="margin-top:26rpx;font-size:24rpx;">您的预约申请已经提交成功，相应经商户将尽快与您联系</view>
				<view style="margin-top:26rpx;text-align: right;">
					<image style="width:12rpx;height:12rpx;" src="https://image.51cheyaoshi.com/xcx/app/static/right.png"></image>
				</view>
			</view>
			<view style="width: 100%;height:4rpx;background:rgba(10, 15, 45, 0.3);margin-top:26rpx;"></view>
			<view style="font-size: 24rpx;color: #3D3D3D;margin-top:20rpx;">试驾订单编号： {{orderNum}}</view>
		</view>
		
		<view>
			<view
			    class="foot-but foot-sticky u-flex u-row-between"
			    @click="handleBookCar"
			>
			    <view class="foot-but-r" style="margin: 0 auto;">
					返回首页
			    </view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userName: '',
			orderNum: ''
		}
	},
	methods: {
		handleBookCar() {
			uni.switchTab({
				url: '../choose-index'
			})
		}
	},
	onLoad(option) {
		this.userName = option.name
		this.orderNum = option.orderNum
	}
}
</script>

<style lang="scss" scoped>
	.yuyue-s {
		padding: 0;
		margin: 36rpx 32rpx;
		.yy-s-img {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 80rpx;
			font-size: 34rpx;
			image {
				width: 356rpx;
				height: 236rpx;
			}
			text {
				margin-top: 20rpx;
				font-size: 36rpx;
				color: #0A0F2D;
			}
		}
		.yy-content {
			padding: 20rpx 12rpx 20rpx 16rpx;
			margin-top: 28rpx;
			
		}
		
	}
</style>