<template>
	<view class="page">
		<view class="pay-card">
			<view class="title">支付金额</view>
			<view class="input-wrap">
				<view class="unit">￥</view>
				<u-number-box
					ref="input"
					v-model="payPrice"
					placeholder="请输入支付价格"
					:min="1" 
					:max="price"
					:positive-integer="true"
					:input-height="96"
					:size="64"
					:input-width="220"
					bg-color="#ffffff"
					color="#0A0F2D"
					@change="change"
				>
				</u-number-box>
				<view @click="focusInput">
					<image
						style="width:40rpx;height:40rpx;transform: translateY(28rpx);"
						src="https://image.51cheyaoshi.com/xcx/app/static/home/pencil.png"
					>
				</view>
				
			</view>
			
			<view class="remainder" v-if="remainder">剩余￥{{remainder | $numFormat}}待支付</view>
			
			<view class="tip" v-if="payMode==2">若您支付金额超出最大额度，请分笔支付或更换其他支付方式。</view>
			<view class="tip" v-else-if="payMode==3">使用银行转账成功后请务必保存并上传转账凭证。</view>
		</view>
		
		<view class="btn" @click="handlePay" v-if="payMode==2">立即支付</view>
		<view class="btn" @click="handleBankPay" v-else-if="payMode==3">使用银行转账</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: '',
			openid: '',
			userId: '',
			price: 0,
			payPrice: 0,
			remainder: 0,
			payMode: 0, // 1.免押金 2.微信 3.银行转账
			paymentStatus: 0, // 2.押金 4.订阅费用
			payType: 0, // 微信: 1.押金 8.订阅费用 银行转账: 8.押金 6.订阅费用
			businessType: 0,
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.openid = options.openid
		this.userId = options.userId
		this.payMode = options.payMode
		this.businessType = options.businessType
		this.paymentStatus = options.paymentStatus
		this.price = options.price - 0
		this.payPrice = options.price - 0
		
		let title = ''
		
		if (this.payMode == 2) {
			if (this.paymentStatus == 2) {
				this.payType = 1
				title = '支付车辆押金'
			} else if (this.paymentStatus == 4) {
				this.payType = 8
				title = '支付订阅费用'
			}
		} else if (this.payMode == 3) {
			if (this.paymentStatus == 2) {
				this.payType = 8
				title = '支付车辆押金'
			} else if (this.paymentStatus == 4) {
				this.payType = 6
				title = '支付订阅费用'
			}
		}
		
		uni.setNavigationBarTitle({
			title,
		})
	},
	
	methods: {
		focusInput() {
			this.$refs.input.onFocus()
		},
		
		change(e) {
			if (e.value <= this.price) {
				this.remainder = this.price - e.value
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
				businessId: this.orderId, // 订单ID
				businessType: this.businessType, // 支付类型 0充值、1长租产品、2新车订阅、3购买二手车、4团购、5会员、6、购买服务
				openid: this.openid,
				payType: this.payType, // 业务类型 // 0余额、1押金、2订金、3尾款、4长租费用（包月或季）、6二手车、7支付年费、8订阅费用
				total: this.payPrice,
				//total: 0.01,
				userId: this.userId,
			}, async (res) => {
				if(res == 'success') {
					const params = {
						 businessId: this.orderId
					}
					
					let result = {}
					
					if (this.paymentStatus == 2) {
						result = await this.$getRequest(this.$url.selectDepositAboutNoPay, 'GET', params)
					} else if (this.paymentStatus == 4) {
						result = await this.$getRequest(this.$url.selectSubscribeFreeAboutNoPay, 'GET', params)
					}
					
					if(result.code == 0){
						if (result.data.remainMoney <= 0) {
							uni.navigateTo({
								url: `/pagesOrder/pay/depositPayEnd?orderId=${this.orderId}&paymentStatus=${this.paymentStatus}&userId=${this.userId}&businessType=${this.businessType}&payMode=2`
							})
						} else {
							uni.navigateTo({
								url: `/pagesOrder/pay/setDepositPayMode?orderId=${this.orderId}&paymentStatus=${this.paymentStatus}&openid=${this.openid}&userId=${this.userId}&businessType=${this.businessType}`
							})
						}
					}
					
				}
			})
			
			uni.hideLoading()
		},
		
		handleBankPay() {
			uni.navigateTo({
				url: `/pagesOrder/pay/bankPayInfo?orderId=${this.orderId}&price=${this.payPrice}&paymentStatus=${this.paymentStatus}&openid=${this.openid}&userId=${this.userId}&businessType=${this.businessType}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
::v-deep .u-numberbox {
	.u-icon-minus {
		display: none;
	}
	.u-icon-plus {
		display: none;
	}
	.u-number-input {
		padding-right: 24rpx;
		margin: 0;
	}
}
	
.page {
	width: 100vw;
	padding: 12px 32rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.pay-card {
		width: 100%;
		padding: 20px 32rpx;
		border-radius: 24rpx;
		box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.06);
		.title {
			margin-bottom: 12px;
			height: 48rpx;
			font-size: 14px;
			line-height: 48rpx;
			color: #0A0F2D;
		}
		.input-wrap {
			display: flex;
			.unit {
				font-size: 18px;
				color: #0A0F2D;
				transform: translateY(28rpx);
			}
		}
		.remainder {
			margin-top: 4px;
			width: 100%;
			height: 68rpx;
			line-height: 68rpx;
			border-radius: 8rpx;
			background: rgba(10, 15, 45, 0.04);
			padding-left: 16rpx;
			color: rgba(10, 15, 45, 0.5);
			font-size: 12px;
		}
		
		.tip {
			margin-top: 12px;
			line-height: 36rpx;
			font-size: 12px;
			color: rgba(10, 15, 45, 0.8);
		}
	}
	
	.btn {
		margin-top: 32px;
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
</style>