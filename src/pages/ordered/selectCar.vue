<!--
 * @Author: your name
 * @Date: 2021-11-14 15:31:25
 * @LastEditTime: 2022-01-16 13:16:43
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-wecars/src/pages/pick-car/search/list.vue
-->
<template>
    <view class="selectCar">
        <view class="selectCar-info">
            <view class="selectCar-info-use u-flex u-row-between">
                <view class="row-left">
                    <text class="time-left">
                        {{ sendInfo }}
                    </text>
                    <text class="time-center">
                        |
                    </text>
                    <text class="time-right">
                        用车
                    </text>
                </view>

                <u-tag
                    class="row-right"
                    :text="`共${ orderDays }天`"
                    shape="circle"
                    mode="dark"
                    color="rgba(10, 15, 45, 0.8)"
                    bg-color="rgba(10, 15, 45, 0.08)"
                />
            </view>
            <view class="selectCar-info-back u-flex u-row-between">
                <view class="row-left">
                    <text class="time-left">
                        {{ returnInfo }}
                    </text>
                    <text class="time-center">
                        |
                    </text>
                    <text class="time-right">
                        还车
                    </text>
                </view>
                <!-- <view
                    class="update-content row-right"

                    @click="openPopup"
                >
                    <text class="">
                        修改内容
                    </text>
                    <u-icon
                        name="arrow-down-fill"
                        size="18"
                        class="icon"
                        color="#808292"
                    />
                </view> -->
            </view>
        </view>

        <!-- 车型tabs -->
        <view class="selectCar-models">
            <!-- <scroll-view
                class="selectCar-models-scroll"
                scroll-x
            >
                <u-tag
                    v-for="modelItem in modelList"
                    :key="modelItem.name"
                    :text="modelItem.name"
                    shape="circle"
                    class="item"
                    mode="plain"
                    color="rgba(10, 15, 45, 0.8)"
                    border-color="rgba(10, 15, 45, 0.3)"
                    bg-color="#fff"
                    @close="tagClick"
                />
            </scroll-view> -->

            <!-- <view class="selectCar-models-stock">
                <u-checkbox 
                    v-model="checked" 
                    size="28"
                    label-size="28"
                    icon-size="22"
                >
                    <text class="selectCar-models-stock-text">
                        有库存
                    </text>
                </u-checkbox>
            </view> -->
        </view>

        <!-- 列表 -->
        <view class="selectCar-list"> 
            <view
                v-for="(carItem, index) in carList"
                :key="index"
                class="item u-flex u-border-bottom"
                @click="handleUsed(carItem)"
            >
                <!-- 左 -->
                <view class="item-img">
                    <u-image
                        width="100%"
                        height="88rpx"
                        :src="carItem.imageUrl"
                    />
                </view>

                <!-- 中 -->
                <view class="item-center u-flex-1">
                    <view class="item-center-name dsh-ellipsis">
                        {{ carItem.carBrand }}
                    </view>
                    <view class="item-center-model dsh-ellipsis">
                        {{ carItem.carTypeYear + ' ' + carItem.carTypeYearProduct }}
                    </view>
                </view>

                <!-- 右 -->
                <view class="item-right">
                    <view class="item-right-price">
                        {{ carItem.price }}元/天
                    </view>
                    <view class="u-flex u-row-right">
                        <view
                            class="item-right-but u-flex u-col-center u-row-center"
                            @click="goPage(carItem)"
                        >
                            <text class="item-right-but-text">
                                去下单
                            </text>
                            <text class="icon-r" />
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 弹出框 -->
        <!-- <view class="selectCar-picker">
            <u-popup
                v-model="showPoup"
                mode="bottom"
                border-radius="14"
                @close="closeCall"
            >
                <view class="selectCar-picker-top u-text-center">
                    请选择要修改的时间及地址
                </view>

                <view class="selectCar-picker-info">
                    <place-order-info
                        :info="usedOrderData"
                        :update="update"
                        @click="handleSave"
                    />
                </view>
            </u-popup>
        </view> -->
    </view>
</template>

