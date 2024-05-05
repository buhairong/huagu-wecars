<template>
    <view class="collage-detail">
        <!-- 上 -->
        <detail-head 
            ref="detailHead"
            :show-like="false"
            :banner-list="carTypeYearProductImageList"
            :month-payment="collageDetailData.monthPayment"
            :car-detail-data="collageDetailData.carTypeYearProductEntity" 
        />

        <!-- 拼团详情 -->
        <view class="info">
            <view class="info-top u-flex u-row-between">
                <!-- 左 -->
                <view class="left">
                    <u-count-down
                      font-size="26"
                      color="white"
                      bg-color="rgba(10, 15, 45, 0.8)"
                      separator="colon"
                      :timestamp="timestamp" 
                      :show-days="true"
                      :show-hours="true"
                      :show-minutes="true"
                      :show-seconds="true"
                    />
                </view>

                <!-- 右 -->
                <view class="right u-text-right">
                    <view class="right-text">
                        超值拼团价
                    </view>
                    <view class="right-price">
                        <text>{{ collageDetailData.price | $numToSeparator("", "￥") }}</text>
                    </view>
                </view>
            </view>

            <view class="info-progress">
                <u-line-progress 
                    :percent="collageDetailData.joinCount / collageDetailData.maxMember * 100"
                    height="16"
                    active-color="#0AEB7D" 
                    inactive-color="rgba(10, 15, 45, 0.08)"
                    round
                    :show-percent="false"	
                />
            </view>

            <view class="info-bottom u-flex u-row-between">
                <view class="left">
                    {{ `拼团总数${collageDetailData.maxMember}人` }}
                </view>
                <view class="right">
                    {{ `已拼${collageDetailData.joinCount}人, 还差${collageDetailData.free}人` }}
                    <!-- {{ `已拼${collageDetailData.joinCount}人, 还差${collageDetailData.maxMember - collageDetailData.joinCount}人` }} -->
                </view>
            </view>
            
            <view
                class="foot-but foot-sticky u-flex u-row-between"
                @click="handleJoin"
            >
                <view class="foot-but-l">
                    订金：￥
                    <text class="price u-font-34">
                        {{ collageDetailData.reserveFee }}
                    </text>
                </view>
                <view class="foot-but-r">
                    去拼团
                    <text class="icon-r" />
                </view>
            </view>
            
        </view>
        <!-- 订阅方案 -->
        <view class="u-margin-top-20">
          <view class="flow-head box-head u-flex">
              <text class="box-head-name  u-padding-left-20">
                  订阅方案
              </text>
          </view>
          <firstItem
            :min-product-entity="collageDetailData"
            :user-info="userInfo"
            :show-note="false"
            @changeProductId="changeProdId"
          />
        </view>
        
        <!-- 拼团流程 -->
        <view class="flow box">
            <view class="flow-head box-head u-flex">
                <u-image
                    class="box-head-icon"
                    width="38rpx"
                    height="30rpx"
                    src="https://image.51cheyaoshi.com/xcx/app/static/home/collage-flow.png"
                />
                <text class="box-head-name">
                    拼团流程
                </text>
            </view>

            <view class="flow-list box-bottom u-flex u-col-top">
                <template
                    v-for="(flowItem, index) in flowList"
                >
                    <!-- 图标 -->
                    <view 
                        v-if="index !== 0" 
                        :key="index"
                        class="item-icon"
                    >
                        -
                    </view>

                    <!-- 流程块 -->
                    <view
                        :key="index + 'block'"
                        class="item-block"
                    >
                        <!-- 序号 -->
                        <view class="item-index">
                            <text class="item-index-text">
                                {{ index + 1 }}
                            </text>
                        </view>

                        <!-- 流程内容 -->
                        <view class="item-content">
                            <!-- 上 -->
                            <view class="item-content-top">
                                {{ flowItem.name }}
                            </view>
                            <!--下 -->
                            <view class="item-content-bottom">
                                {{ flowItem.description }}
                            </view>
                        </view>
                    </view>
                </template>
            </view>
        </view>

        <!-- 拼团成员 -->
        <view class="members box">
            <view class="members-head box-head u-flex">
                <u-image
                    class="box-head-icon"
                    width="38rpx"
                    height="30rpx"
                    src="https://image.51cheyaoshi.com/xcx/app/static/home/members.png"
                />
                <text class="box-head-name">
                    已拼团成员
                </text>
            </view>

            <view class="members-list box-bottom u-flex u-flex-wrap">
                <view
                    v-for="(item, index) in collageDetailData.joinUser"
                    :key="index"
                    class="item"
                >
                    <view 
                        class="item-inner u-flex"
                    >
                        <view class="item-inner-img">
                            <u-image
                                width="104rpx"
                                height="104rpx"
                                :src="item.imageUrl"
                            />
                        </view>
                        <view class="item-inner-icon">
                            <u-icon
                                name="checkbox-mark"
                                color="#fff"
                                size="18"
                            />
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>  
import firstItem from "@/pages/home/profile/component/first-item";
import detailHead from "@/pages/home/common/detail-head";
import dayjs from 'dayjs'
export default {
  onShareAppMessage(res) {
    return {
      title: '车要试 让有车生活 · 更简单',
      desc: '',
      path: '/pages/home/collage/collage-detail',
      imageUrl: '', 
    }
  },
  onShareTimeline(res) {
    
  },
    name: "CollageDetail",
    components: {
        detailHead,
        firstItem
    },
    data () {
        return {
            userInfo: null,
            prodId: '',
            curCollageId: 1,
            collageDetailData: {
                carTypeYearProductImageList: [],
                carTypeYearProductEntity: {}
            },
            timestamp: 0,

            flowList: [
                {
                    id: 1,
                    name: "拼团开启",
                    description: ""
                },
                {
                    id: 2,
                    name: "支付定金",
                    description: "参加拼团"
                },
                {
                    id: 3,
                    name: "拼团成功",
                    description: "在线签约"
                },
                {
                    id: 4,
                    name: "支付全款",
                    description: "交付车辆"
                },
            ]
        };
    },
    computed: {
        carTypeYearProductImageList () {
            return this.collageDetailData.carTypeYearProductImageList.map(item => {
                return {
                    ...item,
                    image: item.imageUrl
                }
            });
        },
        carTypeYearProductEntity () {
            return this.collageDetailData.carTypeYearProductEntity;
        }
    },
    onShow() {
      this.init();
    },
    onLoad (option) {
        if(option) {
            this.curCollageId = +option.id
        }
        this.init();
    },
    methods: {
        init() {
            this.getActivityDetailData();
            this.$refs.detailHead.init();
        },
        changeProdId(id) {
          this.prodId = id
        },
        // 获取团购详情
        async getActivityDetailData () {
            const collageDetailData = await this.$getRequest(this.$url.activityDetail, "POST", {
                id: this.curCollageId,
            });
            this.collageDetailData = collageDetailData.data;
            this.prodId = collageDetailData.data.businessId
            this.getTimestamp();
        },
        getTimestamp () {
            const endTime = dayjs(this.collageDetailData.endTime).unix();
            const nowTime = dayjs().unix();
            this.timestamp = endTime - nowTime;
        },
        async handleJoin() {
          // 验证身份认证
          uni.vibrateShort({})
          if(!getApp().globalData.userInfo) {
              getUserProfile("/pages/home/collage/collage-detail", () => {
                  this.$u.route("/pages/sign/sign");
              });
              return false;
          }
          
          if(getApp().globalData.userInfo.riskAuditStatus != 1 && getApp().globalData.userInfo.riskAuditStatus != 5) {
              uni.showModal({
                  title: '提示',
                  content: '身份认证后可用车',
                  showCancel: false,
                  confirmText: '去认证',
                  success: (res) => {
                      if(res.confirm) {
                          this.$u.route('/pages/mine/identity/identity')
                      }
                  }
              });
              return false;
          }
          
          // 1. 订阅订单创建
          // uni.vibrateShort({})
          uni.showLoading({
              title: '订单创建中'
          });
          const result = await this.$getRequest(this.$url.createSubscribeOrder, 'POST', {
              "carSubscribeId": this.prodId || this.collageDetailData.businessId,
              "userId": getApp().globalData.userInfo.id,
              "groupBuyId": this.collageDetailData.id
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
          this.$u.route(`/pages/ordered/sub-order-info?id=${result.data.id}`)
        }
    }
};
</script>

<style lang="scss">
    .collage-detail {
        .u-countdown-item {
            display: inline-block;
            width: 56rpx;
            height: 56rpx;
            background: #FFFFFF;
            border: 2rpx solid rgba(10, 15, 45, 0.3);
            box-sizing: border-box;
            border-radius: 8rpx;
            // background: #0A0F2D;
        }
        .u-countdown-colon {
            display: inline-block;
            width: 40rpx;
            height: 56rpx;
            // color: #FFFFFF;
        }
    }
</style>
<style lang="scss" scoped>
    .collage-detail {
        width: 100%;
        padding: 0;

        .info {
            padding: 50rpx 48rpx 32rpx;
            &-top {
                .left {
                    font-style: normal;
                    font-weight: normal;
                    font-size: 28rpx;
                    line-height: 56rpx;
                    text-align: center;
                    color: #0A0F2D;
                    // .time {
                    //     display: inline-block;
                    //     width: 56rpx;
                    //     height: 56rpx;
                    //     background: #FFFFFF;
                    //     border: 2rpx solid rgba(10, 15, 45, 0.3);
                    //     box-sizing: border-box;
                    //     border-radius: 8rpx;
                    // }
                    // .colon {
                    //     display: inline-block;
                    //     width: 40rpx;
                    //     height: 56rpx;
                    // }
                }
                .right {
                    &-text {
                        font-family: PingFang SC;
                        font-style: normal;
                        font-weight: 500;
                        font-size: 28rpx;
                        line-height: 44rpx;
                    }
                    &-price {
                        margin-top: 6rpx;
                        font-family: DIN;
                        font-style: normal;
                        font-weight: bold;
                        font-size: 40rpx;
                        line-height: 40rpx;
                        color: #F5194B;
                    }
                }
            }
            &-progress {
                padding: 20rpx 0rpx 12rpx;
            }
            &-bottom {
                font-size: 24rpx;
                line-height: 40rpx;
                color: rgba(10, 15, 45, 0.5);
            }
        }

        .flow {
            &-head {
                
            }
            &-list {
                height: 120rpx;
                padding: 24rpx;
                border-radius: 16rpx;
                background: rgba(10, 15, 45, 0.04);
                .item {
                    &-icon {
                        flex: 1;
                        min-width: 0rpx;
                        text-align: center;
                    }
                    &-block {
                        width: 128rpx; 
                        display: flex;
                    }

                    &-index {
                        height: 36rpx;
                        margin-right: 8rpx;
                        display: flex;
                        align-items: center;
                            // line-height: 36rpx;
                        &-text {
                            display: inline-block;
                            width: 24rpx;
                            height: 24rpx;
                            border-radius: 24rpx;
                            background: rgba(10, 15, 45, 0.08);
                            text-align: center;
                            font-size: 20rpx;
                            font-weight: 500;
                            color: #0A0F2D;
                        }
                    }
                    &-content {
                        &-top,
                        &-bottom {
                            font-size: 24rpx;
                            line-height: 36rpx;
                            color: #000000;
                        }
                    }
                }
            }
        }

        .members {
            &-list {
                flex-wrap: wrap;
                .item {
                    width: 20%;
                    margin-bottom: 32rpx;
                    text-align: center;
                    &-inner {
                        display: inline-block;
                        width: 104rpx;
                        height: 104rpx;
                        border-radius: 52rpx;
                        // background-color: #aaaaaa;
                        position: relative;
                        &-img {
                            position: absolute;
                            top: 0rpx;
                            right: 0rpx;
                            width: 104rpx;
                            height: 104rpx;
                            border-radius: 52rpx;
                            overflow: hidden;
                        }
                        &-icon {
                            position: absolute;
                            top: 0rpx;
                            right: 0rpx;
                            width: 28rpx;
                            height: 28rpx;
                            border-radius: 28rpx;
                            background-color: #0AEB7D;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                }
            }
        }

        .box {
            width: 100%;
            padding: 32rpx 40rpx;
            &-head {
                line-height: 48rpx;
                font-size: 34rpx;
                font-weight: 600;
                align-items: center;
                &-icon {
                    height: 48rpx;
                    line-height: 56rpx;
                }
                &-name {
                    margin-left: 14rpx;
                }
            }
            &-bottom {
                margin-top: 32rpx;
            }
        }
    }
</style>
