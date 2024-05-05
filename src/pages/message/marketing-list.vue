<!--
 * @Author: lufeng
 * @Date: 2021-11-01 17:52:29
 * @LastEditTime: 2022-01-02 18:54:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /butler-super/src/pages/index/index.vue
-->
<template>
    <view class="message">
        <u-empty v-if="marketingMessage.length == 0" text="暂无活动消息" mode="list" margin-top="40"></u-empty>
        <view
            v-for="(item, index) in marketingMessage"
            :key="index"
            class="card"
        >
            <view class="u-flex u-row-between">
                <view class="message-title u-flex">
                    {{ item.title }}
                </view>
                <view class="message-time">
                    {{ $u.timeFormat(item.createdTime, 'mm-dd hh:MM') }}
                </view>
            </view>
            <view class="message-text">
                预约到店享精选好礼，报名通道即可开启
            </view>
            <view class="message-img">
                <u-image
                    width="100%"
                    height="100%"
                    :src="item.imageUrl"
                >
                    <u-loading slot="loading" />
                </u-image>
            </view>
        </view>
    </view>
</template>

<script>
import dayjs from 'dayjs';

export default {
    name: "MessageList",
    data() {
        return {
            marketingMessage: [],
            userInfo: null
        };
    },
    onLoad() {
        // this.init();
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            this.userInfo = data;
            this.init(this.userInfo.id);
        })
    },
    methods: {
        async init(uid) {
            const res = await this.$getRequest(this.$url.marketingMessageListByPage, 'POST', {
                cityId: uni.getStorageSync("cityId"),
                userId: uid
            })
            this.marketingMessage = res.data.records;
            if(res.data.records && res.data.records.length) {
                res.data.records.map((item) => {
                    item.createdTime = dayjs(item.createdTime).format('YYYY/MM/DD HH:mm')
                    return item;
                })
            }
            
        }
    },
};
</script>

<style lang="scss" scoped>
    .message {
        padding: 30rpx 20rpx;
        .card {
            padding: 32rpx 40rpx;
            background: #FFFFFF;
            box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.04);
            border-radius: 24rpx;
            margin-top: 24rpx;
            .message-title {
                font-size: 34rpx;
                color: #0A0F2D;
            }
            .message-time {
                font-size: 24rpx;
                color: rgba(10, 15, 45, 0.8);
            }
            .message-text {
                font-size: 24rpx;
                color: rgba(10, 15, 45, 0.5);
            }
            .message-img {
                width: 100%;
                height: 400rpx;
                border-radius: 15rpx;
                overflow: hidden;
                margin-top: 20rpx;
            }
        }
    }
</style>
