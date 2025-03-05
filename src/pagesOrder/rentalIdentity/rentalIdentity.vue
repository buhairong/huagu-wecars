<template>
	<view class="page-wrap1">
		<view class="item" @click="handleChange(1)">
			<view class="left">
				<view class="img">
					<image style="width:100%;height:100%;" src="https://image.51cheyaoshi.com/xcx/app/static/carlife/person_icon.png"></image>
				</view>
				<view class="text">个人</view>
			</view>
			<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28"></u-icon>
		</view>
		
		<view class="item" @click="handleChange(2)">
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
				type: '', // 1.租车订单
				userId: '',
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
			}
		},
		
		onLoad(option) {
			this.type = option.type
			this.userId = option.userId
		},
		
		onShow() {
			const params = uni.getStorageSync('rentalOrderParams')
			if (params) {
				this.orderParams = params
			}
		},
		
		methods: {
			handleChange(type) {
				this.orderParams.orderType = type
				uni.setStorageSync('rentalOrderParams', this.orderParams)
				if (type == 1) {
					this.handlePerson()
				} else {
					this.handleCompany()
				}
			},
			
			handlePerson() {
				if (this.orderParams.riskAuditStatus == 5) {
					if(this.type == 1) {
						// uni.navigateTo({
						// 	url: `/pagesOrder/rental/order/rentalOrderDetail`
						// })
					}
				} else {
					uni.navigateTo({
						url: `/pagesOrder/rentalIdentity/personIdentity?type=${this.type}&userId=${this.userId}`
					})
				}
			},
			
			handleCompany() {
				uni.navigateTo({
					url: `/pagesOrder/rentalIdentity/companyList?type=${this.type}&userId=${this.userId}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

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
</style>
