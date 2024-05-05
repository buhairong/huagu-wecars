<template>
	<view class="wrap">
		<view class="header">
			<view class="price">
				<view class="unit">￥</view>{{total | $numFormat}}
			</view>
			<view class="create-time">{{createTime}}</view>
		</view>
			
		<view class="sub-title">转账凭证</view>		
				
		<view class="img-list">
			<view 
				class="img-wrap"
				v-for="(img, index) in bankBills"
				:key="index"
			>
				<image
					:src="img"
				/>
				<!-- <image
					class="del-icon"
					src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_509.png"
					@click="delImg(index)"
				/> -->
			</view>
			
			<!-- <view class="img-box" @click="handleUploadImgs">
				<image
					style="width:64rpx;height:64rpx;"
					src="https://image.51cheyaoshi.com/xcx/app/static/carlife/camera_icon.png"
				/>
				<view class="text">上传转账凭证</view>
			</view> -->
		</view>
		
		<!-- <view class="btn-wrap">
			<view class="btn" @click="openModal">删除转账记录</view>
		</view> -->
		
		<u-modal
			v-model="showModal"
			title="删除转账记录"
			:show-cancel-button="true"
			confirm-text="取消"
			cancel-text="确认删除"
			@confirm="cancelModal"
			@cancel="confirmModal"
		>
			<view class="slot-content">
				<view class="model-content">
					银行转账记录删除后<text style="color:red">不可恢复</text>，为保障您的权益请<text style="color:red">谨慎删除！</text>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: null,
			id: '',
			payType: '',
			detail: {},
			total: 0,
			userId: '',
			createTime: '',
			bankBills: [],
			showModal: false,
		}
	},
	onLoad(options) {
		this.orderId = options.orderId
		this.userId = options.userId
		this.orderId = options.orderId
		this.id = options.id
		this.payType = options.payType
		
		this.selectPaymentDetail()
	},
	
	methods: {
		async selectPaymentDetail(){
			const params = {
				 id: this.id,
				 payType: this.payType,
			}
			const result = await this.$getRequest(this.$url.selectPaymentDetail, 'GET', params)
			if(result.code == 0){
				this.total = result.data.total
				this.createTime = result.data.createTime
				this.bankBills = result.data.bankBills
			}
		},
		
		openModal() {
			this.showModal = true
		},
		
		cancelModal() {
			this.showModal = false
		},
		
		confirmModal() {
			this.deleteBankBill()
		},
		
		async deleteBankBill() {
			const params = {
				 id: this.id,
				 payType: this.payType,
			}
			const result = await this.$getRequest(this.$url.deleteBankBill, 'GET', params)
			if(result.code == 0){
				uni.navigateBack({
					delta: 1
				})
			}
		},
		
		handleUploadImgs(certificationId) {
			uni.chooseImage({
				success: async (chooseImageRes) => {
					uni.showLoading({
							title: '上传中'
					})
					const tempFilePaths = chooseImageRes.tempFilePaths
					
					for(const item of tempFilePaths) {
						const upload = await this.$getFileUpload(this.$url.upload, [item])
						this.bankBills.push(upload.data.src)
					}
					
					this.createBankBill()
				}
			})
		},
		
		delImg(index) {
			uni.showModal({
				title: '提示',
				content: '确定要删除这张凭证吗？',
				success: (res) => {
					if (res.confirm) {
						this.bankBills.splice(index, 1)
						this.createBankBill()
					}
				}
			})
		},
		
		async createBankBill() {
			const params = {
				 bankBills: this.bankBills,
				 id: this.id,
				 payType: this.payType,
				 userId: this.userId,
			}
			const result = await this.$getRequest(this.$url.createBankBill, 'POST', params)
			
			uni.hideLoading()
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 32px 48rpx 300rpx;
	width: 100vw;
	min-height: 100vh;
	
	.header {
		margin-bottom: 32px;
		display: flex;
		flex-direction: column;
		align-items: center;
		.price {
			height: 96rpx;
			font-size: 32px;
			color: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			.unit {
				font-size: 22px;
				transform: translateY(10rpx);
			}
		}
		
		.create-time {
			margin-top: 4px;
			height: 44rpx;
			font-size: 14px;
			font-weight: normal;
			line-height: 44rpx;
			color: rgba(10, 15, 45, 0.5);
		}
	}
	
	.sub-title {
		margin-bottom: 16px;
		height: 48rpx;
		font-size: 17px;
		line-height: 48rpx;
		color: #0A0F2D;
		font-weight: 500;
	}
	
	.img-list {
		width: 100%;
		.img-wrap {
			margin-bottom: 14px;
			width: 100%;
			border-radius: 8rpx;
			overflow: hidden;
			position: relative;
		}
		
		.del-icon {
			position: absolute;
			top: 0;
			right: 0;
			width: 48rpx;
			height: 48rpx;
		}
		
		.img-box {
			width: 176rpx;
			height: 176rpx;
			background: rgba(10, 15, 45, 0.04);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.text {
				margin-top: 2px;
				height: 34rpx;
				font-size: 12px;
				line-height: 34rpx;
				color: rgba(10, 15, 45, 0.5);
			}
		}
	}
	
	.btn-wrap {
		width: 100%;
		padding: 0 32rpx;
		background-color: #fff;
		position: fixed;
		bottom: 40px;
		left: 0;
		z-index: 100;
		.btn {
			width: 100%;
			height: 96rpx;
			border-radius: 16rpx;
			background: rgba(10, 15, 45, 0.04);
			font-size: 15px;
			color: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}

.model-content {
	padding: 16px 48rpx;
	line-height: 44rpx;
	font-size: 14px;
}
</style>