<template>
	<view class="wrap">
		<view
			class="status-bar"
			:style="{ height: custom.top + 'px' }"
		/>
		<view class="header">
			<view class="back-btn" @click="back">
				<u-icon name="arrow-left" color="#fff" size="48"></u-icon>
			</view>
			<view class="title-wrap">
				<view class="title">全民合伙人年度会员</view>
				<view class="sub-title">让有车生活 · 更简单</view>
			</view>
		</view>
		
		<view class="container">
			<view class="card">
				<view class="price-wrap">
					¥ 
					<view class="price">
						{{ partnerVipPay | $numFormat }}
					</view>
					/年
				</view>
				
				<view class="period-date">
					有效期至 {{ partnerVipEndTime }}
				</view>
			</view>
			
			<view class="rules">
				<view class="item">
					<view class="title-wrap">
						<image
							class="green-arrow"
							src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
							mode="widthFix"
						/>
						会员费用
					</view>
					<view class="rule-item">加入WECARS全民合伙人计划需要支付{{partnerVipPay | $numFormat}}元/年的会员费用。会员费用的支付是成为合伙人的必要条件。</view>
				</view>
				
				<view class="item">
					<view class="title-wrap">
						<image
							class="green-arrow"
							src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
							mode="widthFix"
						/>
						退费规则
					</view>
					<view class="rule-item">如果在一年内未能成功完成订阅订单，我们将原路返还您已支付的会员费用。</view>
				</view>
				
				<view class="item">
					<view class="title-wrap">
						<image
							class="green-arrow"
							src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
							mode="widthFix"
						/>
						提现规定
					</view>
					<view class="rule-item">会员费用需要在提现之前进行支付，以确保您具有正常的合伙人身份和权益。如果会员费用未支付，将无法进行提现操作。</view>
				</view>
			</view>
			
			<view class="btn" @click="handleClick">立即开通</view>
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { partnerVipPay } from '@/constants'

const app = getApp()
export default {
	data() {
		return {
			custom: app.globalData.custom,
			partnerVipPay,
			userId: '',
			partnerVipEndTime: '',
			totalMoney: 0,
			openid: '',
		}
	},
	onLoad(options) {
		this.userId = options.userId
		this.openid = options.openid
		this.totalMoney = options.totalMoney - 0
		this.partnerVipEndTime = dayjs(options.partnerVipEndTime).format('YYYY年MM月DD日')
	},
	
	methods: {
		back() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		handleClick() {
			if (this.totalMoney >= partnerVipPay) {
				this.cashMoney()
			} else {
				this.handlePay()
			}
		},
		
		async cashMoney() {
			const params = {
				total: partnerVipPay,
				type: 3,
				userId: this.userId,
				commissionTotal: this.totalMoney,
			}
			
			uni.showLoading({
				title: '保存中'
			})
			const res =  await this.$getRequest(this.$url.addCash, 'POST', params)
			uni.hideLoading()
			if (res.code === 0) {
				getApp().globalData.userInfo.isPartnerVip = 1
				this.back()
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
				businessId: -1, // 订单ID
				businessType: 5, // 支付类型 0充值、1长租产品、2新车订阅、3购买二手车、4团购、5会员、6、购买服务
				openid: this.openid,
				payType: 11, // 业务类型 // 0余额、1押金、2订金、3尾款、4长租费用（包月或季）、6二手车、7支付年费、8订阅费用、 11.合伙人年费
				total: partnerVipPay,
				//total: 0.01,
				userId: this.userId,
			}, async (res) => {
				if(res == 'success') {
					getApp().globalData.userInfo.isPartnerVip = 1
					this.back()
				}
			})
			
			uni.hideLoading()
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding-bottom: 100rpx;
	.header {
		width: 100vw;
		height: 666rpx;
		background: linear-gradient(180deg, #31C37B 86%, rgba(196, 196, 196, 0) 100%);
		display: flex;
		justify-content: center;
		align-items: center;
		.title-wrap {
			display: flex;
			flex-direction: column;
			align-items: center;
			.title {
				height: 44rpx;
				font-size: 40rpx;
				font-weight: 600;
				line-height: 44rpx;
				color: #FFFFFF;
			}
			.sub-title {
				margin-top: 24rpx;
				height: 40rpx;
				font-size: 24rpx;
				font-weight: 500;
				line-height: 40rpx;
				text-align: center;
				color: #FFFFFF;
			}
		}
		.back-btn {
			width: 48rpx;
			height: 48rpx;
			position: fixed;
			top: 90rpx;
			left: 30rpx;
		}
	}
	.container {
		margin: -210rpx 32rpx 0;
		.card {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			.price-wrap {
				display: flex;
				align-items: baseline;
				color: #31C37B;
				font-size: 32rpx;
				.price {
					padding-left: 8rpx;
					font-size: 48rpx;
					font-weight: 500;
				}
			}
			.period-date {
				margin-top: 50rpx;
				height: 44rpx;
				font-size: 28rpx;
				line-height: 44rpx;
				color: rgba(10, 15, 45, 0.5);
			}
		}
		.rules {
			margin-top: 64rpx;
			.item {
				margin-bottom: 50rpx;
				.title-wrap {
					margin-bottom: 16rpx;
					display: flex;
					align-items: center;
					color: rgba(10, 15, 45, 0.8);
					font-size: 28rpx;
					.green-arrow {
						margin-right: 24rpx;
						width: 24rpx;
					}
				}
				.rule-item {
					margin-left: 48rpx;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #666666;
				}
			}
		}
		.btn {
			margin-top: 80rpx;
			height: 100rpx;
			border-radius: 50rpx;
			background: #31C37B;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
}
</style>