<template>
	<view class="page-wrap">
		<view class="tip1">提现金额</view>
		
		<view class="cash-item">
			<view class="unit">￥</view>
			<input
				v-model="money"
				class="input"
				type="digit"
				inputmode="decimal"
				:placeholder="`当前可提现${totalMoney}元`"
				placeholder-style="font-size:14px;color:#A4AEBB;"
			/>
			<view class="cash-all" @click="cashAll">全部提现</view>
		</view>
		
		<view class="tip1">预估提现扣 {{tax}} 元</view>
		
		<view class="buttom-disabled-btn">
			<button :disabled="disabled" @click="cashMoney">提现</button>
		</view>
		
		<u-popup v-model="showPopup" mode="center" border-radius="14">
			<view class="popupWrap">
				<u-icon name="checkmark-circle-fill" color="#00C777" size="120"></u-icon>
				<view class="text">提现成功</view>
				<view class="popup-tip">我们将在三个工作日内处理您的提现申请</view>
				<view class="btn" @click="goCashHomePage">完成</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			totalMoney: 0,
			tax: 0,
			money: undefined,
			showPopup: false,
			userId: null,
			partnerCompany: '',
			companyId: '',
		}
	},
	
	computed: {
		disabled() {
			return !this.money
		},
	},
	
	onLoad(options) {
		this.totalMoney = options.totalMoney - 0
		this.userId = options.userId
		this.partnerCompany = options.partnerCompany
		this.companyId = options.companyId
	},
	
	methods: {
		cashAll() {
			this.money = this.totalMoney
		},
		
		async cashMoney() {
			if(this.money - 0 > this.totalMoney) {
				uni.showToast({
					title: '提现金额不能大于余额',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			const params = {
				total: this.money,
				type: 2,
				userId: this.userId,
				commissionTotal: this.totalMoney,
				companyName: this.partnerCompany,
				companyId: this.companyId,
			}
			
			uni.showLoading({
				title: '保存中'
			})
			const res =  await this.$getRequest(this.$url.addCash, 'POST', params)
			uni.hideLoading()
			if (res.code === 0) {
				this.showPopup = true
			}
		},
		
		goCashHomePage() {
			uni.navigateBack({
				delta: 1
			})
			this.showPopup = false
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.tip1 {
	height: 40rpx;
	font-size: 14px;
	line-height: 40rpx;
	color: #333333;
}

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
	}
	.cash-all {
		padding-left: 32rpx;
		height: 100%;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333333;
	}
}

.buttom-disabled-btn {
	margin-top: 200rpx;
}

.popupWrap {
	width: 560rpx;
	padding: 40px 64rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.text {
		margin-top: 16px;
		height: 56rpx;
		font-size: 18px;
		line-height: 56rpx;
		color: #1D2129;
	}
	.popup-tip {
		margin-top: 12px;
		font-size: 12px;
		line-height: 34rpx;
		color: #999999;
	}
	.btn {
		margin-top: 60px;
		width: 100%;
		height: 90rpx;
		border-radius: 16rpx;
		background: #31C37B;
		font-size: 16px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>