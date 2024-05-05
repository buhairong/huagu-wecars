<template>
	<view>
		<view class="card customer-item" v-for="item in customerList.list" :key="item.id">
			<view class="username-wrap">
				<view class="username">{{item.name || '微信用户'}}</view>
				<view class="add-user-btn">
					<view class="dot" :class="{'new-dot': item.overTime || item.orderStatus}"></view>
					{{getTagText(item)}}
				</view>
			</view>
			<view class="mobile-wrap" v-if="item.mobile">
				<view class="mobile">
					<u-icon name="phone-fill" color="#CCCCCC" size="28" style="margin-right:12rpx;"></u-icon>
					{{hideMobile(item.mobile)}}
				</view>
				
				<!-- <view class="phone-tag" @click="callPhone(item.mobile)">
					<u-icon name="phone-fill" color="#0AEB7D" size="28"></u-icon>
				</view> -->
			</view>
		</view>			
		
		<u-empty v-if="customerList.errMsg" :text="customerList.errMsg" mode="list"></u-empty>
		
		<view class="loadmore">
			<u-loadmore
				v-if="customerList.list.length"
				:status="customerList.status"
				:load-text="loadText"
			/>
		</view>
	</view>
</template>

<script>
import { purchaseOrderStatus } from '@/constants/index.js'

export default {
	props: {
		customerList: {
			type: Object,
			required: true,
		},
	},
	
	// watch: {
	// 	customerList: {
	// 		handler(val) {
	// 			this.customerList = val
	// 		},
	// 		immediate: true,
	// 		deep: true,
	// 	}
	// },
	
	data(){
		return {
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
		hideMobile(mobile) {
			if (mobile) {
				return mobile.slice(0, 3) + '****' + mobile.slice(7)
			}
			return ''
		},
		
		callPhone(mobile) {
			uni.makePhoneCall({
				phoneNumber: mobile
			})
		},
		
		getTagText(item) {
			let res = ''
			
			
			if (item.orderStatus) {
				res = purchaseOrderStatus[item.orderStatus]
			} else {
				if (item.overTime) {
					res = '待下单'
				} else {
					res = '新增客户'
				}
			}
			
			return res
		},
	}
}
</script>

<style lang="scss" scoped>
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
			.new-dot {
				background: #1AA5FF;
			}
		}
	}
	.mobile-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 34rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #999999;
		.mobile {
			display: flex;
			align-items: center;
		}
		.phone-tag {
			width: 40rpx;
			height: 40rpx;
			background: rgba(10, 235, 125, 0.1);
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
</style>