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
			<view>
			     <view class="protocol-wrap">
			       <view>
			         <u-checkbox
			             v-model="checked"
			             size="28"
			             label-size="28"
			             icon-size="22"
			         >
			           <view class="placeOrderInfo-address-text">我已阅读并同意</view>
			         </u-checkbox>
			       </view>
			       <view @click="showUserProtocol" class="aPro">《用户隐私保密协议》</view>
			     </view>
			 </view>
			 
			 <button :disabled="disabled" @click="handleSubmit">立即认证</button>
		</view>
		
		<u-modal
			v-model="tipShow" 
			:title="title" 
			:content='content' 
			:mask-close-able="true"
			:confirm-text='confirmText'
			@confirm='confirmModal'
		></u-modal>
		
		<u-modal v-model="submitShow"  @confirm="confirmModal" :confirm-text='confirmText' ref="uModal" :title-style="{color: 'transparent'}" title=" " confirm-color="#576B95">
		  <view class="slot-content" style="height: 150px;">
		    <view class="u-text-center u-padding-top-50">
		      <view class="u-text-center"><icon :type="tipType" size="50"/></view>
		      <view class="u-text-center u-padding-top-40"><text class="m-tip-txt">{{tipDesc}}</text></view>
		    </view>
		  </view>
		</u-modal>
	</view>
</template>

<script>
import { statusName } from '@/constants'

export default {
	data() {
		return {
			type: null, // 5.个人 6.企业
			userProtocolUrl: 'https://www.51cheyaoshi.com/applet/protocol/privacy.pdf',
			idNum: '',
			username: '',
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
	onLoad(options) {
		this.type = options.type
		this.idNum = options.idNum
		this.username = options.username
	},
	
	computed: {
		disabled() {
			if (this.imgUrl && this.checked) {
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
			//this.$u.route(`/pages/mine/identity/face-identity-tip?type=6&idNum=${this.idNum}&username=${this.username}`)
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
		
		confirmModal() {
			this.tipShow = false
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
				
				let auditStatus = result.data.auditStatus
				this.auditStatus = result.data.auditStatus
				getApp().globalData.userInfo.riskAuditStatus = this.auditStatus
					 
				uni.hideLoading()
					 
				if(auditStatus == 6) {
						 this.tipType = 'success'
				}
				this.tipDesc = statusName[result.data.auditStatus]
				this.submitShow = true
		},
		
		async confirmModal() {
			this.tipShow = false
			this.faceIdentity()
		},
		
		faceIdentity() {
			const from = uni.getStorageSync('from')
			uni.navigateTo({
				url: `/pagesOrder/identity/face-identity-tip?from=${from.from}&idNum=${from.idNum}&username=${from.username}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 0 40rpx 40px;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
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
		margin-top: 12px;
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