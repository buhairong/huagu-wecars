<template>
	<view class="wrap">
		<template v-if="type !== 'preview'">
			<view class="title">请您上传如下材料</view>
			<view class="sub-title">请确保您所上传材料清晰、无反光、无遮挡</view>
		</template>
		
		<view class="certification-list-wrap">
			<view 
				class="certification-list"
				v-for="item in certificationList"
				:key="item.id"
			>
				<view class="certification-name">
					{{item.certificationName}}
				</view>
				
				<view class="img-list">
					<view 
						class="img-wrap"
						v-for="(img, index) in item.imageUrls"
						:key="index"
					>
						<image
							style="width:100%;height:100%;"
							:src="img"
							@click="previewImage(img)"
						/>
						<image
							v-if="type !== 'preview'"
							class="del-icon"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_509.png"
							@click="delImg(item.id, index)"
						/>
					</view>
					<view class="img-box" @click="handleUploadCertificationImgs(item.id)" v-if="type !== 'preview'">
						<image
							style="width:48rpx;height:48rpx;"
							src="https://image.51cheyaoshi.com/xcx/app/static/carlife/camera_icon.png"
						/>
						<view class="text">添加文件</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn-wrap" v-if="type !== 'preview'">
			<button :disabled="disabled" @click="handlerSubmit">提交材料</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: null,
			userId: '',
			certificationList: [],
			type: '',
		}
	},
	onLoad(options) {
		this.orderId = options.orderId
		this.userId = options.userId
		this.type = options.type
		this.certificationList = uni.getStorageSync("addCertificationInfo")
	},
	
	computed: {
		disabled() {
			if (this.certificationList.every(item => item.imageUrls.length > 0)) {
				return false
			}
			
			return true
		}
	},
	
	methods: {
		handleUploadCertificationImgs(certificationId) {
			uni.chooseImage({
				success: async (chooseImageRes) => {
					uni.showLoading({
							title: '上传中'
					})
					const tempFilePaths = chooseImageRes.tempFilePaths
					
					for(const item of tempFilePaths) {
						const upload = await this.$getFileUpload(this.$url.upload, [item])
						const certification = this.certificationList.find(item => item.id === certificationId)
						if (certification) {
							certification.imageUrls.push(upload.data.src)
						}
					}
					
					uni.hideLoading()
				}
			})
		},
		
		delImg(certificationId, index) {
			const certification = this.certificationList.find(item => item.id === certificationId)
			if (certification) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这张图片吗？',
					success: (res) => {
						if (res.confirm) {
							certification.imageUrls.splice(index, 1)
						}
					}
				})
			}
		},
		
		handlerSubmit () {
			uni.showLoading({
					title: '上传中'
			})
			
			const params = {
				certificationReqVo: this.certificationList,
				userCarSubscribeId: this.orderId,
				userId: this.userId,
			}
			
			this.$getRequest(this.$url.uploadCertification, 'POST', params).then(res => {
				uni.hideLoading()
				if (res.code === 0) {
					uni.showToast({
						title: '材料上传成功',
						duration: 2000,
						icon: 'none'
					})
					
					// uni.navigateBack({
					// 	delta: 1
					// })
					
					uni.navigateTo({
						url: '/pagesOrder/order-detail/order-detail?orderId=' + this.orderId
					})
				} else {
					uni.showToast({
						title: '材料上传失败',
						duration: 2000,
						icon: 'none'
					})
				}
			}).catch(err => {
				uni.hideLoading()
				uni.showToast({
					title: '材料上传失败',
					duration: 2000,
					icon: 'none'
				})
			})
		},
		
		previewImage(url) {
			const imgList = [url]
			
			uni.previewImage({
				urls: imgList,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40px 40rpx 300rpx;
	width: 100vw;
	min-height: 100vh;
	.title {
		height: 72rpx;
		font-size: 28px;
		line-height: 72rpx;
		color: #0A0F2D;
	}
	
	.sub-title {
		margin-top: 4px;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
	}
	
	.certification-name {
		margin-top: 28px;
		height: 44rpx;
		font-size: 15px;
		line-height: 44rpx;
		color: #0A0F2D;
	}
	
	.img-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		.img-wrap, .img-box {
			margin-top: 12px;
			width: 320rpx;
			height: 200rpx;
			border-radius: 8rpx;
			overflow: hidden;
		}
		
		.img-wrap {
			position: relative;
		}
		
		.del-icon {
			position: absolute;
			top: 0;
			right: 0;
			width: 24rpx;
			height: 24rpx;
		}
		
		.img-box {
			background: rgba(10, 15, 45, 0.04);
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
	
	.btn-wrap {
		width: 100%;
		padding: 0 40rpx;
		background-color: #fff;
		position: fixed;
		bottom: 40px;
		left: 0;
		z-index: 100;
	}
	
	button {
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