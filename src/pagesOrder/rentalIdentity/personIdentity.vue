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
		
		<view class="u-flex">
		    <view
		        class="identity-card u-flex-1 u-margin-right-20"
		        @click="handleUploadFace(0)"
		    >
		        <template v-if="identityParams.idcardUrl">
		            <u-image
		                width="100%"
		                height="100%"
		                :src="identityParams.idcardUrl"
		            />
		        </template>
		        <template v-else>
		            <u-image
		                width="100%"
		                height="100%"
		                src="https://image.51cheyaoshi.com/xcx/app/static/home/717.png"
		            />
		        </template>
		    </view>
		    <view
		        class="identity-card  u-flex-1 u-margin-left-20"
		        @click="handleUploadFace(1)"
		    >
		        <template v-if="identityParams.idcardBackUrl">
		            <u-image
		                width="100%"
		                height="100%"
		                :src="identityParams.idcardBackUrl"
		            />
		        </template>
		        <template v-else>
		            <u-image
		                width="100%"
		                height="100%"
		                src="https://image.51cheyaoshi.com/xcx/app/static/home/718.png"
		            />
		        </template>
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
				type: '', // 1. 租车订单
				orderParams: {
					cityId: '', // 城市ID
					cityName: '', // 城市名称
					carTypeYearProductId: '',
					startDate: '', // 租车开始日期
					endDate: '', // 租车结束日期
					mobile: '', // 手机号
					address: '', // 预约地址
					memberButlerId: '', // 管家ID
					companyId: '', // 公司ID
					userId: '', // 用户ID
					orderType: '', // 订单类型  1.个人 2.企业
					payWay: '', // 支付方式：0微信支付 1银行转账",
					totalDay: 1, // 总天数
					status: 0, // 状态 0创建订单 1支付中 2支付完成 3取消订单  默认0
					totalPayment: '', // 支付总金额
					riskAuditStatus: '',
				},
				identityParams: {
					userId: '',
					idcardUrl: '',
					idcardBackUrl: '',
					name: '',
					idcard: '',
					sex: '',
					birth: '',
					idcardValidityTimeEnd: '',
					idcardValidityTimeStart: '',
					issue: '',
					isForever: '',
				},
			}
		},
		
		onLoad(option) {
			this.type = option.type
			this.identityParams.userId = option.userId
		},
		
		onShow() {
			const params = uni.getStorageSync('rentalOrderParams')
			if (params) {
				this.orderParams = params
			}
		},
		
		methods: {
			// type   0： 前   1： 后
			handleUploadFace(type) {
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
							return false;
						}
						uni.hideLoading()
				
						if(type == 0) {
								this.identityParams.idcardUrl = upload.data.src;
								this.OCRCardImg({
										idcardImageUrl: upload.data.src
								}, 0);
						} else {
								this.identityParams.idcardBackUrl = upload.data.src;
								this.OCRCardImg({
										idcardBackImageUrl: upload.data.src
								}, 1);
						}
				
					}
				});
			},
			
			async OCRCardImg(params, type) {
				const uploadInfo =  await this.$getRequest(this.$url.ocrIdcard, 'POST', params)
			
				if(uploadInfo.code != 0) {
					uni.showToast({
						title: uploadInfo.msg,
						duration: 2000,
						icon: 'none'
					})
					if (type === 0) {
						this.identityParams.idcardUrl = ''
					} else {
						this.identityParams.idcardBackUrl = ''
					}
					return false;
				}
			
				if (type === 0) {
					this.identityParams.name = uploadInfo.data.resultJSON.name
					this.identityParams.idcard = uploadInfo.data.resultJSON.num
					this.identityParams.sex = uploadInfo.data.resultJSON.sex
					this.identityParams.birth = uploadInfo.data.resultJSON.birth
				} else {
					this.identityParams.idcardValidityTimeEnd = uploadInfo.data.resultJSON.end_date
					this.identityParams.idcardValidityTimeStart = uploadInfo.data.resultJSON.start_date
					this.identityParams.issue = uploadInfo.data.resultJSON.issue
					this.identityParams.isForever = uploadInfo.data.resultJSON.is_fake
				}
			},
			
			handleSubmit() {
				if(!this.identityParams.idcardUrl) {
					uni.showToast({
							title: '请上传身份证正面',
							duration: 2000,
							icon: 'none'
					});
			
					return false;
				}
				
				if(!this.identityParams.idcardBackUrl) {
					uni.showToast({
							title: '请上传身份证反面',
							duration: 2000,
							icon: 'none'
					});
			
					return false;
				}
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
	height: 200rpx;
	line-height: 200rpx;
	text-align: center;
}
</style>
