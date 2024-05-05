<template>
	<view class="page">
		<view class="title">支持微信支付及银行转账混合分笔支付</view>
		<view class="price-wrap">
			<view class="unit">￥</view>
			<view class="price">{{price | $numFormat}}</view>
			<view style="margin-left:8rpx" @click="showSubscribeFreePay = true">
				<u-icon name="info-circle" color="rgba(10, 15, 45, 0.5)" size="36" ></u-icon>
			</view>
		</view>
		
		<view class="btn wx-btn" @click="goPayPage(2)">微信支付</view>
		<view class="btn back-btn" @click="goPayPage(3)">银行转账</view>
		
		<SubscribeFreePayPopup
			v-if="showSubscribeFreePay"
			:totalPayment="totalPayment"
			:carPlatePay="carPlatePay"
			:premiumPay="premiumPay"
			:configTotalMoney="configTotalMoney"
			:decorateMoney="decorateMoney-0"
			@close="showSubscribeFreePay = false"
		/>
	</view>
</template>

<script>
import SubscribeFreePayPopup from '../components/SubscribeFreePayPopup.vue'

export default {
	components: {
		SubscribeFreePayPopup,
	},
	
	data() {
		return {
			orderId: '',
			openid: '',
			userId: '',
			price: 0,
			totalPayment: 0,
			carPlatePay: 0,
			configTotalMoney: 0,
			decorateMoney: 0,
			showSubscribeFreePay: false,
			businessType: 0,
			premiumPay: 0,
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.openid = options.openid
		this.userId = options.userId
		this.businessType = options.businessType
		this.price = options.price - 0
		this.totalPayment = options.totalPayment - 0
		this.carPlatePay = options.carPlatePay - 0
		this.premiumPay = options.premiumPay - 0
		this.configTotalMoney = options.configTotalMoney - 0
		this.decorateMoney = options.decorateMoney - 0
	},
	
	methods: {
		goPayPage(payMode) {
			uni.navigateTo({
				url: `/pagesOrder/pay/editDepositPay?orderId=${this.orderId}&price=${this.price}&paymentStatus=4&openid=${this.openid}&userId=${this.userId}&payMode=${payMode}&businessType=${this.businessType}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.page {
	width: 100vw;
	padding: 32px 40rpx;
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
		height: 96rpx;
		line-height: 96rpx;
		display: flex;
		color: #0A0F2D;
		.unit {
			font-size: 22px;
			transform: translateY(6rpx);
		}
		.price {
			font-size: 32px;
		}
	}
	
	.remainder {
		height: 36rpx;
		font-size: 12px;
		line-height: 36rpx;
		color: rgba(10, 15, 45, 0.5);
	}
	
	.btn {
		margin-bottom: 20px;
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		font-size: 17px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.wx-btn {
		margin-top: 48px;
		background: #0A0F2D;
		color: #FFFFFF;
	}
	
	.back-btn {
		background: rgba(10, 15, 45, 0.04);
		color: #0A0F2D;
	}
}
</style>