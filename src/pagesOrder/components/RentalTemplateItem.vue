<template>
	<view v-if="item" class="card-wrap">
		<view class="card">
			<view class="plan-list">
				<view 
					v-for="plan in selCity.typeReqVos"
					:key="plan.id"
					class="plan"
					:class="{'checked-plan': plan.id === selCity.id}"
					@click.stop="changePlan(plan.id)"
				>
						<view class="plan-item1">{{CAR_RENTAL_PERIOD_STATUS[plan.period].label}}</view>
						<view class="plan-item2">
							￥{{(plan.totalMoney + (plan.period/30*plateNumFee)) | $numFormat}}
						</view>
						<view class="plan-item3">
							{{(plan.money+plateNumFee) | $numFormat}}元/月
						</view>
						
						<view class="checked-icon-wrap">
							<u-icon name="checkmark" color="#ffffff" size="16"></u-icon>
						</view>
				</view>
			</view>
			
			<view class="period-wrap">
				<view class="period-tip">取车时间</view>
				<view class="period-box">
					<view class="line"></view>
				</view>
				<view class="period-tip">还车时间</view>
			</view>
			
			<view class="pick-time-wrap">
				<view>
					<view class="pick-time">
						{{custom.pickCarTimeStart.month}}月{{custom.pickCarTimeStart.date}}日 {{custom.pickCarTimeStart.hour}}:{{custom.pickCarTimeStart.minute}}
						<view class="text-btn" @click="openPickCarDateList">修改</view>
					</view>
					<view class="pick-car-year">
						{{custom.pickCarTimeStart.year}}年
					</view>
				</view>
				
				<view>
					<view class="pick-time">
						{{custom.pickCarTimeEnd.month}}月{{custom.pickCarTimeEnd.date}}日 {{custom.pickCarTimeStart.hour}}:{{custom.pickCarTimeStart.minute}}
					</view>
					<view class="pick-car-year">
						{{custom.pickCarTimeEnd.year}}年
					</view>
				</view>
				
			</view>
			
			<view class="split-line"></view>
			
			<view class="custom-item" @click="openCityList">
				<view class="label">用车城市</view>
				<view class="content">
					{{selCityName}} 
					<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
				</view>
			</view>
			
			<view class="custom-item" v-if="custom.isSameAddr == 1">
				<view class="label">取还车地址</view>
				<view class="content address" @click="handleAddress(1)">
					<view class="addr">
						{{pickCarAddr || '请选择'}}
					</view>
					<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
				</view>
			</view>
			
			<template v-else>
				<view class="custom-item">
					<view class="label">取车地址</view>
					<view class="content address" @click="handleAddress(2)">
						<view class="addr">
							{{pickCarAddr || '请选择'}}
						</view>
						<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
					</view>
				</view>
				
				<view class="custom-item">
					<view class="label">还车地址</view>
					<view class="content address" @click="handleAddress(3)">
						<view class="addr">
							{{returnCarAddr || '请选择'}}
						</view>
						<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
					</view>
				</view>
			</template>
			
			<view class="operator">
				<u-checkbox-group>
					<u-checkbox 
						v-model="custom.isSameAddr" 
						name="1"
					>
						还车地址相同
					</u-checkbox>
				</u-checkbox-group>
			</view>
			
		</view>
		
		<u-picker mode="multiSelector" v-model="showPickCarDateList" :range="pickCarDateList" @confirm="confirmPickCarDate"></u-picker>
		
		<u-select
			v-model="showCityList" 
			:list="cityList"
			@confirm="confirmCity"
		></u-select>
	</view>
</template>

<script>
import { formatDate, formatTimeStamp } from '@/utils'
import { dayList, hourList, minList, dayTimer, CAR_RENTAL_PERIOD_STATUS } from '@/constants'

const days = 60
const monthLastDay = {
	1: 31,
	2: 28,
	3: 31,
	4: 30,
	5: 31,
	6: 30,
	7: 31,
	8: 31,
	9: 30,
	10: 31,
	11: 30,
	12: 31,
}

