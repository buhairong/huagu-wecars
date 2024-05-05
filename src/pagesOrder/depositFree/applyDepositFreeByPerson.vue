<template>
	<view class="page">
		<StepList :stepList="stepList" :currentStep="currentStep" />
		
		<view class="container">
			<template v-if="currentStep == 0">
				<SendVerifyCode 
					v-if="identityStep === 0"
					:type="5"
					@nextIdentityStep="nextIdentityStep"
				/>
				
				<CheckVerifyCode
					v-if="identityStep === 1"
					:type="5"
					:mobile="phone"
					@nextIdentityStep="nextIdentityStep"
				/>
				
				<IdCardIdentity
					v-if="identityStep === 2"
					:type="5"
					:userId="userId"
					@nextIdentityStep="nextIdentityStep"
				/>
				
				<UploadDriverLicense
					v-if="identityStep === 3"
					:type="5"
					@nextStep="nextStep"
				/>
			</template>
			
			<template v-if="currentStep == 1">
				<ChooseOccupation
					v-if="occupationStep === 0"
					@nextOccupationStep="nextOccupationStep"
				/>
				
				<CompanyInfo
					v-if="occupationStep === 1"
					:type="5"
					:applyDepositFreeForm="applyDepositFreeForm"
					:orderServiceType="orderServiceType"
					@nextStep="nextStep"
				/>
			</template>
			
			<AddGuarantor
				v-if="currentStep == 3"
				@save="save"
			/>
		</view>
	</view>
</template>

<script>
import StepList from './components/StepList.vue'
import SendVerifyCode from './components/SendVerifyCode.vue'
import CheckVerifyCode from './components/CheckVerifyCode.vue'
import IdCardIdentity from './components/IdCardIdentity.vue'
import UploadDriverLicense from './components/UploadDriverLicense.vue'
import ChooseOccupation from './components/ChooseOccupation.vue'
import CompanyInfo from './components/CompanyInfo.vue'
import AddGuarantor from './components/AddGuarantor.vue'

export default {
	components: {
		StepList,
		// 身份认证
		SendVerifyCode,
		CheckVerifyCode,
		IdCardIdentity,
		UploadDriverLicense,
		// 职业信息
		ChooseOccupation,
		CompanyInfo,
		// 担保人
		AddGuarantor,
	},
	
	data() {
		return {
			orderServiceType: 1,
			userId: '',
			currentStep: 0,
			idNum: '',
			username: '',
			// 认证
			identityStep: 0, // 认证步骤 0.发送验证码 1.输入验证码 2.身份证 3.驾驶证
			phone: '',
			// 职业信息
			occupationStep: 0, // 认证步骤 0.选择职业 1.公司信息
			applyDepositFreeForm: {
				depositFreeType: 1,
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
			stepList: [
				{ name: '身份认证' },
				{ name: '职业信息' },
				{ name: '人脸识别' },
			],
		}
	},
	
	computed: {
		// stepList() {
		// 	return this.applyDepositFreeForm.hasGuarantor == 1 
		// 		? [
		// 				{ name: '身份认证' },
		// 				{ name: '职业信息' },
		// 				{ name: '人脸识别' },
		// 				{ name: '添加担保人' },
		// 			] 
		// 		: [
		// 				{ name: '身份认证' },
		// 				{ name: '职业信息' },
		// 				{ name: '人脸识别' },
		// 			] 
		// },
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
		this.applyDepositFreeForm.issue = options.issue || ''
		
		if (options.hasGuarantor) {
			this.applyDepositFreeForm.hasGuarantor = options.hasGuarantor
		}
	},
	
	onShow() {
		
	},
	
	methods: {
		nextIdentityStep(data) {
			if (this.identityStep === 0) {
				this.phone = data.phone
			}else if (this.identityStep === 2) {
				this.applyDepositFreeForm.issue = data.issue
				this.idNum = data.idNum
				this.username = data.username
			}
			++this.identityStep
		},
		
		nextOccupationStep(data) {
			if (this.occupationStep === 0) {
				this.applyDepositFreeForm.careerCode = data.value
				this.applyDepositFreeForm.careerName = data.label
			}
			++this.occupationStep
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
		
		async save(data) {
			this.applyDepositFreeForm.guarantorName = data.guarantorName
			this.applyDepositFreeForm.guarantorMobile = data.guarantorMobile
			if (this.orderServiceType == 1) {
				const result = await this.$getRequest(this.$url.applyDepositFree, 'POST', this.applyDepositFreeForm)
				if(result.code == 0){
					this.updateUserSubscribeStatus()
				}
			} else if (this.orderServiceType == 2) {
				const result = await this.$getRequest(this.$url.carRentalApply, 'POST', this.applyDepositFreeForm)
				if(result.code == 0){
					this.updateRentalOrderStatus()
				}
			}
		},
		
		async updateUserSubscribeStatus() {
			const createOrderInfo = uni.getStorageSync('createOrderInfo')
			
			const params = {
				 id: createOrderInfo.orderId,
				 status: 10,
				 orderType: createOrderInfo.orderType,
			}
			const result = await this.$getRequest(this.$url.updateUserSubscribeStatus, 'GET', params)
			if(result.code === 0){
				uni.reLaunch({
					url: `/pagesOrder/depositFree/ApplyDepositFreeSuccess?orderServiceType=${this.orderServiceType}&userId=${this.applyDepositFreeForm.userId}&hasGuarantor=1&guarantorName=${this.applyDepositFreeForm.guarantorName}&guarantorMobile=${this.applyDepositFreeForm.guarantorMobile}`
				})
			}
		},
		
		async updateRentalOrderStatus() {
			const createOrderInfo = uni.getStorageSync('createOrderInfo')
			
			const params = {
				 id: createOrderInfo.orderId,
				 status: 10,
				 orderType: createOrderInfo.orderType,
			}
			const result = await this.$getRequest(this.$url.updateUserCarRentalSubscribeStatus, 'GET', params)
			if(result.code === 0){
				uni.reLaunch({
					url: `/pagesOrder/depositFree/ApplyDepositFreeSuccess?orderServiceType=${this.orderServiceType}&userId=${this.applyDepositFreeForm.userId}&hasGuarantor=1&guarantorName=${this.applyDepositFreeForm.guarantorName}&guarantorMobile=${this.applyDepositFreeForm.guarantorMobile}`
				})
			}
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
