<template>
	<view class="wrap">
		<StepList :currentStep="currentStep" />
		
		<CompanyInfo
			:type="5"
			:applyDepositFreeForm="applyDepositFreeForm"
			@nextStep="nextStep"
		/>
	</view>
</template>

<script>
import StepList from './components/StepList.vue'
import CompanyInfo from './components/PartnerInfo.vue'

export default {
	components: {
		StepList,
		CompanyInfo,
	},
	
	data() {
		return {
			userId: '',
			idNum: '',
			username: '',
			upUserId: '',
			career: '',
			applyDepositFreeForm: {
				careerCode: '',
				companyName: '',
				// imageUrl: [],
			},
			currentStep: 2,
		}
	},
	
	onLoad(options) {
		this.userId = options.userId || ''
		this.upUserId = options.upUserId || ''
		this.career = options.career || ''
		this.idNum = options.idNum || ''
		this.username = options.username || ''
	},
	
	methods: {
		nextStep(data) {
			let partnerApplyInfo = uni.getStorageSync("partnerApplyInfo")
			const params = {
				...partnerApplyInfo,
				...data,
				userId: this.userId,
				upUserId: this.upUserId,
				career: this.career,
			}
			// uni.setStorageSync('partnerApplyInfo', partnerApplyInfo)
			
			// uni.navigateTo({
			// 	url: `/pagesOrder/identity/face-identity-tip?from=partnerApply&idNum=${this.idNum}&username=${this.username}`
			// })
			
			this.apply(params)
		},
		
		async apply(partnerApplyInfo) {
			const result = await this.$getRequest(this.$url.partnerApply, 'POST', partnerApplyInfo)
			if(result.code == 0){
				uni.reLaunch({
					url: `/partner/register/registerSuccess?isHasOrder=2`
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 80rpx 40rpx 200rpx;
}
</style>