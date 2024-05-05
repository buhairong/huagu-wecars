<template>
	<view class="page">
		<view class="title">支持微信支付及银行转账</view>
		<view class="price-wrap">
			<view class="unit">￥</view>
			<view class="price">{{price | $numFormat}}</view>
			<!-- <view style="margin-left:8rpx" @click="showSubscribeFreePay = true">
				<u-icon name="info-circle" color="rgba(10, 15, 45, 0.5)" size="36" ></u-icon>
			</view> -->
		</view>
		
		<view class="btn wx-btn" @click="goPayPage(2)">微信支付</view>
		<view class="btn back-btn" @click="goPayPage(3)">银行转账</view>
		
		
	</view>
</template>

<script>
export default {
	components: {
		
	},
	
	data() {
		return {
			carId: '',
			orderId: '',
			openid: '',
			userId: '',
			price: 0,
			showSubscribeFreePay: false,
			businessType: 0,
			payType: 0,
			offer: 0,
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.carId = options.carId || ''
		this.openid = options.openid
		this.userId = options.userId
		this.businessType = options.businessType
		this.payType = options.payType
		this.price = options.price - 0
		this.offer = options.offer || 0
	},
	
	methods: {
		goPayPage(payMode) {
			if(payMode === 2) {
				this.handlePay()
			} else {
				this.handleBankPay()
			}
		},
		
		async handlePay() {
			// 1.拉起微信支付
			uni.showToast({
				title: '微信支付中',
				duration: 2000,
				icon: 'loading'
			})
			
			// 2.创建微信订单
			this.$requestPayment({
				fromSys: 1,
				appType: 1,
				businessId: this.orderId, // 订单ID
				businessType: this.businessType, // 支付类型 0租车、1长租产品、2新车订阅、3购买二手车、4团购、5会员、6.购买服务 7.竞拍
				openid: this.openid,
				payType: this.payType, // 业务类型 // 0余额、1押金、2订金、3尾款、4长租费用（包月或季）、6二手车、7支付年费、8订阅费用、9租车租金、10租车押金
				total: this.price,
				// total: 0.01,
				userId: this.userId,
			}, async (res) => {
				if(res === 'success') {
					if (this.businessType == 7) {
						if (this.payType == 0) {
							uni.reLaunch({
								url: `/pagesOrder/auction/cashHome?userId=${this.userId}`
							})
						} else {
							this.addAuctionOffer()
						}
					} else {
						this.goDetailPage()
					}
				}
			})
			
			uni.hideLoading()
		},
		
		async addAuctionOffer() {
			const params = {
				secondAuctionId: this.orderId,
				secondCarId: this.carId,
				price: this.offer,
			  userId: this.userId,
			  valid: 1,
			}
			const result = await this.$getRequest(this.$url.addAuctionOffer, 'POST', params)
			if(result.code === 0){
				this.goDetailPage()
			}
		},
		
		goDetailPage() {
			let url = `/pagesOrder/rental/order/detail?orderId=${this.orderId}`
			if (this.businessType == 7) {
				url = `/pagesOrder/auction/detail?id=${this.orderId}`
			}
			uni.reLaunch({
				url
			})
		},
		
		handleBankPay() {
			uni.navigateTo({
				url: `/pagesOrder/rental/pay/bankPayInfo?orderId=${this.orderId}&carId=${this.carId}&price=${this.price}&offer=${this.offer}&payType=${this.payType}&openid=${this.openid}&userId=${this.userId}&businessType=${this.businessType}`
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