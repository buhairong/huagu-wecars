<template>
	<view class='page-wrap1'>
		<view class="container" v-if="list.length > 0">
			<view class="list">
				<view v-for="item in list" :key="item.id" class="card" @click="handleChange(item)">
					<view class="left">
						<image
							class="avatar"
							mode="aspectFill"
							:src="item.imageUrl || 'https://image.51cheyaoshi.com/xcx/app/static/carlife/worker_icon.png'"
						/>
						<view class="info">
							<view class="custom-item">
								<view class="label">姓名：</view>
								<view class="content">
									{{item.name}}
								</view>
							</view>
							<view class="custom-item">
								<view class="label">性别：</view>
								<view class="content">
									{{item.sex == 1 ? '男' : '女'}}
								</view>
							</view>
						</view>
					</view>
					<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28"></u-icon>
				</view>
			</view>
		</view>
		<u-empty v-else text="暂无企业" mode="list" margin-top="40"></u-empty>
		
		<view class="order-btn-wrap">
			<view class="order-btn" @click="handleIdentity">
				添加企业
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '', // 1.租车订单
				userId: '',
				list: [],
				selectedCompanyId: '',
			}
		},
		
		onLoad(option) {
			this.type = option.type
			this.userId = option.userId
			this.getList()
		},
		
		onShow() {
			if (this.type == 1) {
				const params = uni.getStorageSync('rentalOrderParams')
				if (params) {
					this.orderParams = params
				}
			}
		},
		
		methods: {
			getList() {
				uni.showLoading({
				  title: '加载中'
				});
				this.$getRequest(this.$url.getCompanyList, "GET", {
				  userId: this.userId,
				  page: 1,
				  limit: 1000,
				}).then(res => {
					uni.hideLoading()
					this.list = res.data.records
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			handleChange(item) {
				
			},
			
			handleIdentity() {
				uni.navigateTo({
					url: `/pagesOrder/rentalIdentity/companyIdentity?userId=${this.userId}&companyId=${this.selectedCompanyId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.custom-item {
		margin-top: 8rpx;
		height: 44rpx;
		display: flex;
		align-items: center;
		&:first-child {
			margin-top: 0;
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
}
</style>
