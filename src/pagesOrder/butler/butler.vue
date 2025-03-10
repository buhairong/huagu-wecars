<template>
	<view class='page-wrap1'>
		<view class="container" v-if="list.length > 0">
			<view class="tip">请选择一个管家为您服务</view>
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
							<view class="custom-item">
								<view class="label">学历：</view>
								<view class="content">
									{{EDUCATION_STATUS[item.education]}}
								</view>
							</view>
							<view class="custom-item">
								<view class="label">手机：</view>
								<view class="content">
									{{item.mobile}}
								</view>
							</view>
						</view>
					</view>
					<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28"></u-icon>
				</view>
			</view>
			
			<!-- <view class="order-btn-wrap">
				<view class="order-btn" @click="handleOrder">
					确定
				</view>
			</view> -->
		</view>
		<u-empty v-else text="当前城市暂无管家" mode="list" margin-top="40"></u-empty>
	</view>
</template>

<script>
	import { EDUCATION_STATUS } from "@/constants"
	
	export default {
		data() {
			return {
				EDUCATION_STATUS,
				type: '', // 1.租车订单
				cityId: '',
				orderParams: {
					cityId: '', // 城市ID
					cityName: '', // 城市名称
					carTypeYearProductId: '',
					startDate: '', // 租车开始日期
					endDate: '', // 租车结束日期
					mobile: '', // 手机号
					address: '', // 预约地址
					memberButlerId: '', // 管家ID
					companyId: '', // 公司ID
					userId: '', // 用户ID
					orderType: '', // 订单类型  1.个人 2.企业
					payWay: '', // 支付方式：0微信支付 1银行转账",
					totalDay: 1, // 总天数
					status: 0, // 状态 0创建订单 1支付中 2支付完成 3取消订单  默认0
					totalPayment: '', // 支付总金额
					riskAuditStatus: '',
				},
				list: [],
			}
		},
		
		onLoad(option) {
			this.type = option.type
			this.cityId = option.cityId
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
				this.$getRequest(this.$url.getButlerList, "POST", {
				  cityId: this.cityId,
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
				this.orderParams.memberButlerId = item.id
				uni.setStorageSync('rentalOrderParams', this.orderParams)
				console.log('handleChange')
				uni.navigateTo({
					url: `/pagesOrder/rentalIdentity/rentalIdentity?type=${this.type}&userId=${this.orderParams.userId}`
				})
			},
			
			handleOrder() {
				if (!this.orderParams.butlerId) {
					uni.showToast({
						title: '请选择一个管家',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				
				uni.setStorageSync('rentalOrderParams', this.orderParams)
				
				uni.navigateTo({
					url: `/pagesOrder/rentalIdentity/rentalIdentity?type=${this.type}&userId=${this.orderParams.userId}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
	
.page-wrap1 {
	.tip {
		font-size: 28rpx;
		line-height: 44rpx;
		color: rgba(78, 89, 105, 0.6);
	}
	.list {
		margin-top: 32rpx;
		.card {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				display: flex;
				align-items: center;
			}
			.avatar {
				margin-right: 24rpx;
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
			}
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
			&.active {
				border-color: #4170EE;
			}
		}
	}
	.order-btn-wrap {
		width: 100vw;
		position: fixed;
		bottom: 80rpx;
		left: 0;
		z-index: 100;
		padding: 0 40rpx;
		.order-btn {
			width: 100%;
			height: 116rpx;
			border-radius: 16rpx;
			background: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 34rpx;
			color: #FFFFFF;
		}
	}
}
</style>
