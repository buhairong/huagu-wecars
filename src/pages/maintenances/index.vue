<!--
 * @Author: your name
 * @Date: 2021-12-05 19:27:00
 * @LastEditTime: 2022-01-24 14:31:35
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-wecars/src/pages/maintenances/index.vue
-->
<template>
    <view class="maintenances">
        <!-- <view
            class="status-bar"
            :style="{ height: custom.top + 'px' }"
        /> -->
        <!-- <view class="u-flex">
            <view class="u-padding-left-22">
                <u-icon
                    name="arrow-left"
                    size="34"
                    color="#000"
                />
            </view>
            
            <view class="tabbar-tab u-padding-left-40">
                <u-tabs
                    :list="list"
                    :current="current"
                    active-color="#000"
                    gutter="40"
                    inactive-color="#000000c9"
                    font-size="34"
                    @change="handleTab"
                />
            </view>
        </view> -->
        <view class="maintenances-content">
            <template v-if="carList.length">
                <view
                    class="u-padding-top-24"
                >
                    <u-image
                        width="100%"
                        height="280rpx"
                        :src="carInfo.carImage"
                    >
                        <u-loading slot="loading" />
                    </u-image>
                </view>
            </template>
            <template v-else>
                <view
                    class="u-padding-top-24"
                    @click="handleAddCar"
                >
                    <u-image
                        width="100%"
                        height="280rpx"
                        class="bitmap"
                        src="https://image.51cheyaoshi.com/xcx/app/static/yc_1.png"
                    >
                        <u-loading slot="loading" />
                    </u-image>
                </view>
            </template>
            
            <template v-if="carInfo">
                <view class="u-flex u-margin-top-16">
                    <view class="brand u-font-40 fw">
                        {{ carInfo.carBrand || '-' }} {{ carInfo.carType || '-' }} {{ carInfo.carTypeYear || '-' }}
                    </view>
                    <view
                        class="switch-car u-margin-left-16"
                        @click="isSwitchCar = true"
                    >
                        <u-image
                            width="24rpx"
                            height="24rpx"
                            class="switch-icon"
                            src="https://image.51cheyaoshi.com/xcx/app/static/yc_car_icon1.png"
                        >
                            <u-loading slot="loading" />
                        </u-image>切换
                    </view>
                    <!-- <view class="u-margin-left-40">
                        <u-image
                            width="45rpx"
                            height="45rpx"
                            src="https://image.51cheyaoshi.com/xcx/app/static/yc_car_icon2.png"
                        >
                            <u-loading slot="loading" />
                        </u-image>
                    </view> -->
                </view>
                <view class="brand-type u-font-40 u-padding-top-8">
                    {{ carInfo.carTypeYearProduct || '-' }}
                </view>
                <view class="u-flex tag-list u-margin-top-16"> 
                    <view class="tag-item">
                        {{ carInfo.userCarEntity.carPlateNum || '-' }}
                    </view>
                    <view
                        v-if="carInfo.regDateStr"
                        class="tag-item"
                    >
                        <u-image
                            width="30rpx"
                            height="30rpx"
                            class="tag-item-icon"
                            src="https://image.51cheyaoshi.com/xcx/app/static/time.png"
                        >
                            <u-loading slot="loading" />
                        </u-image>{{ carInfo.regDateStr }}
                    </view>
                    <view class="tag-item">
                        <u-image
                            width="30rpx"
                            height="30rpx"
                            class="tag-item-icon"
                            src="https://image.51cheyaoshi.com/xcx/app/static/yc_car_icon3.png"
                        >
                            <u-loading slot="loading" />
                        </u-image>{{ carInfo.mileageStr || '-' }}
                    </view>
                <!-- <view class="tag-item">
                    <u-image
                        width="30rpx"
                        height="30rpx"
                        class="tag-item-icon"
                        src="https://image.51cheyaoshi.com/xcx/app/static/yc_car_icon4.png"
                    >
                        <u-loading slot="loading" />
                    </u-image>行驶证
                </view> -->
                </view>
                <view class="u-flex u-text-center u-margin-top-48">
                    <view
                        v-for="(item, index) in tabIcon"
                        :key="index"
                        class="u-flex-1"
                        @click="handleTabIcon(index)"
                    >
                        <view class="yc-icon">
                            <u-image
                                width="60rpx"
                                height="60rpx"
                                :src="item.icon"
                            >
                                <u-loading slot="loading" />
                            </u-image>
                        </view>
                        <view class="u-font-24">
                            {{ item.name }}
                        </view>
                    </view>
                </view>
            </template>
            <view class="u-margin-top-48">
                <!-- <view class="card">
                    <view class="color fw u-font-30">
                        年检提醒
                    </view>
                    <view
                        v-if="carList.length == 0"
                        class="card-content"
                    >
                        <view class="not-data">
                            无车辆信息
                        </view>
                    </view>
                    <view v-else>
                        <view>
                            {{ carInfo.lastYearlyInspectionDate || '-' }}
                        </view>
                        <view
                            class="u-text-center u-padding-top-20 u-padding-bottom-20"
                            @click="handleAddCarInfo"
                        >
                            <view
                                class="add-icon"
                            >
                                <u-image
                                    width="100%"
                                    height="100%"
                                    src="https://image.51cheyaoshi.com/xcx/app/static/add_icon.png"
                                >
                                    <u-loading slot="loading" />
                                </u-image>
                            </view>添加车辆信息
                        </view>
                    </view>
                </view> -->
                <view class="card">
                    <view class="color fw u-font-30">
                        续保提醒 <text
                            v-if="carInfo.nextTimeInsuranceStr"
                            class="u-padding-left-20"
                        >
                            ( 剩余：{{ carInfo.nextTimeInsuranceStr || '' }})
                        </text>
                    </view>
                    <view
                        v-if="carList.length == 0"
                        class="card-content"
                    >
                        <view class="not-data">
                            无保单信息
                        </view>
                    </view>
                    <view v-else>
                        <view v-if="carInfo && carInfo.lastInsuranceDate">
                            <view class="u-padding-left-50 u-padding-right-50 u-padding-top-40 u-padding-bottom-10">
                                <u-line-progress
                                    active-color="#0a0f2c"
                                    :percent="carInfo.insuranceUpdateRate * 100"
                                />
                            </view>
                            <view class="u-flex u-row-between u-font-24">
                                <view>
                                    下次 {{ carInfo.nextInsuranceDate.substring(0, 11) || '-' }}
                                </view>
                                <view>
                                    上次 {{ carInfo.lastInsuranceDate.substring(0, 11) || '-' }}
                                </view>
                            </view>
                        </view>
                        <view
                            class="u-text-center u-padding-top-20 u-padding-bottom-20"
                            @click="handleUpdateInsurance"
                        >
                            <view
                                class="add-icon"
                            >
                                <u-image
                                    width="100%"
                                    height="100%"
                                    src="https://image.51cheyaoshi.com/xcx/app/static/add_icon.png"
                                >
                                    <u-loading slot="loading" />
                                </u-image>
                            </view>添加保单信息
                        </view>
                    </view>
                </view>
                <view class="card">
                    <view class="color fw u-font-30">
                        保养提醒 <text
                            v-if="carInfo.nextTimeMaintainStr"
                            class="u-padding-left-20"
                        >
                            ( 剩余：{{ carInfo.nextTimeMaintainStr || '' }})
                        </text>
                    </view>
                    <view
                        v-if="carList.length == 0"
                        class="card-content"
                    >
                        <view class="not-data">
                            无保养信息
                        </view>
                    </view>
                    <view v-else>
                        <view v-if="carInfo && carInfo.lastMaintainDate">
                            <view class="u-padding-left-50 u-padding-right-50 u-padding-top-40 u-padding-bottom-10">
                                <u-line-progress
                                    active-color="#0a0f2c"
                                    :percent="carInfo.maintainUpdateRate * 100"
                                />
                            </view>
                            <view class="u-flex u-row-between u-font-24">
                                <view>
                                    下次 {{ carInfo.nextMaintainDate.substring(0, 11) || '-' }}
                                </view>
                                <view>
                                    上次 {{ carInfo.lastMaintainDate.substring(0, 11) || '-' }}
                                </view>
                            </view>
                        </view>
                        <view
                            class="u-text-center u-padding-top-20 u-padding-bottom-20"
                            @click="handleUpdateMaintain"
                        >
                            <view
                                class="add-icon"
                            >
                                <u-image
                                    width="100%"
                                    height="100%"
                                    src="https://image.51cheyaoshi.com/xcx/app/static/add_icon.png"
                                >
                                    <u-loading slot="loading" />
                                </u-image>
                            </view>添加保养信息
                        </view>
                    </view>
                </view>
                <view class="card">
                    <view class="color fw u-font-30">
                        轮胎健康
                    </view>
                    <view
                        v-if="carList.length == 0"
                        class="card-content"
                    >
                        <view class="not-data">
                            无轮胎信息
                        </view>
                    </view>
                    <view v-else>
                        <view
                            v-if="carInfo && carInfo.userCarTyreEntity"
                            class="u-padding-top-30 u-padding-left-30"
                        >
                            <view class="u-padding-20">
                                左前: {{ carInfo.userCarTyreEntity.leftFrontTireUpdateTime.substr(0, 11) || '' }} {{ carInfo.userCarTyreEntity.leftFrontTireUpdateMileage }}公里
                            </view>
                            <view class="u-padding-20">
                                左后: {{ carInfo.userCarTyreEntity.leftRearTireUpdateTime.substr(0, 11) || '' }} {{ carInfo.userCarTyreEntity.leftRearTireUpdateMileage }}公里
                            </view>
                            <view class="u-padding-20">
                                右前: {{ carInfo.userCarTyreEntity.rightFrontTireUpdateTime.substr(0, 11) || '' }} {{ carInfo.userCarTyreEntity.rightFrontTireUpdateMileage }}公里
                            </view>
                            <view class="u-padding-20">
                                右后: {{ carInfo.userCarTyreEntity.rightRearTireUpdateTime.substr(0, 11) || '' }} {{ carInfo.userCarTyreEntity.rightRearTireUpdateMileage }}公里
                            </view>
                        </view>
                        <view
                            class="u-text-center u-padding-top-20 u-padding-bottom-20"
                            @click="handleUpdateTyre"
                        >
                            <view
                                class="add-icon"
                            >
                                <u-image
                                    width="100%"
                                    height="100%"
                                    src="https://image.51cheyaoshi.com/xcx/app/static/add_icon.png"
                                >
                                    <u-loading slot="loading" />
                                </u-image>
                            </view>添加轮胎信息
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <u-gap
            margin-top="100"
            height="100"
            bg-color="#FFF"
        />
        <u-popup
            v-model="isSwitchCar"
            :safe-area-inset-bottom="true"
            mode="center"
            width="90%"
            border-radius="14"
            :closeable="true"
        >
            <view class="u-padding-48">
                <view class="u-text-center u-font-30 u-padding-bottom-30">
                    请选择爱车
                </view>
                <view
                    v-for="(item, index) in carList"
                    :key="index"
                    class="u-relative u-padding-top-28 u-border-bottom u-padding-bottom-28"
                    @click="handleSwitch(index)"
                >
                    <view class="u-font-30">
                        {{ item.carType }} ({{ item.carPlateNum }})
                    </view>
                    <view
                        v-if="carIndex == index"
                        class="car-checkbox"
                    >
                        <u-icon
                            name="checkbox-mark"
                            color="#0AEB7D"
                            size="36"
                        />
                    </view>
                </view>
                <view
                    class="add-car"
                    @click="handleAddCar"
                >
                    添加爱车
                </view>
            </view>
        </u-popup>
				
				<AgreeMentPopup :show.sync="showFirstPageAgreeMentPopup" @agree="handleAgree"/>
    </view>
