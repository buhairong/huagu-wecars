<template>
	<view class="wrap">
		<view class="list">
			<view 
				class="item"
				v-for="item in list"
				:key="item.id"
				@click="selectItem(item)"
			>
				<view class="left">
					<view class="img-wrap">
						<image
							v-if="item.carTypeYearProductEntity.imageUrl"
							class="item-img"
							mode="aspectFill"
							:src="item.carTypeYearProductEntity.imageUrl"
						/>
						<view class="no-img" v-else>暂无图片</view>
					</view>
					<view class="info">
						<view class="brand">{{item.carTypeYearProductEntity.carBrand}} {{item.carTypeYearProductEntity.carType}}</view>
						<view class="product">{{item.carTypeYearProductEntity.carTypeYear}} {{item.carTypeYearProductEntity.carTypeYearProduct}}</view>
					</view>
				</view>
				<view class="right">
					<view class="price">{{item.minPriceMonth | $numFormat}}元/{{businessType == 1 ? '月' : '天'}}起</view>
					<view class="btn">
						去下单
						<image
							class="detail-arrow"
							src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
						/>
					</view>
				</view>
			</view>
		</view>
		
		<u-empty v-if="errMsg" :text="errMsg" mode="list" margin-top="40"></u-empty>
		<u-loadmore
			v-if="list.length"
			:status="status"
			:load-text="loadText"
		/>
	</view>
</template>

<script>
export default {
	components: {
	  
	},
	
	data() {
		return {
			businessType: null,
			list: [],
			status: 'loading', 
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			errMsg: '',
		}
	},
	
	onLoad(options) {
		this.businessType = options.businessType
		this.getList()
	},
	
	onShow() {
		
	},
	
	methods: {
		async getList() {
			const res = await this.$getRequest(this.$url.getcarRentalSubscribeList, "GET", {businessType: this.businessType})
			this.list = res.data
			if (this.list.length) {
				this.status = 'nomore'
			} else {
				this.errMsg = '暂无车源'
			}
		},
		
		selectItem(item) {
			const rentalCarSelectProduct = {
				businessType: this.businessType,
				carRentalDetailSubscribeId: item.id,
				carTypeYearProductId: item.carTypeYearProductId,
				carProduct: `${item.carTypeYearProductEntity.carBrand} ${item.carTypeYearProductEntity.carType} ${item.carTypeYearProductEntity.carTypeYear} ${item.carTypeYearProductEntity.carTypeYearProduct}`,
				carTypeId: item.carTypeId,
			}
			
			uni.setStorageSync('rentalCarSelectProduct', rentalCarSelectProduct)
			
			uni.navigateBack({
				delta: 1
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40rpx 32rpx 80rpx;
	.list {
		margin-bottom: 40rpx;
	}
	.item {
		padding: 24rpx 0;
		border-bottom: 2rpx solid rgba(10, 15, 45, 0.04);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			width: 0;
			flex: 1;
			display: flex;
			align-items: center;
			.img-wrap {
				width: 220rpx;
				height: 104rpx;
				border-radius: 16rpx;
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
			.info {
				width: 0;
				flex: 1;
				.brand {
					font-size: 30rpx;
					line-height: 44rpx;
					color: rgba(10, 15, 45, 0.8);
					font-weight: 500;
				}
				.product {
					margin-top: 8rpx;
					font-size: 24rpx;
					line-height: 40rpx;
					color: rgba(10, 15, 45, 0.8);
				}
			}
		}
		.right {
			margin-left: 24rpx;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			.price {
				font-size: 28rpx;
				height: 44rpx;
				line-height: 44rpx;
				color: #F51A4E;
				font-weight: 500;
			}
			.btn {
				margin-top: 4rpx;
				width: 128rpx;
				height: 48rpx;
				border-radius: 8rpx;
				background: #0A0F2D;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 22rpx;
				color: #FFFFFF;
				.detail-arrow {
					margin-left: 10rpx;
					width: 16rpx;
					height: 16rpx;
				}
			}
		}
	}
}
</style>