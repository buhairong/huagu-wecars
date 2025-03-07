<template>
	<view class='page-wrap1'>
		<view class="container" v-if="list.length > 0">
			<view class="list">
				<view v-for="item in list" :key="item.id" class="card" @click="handleChange(item)">
					<view class="left">
						<view class="title">
							{{item.userCompanyEntity.companyName}}
						</view>
						
						<view class="custom-item">
							<view class="label">充值余额：</view>
							<view class="content">
								{{ formatThousandNumber(item.userCompanyEntity.userCompanyAccountEntity.rechargeAmount) }}元
							</view>
						</view>
						
						<view class="custom-item">
							<view class="label">赠送余额：</view>
							<view class="content">
								{{ formatThousandNumber(item.userCompanyEntity.userCompanyAccountEntity.giftAmount) }}元
							</view>
						</view>
						
						<view class="custom-item">
							<view class="label">可用余额：</view>
							<view class="content">
								{{ formatThousandNumber(item.userCompanyEntity.userCompanyAccountEntity.balance) }}元
							</view>
						</view>
						
						<view class="btn-group" v-if="type == 0">
							<view class="btn" @click.stop="hanleStaff(item)">
								查看员工
							</view>
							<view v-if="item.relation == 1" class="btn" @click.stop="handleIdentity(2, item)">
								修改企业
							</view>
							<view v-if="item.relation == 1" class="btn" @click.stop="removeCompany(item)">
								删除企业
							</view>
						</view>
					</view>
					
					<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28"></u-icon>
				</view>
			</view>
		</view>
		<u-empty v-else text="暂无企业" mode="list" margin-top="40"></u-empty>
		
		<view class="order-btn-wrap">
			<view class="order-btn" @click="handleIdentity(1)">
				添加企业
			</view>
		</view>
	</view>
</template>

<script>
import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'

	export default {
		data() {
			return {
				type: '', // 0 我的企业  1.租车订单
				userId: '',
				list: [],
				selectedCompanyId: '',
			}
		},
		
		onLoad(option) {
			this.type = option.type
			this.userId = option.userId
		},
		
		onShow() {
			this.getList()
			if (this.type == 1) {
				const params = uni.getStorageSync('rentalOrderParams')
				if (params) {
					this.orderParams = params
				}
			}
		},
		
		methods: {
			formatThousandNumber(price) {
				return formatThousandNumber(price)
			},
			
			getList() {
				uni.showLoading({
				  title: '加载中'
				});
				this.$getRequest(this.$url.getCompanyList, "GET", {
				  userId: this.userId,
				  page: 1,
				  limit: 100,
				}).then(res => {
					uni.hideLoading()
					this.list = res.data
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			async handleChange(item) {
				if (this.type == 0) {
					uni.navigateTo({
						url: `/pagesOrder/account/companyAccount?userId=${this.userId}&companyId=${item.companyId}&companyName=${item.userCompanyEntity.companyName}`
					})
				}else if(this.type == 1) {
					this.orderParams.companyId = item.companyId
					const orderRes = await this.$getRequest(this.$url.addOrUpdateMemberUserRentalOrder, 'POST', this.orderParams)
					
					if(orderRes.code != 0) {
						uni.showToast({
							title: '创建订单失败',
							duration: 2000,
							icon: 'none'
						})
						return false;
					}
					
					uni.navigateTo({
						url: `/pagesOrder/rental/order/rentalOrderDetail?id=${orderRes.data.id}&userId=${this.userId}`
					})
				}
			},
			
			handleIdentity(type, item) {
				let companyId = ''
				let businessLicense = ''
				if (type == 2) {
					companyId = item.companyId
					businessLicense = item.userCompanyEntity.businessLicense
				}
				uni.navigateTo({
					url: `/pagesOrder/rentalIdentity/companyIdentity?userId=${this.userId}&companyId=${companyId}&businessLicense=${businessLicense}`
				})
			},
			
			hanleStaff(item) {
				uni.navigateTo({
					url: `/pagesOrder/rentalIdentity/staffList?userId=${this.userId}&companyId=${item.companyId}&companyName=${item.userCompanyEntity.companyName}&relation=${item.relation}`
				})
			},
			
			removeCompany(item) {
				uni.showModal({
					title: '提示',
					content: `确定要删除企业 ${item.userCompanyEntity.companyName} 吗？`,
					success: async (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中'
							})
							
							const params = {
								userCompanyId: item.companyId
							}
							
							const res = await this.$getRequest(this.$url.deleteUserCompany, "GET", params)
							
							if (res.code == 0) {
								uni.showToast({
									title: '已成功删除',
									duration: 2000,
									icon: "none"
								})
								
								this.getList()
							}
							
							uni.hideLoading()
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap1 {
	padding-bottom: 240rpx;
}

.card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		width: 0;
		flex: 1;
	}
	.title {
		line-height: 44rpx;
		font-size: 28rpx;
		color: #0A0F2D;
		font-weight: 500;
		margin-bottom: 32rpx;
	}
	.custom-item {
		margin-top: 8rpx;
		height: 44rpx;
		display: flex;
		align-items: center;
		
		&:first-child {
			margin-top: 32rpx;
		}
		.label {
			font-size: 28rpx;
			color: #0A0F2D;
		}
		.content {
			padding: 0;
			font-size: 28rpx;
			color: rgba(10, 15, 45, 0.8);
		}
	}
	
	.btn-group {
		margin-top: 32rpx;
		display: flex;
		.btn {
			margin-right: 16rpx;
			width: 128rpx;
			height: 56rpx;
			border-radius: 8rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 2rpx solid rgba(65, 112, 238, 0.8);
			color: #4170EE;
			font-size: 12px;
		}
	}
	
	.u-icon {
		margin-left: 24rpx;
	}
}
</style>
