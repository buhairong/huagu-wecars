<template>
	<view class="wrap">
		<PartnerList :partnerList="partnerList" />
	</view>
</template>

<script>
import PartnerList from '../partner/components/PartnerList.vue'

export default {
	components: {
		PartnerList,
	},
	
	data() {
		return {
			partnerList: {
				scrollTop: 0,
				list: [],
				limit: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'nomore',
			},
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
	},
	
	onShow() {
		this.getPartnerList()
	},
	
	methods: {
		async getPartnerList() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				...this.customerList,
				userId: this.userId,
			}
			
			const res = await this.$getRequest(this.$url.getMyPartnerList, "GET", params)
			
			if (res.code == 0 && res.data && res.data.length) {
				this.partnerList.list = res.data
			} else {
				this.partnerList.errMsg = '暂无合伙人'
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