<!--
 * @Author: luchun
 * @Date:
 * @LastEditTime: 2022-02-27 17:37:38
 * @LastEditors: luchun
 * @Description: In User Settings Edit
-->
<template>
    <view class="content">
        <view>
            <!-- 下拉筛选栏 -->
            <!-- <van-dropdown-menu active-color="#CCBA85">
        <van-dropdown-item
          id="carTypeMenu"
          title="{{ topDroupdownMenu.carTitle }}"
          ref="item"
          bind:open="onClickChooseCartype"
        />
        <van-dropdown-item
          wx:for="{{ topDroupdownMenu.menuOptions }}"
          wx:for-index="mIndex"
          wx:key="mKey"
          value="{{ item.default }}"
          options="{{ item.menu }}"
          bind:change="changeDefaultMenu"
          popup-style="border-radius: 0 0 30rpx 30rpx;"
        />
      </van-dropdown-menu> -->
        </view>
        <view v-if="certifiedCarData.length == 0">
            <u-row
                class="u-row-center"
                style="margin-top: 40rpx;"
            >
                <u-col
                    span="4"
                    offset="4"
                    class="u-col-center"
                >
                    <view class="no-content">
                        暂无车源
                    </view>
                </u-col>
            </u-row>
        </view>
        <view
            v-for="(item, index) in certifiedCarData"
            :key="index"
            class="certified-car u-margin-top-20"
            @click="go2CertCarDetail(item.id)"
        >
            <u-row gutter="20">
                <u-col span="4">
                    <view class="car-img">
                        <u-image
                            width="100%"
                            height="100%"
                            :src="item.imageUrl"
                        />
                    </view>
                </u-col>
                <u-col span="8">
                    <view class="car-info">
                        <view class="brand u-line-1">
                            {{ item.carBrand }} {{ item.carType }} {{ item.carTypeYear }} | {{ item.carTypeYearProduct }}
                        </view>
                        <view class="box-info-text">
                            <text>{{ item.regDateStr }}</text>
                            <text style="margin: 0 8rpx">
                                /
                            </text>
                            <text>{{ item.milage | $transformNum }}</text>公里
                        </view>
                        <view class="box-info-text mt30 u-flex u-row-between">
                            <view class="price-color">
                                <text class="u-font-40">
                                    {{ (item.price/10000).toFixed(2) }}
                                </text>
                                <text class="u-font-24">
                                    万起
                                </text>
                            </view>
                            <view class="first-price">
                                <text class="u-font-10">
                                    首付{{ (item.minFirstPayment/10000).toFixed(1) }}万
                                </text>
                            </view>
                            <view class="box-info-text">
                                <u-tag
                                    :text="`${item.followCount}人关注`"
                                    plain
                                    shape="circle"
                                    color="rgba(10, 15, 45, 0.8)"
                                    bg-color="rgba(10, 15, 45, 0.04)"
                                    border-color="rgba(10, 15, 45, 0.04)"
                                />
                            </view>
                        </view>
                    </view>
                </u-col>
            </u-row>
        </view>
        <u-loadmore
            v-show="page > 1"
            :status="status"
            :load-text="loadText"
        />
    </view>
</template>

<script>
export default {
    data() {
        return {
            topDroupdownMenu: {
                carTitle: '车型',
                menuOptions: [
                    { menu: [
                          { text: '价格', value: 0 },
                          { text: '20万以下', value: 1 },
                          { text: '20万～30万', value: 2 },
                          { text: '30万～50万', value: 3 },
                          { text: '50万以上', value: 4 }
                      ],
                      default: 0
                    },
                    { menu: [
                          { text: '里程', value: 5 },
                          { text: '1万公里以下', value: 6 },
                          { text: '1万～3万', value: 7 },
                          { text: '3万～5万', value: 8 },
                          { text: '5万以上', value: 9 }
                      ],
                      default: 5
                    },
                    { menu: [
                          { text: '车龄', value: 10 },
                          { text: '1年以下', value: 11 },
                          { text: '1年～2年', value: 12 },
                          { text: '2年～3年', value: 13 },
                          { text: '3年以上', value: 14 }
                      ],
                      default: 10
                    },
                    { menu: [
                          { text: '排放', value: 15 },
                          { text: '国五', value: 16 },
                          { text: '国六', value: 17 }
                      ],
                      default: 15
                    }
                ],
                sortQuery: [
                    { pricefrom: '', priceto: '' },
                    { pricefrom: 0, priceto: 20 },
                    { pricefrom: 20, priceto: 30 },
                    { pricefrom: 30, priceto: 50 },
                    { pricefrom: 50, priceto: '' },
                    { tripfrom: '', tripto: '' },
                    { tripfrom: '', tripto: '1' },
                    { tripfrom: '1', tripto: '3' },
                    { tripfrom: '3', tripto: '5' },
                    { tripfrom: '5', tripto: '' },
                    { carage: '' },
                    { carage: '1' },
                    { carage: '2' },
                    { carage: '3' },
                    { carage: '99' },
                    { carstd: '' },
                    { carstd: '国五' },
                    { carstd: '国六' }
                ]
            },

            cityId: 0,
            certifiedCarData: [],

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
    onLoad(option) {
        if(option) {
            // this.carTypeYearProductId = +option.id
            this.cityId = +option.cityId
        }
        this.fetchCertifiedCar();
    },
    methods: {
        async fetchCertifiedCar(page = 1) {
            const pageThis = this
            const certifiedCar = await this.$getRequest(
                this.$url.getCertifiedCar,
                "POST",
                {
                    cityId: pageThis.cityId,
                    page,
                }
            );
            this.certifiedCarData = this.certifiedCarData.concat(certifiedCar.data.records)
            this.totalPages = certifiedCar.data.pages
            this.page = certifiedCar.data.current
            this.status = 'loadmore'
        },
        go2CertCarDetail(id) {
            this.$u.route(`/pages/home/certcar/detail?id=${id}&cityId=${this.cityId}`);
        },
    },
    onReachBottom() {
        if(this.page >= this.totalPages) {
            this.status = 'nomore';
            return;
        }
        this.status = 'loading';
        this.page = ++ this.page;
        this.fetchCertifiedCar(this.page);
        if(this.page >= this.totalPages) {
            this.status = 'nomore';
        }
    },
}
</script>

<style lang="scss" scoped>
.mt30 {
    margin-top: 30rpx;
}
.price-color {
    color: #f51a4e;
}
.no-content {
    margin-top: 40rpx;
    text-align: center;
    font-size: 28rpx;
}
.certified-car {
    padding: 0 8rpx;
    margin-bottom: 26rpx;
    &:last-child {
        margin-bottom: 0;
    }
    &:first-child {
        margin-top: 40rpx;
    }
    .car-img {
        width: 110rpx * $double;
        height: 76rpx * $double;
    }
    .car-info {
        padding: 0 12rpx;
        .brand {
            font-size: 28rpx;
            color: rgba(10, 15, 45, 0.8);
            line-height: 44rpx;
            font-weight: 500;
        }
        .box-info-text {
            font-size: 24rpx;
            line-height: 36rpx;
            color: rgba(10, 15, 45, 0.8);
        }
        .first-price {
            color: rgba(10, 15, 45, 0.5);
        }
    }
}
.custom-margin-t {
    margin-top: -20rpx;
}
</style>
