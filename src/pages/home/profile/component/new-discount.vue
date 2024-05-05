<!--
 * @Author: your name
 * @Date: 2022-01-12 15:57:57
 * @LastEditTime: 2022-01-14 13:19:14
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-wecars/src/pages/home/profile/component/new-discount.vue
-->
<template>
    <view class="new-discount u-padding-bottom-120">
        <view class="card">
            <view class="u-flex u-border-bottom u-p-b-32">
                <view>
                    <u-image
                        class="car-brand-logo"
                        width="88rpx"
                        height="88rpx"
                        mode="aspectFit"
                        :src="projectInfo.imageUrl"
                    />
                </view>
                <view class="u-padding-left-24">
                    <view class="u-font-30 fw">
                        {{ projectInfo.carBrand }}
                        {{ projectInfo.carTypeYearProduct }}
                    </view>
                    <view class="u-font-28">
                        指导价：{{ projectInfo.guidancePrice | $transformNum() }}
                    </view>
                </view>
            </view>
            <view
                v-for="(item, index) in list4s"
                :key="index"
                class="u-padding-top-32 u-border-bottom u-p-b-24"
            >
                <view class="item">
                    <view class="u-flex u-row-between">
                        <view class="fw u-font-28">
                            {{ item.shopName }}
                        </view>
                        <view class="price">
                            {{ item.price |$transformNum }}起
                        </view>
                    </view>
                    <view class="u-flex u-row-between u-font-24 u-padding-top-8">
                        <view class="address">
                            {{ (item.distance/1000).toFixed(1) }} km | {{ item.address }}
                        </view>
                        <view
                            class="map-text"
                            @click="lookMap"
                        >
                            查看地图
                        </view>
                    </view>
                    <!-- <view class="u-font-24 u-padding-top-4">
                        营业时间：09:00 - 20:00（营业中）
                    </view> -->
                    <view class="u-flex u-font-24 u-padding-top-16 u-row-between">
                        <view class="u-flex-1 divider-x u-text-left">
                            <u-icon
                                name="thumb-up"
                            />
                            <text class="ml12">
                                免费试驾
                            </text>
                        </view>
                        <view class="u-flex-1 divider-x u-text-center">
                            <u-icon
                                name="chat"
                            />
                            <text class="ml12">
                                在线咨询
                            </text>
                        </view>
                        <view
                            class="u-flex-1 u-text-right"
                            @click="callPhone(item.phone)"
                        >
                            <u-icon
                                name="phone"
                            />
                            <text class="ml12">
                                要求回电
                            </text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view
            class="foot-but foot-sticky u-flex"
            @click="handleEmit"
        >
            <view class="foot-but-r u-flex-1 u-text-center">
                获取底价
                <text class="icon-r" />
            </view>
        </view>
    </view>
</template>
<script>
export default {
    name: "NewDiscount",
    props: {
        projectInfo: {
            type: Object,
            default: () => {
                return {};
            }
        },
        list4s: {
            type: Array,
            default: () => {
                return [];
            }
        },
        location: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data () {
        return {
        }
    },
    mounted() {
        // this.getLocation()
    },
    methods: {
        handleEmit() {
            this.$emit('click')
        },
        lookMap() {
            uni.openLocation({
                latitude: Number(this.location.lat),
                longitude: Number(this.location.lng),
                success: function () {
                    console.log('success');
                }
            });
        },
        getLocation() {
            uni.getLocation({
                type: 'wgs84',
                success: async (res) => {
                    this.lat = res.latitude
                    this.lng = res.longitude
                    console.log('当前位置的经度：' + res.longitude);
                    console.log('当前位置的纬度：' + res.latitude);
                    // this.get4sList()
                },
                fail: async (err) =>{
                    // this.get4sList()
                }
            });
        },
        callPhone(phoneNumber) {
            uni.makePhoneCall({
                phoneNumber
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.ml12 {
    margin-left: 12rpx;
}
.new-discount {
    
}
.card {
    margin: 0 32rpx;
    margin-top: 24rpx;
    background: #ffffff;
    box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
        0px 8px 24px rgba(10, 15, 45, 0.06);
    border-radius: 24rpx;
    padding: 36rpx 32rpx;
    .divider-x {
        &:after {
            top: 0rpx;
        }
    }
    .price {
        font-size: 28rpx;
        font-weight: bold;
        line-height: 44rpx;
        color: #F5194B;
    }
    .address {
        white-space: nowrap;
        overflow:hidden;
        text-overflow: ellipsis;
    }
    .map-text {
        color: #198BF5;
        white-space: nowrap;
    }
}
</style>
