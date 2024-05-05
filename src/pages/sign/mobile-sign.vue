<!--
 * @Author: lufeng
 * @Date: 2021-11-01 17:52:29
 * @LastEditTime: 2021-11-26 21:59:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /butler-super/src/pages/index/index.vue
-->
<template>
    <view class="mobile-sign">
        <view class="mobile-sign-t">
            输入手机号码
        </view>
        <view class="mobile-sign-text">
            为了方便取得联系，请输入您的常用手机号码
        </view>
        <view class="mobile-box u-flex u-row-between">
            <u-input
                v-model="mobile"
                type="number"
                :border="false"
                maxlength="11"
                class="u-flex-1 mobile-box-value"
                @input="handleInput"
            />
            <view>
                <view
                    v-if="isSms"
                    class="send-code"
                    @click="handleSend"
                >
                    获取验证码
                </view>
                <view v-else>
                    {{ sms }} S
                </view>
            </view>
        </view>
        <view>登录即代表您已同意<text @click="showUserProtocol">《车要试出行用户协议》</text></view>
    </view>
</template>

<script>
export default {
    name: "MobileSign",
    data() {
        return {
            userProtocolUrl: 'https://www.51cheyaoshi.com/applet/protocol/privacy.pdf',
            mobile: '',
            code: '',
            isSms: true,
            sms: 60,
        };
    },
    onLoad() {
    },
    methods: {
      showUserProtocol () {
        this.$goHtml(this.userProtocolUrl, '')
      },
        async handleSend() {
            if(!this.mobile && this.mobile.length != 11) {
                uni.showToast({
                    title: '请输入11位手机号',
                    duration: 1000,
                    icon: 'none'
                });
                return false;
            }


            uni.vibrateShort({})

            uni.showLoading({
                title: '加载中'
            });
            const data = await this.$getRequest(this.$url.getIdentifyingCode, 'POST', {
                mobile: this.mobile
            })

            uni.hideLoading();
            if(data.code != 0) {
                uni.showToast({
                    title: '验证码获取失败，请重试',
                    duration: 1500
                });  
            } else {
                this.isSms = false;
                this.timer = setInterval(() => {
                    if (--this.sms <= 0) {
                        this.sms = 60;
                        this.isSms = true;
                        clearInterval(this.timer);
                    }
                }, 1000);
                uni.showToast({
                    title: '验证码已发送',
                    duration: 1500
                });
            }

            
        },
        
        handleLogin(e) {
            console.log(e);
        },
        handleInput() {
            uni.vibrateShort({})
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
            background: rgba(10, 15, 45, 0.04);
            border-radius: 16px;
            padding: 38rpx 32rpx;
            margin-top: 80rpx;
            margin-bottom: 24rpx;
            .send-code {
                color: #0A0F2D;
                font-size: 28rpx;
            }
            .mobile-box-value {
                color: #0A0F2D;
            }
        }
    }
   
</style>
