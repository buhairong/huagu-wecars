<template>
    <view>
        <view class="placeOrderInfo">
            <view class="placeOrderInfo-item u-flex">
                <text class="car-icon" />
                <view
                    class="placeOrderInfo-content"
                    @click="handleSendTime(1)"
                >
                    <u-section
                        title="用车时间"
                        sub-title="请选择"
                        :show-line="false"
                    >
                        <template #right>
                            <view class="default-r">
                                <text
                                    v-if="form.sendTime"
                                    class="default-r-text select-r-text"
                                >
                                    {{ form.sendTime }}
                                </text>
                                <text
                                    v-else
                                    class="default-r-text"
                                >
                                    请选择
                                </text>
                                <u-icon name="arrow-right" />
                            </view>
                        </template>
                    </u-section>
                </view>
            </view>

            <view
                v-if="currentTab == 0"
                class="placeOrderInfo-item u-flex"
            >
                <text class="car-icon" />
                <view
                    class="placeOrderInfo-content"
                    @click="handleSendTime(2)"
                >
                    <u-section
                        title="还车时间"
                        sub-title="请选择"
                        :show-line="false"
                    >
                        <template #right>
                            <view class="default-r">
                                <text
                                    v-if="form.returnTime"
                                    class="default-r-text select-r-text"
                                >
                                    {{ form.returnTime }}
                                </text>
                                <text
                                    v-else
                                    class="default-r-text"
                                >
                                    请选择
                                </text>
                                <u-icon name="arrow-right" />
                            </view>
                        </template>
                    </u-section>
                </view>
            </view>
            <view
                v-if="currentTab == 1"
                class="placeOrderInfo-item u-flex"
            >
                <text class="car-icon" />
                <view
                    class="placeOrderInfo-content"
                    @click="dayPicker = true"
                >
                    <u-section
                        title="折扣长租"
                        sub-title="请选择"
                        :show-line="false"
                    >
                        <template #right>
                            <view class="default-r">
                                <text
                                    class="default-r-text select-r-text"
                                >
                                    {{ currentDay }}天
                                </text>
                                <u-icon name="arrow-right" />
                            </view>
                        </template>
                    </u-section>
                </view>
            </view>
            <view
                v-if="update != 1"
                class="placeOrderInfo-item u-flex"
            >
                <text class="car-icon car-icon-1" />
                <view
                    class="placeOrderInfo-content"
                    @click="handleAddress(1)"
                >
                    <u-section
                        :title="`送${checked ? '还' :'' }车地址`"
                        sub-title="请选择"
                        :show-line="false"
                    >
                        <template #right>
                            <view class="default-r u-flex">
                                <text
                                    v-if="addressInfo.send && addressInfo.send.name "
                                    class="default-r-text select-r-text"
                                >
                                    {{ addressInfo.send.name }}
                                </text>
                                <text
                                    v-else
                                    class="default-r-text"
                                >
                                    请选择
                                </text>
                                <u-icon name="arrow-right" />
                            </view>
                        </template>
                    </u-section>
                </view>
            </view>
            <view
                v-if="update != 0 || !checked"
                class="placeOrderInfo-item u-flex"
            >
                <text class="car-icon car-icon-1" />
                <view
                    class="placeOrderInfo-content"
                    @click="handleAddress(2)"
                >
                    <u-section
                        title="还车地址"
                        sub-title="请选择"
                        :show-line="false"
                    >
                        <template #right>
                            <view class="default-r u-flex">
                                <text
                                    v-if="addressInfo.return && addressInfo.return.name "
                                    class="default-r-text select-r-text"
                                >
                                    {{ addressInfo.return.name }}
                                </text>
                                <text
                                    v-else
                                    class="default-r-text"
                                >
                                    请选择
                                </text>
                                <u-icon name="arrow-right" />
                            </view>
                        </template>
                    </u-section>
                </view>
            </view>

            <view
                v-if="update == 0"
                class="placeOrderInfo-address"
            >
                <u-checkbox
                    v-model="checked"
                    size="28"
                    label-size="28"
                    icon-size="22"
                    @change="handleSame"
                >
                    <text class="placeOrderInfo-address-text">
                        还车地址相同
                    </text>
                </u-checkbox>
            </view>
        </view>

        <!-- 订车按钮 -->
        <!-- v-if="useBtn" -->
        <!--  -->
        <view
            v-if="useBtn"
            class="foot-but u-flex u-row-between"
            @click="handleSave"
        >
            <view class="foot-but-r u-flex-1 u-text-center">
                {{ update == 1 ? '修改订单' : '立即订车' }}
                <text class="icon-r" />
            </view>
        </view>

        <datePicker
            ref="dataPicker"
            :value="isDataPicker"
            :current-arr="currentArr"
            @click="handleData"
            @close="handleClose"
        />
        <u-picker
            v-model="dayPicker"
            confirm-color="#0A0F2D"
            mode="selector"
            :default-selector="defaultSelector"
            :range="selector"
            @confirm="handleConfirmDay"
        />
		<u-modal
			class='u-modal'
			v-model="isDetail" 
			:title="title" 
			:content='content' 
			:mask-close-able="true"
			:confirm-text='confirmText'
			@confirm='confirm'
		></u-modal>
		
			<AgreeMentPopup :show.sync="showFirstPageAgreeMentPopup" @agree="handleAgree"/>
    </view>
