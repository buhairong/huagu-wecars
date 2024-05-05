<template>
	<view class="wrap" v-if="detail">
		<view class="header">
			<view :style="{ height: custom.top + 'px' }"/>
			
			<view class="back-btn" @click="back">
				<u-icon name="arrow-left" color="#ffffff" size="48"></u-icon>
			</view>
			
			<view class="account-wrap">
				<view class="left">
					<view class="account-tip">佣金余额</view>
					<view class="account">{{totalMoney | $numFormat}} 元</view>
				</view>
				<view class="right" @click="cardInfo" v-if="userInfo.roleId != 1">
					 银行卡
					<u-icon name="arrow-right" color="#ffffff" size="32"></u-icon>
				</view>
			</view>
		</view>
		
		<view class="container" v-if="list.length">
			<view class="title">佣金记录</view>
			<view class="list-wrap">
				<view class="record" v-for="(item, index) in list" :key="index">
					<view class="record-item">
						<view>
							<view>{{ accountObj[item.type].title }}</view>
						</view>
						<view>{{ accountObj[item.type].operator }}{{item.total | $numFormat}}</view>
					</view>
					<view class="record-item" style="margin-top:8px;">
						<view class="time">{{item.createdTime}}</view>
						<view class="status" :class="{'error-status': item.type === 2 && item.status === 0}" v-if="item.type === 2">{{BROKERAGE_RISK[item.status]}}</view>
					</view>
				</view>
			</view>
		</view>
		<u-empty v-else-if="errMsg" :text="errMsg" mode="list"></u-empty>
		
		<view class="fixed-buttom-disabled-btn">
			<button @click="bindCard" v-if="isNeedBindCard">绑定银行卡</button>
			<button @click="goCashPage" v-else-if="totalMoney">立即提现</button>
		</view>
	</view>
</template>

<script>
const app = getApp()

