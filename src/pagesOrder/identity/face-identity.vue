<template>
	<view class="wrap">
		<view class="camera-wrap" style="width:400rpx;height:400rpx;border-radius:50%;overflow:hidden;-webkit-backface-visibility: hidden;-webkit-transform: translate3d(0, 0, 0);">
			<camera
				device-position="front" 
				flash="off" 
				@initdone="initdone" 
				@error="error" 
				style="width:100%;height:100%;border-radius:50%;-webkit-backface-visibility: hidden;-webkit-transform: translate3d(0, 0, 0);"
			></camera>
		</view>
		<view class="tip">{{tip}}</view>
		<canvas v-if="canvasW && canvasH" :style="{
			width: `${canvasW}px`,
			height: `${canvasH}px`,
			marginBottom: '-10000px',
			transform: 'transLateY(10000px)',
		}" canvas-id="firstCanvas" id="firstCanvas"></canvas>
	</view>
</template>

<script>
import dayjs from 'dayjs'

export default {
	data() {
		return {
			type: null, // 5.个人 6.企业
			timer: null,
			ctx: null,
			idNum: '',
			username: '',
			tip: '拍摄实际用车人人脸，请确保正对手机且光线充足',
			orderDetailPage: '',
			createOrderInfo: {},
			esignInfo: {},
			contactInfo: {},
			userinfo: {},
			identityInfo: {},
			partnerApplyInfo: {},
			from: '',
			canvasW: 0,
			canvasH: 0,
			watermark: {
				type: '',
				date: '',
				location: '',
				address: '',
			},
			businessNode: null, // 10线上签约、20确认验车
			userCarSubscribeId: null,
			isSign: false,
			updateOrderStatus: false,
			faceAudit: false,
			isApplyDepositFree: '',
		}
	},
	onLoad(options) {
		this.type = options.type
		this.idNum = options.idNum
		this.username = options.username
		this.from = options.from
		this.isApplyDepositFree = options.isApplyDepositFree || ''
		
		getApp().globalData.getUserInfo((data) => {
			this.userInfo = data
		})
		
		if (this.from === 'createOrderInfo') {
			this.watermark.type = '实名认证活体信息留证'
			const createOrderInfo = uni.getStorageSync('createOrderInfo')
			if (createOrderInfo) {
				this.createOrderInfo = createOrderInfo
				this.userCarSubscribeId = createOrderInfo.orderId
			}
			this.businessNode = 30
		} else if (this.from === 'sign' || this.from === 'rentalOrderSign') {
			this.watermark.type = '签署协议活体信息留证'
			
			const esignInfo = uni.getStorageSync('esignInfo')
			if (esignInfo) {
				this.esignInfo = esignInfo
				this.userCarSubscribeId = esignInfo.orderId
			}
			this.businessNode = 10
		} else if (this.from === 'contact' || this.from === 'rentalOrderContact') {
			this.watermark.type = '确认交车活体信息留证'
			const contactInfo = uni.getStorageSync('contactInfo')
			if (contactInfo) {
				this.contactInfo = contactInfo
				this.userCarSubscribeId = contactInfo.id
			}
			this.businessNode = 20
		} else if (this.from === 'identityPartner') {
			this.businessNode = 100
			const identityInfo = uni.getStorageSync('identityInfo')
			if (identityInfo) {
				this.identityInfo = identityInfo
			}
		} else if (this.from === 'customerRental') {
			this.watermark.type = '实名认证活体信息留证'
			this.businessNode = 30
		}
		
		this.watermark.date = `认证时间：${dayjs().format('YYYY年MM月DD日 HH:mm:ss')}`
		const location = uni.getStorageSync('locationAddress')
		if (location) {
			this.watermark.location = `${location.ad_info.location.lat}、${location.ad_info.location.lng}`
			this.watermark.address = `${location.address}`
		}
	},
	
	onUnload() {
		this.clearTimer()
	},
	
	methods: {
		initdone() {
			this.ctx = uni.createCameraContext()
			this.onCameraFrame()
			//this.takePhoto()
			//this.startRecord()
		},
		
		async esign(){
			if (this.isSign) return 
			
			this.isSign = true
			
			let params={
					idNumber: this.idNum,
					name: this.username,
					redirectUrl: `/pagesOrder/order-detail/order-detail?orderId=${this.userCarSubscribeId}`,
					userCarSubscribeId: this.userCarSubscribeId,
					userPhone: this.userInfo.mobile,
			}
			const result = await this.$getRequest(this.$url.esign, 'POST', params)
			if(result.code == 0){
				uni.setStorageSync('url', result.data.contractUrl || result.data)
				uni.navigateTo({
					url: `/pages/home/profile/wxbview?from=sign&orderId=${this.userCarSubscribeId}`
				})
			}
		},
		
		async esign1(){
			if (this.isSign) return 
			
			this.isSign = true
			
			let params={
					redirectUrl: `/pagesOrder/order-detail/contact?orderId=${this.userCarSubscribeId}`,
					orderId: this.userCarSubscribeId,
			}
			const result = await this.$getRequest(this.$url.esign1, 'POST', params)
			if(result.code == 0){
				uni.setStorageSync('url', result.data.contractUrl || result.data)
				uni.navigateTo({
					url: `/pages/home/profile/wxbview?from=contact&orderId=${this.userCarSubscribeId}`
				})
			}
		},
		
		async esign2(){
			if (this.isSign) return 
			
			this.isSign = true
			
			let params={
					redirectUrl: `/pagesOrder/rental/order/detail?orderId=${this.userCarSubscribeId}`,
					orderId: this.userCarSubscribeId,
			}
			const result = await this.$getRequest(this.$url.signCarRentalConfirm, 'POST', params)
			if(result.code == 0){
				uni.setStorageSync('url', result.data.contractUrl || result.data)
				uni.navigateTo({
					url: `/pages/home/profile/wxbview?from=rentalOrderSign&orderId=${this.userCarSubscribeId}`
				})
			}
		},
		
		async esign3(){
			if (this.isSign) return 
			
			this.isSign = true
			
			let params={
					redirectUrl: `/pagesOrder/rental/order/detail?orderId=${this.userCarSubscribeId}`,
					orderId: this.userCarSubscribeId,
					businessType: 2,
			}
			const result = await this.$getRequest(this.$url.esign1, 'POST', params)
			if(result.code == 0){
				uni.setStorageSync('url', result.data.contractUrl || result.data)
				uni.navigateTo({
					url: `/pages/home/profile/wxbview?from=rentalOrderContact&orderId=${this.userCarSubscribeId}`
				})
			}
		},
		
		startRecord() {
			this.ctx.startRecord({
				success: res => {
					if (res.errMsg === 'operateCamera:ok') {
						let stopTimer = setTimeout(() => {
							this.ctx.stopRecord({
								success: result => {
									console.log('stopRecord success', result)
									if (result.errMsg === 'operateCamera:ok') {
										const videoSrc = result.tempVideoPath
										this.$getFileUpload(this.$url.upload, [videoSrc]).then(upload => {
											if(upload.code == 0) {
												const imageUrl = upload.data.src
												const userMess = uni.getStorageSync("userMess")
												this.$getRequest(this.$url.faceAudit, 'POST', {
													imageUrl,
													idNum: this.idNum,
													name: this.username,
												}).then(result => {
													
													if (result.code == 0 && result.data.pass) {
														this.clearTimer()
														const reason = result.data.reason.split('(')
														//this.tip = reason[0]
														this.tip = '认证通过'
														const confirmRouter = uni.getStorageSync("confirmRouter")
														const option = uni.getStorageSync("option")
														
														uni.removeStorageSync('confirmRouter')
														uni.removeStorageSync('option')
														
														uni.reLaunch({
															url: this.orderDetailPage
														})
														
														// if(confirmRouter=='/pages/ordered/place-order'){
														// 	uni.switchTab({
														// 		url: '/pages/ordered/place-order'
														// 	})
														// } else {
														// 	let orderType = 1
														// 	if (this.type == 6) {
														// 		orderType = 2
														// 	}
															
														// 	uni.reLaunch({
														// 		url: `${confirmRouter}&orderType=${orderType}`
														// 	})
														// }
													} else {
														// if (result.data && result.data.reason) {
														// 	const reason = result.data.reason.split('(')
														// 	this.tip = reason[0]
														// }
														this.tip = '抱歉，没有认出您'
														this.startRecord()
													}
												})
											} else {
												this.startRecord()
											}
										})
									} else {
										this.startRecord()
									}
								},
								fail: (error) => {
									console.log('stopRecord fail', error)
									this.startRecord()
								},
								complete: () => {
									clearTimeout(stopTimer)
									stopTimer = null
								}
							})
						}, 5000)
					} else {
						this.startRecord()
					}
				},
				fail: (err) => {
					console.log('fail', err)
					this.startRecord()
				}
			})
		},
		
		takePhoto() {
			this.timer = setTimeout(() => {
				this.ctx.takePhoto({
						quality: 'high',
						success: (res) => {
							const tempImagePath = res.tempImagePath
							this.$getFileUpload(this.$url.upload, [tempImagePath]).then(upload => {
								if(upload.code == 0) {
									const imageUrl = upload.data.src
									const userMess = uni.getStorageSync("userMess")
									this.$getRequest(this.$url.faceAudit, 'POST', {
										imageUrl,
										idNum: this.idNum,
										name: this.username,
										// idNum: '210911200201170019',
										// name: '刘相辰',
									}).then(async result => {
										if (result.code == 0 && result.data.pass) {
											this.clearTimer()
											const reason = result.data.reason.split('(')
											this.tip = '认证通过'
											
											if (this.from === 'sign') {
												uni.reLaunch({
													url: this.esignInfo.redirectUrl
												})
											} else if (this.from === 'contact') {
												const contactResult = await this.$getRequest(this.$url.updateUserSubscribeEmergencyContact, 'GET', this.contactInfo)
												if(contactResult.code == 0){
													uni.reLaunch({
														url: `/pagesOrder/order-detail/order-detail?orderId=${this.contactInfo.id}`
													})
												}
											}
											
										} else {
											// if (result.data && result.data.reason) {
											// 	const reason = result.data.reason.split('(')
											// 	this.tip = reason[0]
											// }
											this.tip = '抱歉，没有认出您'
											this.takePhoto()
										}
									})
								} else {
									this.takePhoto()
								}
							})
						},
						fail: (err) => {
							console.log('fail', err)
							this.takePhoto()
						}
				})
			}, 1000)
		},
		
		onCameraFrame() {
				let count = 0
				let listener = this.ctx.onCameraFrame(frame => {
					if (count < 60 || this.faceAudit) {
						count++
						return
					}
					count = 0
					
					const data = new Uint8Array(frame.data)
					const clamped = new Uint8ClampedArray(data)
					
					const ctx = uni.createCanvasContext('firstCanvas')
					this.canvasW = frame.width
					this.canvasH = frame.height
					
					uni.canvasPutImageData({
					  canvasId: 'firstCanvas',
						x: 0,
						y: 0,
						width: frame.width,
						height: frame.height,
						data: clamped,
					  success: (res) => {
							ctx.beginPath()
							const fontSize = frame.width/30
							const bottom = 10
							
							ctx.setFillStyle('rgba(0,0,0,0.3)')
							ctx.fillRect(0, this.canvasH - (fontSize*4), this.canvasW, fontSize*4)
							
							ctx.setFontSize(fontSize)
							ctx.setFillStyle('white')
							ctx.fillText(this.watermark.type, 10, this.canvasH - (fontSize*2) - bottom)
							ctx.fillText(this.watermark.date, 10, this.canvasH - fontSize - bottom)
							ctx.fillText(`拍摄地址：${this.watermark.address}`, 10, this.canvasH - fontSize - bottom)
							
							ctx.draw(true, () => {
								uni.canvasToTempFilePath({
								  x: 0,
									y: 0,
									width: frame.width,
									height: frame.height,
									canvasId: 'firstCanvas',
									fileType: 'jpg',
									destWidth: frame.width,
									destHeight: frame.height,
								  success: (res) => {
										this.$getFileUpload(this.$url.upload, [res.tempFilePath]).then(upload => {
											if(upload.code == 0) {
												const imageUrl = upload.data.src
												this.$getRequest(this.$url.faceAudit, 'POST', {
													resource: 10,
													businessNode: this.businessNode,
													address: this.watermark.address,
													userCarSubscribeId: this.userCarSubscribeId,
													imageUrl,
													idNum: this.idNum,
													name: this.username,
													// idNum: '210911200201170019',
													// name: '刘相辰',
													// idNum: '310107198204081711',
													// name: '卜海荣',
													// idNum: '340827199601230016',
													// name: '仲勇',
												}).then(async result => {
													if (result.code == 0 && result.data.pass) {
														if (listener) {
															listener.stop()
															listener = null
														}
														
														this.faceAudit = true
														
														const reason = result.data.reason.split('(')
														this.tip = '认证通过'
														
														if (this.from === 'createOrderInfo' && this.createOrderInfo.orderServiceType == 1 && !this.updateOrderStatus) {
															this.updateOrderStatus = true
															if (this.isApplyDepositFree) {
																const applyDepositFreeForm = uni.getStorageSync("applyDepositFreeForm")
																if (applyDepositFreeForm) {
																	// if (applyDepositFreeForm.hasGuarantor === 1) {
																	// 	uni.reLaunch({
																	// 		url: `/pagesOrder/depositFree/applyDepositFreeByPerson?orderServiceType=1&userId=${applyDepositFreeForm.userId}&hasGuarantor=1&step=3`
																	// 	})
																	// } else {
																		const result = await this.$getRequest(this.$url.applyDepositFree, 'POST', applyDepositFreeForm)
																		if(result.code == 0){
																			const path =  `/pagesOrder/depositFree/ApplyDepositFreeSuccess?orderServiceType=1`
																			this.updateUserSubscribeStatus(path)
																		}
																	//}
																}
															} else {
																this.updateUserSubscribeStatus()
															}
														} else if (this.from === 'createOrderInfo' && this.createOrderInfo.orderServiceType == 2 && !this.updateOrderStatus) {
															this.updateOrderStatus = true
															if (this.isApplyDepositFree) {
																const applyDepositFreeForm = uni.getStorageSync("applyDepositFreeForm")
																if (applyDepositFreeForm) {
																	// if (applyDepositFreeForm.hasGuarantor === 1) {
																	// 	uni.reLaunch({
																	// 		url: `/pagesOrder/depositFree/applyDepositFreeByPerson?orderServiceType=2&userId=${applyDepositFreeForm.userId}&hasGuarantor=1&step=3`
																	// 	})
																	// } else {
																		const result = await this.$getRequest(this.$url.carRentalApply, 'POST', applyDepositFreeForm)
																		if(result.code == 0){
																			const path =  `/pagesOrder/depositFree/ApplyDepositFreeSuccess?orderServiceType=2`
																			this.updateRentalOrderStatus(path)
																		}
																	//}
																}
															} else {
																this.updateRentalOrderStatus()
															}
														} else if (this.from === 'sign') {
															this.esign()
														} else if (this.from === 'contact') {
															this.esign1()
														} else if (this.from === 'rentalOrderSign') {
															this.esign2()
														} else if (this.from === 'rentalOrderContact') {
															this.esign3()
														} else if (this.from === 'identityPartner') {
															const result = await this.$getRequest(this.$url.identityPartner, 'POST', this.identityInfo)
															if(result.code == 0){
																uni.reLaunch({
																	url: `/partner/card/bindcard?realName=${this.identityInfo.realName}&userId=${this.identityInfo.userId}`,
																})
															}
														} else if (this.from === 'partnerApply') {
															const partnerApplyInfo = uni.getStorageSync("partnerApplyInfo")
															const result = await this.$getRequest(this.$url.partnerApply, 'POST', partnerApplyInfo)
															if(result.code == 0){
																uni.reLaunch({
																	url: `/partner/register/registerSuccess?isHasOrder=2`
																})
															}
														} else if (this.from === 'customerRental') {
															uni.reLaunch({
																url: `/pages/custom/custom-order?tab=2`
															})
														}
														
													} else {
														// if (result.data && result.data.reason) {
														// 	const reason = result.data.reason.split('(')
														// 	this.tip = reason[0]
														// }
														this.tip = '抱歉，没有认出您'
														if (listener) {
															listener.stop()
															listener = null
														}
														this.onCameraFrame()
													}
												})
											} else {
												if (listener) {
													listener.stop()
													listener = null
												}
												this.onCameraFrame()
											}
										})
								  },
									fail: (res) => {
										console.log('图片生成失败', res)
										if (listener) {
											listener.stop()
											listener = null
										}
										this.onCameraFrame()
									}
								})
							})
						},
						fail: (res) => {
							console.log('调用失败', res)
							if (listener) {
								listener.stop()
								listener = null
							}
							this.onCameraFrame()
						}
					})
				})
				
				listener.start()
		},
		
		async updateUserSubscribeStatus(path = '') {
			//let url = path
			//if (!url) {
				const url = uni.getStorageSync("identityPath")
			//}
			
			const params = {
				 id: this.createOrderInfo.orderId,
				 status: 10,
				 orderType: this.createOrderInfo.orderType,
			}
			const result = await this.$getRequest(this.$url.updateUserSubscribeStatus, 'GET', params)
			if(result.code == 0){
				uni.reLaunch({
					url,
				})
			}
		},
		
		async updateRentalOrderStatus(path = '') {
			let url = path
			if (!url) {
				url = `/pagesOrder/rental/order/detail?orderId=${this.createOrderInfo.orderId}`
			}
			
			const params = {
				 id: this.createOrderInfo.orderId,
				 status: 10,
				 orderType: this.createOrderInfo.orderType,
			}
			const result = await this.$getRequest(this.$url.updateUserCarRentalSubscribeStatus, 'GET', params)
			if(result.code == 0){
				uni.reLaunch({
					url,
				})
			}
		},
		
		error(e) {
				console.log('error', e.detail);
		},
		
		clearTimer() {
			clearTimeout(this.timer)
			this.timer = null
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40px 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.tip {
		margin-top: 16px;
		height: 44rpx;
		font-size: 16px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
	}
}
</style>