</template>

<script>
import AgreeMentPopup from '@/pages/agreement/components/AgreeMentPopup.vue'

const app = getApp();
export default {
    name: "MainTenances",
		components: {
		    AgreeMentPopup,
		},
    data() {
        return {
						showFirstPageAgreeMentPopup: false,
            isSwitchCar: false,
            custom: app.globalData.custom,
            userInfo: null,
            current: 0,
            list: [{
                name: '爱车'
            }, {
                name: '门店'
            }, {
                name: '商城',
            }],
            tabIcon: [
                {name: '健康报告', icon: 'https://image.51cheyaoshi.com/xcx/app/static/yc_2.png'},
                // {name: '附近门店', icon: 'https://image.51cheyaoshi.com/xcx/app/static/yc_3.png'},
                {name: '爱车估价', icon: 'https://image.51cheyaoshi.com/xcx/app/static/yc_4.png'},
                // {name: '商城', icon: 'https://image.51cheyaoshi.com/xcx/app/static/yc_5.png'}
            ],
            carList: [],
            carInfo: null,
            carIndex: 0,
        }
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
            this.init();
          
        })
        
    },
    methods: {
				handleAgree() {
					this.isSwitchCar = false;
					this.$u.route('/pages/maintenances/add-car')
					this.getLocation()
				},
        async init() {
            
            const { data } = await this.$getRequest(this.$url.getMyCars, 'POST', {
                userId: this.userInfo.id,
            })
            this.carList = data;
            this.getCarInfo();
        },
        handleAddCarInfo() {
            this.$u.route('/pages/maintenances/add-car')
        },
        handleUpdateInsurance() {
            this.$u.route('/pages/maintenances/add-insurance', {
                id: this.carList[this.carIndex].id
            })
        },
        handleUpdateMaintain() {
            this.$u.route('/pages/maintenances/add-maintain', {
                id: this.carList[this.carIndex].id
            })
        },
        handleUpdateTyre() {
            this.$u.route('/pages/maintenances/add-tyre', {
                id: this.carList[this.carIndex].id
            })
        },
        handleSwitch(index) {
            this.carIndex = index
            this.getCarInfo();
            this.isSwitchCar = false;
            uni.vibrateShort({})
        },
        handleAddCar() {
					try {
						const value = uni.getStorageSync('isAgreeFirstPagePrivacy');
						console.log('value', value)
						if (value) {
							this.isSwitchCar = false;
							this.$u.route('/pages/maintenances/add-car')
						} else {
							this.showFirstPageAgreeMentPopup = true
						}
					} catch (e) {
						// error
					}
					
					
					
        },
        async getCarInfo() {
            // uni.showLoading({
            //     title: '加载中'
            // });
            const { data } = await this.$getRequest(this.$url.getMyCarInfo, 'POST', {
                userCarId: this.carList[this.carIndex].id
            })
            uni.hideLoading();
            this.carInfo = data;
        },
        handleTabIcon(index) {
            if(index == 0) {
                this.$u.route('/pages/maintenances/report')
                return false;
            }
            // if(index == 1) {
            //     this.$u.route('/pages/carlife/list')
            //     return false;
            // }
            uni.showToast({
                title: '敬请期待',
                duration: 2000,
                icon: 'none'
            });
        },
        handleTab(index) {
          // console.log(index)
          // this.current = index
        },
				
				getLocation() {
					uni.getLocation({
				    type: 'wgs84',
				    success: async (res) => {
				      console.log('getLocation', res)
							uni.setStorageSync("locationAddress", res.result)
				    },
				    fail: async (err) =>{
							console.log('fail', err)
				    }
				  });
				},
    }
};
</script>
<style lang="scss" scoped>
.maintenances {
    .maintenances-content {
        padding: 0 32rpx;
        .bitmap {
            border-radius: 25rpx;
            border: 2rpx #000 dashed;
            width: 100%;
            display: block;
        }
        .yc-icon {
            width: 96rpx;
            height: 96rpx;
            background: #FFFFFF;
            box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.04);
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            margin-bottom: 16rpx;
        }
        .card {
            background: #FFFFFF;
            box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.06);
            border-radius: 12px;
            padding: 32rpx;
            margin-bottom: 24rpx;
            .card-content {
                padding-top: 30rpx;
                padding-bottom: 20rpx;
                .not-data {
                    color: rgba(10, 15, 45, 0.5);
                    text-align: center;
                }
            }
        }
        .tag-item {
            background: rgba(10, 15, 45, 0.04);
            border-radius: 4px;
            padding: 4rpx 10rpx;
            margin: 0 6rpx;
            .tag-item-icon {
                display: inline-block;
                vertical-align: middle;
                padding-right: 2rpx;
                margin-top: -4rpx;
            }

        }
        .switch-car {
            background: rgba(10, 15, 45, 0.8);
            border-radius: 4px;
            padding: 4rpx 10rpx;
            color: #fff;
            .switch-icon {
                display: inline-block;
                padding-right: 8rpx;
            }
        }
    
        .brand-type {
            color: rgba(10, 15, 45, 0.8);
        }
    }
    .add-car {
        background: rgba(10, 15, 45, 0.04);
        border-radius: 8px;
        padding: 16rpx 0;
        text-align: center;
        font-size: 30rpx;
        margin-top: 24rpx;
    }
    .car-checkbox {
        position: absolute;
        right: 0;
        top: 25rpx;
        z-index: 1;
    }
    .add-icon {
        width: 40rpx;
        height: 40rpx;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10rpx;
    }
    
}
.tabbar-tab ::v-deep .u-tab-item {
    font-weight: bold;
}
</style>