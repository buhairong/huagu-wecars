<template>
	<view class="wrap">
		<view class="top">
			<image
				style="width:160rpx;height:160rpx;"
				src="https://image.51cheyaoshi.com/xcx/app/static/home/done.png"
			/>
			<view class="shadow"></view>
			<view class="title">{{title}}</view>
			<view class="sub-title">{{subTitle}}</view>
		</view>
		
		<view class="timer">{{second}}S后自动跳转</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			second: 3,
			timer: null,
			isHasOrder: '',
			title: '',
			subTitle: '',
		}
	},
	
	onLoad(options) {
		this.isHasOrder = options.isHasOrder
		if (options.isHasOrder == 1) {
			this.title = '恭喜您'
			this.subTitle = '成功加入WECARS合伙人'
		} else {
			this.title = '已提交全民合伙人申请'
			this.subTitle = '合伙人申请审核中，请您耐心审核结果。'
		}
	},
	
	onUnload() {
		this.clearTimer()
	},
	
	onReady() {
		this.timer = setInterval(() => {
			this.second--
			if (this.second < 1) {
				this.clearTimer()
				uni.reLaunch({
					url: '/pages/mine/mine'
				})
			}
		}, 1000)
	},
	
	methods: {
		clearTimer() {
			clearInterval(this.timer)
			this.timer = null
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	height: 100vh;
	padding: 160rpx 32rpx 80rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		.shadow {
			margin-top: 40rpx;
			width: 72rpx;
			height: 12rpx;
			border-radius: 100%;
			background: rgba(29, 33, 41, 0.1);
		}
		.title {
			margin-top: 40rpx;
			height: 56rpx;
			font-size: 36rpx;
			line-height: 56rpx;
			text-align: center;
			color: #000000;
		}
		.sub-title {
			margin-top: 24rpx;
			height: 44rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: rgba(10, 15, 45, 0.5);
		}
	}
}
</style>