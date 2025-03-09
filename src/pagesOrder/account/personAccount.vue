<template>
	<view class="page-wrap1">
		<view class="header">
			<view class="left">
				<view class="account">
					<view class="title">充值余额：</view>
					<view class="price">{{formatThousandNumber(rechargeAmount)}}元</view>
				</view>
				<view class="account">
					<view class="title">赠送余额：</view>
					<view class="price">{{formatThousandNumber(giftAmount)}}元</view>
				</view>
				<view class="account">
					<view class="title">可用余额：</view>
					<view class="price">{{formatThousandNumber(balance)}}元</view>
				</view>
			</view>
			<view class="right">
				<view @click="goRechargePage">
					充值
					<u-icon name="arrow-right" color="#ffffff" size="28" ></u-icon>
				</view>
			</view>
		</view>
		
		<view class="tips">
			<view class="tip">充值 <text class="price">{{formatThousandNumber(50000)}}</text> 元，赠送 <text class="price">{{formatThousandNumber(10000)}}</text> 元</view>
			<view class="tip">充值 <text class="price">{{formatThousandNumber(80000)}}</text> 元，赠送 <text class="price">{{formatThousandNumber(15000)}}</text> 元</view>
			<view class="tip">充值 <text class="price">{{formatThousandNumber(100000)}}</text> 元，赠送 <text class="price">{{formatThousandNumber(20000)}}</text> 元</view>
			<view class="tip">
				邀请新用户注册，赠送 <text class="price">{{formatThousandNumber(100)}}</text> 元
				<view class="text-btn" @click="invite">去邀请</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	
	export default {
		data() {
			return {
				userId: '',
				detail: null,
				rechargeAmount: 1000,
				giftAmount: 2000,
				balance: 3000,
				list: [],
			}
		},
		
		onLoad(option) {
			this.userId = option.userId
		},
		
		methods: {
			formatThousandNumber(price) {
				return formatThousandNumber(price)
			},
			
			goRechargePage() {
				uni.navigateTo({
					url: `/pagesOrder/account/recharge?type=1&userId=${this.userId}`
				})
				
			},
			
			invite() {
				uni.navigateTo({
					url: `/pagesOrder/qrcode/qrcode?type=1&userId=${this.userId}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
	padding: 0 32rpx;
	width: 100%;
	height: 200rpx;
	background: #31C37B;
	color: #FFFFFF;
	.account {
		margin-top: 16rpx;
		display: flex;
		align-items: center;
		&:first-child {
			margin-top: 0;
		}
	}
	.title {
		font-size: 28rpx;
		color: #FFFFFF;
	}
	.price {
		font-size: 32rpx;
		color: #FFFFFF;
	}
}

.tips {
	margin-top: 32rpx;
	.tip {
		margin-bottom: 16rpx;
		font-size: 28rpx;
		line-height: 44rpx;
		color: rgba(78, 89, 105, 0.6);
		display: flex;
		align-items: center;
		.price {
			padding: 0 8rpx;
			color: #111;
			font-size: 32rpx;
			font-weight: 500;
		}
		.text-btn {
			margin-left: 32rpx;
			font-size: 28rpx;
			color: #4170EE;
			text-decoration: underline;
		}
	}
}
</style>