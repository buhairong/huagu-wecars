<template>
	<view class="wrap">
		<OrderList :orderList="orderList" />
	</view>
</template>

<script>
import OrderList from '../partner/components/OrderList.vue'

export default {
	components: {
		OrderList,
	},
	
	data() {
		return {
			orderList: {
				scrollTop: 0,
				list: [],
				limit: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'nomore',
			},
			partnerCompanyId: '',
			userId: '',
			role: '',
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
		this.partnerCompanyId = options.partnerCompanyId
		this.role = options.role - 0
	},
	
	onShow() {
		this.getOrderList()
	},
	
	methods: {
		async getOrderList() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				...this.orderList,
				userId: this.userId,
			}
			
			if (this.role <= 20) {
				params.partnerCompanyId = this.partnerCompanyId
				params.role = this.role
			}
			
			const res = await this.$getRequest(this.$url.getPartnerOrderList, "POST", params)
			
			if (res.code == 0 && res.data && res.data.length) {
				this.orderList.list = res.data
			} else {
				this.orderList.errMsg = '暂无订单'
			}
			
			uni.hideLoading()
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40rpx;
}
</style>