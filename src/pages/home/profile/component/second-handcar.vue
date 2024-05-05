<!--
 * @LastEditors: Please set LastEditors
-->
<template>
    <view class="mt-20 u-padding-bottom-120">
        <view class="card">
            <view
                v-for="(item, index) in list"
                :key="index"
                class="certified-car"
                @click="go2CertCarDetail(item.id)"
            >
                <u-row
                    gutter="20"
                >
                    <u-col span="4">
                        <view class="car-img">
                            <u-image
                                width="100%"
                                border-radius="16"
                                height="100%"
                                :src="item.imageUrl"
                            />
                        </view>
                    </u-col>
                    <u-col span="8">
                        <view class="car-info u-margin-left-24">
                            <view class="brand u-line-1">
                                {{ item.title }}
                            </view>
                            <view class="box-info-text">
                                <text>
                                    {{ item.regDateStr }}
                                </text>
                                <text style="margin: 0 8rpx">
                                    /
                                </text>
                                <text>{{ item.milage | $transformNum }}</text>公里
                            </view>
                            <view
                                class="box-info-text mt30 u-flex u-row-between"
                            >
                                <view class="price-color">
                                    <text class="u-font-40">
                                        {{ (item.price/10000).toFixed(2) }}
                                    </text>
                                    <text class="u-font-24">
                                        万起
                                    </text>
                                </view>
                                <view
                                    class="tag"
                                    @click="handleOnLine"
                                >
                                    <view class="foot-but-r u-flex-1 u-text-center">
                                        在线沟通
                                        <text class="icon-r" />
                                    </view>
                                </view>
                            </view>
                        </view>
                    </u-col>
                </u-row>
            </view>
        </view>
        <view
            class="foot-but foot-sticky u-flex"
            @click="handleEmit"
        >
            <view class="foot-but-r u-flex-1 u-text-center">
                委托找车
                <text class="icon-r" />
            </view>
        </view>
    </view>
</template>
<script>
export default {
    name: "SecondHandCar",
    props: {
        list: {
            type: Array,
            default: () => {
                return [];
            }
        },
    },
    methods: {
      go2CertCarDetail(id) {
        this.$u.route(`/pages/home/certcar/detail?id=${id}`);
      },
        handleEmit() {
            this.$emit('click')
        },
        handleOnLine() {
            this.$emit('onClickLine')
        }
    }
}
</script>
<style lang="scss" scoped>
.mt-20 {
    margin-top: -20rpx;
    .card {
        margin: 0 32rpx;
        margin-top: 24rpx;
        background: #ffffff;
        box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
            0px 8px 24px rgba(10, 15, 45, 0.06);
        border-radius: 24rpx;
        padding: 32rpx 32rpx;
    }
}
.price-color {
    color: #f51a4e;
}
.mt30 {
    margin-top: 30rpx;
}
.certified-car {
    // padding: 0 8rpx;
    margin-bottom: 32rpx;
    &:last-child {
        margin-bottom: 0;
    }
    &:first-child {
        // margin-top: 40rpx;
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
        .tag {
            width: 156rpx;
            height: 48rpx;
            border-radius: 8rpx;
            border: 2rpx solid rgba(10, 15, 45, 0.08);
            color: rgba(10, 15, 45, 0.8);
            .foot-but-r {
                padding: 0rpx;
                font-size: 24rpx;
                line-height: 46rpx;
                .icon-r {
                    width: 16rpx;
                    height: 16rpx;
                    margin-left: 8rpx;
                }
            }
        }
    }
}
</style>
