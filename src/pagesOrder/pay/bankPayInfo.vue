<template>
	<view class="page">
		<view class="info-card">
			<view class="item">
				<view class="item-title">应转金额：</view>
				<view class="item-content">{{price | $numFormat}}元</view>
			</view>
			
			<view class="item">
				<view class="item-title">账户名称：</view>
				<view class="item-content">{{detail.companyName}}</view>
			</view>
			
			<view class="item">
				<view class="item-title">账 户 号 ：</view>
				<view class="item-content">{{detail.bankAccountId}}</view>
				<view class="tag" @click="copyOrder">复制</view>
			</view>
			
			<view class="item">
				<view class="item-title">开 户 行 ：</view>
				<view class="item-content">{{detail.bankName}}</view>
			</view>
			
			<view class="del-icon" @click="deleteBankBill" v-if="billId">
				<image
					src="https://image.51cheyaoshi.com/xcx/app/static/home/delete-icon.png"
					mode="widthFix"
				/>
			</view>
		</view>
		<view class="btn" @click="upload" v-if="bankBills.length === 0">上传转账凭证</view>
		
		<view v-else>
			<view class="title-wrap">
				<view class="title">转账凭证</view>
				<view class="reupload" @click="upload">重新上传</view>
			</view>
			
			<view
				class="img-wrap"
				v-for="(img, index) in bankBills"
				:key="index"
			>
				<image
					:src="img"
				/>
				<image
					v-if="!billId"
					class="del-icon"
					src="https://image.51cheyaoshi.com/xcx/merchant/static/product/group_509.png"
					@click="delImg(index)"
				/>
			</view>
			
			<view v-if="billId">
				<view class="title">备注说明</view>
				<view class="remark">{{remark}}</view>
			</view>
			
			<view class="fixed-bottom-btn" @click="createBankBill(billId)" v-if="billId">
				<view class="bottom-btn">
					重新上传转账凭证
				</view>
			</view>
			<view class="fixed-bottom-btn" @click="handleSubmit" v-else>
				<view class="bottom-btn">
					确认转账
				</view>
			</view>
		</view>
		
		
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: '',
			openid: '',
			userId: '',
			price: 0,
			remainder: 0,
			paymentStatus: 0, // 2.押金 4.订阅费用
			payType: 0, // 微信: 1.押金 8.订阅费用 银行转账: 8.押金 6.订阅费用
			bankAccountId: null,
			bankBills: [],
			businessType: 0,
			detail: {},
			billId: null,
			remark: '',
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.openid = options.openid
		this.userId = options.userId
		this.businessType = options.businessType
		this.paymentStatus = options.paymentStatus
		this.bankAccountId = options.bankAccountId
		this.price = options.price - 0
		this.billId = options.billId
		
		if (this.paymentStatus == 2) {
			this.payType = 8
			this.selectDepositAboutNoPay()
		} else if (this.paymentStatus == 4) {
			this.payType = 6
			this.selectSubscribeFreeAboutNoPayFn()
		}
		
		this.selectReceiptBankAccountInfo()
		
		if (this.billId) {
			this.selectPaymentDetail()
		}
	},
	
	methods: {
		async selectPaymentDetail(){
			const params = {
				 id: this.billId,
				 payType: this.payType,
			}
			const result = await this.$getRequest(this.$url.selectPaymentDetail, 'GET', params)
			if(result.code == 0){
				this.bankBills = result.data.bankBills
				this.remark = result.data.remark
			}
		},
		
		async selectDepositAboutNoPay(){
			const params = {
				 businessId: this.orderId
			}
			const result = await this.$getRequest(this.$url.selectDepositAboutNoPay, 'GET', params)
			if(result.code == 0){
				this.remainder = result.data.remainMoney - this.price
			}
		},
		
		async selectSubscribeFreeAboutNoPayFn(){
			const params = {
				 businessId: this.orderId
			}
			const result = await this.$getRequest(this.$url.selectSubscribeFreeAboutNoPay, 'GET', params)
			if(result.code == 0){
				this.remainder = result.data.remainMoney - this.price
			}
		},
		
		async selectReceiptBankAccountInfo(){
			const params = {
				 businessId: this.orderId,
				 businessType: this.businessType,
			}
			const result = await this.$getRequest(this.$url.selectReceiptBankAccountInfo, 'POST', params)
			if(result.code == 0){
				this.detail = result.data
			}
		},
		
		copyOrder() {
			uni.setClipboardData({
				data: this.detail.bankAccountId,
			})
		},
		
		upload() {
			uni.chooseImage({
				success: async (chooseImageRes) => {
					uni.showLoading({
							title: '上传中'
					})
					const tempFilePaths = chooseImageRes.tempFilePaths
					this.bankBills = []
					for(const item of tempFilePaths) {
						const upload = await this.$getFileUpload(this.$url.upload, [item])
						this.bankBills.push(upload.data.src)
					}
					uni.hideLoading()
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
					}
				}
			})
		},
		
		handleSubmit() {
			uni.showModal({
				title: '提示',
				content: '请确保上传转账凭证信息是否正确。一旦提交账单信息，将无法进行更改。',
				confirmText: '提交转账',
				success: (res) => {
					if (res.confirm) {
						this.handleBankPay()
					}
				},
				fail: (err) => {
					console.log('fail', err)
				}
			})
		},
		
		async createBankBill(id) {
			uni.showLoading({
					title: '保存中'
			})
			const params = {
				 bankBills: this.bankBills,
				 id,
				 payType: this.payType,
				 userId: this.userId,
			}
			const result = await this.$getRequest(this.$url.createBankBill, 'POST', params)
			if(result.code == 0){
				if (this.remainder <= 0) {
					uni.reLaunch({
						url: `/pagesOrder/pay/depositPayEnd?orderId=${this.orderId}&paymentStatus=${this.paymentStatus}&userId=${this.userId}&businessType=${this.businessType}&openid=${this.openid}&payMode=3`
					})
				} else {
					uni.reLaunch({
						url: `/pagesOrder/pay/setDepositPayMode?orderId=${this.orderId}&paymentStatus=${this.paymentStatus}&openid=${this.openid}&userId=${this.userId}&businessType=${this.businessType}`
					})
				}
			}
			
			uni.hideLoading()
		},
		
		async handleBankPay() {
			const params = {
				 businessId: this.orderId,
				 businessType: this.businessType,
				 payType: this.payType,
				 total: this.price,
				 userId: this.userId,
			}
			const result = await this.$getRequest(this.$url.createBankAccount, 'POST', params)
			if(result.code == 0){
				this.createBankBill(result.data)
			}
		},
		
		async deleteBankBill() {
			uni.showModal({
				title: '提示',
				content: '确定要删除这笔转账吗？',
				success: async (res) => {
					if (res.confirm) {
						const params = {
							 id: this.billId,
							 payType: this.payType,
							 isReject: 1,
						}
						const result = await this.$getRequest(this.$url.deleteBankBill, 'GET', params)
						if(result.code == 0){
							uni.reLaunch({
								url: `/pagesOrder/order-detail/order-detail?orderId=${this.orderId}`
							})
						}
					}
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page {
	width: 100vw;
	min-height: 100vh;
	padding: 12px 32rpx 140px;
	.info-card {
		margin-bottom: 32px;
		width: 100%;
		padding: 20px 32rpx;
		border-radius: 24rpx;
		box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.04);
		position: relative;
		.item {
			margin-bottom: 8px;
			height: 44rpx;
			font-size: 14px;
			display: flex;
			align-items: center;
			.item-title {
				margin-right: 10rpx;
				color: #64696F;
			}
			.item-content {
				color: #0A0F2D;
			}
			.tag {
				margin-left: 26rpx;
				width: 64rpx;
				height: 40rpx;
				border-radius: 8rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: rgba(10, 15, 45, 0.04);
				font-size: 12px;
				color: rgba(10, 15, 45, 0.8);
			}
		}
		.item:last-child {
			margin-bottom: 0;
		}
		.del-icon {
			position: absolute;
			top: 0;
			right: 0;
			z-index: 100;
			width: 100rpx;
			height: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 26rpx;
			}
		}
	}
	
	.btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		font-size: 17px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.title-wrap {
		margin-bottom: 16px;
		height: 48rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.reupload {
			font-size: 12px;
			color: #4F4F4F;
		}
	}
	.title {
		font-size: 17px;
		color: #3D3D3D;
	}
	.img-wrap {
		margin-bottom: 14px;
		width: 100%;
		border-radius: 8rpx;
		overflow: hidden;
		position: relative;
		image {
			width: 100%;
		}
		.del-icon {
			position: absolute;
			top: 0;
			right: 0;
			width: 48rpx;
			height: 48rpx;
		}
	}
	
	.remark {
		margin-top: 12px;
		padding: 12px 32rpx;
		border-radius: 2px;
		background: #FFFFFF;
		box-shadow: 0px -1px 24px 0px rgba(10, 15, 45, 0.04),0px 4px 24px 0px rgba(10, 15, 45, 0.04);
		line-height: 40rpx;
		font-size: 14px;
		color: #3D3D3D;
	}
}
</style>