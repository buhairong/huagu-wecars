<template>
	<view class="page-wrap1">
		<view class="title">增值税专用发票开票信息：</view>
		
		<view class="card" v-if="isModify || !orderParams.id">
			<view class="custom-item">
				<view class="label">公司名称</view>
				<view class="content">
					<u-input
						v-model="orderParams.companyName"
						placeholder="请输入公司名称"
					/>
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">社会统一信用代码</view>
				<view class="content">
					<u-input
						v-model="orderParams.corporationTaxNumber"
						placeholder="请输入社会统一信用代码"
					/>
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">公司地址</view>
				<view class="content">
					<u-input
						v-model="orderParams.companyAddress"
						placeholder="请输入公司地址"
					/>
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">联系电话</view>
				<view class="content">
					<u-input
						v-model="orderParams.phone"
						placeholder="请输入联系电话"
					/>
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">开户行</view>
				<view class="content">
					<u-input
						v-model="orderParams.openBank"
						placeholder="请输入开户行"
					/>
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">银行账号</view>
				<view class="content">
					<u-input
						v-model="orderParams.bankAccount"
						placeholder="请输入银行账号"
					/>
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">开户行地址</view>
				<view class="content">
					<u-input
						v-model="orderParams.bankAddress"
						placeholder="请输入开户行地址"
					/>
				</view>
			</view>
		</view>
		
		<view class="card detail-card" v-else>
			<view class="custom-item">
				<view class="label">公司名称</view>
				<view class="content">
					{{orderParams.companyName}}
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">社会统一信用代码</view>
				<view class="content">
					{{orderParams.corporationTaxNumber}}
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">公司地址</view>
				<view class="content">
					{{orderParams.companyAddress}}
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">联系电话</view>
				<view class="content">
					{{orderParams.phone}}
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">开户行</view>
				<view class="content">
					{{orderParams.openBank}}
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">银行账号</view>
				<view class="content">
					{{orderParams.bankAccount}}
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">开户行地址</view>
				<view class="content">
					{{orderParams.bankAddress}}
				</view>
			</view>
		</view>
		
		<view class="order-btn-wrap">
			<template v-if="isModify">
				<view
				  class="btn cancel-btn"
				  @click="handleCancel"
				>
				  取消
				</view>
				<view class="btn order-btn" @click="handleOrder">
					确认修改
				</view>
			</template>
			<template v-else>
				<view
				  v-if="orderParams.id"
				  class="btn cancel-btn"
				  @click="handleDel"
				>
				  删除开票信息
				</view>
				<view class="btn order-btn" @click="handleOrder">
					{{orderParams.id ? '修改' : '添加'}}开票信息
				</view>
			</template>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderParams: {
					 userId: '',
					 id: '',
					 companyName: '',
					 corporationTaxNumber: '',
					 companyAddress: '',
					 phone: '',
					 openBank: '',
					 bankAccount: '',
					 bankAddress: ''
				},
				isModify: false,
			}
		},
		
		onLoad(option) {
			this.orderParams.userId = option.userId
			this.getDetail()
		},
		
		methods: {
			getDetail() {
				uni.showLoading({
				  title: '加载中'
				});
				this.$getRequest(this.$url.getUserTax, "GET", {
				  userId: this.orderParams.userId
				}).then(res => {
					uni.hideLoading()
					if (res.data) {
						this.orderParams = res.data
					}
					
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			handleCancel() {
				this.isModify = false
			},
			
			handleOrder() {
				if (this.isModify || !this.orderParams.id) {
					if(!this.orderParams.companyName) {
						uni.showToast({
								title: '请输入公司名称',
								duration: 2000,
								icon: 'none'
						});
								
						return false;
					}
					
					if(!this.orderParams.corporationTaxNumber) {
						uni.showToast({
								title: '请输入社会统一信用代码',
								duration: 2000,
								icon: 'none'
						});
								
						return false;
					}
					
					if(!this.orderParams.companyAddress) {
						uni.showToast({
								title: '请输入公司地址',
								duration: 2000,
								icon: 'none'
						});
								
						return false;
					}
					
					if(!this.orderParams.phone) {
						uni.showToast({
								title: '请输入联系电话',
								duration: 2000,
								icon: 'none'
						});
								
						return false;
					}
					
					if(!this.orderParams.openBank) {
						uni.showToast({
								title: '请输入开户行',
								duration: 2000,
								icon: 'none'
						});
								
						return false;
					}
					
					if(!this.orderParams.bankAccount) {
						uni.showToast({
								title: '请输入银行账号',
								duration: 2000,
								icon: 'none'
						});
								
						return false;
					}
					
					if(!this.orderParams.bankAddress) {
						uni.showToast({
								title: '请输入开户行地址',
								duration: 2000,
								icon: 'none'
						});
								
						return false;
					}
					
					uni.showLoading({
					  title: '加载中'
					});
					
					this.$getRequest(this.$url.addOrUpdateUserTax, "POST", this.orderParams).then(res => {
						uni.hideLoading()
						if(res.code != 0) {
							uni.showToast({
								title: res.msg || '保存失败',
								duration: 2000,
								icon: 'none'
							})
						} else {
							uni.navigateBack({
								delta: 1
							});
						}
						
					}).catch(() => {
						uni.hideLoading()
						uni.showToast({
							title: '保存失败',
							duration: 2000,
							icon: 'none'
						})
					})
				} else {
					this.isModify = true
				}
			},
			
			handleDel() {
				uni.showModal({
					title: '提示',
					content: `确定要删除开票信息吗？`,
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中'
							})
							
							this.$getRequest(this.$url.deleteUserTax, "GET", {
							  id: this.orderParams.id,
							}).then(res => {
								uni.hideLoading()
								if (res.code == 0) {
									uni.showToast({
										title: '删除成功',
										duration: 2000,
										icon: "none"
									})
									
									uni.navigateBack({
										delta: 1
									});
								} else {
									uni.showToast({
										title: res.msg || '删除失败',
										duration: 2000,
										icon: "none"
									})
								}
								
							}).catch(() => {
								uni.hideLoading()
								uni.showToast({
									title: '删除失败',
									duration: 2000,
									icon: "none"
								})
							})
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
	.title {
		line-height: 44rpx;
		font-size: 36rpx;
		color: #0a0f2d;
		font-weight: 600;
	}
	.card {
		margin-top: 40rpx;
		.custom-item {
			margin-bottom: 8rpx;
			display: flex;
			justify-content: space-between;
			line-height: 70rpx;
			.label {
				width: 300rpx;
				font-size: 30rpx;
				color: #0A0F2D;
				padding-right: 24rpx;
			}
			.content {
				padding: 0;
				width: 0;
				flex: 1;
				display: flex;
				justify-content: flex-end;
				font-size: 28rpx;
				color: rgba(10, 15, 45, 0.8);
				u-input {
					width: 100%;
				}
				::v-deep .u-input__input {
					flex: 1;
					text-align: right;
					background: transparent;
				}
			}
		
		}
	}
	
	.detail-card {
		.custom-item {
			margin-bottom: 32rpx;
			line-height: 44rpx;
		}
		
	}
	
	.order-btn-wrap {
		display: flex;
		gap:24rpx;
		.btn {
			width: 0;
			flex: 1;
		}
		.cancel-btn {
			background: rgba(10, 15, 45, 0.04);
			border-radius: 16rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #0A0F2D;
			font-weight: 500;
			height: 116rpx;
			font-size: 34rpx;
		}
	}
}
</style>
