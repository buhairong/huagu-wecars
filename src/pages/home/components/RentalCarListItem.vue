<template>
	<view class="rental-item-wrap" @click="goDetail">
		<view class="img-wrap">
			<image
				v-if="item.imageUrl"
				class="item-img"
				mode="aspectFill"
				:src="item.imageUrl"
			/>
			<view class="no-img" v-else>暂无图片</view>
		</view>
		
		<view class="brand">{{item.carTypeName}}</view>
		
		<view class="price-wrap">
			<view class="price">{{item.money | $numFormat}}</view>
			元/月起
		</view>
	</view>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			required: true,
		},
		
		cityId: {
			type: Number | String,
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
				url: `/pagesOrder/rental/product/detail?carTypeId=${this.item.carTypeId}&cityId=${this.cityId}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.rental-item-wrap {
	width: 100%;
	.img-wrap {
		width: 100%;
		height: 220rpx;
		border-radius: 16px;
		background: rgba(10, 15, 45, 0.04);
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		.item-img {
			width: 100%;
			height: 100%;
		}
		.no-img {
			color: #0A0F2D;
			font-size: 28rpx;
		}
	}
	.brand {
		padding: 12rpx 0;
		font-size: 28rpx;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.8);
		font-weight: 500;
	}
	.price-wrap {
		display: flex;
		align-items: baseline;
		font-size: 24rpx;
		color: #F51A4E;
		.price {
			font-size: 32rpx;
			font-weight: 500;
		}
	}
}
</style>