<template>
	<view class="list-wrap">
		<view class="row header-row">
			<view class="col" v-if="isMe">出价次数</view>
			<view class="col" v-else>竞买人</view>
			<view class="col">出价金额</view>
			<view class="col">出价时间</view>
		</view>
		
		<template v-if="list.length">
			<view class="row" v-for="(item, index) in list" :key="index">
				<view class="col" v-if="isMe">第{{index+1}}次</view>
				<view class="col" v-else>
					{{item.userName}}
					<view class="tag" v-if="userInfo && userInfo.id === item.userId">我</view>
				</view>
				<view class="col">{{item.price | $numFormat}}元</view>
				<view class="col">{{formatTime(item.auctionTime)}}</view>
			</view>
		</template>
		<view class="row footer-row" v-else>
			<view class="col" v-if="isMe">暂无历史出价</view>
			<view class="col" v-else>起拍价 {{startPrice | $numFormat}}元</view>
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs'

export default {
	props: {
		list: {
			type: Array,
			default: () => [],
		},
		
		userInfo: {
			type: Object,
			required: true,
		},
		
		isMe: {
			type: Boolean,
			default: false,
		},
		
		startPrice: {
			type: Number,
			default: 0,
		},
	},
	
	data() {
		return {
			
		}
	},
	
	mounted() {
		
	},
	
	methods: {
		formatTime(time) {
			return dayjs(time).format('YYYY年MM月DD日')
		}
	},
}
</script>

<style lang="scss" scoped>
.list-wrap {
	margin-top: 40rpx;
	border-radius: 8rpx 8rpx 0px 0px;
	color: rgba(10, 15, 45, 0.6);
	font-size: 24rpx;
	.row {
		height: 90rpx;
		display: flex;
		border-top: 2rpx solid rgba(10, 15, 45, 0.2);
		.col {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			border-right: 2rpx solid rgba(10, 15, 45, 0.2);
			position: relative;
			&:last-child {
				border-right: none;
			}
			.tag {
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				z-index: 100;
				width: 66rpx;
				height: 28rpx;
				border-radius: 0px 8rpx 8rpx 0px;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #0AEB7D;
				color: #FFFFFF;
				font-size: 20rpx;
			}
		}
	}
	.header-row {
		height: 64rpx;
		border-top: none;
		background: #F2F3F5;
	}
	.footer-row {
		border-bottom: 2rpx solid rgba(10, 15, 45, 0.2);
	}
}
</style>