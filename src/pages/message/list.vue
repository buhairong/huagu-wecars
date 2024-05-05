<!--
 * @Author: lufeng
 * @Date: 2021-11-01 17:52:29
 * @LastEditTime: 2022-01-03 17:57:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /butler-super/src/pages/index/index.vue
-->
<template>
    <view class="message">
        <view
            class="u-flex"
            @click="handleOrderList"
        >
            <view
                class="message-head"
            >
                <u-image
                    width="100%"
                    height="100%"
                    src="https://image.51cheyaoshi.com/xcx/app/static/message_1_icon.png"
                    shape="circle"
                    mode="aspectFit"
                >
                    <u-loading slot="loading" />
                </u-image>
            </view>
            <view
                class="message-content u-flex-1"
            >
                <view class="message-notice">
                    通知消息
                </view>
                <view class="message-title">
                    {{ bsMessage.content || '' }}
                </view>
                <view
                    v-if="bsMessage.createdTime"
                    class="message-time"
                >
                    <!-- {{ $u.timeFormat(bsMessage.createdTime, 'mm-dd hh:MM') }} -->
                    {{ $u.timeFrom(new Date(bsMessage.createdTime).getTime()) }}
                </view>
            </view>
        </view>
        <view
            class="u-flex u-margin-top-50"
            @click="handleMark"
        >
            <view class="message-head message-activity">
                <u-image
                    width="100%"
                    height="100%"
                    src="https://image.51cheyaoshi.com/xcx/app/static/message_2_icon.png"
                    shape="circle"
                    mode="aspectFit"
                >
                    <u-loading slot="loading" />
                </u-image>
            </view>
            <view class="message-content u-flex-1">
                <view class="message-notice">
                    活动消息
                </view>
                <view class="message-title">
                    {{ marketingMessage.title || '' }}
                </view>
                <view
                    v-if="marketingMessage.createdTime"
                    class="message-time"
                >
                    {{ $u.timeFrom(new Date(marketingMessage.createdTime).getTime(), false) }}
                    <!-- {{ $u.timeFormat(marketingMessage.createdTime, 'mm-dd hh:MM') }} -->
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import dayjs from 'dayjs';
import {getUserProfile} from '../../util'
export default {
    name: "MessageList",
    data() {
        return {
            bsMessage: {},
            marketingMessage: {},
            userInfo: null,
            cityId: ''
        };
    },
    onLoad() {
        this.cityId = uni.getStorageSync("cityId")
        
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
            this.init(this.userInfo.id);
        })
    },
    methods: {
        handleMark() {
            this.$u.route('/pages/message/marketing-list')
        },
        handleOrderList() {
            
            if(this.userInfo) {
                this.$u.route('/pages/mine/order-list')
            } else {
                getUserProfile("/pages/message/list", () => {
                    this.$u.route("/pages/sign/sign");
                });
            }
            
        },
        async init(userid) {
            const bsRes = await this.$getRequest(this.$url.businessMessageListByPage, 'POST', {
                cityId: this.cityId,
                userId: userid
            })
            if(bsRes.data.records && bsRes.data.records.length>0) {
              this.bsMessage = bsRes.data.records[0];
              bsRes.data.records.map((item) => {
                  item.createdTime = dayjs(item.createdTime).format('YYYY/MM/DD HH:mm')
                  return item;
              })
            }

            const mRes = await this.$getRequest(this.$url.marketingMessageListByPage, 'POST', {
                cityId: this.cityId,
                userId: userid
            })
            if(mRes.data.records && mRes.data.records.length>0) {
              this.marketingMessage = mRes.data.records[0];
              mRes.data.records.map((item) => {
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
        padding: 30rpx 40rpx;
        .message-head {
            width: 120rpx;
            height: 120rpx;
            background: #0A0F2D;
            border-radius: 100%;
        }
        .message-activity {
            background: #F5194B;
        }
        .message-content {
            margin-left: 24rpx;
            position: relative;
            .message-notice {
                font-size: 34rpx;
                color: #0A0F2D;
                margin-bottom: 8rpx;
            }
            .message-title {
                color: rgba(10, 15, 45, 0.5);
                font-size: 28rpx;
            }
            .message-time {
                position: absolute;
                right: 0;
                top: 0;
                font-size: 28rpx;
                color: rgba(10, 15, 45, 0.5);
            }
        }
    }
</style>
