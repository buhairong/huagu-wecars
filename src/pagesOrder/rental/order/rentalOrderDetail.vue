<template>
	<view class="page-wrap1" v-if="detailInfo">
		<view class="o-head-car">
			<view class="car-info">
				<image mode="widthFix" :src="detailInfo.carTypeYearProductEntity.imageUrl"></image>
				<view class="o-head-car-text">
					<view class="title">
						<text>{{detailInfo.carTypeYearProductEntity.carBrand || ''}} {{detailInfo.carTypeYearProductEntity.carType || ''}}</text>
					</view>
					<view class="subtitle">
						<text>{{detailInfo.carTypeYearProductEntity.carTypeYear || ''}} {{detailInfo.carTypeYearProductEntity.carTypeYearProduct || ''}}</text>
					</view>
				</view>
			</view>
			<view class="order-status">{{MEMBER_CAR_RENTAL_ORDER_STATUS[detailInfo.status]}}</view>
		</view>
		
		<view
		  v-if="detailInfo.status == 2"
		  class="tip"
		>
		  车辆准备中，可致电联系客服。
		</view>
		
		<view class="card">
			<view class="item">
				<view class="item-title">订单编号</view>
				<view class="item-content">
					{{detailInfo.orderNum}}
				</view>
			</view>
			
			<template v-if="detailInfo.orderType == 1">
				<view class="item">
					<view class="item-title">姓名</view>
					<view class="item-content">
						{{detailInfo.userEntity.name}}
					</view>
				</view>
			</template>
			
			<template v-if="detailInfo.orderType == 2">
				<view class="item">
					<view class="item-title">企业名称</view>
					<view class="item-content">
						{{detailInfo.userCompanyEntity.companyName}}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">企业信用代码</view>
					<view class="item-content">
						{{detailInfo.userCompanyEntity.corporationTaxNumber}}
					</view>
				</view>
			</template>
			
			<view class="item">
				<view class="item-title">手机号</view>
				<view class="item-content">
					{{detailInfo.mobile}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">用车城市</view>
				<view class="item-content">
					{{detailInfo.cityName}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">用车日期</view>
				<view class="item-content">
					{{detailInfo.startDate}} 至 {{detailInfo.endDate}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">用车天数</view>
				<view class="item-content">
					{{detailInfo.totalDay}}天
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">订单总额</view>
				<view class="item-content">
					{{formatThousandNumber(detailInfo.totalPayment)}}元
				</view>
			</view>
			
			<view class="item" v-if="detailInfo.status == 1 || detailInfo.status == 2 || detailInfo.status == 4 || detailInfo.status == 5">
				<view class="item-title">支付方式</view>
				<view class="item-content">
					{{PAY_WAY_STATUS[detailInfo.payWay]}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">我的管家</view>
				<view class="item-content">
					{{detailInfo.memberButlerEntity.name}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">客服电话</view>
				<view class="item-content">
					{{sericeTel}}
				</view>
			</view>
		</view>
		
		
		
		<view class="order-btn-wrap" >
			<view
			  v-if="detailInfo.status == 0 || detailInfo.status == 1 || detailInfo.status == 2 || detailInfo.status == 5"
			  class="cancel-btn"
			  @click="handleCancel"
			>
			  取消订单
			</view>
			<view v-if="detailInfo.status == 0" class="order-btn" @click="handleOrder">
				订单支付
			</view>
		</view>
		
		<u-select
			v-model="showPayWayList" 
			:list="payWayList"
			@confirm="confirmPayWay"
		></u-select>
	</view>
</template>

<script>
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	import { MEMBER_CAR_RENTAL_ORDER_STATUS,PAY_WAY_STATUS,sericeTel } from "@/constants"
	
	
	export default {
		data() {
			return {
				id: '',
				userId: '',
				detailInfo: null,
				MEMBER_CAR_RENTAL_ORDER_STATUS,
				PAY_WAY_STATUS,
				showPayWayList: false,
				userInfo: {},
				sericeTel,
				from: '',
			}
		},
		
		computed: {
			payWayList() {
				let res = [
					{value: 0 , label: '微信支付'},
					{value: 2 , label: '余额支付'}
				]
				
				if (this.detailInfo && this.detailInfo.orderType == 2) {
					res = [
						{value: 0 , label: '微信支付'},
						{value: 2 , label: '余额支付'},
						{value: 3 , label: '先租后付'}
					]
				}
				
				return res
			},
			
			showCancelOrderBtn() {
				let res = false
				
				if (this.detailInfo) {
					if (this.detailInfo.status == 0 || this.detailInfo.status == 1) {
						res = true
					} else if (this.detailInfo.status == 2) {
						const currentTimer = new Date().getTime()
						const startTimer = new Date(this.detailInfo.startDate).getTime()
						if (currentTimer < startTimer) {
							res = true
						}
					}
				}
				
				
				return res
			}
		},
		
		onLoad(option) {
			this.id = option.id
			this.userId = option.userId
			this.from = option.from
		},
		
		onShow() {
			this.getDetail()
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
			
			getDetail() {
				uni.showLoading({
				  title: '加载中'
				});
				this.$getRequest(this.$url.getMemberUserRentalOrderDetail, "GET", {
				  id: this.id,
				}).then(res => {
					uni.hideLoading()
					this.detailInfo = res.data
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			goHome() {
				uni.reLaunch({
					url: '/pagesOrder/order-list'
				})
				
				//this.getDetail()
			},
			
			handleCancel() {
				uni.showModal({
					title: '提示',
					content: `确定要取消这个订单吗？`,
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中'
							})
							
							this.$getRequest(this.$url.cancelMemberUserRentalOrder, "GET", {
							  id: this.detailInfo.id,
							}).then(res => {
								uni.hideLoading()
								if (res.code == 0) {
									uni.showToast({
										title: '操作成功',
										duration: 2000,
										icon: "none"
									})
									
									this.goHome()
								} else {
									uni.showToast({
										title: res.msg,
										duration: 2000,
										icon: "none"
									})
								}
								
							}).catch(() => {
								uni.hideLoading()
							})
						}
					}
				})
				
				
				
			},
			
			handleOrder() {
				this.showPayWayList = true
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
					fromSys: 1,
					appType: 1,
					businessId: this.detailInfo.id, // 订单ID
					businessType: 30,
					openid: this.userInfo.xcxOpenid,
					payType: 30,
					total: this.detailInfo.totalPayment,
					//total: 0.01,
					userId: this.userId,
					companyId:this.detailInfo?.userCompanyEntity?.id
				}, async (res) => {
					if(res === 'success') {
						this.goHome()
					}
				})
				
				uni.hideLoading()
			},
			
			confirmPayWay(e) {
				const payWay = e[0].value
				if (payWay == 0) {
					this.handlePay()
				} else if(payWay == 2 || payWay == 3) {
					uni.showLoading({
						title: '加载中'
					})
					
					this.$getRequest(this.$url.memberUserRentalOrderPayWay, "GET", {
					  id: this.detailInfo.id,
					  payWay
					}).then(res => {
						uni.hideLoading()
						if (res.code == 0) {
							uni.showToast({
								title: '操作成功',
								duration: 2000,
								icon: "none"
							})
							
							this.goHome()
						} else {
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon: "none"
							})
						}
					}).catch(() => {
						uni.hideLoading()
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap1 {
	padding-bottom: 240rpx;;
}
.o-head-info {
	display: flex;
	align-items: center;
	image {
		width: 24rpx;
		height: 24rpx;
	}
	text {
		font-size: 24rpx;
		margin-left: 8rpx;
	}
}
.o-head-car {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.car-info {
		flex: 1;
		display: flex;
		align-items: center;
	}
	image {
		width: 234rpx;
	}
	.o-head-car-text {
		flex: 1;
		margin-left: 10rpx;
		.title {
			font-size: 30rpx;
			font-weight: 500;
			line-height: 44rpx;
			color: rgba(10, 15, 45, 0.8);
		}
		.subtitle {
			font-size: 24rpx;
			line-height: 40rpx;
			color: rgba(10, 15, 45, 0.8);
		}
	}
	
	.order-status {
		margin-left: 20rpx;
		min-height: 108rpx;
		padding: 8rpx;
		border-radius: 16rpx;
		border: 2rpx solid #5F19F5;
		font-size: 30rpx;
		font-weight: 500;
		color: #5F19F5;
		line-height: 44rpx;;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}

.tip {
	margin-top: 32rpx;
	font-size: 28rpx;
	line-height: 44rpx;
	color: rgba(78, 89, 105, 0.6);
}

.card {
	margin-top: 32rpx;
	.item {
		margin-top: 12px;
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		color: rgba(10, 15, 45, 0.8);
		&:first-child {
			margin-top: 0;
		}
		.item-title {
			display: flex;
			height: 44rpx;
			line-height: 44rpx;
		}
		.item-content {
			line-height: 44rpx;
			flex:1;
			width:0;
			padding-left: 24rpx;
			text-align: right;
		}
	}
}

.order-btn-wrap {
	display: flex;
	gap:24rpx;
}

.cancel-btn {
	width: 0;
	flex: 1;
	background: rgba(10, 15, 45, 0.04);
	border-radius: 16rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #0A0F2D;
	font-weight: 500;
	height: 116rpx;
	font-size: 34rpx;
}

.order-btn {
	width: 0;
	flex: 1;
}
</style>
