<template>
	<view class="wrap" @click="goDetail">
		<view class="car-img">
			<image 
				class="default_img"
				src="/static/img_bg.png"
			/>
			<image
				class="item-img"
				mode="aspectFill"
				:src="item.imageUrlList[0]"
			/>
		</view>
		
		<view class="car-info">
			<view>
				<view class="brand">
				    {{ item.carBrand }} {{ item.carType }} {{ item.carTypeYear }} | {{ item.carTypeYearProduct }}
				</view>
				<view class="box-info-text">
					{{ item.city }} / {{ item.regDateStr }} / {{ item.mileage }}公里
				</view>
			</view>
			
			<view>
				<view class="business">
					<view class="tip">当前价</view>
					<view class="business-price">
					  ¥ 
						<view class="price">{{ getPrice(item.currentPrice) }} </view>
					</view>
				</view>
				
				<view class="" v-if="item.status === 1">开始时间：{{formatDate()}}</view>
				<AuctionCountdown :status.sync="item.status" :timeStamp="item.endToCancelTime" v-else />
			</view>
			
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
import AuctionCountdown from '@/common/AuctionCountdown.vue'

export default {
	components: {
		AuctionCountdown,
	},
	
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	
	data() {
		return {
			
		}
	},
	
	methods: {
		goDetail() {
			uni.navigateTo({
				url: `/pagesOrder/auction/detail?id=${this.item.id}`
			})
		},
		
		getPrice(price) {
			let res = ''
			if(price || price == 0) {
				if (price < 10000) {
					res = `${formatThousandNumber(price)}元`
				} else {
					res = formatTenThousandNumber(price)
				}
				
			} 
			return res
		},
		
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
		
		formatDate() {
			return dayjs(this.item.startTime).format('YYYY年MM月DD日 HH时')
		}
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.wrap {
	display: flex;
	align-items: center;
	.car-img {
		width: 290rpx;
		height: 200rpx;
		position: relative;
		.default_img {
			border-radius: 16rpx;
			width: 100%;
			height: 100%;
		}
		.item-img {
			position: absolute;
			top: 0;
			left: 0;
			border-radius: 16rpx;
			width: 100%;
			height: 100%;
		}
	}
	.car-info {
		padding-left: 12rpx;
		flex: 1;
		width: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 180rpx;
		.brand {
				font-size: 28rpx;
				color: rgba(10, 15, 45, 0.8);
				line-height: 44rpx;
				font-weight: 500;
				@include text-overflow();
		}
		.box-info-text {
				font-size: 24rpx;
				line-height: 36rpx;
				color: rgba(10, 15, 45, 0.8);
		}
		.business {
			display: flex;
			margin: 10rpx 0;
			align-items: baseline;
			font-size: 24rpx;
			.tip {
				font-size: 24rpx;
				color: rgba(10, 15, 45, 0.8);
				padding-right: 8rpx;
			}
			.price-text {
				color: #f51a4e;
				font-size: 22rpx;
				padding-left: 4rpx;
				transform: translateY(-2rpx);
			}
			.business-price {
				color: #F5194B;
				display: flex;
				align-items: baseline;
				.price {
					font-size: 30rpx;
					color: #F5194B;
					font-weight: 500;
				}
			}
		}
	}
}
</style>