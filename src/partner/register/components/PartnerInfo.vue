<template>
	<view>
		<view class="card-wrap">
			<view class="page-card">
				<view class="input-wrap">
					<view class="label">姓名</view>
					<input class="input" placeholder="请输入姓名" v-model="form.userName" />
				</view>
				
				<!-- <view class="tip1">请上传所在单位的相关证明照片</view>
				<view class="tip2">( 例如 社保缴纳记录、银行流水证明、名片、工作证等 )</view>
				
				<view class="img-wrap">
					<view class="img-box" v-for="(img, index) in form.imageList" :key="index">
						<image class="img" mode="aspectFill" :src="img"></image>
						<view class="del-icon" @click="delImg(index)">
							<u-icon name="close-circle-fill" color="#000000" size="40"></u-icon>
						</view>
					</view>
					
					<view class="img-box img-box1" @click="uploadImg">
						<image class="camera-img" src="https://image.51cheyaoshi.com/xcx/merchant/static/home/camera-icon.png"></image>
						<view class="img-tip">上传相关证明</view>
					</view>
				</view> -->
			</view>
		</view>
		
		<view class="fixed-buttom-disabled-btn">
			<button :disabled="disabled" @click="next">立即申请</button>
		</view>
	</view>
</template>

<script>
export default {
	data(){
		return {
			form: {
				userName: '',
				companyName: '',
				// imageList: [],
			},
			showCityList: false,
			cityList: [],
			issueCityName: '',
			showModal: false,
			selCityId: '',
			selCityName: '',
		}
	},
	
	computed: {
		disabled() {
			let res = true
			
			if (this.form.userName.trim()) {
				res = false
			}
			
			return res
		},
	},
	
	mounted() {
		wx.getPrivacySetting({
			success: async res => {
				console.log('getPrivacySetting', res)
			},
			fail: () => {},
			complete: () => {}
		})
	},
	
	methods: {
		getAllCity() {
			this.$getRequest(this.$url.cityList, 'POST', {})
				.then((res) => {
					if(res.code == 0) {
						this.cityList = res.data
						this.cityList.forEach(item => {
							item.value = item.id
							item.label = item.city
						})
					}
				})
		},
		
		openCityList() {
			this.showCityList = true
		},
		
		confirmCity(e) {
			this.checkCity(e[0].value, e[0].label)
		},
		
		checkCity(cityId, cityName) {
			if (this.issueCityName === cityName) {
				this.form.cityId = cityId
				this.form.cityName = cityName
				this.form.hasGuarantor = 2
			} else {
				this.selCityId = cityId
				this.selCityName = cityName
				this.showModal = true
			}
		},
		
		changeOrderCity() {
			this.form.cityId = this.selCityId
			this.form.cityName = this.selCityName
			this.form.hasGuarantor = 1
		},
		
		uploadImg() {
			uni.chooseImage({
				success: async (chooseImageRes) => {
					uni.showLoading({
							title: '上传中'
					});
					const tempFilePaths = chooseImageRes.tempFilePaths
					
					for(const path of tempFilePaths) {
						const upload = await this.$getFileUpload(this.$url.upload, [path])
						if(upload.code === 0) {
							this.form.imageList.push(upload.data.src)
						}
					}
					
					uni.hideLoading()
				},
				fail(err) {
					console.log('uploadImg err', err)
				}
			})
		},
		
		delImg(index) {
			uni.showModal({
				title: '提示',
				content: '确定要删除这张图片吗？',
				success: (res) => {
					if (res.confirm) {
						this.form.imageList.splice(index, 1)
					}
				}
			})
		},
		
		next() {
			this.$emit('nextStep', this.form)
		},
	}
}
</script>

<style lang="scss" scoped>
.title {
	padding-bottom: 36rpx;
	height: 72rpx;
	font-size: 56rpx;
	font-weight: 500;
	line-height: 72rpx;
	color: #0A0F2D;
}
.card-wrap {
	padding-top: 40rpx;
	padding-bottom: 80rpx;
}

.page-card {
	
}

.input-wrap {
	margin-bottom: 24rpx;
	width: 100%;
	height: 104rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 30rpx;
	color: rgba(10, 15, 45, 0.5);
	border-bottom: 2rpx solid #E6E6E6;
}

.input-wrap .label {
	padding-right: 32rpx;
}

.input-wrap .input {
	flex: 1;
	text-align: right;
	padding: 0;
	background: transparent;
}

.city-item{
	display: flex;
	justify-content: space-between;
	.item-title {
		font-size: 14px;
		line-height: 44rpx;
		color: #64696F;
	}
	.city {
		display: flex;
		align-items: center;
		.change-city-link {
			line-height: 44rpx;
			padding-left: 24rpx;
			font-size: 12px;
			text-decoration: underline;
			color: #3446AA;
		}
	}
}

.tip1 {
	height: 44rpx;
	font-size: 28rpx;
	line-height: 44rpx;
	color: rgba(10, 15, 45, 0.8);
}

.tip2 {
	height: 44rpx;
	font-size: 20rpx;
	line-height: 44rpx;
	color: #767676;
}

.img-wrap {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.img-box {
	margin-top: 24rpx;
	width: 296rpx;
	height: 240rpx;
	border-radius: 8rpx;
	overflow: hidden;
	position: relative;
}

.img-box .img {
	width: 100%;
	height: 100%;
}

.img-box .del-icon {
	position: absolute;
	top: 0rpx;
	right: 0rpx;
	z-index: 100;
}

.img-box1 {
	background: #0A0F2D;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.img-box1 .camera-img {
	width: 48rpx;
	height: 48rpx;
}

.img-box1 .img-tip {
	margin-top: 24rpx;
	height: 40rpx;
	font-size: 28rpx;
	line-height: 40rpx;
	color: #FFFFFF;
}

.fixed-buttom-disabled-btn {
	button {
		background: #0A0F2D;
	}
	button[aria-disabled="true"] {
		background: rgba(216, 216, 216, 0.6);
		color: #FFFFFF;
	}
}
</style>