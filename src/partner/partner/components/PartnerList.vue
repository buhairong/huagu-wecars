<template>
	<view>
		<view class="card partner-item" v-for="item in partnerList.list" :key="item.id">
			<view class="partner-name">{{item.name || '微信用户'}}</view>
			
			<view class="mobile">{{item.mobile}}</view>
			
			<!-- <view class="item" style="margin-top:24rpx;">
				<view class="label">抽佣比例：</view>
				<view class="content">10%</view>
			</view> -->
			
			<view class="item">
				<view class="label">获得佣金：</view>
				<view class="price">{{item.commission | $numFormat}}元</view>
			</view>
		</view>			
		
		<u-empty v-if="partnerList.errMsg" :text="partnerList.errMsg" mode="list"></u-empty>
		<view class="loadmore">
			<u-loadmore
				v-if="partnerList.list.length"
				:status="partnerList.status"
				:load-text="loadText"
			/>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		partnerList: {
			type: Object,
			required: true,
		},
	},
	
	// watch: {
	// 	partnerList: {
	// 		handler(val) {
	// 			this.partnerList = val
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
		
	}
}
</script>

<style lang="scss" scoped>
.partner-item {
	.partner-name {
		height: 40rpx;
		font-size: 28rpx;
		font-weight: 500;
		line-height: 40rpx;
		color: #333333;
	}
	.mobile {
		margin-top: 16rpx;
		height: 40rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		color: #333333;
	}
	.item {
		margin-top: 24rpx;
		display: flex;
		font-size: 24rpx;
		align-items: center;
		font-size: 24rpx;
		color: #86909C;
		.content {
			padding: 0;
		}
		.price {
			color: #EA0000; 
		}
	}
}
</style>