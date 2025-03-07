<template>
	<view class="page-wrap">
		<view class="tip1">充值金额</view>
		
		<view class="cash-item">
			<view class="unit">￥</view>
			<input
				v-model="money"
				class="input"
				type="digit"
				inputmode="decimal"
				placeholder="请输入充值金额"
				placeholder-style="font-size:14px;color:#A4AEBB;"
				@input="handleInput"
			/>
		</view>
		
		<view class="money-list">
			<view 
				v-for="item in moneyList"
				:key="item.id"
				class="tag"
				:class="{active: item.id === currentTag}"
				@click="changeTag(item)"
			>
				¥{{item.money | $numFormat}}
			</view>
		</view>
		
		<view class="tips">
			<view class="tip">充值 <text class="price">{{formatThousandNumber(50000)}}</text> 元，赠送 <text class="price">{{formatThousandNumber(10000)}}</text> 元</view>
			<view class="tip">充值 <text class="price">{{formatThousandNumber(80000)}}</text> 元，赠送 <text class="price">{{formatThousandNumber(15000)}}</text> 元</view>
			<view class="tip">充值 <text class="price">{{formatThousandNumber(100000)}}</text> 元，赠送 <text class="price">{{formatThousandNumber(20000)}}</text> 元</view>
		</view>
		
		<view class="buttom-disabled-btn">
			<button :disabled="disabled" @click="save">立即充值</button>
		</view>
		
		
	</view>
</template>

<script>
import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	
export default {
	data() {
		return {
			type: '', // 1.个人 2.公司
			userId: '',
			companyId: '',
			userInfo: {},
			moneyList: [
				{ id: 1, money: 50000, },
				{ id: 2, money: 80000, },
				{ id: 3, money: 100000, },
			],
			money: undefined,
			currentTag: '',
		}
	},
	
	computed: {
		disabled() {
			return !this.money
		},
	},
	
	onLoad(option) {
		this.type = option.type
		this.userId = option.userId
		this.companyId = option.companyId
	},
	
	onShow() {
		
	},
	
	methods: {
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
		
		changeTag(item) {
			this.currentTag = item.id
			this.money = item.money
		},
		
		handleInput() {
			this.currentTag = ''
		},
		
		save() {
			// businessType 0租车、1长租产品、2新车订阅、3购买二手车、4团购、5会员、6、购买服务 7.竞拍
			// payType 0余额、1押金、2订金、3尾款、4长租费用（包月或季）、6二手车、7支付年费、8订阅费用、9租车租金、10租车押金
			uni.navigateTo({
				url: `/pagesOrder/rental/pay/chooseRentalPay?orderId=-1&price=${this.money}&businessType=7&payType=0&openid=${this.userInfo.xcxOpenid}&userId=${this.userInfo.id}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.cash-item {
	margin-bottom: 16px;
	height: 120rpx;
	border-bottom: 2rpx solid #E6E6E6;
	display: flex;
	align-items: center;
	.unit {
		padding-right: 32rpx;
		color: #333333;
		font-size: 48rpx;
	}
	.input {
		width: 0;
		flex: 1;
		background: transparent;
		padding: 0;
	}
}

.money-list {
	display: flex;
	flex-wrap: wrap;
	.tag {
		margin-right: 24rpx;
		padding: 0 16rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 4rpx;
		border: 2rpx solid #000000;
		color: rgba(61, 61, 61, 0.6);
		font-size: 28rpx;
	}
	.active {
		border-color: #4170EE;
	}
}

.buttom-disabled-btn {
	margin-top: 200rpx;
}

.tips {
	margin-top: 32rpx;
	.tip {
		margin-bottom: 16rpx;
		font-size: 28rpx;
		line-height: 44rpx;
		color: rgba(78, 89, 105, 0.6);
		.price {
			padding: 0 8rpx;
			color: #111;
			font-size: 32rpx;
			font-weight: 500;
		}
	}
}
</style>