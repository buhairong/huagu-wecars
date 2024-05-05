<template>
	<view v-if="detail">
		<ProductDetailHeader 
			:bannerList="bannerList" 
			:carInfo="currentProduct" 
			:userInfo="userInfo" 
			@changeLike="changeLike"
		/>
		
		<view class="tab">
			<view class="line"></view>
			会员租车
		</view>
		
		<view class="model-box">
		  <scroll-view scroll-x class="model-scroll">
		    <view
					v-for="(item, index) in detail.carRentalProductDetailRespVOList"
		      :key="index"
		      class="item"
		      :class="currentProduct.carTypeYearProductEntity.id === item.carTypeYearProductEntity.id ? 'active' : ''"
		      @click="changeCarTypeYearProductId(item.carTypeYearProductEntity.id)"
		    >
		      {{ item.carTypeYearProductEntity.carTypeYear }} {{ item.carTypeYearProductEntity.carTypeYearProduct }}
		    </view>
		  </scroll-view>
		</view>
		
		<view class="container">
			<RentalTemplateItem 
				:templateRespVO="currentProduct.carRentalDetailEntityList" 
				:userInfo="userInfo" 
				:cityId="cityId" 
				:carInfo="currentProduct"
				@change="changeRentalPlan"
			/>
		</view>
		
		<view class="footer-btn" v-if="currentPlan">
			<view class="btn">
				<view class="left">
					<view class="price-wrap" @click.stop="openPayPop">
						<view class="pay">
							<view class="unit">¥</view>
							<view class="price">{{(currentPlan.item.totalPay+(currentPlan.plateNumFee || 0)) | $numFormat}}</view>
						</view>
						<view style="margin-left:10rpx;">
							<u-icon name="info-circle" color="#fff" size="28"></u-icon>
						</view>
					</view>
				</view>
				<view class="right" @click.stop="handleOrder">
					<view class="btn-text">立即订车</view>
					<image
						class="detail-arrow"
						src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
					/>
				</view>
			</view>
		</view>
		
		<RentalPayPopup 
			v-if="currentPlan && showPayPop"
			:showPopup.sync="showPayPop"
			:paymentItem="currentPlan.item"
			:plateNumFee="currentPlan.plateNumFee"
			@close="closePopup"
		/>
	</view>
</template>

<script>
import { addUserCarIntention } from '@/utils/index'
import ProductDetailHeader from '../../components/ProductDetailHeader.vue'
import RentalTemplateItem from '../../components/RentalTemplateItem.vue'
import RentalPayPopup from '../../components/RentalPayPopup.vue'

