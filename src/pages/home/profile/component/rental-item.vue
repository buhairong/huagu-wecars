<!--
 * @Author: your name
 * @Date: 2021-11-15 21:20:29
 * @LastEditTime: 2022-01-16 13:20:50
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-wecars/src/pages/choose-car/profile/component/rental-item.vue
-->
<template>
  <view>
  <view class="rental card">
    <view class="stages-number">
      <u-row gutter="10">
        <u-col
          v-for="(item, index) in selfMonthProductList"
          :key="index"
          span="4"
        >
          <view
            class="item u-margin-10"
            :class="active == index ? 'active' : ''"
            @click="handleStages(index)"
          >
            <view class="icon">
              <u-icon
                name="checkbox-mark"
                color="#fff"
                size="16"
              />
            </view>
            <view class="item-day u-font-28">
              {{ item.days }}{{ index != 0 ? '天套餐' : '' }} 
            </view>
            <template v-if="index === 0">
              <view class="item-m">
                {{ item.price | $numToSeparator("元") }}/天
              </view>
            </template>
            <template v-else>
              <view class="item-num">
                {{ item.priceStr }}
              </view>
              <view class="item-m">
                约{{ item.price / item.days | $numToSeparator("元") }}/天
              </view>
            </template>
          </view>
        </u-col>
      </u-row>
    </view>
    <view class="brand">
      <u-section
        :title="`${carDetailData.carBrand} ${carDetailData.carType} | ${carDetailData.carTypeYearProduct}`"
        :right="false"
        line-color="#0AEB7D"
      />
    </view>
    <view class="car-box">
      <place-order-info
        ref="placeOrderInfo"
        :use-btn="false"
        :current-tab="0"
        update="0"
        :change-days="cDays"
        @click="handleSaveGo"
      />
    </view>
    <!-- 订车 -->
    <view class="foot-but foot-sticky" @click="handleBookCar">
      <u-row>
        <u-col offset="4">
          <view class="foot-but-r">
              立即订车
              <text class="icon-r" />
          </view>
        </u-col>
      </u-row>
    </view>
  </view>
  
  
  </view>
</template>

