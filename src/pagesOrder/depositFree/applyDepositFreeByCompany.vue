<template>
	<view class="page">
		<StepList :stepList="stepList" :currentStep="currentStep" />
		
		<view class="container">
			<template v-if="currentStep == 0">
				<CompanyIdentity 
					v-if="identityStep === 0"
					@nextIdentityStep="nextIdentityStep"
				/>
				
				<SendVerifyCode
					v-if="identityStep === 1"
					:type="6"
					@nextIdentityStep="nextIdentityStep"
				/>
				
				<CheckVerifyCode
					v-if="identityStep === 2"
					:type="6"
					:mobile="phone"
					@nextIdentityStep="nextIdentityStep"
				/>
				
				<IdCardIdentity
					v-if="identityStep === 3"
					:type="6"
					:userId="userId"
					@nextIdentityStep="nextIdentityStep"
				/>
				
				<UploadDriverLicense
					v-if="identityStep === 4"
					:type="6"
					@nextIdentityStep="nextIdentityStep"
				/>
				
				<CompanyUserSign
					v-if="identityStep === 5"
					:username="username"
					:idNum="idNum"
					@nextStep="nextStep"
				/>
			</template>
			
			<CompanyInfo
				v-if="currentStep == 1"
				:type="6"
				:applyDepositFreeForm="applyDepositFreeForm"
				:orderServiceType="orderServiceType"
				@nextStep="nextStep"
			/>
		</view>
	</view>
</template>

<script>
import StepList from './components/StepList.vue'
import CompanyIdentity from './components/CompanyIdentity.vue'
import SendVerifyCode from './components/SendVerifyCode.vue'
import CheckVerifyCode from './components/CheckVerifyCode.vue'
import IdCardIdentity from './components/IdCardIdentity.vue'
import UploadDriverLicense from './components/UploadDriverLicense.vue'
import CompanyUserSign from './components/CompanyUserSign.vue'
import CompanyInfo from './components/CompanyInfo.vue'

export default {
	components: {
		StepList,
		// 身份认证
		CompanyIdentity,
		SendVerifyCode,
		CheckVerifyCode,
		IdCardIdentity,
		UploadDriverLicense,
		CompanyUserSign,
		// 职业信息
		CompanyInfo,
	},
	
	data() {
		return {
			orderServiceType: 1,
			stepList: [
				{ name: '身份认证' },
				{ name: '职业信息' },
				{ name: '人脸识别' },
			],
			userId: '',
			currentStep: 0,
			idNum: '',
			username: '',
			// 认证
			identityStep: 0, // 认证步骤 0.上传营业执照 1.发送验证码 2.输入验证码 3.身份证 4.驾驶证 5.上传企业实际用车人与企业关系证明文件
			phone: '',
			applyDepositFreeForm: {
				depositFreeType: 2,
				issue: '',
				userId: '',
				careerCode: '',
				careerName: '',
				companyName: '',
				cityId: '',
				cityName: '',
				socialSecurityList: [],
				imageUrl: [],
				hasGuarantor: 2, // 1. 需要担保人 2.不需要担保人 
				guarantorName: '',
				guarantorMobile: '',
			},
		}
	},
	
	onLoad(options) {
		this.orderServiceType = options.orderServiceType || 1
		// let title = '车辆免押金申请'
		// if (options.orderServiceType == 2) {
		// 	title = '实名认证'
		// }
		// uni.setNavigationBarTitle({
		// 	title,
		// })
		this.userId = options.userId
		this.currentStep = options.step
		this.idNum = options.idNum || ''
		this.username = options.username || ''
		this.applyDepositFreeForm.userId = options.userId
		this.applyDepositFreeForm.cityId = options.cityId || ''
		this.applyDepositFreeForm.cityName = options.cityName || ''
		this.applyDepositFreeForm.companyName = options.companyName || ''
	},
	
	onShow() {
		
	},
	
	methods: {
		nextIdentityStep(data) {
			if (this.identityStep === 0) {
				this.applyDepositFreeForm.companyName = data.companyName
			} else if (this.identityStep === 1) {
				this.phone = data.phone
			} else if (this.identityStep === 3) {
				this.idNum = data.idNum
				this.username = data.username
			}
			++this.identityStep
		},
		
		nextStep(data) {
			if (this.currentStep == 1) {
				this.applyDepositFreeForm = data
				uni.setStorageSync('applyDepositFreeForm', this.applyDepositFreeForm)
				uni.navigateTo({
					url: `/pagesOrder/identity/face-identity-tip?from=createOrderInfo&idNum=${this.idNum}&username=${this.username}&isApplyDepositFree=1`
				})
			}
			++this.currentStep
		},
		
	}
}
</script>

<style lang="scss" scoped>
.page {
	padding: 48rpx 0 80rpx;
	.container {
		padding: 24rpx 40rpx 80rpx;
	}
	}
</style>
