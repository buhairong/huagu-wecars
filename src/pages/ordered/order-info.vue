

<template>
    <view
        v-if="orderInfo"
        class="order-info u-margin-bottom-200"
    >
        <view class="card-car-info">
            <view class="order-model u-flex">
                <view class="order-model-img">
                    <u-image
                        width="100%"
                        height="100%"
                        :src="orderInfo.carTypeYearProductEntity.imageUrl"
                    />
                </view>
                <view class="order-model-info">
                    <view class="brand">
                        {{ orderInfo.carTypeYearProductEntity.carBrand }}
                        {{ orderInfo.carTypeYearProductEntity.carType }}
                    </view>
                    <view class="model">
                        {{ orderInfo.carTypeYearProductEntity.carTypeYearProduct }}
                    </view>
                </view>
                <view class="status">
                    {{ orderInfo.orderEntity.status | orderText }}
                    <u-count-down
                        v-if="orderInfo.orderEntity.status == 0"
                        class="count-down"
                        :timestamp="orderInfo.closeOrderTime"
                        :show-hours="false"
                    />
                </view>
            </view>
            <view class="order-date-info u-flex">
                <view class="u-flex-1">
                    <view class="order-date">
                        {{ startInfo.date }}
                    </view>
                    <view class="order-time">
                        <text>接车</text> {{ startInfo.week }} {{ startInfo.time }}
                    </view>
                </view>
                <view class="order-day u-flex-1">
                    <text class="order-day-t">
                        共{{ orderInfo.orderEntity.orderDays }}天
                    </text>
                    <text class="order-day-icon" />
                </view>
                <view class="u-flex-1">
                    <view class="order-date">
                        {{ endInfo.date }}
                    </view>
                    <view class="order-time">
                        <text>还车</text>{{ endInfo.week }} {{ endInfo.time }}
                    </view>
                </view>
            </view>
        </view>
        <view class="card">
            <view class="card-content u-border-bottom">
                <view class="fee-list fee-list-title u-flex u-row-between">
                    <view class="">
                        <text class="line" />用车费用
                    </view>
                    <view>¥{{ feeInfo.price }}</view>
                </view>
                <view class="fee-list u-flex u-row-between">
                    <view>
                        用车费用
                        <text class="fee-list-text">
                            {{ `（${carInfoRental.price}/天 x ${feeInfo.orderDays}天）` }}
                        </text>
                    </view>
                    <view>¥{{ carInfoRental.price * feeInfo.orderDays }}</view>
                </view>
                <view class="fee-list u-flex u-row-between">
                    <view>
                        基础服务费
                        <text class="fee-list-text">
                            {{ `（${carInfoRental.baseServiceFee}/天 x ${feeInfo.orderDays}天）` }}
                        </text>
                    </view>
                    <view>¥{{ carInfoRental.baseServiceFee * feeInfo.orderDays }}</view>
                </view>
                <view class="fee-list u-flex u-row-between">
                    <view>
                        取送车服务费
                    </view>
                    <view>¥{{ feeInfo.butlerServiceFee }}</view>
                </view>
                <view class="fee-list u-flex u-row-between" v-if="feeInfo.couponDiscount">
                    <view>
                        用车费用折扣优惠
                    </view>
                    <view>¥{{ feeInfo.couponDiscount }}</view>
                </view>
                <view
                    v-if="orderInfo.orderEntity.status == 0"
                    class="fee-list u-flex u-row-between"
                >
                    <view>
                        优惠券减免
                    </view>
                    <view>
                        <template v-if="orderInfo.canUsedCouponList && orderInfo.canUsedCouponList.length == 0">
                            暂无优惠券<u-icon name="arrow-right" />
                        </template>
                        <view
                            v-if="orderInfo.canUsedCouponList && orderInfo.canUsedCouponList.length > 0"
                            class=""
                            @click="isCoupon = true"
                        >
                            {{ orderInfo.canUsedCouponList.length }}张优惠券可用
                            <u-icon name="arrow-right" />
                        </view>
                    </view>
                </view>
            </view>
            <view class="card-content">
                <view class="fee-list fee-list-title u-flex u-row-between">
                    <view>
                        <text class="line" />车辆押金
                    </view>
                    <view>¥{{ carInfoRental.deposit }}</view>
                </view>
                <view
                    v-if="paymentDepositAmount"
                    class="fee-list u-flex u-row-between"
                >
                    <view>
                        车辆押金不足
                        <text
                            v-if="userInfo.balance"
                            class="fee-list-text"
                        >
                            （押金余额￥{{ userInfo.balance }}）
                        </text>
                    </view>
                    <view>¥{{ paymentDepositAmount }}</view>
                </view>
                <view
                    v-if="orderInfo.orderEntity.status == 0"
                    class="fee-list u-flex u-row-between"
                >
                    <view>
                        接车时支付
                    </view>
                    <view>
                        <u-switch
                            v-model="nowPaymentDeposit"
                            active-color="#07C160"
                            inactive-color="#FFFFFF"
                            @change="handlePaymentWatch"
                        />
                    </view>
                </view>
            </view>
        </view>
        <view class="card">
            <view class="card-content">
                <view class="fee-list fee-list-title u-flex u-row-between">
                    <view>
                        <text class="line" />取送车信息
                    </view>
                </view>
                <view class="fee-list u-flex u-row-between">
                    <view>
                        接车人
                        <text class="fee-list-text">
                            （接车时务必携带本人驾照）
                        </text>
                    </view>
                    <view>{{ orderInfo.orderEntity.userName }}</view>
                </view>
                <view class="fee-list u-flex u-row-between">
                    <view>
                        接车地址
                    </view>
                    <view>{{ orderInfo.orderEntity.sendAddress }}</view>
                </view>
                <!-- <view class="fee-list u-flex u-row-between">
                    <view>
                        送车管家
                    </view>
                    <view>{{ orderInfo.orderEntity.createdBy }}</view>
                </view> -->
                <view class="fee-list u-flex u-row-between">
                    <view>
                        取车地址
                    </view>
                    <view>{{ orderInfo.orderEntity.returnAddress }}</view>
                </view>
                <!-- <view class="fee-list u-flex u-row-between">
                    <view>
                        取车管家
                    </view>
                    <view>{{ orderInfo.orderEntity.createdBy }}</view>
                </view> -->
            </view>
        </view>
        <view class="agree u-margin-bottom-60">
            完成支付即代表您已阅读并任何<text @click="showServiceProtocol">《车要试出行用户协议》</text>
        </view>
        
        <view
            v-if="orderInfo.orderEntity.status == 0 || orderInfo.orderEntity.status == 1 || orderInfo.orderEntity.status == 2 || orderInfo.orderEntity.status == 3"
            class="btu"
            @click="handleCancel"
        >
            取消订单
        </view>
        <view
            v-if="orderInfo.orderEntity.status == 1 || orderInfo.orderEntity.status == 2 || orderInfo.orderEntity.status == 3"
            class="btu"
            @click="handleUpdateOrder"
        >
            修改订单
        </view>
        <u-gap
            height="150"
            bg-color="#FFF"
        />
        <view
            v-if="orderInfo.orderEntity.status === 0"
            class="foot-sticky u-margin-left-32 u-margin-right-32 foot-but u-flex u-row-between"
            @click="handlePay"
        >
            <view class="foot-but-l">
                总计：￥<text class="price">
                    {{ orderInfo.wechatPayment }}
                </text>
            </view>
            <view class="foot-but-r">
                支付订单
                <text class="icon-r" />
            </view>
        </view>

        <u-popup
            v-model="isCoupon"
            mode="bottom"
            border-radius="14"
        >
            <view class="u-font-38 u-text-center u-padding-top-50">
                选择优惠券
            </view>
            <view
                v-if="orderInfo && orderInfo.canUsedCouponList"
                class="coupon-list u-padding-top-20 u-padding-bottom-60"
            >
                <view
                    v-for="(item, index) in orderInfo.canUsedCouponList"
                    :key="index"
                    class="item"
                >
                    <view class="title u-flex u-row-between">
                        <view class="name">
                            {{ item.couponName }}
                        </view>
                        <view class="discount">
                            <text>{{ item.discountRate }}</text>折
                        </view>
                    </view>
                    <view class="term u-flex u-row-between">
                        <view class="time">
                            有效期至：{{ item.enableTime }}
                        </view>
                        <view class="highest">
                            最高优惠{{ item.maxDiscount }}元
                        </view>
                    </view>
                    <view class="rule u-flex u-row-between">
                        <view>
                            使用限制：{{ item.explainContent }}
                        </view>
                        <view
                            v-if="item.notice"
                            class="expired-tag"
                        >
                            明日过期
                        </view>
                    </view>
                    <view
                        class="coupon-check"
                    >
                        <u-checkbox
                            v-model="item.checked"
                            size="28"
                            label-size="28"
                            icon-size="22"
                            @change="handleBoxChange(item, index)"
                        />
                    </view>
                    <view class="logos">
                        <u-image
                            width="100%"
                            height="100%"
                            src="https://image.51cheyaoshi.com/xcx/app/static/coupon_1.png"
                        />
                    </view>
                </view>
                <view
                    class="btu btu-active"
                    @click="handleUsedCoupon"
                >
                    确定使用
                </view>
            </view>
        </u-popup>
        <!-- 弹出框 -->
        <view class="selectCar-picker">
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
                        :update="1"
                        @click="handleSave"
                    />
                </view>
            </u-popup>
        </view>
    </view>