<script>
// import PlaceOrderInfo from "./common/placeOrderInfo.vue";
import dayjs from 'dayjs'
export default {
    name: 'SelectCar',
    components: {
        // PlaceOrderInfo
    },
    data() {
        return {
            checked: false,
            weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            modelList: [
                {
                    name: "全部",
                },
                {
                    name: "SUV",
                },
                {
                    name: "SUV",
                },
                {
                    name: "MPV",
                },
                {
                    name: "MPV",
                },
                {
                    name: "MPV",
                },
                {
                    name: "MPV",
                },
                {
                    name: "MPV",
                },
            ],
            carList: [],
            showPoup: false,
            sendInfo: null,
            returnInfo: null,
            usedOrderData: null,
            userInfo: null,
            orderDays: '',
            update: '',
            id: '',
        };
    },
    onLoad(option) {
        const usedOrderData = uni.getStorageSync('usedOrderData');
        this.usedOrderData = usedOrderData;
        this.orderDays = usedOrderData.orderDays
       
        this.sendInfo = this.initDate(usedOrderData.sendTime)
        this.returnInfo = this.initDate(usedOrderData.returnTime)
        
        if(option) {
            this.update = option.update || 0;
            this.id =  option.id || ''
        }

        this.init();
        
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
        })
    },
    methods: {
        async handleUsed(item) {
            uni.vibrateShort({})
            uni.showLoading({
                title: '订单创建中'
            });
            const result = await this.$getRequest(this.$url.createOrder, 'POST', {
                "cityId": uni.getStorageSync("cityId"),
                "carTypeYearProductId": item.id,
                "createdBy": this.userInfo.createdBy,
                "orderEndTime": this.usedOrderData.returnTime+":00",
                "orderFrom": 0,
                "orderStartTime": this.usedOrderData.sendTime+":00",
                "returnAddress": this.usedOrderData.addressInfo.send.name,
                "sendAddress": this.usedOrderData.addressInfo.return.name,
                "userId": this.userInfo.id
            })
            
            if(result.code != '0') {
                uni.showToast({
                    title: result.msg,
                    duration: 2000,
                    icon: 'none'
                });
                return false;
            }
            uni.hideLoading()
            uni.showToast({
                title: '订单创建成功',
                duration: 2000
            });
            this.$u.route(`/pages/ordered/order-info?id=${result.data.id}`)
            console.log(result)
        },
        initDate (times) {
            const date = dayjs(times).format('MM月DD日');
            const week = this.weeks[dayjs(times).get('day')]
            const time = dayjs(times).format('HH:mm');
            return `${date}（${week}）${time}`;
        },
        async init() {
            // this
            const result = await this.$getRequest(this.$url.daysProduct, 'POST', {
              "cityId": uni.getStorageSync("cityId"),
            })
            this.carList = result.data.records;
            console.log(result)
        },
        // 跳转下单页
        goPage () {
            this.$u.route({
                url: "pages/ordered/rentalCarOrder"
            })
        },
        // 打开模态框
        openPopup () {
            this.showPoup = true;
        },

        /* 弹出框 */
        closeCall () {

        },
        // 点击取消
        clickCancel () {
            this.showPoup = false;
        },
        // 点击完成
        clickSave () {
            this.showPoup = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.selectCar {
    padding: 0;
    .update-content {
        position: relative;
        padding-right: 28rpx;
        .icon {
            position: absolute;
            right: 0%;
            bottom: 5rpx;
            z-index: 1;
            transform: rotate(308deg);
        }
    }
    &-info {
        padding: 16rpx 32rpx;
        background: rgba(10, 15, 45, 0.04);
        &-use,
        &-back {
            line-height: 40rpx;
            font-size: 24rpx;
            color: rgba(10, 15, 45, 0.8);

            .time {
                &-left {
                    
                }
                &-center {
                    margin: 0rpx 10rpx;
                }
                &-right {
                }
            }
        }
        &-use {
            padding-bottom: 4rpx;
        }
    }

    &-models {
        padding: 0rpx 40rpx;
        position: relative;
        &-scroll {
            width: 100%;
            padding: 32rpx 176rpx 16rpx 0rpx;
            overflow: hidden;
            white-space: nowrap;
            .item {
                padding: 0rpx;
                padding-right: 20rpx;
            }
        }
        &-stock {
            position: absolute;
            right: 40rpx;
            top: 0rpx;
            width: 136rpx;
            padding: 32rpx 0rpx 16rpx 0rpx;
            background-color: #ffffff;
            text-align: right;
            font-size: 24rpx;
            color: rgba(10, 15, 45, 0.8);
            overflow: hidden;
            z-index: 2;
            &-text {
                font-size: 28rpx;
            }
        }
    }

    &-list {
        padding: 16rpx 40rpx;
        .item {
            height: 160rpx;
            padding: 42rpx 0rpx 28rpx;
            &-img {
                width: 204rpx;
            }
            &-center {
                min-width: 100px;
                padding: 0rpx 10rpx 0rpx 24rpx;
                &-name {
                    font-size: 30rpx;
                    line-height: 44rpx;
                    color: rgba(10, 15, 45, 0.8);
                    padding-bottom: 6rpx;
                    font-weight: 500;
                }
                &-model {
                    font-size: 24rpx;
                    line-height: 40rpx;
                    color: rgba(10, 15, 45, 0.8);
                }
            }
            &-right {
                width: 150rpx;
                text-align: right;
                &-price {
                    font-style: normal;
                    font-weight: 500;
                    font-size: 28rpx;
                    line-height: 44rpx;
                    color: #F51A4E;
                    margin-bottom: 10rpx;
                }
                &-but {
                    width: 112rpx;
                    height: 44rpx;
                    background: #0A0F2D;
                    border-radius: 8rpx;
                    &-text {
                        font-size: 20rpx;
                        line-height: 36rpx;
                        color: #FFFFFF;
                    }
                    .icon-r {
                        width: 16rpx;
                        height: 16rpx;
                        margin-left: 10rpx;
                    }
                }
            }
        }
    }

    &-picker {
        &-top {
            height: 128rpx;
            line-height: 128rpx;
            font-size: 30rpx;
            color: rgba(0, 0, 0, 0.9);
            mix-blend-mode: normal;
            opacity: 0.9;
        }

        &-info {
            padding-bottom: 124rpx;
        }

        .picker-btu {
            padding: 64rpx 0;
            .btu-s {
                width: 216rpx;
                padding: 16rpx 0;
                font-size: 34rpx;
                background: rgba(10, 15, 45, 0.04);
                border-radius: 8rpx;
                text-align: center;
                margin: 0 16rpx;
                color: rgba(10, 15, 45, 0.8);
            }
            .btu-save {
                color: #fff;
                background: #0A0F2D;
            }
        }
    }
}
</style>
<style lang="scss">
.selectCar {
    .selectCar-models {
        &-scroll {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            .item {
                .u-tag {
                    padding: 6rpx 22rpx;
                    border-radius: 38rpx;
                    line-height: 44rpx;
                    font-size: 28rpx;
                }
            }
        }

        &-stock {
            .u-checkbox {
                height: 60rpx;
            }
            .u-checkbox__label {
                margin: 0rpx 0rpx 0rpx 8rpx;
            }
        }
    }
}
</style>