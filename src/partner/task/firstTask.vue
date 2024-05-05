<template>
	<view class="wrap" v-if="countDownTime">
		<view
			class="status-bar"
			:style="{ height: custom.top + 'px' }"
		/>
		
		<view class="header">
			<view class="back-btn" @click="back">
				<u-icon name="arrow-left" color="#fff" size="48"></u-icon>
			</view>
			<view class="title">新人福利</view>
		</view>
		
		<view class="container">
			<view class="page-card prize-card">
				<view class="prize-name">首单佣金翻倍</view>
				<view class="countdown">新人福利剩余：{{countDownTime}}</view>
			</view>
			
			<view class="page-card task-card">
				<view class="task-step task-step1">
					第一步：分享产品
					<view class="share-btn" @click="goProductPage">选择产品</view>
				</view>
				<view class="task-step task-step2">
					第二步：客户注册
					<view class="tag">平台管理</view>
				</view>
				<view class="task-step task-step3">
					第三步：客户签约
					<view class="tag">平台管理</view>
				</view>
				<view class="task-step task-step4">第四步：获取佣金x2</view>
			</view>
		</view>
		
		<view class="fixed-buttom-disabled-btn">
			<button @click="goProductPage">分享产品</button>
		</view>
	</view>
</template>

<script>
import { formatCountdown, oneDay } from '@/utils'	

const app = getApp()
export default {
	data() {
		return {
			custom: app.globalData.custom,
			userInfo: null,
			userId: null,
			countDownTime: '',
			countDownTimer: null,
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
	},
	
	onShow() {
		const isLogin = uni.getStorageSync('isLogin')
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				this.userInfo = data
				this.getCountDown()
			})
		}
	},
	
	onUnload() {
		this.clearCountDownTimer()
	},
	
	methods: {
		back() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		clearCountDownTimer() {
			clearInterval(this.countDownTimer)
			this.countDownTimer = null
		},
		
		getCountDown() {
			const currentTimer = new Date().getTime()
			const periodTimer = new Date(this.userInfo.firstLoginPartnerTime).getTime() + 30*oneDay
			let timer = periodTimer - currentTimer
			const curTimer = formatCountdown(timer)
			this.countDownTime = `${curTimer.day}天${curTimer.hour}时${curTimer.minute}分`
			this.countDownTimer = setInterval(() => {
				timer -= 1000
				const curTimer = formatCountdown(timer)
				this.countDownTime = `${curTimer.day}天${curTimer.hour}时${curTimer.minute}分`
				if (timer <= 0) {
					this.clearCountDownTimer()
				}
			}, 1000)
		},
		
		goProductPage() {
			uni.navigateTo({
				url: `/partner/task/product?userId=${this.userId}&isDouble=1`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	min-height: 100vh;
	background-image: url('https://image.51cheyaoshi.com/xcx/app/static/partner/task-bg.png');
	background-size: 100%;
	.header {
		height: 64rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		.back-btn {
			width: 112rpx;
			height: 64rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 100;
		}
		.title {
			color: #fff;
			font-size: 34rpx;
			font-weight: 500;
		}
	}
	.container {
		padding: 32rpx 32rpx 64rpx;
		.page-card {
			margin-bottom: 40rpx;
			border-radius: 10rpx;
			background: #FFF6DF;
			border: 2rpx solid #FFAC1C;
		}
		.prize-card {
			height: 278rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.prize-name {
				font-size: 60rpx;
				color: #FE262B;
				font-weight: 500;
				font-style: italic;
			}
			.countdown {
				margin-top: 48rpx;
				font-size: 28rpx;
				color: #A16F40;
			}
		}
		
		.task-card {
			.task-step {
				height: 150rpx;
				padding: 0 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid #D8D8D8;
				font-size: 32rpx;
				font-weight: 500;
				position: relative;
				.tag {
					position: absolute;
					top: 0;
					right: 0;
					z-index: 100;
					width: 114rpx;
					height: 40rpx;
					border-radius: 0px 0px 0px 10rpx;
					background: #FE7708;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #FFFFFF;
					font-size: 24rpx;
					font-weight: 500;
				}
			}
			.task-step:last-child {
				border-bottom: none;
			}
			.task-step1, .task-step4 {
				color: #A16F40;
			}
			.task-step2, .task-step3 {
				color: rgba(10, 15, 45, 0.8);
			}
			.share-btn {
				width: 128rpx;
				height: 48rpx;
				border-radius: 10rpx;
				background: #FFD892;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #B60000;
				font-size: 24rpx;
				font-weight: 500;
			}
		}
	}
	.fixed-buttom-disabled-btn {
		background: transparent;
		button {
			background: #FFD892;
			color: #B60000;
		}
	}
}
</style>