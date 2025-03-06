<template>
	<view class="page-wrap1">
		<view class="tip">车要试出行会严格保障您的信息安全</view>
		
		<view class="section-title">
		    <u-section
		        title="请上传清晰、无反光、无遮挡的证件照片"
		        :right="false"
		        line-color="#0A0F2D"
		    />
		</view>
		
		<view
		    class="identity-card"
		    @click="handleUploadFace()"
		>
		    <template v-if="identityParams.businessLicense">
					<image
						style="width:100%;height:100%;"
						:src="identityParams.businessLicense"
					/>
		    </template>
		    <template v-else>
					<image
						style="width:100%;height:100%;"
						src="https://image.51cheyaoshi.com/xcx/app/static/carlife/businessLicense.png"
					/>
		    </template>
		</view>
		
		<view class="order-btn-wrap">
			<view class="order-btn" @click="handleSubmit">
				立即认证
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				companyId: '',
				identityParams: {
					id: '',
					userId: '',
					businessLicense: '',
					companyName: '',
					contactName: '',
					address: '',
					corporationTaxNumber: '',
					establishDate: '',
					businessDeadline: '',
					isForever: false,
				},
			}
		},
		
		onLoad(option) {
			this.identityParams.userId = option.userId
			if (option.companyId) {
				this.identityParams.id = option.companyId
				this.identityParams.businessLicense = option.businessLicense
				this.OCRCardImg({
					businessLicense: option.businessLicense
				})
			}
			
		},
		
		onShow() {
			
		},
		
		methods: {
			handleUploadFace() {
				uni.chooseImage({
					success: async (chooseImageRes) => {
						uni.showLoading({
								title: '上传中'
						});
						const tempFilePaths = chooseImageRes.tempFilePaths;
						const upload = await this.$getFileUpload(this.$url.upload, tempFilePaths)
						if(upload.code != 0) {
							uni.showToast({
								title: upload.msg,
								duration: 2000,
								icon: 'none'
							})
							return false
						}
						uni.hideLoading()
			
						this.identityParams.businessLicense = upload.data.src
						this.OCRCardImg({
							businessLicense: upload.data.src
						})
			
					}
				})
			},
			
			async OCRCardImg(params) {
				const uploadInfo =  await this.$getRequest(this.$url.ocrBusinessLicense, 'POST', params)
				
				if(uploadInfo.code != 0) {
					this.identityParams.businessLicense = ''
					uni.showToast({
						title: uploadInfo.msg,
						duration: 2000,
						icon: 'none'
					})
					return false
				}
			      
				this.identityParams.companyName = uploadInfo.data.name
				this.identityParams.contactName = uploadInfo.data.person
				this.identityParams.address = uploadInfo.data.address
				this.identityParams.corporationTaxNumber = uploadInfo.data.reg_num
				this.identityParams.establishDate = uploadInfo.data.establish_date
			},
			
			async handleSubmit() {
				if(!this.identityParams.businessLicense) {
					uni.showToast({
							title: '请上传企业营业执照',
							duration: 2000,
							icon: 'none'
					});
			
					return false;
				}
				
				const res = await this.$getRequest(this.$url.createOrUpdateUserCompany, 'POST', this.identityParams)
				
				if(res.code != 0) {
					uni.showToast({
						title: '保存失败',
						duration: 2000,
						icon: 'none'
					})
					return false;
				}
				
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.tip {
	font-size: 14px;
	line-height: 22px;
	color: rgba(10, 15, 45, 0.5);
}

.section-title {
	margin-top: 40rpx;
	margin-bottom: 32rpx;
}

.identity-card {
	background: #FAFAFB;
	border-radius: 16rpx;
	width: 256rpx;
	height: 340rpx;
	overflow: hidden;
}
</style>
