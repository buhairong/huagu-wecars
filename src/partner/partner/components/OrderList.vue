<template>
	<view>
		<view class="card order-item" v-for="item in orderList.list" :key="item.id">
			<view class="brand-wrap">
				<view class="left">
					<view class="brand">{{item.carBrand}} {{item.carType}}</view>
					<view class="month-tag">{{item.monthTotal}}个月</view>
				</view>
				<view class="status">{{purchaseOrderStatus[item.orderStatus]}}</view>
			</view>
			<view class="product">{{item.carTypeYear}} {{item.carTypeYearProduct}}</view>
			<view class="item">
				<view class="left">
					<view class="label">客户姓名</view>
					<view class="content">{{item.name}}</view>
				</view>
			</view>
			<view class="item">
				<view class="left">
					<view class="label">订单类型</view>
					<view class="content">{{item.newType === 1 ? '全新车' : '二手车'}}</view>
				</view>
				<view class="right">
					<view class="label">佣金金额</view>
					<view class="price-wrap">
						<view class="price">{{(item.personCommissionAmount || item.commissionAmount) | $numFormat}}</view>
						元
					</view>
				</view>
			</view>
		</view>			
		
		<u-empty v-if="orderList.errMsg" :text="orderList.errMsg" mode="list"></u-empty>
		<view class="loadmore">
			<u-loadmore
				v-if="orderList.list.length"
				:status="orderList.status"
				:load-text="loadText"
			/>
		</view>
	</view>
</template>

<script>
import { purchaseOrderStatus } from '@/constants/index'

export default {
	props: {
		orderList: {
			type: Object,
			required: true,
		},
	},
	
	// watch: {
	// 	orderList: {
	// 		handler(val) {
	// 			this.orderList = val
	// 		},
	// 		immediate: true,
	// 		deep: true,
	// 	}
	// },
	
	data(){
		return {
			purchaseOrderStatus,
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
		}
	},
	
	computed: {
		
	},
	
	methods: {
		
	}
}
</script>

<style lang="scss" scoped>
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
</style>