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
					{{detailInfo.startDate.slice(0, 10)}} 至 {{detailInfo.endDate.slice(0, 10)}}
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
			
			<view class="item">
				<view class="item-title">我的管家</view>
				<view class="item-content">
					{{detailInfo.memberButlerEntity.name}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">联系管家</view>
				<view class="item-content">
					{{detailInfo.memberButlerEntity.mobile}}
				</view>
			</view>
		</view>
		
		
		
		<view class="order-btn-wrap" v-if="detailInfo.status == 0">
			<view
			  class="cancel-btn"
			  @click="handleCancel"
			>
			  取消订单
			</view>
			<view class="order-btn" @click="handleOrder">
				订单支付
			</view>
		</view>
	</view>
</template>

<script>
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	import { MEMBER_CAR_RENTAL_ORDER_STATUS } from "@/constants"
	
	
	export default {
		data() {
			return {
				id: '',
				userId: '',
				detailInfo: null,
				MEMBER_CAR_RENTAL_ORDER_STATUS,
			}
		},
		
		onLoad(option) {
			this.id = option.id
			this.userId = option.userId
		},
		
		onShow() {
			this.getDetail()
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
			
			handleCancel() {
				
			},
			
			handleOrder() {
				
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
		width: 120rpx;
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
