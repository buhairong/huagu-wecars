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
		<canvas style="width: 400px;height:400px;margin-left: -1000px;" canvas-id="firstCanvas" id="firstCanvas"></canvas>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: null, // 5.个人 6.企业
			timer: null,
			ctx: null,
			idNum: '',
			username: '',
			tip: '拍摄实际用车人人脸，请确保正对手机且光线充足',
		}
	},
	onLoad(options) {
		this.type = options.type
		this.idNum = options.idNum
		this.username = options.username
		
		
		const confirmRouter = uni.getStorageSync("confirmRouter")
		const option = uni.getStorageSync("option")
		
		uni.reLaunch({
			url: `${confirmRouter}&orderType=1`
		})
		
		
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
												this.$getRequest(this.$url.faceAudit, 'GET', {
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
														
														if(confirmRouter=='/pages/ordered/place-order'){
															uni.switchTab({
																url: '/pages/ordered/place-order'
															})
														} else {
															let orderType = 1
															if (this.type == 6) {
																orderType = 2
															}
															
															uni.reLaunch({
																url: `${confirmRouter}&orderType=${orderType}`
															})
														}
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
									this.$getRequest(this.$url.faceAudit, 'GET', {
										imageUrl,
										idNum: this.idNum,
										name: this.username,
										// idNum: '210911200201170019',
										// name: '刘相辰',
									}).then(result => {
										if (result.code == 0 && result.data.pass) {
											this.clearTimer()
											const reason = result.data.reason.split('(')
											this.tip = '认证通过'
											const confirmRouter = uni.getStorageSync("confirmRouter")
											const option = uni.getStorageSync("option")
											
											uni.removeStorageSync('confirmRouter')
											uni.removeStorageSync('option')
											
											if(confirmRouter=='/pages/ordered/place-order'){
												uni.switchTab({
													url: '/pages/ordered/place-order'
												})
											} else {
												let orderType = 1
												if (this.type == 6) {
													orderType = 2
												}
												
												uni.reLaunch({
													url: `${confirmRouter}&orderType=${orderType}`
												})
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
				const listener = this.ctx.onCameraFrame(frame => {
					if (count < 30) {
						count++
						return
					}
					count = 0
					
					const data = new Uint8Array(frame.data)
					const clamped = new Uint8ClampedArray(data)
					const context = uni.createCanvasContext('firstCanvas')
					
					uni.canvasPutImageData({
					  canvasId: 'firstCanvas',
						x: 0,
						y: 0,
						width: frame.width,
						height: frame.height,
						data: clamped,
					  success: (res) => {
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
											const userMess = uni.getStorageSync("userMess")
											this.$getRequest(this.$url.faceAudit, 'GET', {
												imageUrl,
												idNum: this.idNum,
												name: this.username,
												// idNum: '210911200201170019',
												// name: '刘相辰',
											}).then(result => {
												if (result.code == 0 && result.data.pass) {
													listener.stop()
													const reason = result.data.reason.split('(')
													this.tip = '认证通过'
													const confirmRouter = uni.getStorageSync("confirmRouter")
													const option = uni.getStorageSync("option")
													
													uni.removeStorageSync('confirmRouter')
													uni.removeStorageSync('option')
													
													if(confirmRouter=='/pages/ordered/place-order'){
														uni.switchTab({
															url: '/pages/ordered/place-order'
														})
													} else {
														let orderType = 1
														if (this.type == 6) {
															orderType = 2
														}
														
														uni.reLaunch({
															url: `${confirmRouter}&orderType=${orderType}`
														})
													}
												} else {
													// if (result.data && result.data.reason) {
													// 	const reason = result.data.reason.split('(')
													// 	this.tip = reason[0]
													// }
													this.tip = '抱歉，没有认出您'
													this.onCameraFrame()
												}
											})
										} else {
											this.onCameraFrame()
										}
									})
							  },
								fail: (res) => {
									console.log('图片生成失败', res)
									this.onCameraFrame()
								}
							})
						},
						fail: (res) => {
							console.log('调用失败', res)
							this.onCameraFrame()
						}
					})
				})
				
				listener.start()
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