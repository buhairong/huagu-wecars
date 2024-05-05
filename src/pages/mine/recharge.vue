<template>
  <view class="rechargePage">
    <view>
      <u-row gutter="5">
        <u-col
          v-for="(item, index) in rechargeList"
          :key="index"
          span="4"
        >
          <view
            class="item u-margin-20"
            :class="active == index ? 'active' : ''"
            @click="clickAmount(index)"
          >
            <view class="icon">
              <u-icon
                name="checkbox-mark"
                color="#fff"
                size="16"
              />
            </view>
            <view class="item-amount">
              {{ item.amount | $numFormat }}
            </view>
            <view v-if="item.giftAmount > 0" class="item-gif">
              返{{ item.giftAmount }}
            </view>
          </view>
        </u-col>
      </u-row>
    </view>
    <view
      class="foot-sticky u-margin-left-32 u-margin-right-32 foot-but u-flex u-row-between"
      @click="handlePayAmount"
    >
      <view class="foot-but-l">
        总计：￥<text class="price">{{ payAmount | $numFormat }}</text>
      </view>
      <view class="foot-but-r">立即充值<text class="icon-r" /></view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        active: 0,
        payAmount: 0,
        rechargeId: 0,
        userInfo: null,
        rechargeList: []
      }
    },
    onShow() {
      getApp().globalData.getUserInfo((data) => {
        console.log(data);
        this.userInfo = data;
      })
    },
    onLoad() {
      this.init()
    },
    methods: {
      async init() {
        uni.showLoading({
            title: '加载中'
        });
        const result = await this.$getRequest(this.$url.getRechargeList, 'POST', {})
        uni.hideLoading()
        this.rechargeList = this.rechargeList.concat(result.data);
        this.payAmount = this.rechargeList[0].amount
        console.log(result);
      },
      clickAmount(index) {
        this.active = index;
        this.payAmount = this.rechargeList[index].amount
        this.rechargeId = this.rechargeList[index].id
      },
      handlePayAmount() {
        // 验证身份认证
        uni.vibrateShort({})
        if(!getApp().globalData.userInfo) {
          this.$u.route("/pages/sign/sign")
          return false;
        }
        
        if(getApp().globalData.userInfo.riskAuditStatus != 1 && getApp().globalData.userInfo.riskAuditStatus != 5) {
          uni.showModal({
            title: '提示',
            content: '身份认证后可开通会员',
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
        
        // 提示拉起微信支付
        uni.showToast({
            title: '正在拉起微信支付',
            duration: 2000,
            icon: 'loading'
        });
        // 1.创建微信订单
        this.$requestPayment({
          // businessId: this.userInfo.id, 
          businessId: this.rechargeId,
          businessType: 0, // 充值
          openid: this.userInfo.xcxOpenid,
          payType: '0', 
          total: this.payAmount, // TODO 0.01 this.payAmount
          userId: this.userInfo.id,
        }, (res) => {
          if(res == 'success') {
            // 支付成功 刷新数据
            this.$u.route({
              type: 'navigateBack',
              delta: 1,
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rechargePage {
    padding: 30rpx 30rpx;
    .item {
      height: 150rpx;
      // margin: 12rpx 0;
      padding: 34rpx 0;
      background: #ffffff;
      border: 1px solid rgba(10, 15, 45, 0.3);
      box-sizing: border-box;
      border-radius: 8rpx;
      text-align: center;
      position: relative;
      font-size: 24rpx;
      color: rgba(10, 15, 45, 0.8);
      .item-amount {
        font-weight: 700;
        font-size: 32rpx;
        text-align: center;
        color: #0A0F2D;
      }
      .item-gift {
        font-weight: 400;
        font-size: 24rpx;
        text-align: center;
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
      .item-amount {
      }
      .item-gift {
      }
      .icon {
        display: block;
      }
    }
  }
</style>
