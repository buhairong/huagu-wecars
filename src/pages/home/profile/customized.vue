<template>
	<view class="customized">
		<view class="car-head">
			<view class="car-head-name">
				<image src="https://image.51cheyaoshi.com/xcx/app/static/carlife/tab5_on.png"></image>
				<!-- <text>上海wecars汽车</text> -->
			</view>
			<view class="car-head-img">
				<image mode="aspectFill" :src="carData.imageUrl"></image>
			</view>
			<view class="car-head-text">{{carData.carBrand}} {{carData.carType}} {{carData.carTypeYear}}
				{{carData.carTypeYearProduct}}</view>
		</view>
		<view class="car-color">
			<view class="car-w-color">
				<view class="car-w-title flex-center">
					<text class="color-title car-w-text">外观颜色</text>
					<view class="car-w-money">
						<text class="color-text">{{colorName}} </text>
						<text v-show="colorMoney"> + ¥{{colorMoney}}</text>
					</view>
				</view>
				<view v-for="(itemC,indexC) in carColor" :key="indexC" style="display: inline-block;">
					<view class="inColor" :class="{'active': activeC == indexC}" :style="{background: itemC.colorNum}"
						@click="changeInColor(itemC,indexC)"></view>
				</view>
			</view>
			<view class="car-n-color">
				<view class="car-n-title flex-center">
					<text class="color-title car-n-text">内饰颜色</text>
					<text class="color-text car-n-money">{{colorNameO}} </text>
					<text v-show="colorMoneyO"> + ¥{{colorMoneyO}}</text>
				</view>
				<view v-for="(itemO,indexO) in otherColor" :key="indexO" style="display: inline-block;">
					<view class="otherColor" :class="{'active': activeO == indexO}"
						:style="{background: itemO.colorNum}" @click="changeOtherColor(itemO,indexO)"></view>
				</view>
			</view>
		</view>
		<view class="car-option">
			<view class="car-t-title car-option-title">车辆选配</view>
			<view class="car-bl" v-for="(item, index) in carConfig" :key="index">
				<view class="color-title car-bl-t">{{item.function}}</view>
				<view class="car-bl-box">
					<view v-for="(itemd,indexd) in item.details" :key="indexd" class="car-bl-c"
						:class="{'active': itemd.hasCheck}" @click="optionConfig(itemd, index, indexd)">
						<view>{{itemd.detailName}}</view>
						<view v-show="itemd.money">¥{{itemd.money}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="car-way">
			<view class="car-t-title car-way-t">提车方式</view>
			<view class="car-way-box">
				<view class="car-way-c" v-for="(item,index) in carWay" :key="index"
					:class="{'active': wayActive == index}" @click="optionWay(index)">
					<view>{{item}}</view>
				</view>
			</view>
		</view>
		<view style="margin-top: 60rpx;font-size: 24rpx;color: rgba(10, 15, 45, 0.5);">*车辆个性定制以最终签约为准</view>
		<u-gap v-if="showNote" height="190" margin-top="50" bg-color="#FFFFFF" />
		<view v-if="showNote" class="foot-but foot-sticky u-flex u-row-between" @click="handleBookCar">
			<view class="foot-but-r" style="margin: 0 auto">
				下一步
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showNote: true,
				// 车信息
				carData: {},
				// 外观颜色
				carColor: [],
				activeC: 0,
				colorName: '',
				colorMoney: '',
				// 内饰颜色
				otherColor: [],
				activeO: 0,
				colorNameO: '',
				colorMoneyO: '',
				// 车辆选配
				carConfig: [],
				// 车辆选配默认
				indexActive: '0',
				// 提车方式
				carWay: [
					'到店提车',
					'管家专送'
				],
				wayActive: '0',
				id:'',
				planId:'',
				cartype: null, // 1.新车 2.二手车
			}
		},
		onLoad(option){
			console.log(option.id,22)
			this.id = option.id
			this.planId = option.planId
			this.cartype = option.cartype // 1.新车 2.二手车
		},
		methods: {
			getConfigColorData() {
				var that = this;
				uni.showLoading({
					title: '加载中'
				});
				var params = {
					id: this.planId
				}
				that.$getRequest(that.$url.getConfigColor, 'GET', params).then((data) => {
					uni.hideLoading()
					if (data.code == 0) {
						// console.log(data)
						that.carData = data.data.carTypeYearProductEntity
						that.carColor = data.data.inColors
						that.otherColor = data.data.outColors
						that.carConfig = data.data.otherConfigs
						for (var i = 0; i < that.carColor.length; i++) {
							that.colorName = that.carColor[0].colorName
							that.colorMoney = that.carColor[0].money
						}
						for (var j = 0; j < that.otherColor.length; j++) {
							that.colorNameO = that.otherColor[0].colorName
							that.colorMoneyO = that.otherColor[0].money
						}
					}
				})
			},
			// 外观颜色切换
			changeInColor(item, index) {
				this.activeC = index
				this.colorName = item.colorName
				this.colorMoney = item.money
			},
			// 内饰颜色切换
			changeOtherColor(item, index) {
				this.activeO = index
				this.colorNameO = item.colorName
				this.colorMoneyO = item.money
			},
			// 车辆选配切换
			optionConfig(item, index, indexd) {
				const list = JSON.parse(JSON.stringify(this.carConfig))
				// console.log(list)
				list[index].details[indexd].hasCheck = item.hasCheck === 1 ? 0 : 1
				this.carConfig = list
			},
			// 提车方式切换
			optionWay(index) {
				this.wayActive = index
			},
			// 下一步
			handleBookCar() {
				this.subMitconfig()
				
				
				// uni.showToast({
				// 	title: '本功能暂未向用户开放',
				// 	icon:'none'
				// })
			},
			subMitconfig(){
				let params = {
					deliveryWay:this.wayActive*1+1,
					inColor:this.colorNameO,
					inColorMoney:this.colorMoneyO,
					outColor:this.colorName,
					outColorMoney:this.colorMoney,
					userCarSubscribeId:this.planId,
					otherConfigVo:this.carConfig
				}
				this.$getRequest(this.$url.createUserCar, 'POST', params).then(res => {
					if(res.code == 0){
						console.log(this.id,this.planId,res.data.id,22222)
						uni.navigateTo({
							url: './end-eriod-option?id='+this.id + '&planId='+this.planId + '&configId=' + res.data.id + '&cartype='+this.cartype
						})
					}
				})
			}
		},
		onShow() {
			this.getConfigColorData()
		}
	}
