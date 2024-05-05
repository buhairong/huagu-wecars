<template>
	<view class="page-wrap">
		<view class="header">
			<view class="merchant">
				<u-image
					:src="detailInfo.logoImageUrl"
					shape="circle"
					width="48rpx"
					height="48rpx"
				/>
				<view class="merchant-name">
					{{detailInfo.merchantName}}
				</view>
			</view>
			<view class="car-info">
				<u-image
					:src="detailInfo.imageUrl"
					width="234rpx"
					mode="widthFix"
				/>
				<view class="car">
					<view class="car-brand">
						{{ detailInfo.carBrand || '' }} {{ detailInfo.carType || '' }}
					</view>
					<view class="car-type">
						{{ detailInfo.carTypeYear || '' }} {{ detailInfo.carTypeYearProduct || '' }}
					</view>
				</view>
			</view>
		</view>
		
		<view v-if="index == 3">
			<view class="card">
				<view class="card-title">
					<view class="title">
						<view class="left-border"></view>
						<view class="text">
							合约详情
						</view>
					</view>
				</view>
				<view class="card-content-space-between">
					<view class="item-wrap">
						<view class="item-title">
							订阅方案
						</view>
						<view class="item-content">
							{{orderDetailData.productSchemeName || '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							合约周期
						</view>
						<view class="item-content">
							{{orderDetailData.monthTotal ? `${orderDetailData.monthTotal}个月` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							订阅费用
						</view>
						<view class="item-content">
							{{getSubscriptionPrice()}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							支付方式
						</view>
						<view class="item-content">
							{{orderDetailData.paymentType || orderDetailData.paymentType == 0 ? paymentTypeAll[orderDetailData.paymentType] : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							保证金
						</view>
						<view class="item-content">
							{{getDeposit()}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							限定里程
						</view>
						<view class="item-content">
							{{orderDetailData.limitMileage ? `${formatThousandNumber(orderDetailData.limitMileage)}公里` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							超出里程
						</view>
						<view class="item-content">
							{{orderDetailData.overMileageFee ? `￥${formatThousandNumber(orderDetailData.overMileageFee)}/公里` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							精选服务
						</view>
						<view class="item-content">
							{{orderDetailData.carSubscribeFreeServiceToWeb && orderDetailData.carSubscribeFreeServiceToWeb.length ? orderDetailData.carSubscribeFreeServiceToWeb.join('、') : '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							增配项
						</view>
						<view class="item-content">
							{{orderDetailData.otherConfigOfSecondCar ? orderDetailData.otherConfigOfSecondCar : '-' }}
						</view>
					</view>
				</view>
			</view>
			
			<view class="card">
				<view class="card-title">
					<view class="title">
						<view class="left-border"></view>
						<view class="text">
							期末选择
						</view>
					</view>
				</view>
				<view class="card-content-space-between">
					<view class="item-wrap">
						<view class="item-title">
							期末买断
						</view>
						<view class="item-content">
							{{orderDetailData.buyoutsFee ? `￥${formatThousandNumber(orderDetailData.buyoutsFee)}` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							购车总价
						</view>
						<view class="item-content">
							{{orderDetailData.totalPrice ? `￥${formatThousandNumber(orderDetailData.totalPrice)}` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							期末选择
						</view>
						<view class="item-content">
							{{getFinalSelectToWeb()}}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view v-else-if="index == 4">
			<view class="card">
				<view class="card-title">
					<view class="title">
						<view class="left-border"></view>
						<view class="text">
							分期方案
						</view>
					</view>
				</view>
				<view class="card-content-space-between">
					<view class="item-wrap">
						<view class="item-title">
							车辆价格
						</view>
						<view class="item-content">
							{{stagingItem.dealerReferencePrice ? `￥${formatThousandNumber(stagingItem.dealerReferencePrice)}` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							分期期数
						</view>
						<view class="item-content">
							{{stagingItem.period ? `${stagingItem.period}期` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							首付金额
						</view>
						<view class="item-content">
							{{stagingItem.firstPayment ? `￥${formatThousandNumber(stagingItem.firstPayment)}` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							月供金额
						</view>
						<view class="item-content">
							{{stagingItem.monthPayment ? `￥${formatThousandNumber(stagingItem.monthPayment)}` : '-'}}
						</view>
					</view>
				</view>
			</view>
			
			<view class="card">
				<view class="card-title">
					<view class="title">
						<view class="left-border"></view>
						<view class="text">
							车辆信息
						</view>
					</view>
				</view>
				<view class="card-content-space-between">
					<view class="item-wrap">
						<view class="item-title">
							所在城市
						</view>
						<view class="item-content">
							{{ detailInfo.regCity || '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							首次上牌
						</view>
						<view class="item-content">
							{{ detailInfo.regDate || '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							实表里程数
						</view>
						<view class="item-content">
							{{ detailInfo.mileage ? `${formatThousandNumber(detailInfo.mileage)}公里` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							车 架  号
						</view>
						<view class="item-content">
							{{ detailInfo.carVin || '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							外观颜色
						</view>
						<view class="item-content">
							{{ detailInfo.outColor || '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							内饰颜色
						</view>
						<view class="item-content">
							{{ detailInfo.inColor || '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							增  配 项
						</view>
						<view class="item-content">
							{{stagingItem.carOtherConfig && stagingItem.carOtherConfig.length ? stagingItem.carOtherConfig.join('、') : '-' }}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="footer">
			<view class="protocol" v-if="index == 3">
				签订合约即代表您已阅读并认同 <text class="protocol-link" @click="showProtocol">《车要试用车服务协议》</text>
			</view>
			<view class="btn-wrap">
				<view class="reserve-fee">
					订金：¥ <text class="price">{{getReserveFee()}}</text>
					<view class="icon-wrap" @click="showPop(1)">
						<u-icon name="info-circle" color="#fff" size="28"></u-icon>
					</view>
				</view>
				<view class="pay" @click="handlePay">
					支付订金
					<u-icon class="pay-arrow" name="arrow-right" color="#0AEB7D" size="24"></u-icon>
				</view>
			</view>
		</view>
		
		<u-popup
			v-model="showPopup" 
			mode="bottom"
			border-radius="12"
			closeable="true"
			close-icon-color="#0A0F2D"
		>
			<view class="popup-wrap">
				<view class="reserve-rule" v-if="popupIndex === 1">
					<view class="title">
						订金退回规则
					</view>
					<view class="content">
						支付订金是您分期购车的必要步骤，您所支付的订金，会在您签约完成并支付首付，或当信用审核不通过订单关闭后原路退回。
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { contractUrl, paymentTypeAll1, finalSelect } from "@/constants"
import { formatTenThousandNumber, formatThousandNumber, getDeposit } from '@/utils/index.js'
	
export default {
	data() {
		return {
			orderDetailData: {},
			index: null, // 3.订阅方案 4.分期方案
			detailInfo: {},
			subscribeItem: {},
			stagingItem: {},
			subscribeId: '', // 订阅方案ID
			userInfo: null,
			showPopup: false,
			popupIndex: 1, // 1.订单提示
			paymentTypeAll: paymentTypeAll1, // 支付方式
		}
	},
	onLoad(options) {
		if (options) {
			this.subscribeId = options.subscribeId
			this.index = options.index
		}
		
		try {
			const value = uni.getStorageSync('certcarDetailInfo')
			if (value) {
				const info = JSON.parse(value)
				this.detailInfo = info.detailInfo
				this.stagingItem = info.stagingItem
			}
		} catch (e) {
			// error
		}
	},
	onShow() {
		getApp().globalData.userInfo = null;
		getApp().globalData.getUserInfo((data) => {
		    console.log("order-detail-userinfo:",data);
		    this.userInfo = data;
				if (this.index == 3) {
					this.getOrderDetailData()
				}
		})
	},
	
	methods: {
		getOrderDetailData() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.subscribeId,
				userId: this.userInfo.id
			}
			this.$getRequest(this.$url.getOrderDetail, 'GET', params).then((data) => {
				uni.hideLoading()
				if(data.code == 0) {
					this.orderDetailData = data.data
				}
			})
		},
		
		showProtocol() {
		  this.$goHtml(contractUrl, '')
		},
		
		// 订金
		getReserveFee() {
			let fee
			if (this.index == 3) {
				fee = this.orderDetailData.reserveFee
			} else {
				fee = this.stagingItem.reserveFee
			}
			
			if (fee || fee == 0) {
				return formatThousandNumber(fee)
			}
			
			return ''
		},
		
		// 1.订金提示
		showPop(index) {
			this.popupIndex = index
			this.showPopup = true
		},
		
		formatTenThousandNumber(number, unit1, unit2) {
			return formatTenThousandNumber(number, unit1, unit2)
		},
		
		formatThousandNumber(num) {
			return formatThousandNumber(num)
		},
		
		// 计算订阅费用
		getSubscriptionPrice() {
			let price
			if (this.orderDetailData.paymentType == 0) {
				price = this.orderDetailData.payOffPrice
			} else if (this.orderDetailData.paymentType == 1) {
				price = this.orderDetailData.monthPayment
			}
			
			if (price || price == 0) {
				return formatThousandNumber(price)
			}
			
			return '-'
		},
		
		// 保证金
		getDeposit() {
			return getDeposit(this.orderDetailData.deposit)
		},
		
		// 期末选择
		getFinalSelectToWeb() {
			if (this.orderDetailData.finalSelectToWeb && this.orderDetailData.finalSelectToWeb.length) {
				this.orderDetailData.finalSelectToWeb.sort((a, b) => a-b)
				let str = ''
				this.orderDetailData.finalSelectToWeb.forEach((item, index) => {
					if (index === 0) {
						str = finalSelect[item]
					} else {
						str += `、${finalSelect[item]}`
					}
				})
				return str
			} else {
				return '-'
			}
		},
		
		handlePay() {
			
		}
	},
}
</script>

<style lang="scss" scoped>
	.header {
		margin-bottom: 40rpx;
		.merchant {
			display: flex;
			align-items: center;
			.merchant-name {
				padding-left: 16rpx;
				font-size: 24rpx;
				line-height: 44rpx;
				color: rgba(10, 15, 45, 0.8);
			}
		}
		.car-info {
			margin-top: 34rpx;
			margin-bottom: 40rpx;
			display: flex;
			align-items: center;
			.car {
				padding-left: 24rpx;
				.car-brand {
					font-size: 30rpx;
					font-weight: 500;
					line-height: 44rpx;
					color: rgba(10, 15, 45, 0.8);
				}
				.car-type {
					font-size: 24rpx;
					line-height: 40rpx;
					color: rgba(10, 15, 45, 0.8);
				}
			}
		}
	}
	
	.footer {
		margin-top: 74rpx;
		.protocol {
			padding-bottom: 24rpx;
			font-size: 24rpx;
			line-height: 40rpx;
			.protocol-link {
				color: #0168ff;
			}
		}
		.btn-wrap {
			height: 116rpx;
			border-radius: 16rpx;
			background: #0A0F2D;
			color: #fff;
			padding: 0 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.reserve-fee {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				.price {
					padding-left: 4rpx;
					font-size: 40rpx;
					font-weight: 500;
				}
				.icon-wrap {
					padding-left: 12rpx;
					width: 100rpx;
					height: 100%;
					display: flex;
					align-items: center;
				}
			}
			.pay {
				display: flex;
				align-items: center;
				font-size: 35rpx;
				font-weight: 500;
				.pay-arrow {
					margin-left: 12rpx;
				}
			}
		}
	}
	
	.popup-wrap {
		.reserve-rule {
			.content {
				font-size: 28rpx;
				line-height: 44rpx;
				color: rgba(10, 15, 45, 0.8);
				padding-top: 66rpx;
				padding-bottom: 80rpx;
			}
		}
	}
	
	.card {
		
	}
</style>