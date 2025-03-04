<template>
	<view class="wrap" v-if="detail">
		<view class="header banner-header">
			<view class="car-info u-flex u-row-between">
			    <view class="brand">
			        <view class="brand-t">
			            {{ detail.carTypeYearProductEntity.carBrand || '' }} {{ detail.carTypeYearProductEntity.carType || '' }}
			        </view>
					<view class="brand-year">
					    {{ detail.carTypeYearProductEntity.carTypeYear || '' }} {{ detail.carTypeYearProductEntity.carTypeYearProduct || '' }}
					</view>
					<view class="u-margin-top-16">
					    <text class="m-serfee-title-txt u-font-30">
					        租金：
					    </text>
					    <text class="m-serfee-val-txt u-font-30">
					        {{ detail.citySubscribeReq[0].money | $numFormat }}元/天
					    </text>
					</view>
			    </view>
			    
			       
			</view>
			
			<view class="banner">
			    <u-swiper
			        class="banner-swiper"
			        :list="bannerList" 
			        :title="false"
			        height="300"
			        mode="round"
			        indicator-pos="bottomCenter"
			        :effect3d="false"
			        autoplay
			        interval="3000"
			        :circular="true"
			        duration="500" 
			        bg-color=""
			    />
			</view>
			
			<view class="configure u-flex">
			    <view
			        v-for="(item, index) in infoList"
			        :key="index"
			        class="u-flex-1 item divider-x"
			    >
			        <view class="title">
			            {{ item.value || '-' }}
			        </view>
			        <view class="name">
			            {{ item.name }}
			        </view>
			    </view>
			</view>
		</view>
		
		<view class="container">
			<template v-if="orderParams.pickCarTimeStart && orderParams.pickCarTimeStart">
				<view class="period-wrap">
					<view class="period-tip">开始日期</view>
					<view class="period-box">
						<view class="line"></view>
					</view>
					<view class="period-tip">结束日期</view>
				</view>
				
				<view class="pick-time-wrap">
					<view>
						<view class="pick-time">
							{{custom.pickCarTimeStart.year}}年{{custom.pickCarTimeStart.month}}月{{custom.pickCarTimeStart.date}}日
							<view class="text-btn" @click="openCalendar">修改</view>
						</view>
					</view>
					
					<view>
						<view class="pick-time">
							{{custom.pickCarTimeEnd.year}}年{{custom.pickCarTimeEnd.month}}月{{custom.pickCarTimeEnd.date}}日
						</view>
					</view>
					
				</view>
				
				<view class="split-line"></view>
			</template>
			
			<view v-else class="custom-item" @click="openCalendar">
				<view class="label">用车日期</view>
				<view class="content">
					<view class="placeholder">请选择用车日期</view>
					<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
				</view>
			</view>
			
			<view class="custom-item" @click="openCityList">
				<view class="label">用车城市</view>
				<view class="content">
					<view v-if="orderParams.cityName" class="value">{{orderParams.cityName}}</view>
					<view v-else class="placeholder">请选择用车城市</view>
					<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">联系人</view>
				<view class="content">
					<u-input
						v-model="orderParams.contactName"
						placeholder="请输入联系人"
					/>
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">联系人手机号</view>
				<view class="content">
					<u-input
						v-model="orderParams.mobile"
						placeholder="请输入手机号"
						type="number"
					/>
				</view>
			</view>
			
			<view class="custom-item">
				<view class="label">预约地址</view>
				<view class="content">
					<u-input
						v-model="orderParams.address"
						placeholder="请输入预约地址"
					/>
				</view>
			</view>
			
			
		</view>
		
		<u-select
			v-model="showCityList" 
			:list="cityList"
			@confirm="confirmCity"
		></u-select>
		
		<u-calendar v-model="showCalendar" mode="range" max-date="2099-12-31" @change="changeCalendar"></u-calendar>
	</view>
</template>

<script>

