<template>
	<view class="wrap" v-if="userInfo">
		<view class="header">
			<view :style="{ height: custom.top + 'px' }"/>
			
			<view class="back-btn" @click="goHome">去首页</view>
			
			<view class="account-wrap">
				<template v-if="userInfo.partnerType === 1 || userInfo.roleId === 30">
					<view class="left" @click="goCashHome">
						<view class="account-tip">佣金账户</view>
						<view class="account">{{commissionTotal | $numFormat}} 元</view>
					</view>
					<view class="right" @click="goQrCodePage">
						<image
							style="width: 52rpx;"
						  src="https://image.51cheyaoshi.com/xcx/app/static/partner/qrcode_white_icon.png"
							mode="widthFix"
						/>
						<view class="invite-text">邀请合伙人</view>
					</view>
				</template>
				<template v-else>
					<view class="company-left">
						<view class="userinfo">
							<view class="nickname">{{ userInfo.nickname || '微信用户' }}</view>
							<view class="role">{{ partnerCompanyRoleStatus[userInfo.roleId] }}</view>
						</view>
						<view class="company-name">{{ userInfo.partnerCompany }}</view>
					</view>
					<view class="company-right" @click="goCashHome">
						<view class="account">{{commissionTotal | $numFormat}} 元</view>
						<view class="account-tip">佣金账户</view>
					</view>
				</template>
			</view>
		</view>
		
		<template v-if="userInfo.partnerType === 1 || userInfo.roleId === 30">
			<view class="container">
				<view class="search-header">
					<view class="tabs">
						<view 
							v-for="tab in tabs"
							:key="tab.id"
							class="tab"
							:class="{'tab-active': tab.id === activeTab}"
							@click="changeTab(tab.id)"
						>
							<view class="line" v-if="tab.id == activeTab"></view>
							{{tab.label}}
						</view>
					</view>
					<!-- <view class="get-customer" @click="getCustomer" v-if="customerList.list.length || orderList.list.length">
						获取客户 
						<u-icon name="info-circle" size="32" color="rgba(10, 15, 45, 0.5)"></u-icon>
					</view> -->
				</view>
				
				<view class="list" v-if="activeTab === 1">
					<scroll-view 
						:scroll-top="customerList.scrollTop" 
						scroll-y="true" 
						class="scroll-Y"
						@scroll="customerScroll"
					>
						<CustomerList :customerList="customerList" />
					</scroll-view>
				</view>
				
				<view class="list" v-if="activeTab === 2">
					<scroll-view
						:scroll-top="orderList.scrollTop" 
						scroll-y="true" 
						class="scroll-Y"
						@scroll="orderScroll"
					>
						<OrderList :orderList="orderList" />
					</scroll-view>
				</view>
				
				<view class="list" v-if="activeTab === 3">
					<scroll-view
						:scroll-top="partnerList.scrollTop" 
						scroll-y="true" 
						class="scroll-Y"
						@scroll="partnerScrollTop"
					>
						<PartnerList :partnerList="partnerList" />
					</scroll-view>
				</view>
			</view>
		</template>
		<template v-else>
			<view class="container">
				<view class="card">
					<view class="item-wrap">
						<view class="item" @click="goCustomPage">
							<view class="img-wrap">
								<image
									style="width:52rpx;"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/home/customer-icon.png"
									mode="widthFix"
								/>
							</view>
							
							<view class="text">客户列表</view>
						</view>
						
						<view class="item" @click="goOrderPage">
							<view class="img-wrap">
								<image
									style="width:45rpx;"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/home/order-icon.png"
									mode="widthFix"
								/>
							</view>
							
							<view class="text">订单列表</view>
						</view>
						
						<view class="item" @click="goStaffPage" v-if="isManager">
							<view class="img-wrap">
								<image
									style="width:62rpx;"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/home/staff-icon.png"
									mode="widthFix"
								/>
							</view>
							
							<view class="text">员工管理</view>
						</view>
						
						<view class="item" @click="goCommissionPage" v-if="isManager">
							<view class="img-wrap">
								<image
									style="width:52rpx;"
									src="https://image.51cheyaoshi.com/xcx/merchant/static/order/commission.png"
									mode="widthFix"
								/>
							</view>
							
							<view class="text">佣金分配</view>
						</view>
						
						<view class="item" @click="goMySubPartnerPage">
							<view class="img-wrap">
								<image
									style="width:66rpx;"
									src="https://image.51cheyaoshi.com/xcx/app/static/partner/partner-icon.png"
									mode="widthFix"
								/>
							</view>
							
							<view class="text">我的合伙人</view>
						</view>
						
						<view class="item" @click="goQrCodePage">
							<view class="img-wrap">
								<image
									style="width:62rpx;"
									src="https://image.51cheyaoshi.com/xcx/app/static/partner/invite-partner-icon.png"
									mode="widthFix"
								/>
							</view>
							
							<view class="text">邀请合伙人</view>
						</view>
					</view>
				</view>
			</view>
		</template>
		
		<!-- <view class="text-link" @click="getCustomer" v-if="customerList.list.length === 0 && orderList.list.length === 0">如何获取客户？</view> -->
		
		<view 
			class="prize-wrap"
			draggable="true"
			@click="goTaskPage"
		>
			<image
				style="width:50rpx;"
				src="https://image.51cheyaoshi.com/xcx/app/static/partner/red-packet.png"
				mode="widthFix"
			/>
			<view class="prize-text" v-if="prize">
				您有{{prize}}元待领取
				<u-icon name="arrow-right" color="#FFAC1C" size="28" style="margin-left:8rpx;"></u-icon>
			</view>
		</view>
		
		
	</view>
