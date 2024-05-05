<template>
	<view class="wrap">
		<view class="item" @click="goIdentityPage(5)">
			<view class="left">
				<view class="img">
					<image style="width:100%;height:100%;" src="https://image.51cheyaoshi.com/xcx/app/static/carlife/person_icon.png"></image>
				</view>
				<view class="text">个人</view>
			</view>
			<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28"></u-icon>
		</view>
		
		<view class="item" @click="goIdentityPage(6)">
			<view class="left">
				<view class="img">
					<image style="width:100%;height:100%;" src="https://image.51cheyaoshi.com/xcx/app/static/carlife/company_icon.png"></image>
				</view>
				<view class="text">企业</view>
			</view>
			<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28"></u-icon>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderServiceType: 1, // 1.订阅 2.租车
			orderId: '',
			riskAuditStatus: '',
			idNum: '',
			username: '',
			hasDepositFree: '', // 0 未申请 1申请中 2审批通过 3 审批拒绝
			userId: '',
			cityId: '',
			cityName: '',
			issue: '',
			depositFreeType: '',
			companyName: '',
		}
	},
	onLoad(options) {
		this.orderServiceType = options.orderServiceType || 1
		this.orderId = options.id || ''
		this.riskAuditStatus = options.riskAuditStatus
		this.idNum = options.idNum
		this.username = options.username
		this.hasDepositFree = options.hasDepositFree || ''
		this.userId = options.userId
		this.cityId = options.cityId || ''
		this.cityName = options.cityName || ''
		this.issue = options.issue || ''
		this.depositFreeType = options.depositFreeType || ''
		this.companyName = options.companyName || ''
	},
	
	methods: {
		// index 5.个人 6.企业
		// riskAuditStatus 5. 个人已签约 6.企业已签约
		goIdentityPage(index) {
			const createOrderInfo = {
				orderServiceType: this.orderServiceType,
				orderId: this.orderId,
				orderType: index === 5 ? 1 : 2,
				idNum: this.idNum,
				username: this.username,
			}
			uni.setStorageSync('createOrderInfo', createOrderInfo)
			
			if (index === 5) {
				if (this.riskAuditStatus == 5 || this.riskAuditStatus == 6) {
					if (this.orderServiceType == 3) {
						this.goCustomerRentalPage(1)
					} else {
						this.goDepositFree(1)
					}
				} else {
					if (this.orderServiceType == 3) {
						const rentalForm = uni.getStorageSync('rentalForm')
						
						if (rentalForm) {
							rentalForm.orderType = 1
							uni.setStorageSync('rentalForm', rentalForm)
						}
						const customerRental = {
							from: 'customerRental',
							idNum: this.idNum,
							username: this.username,
						}
						uni.setStorageSync('from', customerRental)
						uni.navigateTo({
							url: '/pagesOrder/identity/person-identity?type=5'
						})
					} else {
						uni.navigateTo({
							url: `/pagesOrder/depositFree/applyDepositFreeByPerson?orderServiceType=${this.orderServiceType}&userId=${this.userId}&step=0&idNum=${this.idNum}&username=${this.username}&cityId=${this.cityId}&cityName=${this.cityName}&issue=${this.issue}`
						})
					}
				}
			} else {
				if (this.riskAuditStatus == 6) {
					if (this.orderServiceType == 3) {
						this.goCustomerRentalPage(2)
					} else {
						this.goDepositFree(2)
					}
				} else {
					if (this.orderServiceType == 3) {
						const rentalForm = uni.getStorageSync('rentalForm')
						
						if (rentalForm) {
							rentalForm.orderType = 1
							uni.setStorageSync('rentalForm', rentalForm)
						}
						
						const customerRental = {
							from: 'customerRental',
							idNum: this.idNum,
							username: this.username,
						}
						uni.setStorageSync('from', customerRental)
						uni.navigateTo({
							url: '/pagesOrder/identity/company-identity'
						})
					} else {
						uni.navigateTo({
							url: `/pagesOrder/depositFree/applyDepositFreeByCompany?orderServiceType=${this.orderServiceType}&userId=${this.userId}&step=0&idNum=${this.idNum}&username=${this.username}&cityId=${this.cityId}&cityName=${this.cityName}&issue=${this.issue}`
						})
					}
				}
			}
		},
		
		goCustomerRentalPage(type) {
			const rentalForm = uni.getStorageSync('rentalForm')
			
			if (rentalForm) {
				rentalForm.orderType = type
				uni.setStorageSync('rentalForm', rentalForm)
				uni.reLaunch({
					url: `/pages/custom/custom-order?tab=2`
				})
			}
		},
		
		goDepositFree(index) {
			// this.hasDepositFree = 2
			
			if (this.hasDepositFree != 2) {
				if (index === 1) {
					uni.navigateTo({
						url: `/pagesOrder/depositFree/applyDepositFreeByPerson?orderServiceType=${this.orderServiceType}&userId=${this.userId}&step=1&idNum=${this.idNum}&username=${this.username}&cityId=${this.cityId}&cityName=${this.cityName}&issue=${this.issue}`
					})
				} else {
					uni.navigateTo({
						url: `/pagesOrder/depositFree/applyDepositFreeByCompany?orderServiceType=${this.orderServiceType}&userId=${this.userId}&step=1&idNum=${this.idNum}&username=${this.username}&cityId=${this.cityId}&cityName=${this.cityName}&issue=${this.issue}&companyName=${this.companyName}`
					})
				}
			} else {
				this.faceIdentity()
			}
		},
		
		faceIdentity() {
			uni.navigateTo({
				url: `/pagesOrder/identity/face-identity-tip?from=createOrderInfo&idNum=${this.idNum}&username=${this.username}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40px 40rpx;
	.item {
		margin-bottom: 20px;
		padding: 20px 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		border-radius: 8rpx;
		background: rgba(10, 15, 45, 0.02);
		.left {
			display: flex;
			align-items: center;
			.img {
				width: 110rpx;
				height: 110rpx;
				border-radius: 50%;
				overflow: hidden;
			}
			.text {
				padding-left: 20rpx;
				font-size: 16px;
				color: #333333;
			}
		}
	}
}
</style>