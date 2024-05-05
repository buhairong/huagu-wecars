<template>
	<view class="page-wrap" v-if="merchantRate !== null">
		<view>
			<view class="card">
				<view class="card-item">
					<view>企业</view>
					<view>员工</view>
				</view>
				
				<view class="card-item">
					<view>{{merchantRate}}%</view>
					<u-slider 
						v-model="merchantRate" 
						height="8" 
						block-width="32" 
						block-color="#D7EB7A"
					></u-slider>
					<view>{{commissionRate}}%</view>
				</view>
			</view>
			
			<view class="tip">
				订单成交后，将会按照您所设置的佣金比例将佣金发放至个人账户，佣金金额未含税。
			</view>
		</view>
		
		<view class="fixed-buttom-disabled-btn">
			<button @click="setCommission">保存</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userId: null,
			partnerCompanyId: null,
			merchantRate: null,
		}
	},
	
	computed: {
		commissionRate() {
			let res = 0
			if (this.merchantRate !== null) {
				res = 100 - (this.merchantRate)
			}
			return res
		},
	},
	
	onLoad(options) {
		this.userId = options.userId
		this.partnerCompanyId = options.partnerCompanyId
		
		this.getPartnerCompanyDetail()
	},
	
	methods: {
		async getPartnerCompanyDetail() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				companyId: this.partnerCompanyId,
			}
			
			const res = await this.$getRequest(this.$url.getPartnerCompanyDetail, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.merchantRate = res.data.companyCommissionRatio
			}
			
			uni.hideLoading()
		},
		
		async setCommission() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				companyId: this.partnerCompanyId,
				companyCommissionRatio: this.merchantRate,
				staffCommissionRatio: this.commissionRate,
			}
			
			const res = await this.$getRequest(this.$url.updateCommissionRatio, "GET", params)
			
			if (res.code == 0) {
				uni.showToast({
					title: '保存成功',
					duration: 2000,
					icon: "none"
				})
				
				uni.navigateBack({
					delta: 1
				})
			}
			
			uni.hideLoading()
		},
		
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

::v-deep .u-slider {
	background-image: linear-gradient(90deg, rgba(245, 247, 119, 0.3) 0%, rgba(245, 247, 119, 1) 100%);
	.u-slider__gap {
		background-image: linear-gradient(90deg, rgba(163, 221, 138, 0.3) 0%, rgba(163, 221, 138, 1) 100%);
	}
}

.page-wrap {
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.card-item {
		margin-top: 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 44rpx;
		font-size: 28rpx;
		color: #0A0F2D;
		u-slider {
			margin: 0 16rpx;
			width: 0;
			flex: 1;
		}
	}
	.tip {
		font-size: 24rpx;
		line-height: 44rpx;
		color: #848795;
	}
}
</style>
