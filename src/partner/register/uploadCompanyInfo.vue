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
import { applyPartnerStepList } from '@/constants'
import StepList from './components/StepList.vue'
import CompanyInfo from './components/CompanyInfo.vue'

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
				imageUrl: [],
			},
			applyPartnerStepList,
			currentStep: 1,
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
			const partnerApplyInfo = {
				...data,
			}
			uni.setStorageSync('partnerApplyInfo', partnerApplyInfo)
			
			// uni.navigateTo({
			// 	url: `/pagesOrder/identity/face-identity-tip?from=partnerApply&idNum=${this.idNum}&username=${this.username}`
			// })
			
			//this.apply(partnerApplyInfo)
			uni.navigateTo({
				url: `/partner/register/uploadPartnerInfo?userId=${this.userId}&upUserId=${this.upUserId}&career=${this.career}`
			})
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
	padding: 40rpx 40rpx 200rpx;
}
</style>