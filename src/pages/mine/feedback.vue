<!--
 * @Author: your name
 * @Date: 2021-11-22 22:06:31
 * @LastEditTime: 2022-01-02 18:00:04
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-wecars/src/pages/mine/feedback.vue
-->
<template>
    <view class="feedback">
        <view class="feedback-text">
            <u-input
                v-model="value"
                type="textarea"
                :border="false"
                height="200"
                placeholder="您的反馈弥足珍贵，车要试出行将认真倾听并处理"
            />
        </view>
        <view
            class="feedback-btu"
            :class="{'feedback-btu-s': value}"
            @click="handleSave"
        >
            提交反馈
        </view>
    </view>
</template>
<script>
import { getUserProfile } from "./../../util";
export default {
    name: 'FeedBack',
    data() {
        return {
            value: '',
            userInfo: null
        }
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;

        })
    },
    methods: {
        async handleSave() {
            if(!this.value) {
                uni.showToast({
                    title: '请输入反馈',
                    duration: 1500
                });
                return false;
            }
            
            if(this.userInfo) {
                const result  = await this.$getRequest(this.$url.feedback, 'POST', {
                    content: this.value,
                    userId: this.userInfo.id,
                    userName: this.userInfo.name
                })
                if(result.code != 0) {
                    return false;
                }

                uni.showToast({
                    title: '反馈完成',
                    duration: 2000,
                    icon: 'success'
                });
                
                this.$u.route({
                    type: 'navigateBack',
                    delta: 1,
                })
                console.log(result)
            } else {
                getUserProfile("/pages/mine/feedback", () => {
                    this.$u.route("/pages/sign/sign");
                });
            }
            
            
        }
    }
}
</script>
<style lang="scss" scoped>
    .feedback {
        padding: 30rpx 32rpx;
        .feedback-text {
            background: #FFFFFF;
            box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.04);
            border-radius: 24rpx;
            padding: 32rpx;
        }
        .feedback-btu {
            background: rgba(10, 15, 45, 0.3);
            border-radius: 8rpx;
            font-weight: 500;
            font-size: 34rpx;
            padding: 34rpx 0;
            text-align: center;
            color: #fff;
            margin-top: 32rpx;
        }
        .feedback-btu-s {
            background: #0A0F2D;
        }
    }
</style>