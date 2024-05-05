<template>
	<view class="page">
		<view class="header" style="width:100%;">
			<view class="title">支持微信支付及银行转账混合分笔支付</view>
			
			<view class="price-wrap">
				<view class="unit">￥</view>
				<view class="price">{{price | $numFormat}}</view>
				<view style="margin-left:8rpx" @click="showDepositPay = true">
					<u-icon name="info-circle" color="rgba(10, 15, 45, 0.5)" size="36" ></u-icon>
				</view>
			</view>
			
			<u-radio-group v-model="payMode" class="radio-group" active-color="#0A0F2D">
				<!-- <view class="pay-card">
					<view class="card-title">
						<view class="text">免押支付</view>
						<view class="tag">推荐</view>
					</view>
					<view class="radio-item">
						<view class="left">
							<image
								style="width:40rpx;height:40rpx;margin-right:16rpx;"
								src="https://image.51cheyaoshi.com/xcx/app/static/ordered/wx-scope.png"
							/>
							微信支付分 ｜ 600分及以上优享
						</view>
						<view class="right">
							<u-radio :name="1"></u-radio>
						</view>
					</view>
				</view> -->
				
				<view class="pay-card">
					<view class="card-title">
						<view class="text">立即支付</view>
					</view>
					<view class="radio-item">
						<view class="left">
							<image
								style="width:36rpx;height:30rpx;margin-right:16rpx;"
								src="https://image.51cheyaoshi.com/xcx/app/static/ordered/wechat.png"
							/>
							微信支付
						</view>
						<view class="right">
							<u-radio :name="2"></u-radio>
						</view>
					</view>
					<view class="split"></view>
					<view class="radio-item">
						<view class="left">
							<image
								style="width:34rpx;height:24rpx;margin-right:16rpx;"
								src="https://image.51cheyaoshi.com/xcx/app/static/ordered/bankcard.png"
							/>
							银行转账<text style="font-size:12px;color:#F5194B">（转账后上传转账凭证）</text>
						</view>
						<view class="right">
							<u-radio :name="3"></u-radio>
						</view>
					</view>
				</view>
			</u-radio-group>
		</view>
		
		<view class="bottom">
			<view class="tel">客服电话：{{serviceTel}}</view>
			<view class="btn" @click="goPayPage">立即支付</view>
		</view>
		
		
		<DepositPayPopup
			v-if="showDepositPay"
			:deposit="deposit"
			:addedDeposit="addedDeposit"
			@close="showDepositPay = false"
		/>
	</view>
</template>

<script>
import { serviceTel } from "@/constants"
import DepositPayPopup from '../components/DepositPayPopup.vue'
	
export default {
	components: {
		DepositPayPopup,
	},
	
	data() {
		return {
			orderId: '',
			price: 0,
			deposit: 0,
			addedDeposit: 0,
			openid: '',
			userId: '',
			showDepositPay: false,
			serviceTel,
			payMode: 2, // 1.免押金 2.微信 3.银行转账
			businessType: 0,
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.openid = options.openid
		this.userId = options.userId
		this.businessType = options.businessType
		this.price = options.price - 0
		this.deposit = options.deposit - 0
		this.addedDeposit = options.addedDeposit - 0
	},
	
	methods: {
		goPayPage() {
			if (this.payMode == 1) {
				uni.navigateTo({
					url: `/pagesOrder/pay/depositPayEnd?orderId=${this.orderId}&payMode=${this.payMode}&userId=${this.userId}&businessType=${this.businessType}`
				})
			} else {
				uni.navigateTo({
					url: `/pagesOrder/pay/editDepositPay?orderId=${this.orderId}&price=${this.price}&openid=${this.openid}&userId=${this.userId}&payMode=${this.payMode}&businessType=${this.businessType}&paymentStatus=2`
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.radio-group {
	width: 100%;
	::v-deep .u-radio {
		 .u-radio__label {
			margin: 0;
		}
		
		.u-radio__icon-wrap {
			border: none;
			background: rgba(10, 15, 45, .1);
		}
	}
}
	
.page {
	width: 100vw;
	height: 100vh;
	padding: 35px 32rpx 40px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		.title {
			height: 48rpx;
			font-size: 16px;
			line-height: 48rpx;
			color: #0A0F2D;
		}
		.price-wrap {
			margin-top: 12px;
			margin-bottom: 32px;
			height: 96rpx;
			display: flex;
			align-items: center;
			color: #0A0F2D;
			.unit {
				font-size: 22px;
				transform: translateY(4rpx);
			}
			.price {
				font-size: 32px;
				font-weight: 500;
			}
		}
		
		.pay-card {
			margin-bottom: 16px;
			border-radius: 24rpx;
			width: 100%;
			padding: 16px 32rpx;
			box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.04);
			.card-title {
				margin-bottom: 16px;
				height: 48rpx;
				display: flex;
				align-items: center;
				.text {
					color: #0A0F2D;
					font-size: 16px;
					font-weight: 500;
				}
				.tag {
					margin-left: 16rpx;
					width: 80rpx;
					height: 44rpx;
					border-radius: 22rpx;
					background: #F5AA19;
					font-size: 12px;
					color: #FFFFFF;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			
			.radio-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left {
					display: flex;
					align-items: center;
					color: rgba(10, 15, 45, 0.8);
					font-size: 14px;
				}
			}
			
			.split {
				margin: 16px 0;
				width: 100%;
				height: 2rpx;
				background: rgba(10, 15, 45, 0.04);
			}
		}
	}
	
	.bottom {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.tel {
			height: 44rpx;
			font-size: 12px;
			line-height: 44rpx;
			color: #A1A1A1;
		}
		.btn {
			margin-top: 20px;
			width: 100%;
			height: 116rpx;
			border-radius: 16rpx;
			background: #0A0F2D;
			font-size: 17px;
			color: #FFFFFF;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
</style>