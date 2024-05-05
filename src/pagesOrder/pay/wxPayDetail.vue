<template>
	<view class="page">
		<view class="price">
			<view class="unit">￥</view>{{total | $numFormat}}
		</view>
		
		<view class="info-card">
			<view class="item">
				<view class="item-title">支付时间：</view>
				<view class="item-content">{{detail.createTime}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">交易单号：</view>
				<view class="item-content">{{detail.wxOrderNum}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">商户单号：</view>
				<view class="item-content">{{detail.orderNum}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: '',
			id: '',
			payType: '',
			detail: {},
			total: 0,
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.id = options.id
		this.payType = options.payType
		
		this.selectPaymentDetail()
		
	},
	
	methods: {
		async selectPaymentDetail(){
			const params = {
				 id: this.id,
				 payType: this.payType,
			}
			const result = await this.$getRequest(this.$url.selectPaymentDetail, 'GET', params)
			if(result.code == 0){
				this.total = result.data.total
				this.detail = result.data
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.page {
	width: 100vw;
	padding: 32px 32rpx;
	.price {
		margin-bottom: 32px;
		height: 96rpx;
		font-size: 32px;
		color: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		.unit {
			font-size: 22px;
			transform: translateY(10rpx);
		}
	}
	
	.info-card {
		width: 100%;
		padding: 20px 32rpx;
		border-radius: 24rpx;
		box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.04);
		.item {
			width: 100%;
			margin-bottom: 8px;
			font-size: 14px;
			display: flex;
			.item-title {
				flex: 1;
				line-height: 44rpx;
				color: #64696F;
			}
			.item-content {
				width: 458rpx;
				color: #0A0F2D;
				line-height: 44rpx;
				word-wrap: break-word;   
				word-break: normal; 
			}
		}
	}
}
</style>