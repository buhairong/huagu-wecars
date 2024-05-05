<template>
    <view v-if="orderInfo" class="order-info u-margin-bottom-200">
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
          <view class="subStatus">
            {{ orderInfo.userCarSubscribeEntity.status | subOrderText }}
          </view>
        </view>
        <view class="order-date-info u-flex">
          <view class="u-flex-1">
            <view class="order-date">{{ startInfo.date }}</view>
            <view class="order-time">
                <text>开始订阅</text>
            </view>
          </view>
          <view class="order-day u-flex-1">
            <!-- <text class="order-day-t">至</text> -->
            {{ orderInfo.userCarSubscribeEntity.monthTotal }}个月
            <text class="order-day-icon" />
          </view>
          <view class="u-flex-1">
            <view class="order-date">{{ endInfo.date }}</view>
            <view class="order-time">
              <text>订阅结束</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="card" v-if="orderInfo.userCarSubscribeEntity">
        <view class="card-content">
          <view class="fee-list fee-list-title u-flex u-row-between">
            <view><text class="line" />合约详情</view>
            <!-- <view>电子合约</view> -->
          </view>
          <view class="fee-list u-flex u-row-between">
            <view>签约主体</view>
            <view>{{ userData.name }}</view>
          </view>
          <view class="fee-list u-flex u-row-between">
            <view>合约周期</view>
            <view>{{ orderInfo.userCarSubscribeEntity.monthTotal }}个月</view>
          </view>
          <view class="fee-list u-flex u-row-between">
            <view>合约保证金</view>
            <view>{{ orderInfo.userCarSubscribeEntity.deposit }}</view>
          </view>
          <view class="fee-list u-flex u-row-between" v-if="orderInfo.userCarSubscribeEntity.totalCarUsedFee > 0">
            <view>用车费用</view>
            <view>{{ orderInfo.userCarSubscribeEntity.totalCarUsedFee }}</view>
          </view>
          <!-- <view class="fee-list u-flex u-row-between">
            <view>里程约定</view>
            <view>{{ orderInfo.carTypeYearProductEntity.createdBy }}</view>
          </view> -->
          <!-- <view class="fee-list u-flex u-row-between">
            <view>期末方案</view>
            <view></view>
          </view> -->
        </view>
      </view>
      <view class="card" v-if="orderInfo.carEntity">
        <view class="card-content">
          <view class="fee-list fee-list-title u-flex u-row-between">
            <view><text class="line" />车辆信息</view>
            <!-- <view>车牌</view> -->
          </view>
          <view class="fee-list u-flex u-row-between">
            <view>车型</view>
            <view>{{ orderInfo.carEntity.carBrand }} {{ orderInfo.carEntity.carType }}</view>
          </view>
          <view class="fee-list u-flex u-row-between">
            <view>款型</view>
            <view>{{ orderInfo.carEntity.carTypeYearProduct }}</view>
          </view>
          <view class="fee-list u-flex u-row-between">
            <view>外观颜色</view>
            <view>{{ orderInfo.carEntity.carColor }}</view>
          </view>
          <view class="fee-list u-flex u-row-between">
            <view>车架号</view>
            <view>{{ orderInfo.carEntity.carVin || '-' }}</view>
          </view>
          <view class="fee-list u-flex u-row-between">
            <view>发动机号</view>
            <view>{{ orderInfo.carEntity.carEngineNum || '-' }}</view>
          </view>
          <view class="fee-list u-flex u-row-between">
            <view>上牌日期</view>
            <view>{{ orderInfo.carEntity.registerDate || '-'}}</view>
          </view>
        </view>
      </view>
			
			<view class="card" v-else-if="orderInfo.secondHandCarsEntity">
			  <view class="card-content">
			    <view class="fee-list fee-list-title u-flex u-row-between">
			      <view><text class="line" />车辆信息</view>
			      <!-- <view>车牌</view> -->
			    </view>
			    <view class="fee-list u-flex u-row-between">
			      <view>车型</view>
			      <view>{{ orderInfo.secondHandCarsEntity.carBrand }} {{ orderInfo.secondHandCarsEntity.carType }}</view>
			    </view>
			    <view class="fee-list u-flex u-row-between">
			      <view>款型</view>
			      <view>{{ orderInfo.secondHandCarsEntity.carTypeYearProduct }}</view>
			    </view>
			    <view class="fee-list u-flex u-row-between">
			      <view>外观颜色</view>
			      <view>{{ orderInfo.secondHandCarsEntity.outColor || '-' }}</view>
			    </view>
			    <view class="fee-list u-flex u-row-between">
			      <view>车架号</view>
			      <view>{{ orderInfo.secondHandCarsEntity.carVin || '-' }}</view>
			    </view>
			    <view class="fee-list u-flex u-row-between">
			      <view>发动机号</view>
			      <view>{{ orderInfo.secondHandCarsEntity.carEngineNum || '-' }}</view>
			    </view>
			    <view class="fee-list u-flex u-row-between">
			      <view>上牌日期</view>
			      <view>{{ orderInfo.secondHandCarsEntity.regDate || '-'}}</view>
			    </view>
			  </view>
			</view>
      
      <view class="card" v-if="orderInfo.logEntityList">
        <view class="card-content">
          <view class="fee-list fee-list-title u-flex u-row-between">
            <view><text class="line" />订单历史</view>
            <!-- <view>车牌</view> -->
          </view>
          <view>
            <u-row>
              <u-col span="5">
                <u-steps
                  :list="logContent"
                  mode="dot"
                  :current="logList.length - 1"
                  active-color="#0AEB7D"
                  direction="column"
                ></u-steps>
              </u-col>
              <u-col span="7">
                <u-steps
                  class="m-log-step"
                  :list="logList"
                  mode="dot"
                  :current="logList.length - 1"
                  active-color="rgba(10, 15, 45, 0.3)"
                  direction="column"
                ></u-steps>
              </u-col>
            </u-row>
          </view>
          
        </view>
      </view>
        <view class="agree u-margin-bottom-60">
          完成支付即代表您已阅读并任何<text @click="showProtocol">《车要试用车服务协议》</text>
        </view>
        
        <view
          v-if="orderInfo.userCarSubscribeEntity.status == 0"
          class="btu"
          @click="handleCancel"
        >
          取消订单
        </view>
        <!-- <view
          v-if="orderInfo.userCarSubscribeEntity.status == 1 || orderInfo.userCarSubscribeEntity.status == 2"
          class="btu"
          @click="handleUpdateOrder"
        >
          修改订单
        </view> -->
        <u-gap
          height="150"
          bg-color="#FFF"
        />
        <view
          v-if="orderInfo.userCarSubscribeEntity.status === 0"
          class="foot-sticky u-margin-left-32 u-margin-right-32 foot-but u-flex u-row-between"
          @click="handlePay"
        >
          <view class="foot-but-l">
            总计：￥<text class="price">{{ orderInfo.userCarSubscribeEntity.reserveFee }}</text>
          </view>
          <view class="foot-but-r">支付订金<text class="icon-r" /></view>
        </view>

        <u-popup
          v-model="isCoupon"
          mode="bottom"
          border-radius="14"
        >
          <view class="u-font-38 u-text-center u-padding-top-50">选择优惠券</view>
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
                <view class="name">{{ item.couponName }}</view>
                <view class="discount"><text>{{ item.discountRate }}</text>折</view>
              </view>
              <view class="term u-flex u-row-between">
                <view class="time">有效期至：{{ item.enableTime }}</view>
                <view class="highest">最高优惠{{ item.maxDiscount }}元</view>
              </view>
              <view class="rule u-flex u-row-between">
                <view>使用限制：{{ item.explainContent }}</view>
                <view v-if="item.notice" class="expired-tag">明日过期</view>
              </view>
              <view class="coupon-check">
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
            <view class="btu btu-active" @click="handleUsedCoupon">确定使用</view>
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
            <view class="selectCar-picker-top u-text-center">请选择要修改的时间及地址</view>
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
import { subOrderStatusOptions } from "@/constants/order"

