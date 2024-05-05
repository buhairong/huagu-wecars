<template>
	<view class="wrap">
		<CustomerList :customerList="customerList" />
	</view>
</template>

<script>
import CustomerList from '../partner/components/CustomerList.vue'

export default {
	components: {
		CustomerList,
	},
	
	data() {
		return {
			customerList: {
				scrollTop: 0,
				list: [],
				limit: 1000,
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
		this.getCustomerList()
	},
	
	methods: {
		async getCustomerList() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				...this.customerList,
				userId: this.userId,
			}
			
			if (this.role <= 20) {
				params.partnerCompanyId = this.partnerCompanyId
				params.role = this.role
			}
			
			const res = await this.$getRequest(this.$url.getPartnerCustomerList, "POST", params)
			
			if (res.code == 0 && res.data && res.data.length) {
				this.customerList.list = res.data
			} else {
				this.customerList.errMsg = '暂无客户'
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