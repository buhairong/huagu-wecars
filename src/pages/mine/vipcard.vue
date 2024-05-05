<template>
  <view class="vipPage u-padding-top-50 u-padding-bottom-50 u-padding-left-40 u-padding-right-40">
    <view
      class="m-card"
      v-for="(item, index) in cardList"
      :key="index"
      :class="'m-card-' + item.id"
    >
      <u-image
        :class="'crown' + item.id"
        style="position: absolute;right: 40rpx;margin-top: 180rpx;"
        mode="scaleToFit"
        src="https://image.51cheyaoshi.com/xcx/app/static/vip/crown.png"
        width="120rpx"
        height="120rpx"
      />
      <u-image
        :class="'vector1' + item.id"
        style="position: absolute;left: 40rpx;padding-top: 100rpx;"
        mode="scaleToFit"
        src="https://image.51cheyaoshi.com/xcx/app/static/vip/vector1.png"
        width="373rpx"
        height="188rpx"
      />
      <u-image
        :class="'vector1' + item.id"
        style="position: absolute;left: 40rpx;"
        mode="scaleToFit"
        src="https://image.51cheyaoshi.com/xcx/app/static/vip/vector2.png"
        width="405rpx"
        height="284rpx"
      />
      <view class="u-padding-left-40 u-padding-top-40 u-flex">
        <u-image
          mode="scaleToFit"
          :src="'https://image.51cheyaoshi.com/xcx/app/static/vip/vip'+item.id+'.png'"
          width="64rpx"
          height="40rpx"
        />
        <text class="m-txt">{{ item.productName }}</text>
      </view>
      <view class="u-padding-left-40 u-padding-right-40  u-flex u-row-between">
        <view class="u-padding-top-48">
          <text class="m-val">￥{{ item.price }}</text>
        </view>
        <view class="u-padding-top-28">
          <view class="m-tag" @click="payVip(item)">立即开通</view>
        </view>
      </view>
      <view class="u-padding-left-40 u-padding-top-16">
        <text v-if="item.giftAmount > 0" class="m-extra">立返{{ item.giftAmount }}元</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: null,
        cardList: [
          // { id: 1, productName: '白银会员', price: 30000, giftAmount: 1000, className: 'm-card-1' },
          // { id: 2, productName: '黄金会员', price: 50000, giftAmount: 1000, className: 'm-card-2' },
          // { id: 3, productName: '铂金会员', price: 100000, giftAmount: 1000, className: 'm-card-3' },
        ]
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
        const result = await this.$getRequest(this.$url.getVipProductList, 'POST', {})
        uni.hideLoading()
        this.cardList = result.data
      },
      async payVip(item) {
        // 验证身份认证
        uni.vibrateShort({})
        if(!getApp().globalData.userInfo) {
          this.$u.route("/pages/sign/sign")
          return false
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
        
        console.log(item)
        // 创建会员支付订单
        uni.vibrateShort({})
        // 提示拉起微信支付
        uni.showToast({
            title: '正在拉起微信支付',
            duration: 2000,
            icon: 'loading'
        });
        // 1.创建微信订单
        this.$requestPayment({
          // businessId: this.userInfo.id, 
          businessId: item.id, 
          businessType: 5, // 会员
          openid: this.userInfo.xcxOpenid,
          payType: '0', 
          total: item.price, // TODO 0.01 item.price
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
.vipPage {
  font-family: 'PingFang SC';
  .m-card {
    height: 284rpx;
    border-radius: 16rpx;
    margin-bottom: 40rpx;
    .m-txt {
      padding-left: 10rpx;
      font-weight: 800;
      font-size: 34rpx;
      text-align: center;
    }
    .m-val {
      font-weight: 600;
      font-size: 40rpx;
      text-align: center;
    }
    .m-tag {
      border-radius: 60rpx;
      padding: 6rpx 20rpx;
      font-weight: 800;
      font-size: 28rpx;
      line-height: 20px;
      text-align: center;
      color: #FFFFFF;
    }
    .m-extra {
      font-weight: 400;
      font-size: 24rpx;
      text-align: center;
      color: rgba(87, 88, 106, 0.8);
    }
  }
  .m-card-1 {
    background: linear-gradient(90.28deg, #A9B9E6 0.18%, #8C9DCC 100.77%);
    .m-txt, .m-val {
      color: #57586A;
    }
    .m-tag {
      background: linear-gradient(270deg, #778CC6 0%, #7E92C9 100%);
    }
  }
  .m-card-2 {
    background: linear-gradient(90.28deg, #FFF1DA 1.39%, #F9D094 100.76%);
    .m-txt, .m-val {
      color: #7E4837;
    }
    .m-tag {
      background: linear-gradient(270deg, #D59853 0%, #F8CA96 100%);
    }
  }
  .m-card-3 {
    background: linear-gradient(90.28deg, #D3B2B2 0.18%, #A37E80 100.77%);
    .m-txt, .m-val {
      color: #773F42;
    }
    .m-tag {
      background: linear-gradient(90deg, #A88385 0%, #8C6668 111.34%);
    }
  }
}
</style>