<script>
import PlaceOrderInfo from "../../../ordered/common/placeOrderInfo.vue";
import dayjs from "dayjs"
export default {
    components: {
        PlaceOrderInfo
    },
    props: {
        monthProductList: {
            type: Array,
            default () {
                return [];
            }
        },
        carDetailData: {
            type: Object,
            default: () => {
                return {};
            }
        },
        userInfo: {
          type: Object,
          default: () => {
              return {};
          }
        }
    },
    data() {
        return {
            active: 0,
            cDays: 0,
            stage: 0,
        };
    },
    computed: {
        selfMonthProductList () {
            return [
                {
                    days: "随用随还",
                    price: this.carDetailData.rentalPriceEntity.price || 0
                },
                ...this.monthProductList
            ]
        }
    },
    onLoad() {
      // console.log(this.monthProductList)
    },
    methods: {
        handleStages(val) {
          console.log('stage', val)
          this.stage = val
          uni.vibrateShort();
          this.active = val;
          if(val >= 1) {
            this.cDays = this.carDetailData.monthProductList[val -1].days
          } else {
            this.cDays = 0
          }
          
        },
        countUsedDay(endStamp, startStamp) {
            // 用车天数
            let m1 = dayjs(endStamp);
            let m2 =  dayjs(startStamp);
            console.log(m1)
            let hours = m1.diff(m2, 'hours');
            if(hours <= 24) {
                return 1;
            }  else {
                if(String(hours / 24).indexOf('.') == -1) {
                    return hours / 24
                } else {
                    if(String(hours/24)[(String(hours/ 24).indexOf('.') + 1)] >= 5)  {
                        return Math.ceil(hours / 24)
                    } else {
                        return parseInt(hours / 24)+'.5'
                    }
                }
            }

        },
        async handleSaveGo(data) {
          const pageThis = this
          
          uni.vibrateShort({})
          data.orderDays = this.countUsedDay(data.returnTime, data.sendTime);
          uni.setStorageSync('usedOrderData', data);
          // 检查有没有待支付订单，若有待支付订单，提示用户 是否取消之前的订单重新下单
          // TODO 功能按钮：code!=0 查看订单、取消重下
          uni.showLoading({
              title: '订单创建中'
          });
          const result = await this.$getRequest(this.$url.createOrder, 'POST', {
            "cityId": uni.getStorageSync("cityId"),
            "carTypeYearProductId": this.carDetailData.carTypeYearProductEntity.id,
            "createdBy": this.userInfo.createdBy,
            "orderEndTime": data.returnTime+":00",
            "orderFrom": 0,
            "orderStartTime": data.sendTime+":00",
            "returnAddress": data.addressInfo.send.name,
            "sendAddress": data.addressInfo.return.name,
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
          const newOrderId = result.data.id
          let newMpid = ''
          if (this.stage > 0) {
            newMpid = this.carDetailData.monthProductList[this.stage - 1].id
            this.$u.route(`/pages/ordered/order-info?id=${newOrderId}&mpid=${newMpid}`)
          } else {
            this.$u.route(`/pages/ordered/order-info?id=${newOrderId}`)
          }
          
        },
        handleBookCar(data) {
          this.$refs.placeOrderInfo.handleSave();
        }
    }
};
</script>
<style lang="scss" scoped>
.card {
    margin: 0 32rpx;
    margin-top: 24rpx;
    background: #ffffff;
    box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
        0px 8px 24px rgba(10, 15, 45, 0.06);
    border-radius: 24rpx;
    padding: 36rpx 32rpx;
    margin-bottom: 24rpx;
}
.rental {
    .stages-number {
        // margin: 10rpx 0;
        margin-left: -10rpx;
        margin-right: -10rpx;
        .item {
            height: 150rpx;
            // margin: 12rpx 0;
            padding: 16rpx 0;
            background: #ffffff;
            border: 1px solid rgba(10, 15, 45, 0.3);
            box-sizing: border-box;
            border-radius: 8rpx;
            text-align: center;
            position: relative;
            font-size: 24rpx;
            color: rgba(10, 15, 45, 0.8);
            
            .item-day {
              font-size: 28rpx;
              font-weight: 500;
              color: rgba(10, 15, 45, 0.8);
            }
            .item-num {
              font-size: 24rpx;
              font-weight: normal;
              color: rgba(10, 15, 45, 0.8);
            }
            .item-m {
              font-size: 24rpx;
              font-weight: normal;
              color: rgba(10, 15, 45, 0.5);
            }
            .icon {
                background: rgba(10, 235, 125, 0.6);;
                border-radius: 0px 4rpx;
                width: 20rpx;
                height: 20rpx;
                line-height: 12rpx;
                position: absolute;
                top: 0;
                right: 0;
                z-index: 1;
                text-align: center;
                display: none;
            }
        }
        .active {
            box-sizing: border-box;
            border: 1px solid rgba(10, 235, 125, 0.6);
            .item-day {
              color: #0A0F2D;
            }
            .item-num {
              font-weight: 500;
              color: #0A0F2D;
            }
            .icon {
              display: block;
            }
        }
    }
    .brand {
        margin-top: 48rpx;
        margin-bottom: 20rpx;
    }
}
.car-box {
    // padding: 0 16rpx;
    margin-left: -40rpx;
    margin-right: -40rpx;
    .car-box-item {
        position: relative;
        padding: 26rpx 0;
        .car-icon {
            width: 24rpx;
            height: 24rpx;
            background: url('https://image.51cheyaoshi.com/xcx/app/static/time.png') no-repeat;
            background-size: 100%;
            display: inline-block;
            margin-right: 20rpx;
        }
        .default-r {
            text-align: right;
        }
        .car-box-content {
            flex: 1;
        }
    }
}
</style>