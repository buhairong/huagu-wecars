<!--
 * @Author: lufeng
 * @Date: 2021-11-01 17:52:29
 * @LastEditTime: 2021-11-26 19:35:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /butler-super/src/pages/index/index.vue
-->
<template>
    <view class="mobile-sign">
        <view class="mobile-sign-t">
            输入验证码
        </view>
        <view class="mobile-sign-text">
            验证码已发送至 xxx 
        </view>
        <view class="mobile-box u-flex u-row-between">
            <view class="mobile-box-warp">
                <u-message-input
                    width="130"
                    class="mobile-box-item"
                    mode="box"
                    :focus="true"
                />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "MobileSign",
    data() {
        return {
            
        };
    },
    onLoad() {
    },
    methods: {
        handleLogin(e) {
            console.log(e);
        }
    },
};
</script>

<style lang="scss" scoped>
    .mobile-sign {
        padding: 0 40rpx;
        .mobile-sign-t {
            margin-top: 90rpx;
            color: #0A0F2D;
            font-size: 56rpx;
        }
        .mobile-sign-text {
            color: rgba(10, 15, 45, 0.5);
            font-size: 28rpx;
            margin-top: 8rpx;
        }
        .mobile-box {
            border-radius: 16px;
            padding: 38rpx 32rpx;
            margin-top: 80rpx;
            margin-bottom: 24rpx;
            .send-code {
                color: rgba(10, 15, 45, 0.3);
                font-size: 28rpx;
            }
            .mobile-box-value {
                color: #0A0F2D;
            }
        }
    }
    .mobile-box-warp {
        width: 100%;
    }
    .mobile-box ::v-deep .u-char-box {
        width: 100%;
    }
    .mobile-box ::v-deep .u-box {
        width: 100%;
        background: rgba(10, 15, 45, 0.04);
        border: none;
        border-radius: 16rpx;
    }
   
</style>