</script>

<style lang="scss" scoped>
	.car-t-title {
		font-size: 34rpx;
		font-weight: 600;
	}

	.color-title {
		font-size: 30rpx;
		// font-weight: 600;
	}

	.color-text {
		display: flex;
		font-size: 24rpx;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	.customized {
		padding: 0;
		margin: 36rpx 32rpx;

		.car-head {
			.car-head-name {
				font-size: 28rpx;
				padding: 20rpx 0 0 20rpx;
				display: flex;
				align-items: center;

				image {
					width: 24rpx;
					height: 24rpx;
				}

				text {
					font-size: 24rpx;
					margin-left: 8rpx;
				}
			}

			.car-head-img {
				width: 606rpx;
				height: 242rpx;
				margin: 12rpx auto;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.car-head-text {
				font-size: 36rpx;
				font-weight: 500;
			}
		}

		.car-color {
			margin-top: 26rpx;

			.car-w-color {
				.car-w-title {
					.car-w-money {
						margin-left: 24rpx;
						display: flex;
						align-items: center;
					}
				}

				.inColor {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					margin: 30rpx 0 30rpx 30rpx;
					// border: 10rpx solid #fff;
					// outline: 1px solid #000;
					box-shadow: 0 0 0 5px #fff, 0 0 0 6px #fff;
				}

				.inColor.active {
					box-shadow: 0 0 0 5px #fff, 0 0 0 6px #000;
				}
			}

			.car-n-color {
				margin-top: 20rpx;

				.car-n-title {
					.car-n-money {
						margin-left: 14rpx;
					}
				}

				.otherColor {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					margin: 30rpx 0 40rpx 30rpx;
					box-shadow: 0 0 0 5px #fff, 0 0 0 6px #fff;
				}

				.otherColor.active {
					box-shadow: 0 0 0 5px #fff, 0 0 0 6px #000;
				}
			}
		}

		.car-option {
			margin-top: 24rpx;

			.car-bl {
				margin-top: 20rpx;

				.car-bl-box {
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					width: 100%;

					.car-bl-c {
						width: 46%;
						background: rgba(10, 15, 45, 0.04);
						padding: 10rpx 28rpx;
						border-radius: 8rpx;
						margin-top: 12rpx;

						// border: 1px solid white;
						view {
							text-align: center;
							font-size: 24rpx;
							color: rgba(10, 15, 45, 0.8);
						}
					}

					.car-bl-c.active {
						background: #66EDAB;
					}
				}

			}
		}

		.car-way {
			margin-top: 24rpx;

			.car-way-box {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				width: 100%;
	
				.car-way-c {
					width: 46%;
					padding: 10rpx 28rpx;
					border-radius: 8rpx;
					margin-top: 12rpx;
					line-height: 68rpx;
					view {
						text-align: center;
						font-size: 24rpx;
						color: rgba(10, 15, 45, 0.8);
					}
				}

				.car-way-c.active {
					background: #66EDAB;
					font-weight: 500;
				}
			}
		}
	}
</style>
