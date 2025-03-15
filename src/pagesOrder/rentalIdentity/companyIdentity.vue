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
		
		<view class="card" v-if="identityParams.businessLicense">
			<view class="item">
				<view class="item-title">企业名称</view>
				<view class="item-content">
					{{identityParams.companyName}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">信用代码</view>
				<view class="item-content">
					{{identityParams.corporationTaxNumber}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">法人</view>
				<view class="item-content">
					{{identityParams.contactName}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">注册地址</view>
				<view class="item-content">
					{{identityParams.address}}
				</view>
			</view>
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
					companyId: '',
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
				this.identityParams.companyId = option.companyId
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
						
						uni.hideLoading()
						if(upload.code != 0) {
							uni.showToast({
								title: upload.msg,
								duration: 2000,
								icon: 'none'
							})
							return false
						}
			
						this.identityParams.businessLicense = upload.data.src
						this.OCRCardImg({
							businessLicense: upload.data.src
						})
			
					}
				})
			},
			
			async OCRCardImg(params) {
				uni.showLoading({
						title: '加载中'
				});
				const uploadInfo =  await this.$getRequest(this.$url.ocrBusinessLicense, 'POST', params)
				
				uni.hideLoading()
				
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

.card {
	margin-top: 40rpx;
	.item {
		margin-top: 12px;
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		color: rgba(10, 15, 45, 0.8);
		&:first-child {
			margin-top: 0;
		}
		.item-title {
			display: flex;
			height: 44rpx;
			line-height: 44rpx;
		}
		.item-content {
			line-height: 44rpx;
			flex:1;
			width:0;
			padding-left: 24rpx;
			text-align: right;
		}
	}
}
</style>
