<template>
	<view class="page">
		<view class="pay-status" v-if="hasRejectAccount">
			<image
				style="width:160rpx;height:160rpx;"
				src="https://image.51cheyaoshi.com/xcx/app/static/home/error_red.png"
			/>
			<view class="title">审核未通过</view>
		</view>
		<view class="pay-status" v-else>
			<image
				style="width:160rpx;height:160rpx;"
				src="https://image.51cheyaoshi.com/xcx/app/static/home/done.png"
			/>
			<view class="title">支付成功</view>
			<view class="free-tip" v-if="payMode==1">
				<image
					style="width:40rpx;height:40rpx;margin-right:16rpx;"
					src="https://image.51cheyaoshi.com/xcx/app/static/ordered/wx-scope.png"
				/>
				微信支付分免押提车
			</view>
			<view class="bank-tip" v-if="payMode==3">请耐心等待金融方确认</view>
		</view>
		
		
		<PayList 
			:orderId="orderId" 
			:paymentStatus="paymentStatus"
			:userId="userId"
			:openid="openid"
			:businessType="businessType"
			:list="list"
			style="width:100%" 
		/>
		
		<view class="btn" @click="goDetailPage">查看订单</view>
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
			payMode: 0, // 1.免押金 2.微信 3.银行转账
			paymentStatus: 0, // 2.押金 4.订阅费用
			payType: 0, // 微信: 1.押金 8.订阅费用 银行转账: 8.押金 6.订阅费用
			list: [],
			businessType: 0,
		}
	},
	
	computed: {
		hasRejectAccount() {
			return this.list.some(item => item.payWay === 2 && item.confirmed === 2)
		},
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.openid = options.openid
		this.userId = options.userId
		this.paymentStatus = options.paymentStatus
		this.businessType = options.businessType
		if (options.payMode) {
			this.payMode = options.payMode
		}
		
		let title = ''
		
		if (this.paymentStatus == 2) {
			this.payType = 8
			title = '支付车辆押金'
		} else if (this.paymentStatus == 4 || this.paymentStatus == 14) {
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
				 businessType: 2,
				 payType: this.payType,
			}
			const result = await this.$getRequest(this.$url.selectPaymentDetailList, 'POST', params)
			if(result.code == 0){
				this.total = result.data.totalPayment
				this.remainder = result.data.remainPayment
				this.list = result.data.details
			}
		},
		
		goDetailPage() {
			uni.reLaunch({
				url: `/pagesOrder/order-detail/order-detail?orderId=${this.orderId}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.page {
	width: 100vw;
	padding: 16px 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.pay-status {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.title {
		margin-top: 12px;
		margin-bottom: 8px;
		height: 56rpx;
		font-size: 18px;
		line-height: 56rpx;
		color: #000000;
	}
	.free-tip {
		margin-bottom: 70px;
		height: 48rpx;
		display: flex;
		align-items: center;
		color: #3D3D3D;
		font-size: 14px;
	}
	.bank-tip {
		margin-bottom: 32px;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
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