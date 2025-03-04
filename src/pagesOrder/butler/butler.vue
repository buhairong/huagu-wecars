<template>
	<view class='wrap'>
		管家
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '', // 1.租车订单
				cityId: '',
				orderParams: {
					cityId: undefined, // 城市ID
					cityName: '', // 城市名称
					pickCarTimeStart: '', // 租车开始日期
					pickCarTimeEnd: '', // 租车结束日期
					contactName: '', // 联系人
					mobile: '', // 手机号
					address: '', // 预约地址
					butlerId: '', // 管家ID
					companyId: '', // 公司ID
					userId: '', // 用户ID
					orderType: '', // 订单类型  1.个人 2.企业
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
				  limit: 100,
				}).then(res => {
					uni.hideLoading()
					this.list = res.data.records
				}).catch(() => {
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 32rpx 32rpx 80rpx;
}
</style>