</template>
<script>
import PlaceOrderInfo from "./common/placeOrderInfo.vue";
import { orderStatus, orderStatusOptions } from "@/constants"
import dayjs from "dayjs"
export default {
    name: 'OrderInfo',
    filters: {
        orderText(value) {
            return orderStatusOptions.find(item => item.value === value).text
        }
    },
    components: {
        PlaceOrderInfo
    },

    data() {
        return {
          serviceProtocolUrl: 'https://www.51cheyaoshi.com/applet/protocol/rentservice.pdf',
          updateCache: '',
            isCoupon: false,
            showPoup: false,
            id: '',
            planUsedProductId: '',
            nowPaymentDeposit: true,
            orderInfo: null,
            weeks:  [
                "周日",
                "周一",
                "周二",
                "周三",
                "周四",
                "周五",
                "周六",
            ],
            startInfo: {
                date: '',
                time: '',
                week: ''
            },
            endInfo: {
                date: '',
                time: '',
                week: ''
            },
            // 用车费用
            feeInfo: {
            },
            wechatPayment: '',
            // 车辆信息
            carInfo: {},
            carInfoRental: {},
            // 用户信息
            userInfo: {},
            // 补交押金
            paymentDepositAmount: null,
            usedOrderData: null,
            userCouponIds: [],
        }
    },
    onLoad(option) {
        if(option) {
            this.id = option.id
            this.planUsedProductId = option.mpid
        }
        this.init();
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userData = data;
        })
    },
    methods: {
      showServiceProtocol() {
        this.$goHtml(this.serviceProtocolUrl, '')
      },
        handlePaymentWatch() {
            uni.vibrateShort({})
            this.updateCache = 1
            this.init();
        },
        handleBoxChange(item, index) {
            uni.vibrateShort({})
            console.log(item)
            item.checked = !item.checked

            this.$set(this.orderInfo.canUsedCouponList, index, this.orderInfo.canUsedCouponList[index])
        },
        handleUsedCoupon() {
            uni.vibrateShort({})
            this.isCoupon = false;
            this.userCouponIds = [];
            this.orderInfo.canUsedCouponList.map((item) => {
                if(item.checked) {
                    this.userCouponIds.push(item.couponId)
                }
            })
            this.init();
        },
        // 修改订单
        async handleSave(data) {
            console.log(data);
            this.sendInfo = this.initDate(data.sendTime)
            this.returnInfo = this.initDate(data.returnTime)
            const result = await this.$getRequest(this.$url.updateOrder, 'POST', {
                id: this.id,
                orderEndTime: data.returnTime,
                orderStartTime: data.sendTime,
                returnAddress: data.addressInfo.return.name,
            })

            if(result.code != 0) {
                return false
            }
            uni.showToast({
                title: '订单修改成功',
                duration: 2000
            });
            this.showPoup = false

            this.init();

            console.log(result)
        },
        // 取消订单
        handleCancel() {
            uni.showModal({
                title: '提示',
                content: '是否确定取消订单',
                success: async (res) => {
                    if (res.confirm) {
                        uni.showLoading({
                            title: '请求中'
                        });

                        const result = await this.$getRequest(this.$url.cancelOrder, 'POST', {
                            id: this.id,
                            updateBy: this.userData.updatedBy
                        })

                        if(result.code == 0) {
                            uni.hideLoading()
                            uni.showToast({
                                title: '订单已取消',
                                duration: 2000
                            });
                            setTimeout(() => {
                                this.$u.route({
                                    type: 'navigateBack',
                                    delta: 1
                                })
                            }, 500)
                        }

                        console.log('用户点击确定');
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            });
        },
        async handleUpdateOrder() {
            this.usedOrderData = {
                sendTime: this.orderInfo.orderEntity.orderStartTime,
                returnTime: this.orderInfo.orderEntity.orderEndTime,
                orderDays: this.orderInfo.orderEntity.orderDays,
                addressInfo: {
                    send: {
                        name: this.orderInfo.orderEntity.sendAddress,
                        address: this.orderInfo.orderEntity.sendAddress,
                        latitude: '',
                        longitude: '',
                    },
                    return: {
                        name: this.orderInfo.orderEntity.returnAddress,
                        address: this.orderInfo.orderEntity.returnAddress,
                        latitude: '',
                        longitude: '',
                    }
                }
            }
            this.showPoup = true;
            // uni.setStorageSync('usedOrderData', data);
            // this.$u.route({
            //     url: "pages/ordered/selectCar",
            //     params: {
            //         update: 1,
            //         id: this.id
            //     }
            // });
        },
        async handlePay() {
            const result  = await this.$getRequest(this.$url.paymentOrder, 'POST', {
                id: this.id,
                updateBy: 'text',
                nowPaymentDeposit: this.nowPaymentDeposit ? 0 : 1,
                usedUserProductId: '', //天次id
                userCouponIds: this.userCouponIds//优惠券id
            })
            if(result.code == 0) {
                uni.showToast({
                    title: '已支付',
                    duration: 2000,
                    icon: 'success'
                });
                this.init();
            } else {
              // 余额不足 拉起微信支付
              this.$requestPayment({
                businessId: this.id, // 订单ID
                businessType: 0,
                openid: this.userData.xcxOpenid,
                payType: '0', 
                total: this.orderInfo.wechatPayment, // TODO 0.01
                userId: this.userData.id,
              }, (res) => {
                if(res == 'success') {
                  // 支付成功 跳转订单详情 order-info
                  // this.$u.route(`/pages/ordered/order-info?id=${this.id}`)
                  this.orderInfo.orderEntity.status = 1
                }
              })
            }

            console.log(result)
        },
        initDate (times) {
            const date = dayjs(times).format('MM月DD日');
            const week = this.weeks[dayjs(times).get('day')]
            const time = dayjs(times).format('HH:mm');
            return `${date}（${week}）${time}`;
        },
        async init() {
            uni.showLoading({
                title: '加载中'
            });
            const result = await this.$getRequest(this.$url.getOrderInfo, 'POST', {
                id: this.id,
                nowPaymentDeposit: this.nowPaymentDeposit ? 0 : 1,
                planUsedProductId: this.planUsedProductId,
                usedUserProductId: '', //天次id
                updateCache: this.updateCache,
                userCouponIds: this.userCouponIds//优惠券id
            })
            uni.hideLoading()
            this.orderInfo = result.data;
            if(this.orderInfo.canUsedCouponList && this.orderInfo.canUsedCouponList.length) {
                this.orderInfo.canUsedCouponList.map((item) => {
                    if(this.userCouponIds.indexOf(item.couponId) != -1) {
                        // couponId
                        item.checked = true
                    } else {
                        item.checked = false
                    }

                    return item;
                })
                console.log(this.orderInfo.canUsedCouponList)
            }

            this.startInfo = {
                date: dayjs(result.data.orderEntity.orderStartTime).format('MM月DD日'),
                time: dayjs(result.data.orderEntity.orderStartTime).format('HH:mm'),
                week: this.weeks[dayjs(result.data.orderEntity.orderStartTime).get('day')],
            }
            this.endInfo = {
                date: dayjs(result.data.orderEntity.orderEndTime).format('MM月DD日'),
                time: dayjs(result.data.orderEntity.orderEndTime).format('HH:mm'),
                week: this.weeks[dayjs(result.data.orderEntity.orderEndTime).get('day')],
            }
            this.feeInfo = result.data.orderPaymentInfoEntity
            this.carInfo = result.data.carTypeYearProductEntity
            this.carInfoRental = result.data.rentalPriceEntity
            this.userInfo = result.data.userDepositEntity
            this.paymentDepositAmount = result.data.paymentDepositAmount

            console.log(result);
        },
        handleIdentity() {
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/components/coupon.scss';
    .padding-x {
        padding: 0 30rpx;
    }
    .order-info {
        padding: 0 30rpx;
        padding-bottom: 50rpx;

        .card {
            background: #FFFFFF;
            box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.06);
            border-radius: 24rpx;
            margin-top: 20rpx;
            padding: 20rpx 0;
            .card-content {
                padding: 20rpx 0 20rpx 22rpx;
                margin: 0 32rpx 0 32rpx;
            }

            // .order-title {
            //     font-size: 36rpx;
            //     padding: 10rpx 30rpx;
            //     padding-bottom: 28rpx;
            //     font-weight: 500;
            // }
        }
        .card-car-info {

        }
        .fee-list {
            font-size: 28rpx;
            color: rgba(10, 15, 45, 0.8);
            padding: 10rpx 0;
            .fee-list-text {
                font-size: 28rpx;
                color: #BFBFBF;
            }
        }
        .fee-list-title {
            font-size: 34rpx;
            font-weight: 500;
            color: #0A0F2D;
        }
        .fee-list-color {
            color: $uni-color-success;
        }
        .order-date-info {
            text-align: center;
            padding: 20rpx 0;
            .order-date {
                font-size: 48rpx;
                font-weight: 500;
            }
            .order-time {
                font-size: 24rpx;
                color: #5D6573;
                text {
                    color: rgba(10, 15, 45, 0.5);
                    border: 1px solid rgba(10, 15, 45, 0.08);
                    display: inline-block;
                    border-radius: 30rpx;
                    padding: 2rpx 14rpx;
                    margin-right: 4rpx;
                }
            }
            .order-day {
                color: rgba(10, 15, 45, 0.8);
                font-size: 22rpx;
                .order-day-t {
                    background: #f5f5f5;
                    border-radius: 54rpx;
                    padding: 2rpx 12rpx;
                }
            }
            .order-day-icon {
                background: url('https://image.51cheyaoshi.com/xcx/app/static/days.png') no-repeat;
                background-size: 100%;
                width: 200rpx;
                height: 20rpx;
                display: inline-block;

            }
        }
        .order-model {
            padding: 30rpx 30rpx;
            position: relative;
            .status {
                position: absolute;
                border: 1px solid #5F19F5;
                box-sizing: border-box;
                border-radius: 8px;
                color: #5F19F5;
                text-align: center;
                font-size: 30rpx;
                padding: 12rpx 16rpx;
                position: absolute;
                right: 0;
                top: 20rpx;
                z-index: 1;
                .count-down {
                    display: block;
                    font-size: 24rpx;
                    width: 100rpx;
                }
            }
            .order-model-img {
                width: 210rpx;
                height: 80rpx;
            }
            .order-model-info {
                margin-left: 20rpx;
                .brand {
                    font-size: 30rpx;
                    font-weight: 500;
                    color: rgba(10, 15, 45, 0.8);
                }
                .model {
                    color: rgba(10, 15, 45, 0.8);
                    margin-top: 5rpx;
                    font-size: 24rpx;
                }
            }
        }
        .agree {
            font-size: 24rpx;
            color: rgba(10, 15, 45, 0.5);
            margin-top: 24rpx;
            text {
                color: #0168ff;
            }
        }
        .foot-but {
            margin-left: 0;
            margin-right: 0;
            margin-top: 60rpx;
        }
    }
    .line {
        width: 4rpx;
        height: 24rpx;
        background: #0AEB7D;
        border-radius: 4rpx;
        display: inline-block;
        margin-right: 16rpx;
        margin-left: -16rpx;
    }
    .btu {
        background: rgba(10, 15, 45, 0.04);
        border-radius: 16rpx;
        text-align: center;
        color: #0A0F2D;
        font-weight: 500;
        font-size: 30rpx;
        padding: 26rpx 0;
        margin: 30rpx 0;
    }
    .selectCar {
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
    .coupon-list {
        .btu {
            background: rgba(10, 15, 45, 0.4);
        }
        .btu-active {
            color: #fff;
            background: rgba(10, 15, 45, 1);
        }
        .coupon-check {
            position: absolute;
            top: 10rpx;
            right: 0rpx;
            z-index: 1;
        }
    }


</style>