import dayjs from "dayjs"
export default {
    name: 'SubOrderInfo',
    filters: {
      subOrderText(value) {
        return subOrderStatusOptions.find(item => item.value === value).name
      }
    },
    data() {
      return {
        contractUrl: 'https://www.51cheyaoshi.com/applet/protocol/carlongcontract.html',
        // https://www.th-leasing.com/test/service/protocol/carlongcontract.pdf
        isCoupon: false,
        showPoup: false,
        id: '',
        nowPaymentDeposit: true,
        orderInfo: { userCarSubscribeEntity: { status: 0 } },
        logList: [],
        logContent: [],
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
        // carInfo: {},
        // carInfoRental: {},
        // 用户信息
        userInfo: {},
        userData: {},
        // 补交押金
        paymentDepositAmount: null,
        usedOrderData: null,
        userCouponIds: [],
		
		// userId: '',
		// userCarSubscribeIds:''
      }
    },
    onLoad(option) {
      if(option) {
        this.id = option.id
      }
    },
    onShow() {
      getApp().globalData.getUserInfo((data) => {
        this.userData = data
				this.userId = data.id
				this.init()
      })
    },
		onPullDownRefresh(){
			this.init()
			setTimeout(() => {
				uni.stopPullDownRefresh();
			},1000)
		},
    methods: {
				showProtocol() {
					const res = this.$goHtml(this.contractUrl, '')
				},
        handlePaymentWatch() {
            uni.vibrateShort({})
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
                        const result = await this.$getRequest(this.$url.cancelSubscribeOrder, 'POST', {
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
          // 1.订阅订单只能拉起微信支付
          uni.showToast({
              title: '微信支付中',
              duration: 2000,
              icon: 'loading'
          });
					console.log("1=====",1111)
          // 2.创建微信订单
          this.$requestPayment({
            businessId: this.orderInfo.userCarSubscribeEntity.id, // 订单ID
            businessType: 2, // 新车订阅
            openid: this.userData.xcxOpenid,
            payType: '2', 
            total: this.orderInfo.userCarSubscribeEntity.reserveFee, // TODO 0.01
            userId: this.userData.id,
		}, (res) => {
            if(res == 'success') {
				uni.navigateTo({
					url:'../home/profile/order-pay?id='+this.id + '&planId=' + this.orderInfo.userCarSubscribeEntity.carSubscribeId
				})
              // 支付成功 刷新数据
              this.init()
            }
          })
    //       }).then((res) => {
			 //  console.log("2=====",2222)
			 //  console.log("res3=====",res)
			  
    //         if(res == 'success') {
				// console.log("res.data",res)
				// uni.navigateTo({
				// 	url:'../home/profile/order-pay'
				// })
    //           // 支付成功 刷新数据
    //           this.init()
    //         }
    //       })
          uni.hideLoading()
        },
		
        initDate (times) {
            const date = dayjs(times).format('MM月DD日');
            const week = this.weeks[dayjs(times).get('day')]
            const time = dayjs(times).format('HH:mm');
            return `${date}（${week}）${time}`;
        },
				
        async init() {
						console.log('init')
            uni.showLoading({
                title: '加载中'
            });
            const result = await this.$getRequest(this.$url.getSubscribeInfo, 'POST', {
                id: this.id,
                userId: this.userId,
            })
            uni.hideLoading()
            this.orderInfo = result.data;
            let logList = []
            let logContent = []
            for(const item of result.data.logEntityList) {
              const date = dayjs(item.createdTime).format('YYYY年MM月DD日')
              const time = dayjs(item.createdTime).format('HH:mm');
              logList.push({ name: date + ' ' + time })
              logContent.push({ name: item.content })
            }
            this.logList = logList
            this.logContent = logContent
            
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

            // this.startInfo = {
            //     date: dayjs(result.data.orderEntity.orderStartTime).format('MM月DD日'),
            //     time: dayjs(result.data.orderEntity.orderStartTime).format('HH:mm'),
            //     week: this.weeks[dayjs(result.data.orderEntity.orderStartTime).get('day')],
            // }
            // this.endInfo = {
            //     date: dayjs(result.data.orderEntity.orderEndTime).format('MM月DD日'),
            //     time: dayjs(result.data.orderEntity.orderEndTime).format('HH:mm'),
            //     week: this.weeks[dayjs(result.data.orderEntity.orderEndTime).get('day')],
            // }
            // this.feeInfo = result.data.orderPaymentInfoEntity
            // this.carInfo = result.data.carTypeYearProductEntity
            // this.carInfoRental = result.data.rentalPriceEntity
            // this.userInfo = result.data.userDepositEntity
            // this.paymentDepositAmount = result.data.paymentDepositAmount

            console.log(result);
        },
				
        handleIdentity() {
        }
    }
}
</script>
<style lang="scss">
  .u-steps__item {
    min-height: 75rpx !important;
    .u-steps__item__text--column {
      color: rgba(10, 15, 45, 0.8) !important;
    }
    .u-steps__item__line .u-line{
      height: 60% !important;
      border-left-width: 0.5px !important;
    }
    .u-steps__item__dot {
      width: 6px !important;
      height: 6px !important;
    }
    .u-steps__item__line {
      left: calc(9rpx / 2) !important;
      height: 100% !important;
      top: 73% !important;
    }
  }
  .m-log-step{
    .u-steps__item__dot {
      background-color: transparent !important;
    }
    .u-steps__item__line .u-line{
      border-color: transparent !important;
    }
    .u-steps__item__text--column {
      color: rgba(10, 15, 45, 0.3) !important;
    }
  }
</style>
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
            .subStatus {
                position: absolute;
                right: 10rpx;
                top: 30rpx;
                z-index: 1;
                border: 1px solid #5F19F5;
                border-radius: 16rpx;
                padding: 8rpx 16rpx;
                text-align: center;
                color: #5F19F5;
                .status-text {
                    font-weight: 500;
                    font-size: 30rpx;
                    line-height: 44rpx;
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
