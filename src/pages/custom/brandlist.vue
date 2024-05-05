<template>
	<view class="wrap">
		<view class="list">
			<scroll-view 
				scroll-y="true" 
				class="scroll"
			>
				<view class="brand-list-wrap">
					<view 
						class="brand-wrap"
						v-for="(item, index) in brandList"
						:key="index"
					>
						<view
							class="brand"
							v-for="(brand, index1) in item"
							:key="brand.id"
						>
							<view class="letter" v-if="index1 === 0">{{brand.letter}}</view>
							<view class="brand-info" @click="goCarTypePage(brand.id, brand.brandName)">
								<view class="logo">
									<image
										style="width: 100%;height:100%;"
										:src="brand.logoUrl"
									/>
								</view>
								<view class="brand-name">{{ brand.brandName }}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<u-popup id="car-type-popup" v-model="showCarType" mode="right" width="620rpx" :mask="false" :mask-close-able="false">
				<view class="carTypeWrap" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
					<view
						class="car-type"
						v-for="item in carType"
						:key="item.id"
						@click="changeSelectCarType(item)"
					>
						{{item.carType}}
					</view>
					
					<view class="tip-btn1" @click="openPopUp(2)">
						没有您想要的的车型？
					</view>
				</view>
			</u-popup>
		</view>
		<view class="tip-btn" @click="openPopUp(1)">
			没有您想要的品牌？
		</view>
		
		<CustomCarInfoPopup
			v-if="show"
			:show.sync="show"
			:brandName="brandName"
			:type="customCarInfoPopupType"
		/>
	</view>
</template>

<script>
import CustomCarInfoPopup from './components/CustomCarInfoPopup.vue'	
		
export default {
	components: {
		CustomCarInfoPopup
	},
	
	data() {
		return {
			brandList: [],
			brandId: '',
			brandName: '',
			carType: [],
			selectCarType: {},
			show: false,
			showCarType: false,
			customCarInfoPopupType: 1, //1.品牌 2.车型 
			startX: 0,
			startY: 50,
			distanceX: 100,
			distanceY: 50,
		}
	},
	
	onLoad(options) {
		this.getBrandList()
	},
	
	
	methods: {
		getBrandList() {
			this.$getRequest(this.$url.getCarTypeCondition, "POST").then(res => {
				if (res.code === 0) {
					this.brandList = res.data.brandList.filter(item => item.length)
				}
			})
		},
		
		getCarType() {
			this.$getRequest(this.$url.getCarType, "POST", {
				carBrandId: this.brandId,
			}).then(res => {
				if (res.code === 0) {
					this.carType = res.data
					this.selectCarType = this.carType[0]
					this.showCarType = true
				}
			})
		},
		
		changeSelectCarType(carType) {
			this.selectCarType = carType
			uni.setStorageSync('customCarInfo', {
			    carBrand: this.brandName,
					carType: carType.carType,
					carProduct: '',
			})
			
			uni.navigateBack({
				delta: 1
			})
		},
		
		goCarTypePage(brandId, brandName) {
			//this.$u.route(`/pages/custom/cartypelist?brandId=${brandId}&brandName=${brandName}`)
			
			uni.setNavigationBarTitle({
				title: brandName
			})
			this.brandId = brandId
			this.brandName = brandName
			this.getCarType()
		},
		
		openPopUp(type) {
			if (type === 1) {
				this.brandName = ''
			}
			
			this.customCarInfoPopupType = type
			this.show = true
		},
		
		handleTouchStart(e) {
			this.startX = e.changedTouches[0].clientX
			this.startY = e.changedTouches[0].clientY
		},
		
		handleTouchMove(e) {
			const endX = e.changedTouches[0].clientX
			const endY = e.changedTouches[0].clientY
			if ((endX - this.startX > this.distanceX) && (endY - this.startY < this.distanceY))  {
				this.showCarType = false
				uni.setNavigationBarTitle({
					title: '选择品牌'
				})
			}
		},
		
		handleTouchEnd(e) {
			const endX = e.changedTouches[0].clientX
			const endY = e.changedTouches[0].clientY
			if ((endX - this.startX > this.distanceX) && (Math.abs(endY - this.startY) < this.distanceY))  {
				this.showCarType = false
				uni.setNavigationBarTitle({
					title: '选择品牌'
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
}

.list {
	margin-top: 20px;
	height: 0;
	flex: 1;
	padding-left: 40rpx;
	.scroll {
		width: 100%;
		height: 100%;
		.brand-list-wrap {
			.brand-wrap {
				margin-bottom: 28px;
			}
			.brand {
				.letter {
					margin-bottom: 12px;
					height: 20px;
					font-size: 12px;
					line-height: 20px;
					color: rgba(10, 15, 45, 0.5);
				}
				.brand-info {
					margin-bottom: 20px;
					display: flex;
					align-items: center;
					.logo {
						width: 60rpx;
						height: 60rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-right: 18rpx;
					}
					.brand-name {
							color: rgba(10, 15, 45, 0.8);
							height: 36px;
							line-height: 36px;
					    font-size: 15px;
					}
				}
			}
		}
	}
}

.tip-btn {
	margin: 40px 0;
	height: 34rpx;
	font-size: 12px;
	line-height: 34rpx;
	text-decoration: underline;
	color: rgba(10, 15, 45, 0.5);
	text-align: center;
}

.tip-btn1 {
	margin-top: 16px;
	padding-bottom: 60px;
	height: 34rpx;
	font-size: 12px;
	line-height: 34rpx;
	text-decoration: underline;
	color: rgba(10, 15, 45, 0.5);
}

.carTypeWrap {
	width: 100%;
	height: 100%;
	padding: 0 40rpx 40px;
	.car-type {
		height: 124rpx;
		line-height: 124rpx;
		font-size: 15px;
		color: rgba(10, 15, 45, 0.8);
		border-bottom: 2rpx solid #F0F0F0;
	}
}

#car-type-popup ::v-deep .u-drawer{
	left: 130rpx;
	box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.06);
}

#car-type-popup ::v-deep .u-mask {
	display: none;
}
</style>