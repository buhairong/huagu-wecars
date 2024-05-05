<template>
    <view class="collage-item">
        <!-- 外层 -->
        <view class="collage-item-wrap">
            <!-- 背景色的部分 -->
            <view class="collage-item-wrap-card">
                <!-- 图片和倒计时 -->
                <view class="box">
                    <view class="box-image">
                        <u-image
                            width="272rpx"
                            height="116rpx"
                            :src="collageDetailData.imageUrl"
                        />
                    </view>
                    <view class="box-timestamp u-flex u-row-center">
                        <text>
                            倒计时：
                        </text>
                        <u-count-down
                            class="box-down-time"
                            :timestamp="timestamp"
                            :show-days="true"
                            padding="0"
                            separator="zh"
                            font-size="20"
                            color="rgba(10, 15, 45, 0.5)"
                            separator-size="20"
                            separator-color="rgba(10, 15, 45, 0.5)"
                        />
                    </view>
                </view>

                <!-- 内容 -->
                <view class="info">
                    <!-- 上 -->
                    <view class="info-top">
                        {{ `${collageDetailData.carBrand} ${collageDetailData.carType} ${collageDetailData.carTypeYearProduct}` }}
                    </view>

                    <!-- 中 -->
                    <view class="info-center">
                        <text class="label">
                            拼团价：
                        </text>
                        <text class="price">
                            {{ collageDetailData.price | $numToSeparator("") }}
                        </text>
                    </view>

                    <!-- 下 -->
                    <view class="info-bottom u-flex u-row-between">
                        <!-- 左 -->
                        <view class="info-bottom-left">
                            <!-- 进度 -->
                            <u-line-progress
                                class="progress"
                                :percent="collageDetailData.joinCount / collageDetailData.maxMember * 100"
                                height="12"
                                active-color="#0AEB7D"
                                inactive-color="rgba(10, 15, 45, 0.08)"
                                round
                                :show-percent="false"
                            />

                            <!-- 下 -->
                            <view class="bottom u-flex">
                                <view
                                    v-for="joinUserItem in collageDetailData.joinUser.slice(0, 3)"
                                    :key="joinUserItem.id"
                                    class="bottom-img"
                                >
                                    <u-image
                                        width="32rpx"
                                        height="32rpx"
                                        :src="joinUserItem.imageUrl"
                                    />
                                </view>

                                <text class="bottom-free u-font-24">
                                    {{ `还差${collageDetailData.free}人` }}
                                    <!-- {{ `还差${collageDetailData.maxMember - collageDetailData.joinCount}人` }} -->
                                </text>
                            </view>
                        </view>

                        <!-- 右 -->
						<!-- @click="goCollageDetailPage(collageDetailData.id)" -->
                        <view
                            class="info-bottom-right u-flex u-row-between"
                        >
                            <view class="foot-but-r u-flex-1 u-text-center">
                                去拼团
                                <text class="icon-r" />
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import dayjs from "dayjs"
export default {
    name: "CollageItem",
    components: {},
    props: {
        collageDetailData: {
            type: Object,
            default () {
                return {
                    joinUser: []
                };
            }
        }
    },
    data () {
        return {};
    },
    computed: {
        timestamp () {
            return this.getTimestamp()
        }
    },
    methods: {
        // 获得倒计时间戳
        getTimestamp () {
            const endTime = dayjs(this.collageDetailData.endTime).unix();
            const nowTime = dayjs().unix();
            const timestamp = (endTime - nowTime) || 0;
            return timestamp;
        },
        // 跳转拼团详情页
        goCollageDetailPage (id) {
            this.$u.route({
                url: `/pages/home/collage/collage-detail`,
                params: {
                    id
                }
            });
        }
    }
};
</script>

<style lang="scss">
    // .collage-item {
        .u-countdown-item {
            padding: 0rpx;
        }
        .u-countdown-colon {
            padding: 0rpx;
        }
    // }
</style>
<style lang="scss" scoped>
    .collage-item {
        width: 100%;
        height: 258rpx;
        &-wrap {
            width: 100%;
            height: 100%;
            padding-left: 68rpx;
            &-card {
                width: 100%;
                height: 100%;
                padding: 40rpx 24rpx 30rpx 284rpx;
                border-radius: 24rpx;
                background: rgba(10, 15, 45, 0.04);
                position: relative;

                .box {
                    position: absolute;
                    top: 32rpx;
                    left: -68rpx;
                    width: 320rpx;
                    height: 200rpx;
                    border-radius: 24rpx;
                    background: #FFFFFF;
                    box-shadow: -4rpx 16rpx 64rpx rgba(10, 15, 45, 0.02), 0rpx 32rpx 48rpx rgba(10, 15, 45, 0.04);
                    &-image {
                        width: 100%;
                        height: 140rpx;
                        padding: 24rpx 24rpx 0rpx;
                    }
                    &-timestamp {
                        padding: 12rpx 0rpx;
                        font-size: 20rpx;
                        color: rgba(10, 15, 45, 0.5);
                    }
                }

                .info {
                    width: 100%;
                    height: 100%;
                    &-top {
                        width: 100%;
                        height: 72rpx;
                        font-weight: 500;
                        font-size: 24rpx;
                        line-height: 36rpx;
                        color: #0A0F2D;
                    }

                    &-center {
                        width: 100%;
                        height: 56rpx;
                        line-height: 40rpx;
                        .label {
                            font-size: 24rpx;
                            line-height: 40rpx;
                            text-align: center;
                            color: #64696F;
                        }
                        .price {
                            font-size: 24rpx;
                            line-height: 40rpx;
                            font-weight: 500;
                            color: #08BD64;
                        }
                    }

                    &-bottom {
                        width: 100%;
                        height: 60rpx;
                        &-left {
                            width: 150rpx;
                            height: 56rpx;
                            position: relative;
                            top: -8rpx;
                            .progress {
                                height: 10rpx;
                            }
                            .bottom {
                                &-img {
                                    width: 32rpx;
                                    height: 32rpx;
                                    margin-left: -12rpx;
                                    border-radius: 32rpx;
                                    border: 4rpx solid #FFFFFF;
                                    background-color: red;
                                    overflow: hidden;
                                }
                                &-free {
                                    color: #64696F;
                                }
                            }
                        }
                        &-right {
                            width: 136rpx;
                            height: 56rpx;
                            background: #0A0F2D;
                            border-radius: 16rpx;
                            color: #fff;
                            .foot-but-r {
                                padding: 0rpx;
                                font-weight: 500;
                                font-size: 24rpx;
                                line-height: 40rpx;
                                .icon-r {
                                    width: 16rpx;
                                    height: 16rpx;
                                    margin-left: 8rpx;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
