<template>
	<view class="wrap">
		<view class="label">{{auctionCarStatus[currentStatus]}}</view>
		<view class="right" v-if="currentTimeStamp > 0">
			<view class="time-wrap" v-if="showAll || day">
				<view class="time">{{day}}</view>
				<view class="unit">天</view>
			</view>
			
			<view class="time-wrap">
				<view class="time">{{hour}}</view>
				<view class="unit">时</view>
			</view>
			
			<view class="time-wrap">
				<view class="time">{{minute}}</view>
				<view class="unit">分</view>
			</view>
			
			<view class="time-wrap" v-if="showAll || !day">
				<view class="time">{{second}}</view>
				<view class="unit">秒</view>
			</view>
		</view>
	</view>
</template>

<script>
import { auctionCarStatus } from '@/constants'
import { formatCountdown } from '@/utils'
	
export default {
	props: {
		status: {
			type: Number,
			default: 4,
		},
		
		timeStamp: {
			type: Number,
			default: 0,
		},
		
		showAll: {
			type: Boolean,
			default: false,
		}
	},
	
	data() {
		return {
			auctionCarStatus,
			currentStatus: 4,
			currentTimeStamp: 0,
			timer: null,
			day: 0,
			hour: 0,
			minute: 0,
			second: 0,
		}
	},
	
	mounted() {
		this.currentStatus = this.status
		this.currentTimeStamp = this.timeStamp
		if (this.currentStatus === 4) {
			this.countdown()
		}
	},
	
	beforeDestroy() {
		this.clear()
	},
	
	methods: {
		clear() {
			clearInterval(this.timer)
			this.timer = null
		},
		
		countdown() {
			this.timer = setInterval(() => {
				if (this.currentTimeStamp <= 1000) {
					this.currentStatus = 5
					this.currentTimeStamp = 0
					this.$emit('update:status', 5)
					this.clear()
				} else {
					this.currentTimeStamp -= 1000
					const res = formatCountdown(this.currentTimeStamp)
					this.day = res.day
					this.hour = res.hour
					this.minute = res.minute
					this.second = res.second
				}
			}, 1000)
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.wrap {
	display: flex;
	align-items: center;
	font-size: 12px;
	color: #3D3D3D;
	.label {
		padding-right: 16rpx;
	}
	.right{
		display: flex;
		align-items: center;
		.time-wrap {
			display: flex;
			align-items: center;
			.time {
				width: 50rpx;
				height: 32rpx;
				border-radius: 4rpx;
				background: #000000;
				color: #FFFFFF;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.unit {
				padding: 0 4rpx;
			}
		}
	}
}
</style>