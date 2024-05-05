<template>
	<view class="page">
		<view class="title">支持微信支付及银行转账混合分笔支付</view>
		<view class="price-wrap">
			<view class="unit">￥</view>
			<view class="price">{{total | $numFormat}}</view>
		</view>
		
		<PayList :orderId="orderId" :paymentStatus="paymentStatus" :userId="userId" :list="list" style="width:100%" />
		
		<view style="width:100%">
			<view class="remainder">剩余￥{{remainder | $numFormat}}待支付</view>
		</view>
		
		<view class="btn wx-btn" @click="goPayPage(2)">微信支付</view>
		<view class="btn back-btn" @click="goPayPage(3)">银行转账</view>
	</view>
</template>

<script>
import PayList from '../components/PayList.vue'

export default {
	components: {
		PayList,
	},
	
	data() {
		return {
			orderId: '',
			openid: '',
			userId: '',
			total: 0,
			remainder: 0,
			list: [],
			paymentStatus: 0, // 2.押金 4.订阅费用
			payType: 0, // 微信: 1.押金 8.订阅费用 银行转账: 8.押金 6.订阅费用
			businessType: 0,
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.openid = options.openid
		this.userId = options.userId
		this.businessType = options.businessType
		this.paymentStatus = options.paymentStatus
		
		let title = ''
		if (this.paymentStatus == 2) {
			this.payType = 8
			title = '支付车辆押金'
		} else if (this.paymentStatus == 4) {
			this.payType = 6
			title = '支付订阅费用'
		}
		
		uni.setNavigationBarTitle({
			title,
		})
	},
	
	onShow() {
		this.selectPaymentDetailList()
	},
	
	methods: {
		async selectPaymentDetailList() {
			const params = {
				 businessId: this.orderId,
				 businessType: this.businessType,
				 payType: this.payType,
			}
			const result = await this.$getRequest(this.$url.selectPaymentDetailList, 'POST', params)
			if(result.code == 0){
				this.total = result.data.totalPayment
				this.remainder = result.data.remainPayment
				this.list = result.data.details
			}
		},
		
		goPayPage(payMode) {
			uni.navigateTo({
				url: `/pagesOrder/pay/editDepositPay?orderId=${this.orderId}&price=${this.remainder}&paymentStatus=${this.paymentStatus}&openid=${this.openid}&userId=${this.userId}&payMode=${payMode}&businessType=${this.businessType}`
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
		margin-bottom: 32px;
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
		margin-top: 32px;
		background: #0A0F2D;
		color: #FFFFFF;
	}
	
	.back-btn {
		background: rgba(10, 15, 45, 0.04);
		color: #0A0F2D;
	}
}
</style>