export default {
	props: {
		templateRespVO: {
			type: Array,
			required: true,
		},
		
		userInfo: {
			type: Object | null,
			required: true,
		},
		
		carInfo: {
			type: Object,
			required: true,
		},
		
		cityId: {
			type: Number | String,
			required: true,
		},
	},
	
	data() {
		return {
			CAR_RENTAL_PERIOD_STATUS,
			selCityId: null,
			selCityName: '',
			item: {},
			selCity: {},
			commonItem: {},
			cityList: [],
			showCityList: false,
			startTimeStamp: '',
			custom: {
				pickCarTimeStart: {
					year: '',
					month: '',
					date: '',
					hour: '',
					minute: '',
				},
				pickCarTimeEnd: {
					year: '',
					month: '',
					date: '',
					hour: '',
					minute: '',
				},
				isSameAddr: 1,
				pickCarAddr: '',
				returnCarAddr: '',
			},
			pickCarDateList: [],
			pickCarDateParamsList: [],
			showPickCarDateList: false,
			plateNumFee: 0,
			pickCarAddr: '',
			returnCarAddr: '',
		}
	},
	
	watch: {
		templateRespVO: {
			handler() {
				this.init()
			},
			deep: true,
		},
	},
	
	async mounted() {
		this.selCityId = this.cityId
		await this.getAllCity()
		this.init()
	},
	
	methods: {
		init() {
			const item = this.templateRespVO.find(city => city.cityId === 0)
			if (item) {
				this.commonItem = item
			}
			
			this.getCurItem()
		},
		
		emit() {
			this.$emit('change', {
				item: this.item,
				custom: this.custom,
				selCityId: this.selCityId,
				selCityName: this.selCityName,
				plateNumFee: this.plateNumFee,
				pickCarAddr: this.pickCarAddr,
				returnCarAddr: this.returnCarAddr,
			})
		},
		
		getCurItem() {
			const city = this.templateRespVO.find(city => city.cityId == this.selCityId)
			if (city) {
				this.selCity = city
			} else {
				this.selCity = this.commonItem
			}
			
			this.changePlan(this.selCity.typeReqVos[0].id)
		},
		
		changePlan(id) {
			this.selCity.id = id
			this.item = this.selCity.typeReqVos.find(plan => plan.id === this.selCity.id)
			
			this.getTime()
			
			this.emit()
		},
		
		getTime() {
			if (!this.startTimeStamp) {
				this.startTimeStamp = (new Date(this.item.pickCarTimeStart)).getTime()
				this.custom.pickCarTimeStart = formatDate(this.item.pickCarTimeStart)
				this.custom.pickCarTimeStart.minute = '00'
				const dateList = []
				this.pickCarDateList = []
				this.pickCarDateParamsList = []
				for(let i = 1; i <= days; i++) {
					const date = new Date(this.startTimeStamp + dayTimer*i)
					const year = date.getFullYear()
					const month = (date.getMonth()+1+'').padStart(2, '0')
					const day = (date.getDate()+'').padStart(2, '0')
					const dayStr = `${month}月${day}日 周${dayList[date.getDay()]}`
					dateList.push(dayStr)
					this.pickCarDateParamsList.push({
						year,
						month,
						day,
					})
				}
				this.pickCarDateList = [
					dateList,
					hourList,
					minList,
				]
			}
			
			this.getEndTime()
		},
		
		getEndTime() {
			const endTimeStamp = CAR_RENTAL_PERIOD_STATUS[this.item.period].days * dayTimer + this.startTimeStamp
			const pickCarTimeEnd = formatTimeStamp(endTimeStamp)
			
			const year = pickCarTimeEnd.year
			
			let month = this.custom.pickCarTimeStart.month
			if (this.item.period === 180) {
				month = (parseInt(this.custom.pickCarTimeStart.month) + 6) % 12
				if (month === 0) {
					month = 12
				}
			}
			
			let date = parseInt(this.custom.pickCarTimeStart.date) - 1
			if (date === 0) {
				month -= 1
				if (month === 0) {
					month = 12
				}
				date = monthLastDay[month]
				if (month === 2 && year % 4 === 0) {
					date = 29
				}
			}
			
			
			this.custom.pickCarTimeEnd = {
				...this.custom.pickCarTimeStart,
				year,
				month: (month+'').padStart(2, '0'),
				date: (date+'').padStart(2, '0'),
			}
		},
		
		confirmPickCarDate(e) {
			const key1 = e[0] || 0
			const key2 = e[1] || 0
			const key3 = e[2] || 0
			
			this.custom.pickCarTimeStart.year = this.pickCarDateParamsList[key1].year
			this.custom.pickCarTimeStart.month = this.pickCarDateParamsList[key1].month
			this.custom.pickCarTimeStart.date = this.pickCarDateParamsList[key1].day
			this.custom.pickCarTimeStart.hour = hourList[key2].slice(0,2)
			this.custom.pickCarTimeStart.minute = minList[key3].slice(0,2)
			
			const timer = `${this.pickCarDateParamsList[key1].year}-${this.pickCarDateParamsList[key1].month}-${this.pickCarDateParamsList[key1].day} ${hourList[key2].slice(0,2)}:${minList[key3].slice(0,2)}`
			this.startTimeStamp = (new Date(timer)).getTime()
			this.getEndTime()
		},
		
		getAllCity() {
			this.$getRequest(this.$url.cityList, 'POST', {})
				.then((res) => {
					if(res.code == 0) {
						this.cityList = res.data
						this.cityList.forEach(item => {
							item.value = item.id
							item.label = item.city
						})
						const city = res.data.find(city => city.id == this.cityId)
						if (city) {
							this.selCityId = this.cityId
							this.selCityName = city.city
							if (this.carInfo.carTypeYearProductEntity.mold === 1) {
								this.plateNumFee = city.trackPlatePrice || 0
							} else {
								this.plateNumFee = city.energyVehiclesPlatePrice || 0
							}
							this.getCurItem()
						} else {
							uni.showModal({
								title: '提示',
								content: '很抱歉，您所在的城市暂未开放租车方案，请选择可用租车方案城市。',
								confirmText: '选择城市',
								success: (res) => {
									if (res.confirm) {
										this.showCityList = true
									} else if (res.cancel) {
										this.selCityId = '310100'
										this.selCityName = '上海'
										const city1 = res.data.find(city => city.id == this.selCityId)
										if (city1) {
											if (this.carInfo.carTypeYearProductEntity.mold === 1) {
												this.plateNumFee = city1.trackPlatePrice || 0
											} else {
												this.plateNumFee = city1.energyVehiclesPlatePrice || 0
											}
										}
										this.getCurItem()
									}
								},
								fail: (err) => {
									console.log('fail', err)
								}
							})
						}
					}
				})
		},
		
		openCityList() {
			this.showCityList = true
		},
		
		confirmCity(e) {
			this.selCityId = e[0].value
			this.selCityName = e[0].label
			const city1 = this.cityList.find(city => city.id == this.selCityId)
			if (city1) {
				if (this.carInfo.carTypeYearProductEntity.mold === 1) {
					this.plateNumFee = city1.trackPlatePrice || 0
				} else {
					this.plateNumFee = city1.energyVehiclesPlatePrice || 0
				}
			}
			this.getCurItem()
		},
		
		openPickCarDateList() {
			this.showPickCarDateList = true
		},
		
		// 1.取还车地址 2.取车地址 3.还车地址
		handleAddress(type = 1) {
			wx.getSetting({
				success: (res) => {
					if (!res.authSetting['scope.userLocation']) {
						wx.authorize({
							scope: 'scope.userLocation',
							success: (res) => {

							},
							fail: (res) => {
								wx.showModal({
									title: '提示',
									content: '位置信息未授权，点击确定前往授权',
									success: function (res) {
										if (res.confirm) {
											wx.openSetting({
												success: (res) => {
													console.log('授权成功')
												}
											})
										}
									}
								})
							}
						})
					} else {
						uni.getLocation({
							type: "gcj02",
							success: (res) => {
								let latitude = res.latitude
								let longitude = res.longitude
								uni.chooseLocation({
									latitude,
									longitude,
									success: (result) => {
										if(type == 2) {
											this.pickCarAddr = result.name
										} else if(type == 3) {
											this.returnCarAddr = result.name
										} else {
											this.pickCarAddr = result.name
											this.returnCarAddr = result.name
										}
										this.emit()
									}
								}) 
							}
						})
					}
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.card-wrap {
	margin-top: 24rpx;
	.plan-list {
		display: flex;
		flex-wrap: wrap;
		.plan {
			margin-right: 24rpx;
			padding: 16rpx 0;
			width: 190rpx;
			height: 156rpx;
			border-radius: 8rpx;
			border: 2rpx solid rgba(10, 15, 45, 0.3);
			display: flex;
			flex-direction: column;
			align-items: center;
			.plan-item1 {
				height: 44rpx;
				font-size: 28rpx;
				line-height: 44rpx;
				color: #0A0F2D;
			}
			.plan-item2 {
				height: 40rpx;
				font-size: 12px;
				line-height: 40rpx;
				color: #0A0F2D;
			}
			.plan-item3 {
				height: 40rpx;
				font-size: 12px;
				line-height: 40rpx;
				color: rgba(10, 15, 45, 0.5);
				display: flex;
				align-items: center;
			}
		}
		.plan:last-child {
			margin-right: 0;
		}
		.checked-plan {
			position: relative;
			border-color: rgba(10, 235, 125, 0.6);
			.checked-icon-wrap {
				width: 24rpx;
				height: 24rpx;
				background: rgba(10, 235, 125, 0.6);
				border-radius: 0px 6rpx 0px 4rpx;
				position: absolute;
				top: 0;
				right: 0;
				z-index: 100;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	
	.period-wrap {
		margin-top: 32rpx;
		margin-bottom: 24rpx;
		height: 44rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.period-tip {
			font-size: 28rpx;
			color: #767676;
		}
		.period-box {
			display: flex;
			align-items: center;
			.line {
				width: 166rpx;
				height: 4rpx;
				background: linear-gradient(90deg, #FFFFFF -1%, #d8d8d8 50%, #FFFFFF 101%);
				border-radius: 50%;
			}
			.period {
				padding: 0 16rpx;
				font-size: 32rpx;
				color: #3D3D3D;
			}
		}
	}
	.pick-time-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.pick-time {
			font-size: 32rpx;
			color: #0A0F2D;
			display: flex;
			align-items: center;
		}
		.pick-car-year {
			padding-top: 6rpx;
			height: 44rpx;
			font-size: 24rpx;
			line-height: 44rpx;
			color: #0A0F2D;
		}
		.text-btn {
			height: 44rpx;
			line-height: 44rpx;
			padding: 0 12rpx;
			font-size: 24rpx;
			color: #3446AA;
		}
	}
	.split-line {
		margin: 40rpx 0;
		height: 2rpx;
		background: #D8D8D8;
	}
	.custom-item {
		margin-bottom: 32rpx;
		line-height: 44rpx;
		display: flex;
		justify-content: space-between;
		.label {
			font-size: 30rpx;
			color: #0A0F2D;
			padding-right: 24rpx;
		}
		.content {
			padding: 0;
			display: flex;
			font-size: 30rpx;
			color: rgba(10, 15, 45, 0.8);
			.input {
				flex: 1;
				text-align: right;
				padding: 0;
				background: transparent;
			}
		}
		.address {
			width: 0;
			flex: 1;
			.addr {
				width: 0;
				flex: 1;
				text-align: right;
			}
			u-icon {
				height: 44rpx;
			}
		}
	}
}
</style>