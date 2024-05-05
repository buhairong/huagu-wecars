<template>
	<view class="test-drive">
		<view class="test-drive-t">请填写信息</view>
		<view class="test-drive-form">
			<view style="margin-top:10rpx;background: #eee;border-radius: 10rpx;">
				<template>
				  <u-input
				    placeholder="请输入内容"
				    border="surround"
				    v-model="carName"
				    @change="change"
				  ></u-input>
				</template>
			</view>
			<!-- <view  style="margin-top:10rpx;background: #eee;border-radius: 10rpx;">
				<template>
				  <u-input
					placeholder="请选择车型"
					border="surround"
					v-model="carYearAndProduct"
					@click="show = true"
				  ></u-input>
				</template>
			</view> -->
			<view style="width: 100%;background: #eee;border-radius: 10rpx;border:1px solid #dcdfe6;margin-top:10rpx;">
				<picker mode="selector" @change="bindPickerChange" :value="index" :range="carTypeDataArray">
					<view class="carYearProduct">
						<!-- {{carTypeDataArray[index]}} -->
						<view class="arrow"></view>
					</view>
					
				</picker>
			</view>
			
			<view  style="margin-top:10rpx;background: #eee;border-radius: 10rpx;">
				<template>
				  <u-input
					placeholder="姓名"
					border="surround"
					v-model="userInfo.name"
					@change="change"
				  ></u-input>
				</template>
			</view>
			<view  style="margin-top:10rpx;background: #eee;border-radius: 10rpx;">
				<template>
				  <u-input
					type="number"
					placeholder="手机号"
					border="surround"
					v-model="userInfo.mobile"
					@change="change"
				  ></u-input>
				</template>
			</view>
		</view>
		<view>
			<view
			    class="foot-but foot-sticky u-flex u-row-between"
				@click="testDrive"
			>
			    <view class="foot-but-r" style="margin: 0 auto;">
					预约试驾
			    </view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			carName: '',
			carTypeYearProductId: '',
			userInfo: {},
			mobile: '',
			carYearAndProduct: '',
			index: 0,
			carTypeDataArray: '',
		}
	},
	methods: {
		bindPickerChange: function(e) {
			// console.log('picker发送选择改变，携带值为', e)
			this.index = e.detail.value
		},
		change(e) {
		  console.log('change', e);
		},
		// 预约试驾
		testDrive() {
			var that = this;
			if(!that.carName) {
				uni.showToast({
					title: '请填写车系',
					icon:"none"
				})
				return
			}
			if(!that.carTypeDataArray.length) {
				uni.showToast({
					title: '请填写型号',
					icon:"none"
				})
				return
			}
			if(!that.userInfo.name) {
				uni.showToast({
					title: '请填写名字',
					icon:"none"
				})
				return
			}
			if(that.userInfo.mobile == '') {
				uni.showToast({
					title: '请填写正确的手机号',
					icon:"none"
				})
				return
			}
			var params = {
				applyerMobile: that.userInfo.mobile,
				applyerName: that.userInfo.name,
				carTypeYearProductId: that.carTypeYearProductId
			}
			that.$getRequest(that.$url.getTestDrive, 'POST', params).then((data) =>{
				if(data.code == 0) {
					// console.log("截取名字首字母：",this.userInfo.name.slice(0,1))
					var name = this.userInfo.name.slice(0,1)
					uni.navigateTo({
						url: './yuyue-success?name='+name +'&orderNum='+data.data
					})
				}
			}).catch((err) => {
				uni.showToast({
					title:err.msg,
					icon:"error"
				})
			})
		},
	},
	onLoad(option) {
		var data = JSON.parse(option.carYearAndProduct)
		// console.log("test",JSON.parse(option.carYearAndProduct))
		var carName = data.carBrand
		var carNameType = data.carType
		this.carName = carName +' '+ carNameType
		this.carTypeYearProductId = data.carTypeId
		this.carYearAndProduct = data.carYearAndProduct
		var carTypeData = data.allCarTypeYearProductEntity
		
		var carArray = []
		let array = carTypeData.map((item) => {
			carArray.push(item.carTypeYear+' '+item.carTypeYearProduct)
		})
		this.carTypeDataArray=carArray
	},
	onShow() {
		getApp().globalData.getUserInfo((data) => {
		    this.userInfo = data;
		})
	}
}
</script>

<style lang="scss" scoped>

	.test-drive {
		padding: 0;
		margin: 36rpx 32rpx;
		.test-drive-t {
			font-size: 30rpx;
			margin-top: 68rpx;
		}
		.test-drive-form {
			width: 80%;
			margin-top:12rpx;
		}
	}
	.carYearProduct{
		min-height: 66rpx;
		line-height: 66rpx;
		margin:0 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.arrow{
		width: 0;
		height: 0;
		border-right: solid 10rpx transparent;
		border-left: solid 10rpx transparent;
		border-top: solid 16rpx black;
	}
</style>