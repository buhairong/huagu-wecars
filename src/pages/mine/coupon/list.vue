<!--
 * @LastEditors: Please set LastEditors
-->
<template>
    <view class="coupon-list">
        <view
            v-if="list && list.length == 0"
        >
            <u-gap
                height="200"
                bg-color="#FFFFFF"
            />
            <u-empty
                text="暂无优惠券"
                mode="list"
            />
        </view>
        <view
            v-for="(item, index) in list"
            :key="index"
            class="item"
        >
            <view class="title u-flex u-row-between">
                <view class="name">
                    {{ item.couponName }}
                </view>
                <view class="discount">
                    <text>{{ item.discountRate/10 }}</text>折
                </view>
            </view>
            <view class="term u-flex u-row-between">
                <view class="time">
                    有效期至：{{ item.enableTime }}
                </view>
                <view class="highest">
                    最高优惠{{ item.amount * item.discountRate / 100 }}元
                </view>
            </view>
            <view class="rule u-flex u-row-between">
                <view>
                    使用限制：{{ item.explainContent }}
                </view>
                <view
                    v-if="item.notice"
                    class="expired-tag"
                >
                    明日过期
                </view>
            </view>
            <view class="logos">
                <u-image
                    width="100%"
                    height="100%"
                    src="https://image.51cheyaoshi.com/xcx/app/static/coupon_1.png"
                />
            </view>
        </view>
        <!-- <view class="other-btu">
            查看其它不可用
        </view> -->
    </view>
</template>
<script>
export default {
    name: 'ConponList',
    data() {
        return {
            list: []
        }
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
            this.userId = data.id;

            this.getCoupons(data.id)
        })
    },
    methods: {
        async getCoupons(userId, page) {
            const res = await this.$getRequest(this.$url.getCouponList, 'POST', {
                userId
            })
            this.list = res.data
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/components/coupon.scss';
    // .coupon-list {
    //     padding: 0 32rpx;
    //     .item {
    //         padding: 40rpx 32rpx 24rpx 32rpx;
    //         background: rgba(10, 15, 45, 0.04);
    //         border-radius: 24rpx;
    //         margin-top: 24rpx;
    //         position: relative;
    //         .title {
    //             font-weight: 500;
    //             font-size: 34rpx;
    //             color: #0A0F2D;
    //         }
    //         .discount {
    //             color: #F5194B;
    //             font-weight: 500;
    //             font-size: 34rpx;
    //             vertical-align: top;
    //             text {
    //                 font-size: 72rpx;
    //             }

    //         }
    //         .term {
    //             .time {
    //                 color: rgba(10, 15, 45, 0.8);
    //                 font-size: 24rpx;
    //             }
    //             .highest {
    //                 font-size: 24rpx;
    //                 color: #F5194B;
    //             }
    //         }
    //         .rule {
    //             font-size: 24rpx;
    //             color: rgba(10, 15, 45, 0.5);
    //             margin-top: 16rpx;
    //             padding-top: 16rpx;
    //             border-top: 1px dashed rgba(10, 15, 45, 0.08);
    //         }
    //         .logos {

    //             position: absolute;
    //             border-radius: 24rpx 0px;
    //             width: 170rpx;
    //             height: 40rpx;
    //             top: 0;
    //             left: 0;
    //             z-index: 1;
    //         }
    //         .expired-tag {
    //             padding: 4rpx 8rpx;
    //             background: #F5194B;
    //             border-radius: 8rpx;
    //             color: #FFFFFF;
    //             font-size: 24rpx;
    //             line-height: 40rpx;
    //             text-align: center;
    //         }

    //     }
    //     .other-btu {
    //         background: rgba(10, 15, 45, 0.04);
    //         border-radius: 16rpx;
    //         font-size: 30rpx;
    //         color: #0A0F2D;
    //         padding: 26rpx 0;
    //         text-align: center;
    //         margin-top: 48rpx;
    //         font-weight: 500;
    //         // position: fixed;
    //         // bottom: 100rpx;
    //         // width: 94%;
    //         // left: 0;
    //         // right: 0;
    //         // z-index: 11;
    //         // margin: 0 auto;

    //     }
    // }
</style>
