<template>
	<view class="card" @click="goDetail">
		<view class="left">
			<view class="title">{{item.carBrand}} {{item.carType}} {{item.carTypeYear}} {{item.carTypeYearProduct}}</view>
			
			<view class="item">
				<view class="label">{{ item.status > 4 ? '最终竞价：' : '当前出价：' }}</view>
				<view class="item-content">{{item.currentPrice | $numFormat}}元</view>
			</view>
			
			<view class="item">
				<view class="label">我的出价：</view>
				<view class="item-content">{{item.myPrice | $numFormat}}元</view>
			</view>
			
			<view class="item">
				<view class="label">结束时间：</view>
				<view class="item-content">{{formatTime(item.endTime)}}</view>
			</view>
		</view>
		
		<view class="right">
			<view class="status">{{auctionCarStatus[item.status]}}</view>
			<view class="btn">
				{{ item.status > 4 || item.status === 3 ? '查看详情' : '继续出价'}}
				<image
					class="detail-arrow"
					src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
				/>
			</view>
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { auctionCarStatus } from '@/constants/index.js'

export default {
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	
	data() {
		return {
			auctionCarStatus,
		}
	},
	
	mounted() {
		
	},
	
	methods: {
		formatTime(time) {
			return dayjs(time).format('YYYY年MM月DD日 HH:mm')
		},
		
		goDetail() {
			uni.navigateTo({
				url: `/pagesOrder/auction/detail?id=${this.item.id}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.card {
	display: flex;
	justify-content: space-between;
	.left {
		width: 0;
		flex: 1;
		.title {
			margin-bottom: 24rpx;
			font-size: 28rpx;
			line-height: 48rpx;
			color: #0A0F2D;
		}
		.item {
			margin-top: 8rpx;
			line-height: 40rpx;
			color: #64696F;
			font-size: 24rpx;
			display: flex;
		}
	}
	.right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
		.status {
			padding: 0 16rpx;
			height: 96rpx;
			border-radius: 16rpx;
			border: 2rpx solid #5F19F5;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #5F19F5;
			font-size: 28rpx;
		}
		.btn {
			width: 152rpx;
			height: 56rpx;
			border-radius: 8rpx;
			background: #0A0F2D;
			color: #FFFFFF;
			font-size: 24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.detail-arrow {
				margin-left: 8rpx;
				width: 16rpx;
				height: 16rpx;
			}
		}
	}
}
</style>