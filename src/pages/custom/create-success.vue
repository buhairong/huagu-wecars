<template>
	<view class="wrap">
		<image
			style="width:160rpx;height:160rpx;"
			src="https://image.51cheyaoshi.com/xcx/app/static/home/done.png"
		/>
		<view class="title">方案已提交</view>
		<view class="sub-title">我们将安排专属客服与您联系，请耐心等待</view>
		<view class="btn" @click="goHomePage">返回首页</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		}
	},
	onLoad(options) {
		
	},
	
	methods: {
		goHomePage() {
			uni.reLaunch({
				url: '/pages/home/choose-index'
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40px 40rpx;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	.title {
		margin-top: 12px;
		height: 56rpx;
		font-size: 18px;
		line-height: 56rpx;
		text-align: center;
		color: #000000;
	}
	.sub-title {
		margin-top: 4px;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
	}
	.btn {
		margin-top: 50px;
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		color: #FFFFFF;
	}
}
</style>