export default {
	components: {
	  ProductDetailHeader,
		RentalTemplateItem,
		RentalPayPopup,
	},
	
	data() {
		return {
			carTypeId: null,
			cityId: null,
			detail: null,
			currentProduct: {},
			bannerList: [],
			userInfo: null,
			currentPlan: null,
			showPayPop: false,
		}
	},
	
	onLoad(options) {
		this.carTypeId = options.carTypeId
		this.cityId = options.cityId
		this.getCarRentalDetail()
	},
	
	onShow() {
		const isLogin = uni.getStorageSync('isLogin')
		
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				this.userInfo = data
			})
		}
	},
	
	methods: {
		getCarRentalDetail() {
			let userId = ''
			const isLogin = uni.getStorageSync('isLogin')
			
			if (isLogin) {
				const userInfo = uni.getStorageSync('userInfo')
				if (userInfo) {
					userId = userInfo.id || ''
				}
			}
			
			this.$getRequest(this.$url.getCarRentalDetail, 'GET', {
				businessType: 1,
				carTypeId: this.carTypeId,
				userId,
			}).then(res => {
				if (res.code === 0) {
					this.detail = res.data
					this.currentProduct = res.data.carRentalProductDetailRespVOList[0]
					this.bannerList = res.data.carTypeYearProductImageList.map(item => item.imageUrl)
					if (this.userInfo) {
						addUserCarIntention(3, this.carTypeId, userId)
					}
				}
			})
		},
		
		changeCarTypeYearProductId(id) {
			this.currentProduct = this.detail.carRentalProductDetailRespVOList.find(item => item.carTypeYearProductEntity.id === id)
		},
		
		changeLike(data) {
			this.currentProduct.isLike = data
		},
		
		changeRentalPlan(data) {
			this.currentPlan = data
		},
		
		openPayPop() {
			this.showPayPop = true
		},
		
		closePopup() {
			this.showPayPop = false
		},
		
		async handleOrder() {
			if (this.userInfo) {
				if (this.currentPlan.custom.isSameAddr == 1 && !this.currentPlan.pickCarAddr) {
					uni.showToast({
						title: '请输入取还车地址',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				
				if (!this.currentPlan.pickCarAddr) {
					uni.showToast({
						title: '请输入取车地址',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				
				if (!this.currentPlan.returnCarAddr) {
					uni.showToast({
						title: '请输入还车地址',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				
				let riskAuditStatus = ''
				if (this.userInfo.riskAuditStatus) {
					riskAuditStatus = this.userInfo.riskAuditStatus
				}
				
				let idcard = ''
				let issue = ''
				if (this.userInfo.userInfoEntity) {
					idcard = this.userInfo.userInfoEntity.idcard || ''
					issue = this.userInfo.userInfoEntity.issue || ''
				}
				
				let depositFreeType = ''
				if (this.userInfo.depositFreeType) {
					depositFreeType = this.userInfo.depositFreeType
				}
				
				let companyName = ''
				if (this.userInfo.userCompanyEntity && this.userInfo.userCompanyEntity.companyName) {
					companyName = this.userInfo.userCompanyEntity.companyName
				}
				
				const params = {
					businessType: 1,
					carRentalDetailSubscribeId: this.currentPlan.item.id,
					carTypeYearProductId: this.currentProduct.carTypeYearProductEntity.id,
					cityId: this.currentPlan.selCityId,
					cityName: this.currentPlan.selCityName,
					startDate: `${this.currentPlan.custom.pickCarTimeStart.year}-${this.currentPlan.custom.pickCarTimeStart.month}-${this.currentPlan.custom.pickCarTimeStart.date} ${this.currentPlan.custom.pickCarTimeStart.hour}:${this.currentPlan.custom.pickCarTimeStart.minute}`,
					endDate: `${this.currentPlan.custom.pickCarTimeEnd.year}-${this.currentPlan.custom.pickCarTimeEnd.month}-${this.currentPlan.custom.pickCarTimeEnd.date} ${this.currentPlan.custom.pickCarTimeStart.hour}:${this.currentPlan.custom.pickCarTimeStart.minute}`,
					pickUpAddress: this.currentPlan.pickCarAddr,
					returnAddress: this.currentPlan.returnCarAddr,
					deposit: this.currentPlan.item.depositDetail,
					totalPayment: this.currentPlan.item.money * (this.currentPlan.item.period / 30),
					userId: this.userInfo.id,
					plateNumFee: this.currentPlan.plateNumFee,
				}
				
				const res = await this.$getRequest(this.$url.createUserCarRentalSubscribe, 'POST', params)
				
				if(res.code === 0) {
					uni.navigateTo({
						url: `/pagesOrder/identity/choose-identity?orderServiceType=2&riskAuditStatus=${riskAuditStatus}&id=${res.data}&idNum=${idcard}&username=${this.userInfo.name}&userId=${this.userInfo.id}&hasDepositFree=${this.userInfo.hasDepositFree}&cityId=${this.currentPlan.selCityId}&cityName=${this.currentPlan.selCityName}&issue=${issue}&depositFreeType=${depositFreeType}&companyName=${companyName}`
					})
				}
			} else {
				uni.navigateTo({
					url: `/pages/sign/sign`
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.tab {
	padding-left: 32rpx;
	display: flex;
	align-items: center;
	font-size: 14px;
	font-weight: 600;
	color: #0A0F2D;
	height: 50rpx;
	line-height: 50rpx;
	.line {
		transform: translateY(-2rpx) rotate(114deg) skew(20deg);
		background: #0AEB7D;
		width: 32rpx;
		height: 8rpx;
	}
}

.model-box {
	margin-top: 24rpx;
	padding-left: 32rpx;
	.model-scroll {
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		.item {
			font-size: 24rpx;
			background: rgba(10, 15, 45, 0.04);
			border-radius: 8px;
			padding: 12rpx 24rpx;
			display: inline-block;
			margin: 0 8rpx;
			color: rgba(10, 15, 45, 0.8);
		}
		.active {
			background: rgba(10, 235, 125, 0.6);
			color: #0a0f2d;
			font-weight: 500;
		}
	}
}
	
.container {
	padding: 0 32rpx 200rpx;
}

.footer-btn {
	width: 100%;
	padding: 0 40rpx;
	position: fixed;
	bottom: 40px;
	left: 0;
	z-index: 100;
	.btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #fff;
		padding-left: 32rpx;
		.left {
			.price-wrap {
				height: 40rpx;
				display: flex;
				align-items: center;
				.pay-type {
					font-size: 12px;
				}
				.pay {
					display: flex;
					align-items: flex-end;
					.unit {
						font-size: 12px;
						transform: translateY(-6rpx);
					}
					.price {
						font-size: 20px;
					}
				}
			}
			.tip {
				margin-top: 4px;
				height: 32rpx;
				font-size: 10px;
				line-height: 32rpx;
				color: rgba(255, 255, 255, 0.8);
			}
		}
		.right {
			padding: 0 32rpx;
			height: 100%;
			display: flex;
			align-items: center;
			.detail-arrow {
				margin-left: 12rpx;
				width: 24rpx;
				height: 24rpx;
			}
		}
	}
}

</style>