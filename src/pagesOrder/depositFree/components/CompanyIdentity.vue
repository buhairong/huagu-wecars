<template>
	<view class="wrap">
		<view class="title">上传营业执照</view>
		<view class="tip">车要试出行会严格保障您的信息安全</view>
		
		<view class="section-title">
			<u-section
				title="请上传清晰、无遮挡且在营业期限内的执照照片"
				:right="false"
				line-color="#0A0F2D"
			/>
		</view>
		
		<view
		    class="identity-card"
		    @click="handleUploadFace()"
		>
		    <template v-if="companyInfo.businessLicense">
					<image
						style="width:100%;height:100%;"
						:src="companyInfo.businessLicense"
					/>
		    </template>
		    <template v-else>
					<image
						style="width:100%;height:100%;"
						src="https://image.51cheyaoshi.com/xcx/app/static/carlife/businessLicense.png"
					/>
		    </template>
		</view>
		
		<view class="section-title">
			<u-section
				title="请确认企业信息"
				:right="false"
				line-color="#0A0F2D"
			/>
		</view>
		
		<view class="identity-box">
		    <view class="label">企业名称</view>
		    <u-input
		        v-model="companyInfo.companyName"
		        type="text"
		        placeholder="请输入企业名称"
		    />
		</view>
		
		<view class="identity-box">
		    <view class="label">法人名称</view>
		    <u-input
		        v-model="companyInfo.contactName"
		        type="text"
		        placeholder="请输入法人名称"
		    />
		</view>
		
		<view class="identity-box">
		    <view class="label">注册地址</view>
		    <u-input
		        v-model="companyInfo.address"
		        type="text"
		        placeholder="请输入注册地址"
		    />
		</view>
		
		<view class="identity-box">
		    <view class="label">信用代码</view>
		    <u-input
		        v-model="companyInfo.corporationTaxNumber"
		        type="text"
		        placeholder="请输入信用代码"
		    />
		</view>
		
		<view class="identity-box">
		    <view class="label">成立日期</view>
		    <view
		        @click="popPicker"
		    >
		        <u-picker
		            v-model="showDatePicker"
		            confirm-color="#0A0F2D"
		            mode="time"
		            :default-selector="defaultSelector"
		            @confirm="handleTime"
		        />
		        <text :class="companyInfo.establishDate ? 'text' : 'placeholderSty'">
		            {{ companyInfo.establishDate || '请选择成立日期' }}
		        </text>
		    </view>
		</view>
		
		<view class="identity-box">
		    <view class="label">营业期限</view>
				<view
				    class="u-text-right"
				    @click="popDeadlinePicker"
				>
				    <u-picker
				        v-model="showDeadlineDatePicker"
				        confirm-color="#0A0F2D"
				        mode="time"
								end-year="2099"
				        :default-selector="defaultSelector"
				        @confirm="handleDeadlineTime"
				    />
				    <text :class="companyInfo.businessDeadline ? 'text' : 'placeholderSty'">
				        {{ companyInfo.businessDeadline || '请选择营业期限' }}
				    </text>
				</view>
		</view>
		
		<button :disabled="disabled" @click="handleSubmit">下一步</button>
		
		<u-modal
			v-model="tipShow" 
			:title="title" 
			:content='content' 
			:mask-close-able="true"
			:confirm-text='confirmText'
			@confirm='confirmModal'
		></u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			companyInfo: {
				businessLicense: '', 
				companyName: '',
				contactName: '',
				address: '',
				corporationTaxNumber: '',
				establishDate: '',
				businessDeadline: '',
				isForever: false,
			},
			tipShow: false,
			content:'请重新上传营业执照',
			title:'',
			confirmText:'确定',
			showDatePicker: false,
			defaultSelector: [0],
			showDeadlineDatePicker: false,
		}
	},
	
	computed: {
		disabled() {
			if (this.companyInfo.businessLicense && 
					this.companyInfo.companyName && 
					this.companyInfo.contactName && 
					this.companyInfo.address &&
					this.companyInfo.corporationTaxNumber &&
					this.companyInfo.establishDate &&
					this.companyInfo.businessDeadline
			) {
				return false
			}
			
			return true
		}
	},
	
	methods: {
		handleUploadFace(type) {
			uni.vibrateShort()
			uni.chooseImage({
				success: async (chooseImageRes) => {
					uni.showLoading({
							title: '上传中'
					});
					const tempFilePaths = chooseImageRes.tempFilePaths;
					const upload = await this.$getFileUpload(this.$url.upload, tempFilePaths)
					if(upload.code != 0) {
						this.tipShow = true
						this.content = uploadInfo.msg
						return false
					}
					uni.hideLoading()
		
					this.companyInfo.businessLicense = upload.data.src
					this.OCRCardImg({
							businessLicense: upload.data.src
					})
		
				}
			})
		},
		
		async OCRCardImg(params) {
			const uploadInfo =  await this.$getRequest(this.$url.ocrBusinessLicense, 'POST', params)
			
			if(uploadInfo.code != 0) {
				this.tipShow = true
				this.content = uploadInfo.msg
				return false
			}
		      
			this.companyInfo.companyName = uploadInfo.data.name
			this.companyInfo.contactName = uploadInfo.data.person
			this.companyInfo.address = uploadInfo.data.address
			this.companyInfo.corporationTaxNumber = uploadInfo.data.reg_num
			this.companyInfo.establishDate = uploadInfo.data.establish_date
		},
		
		confirmModal() {
			this.tipShow = false
			return false
		},
		
		popPicker() {
			this.showDatePicker = true
		},
		
		handleTime(obj) {
			const {year, month, day} = obj
			this.companyInfo.establishDate = `${year}-${month}-${day}`
		},
		
		popDeadlinePicker() {
			this.showDeadlineDatePicker = true
		},
		
		handleDeadlineTime(obj) {
			const {year, month, day} = obj
			this.companyInfo.businessDeadline = `${year}-${month}-${day}`
		},
		
		handleSubmit() {
			uni.setStorageSync("companyMess", this.companyInfo)
			this.$emit('nextIdentityStep', {
				companyName: this.companyInfo.companyName
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	.title {
		height: 72rpx;
		font-size: 28px;
		line-height: 72rpx;
		color: #0A0F2D;
	}
	.tip {
		margin-top: 4px;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
	}
	.section-title {
		margin-top: 40px;
		margin-bottom: 12px;
	}
	.identity-card {
		background: #FAFAFB;
		border-radius: 16rpx;
		width: 256rpx;
		height: 340rpx;
		overflow: hidden;
	}
	.identity-box {
		height: 104rpx;
		padding: 0 32rpx;
		background: rgba(10, 15, 45, 0.04);
		border-radius: 16rpx;
		margin-bottom: 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.label {
			font-size: 15px;
			color: rgba(10, 15, 45, 0.5);
			padding-right: 24rpx;
		}
		u-input {
			flex: 1;
			::v-deep input {
				text-align: right;
				font-size: 15px;
				color: #0A0F2D;
			}
		}
		.text {
			font-size: 15px;
			color: #0A0F2D;
		}
		.placeholderSty {
			font-size: 15px;
			color: #c0c4cc;
		}
	}
	
	button {
		margin-top: 26px;
		width: 100%;
		height: 118rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		color: #FFFFFF;
	}
	
	button::after {
		border: none;
	}
	
	button[aria-disabled="true"] {
		background: rgba(10, 15, 45, 0.3);
	}
}
</style>