<template>
	<view class="wrap">
		<view class="header">
			<view class="section-title">
				<u-section
					title="企业实际用车人信息"
					:right="false"
					line-color="#0A0F2D"
				/>
			</view>
			
			<view class="item">
				<view class="item-title">姓名</view>
				<view class="item-content">{{username}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">身份证号</view>
				<view class="item-content">{{idNum}}</view>
			</view>
			
			<view class="section-title">
				<u-section
					title="请上传企业实际用车人与企业关系证明文件"
					:right="false"
					line-color="#0A0F2D"
				/>
			</view>
			
			<view
			    class="identity-card"
			    @click="handleUploadFace()"
			>
			    <template v-if="imgUrl">
						<image
							style="width:100%;height:100%;"
							:src="imgUrl"
						/>
			    </template>
			    <view class="img-box" v-else>
						<image
							style="width:48rpx;height:48rpx;"
							src="https://image.51cheyaoshi.com/xcx/app/static/carlife/camera_icon.png"
						/>
						<view class="text">添加文件</view>
			    </view>
			</view>
		</view>
		
		<view class="footer">
			 <button :disabled="disabled" @click="handleSubmit">下一步</button>
		</view>
		
	</view>
</template>

<script>
export default {
	props: {
		username: {
			type: String,
			required: true,
		},
		
		idNum: {
			type: String,
			required: true,
		},
	},
	
	data() {
		return {
			userProtocolUrl: 'https://www.51cheyaoshi.com/applet/protocol/privacy.pdf',
			checked: false,
			imgUrl: '',
			title: '',
			content: '',
			confirmText:'确定',
			tipShow: false,
			tipDesc: '',
			submitShow: false,
			tipType: '',
		}
	},
	
	computed: {
		disabled() {
			if (this.imgUrl) {
				return false
			}
			
			return true
		}
	},
	
	methods: {
		goNextPage() {
			const identityPath = uni.getStorageSync("identityPath")
			uni.reLaunch({
				url: identityPath
			})
		},
		
		showUserProtocol () {
			this.$goHtml(this.userProtocolUrl, '')
		},
		
		handleUploadFace() {
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
		
					this.imgUrl = upload.data.src
				}
			})
		},
		
		async handleSubmit() {
				uni.showLoading({
					title: '认证中'
				})
					 
				let mess=uni.getStorageSync("userinfoMess")
				if (mess) {
					mess.userInfoEntity.userCompanyRelationFileUrl = this.imgUrl
				}
				console.log('userMess', mess)
				
				const result = await this.$getRequest(this.$url.userAuditSubmit, 'POST', mess)
						 
				if(result.code!=0){
					uni.hideLoading()
					uni.showToast({
						title: result.msg,
						duration: 2000,
						icon: 'none'
					})
				}
				
				if (getApp().globalData.userInfo) {
					getApp().globalData.userInfo.riskAuditStatus = this.auditStatus
				}
				
					 
				uni.hideLoading()
				this.$emit('nextStep')	 
				
		},
		
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	.section-title {
		margin-top: 40px;
		margin-bottom: 12px;
	}
	.item {
		margin-bottom: 8px;
		padding: 0 32rpx;
		width: 100%;
		height: 104rpx;
		border-radius: 16rpx;
		background: rgba(10, 15, 45, 0.04);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.item-title {
			font-size: 15px;
			color: rgba(10, 15, 45, 0.5);
		}
		.item-content {
			font-size: 15px;
			color: #0A0F2D;
		}
	}
	
	.identity-card {
		width: 320rpx;
		height: 200rpx;
		border-radius: 24rpx;
		background: #F5F6F7;
		overflow: hidden;
		.img-box {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.text {
				margin-top: 8px;
				height: 36rpx;
				font-size: 12px;
				line-height: 36rpx;
				color: rgba(10, 15, 45, 0.8);
			}
		}
	}
	
	.footer {
		margin-top: 24rpx;
	}
	
	.protocol-wrap {
		display: flex;
		align-items: center;
		.placeOrderInfo-address-text {
			height: 44rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: #666666;
		}
		.aPro {
			height: 44rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: #197EF5;
		}
	}
	
	button {
		margin-top: 80rpx;
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