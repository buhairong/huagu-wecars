<template>
  <view class="carlife">
    <!-- <view
      class="status-bar"
      :style="{ height: custom.top + 'px' }"
    />
    <view class="u-flex">
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
    <view class="m-store-content">
      <view class="u-flex u-text-center" style="overflow-x: scroll;">
        <!-- <scroll-view scroll-x class="model-scroll" :scroll-into-view="'toView_' + tabCurrent"> -->
          <view
            v-for="(item, index) in tabIcon"
            :key="index"
            class="u-flex-1 u-margin-right-40"
            @click="changeSearchType(item.id)"
          >
            <view v-if="tabCurrent == item.id" class="m-on-view">
              <view class="m-icon-on">
                <u-image
                  width="60rpx"
                  height="60rpx"
                  :src="item.icon_on"
                />
              </view>
              <view class="u-font-24">
                <text>{{ item.name }}</text>
              </view>
            </view>
            <view v-if="tabCurrent != item.id" class="m-off-view">
              <view  class="m-icon-off">
                <u-image
                  width="60rpx"
                  height="60rpx"
                  :src="item.icon_off"
                />
              </view>
              <view class="u-font-24">
                <text>{{ item.name }}</text>
              </view>
            </view>
          </view>
        <!-- </scroll-view> -->
      </view>
      <view class="m-store-list">
        <u-gap
          height="50"
          bg-color="#FFFFFF"
        />
        <view v-if="list && list.length == 0">
          <u-empty
            text="暂无门店列表"
            mode="list"
          />
        </view>
        <view
          v-for="(item, index) in list"
          :key="index"
          class="item"
          @click="handleDetail(item)"
        >
          <view class="u-flex">
            <view class="">
              <view class="title">
                <view class="name">
                    {{ item.name }}
                </view>
              </view>
              <view class="address">
                {{ item.address }}
              </view>
            </view>
            <view class="u-flex">
              {{ item.telephone }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <u-loadmore
      v-show="page > 1"
      :status="status"
      :load-text="loadText"
    />
  </view>
</template>

<script>
  const app = getApp();
  export default {
    data() {
      return {
        custom: app.globalData.custom,
        userInfo: null,
        // current: 0,
        // list: [{
        //     name: '爱车'
        // }, {
        //     name: '门店'
        // }, {
        //     name: '商城',
        // }],
        tabCurrent: 1,
        tabIcon: [
          {id: 1, name: '加油', icon_off: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab1_off.png', icon_on: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab1_on.png'},
          {id: 2, name: '充电', icon_off: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab2_off.png', icon_on: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab2_on.png'},
          {id: 3, name: '洗车', icon_off: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab3_off.png', icon_on: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab3_on.png'},
          {id: 4, name: '美容', icon_off: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab4_off.png', icon_on: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab4_on.png'},
          {id: 5, name: '保养', icon_off: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab5_off.png', icon_on: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab5_on.png'},
          {id: 6, name: '检修', icon_off: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab6_off.png', icon_on: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/tab6_on.png'},
        ],
        list: [
          { address: '徐汇区龙华中路', area: '徐汇区', city: '上海市', name: '中国石化加油站(望京新城站)', province: '上海市', telephone: '021-60718488' },
          { address: '徐汇区龙华中路', area: '徐汇区', city: '上海市', name: '中国石化加油站(望京新城站)', province: '上海市', telephone: '021-60718488' },
          { address: '徐汇区龙华中路', area: '徐汇区', city: '上海市', name: '中国石化加油站(望京新城站)', province: '上海市', telephone: '021-60718488' },
        ],
        status: 'loadmore', // 加载更多 状态
        page: 0, // 第N页
        totalPages: 0, // 总页数
        loadText: {
          loadmore: '轻轻上拉',
          loading: '努力加载中',
          nomore: '实在没有了'
        }
      }
    },
    onShow(){
      // this.list = []
      this.page = 0
      this.totalPages = 0
      app.globalData.getUserInfo((data) => {
          this.userInfo = data;
          this.userId = data.id;
      })
    },
    onLoad() {
      // 初始化地理位置
      this.getLocat()
    },
    methods: {
      getLocat() {
        const pageThis = this
        uni.getLocation({
          type: 'gcj02', //返回可以用于uni.openLocation的经纬度
          success: function (res) {
            console.log(res)
            let lat
            let lng
            if (res.errMsg != 'getLocation:ok') {
              let lat = 31.18826
              let lng = 121.43687
            }
            lat = res.latitude;
            lng = res.longitude;
            pageThis.getStoreList(lat, lng)
          },
        })
      },
      async getStoreList(lat,lng) {
        const res = await this.$getRequest(this.$url.getGasStation, "POST", {
          page: this.page,
          "lat": lat,
          "lng": lng
        });
        if (res.data && res.data.records) {
          this.list = this.list.concat(res.data.records)
          this.totalPages = res.data.pages
          this.page = res.data.current
          this.status = 'loadmore'
        }
      },
      changeSearchType(index) {
        uni.showLoading({
          title: '加载中'
        })
        console.log(index)
        this.tabCurrent = index
        // TODO
        uni.hideLoading()
      }
    },
    onReachBottom() {
      // if(this.page >= this.totalPages) {
      //     this.status = 'nomore';
      //     return;
      // }
      // this.status = 'loading';
      // this.page = ++ this.page;
      // setTimeout(() => {
      //     this.getStoreList(this.page)
      //     if(this.page >= this.totalPages) {
      //         this.status = 'nomore';
      //     }
      // }, 2000)
    },
  }
</script>

<style lang="scss" scoped>
.carlife {
  .m-store-content {
    padding: 40rpx;
    
    .m-on-view {
      text {
        font-weight: 500;
        font-size: 12px;
        color: #0A0F2D;
      }
    }
    .m-icon-on {
      width: 96rpx;
      height: 96rpx;
      background: rgba(10, 15, 45, 0.08);
      box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.04);
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      margin-bottom: 16rpx;
    }
    .m-off-view {
      text {
        font-weight: 400;
        font-size: 12px;
        color: rgba(10, 15, 45, 0.5);
      }
    }
    .m-icon-off {
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
  }
  .item {
      background: #FFFFFF;
      box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.04);
      border-radius: 24rpx;
      margin-top: 24rpx;
      padding: 36rpx 30rpx;
      position: relative;
      .title {
        font-weight: 500;
        font-size: 15px;
        colos: rgba(10, 15, 45, 0.8);
      }
      .address {
        font-weight: 400;
        font-size: 12px;
        color: rgba(10, 15, 45, 0.5);
      }
  }
}
</style>