</template>
<script>
import dayjs from "dayjs"
import { getUserProfile } from '../../../util'
import AgreeMentPopup from '@/pages/agreement/components/AgreeMentPopup.vue'

export default {
    name: "PlaceOrderInfo",
		components: {
		    AgreeMentPopup,
		},
    props: {
        useBtn: {
            type: Boolean,
            default: true
        },
        info: {
            type: Object,
            default: null
        },
        currentTab: {
            type: Number,
            default: 0
        },
        // 修改订单
        update: {
            type: Number,
            default: 0
        },
				place:{
					type: String,
					default:'a'
				},
        changeDays: {
            type: Number,
            default: 0
        },
    },
    data () {
        return {
						showFirstPageAgreeMentPopup: false,
						isDetail:false,//认证弹窗
						content:'身份认证后可用车',
						title:'提示',
						closeOnClickOverlay:false,
						confirmText:'去认证',
            userInfo: null,
            dayPicker: false,
            selector: ['30天', '60天', '90天'],
            defaultSelector: [0],
            currentDay: 30,
            currentArr: [0, 14, 11],
            form: {
                sendTime: '',
                returnTime: '',
                orderDays: '',
                addressInfo: {
                    send: '',
                    return: ''
                }
            },
            isDataPicker: '',
            checked: true,
            addressInfo: {
                send: {},
                return: {}
            }
        };
    },
    watch: {
        isDataPicker: function(val) {
            if(!val) {
                setTimeout(() => {
                    uni.showTabBar({
                    });
                }, 200)
            } else {
                uni.hideTabBar({
                });
            }
        },
        info: function(val) {
            console.log(val);
            this.form.sendTime = dayjs(val.sendTime).format('YYYY-MM-DD HH:mm')
            this.form.returnTime = dayjs(val.returnTime).format('YYYY-MM-DD HH:mm')
            this.form.addressInfo.send = val.addressInfo.send
            this.addressInfo.send = val.addressInfo.send
            this.addressInfo.return = val.addressInfo.return
            this.form.addressInfo.return = val.addressInfo.return

            if(val.addressInfo.send.name != val.addressInfo.return.name) {
                this.checked = false
            }
        },
        update: function(val) {
            console.log(val)
            if(val == 1) {
                this.checked = false
            }
        },
        changeDays: function(val) {
          if((val > 0) && (this.form.sendTime != '')) {
            this.form.returnTime = dayjs(this.form.sendTime).add(val, 'day').format('YYYY/MM/DD HH:mm')
          } 
        },
    },
    onLoad () {
    },
    
    mounted() {

    },
    methods: {   
		confirm(){//去认证
			console.log(this.place,'thiss');
			if(this.place=='a'){
				uni.setStorageSync("confirmRouter",'/pages/home/profile/index')
			}else{
				uni.setStorageSync("confirmRouter",'/pages/ordered/place-order')
				uni.setStorageSync("option",'')
			}
			this.$u.route("/pages/mine/identity/identity")
			// uni.setStorageSync("confirmRouter",'/pages/home/profile/index')
		},
        handleConfirmDay(day) {
            this.defaultSelector = day;
            this.currentDay = this.selector[day[0]].replace('天', '');
        },
				handleAgree() {
					this.getLocation()
				},
        handleSave() {
						
						const value = uni.getStorageSync('isAgreeFirstPagePrivacy');
						console.log('value', value)
						if (!value) {
							this.showFirstPageAgreeMentPopup = true
							return
						}
					
					
					
					
            // currentTab  == 1 长租

            uni.vibrateShort({})
            if(!getApp().globalData.userInfo) {
                getUserProfile("/pages/ordered/place-order", () => {
                    this.$u.route("/pages/sign/sign");
                });
                return false;
            }
            
            console.log(getApp().globalData.userInfo)
            if(getApp().globalData.userInfo.riskAuditStatus != 1 && getApp().globalData.userInfo.riskAuditStatus  != 5) {
                //s
				// this.isDetail=true
				
                uni.showModal({
                    title: '提示',
                    content: '身份认证后可用车',
					cancelText:"取消",
                    confirmText: '去认证',
                    success: (res) => {
                        if(res.confirm) {
							if(this.place=='a'){
								uni.setStorageSync("confirmRouter",'/pages/home/profile/index')
							}else{
								uni.setStorageSync("confirmRouter",'/pages/ordered/place-order')
								uni.setStorageSync("option",'')
							}
							this.$u.route("/pages/mine/identity/identity")
                        }
                    }
                });
                return false;
            }

            if(!this.form.sendTime) {
                uni.showToast({
                    title: '请选择用车时间',
                    duration: 2000,
                    icon: 'none'
                });
                return false
            }
            if(!this.form.returnTime && this.currentTab != 1) {
                uni.showToast({
                    title: '请选择还车时间',
                    duration: 2000,
                    icon: 'none'
                });
                return false
            }
            if(!this.addressInfo.send.name) {
                uni.showToast({
                    title: '请选择送车地址',
                    duration: 2000,
                    icon: 'none'
                });
                return false
            }
            if(!this.addressInfo.return.name) {
                uni.showToast({
                    title: '请选择还车地址',
                    duration: 2000,
                    icon: 'none'
                });
                return false
            }
            if(this.currentTab == 1) {
                this.form.returnTime = dayjs(this.form.sendTime).add(this.currentDay, 'day').format('YYYY-MM-DD HH:mm')
            }
            if(this.update) {
                this.form.update = 1;
            }
            
            this.$emit('click', this.form);
        },
        handleSame(option) {
            uni.vibrateShort({})
            if(option.value) {
                this.addressInfo.return = this.addressInfo.send;
            }
            
        },
        handleAddress(type) {
            uni.vibrateShort({})
            if(type == 1 && this.update == 1) {
                uni.showToast({
                    title: '当前状态不能修改送车地址',
                    duration: 2000,
                    icon: 'none'

                });
                return false
            }
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
                                uni.chooseLocation({
                                    latitude: res.latitude,
                                    longitude: res.longitude,
                                    success: (result) => {
                                        if(type == 1) {
                                            this.addressInfo.send = result
                                            this.form.addressInfo = this.addressInfo;
                                            if(this.checked) {
                                                this.addressInfo.return = result;
                                            }
                                        } else {
                                            this.addressInfo.return = result
                                            this.form.addressInfo = this.addressInfo;
                                        }
                                        console.log(result)
                                    }
                                })
                            }
                        })
                    }
                }
            })
            // return false;
          
        },     
        // val  1: 送车 2: 还车
        handleSendTime(val) {
            uni.vibrateShort({})
            this.isDataPicker = val;
            const startTime = this.form.sendTime || new Date();
            const endTime = this.form.returnTime || new Date();
            this.$nextTick(() => {
                this.currentArr = this.daysCurrentArr(val == 1 ? startTime : endTime);
            })
        },
        daysBetween(start, end) {
            return (Date.parse(start) - Date.parse(end)) / (1 * 24 * 60 * 60 * 1000)
        },
        daysCurrentArr( date) {
        
            const dayList = this.$refs.dataPicker.filter.day;
            let dayIndex = 0,
                hourIndex = 0,
                minIndex = 0;
            for(let i = 0; i < dayList.length; i++) {
                if(dayList[i]) {
                    if(dayjs(`${dayList[i].year}/${dayList[i].month}/${dayList[i].day}`).format('YYYY/MM/DD') == dayjs(date).format('YYYY/MM/DD')) {
                        dayIndex = i;
                        hourIndex = dayList[i].hour.indexOf(Number(dayjs(date).format('HH')));
                        minIndex = dayList[i].minute.indexOf(Math.ceil(Number(dayjs(date).format('mm')) / 5) * 5 )
                    }
                }
                
            }

            return [dayIndex, hourIndex, minIndex]
        },
        // 确定
        handleData (value) {
            this.data = value;
            if(this.isDataPicker == 1) {
                this.form.sendTime = value.day
                if(this.changeDays > 0) {
                  this.form.returnTime = dayjs(this.form.sendTime).add(this.changeDays, 'day').format('YYYY/MM/DD HH:mm')
                }
            } else {
                this.form.returnTime = value.day;
                if(this.changeDays > 0) {
                  this.form.sendTime = dayjs(this.form.returnTime).subtract(this.changeDays, 'day').format('YYYY/MM/DD HH:mm')
                }
            }
            
            this.isDataPicker = '';
        },
        handleClose () {
            this.isDataPicker = '';
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
	.u-modal{
		margin-top: -200px;
	}
.placeOrderInfo {
    padding: 0 40rpx;
    .placeOrderInfo-item {
        position: relative;
        padding: 26rpx 0;
        height: 112rpx;
        border-bottom: 1px solid #eeeeee;
        .car-icon {
            width: 32rpx;
            height: 32rpx;
            background: url("https://image.51cheyaoshi.com/xcx/app/static/time.png") no-repeat;
            background-size: 100%;
            display: inline-block;
            margin-right: 16rpx;
        }
        .car-icon-1 {
            background: url("https://image.51cheyaoshi.com/xcx/app/static/address.png") no-repeat;
            background-size: 100%;
        }
        .default-r {
            text-align: right;
            &-text {
                margin-right: 12rpx;
                font-size: 28rpx;
            }
            .select-r-text {
                color: rgba(10, 15, 45, 0.8);
                font-weight: 500;
            }
        }
        .placeOrderInfo-content {
            flex: 1;
        }
    }

    &-address {
        padding: 24rpx 0 0rpx 0;
        &-text {
            height: 40rpx;
            font-style: normal;
            font-weight: normal;
            font-size: 28rpx;
            line-height: 40rpx;
            color: rgba(0, 0, 0, 0.5);
            mix-blend-mode: normal;
            opacity: 0.9;
        }
    }
}
</style>
<style lang="scss">
.car-box-address {
    .u-checkbox {
        height: 40rpx!important;
    }
}
</style>

    