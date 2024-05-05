<template>
	<u-popup border-radius="14" mode="bottom" v-model="showPopup" closeable="true" @close="close">
		<view class="popup-wrap">
			<view class="title">费用规则</view>
			<view class="container">
				<view class="item">
					<view class="item-title">租车周期：</view>
					<view class="item-content">{{paymentItem.period/30}}个月</view>
				</view>
				<view class="item">
					<view class="item-title">租车费用（含税）：</view>
					<view class="item-middle">（¥ {{(paymentItem.money+(plateNumFee || 0)) | $numFormat}}/月）</view>
					<view class="item-content">￥{{(paymentItem.totalMoney + (paymentItem.period/30*plateNumFee)) | $numFormat}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">支付方式：</view>
					<view class="item-content">期初按月支付</view>
				</view>
				
				<view class="item">
					<view class="item-title">租车押金：</view>
					<view class="item-content">￥{{paymentItem.depositDetail | $numFormat}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">退回规则：</view>
					<view class="item-content">还车后原路退回</view>
				</view>
				
				<view class="item">
					<view class="item-title">取送车服务费：</view>
					<view class="item-content">￥{{0 | $numFormat}}</view>
				</view>
			</view>
		
			<view class="total">
				<view class="item">
					<view class="item-title">提车需付：</view>
					<view class="item-content">
						<view class="total-wrap">
							<view class="unit">￥</view>
							<view class="total-price">{{(paymentItem.totalPay+(plateNumFee || 0)) | $numFormat}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		showPopup: {
			type: Boolean,
			default: false,
		},
		
		paymentItem: {
			type: Object,
			default: () => ({}),
		},
		
		plateNumFee: {
			type: Number,
			default: 0,
		},
	},
	
	data(){
		return {
			
		}
	},
	
	mounted() {
		
	},
	
	methods: {
		close() {
			this.$emit('close')
		},
	}
}
</script>

<style lang="scss" scoped>
.popup-wrap {
	padding: 64rpx 64rpx 120rpx;
	.title {
		height: 60rpx;
		font-size: 20px;
		line-height: 60rpx;
		color: #141414;
		text-align: center;
		margin-bottom: 32px;
	}
	.container {
		padding-bottom: 16px;
		margin-bottom: 16px;
		border-bottom: 2rpx solid #EEEEEE;
	}
	.item {
		margin-top: 8px;
		height: 44rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		.item-title {
			color: #64696F;
		}
		.item-middle {
			color: #BFBFBF;
		}
		.item-content {
			color: #141414;
		}
	}
	.total-wrap {
		display: flex;
		.unit {
			transform: translateY(4rpx);
		}
		.total-price {
			font-size: 16px;
			font-weight: 500;
		}
	}
}
</style>