export default {
	components: {
	  
	},
	
	computed:{
		getValName:function() {
			return (val, field, unit) => {
				if (field === "horsepower") {
				    return val;
				} else if (field === "discharge") {
				  return val ? val + unit : val
				} else {
				    const list = this.conditionData[field] || [];
				    return (list.find(item => String(item.tagValue) === String(val)) || {}).tagName;
				}
			}
		},
		
	},
	
	data() {
		return {
			id: '',
			detail: null,
			bannerList: [],
			infoList: [
			    { name: "燃料形式", val: "-", field: "powerMode",value:'-' },
			    { name: "", val: "-", field: "discharge",value:'-', unit:'' },
			    { name: "驱动方式", val: "-", field: "drive",value:'-' },
			    { name: "马力(Ps)", val: "-", field: "horsepower",value:'-' },
			],
			conditionData: {
			    powerMode: [],
			    discharge: [],
			    drive: [],
			},
			cityList: [],
			showCityList: false,
			showCalendar: false,
			custom: {
				pickCarTimeStart: {
					year: '',
					month: '',
					date: '',
				},
				pickCarTimeEnd: {
					year: '',
					month: '',
					date: '',
				},
			},
			orderParams: {
				cityId: undefined, // 城市ID
				cityName: '', // 城市名称
				pickCarTimeStart: '', // 租车开始日期
				pickCarTimeEnd: '', // 租车结束日期
				contactName: '', // 联系人
				mobile: '', // 手机号
				address: '', // 预约地址
			}
		}
	},
	
	onLoad(option) {
		this.id = option.id
		this.getAllCity()
	},
	
	onShow() {
		this.getDetail()
	},
	
	methods: {
		async getCarTypeConditionData () {
		      uni.showLoading({
		        title: '加载中'
		      });
		      const conditionData = await this.$getRequest(this.$url.getCarTypeCondition, "POST", {});
		      this.conditionData = conditionData.data;
				let newList = this.infoList.map(item => {
					let unit = ''
					if (item.field === 'discharge') {
						if (this.detail.carTypeYearProductEntity.powerMode == 3) {
							unit = 'Kw'
							item.name = 'Kw'
						} else {
							item.name = '排量'
						}
					}
					
					item.value = this.getValName(this.detail.carTypeYearProductEntity[item.field], item.field, unit)
					return item
				})
				this.infoList = newList
		      uni.hideLoading()
		  },
		  
		getDetail() {
			uni.showLoading({
			  title: '加载中'
			});
			this.$getRequest(this.$url.getMemberCarRentalDetail, "GET", {
			  id: this.id,
			}).then(res => {
				uni.hideLoading()
				this.detail = res.data
				this.bannerList = res.data.carTypeYearProductEntity.carTypeYearProductImageList.map(item => item.imageUrl)
				this.getCarTypeConditionData();
			}).catch(() => {
				uni.hideLoading()
			})
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
					}
				})
		},
		
		openCityList() {
			this.showCityList = true
		},
		
		confirmCity(e) {
			this.orderParams.cityId = e[0].value
			this.orderParams.cityName = e[0].label
		},
		
		openCalendar() {
			this.showCalendar = true
		},
		
		changeCalendar(e) {
			console.log('changeCalendar', e)
			this.orderParams.pickCarTimeStart = e.startDate
			this.orderParams.pickCarTimeEnd = e.endDate
			
			this.custom.pickCarTimeStart.year = e.startYear
			this.custom.pickCarTimeStart.month = e.startMonth.toString().padStart(2, '0')
			this.custom.pickCarTimeStart.date = e.startDay.toString().padStart(2, '0')
			
			this.custom.pickCarTimeEnd.year = e.endYear
			this.custom.pickCarTimeEnd.month = e.endMonth.toString().padStart(2, '0')
			this.custom.pickCarTimeEnd.date = e.endDay.toString().padStart(2, '0')
		},
	},
}
</script>

<style lang="scss">
    .banner-header {
        .banner-swiper {
            .u-indicator-item-round {
                width: 32rpx!important;
                height: 8rpx;
            }
        }
    }
</style>
<style lang="scss" scoped>
.wrap {
	.header {
		background: linear-gradient(180deg, rgba(10, 15, 45, 0.16) 36.24%, rgba(255, 255, 255, 0.16) 100%);
		.configure {
		    background: #ffffff;
		    box-shadow: 0px -4px 32px rgba(10, 15, 45, 0.02),
		        0px 4px 24px rgba(10, 15, 45, 0.04);
		    border-radius: 24rpx;
		    margin: 0 32rpx;
		    padding: 16rpx 0;
		    text-align: center;
		    color: rgba(10, 15, 45, 0.8);
		    margin-top: 30rpx;
		    .item {
		        .title {
		            font-size: 24rpx;
		            margin-bottom: 4rpx;
		            font-weight: 500;
		        }
		        .name {
		            font-size: 24rpx;
		            color: rgba(10, 15, 45, 0.5);
		        }
		    }
		}
		.car-info {
		    padding: 0 32rpx;
		    padding-bottom: 10rpx;
		    .brand {
		        .brand-t {
					line-height: 48rpx;
		            font-size: 44rpx;
		            color: #0a0f2d;
		            font-weight: 600;
		        }
			   .brand-year {
				  margin-top: 8rpx;
				  font-size: 36rpx;
				  color: #0a0f2d;
				  line-height: 40rpx;
			   }
			   .m-serfee-title-txt {
			     font-weight: normal;
			     line-height: 22px;
			     color: #000000;
			   }
			   .m-serfee-val-txt {
			     font-weight: 600;
			     line-height: 22px;
			     color: #F5194B;
			   
			   }
		    }
			
		  
		}
	}
	.container {
		padding: 32rpx 32rpx 200rpx;
		.period-wrap {
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
			height: 44rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.label {
				font-size: 30rpx;
				color: #0A0F2D;
				padding-right: 24rpx;
			}
			.content {
				padding: 0;
				width: 0;
				flex: 1;
				display: flex;
				justify-content: flex-end;
				font-size: 28rpx;
				color: rgba(10, 15, 45, 0.8);
				u-input {
					width: 100%;
					height: 44rpx;
				}
				::v-deep .u-input__input {
					flex: 1;
					text-align: right;
					background: transparent;
				}
			}
		
		}
	}
}
</style>