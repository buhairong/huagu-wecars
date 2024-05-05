<template>
	<u-popup border-radius="14" mode="center" v-model="showPopup" @close="close">
		<view class="popup-wrap">
			<view class="title">费用明细</view>
			<view class="container">
				<view class="item">
					<view class="item-title">订阅费用</view>
					<view class="item-content">￥{{totalPayment | $numFormat}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">牌照费用</view>
					<view class="item-content">￥{{carPlatePay | $numFormat}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">保险费用</view>
					<view class="item-content">￥{{premiumPay | $numFormat}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">增配项费用</view>
					<view class="item-content">￥{{configTotalMoney | $numFormat}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">精品/装潢费用</view>
					<view class="item-content">￥{{decorateMoney | $numFormat}}</view>
				</view>
			</view>
		
			<view class="total">
				<view class="item">
					<view class="item-title">总计</view>
					<view class="item-content">
						<view class="total-wrap">
							<view class="unit">￥</view>
							<view class="total-price">{{(totalPayment+carPlatePay+premiumPay+configTotalMoney+decorateMoney) | $numFormat}}</view>
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
		totalPayment: {
			type: Number,
			default: 0,
		},
		
		carPlatePay: {
			type: Number,
			default: 0,
		},
		
		premiumPay: {
			type: Number,
			default: 0,
		},
		
		configTotalMoney: {
			type: Number,
			default: 0,
		},
		
		decorateMoney: {
			type: Number,
			default: 0,
		},
	},
	
	data(){
		return {
			showPopup: false,
		}
	},
	
	mounted() {
		this.showPopup = true
	},
	
	methods: {
		close() {
			this.showPopup = false
			this.$emit('close')
		},
		
	}
}
</script>

<style lang="scss" scoped>
.popup-wrap {
	padding: 32px 64rpx;
	width: 594rpx;
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