export default {
	data() {
		return {
			list: [],
			totalMoney: 0,
			errMsg: '',
			detail: null,
			userId: null,
			custom: app.globalData.custom,
			commissionTotal: 0,
			BROKERAGE_RISK: {
			    0: '信息有误',
			    1: '已放款',
			    2: '待放款',
			},
			userInfo: null,
			isManager: false,
			accountObj: {
				1: { title: '订单返佣', operator: '+'},
				2: { title: '提现', operator: '-'},
				3: { title: '支付会员年费', operator: '-'},
				4: { title: '任务奖励', operator: '+'},
				5: { title: '合伙人返佣', operator: '+'},
			},
		}
	},
	
	computed: {
		isNeedBindCard() {
			let res = true
			
			if (this.userInfo && this.detail) {
				if (this.userInfo.partnerType === 1) {
					if (this.detail.partnerEntity.idcard && this.detail.partnerBankCardEntityList.length) {
						res = false
					}
				}
				
				if (this.userInfo.partnerType === 2) {
					if (this.userInfo.roleId == 1) {
						res = false
					} else if (this.detail.partnerEntity.idcard && this.detail.partnerBankCardEntityList.length) {
						res = false
					}
				}
			}
			
			return res
		},
		
		isNeedPayPartnerVip() {
			let res = true
			
			let currentTime = ''
			let endTime = ''
			
			if (this.userInfo) {
				if (this.userInfo.partnerVipEndTime) {
					currentTime = new Date().getTime()
					endTime = new Date(this.userInfo.partnerVipEndTime).getTime()
				}
				if (this.userInfo.isPartnerVip === 1) {
					if (currentTime > endTime) {
						if (this.userInfo.partnerType === 1 && !this.userInfo.secondYearRole) {
							res = false
						}
						
						if (this.userInfo.partnerType === 2 && !this.userInfo.staffSecondYearRole) {
							res = false
						}
					} else {
						res = false
					}
				} else {
					if (this.userInfo.partnerType === 1 && !this.userInfo.firstYearRole) {
						res = false
					}
					
					if (this.userInfo.partnerType === 2 && !this.userInfo.staffFirstYearRole) {
						res = false
					}
				}
			}
			
			return res
		},
	},
	
	onLoad(options) {
		this.userId = options.userId
	},
	
	onShow() {
		this.selectListOfUserId()
		this.getBindInfo()
		
		const isLogin = uni.getStorageSync('isLogin')
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				this.userInfo = data
				// this.userInfo.isPartnerVip = 0
				
				if (this.userInfo.partnerType === 2) {
					this.isManager = this.userInfo.roleId <= 20
				}
				
				this.getCommissionTotal()
			})
		}
	},
	
	methods: {
		back() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		async getCommissionTotal() {
			const params = {
				userId: this.userId,
			}
			
			if (this.isManager) {
				params.partnerCompanyId = this.userInfo.partnerCompanyId
				params.role = this.userInfo.roleId
			}
			
			const res = await this.$getRequest(this.$url.getCommissionTotal, "GET", params)
			
			if (res.code == 0) {
				this.totalMoney = res.data
			}
		},
		
		async selectListOfUserId() {
			const params = {
				userId: this.userId,
			}
			
			const res = await this.$getRequest(this.$url.getCashList, "POST", params)
			
			if (res.code == 0 && res.data) {
				this.list = res.data
				if (this.list.length === 0) {
					this.errMsg = '暂无记录'
				}
			}
		},
		
		async getBindInfo() {
			const params = {
				userId: this.userId,
			}
			
			const res = await this.$getRequest(this.$url.getBindInfo, "GET", params)
			
			if (res.code == 0) {
				this.detail = res.data
				//res.data.partnerBankCardEntityList[0].valid = 0
				if (res.data.partnerBankCardEntityList.length && res.data.partnerBankCardEntityList[0].valid == 0) {
					uni.showModal({
						title: '提示',
						content: `您绑定的银行卡信息错误，请重新绑定正确的银行卡信息后再次发起提现申请。`,
						confirmText: '重新绑定',
						success: async (res) => {
							if (res.confirm) {
								this.goBindCardPage()
							}
						}
					})
				}
			}
		},
		
		bindCard() {
			if (this.detail.partnerEntity.idcard) {
				this.goBindCardPage()
			} else {
				uni.navigateTo({
					url: `/partner/identity/identity?userId=${this.userId}`,
				})
			}
		},
		
		goCashPage() {
			if (this.isNeedPayPartnerVip) {
				uni.showModal({
					title: '提示',
					content: '为确保您具有全民合伙人的身份和权益，请先支付全民合伙人会员费用后，再进行提现操作。',
					showCancel: true,
					cancelText: '稍后再说',
					confirmText: '去支付',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: `/partner/cash/payVip?userId=${this.userId}&partnerVipEndTime=${this.userInfo.partnerVipEndTime}&totalMoney=${this.totalMoney}&openid=${this.userInfo.xcxOpenid}`,
							})
						}
					},
					fail: (err) => {
						console.log('fail', err)
					}
				})
			} else {
				const partnerCompany = this.userInfo.partnerCompany || ''
				const companyId = this.userInfo.partnerCompanyId || ''
				uni.navigateTo({
					url: `/partner/cash/cashMoney?totalMoney=${this.totalMoney}&userId=${this.userId}&partnerCompany=${partnerCompany}&companyId=${companyId}`,
				})
			}
		},
		
		cardInfo() {
			if (this.detail.partnerBankCardEntityList.length) {
				uni.navigateTo({
					url: `/partner/card/cardinfo?bankAccountId=${this.detail.partnerBankCardEntityList[0].bankCardNo}&bankName=${this.detail.partnerBankCardEntityList[0].bankName}&userId=${this.userId}`,
				})
			} else {
				this.bindCard()
			}
		},
		
		goBindCardPage() {
			uni.navigateTo({
				url: `/partner/card/bindcard?realName=${this.detail.partnerEntity.realName}&userId=${this.userId}`,
			})
		},
		
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.wrap {
	width: 100vw;
	min-height: 100vh;
	.header {
		width: 100vw;
		height: 400rpx;
		background: #31C37B;
		.back-btn {
			width: 88rpx;
			height: 64rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.account-wrap {
			margin-top: 80rpx;
			padding-left: 36rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				.account-tip {
					height: 48rpx;
					font-size: 28rpx;
					line-height: 48rpx;
					color: #FFFFFF;
				}
				.account {
					height: 72rpx;
					font-size: 52rpx;
					line-height: 72rpx;
					color: #FFFFFF;
				}
			}
			.right {
				padding-right: 32rpx;
				color: #FFFFFF;
				font-size: 28rpx;
				display: flex;
				align-items: center;
			}
		}
	}
	
	.container {
		padding: 40rpx 32rpx 200rpx;
		.title {
			margin-bottom: 16px;
			height: 48rpx;
			font-size: 16px;
			line-height: 48rpx;
			color: #3D3D3D;
		}
		.record {
			margin-bottom: 12px;
			padding: 20px 32rpx;
			box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04),0px 4px 24px 0px rgba(10, 15, 45, 0.04);
			border-radius: 16rpx;
			.record-item {
				height: 44rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #333333;
				font-size: 16px;
				.time {
					font-size: 12px;
					color: #999999;
				}
				.status {
					font-size: 14px;
				}
				.error-status {
					color: #EA0000;
				}
			}
		}
	}
}

::v-deep .u-empty {
	margin-top: 80rpx !important;
}
</style>
