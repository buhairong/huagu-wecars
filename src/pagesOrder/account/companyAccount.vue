<template>
	<view class="page-wrap1">
		<view class="company-name">{{companyName}}</view>
		<view class="header">
			<view class="left">
				<view class="account">
					<view class="title">充值余额：</view>
					<view class="price">{{formatThousandNumber(rechargeAmount)}}元</view>
				</view>
				<view class="account">
					<view class="title">赠送余额：</view>
					<view class="price">{{formatThousandNumber(giftAmount)}}元</view>
				</view>
				<view class="account">
					<view class="title">可用余额：</view>
					<view class="price">{{formatThousandNumber(balance)}}元</view>
				</view>
			</view>
			<view class="right">
				<view class="text-btn" style="margin-right: 32rpx;" @click="handleExchange">
					兑换码
				</view>
				<view @click="goRechargePage">
					充值
					<u-icon name="arrow-right" color="#ffffff" size="28" ></u-icon>
				</view>
			</view>
		</view>
		
		<view class="tips">
			<view class="tip">充值 <text class="price">{{formatThousandNumber(50000)}}</text> 元，赠送 <text class="price">{{formatThousandNumber(10000)}}</text> 元</view>
			<view class="tip">充值 <text class="price">{{formatThousandNumber(80000)}}</text> 元，赠送 <text class="price">{{formatThousandNumber(15000)}}</text> 元</view>
			<view class="tip">充值 <text class="price">{{formatThousandNumber(100000)}}</text> 元，赠送 <text class="price">{{formatThousandNumber(20000)}}</text> 元</view>
			<view class="tip">
				邀请新用户注册，赠送 <text class="price">{{formatThousandNumber(100)}}</text> 元
				<view class="text-btn" @click="invite">去邀请</view>
			</view>
		</view>
		
		<u-popup border-radius="14" mode="center" v-model="showPopup" @close="close">
			<view class="popup-wrap">
				<view class="item">
					<input
						class="input"
						v-model="code"
						placeholder="请输入兑换码"
					/>
				</view>
				
				<view class="btn-wrap">
					<view class="btn" @click="handleComfirm">
						确定
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	
	export default {
		data() {
			return {
				userId: '',
				companyId: '',
				companyName: '',
				detail: null,
				rechargeAmount: 0,
				giftAmount: 0,
				balance: 0,
				list: [],
				code: '',
				showPopup: false,
			}
		},
		
		onLoad(option) {
			this.userId = option.userId
			this.companyId = option.companyId
			this.companyName = option.companyName
		},
		
		onShow() {
			this.getList()
		},
		
		methods: {
			formatThousandNumber(price) {
				return formatThousandNumber(price)
			},
			
			getList() {
				uni.showLoading({
				  title: '加载中'
				});
				this.$getRequest(this.$url.getCompanyList, "GET", {
				  userId: this.userId,
				  page: 1,
				  limit: 100,
				}).then(res => {
					uni.hideLoading()
					if(res.data) {
						const company = res.data.find(item => this.companyId == item.companyId)
						if (company?.userCompanyEntity?.userCompanyAccountEntity) {
							this.rechargeAmount = company.userCompanyEntity.userCompanyAccountEntity.rechargeAmount || 0
							this.giftAmount = company.userCompanyEntity.userCompanyAccountEntity.giftAmount || 0
							this.balance = company.userCompanyEntity.userCompanyAccountEntity.balance || 0
						}
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			goRechargePage() {
				uni.navigateTo({
					url: `/pagesOrder/account/recharge?type=2&userId=${this.userId}&companyId=${this.companyId}`
				})
				
			},
			
			invite() {
				uni.navigateTo({
					url: `/pagesOrder/qrcode/qrcode?type=2&userId=${this.userId}&companyId=${this.companyId}&companyName=${this.companyName}`
				})
			},
			
			handleExchange() {
				this.showPopup = true
			},
			
			close() {
				this.showPopup = false
			},
			
			handleComfirm() {
				if(!this.code) {
					uni.showToast({
						title: '请输入兑换码',
						duration: 2000,
						icon: 'none'
					})
					return false;
				}
				
				uni.showLoading({
					title: '加载中'
				})
				
				this.$getRequest(this.$url.exchangeCode, "GET", {
					exchangeUserId: this.userId,
					exchangeCompanyId: this.companyId,
					code: this.code,
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						uni.showToast({
							title: '兑换成功',
							duration: 2000,
							icon: "none"
						})
						this.getList()
						this.showPopup = false
						this.code = ''
					} else {
						uni.showToast({
							title: res.msg || '兑换失败',
							duration: 2000,
							icon: "none"
						})
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.company-name {
	line-height: 44rpx;
	font-size: 32rpx;
	color: #0A0F2D;
	font-weight: 500;
	margin-bottom: 32rpx;
}
	
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
	padding: 0 32rpx;
	width: 100%;
	height: 200rpx;
	background: #31C37B;
	color: #FFFFFF;
	.account {
		margin-top: 16rpx;
		display: flex;
		align-items: center;
		&:first-child {
			margin-top: 0;
		}
	}
	.title {
		font-size: 28rpx;
		color: #FFFFFF;
	}
	.price {
		font-size: 32rpx;
		color: #FFFFFF;
	}
	.right {
		display:flex;
		align-items: center;
	}
}

.tips {
	margin-top: 32rpx;
	.tip {
		margin-bottom: 16rpx;
		font-size: 28rpx;
		line-height: 44rpx;
		color: rgba(78, 89, 105, 0.6);
		display: flex;
		align-items: center;
		.price {
			padding: 0 8rpx;
			color: #111;
			font-size: 32rpx;
			font-weight: 500;
		}
	}
}

.text-btn {
	margin-left: 32rpx;
	font-size: 28rpx;
	color: #4170EE;
	text-decoration: underline;
}

.popup-wrap {
	padding: 48rpx;
	width: 560rpx;
	.item {
		margin-bottom: 32rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		font-size: 14px;
		.item-title {
			color: #64696F;
			width: 120rpx;
			text-align: right;
		}
		.item-content {
			color: #141414;
		}
	}
	.btn-wrap {
		margin-top: 80rpx;
		.btn {
			width: 100%;
			height: 80rpx;
			border-radius: 16rpx;
			background: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			color: #FFFFFF;
		}
	}
}
</style>