</template>

<script>
import { purchaseOrderStatus, partnerCompanyRoleStatus } from '@/constants/index'
import CustomerList from './components/CustomerList.vue'
import OrderList from './components/OrderList.vue'
import PartnerList from './components/PartnerList.vue'

const app = getApp()

export default {
	onShareAppMessage(res) {
		return {
	    title: '车要试 让有车生活·更简单',
	    desc: '',
	    path: this.shareUrl,
	    imageUrl: '',
	  }
	},
	
	components: {
		CustomerList,
		OrderList,
		PartnerList,
	},
	
	data() {
		return {
			shareUrl: '/partner/register/register',
			partnerCompanyRoleStatus,
			purchaseOrderStatus,
			userId: null,
			partnerType: '',
			partnerCompany: '',
			roleId: '',
			custom: app.globalData.custom,
			tabs: [
				{id: 1, label: '客户'},
				{id: 2, label: '订单'},
				{id: 3, label: '我的合伙人'},
			],
			activeTab: 1,
			customerScrollTop: 0,
			orderScrollTop: 0,
			partnerScrollTop: 0,
			customerList: {
				scrollTop: 0,
				list: [],
				limit: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'nomore',
			},
			orderList: {
				scrollTop: 0,
				list: [],
				limit: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'nomore',
			},
			partnerList: {
				scrollTop: 0,
				list: [],
				limit: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'nomore',
			},
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			commissionTotal: 0,
			userInfo: null,
			isManager: false,
			isHasPrize: false,
			prize: '',
		}
	},
	
	onLoad(options) {
		this.shareUrl += `?upUserId=${options.userId}`
		this.userId = options.userId
		this.partnerType = options.partnerType || ''
		this.partnerCompany = options.partnerCompany || ''
		this.roleId = options.roleId || ''
		this.getOrderList()
		this.getDetail()
	},
	
	onShow() {
		const isLogin = uni.getStorageSync('isLogin')
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				this.userInfo = data
				
				if (this.userInfo.partnerType === 2) {
					this.isManager = this.userInfo.roleId <= 20
				}
				
				
				this.getCommissionTotal()
			})
		}
		this.getCustomerList()
		this.getPartnerList()
	},
	
	methods: {
		getDetail() {
			const data = {
				userId: this.userId,
			}
			
			this.$getRequest(this.$url.partnerActivityDetail, "GET", data).then(res => {
				if (res.code === 0) {
					this.prize = res?.data?.claimAmount
				}
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
				this.commissionTotal = res.data
			}
		},
		
		goHome() {
			uni.reLaunch({
				url: '/pages/home/choose-index'
			})
		},
		
		goCashHome() {
			uni.navigateTo({
				url: `/partner/cash/home?userId=${this.userId}`
			})
		},
		
		getCustomer() {
			console.log('getCustomer')
		},
		
		changeTab(id) {
			this.activeTab = id
			this.$nextTick(() => {
				if (id === 1) {
					this.customerList.scrollTop = this.customerScrollTop
				} else if (id === 2) {
					this.orderList.scrollTop = this.orderScrollTop
				} else {
					this.partnerList.scrollTop = this.partnerScrollTop
				}
			})
		},
		
		async getCustomerList() {
			// uni.showLoading({
			// 	title: '加载中'
			// })
			
			let params = {
				...this.customerList,
				userId: this.userId,
			}
			
			const res = await this.$getRequest(this.$url.getPartnerCustomerList, "POST", params)
			
			if (res.code == 0 && res.data && res.data.length) {
				this.customerList.list = res.data
				
				// if (res.data.records && res.data.records.length) {
				// 	this.customerList.list = [...this.customerList.list, ...res.data.records]
				// }
				// if (res.data.pages) {
				// 	this.customerList.totalPages = res.data.pages
				// 	if(this.customerList.page >= this.customerList.totalPages) {
				// 		this.customerList.status = 'nomore'
				// 	}
				// } else {
				// 	this.customerList.errMsg = '暂无客户'
				// }
			} else {
				this.customerList.errMsg = '暂无客户'
			}
			
			uni.hideLoading()
		},
		
		async getPartnerList() {
			// uni.showLoading({
			// 	title: '加载中'
			// })
			
			let params = {
				...this.customerList,
				userId: this.userId,
			}
			
			const res = await this.$getRequest(this.$url.getMyPartnerList, "GET", params)
			
			if (res.code == 0 && res.data && res.data.length) {
				this.partnerList.list = res.data
			} else {
				this.partnerList.errMsg = '暂无合伙人'
			}
			
			uni.hideLoading()
		},
		
		customerScroll(e) {
			this.customerScrollTop = e.detail.scrollTop
		},
		
		customerListBottom() {
			if(this.customerList.page >= this.customerList.totalPages) {
				this.customerList.status = 'nomore'
				return
			}
			this.customerList.status = 'loading'
			++this.customerList.page
			
			this.getCustomerList()
		},
		
		async getOrderList() {
			// uni.showLoading({
			// 	title: '加载中'
			// })
			
			let params = {
				...this.orderList,
				userId: this.userId,
			}
			
			const res = await this.$getRequest(this.$url.getPartnerOrderList, "POST", params)
			
			if (res.code == 0 && res.data && res.data.length) {
				this.orderList.list = res.data
				
				// if (res.data.records && res.data.records.length) {
				// 	this.orderList.list = [...this.orderList.list, ...res.data.records]
				// }
				// if (res.data.pages) {
				// 	this.orderList.totalPages = res.data.pages
				// 	if(this.orderList.page >= this.orderList.totalPages) {
				// 		this.orderList.status = 'nomore'
				// 	}
				// } else {
				// 	this.orderList.errMsg = '暂无订单'
				// }
			} else {
				this.orderList.errMsg = '暂无订单'
			}
			
			uni.hideLoading()
		},
		
		orderScroll(e) {
			this.orderScrollTop = e.detail.scrollTop
		},
		
		orderListBottom() {
			if(this.orderList.page >= this.orderList.totalPages) {
				this.orderList.status = 'nomore'
				return
			}
			this.orderList.status = 'loading'
			++this.orderList.page
			
			this.getOrderList()
		},
		
		goQrCodePage() {
			uni.navigateTo({
				url: `/partner/qrcode/invitePartnerQrcode?userId=${this.userId}`
			})
		},
		
		goCustomPage() {
			uni.navigateTo({
				url: `/partner/company/customer?userId=${this.userId}&partnerCompanyId=${this.userInfo.partnerCompanyId}&role=${this.userInfo.roleId}`
			})
		},
		
		goMySubPartnerPage() {
			uni.navigateTo({
				url: `/partner/company/mySubPartner?userId=${this.userId}`
			})
		},
		
		goOrderPage() {
			uni.navigateTo({
				url: `/partner/company/order?userId=${this.userId}&partnerCompanyId=${this.userInfo.partnerCompanyId}&role=${this.userInfo.roleId}`
			})
		},
		
		goCommissionPage() {
			uni.navigateTo({
				url: `/partner/company/commission/setCommission?userId=${this.userId}&partnerCompanyId=${this.userInfo.partnerCompanyId}`,
			})
		},
		
		goStaffPage() {
			uni.navigateTo({
				url: `/partner/company/staff/home?userId=${this.userId}`,
			})
		},
		
		goTaskPage() {
			uni.navigateTo({
				url: `/partner/task/home?userId=${this.userId}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	height: 100vh;
	padding-bottom: 80rpx;
	display: flex;
	flex-direction: column;
	.header {
		width: 100vw;
		height: 400rpx;
		background: #31C37B;
		.back-btn {
			margin-left: 32rpx;
			width: 88rpx;
			height: 64rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-size: 28rpx;
		}
		.account-wrap {
			margin-top: 80rpx;
			padding: 0 36rpx;
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
				margin-top: 6rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.invite-text {
					margin-top: 8rpx;
					height: 52rpx;
					line-height: 52rpx;
					font-size: 12px;
					color: #fff;
				}
			}
			.company-left {
				.userinfo {
					display: flex;
					align-items: center;
					.nickname {
						font-size: 28rpx;
						color: #fff;
						font-weight: 500;
					}
					.role {
						margin-left: 16rpx;
						font-size: 24rpx;
						color: #fff;
						height: 36rpx;
						line-height: 36rpx;
						border-radius: 4rpx;
						padding: 0px 8rpx;
						background: rgba(10, 15, 45, 0.9);
					}
				}
				.company-name {
					margin-top: 24rpx;
					height: 40rpx;
					line-height: 40rpx;
					font-size: 28rpx;
					color: #FFFFFF;
				}
			}
			.company-right {
				padding: 20rpx 16rpx;
				background-color: #fff;
				border-radius: 8rpx;
				box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04),0px 4px 24px 0px rgba(10, 15, 45, 0.04);
				display: flex;
				flex-direction: column;
				align-items: center;
				.account {
					font-size: 32rpx;
					font-weight: 500;
					line-height: 16px;
					color: #6E6F77;
				}
				.account-tip {
					margin-top: 16rpx;
					height: 32rpx;
					font-size: 24rpx;
					line-height: 32rpx;
					color: #9496A0;
				}
			}
		}
	}
	.container {
		padding: 40rpx 32rpx 0;
		height: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		.search-header {
			margin-bottom: 16px;
			height: 50rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.tabs {
				display: flex;
				align-items: center;
				.tab {
					margin-right: 32rpx;
					display: flex;
					align-items: center;
					color: rgba(10, 15, 45, 0.8);
					font-size: 14px;
					&.tab-active {
						font-size: 17px;
						font-weight: 600;
						color: #0A0F2D;
					}
					.line {
						transform: translateY(-2rpx) rotate(114deg) skew(20deg);
						background: #31C37B;
						width: 32rpx;
						height: 8rpx;
					}
				}
			}
			.get-customer {
				color: #848795;
				font-size: 28rpx;
				display: flex;
				align-items: center;
			}
		}
		.list {
			height: 0;
			flex: 1;
		}
		.scroll-Y {
			height: 100%;
			.customer-item {
				.username-wrap {
					margin-bottom: 20rpx;
					height: 40rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.username {
						font-size: 28rpx;
						color: #333333;
					}
					.add-user-btn {
						padding: 0 16rpx;
						height: 40rpx;
						border-radius: 20rpx;
						background: #F7F7F7;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #0A0F2D;
						font-size: 20rpx;
						.dot {
							width: 8rpx;
							height: 8rpx;
							background: #0AEB7D;
							border-radius: 50%;
							margin-right: 16rpx;
						}
					}
				}
				.mobile-wrap {
					display: flex;
					align-items: center;
					height: 34rpx;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #999999;
				}
			}
			.order-item {
				.brand-wrap {
					height: 44rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.left {
						display: flex;
						align-items: center;
						.brand {
							font-size: 16px;
							color: #333333;
						}
						.month-tag {
							margin-left: 20rpx;
							padding: 0 16rpx;
							height: 40rpx;
							border-radius: 8rpx;
							background: #F7F7F7;
							display: flex;
							align-items: center;
							font-size: 22rpx;
							color: #666666;
						}
					}
					.status {
						font-size: 28rpx;
						color: #999999;
					}
				}
				.product {
					margin-bottom: 24rpx;
					height: 34rpx;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #999999;
				}
				.item {
					margin-top: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.left {
						display: flex;
						align-items: center;
						.label {
							font-size: 24rpx;
							color: #333333;
							padding-right: 50rpx;
						}
						.content {
							font-size: 24rpx;
							color: #999999;
						}
					}
					.right {
						display: flex;
						align-items: center;
						.label {
							color: #666666;
							font-size: 24rpx;
							padding-right: 12rpx;
						}
						.price-wrap {
							display: flex;
							align-items: baseline;
							color: #EE3833;
							font-size: 24rpx;
							.price {
								font-size: 34rpx;
							}
						}
					}
				}
			}
		}
	}
	.text-link {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 80rpx;
		z-index: 100;
		text-align: center;
		height: 48rpx;
		font-size: 28rpx;
		line-height: 48rpx;
		text-decoration: underline;
		color: #4C4C4C;
	}
	.partner-name {
		height: 40rpx;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 40rpx;
		color: #333333;
	}
	.partner-commission {
		margin-top: 24rpx;
		display: flex;
		font-size: 24rpx;
		align-items: center;
		font-size: 24rpx;
		.label {
			color: #86909C;
		}
		.price {
			color: #EA0000; 
		}
	}
}

.card {
	.item-wrap {
		display: flex;
		flex-wrap: wrap;
		.item {
			margin-top: 12px;
			margin-right: 98rpx;
			width: 130rpx;
			height: 130rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.img-wrap {
				width: 68rpx;
				height: 68rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			
			.text {
				margin-top: 8px;
				height: 36rpx;
				font-size: 13px;
				line-height: 36rpx;
				color: #1D2129;
			}
		}
		.item:nth-child(3n) {
			margin-right: 0;
		}
		.item:nth-child(-n + 3) {
			margin-top: 0;
		}
	}
}

.prize-wrap {
	position: fixed;
	right: 0;
	bottom: 400rpx;
	z-index: 200;
	height: 86rpx;
	border-radius: 86rpx 0px 0px 86rpx;
	background: #FCFCFC;
	box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
	padding: 0 24rpx;
	display: flex;
	align-items: center;
	.prize-text {
		padding-left: 24rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #FFAC1C;
		display: flex;
		align-items: center;
	}
}
</style>