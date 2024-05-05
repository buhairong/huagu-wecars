<template>
	<view class="order-pay">
		<view class="order-pay-img">
			<image src="https://image.51cheyaoshi.com/xcx/app/static/img/done.png"></image>
			<text>预定成功</text>
			<text class="tip" v-if="index == 4">请耐心等待金融方审核</text>
		</view>
		
		<view class="order-content" v-if="index == 3">
			<view class="o-c-t"><view class="o-content-title">合约详情</view></view>
			
			<template v-if="orderInfo.orderType === 1">
				<view class="item">
					<view class="item-title">姓名</view>
					<view class="item-content">
						{{orderInfo.orderPrincipal.userName}}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">身份证件号</view>
					<view class="item-content">
						{{orderInfo.orderPrincipal.userIdNum}}
					</view>
				</view>
			</template>
			
			<template v-if="orderInfo.orderType === 2">
				<view class="item">
					<view class="item-title">企业名称</view>
					<view class="item-content">
						{{orderInfo.orderPrincipal.companyName}}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">企业信用代码</view>
					<view class="item-content">
						{{orderInfo.orderPrincipal.corporationTaxNumber}}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">用车人姓名</view>
					<view class="item-content">
						{{orderInfo.orderPrincipal.userName}}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">用车人身份证件号</view>
					<view class="item-content">
						{{orderInfo.orderPrincipal.userIdNum}}
					</view>
				</view>
			</template>
			
		</view>
	
		<view class="btnClass">
			<view
			    class="foot-but "
			    @click="goOrderPage"
					v-if="index == 4"
			>
			    <view class="foot-but-r">
						查看订单
			    </view>
			</view>
			
			<view
			    class="foot-but "
			    @click="handleBookCar"
					v-else
			>
			    <view class="foot-but-r">
					选配
			    </view>
			</view>
		</view>
		
		<!-- <view class="bottom-link" @click="gotoDetail">跳过</view> -->

	</view>
</template>

<script>
import { formatThousandNumber } from '@/utils/index.js'
	
export default {
	data() {
		return {
			id: '', // 订单
			orderInfo: '',
			planId:'', // 分期方案ID
			stagingId: '', // 分期方案ID
			index: null, // 3.订阅方案 4.分期方案
			stagingItem: {}, // 分期方案展示内容
			cartype: null, // 1.新车 2.二手车
			userInfo: null,
			orderType: null,
			configId: '',
		}
	},
	methods: {
		getSuccessInfoData() {
			const params = {
				id: this.id
			}
			this.$getRequest(this.$url.getSuccessInfo, 'GET', params).then((data) => {
				if(data.code == 0){
					this.orderInfo = data.data
				}
			})
		},
		
		handleBookCar() {
			uni.navigateTo({
				url: './customized?id='+this.id + '&planId='+this.planId + '&cartype='+this.cartype + '&configId='+this.configId
			})
		},
		// 复制订单号
		copyOrder(orderNum) {
			uni.setClipboardData({
				data: orderNum,
			})
		},
		
		formatThousandNumber(num) {
			return formatThousandNumber(num)
		},
		
		goOrderPage() {
			this.$u.route({
				type: 'navigateBack',
				delta: 1
			})
		},
		
		identity() {
			if(this.userInfo && this.userInfo.riskAuditStatus === 6) {
				this.updateOrderType()
			} else {
				uni.reLaunch({
					url: '/pagesOrder/identity/company-identity'
				})
			}
		},
		
		updateOrderType() {
			uni.showLoading({
				title: '保存中'
			})
			
			const params = {
				orderType: 2,
				id: this.id,
			}
			
			this.$getRequest(this.$url.updateOrderType, 'GET', params).then(result => {
					if (result.code == 0) {
						this.orderType = 2
						uni.showToast({
							title: '已保存为企业签约',
							duration: 2000,
							icon: 'none'
						})
					}
			}).finally(() => {
				uni.hideLoading()
			})
		},
		
		gotoDetail(){
			const params = {
				id: this.id
			}
			this.$getRequest(this.$url.updateUserSubscribeConfigSkipStatus, 'GET', params).then((data) => {
				if(data.code == 0){
					uni.navigateTo({
						url: '/pagesOrder/order-detail/order-detail?orderId=' + this.id
					})
				}
			})
			
		},
	},
	onShow() {
		if(this.index == 3) {
			this.getSuccessInfoData()
		}
		
	},
	onLoad(option) {
		this.id = option.id // 订单ID
		this.planId = option.planId // 订阅方案ID
		this.stagingId = option.stagingId // 分期方案ID
		this.index = option.index // 3.订阅方案 4.分期方案
		this.cartype = option.cartype // 1.新车 2.二手车
		this.configId = option.configId
		
		this.userInfo = getApp().globalData.userInfo
		
		try {
			const value = uni.getStorageSync('certcarDetailInfo')
			if (value) {
				const info = JSON.parse(value)
				this.stagingItem = info.stagingItem
			}
		} catch (e) {
			// error
		}
	}
}
</script>

<style lang="scss" scoped>
	.f-right {
		float: right;
	}
	.btnClass{
		margin-top: 0px;
		text-align: center;
		margin-top: 112rpx;
		.foot-but-r{
			width: 100%;
			text-align: center;
		}
		.foot-but{
			margin: 0rpx;
		}
	}
	.order-pay {
		padding: 0;
		margin: 36rpx 32rpx;
		.order-pay-img {
			margin: 86rpx 0rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 34rpx;
			image {
				width: 66.67px;
				height: 66.67px;
				margin-bottom: 18rpx;
			}
			.tip {
				font-size: 28rpx;
				color: rgba(10, 15, 45, 0.5);
				line-height: 44rpx;
				padding-top: 8rpx;
			}
		}
		.order-content {
			padding: 40rpx 12rpx 40rpx 16rpx;
			margin-top: 26rpx;
			border-radius: 24rpx;
			box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
			    0px 8px 24px rgba(10, 15, 45, 0.06);
			.o-c-t{
				.o-content-title {
					font-size: 34rpx;
					position: relative;
					padding-left: 20rpx;
				}
				.o-content-title:before {
					content: "";
					position: absolute;
					width: 4rpx;
					height: 28rpx;
					border-radius: 4rpx;
					background-color: #0AEB7D;
					top: 10rpx;
					left: 4rpx;
				}
			}
			.order-self {
				margin-top: 16rpx;
				padding-left: 16rpx;
				.o-content-row{
					line-height: 2.2;
				}
			}
		}
		
	}

.identity {
	margin-top: 16px;
	height: 44rpx;
	font-size: 12px;
	line-height: 44rpx;
	color: #0168FF;
	text-align: center;
}

.bottom-link {
	margin-top: 12px;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 14px;
	color: rgba(10, 15, 45, 0.5);
	text-align: center;
}

.item {
	margin-top: 12px;
	display: flex;
	justify-content: space-between;
	font-size: 14px;
	color: rgba(10, 15, 45, 0.8);
	height: 44rpx;
	position: relative;
	.item-title {
		display: flex;
		align-items: center;
	}
	.item-content {
		display: flex;
		align-items: center;
	}
}
</style>