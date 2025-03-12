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
			userInfo: {},
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
		const isLogin = uni.getStorageSync('isLogin')
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				this.userInfo = data
			})
		}
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
		
		async handlePay(businessId) {
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
				businessId, // 订单ID
				businessType: 20,
				openid: this.userInfo.xcxOpenid,
				payType: 20,
				total: this.money,
				//total: 0.01,
				userId: this.userId,
				companyId:this.companyId
			}, async (res) => {
				if(res === 'success') {
					uni.navigateBack({
						delta: 1
					});
				}
			})
			
			uni.hideLoading()
		},
		
		save() {
			uni.showLoading({
			  title: '加载中'
			});
			this.$getRequest(this.$url.saveMemberUserRechargeOrder, "POST", {
				orderType: this.type,
				userId: this.userId,
				companyId: this.companyId,
				mobile: this.userInfo.mobile,
				rechargeAmount: this.money,
			}).then(res => {
				uni.hideLoading()
				if(res.code == 0) {
					this.handlePay(res.data.id)
				} else {
					uni.showToast({
						title: res.msg || '充值失败',
						duration: 2000,
						icon: "none"
					})
				}
			}).catch(() => {
				uni.hideLoading()
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