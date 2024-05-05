<!--
 * @LastEditors: Please set LastEditors
-->
<template>
    <view class="deposit-list">
        <view
            v-if="list && list.length == 0"
        >
            <u-gap
                height="200"
                bg-color="#FFFFFF"
            />
            <u-empty
                text="暂无押金明细"
                mode="list"
            />
        </view>
        <view
            v-for="(item, index) in list"
            :key="index"
            class="item"
        >
            <view class="u-flex u-row-between dark-info">
                <view>{{ item.payType | payTypeText }}</view>
                <view>{{ item.total }}</view>
            </view>
            <view class="u-flex u-row-between light-info">
                <view>{{ item.createdTime }}</view>
                <view v-if="item.afterBalance  > 0">余额：{{ item.afterBalance }}</view>
            </view>
        </view>
        <u-loadmore
            v-show="page > 1"
            :status="status"
            :load-text="loadText"
        />
    </view>
</template>
<script>
import { accountPayTypeAll } from "@/constants"
export default {
    name: 'DepositList',
    filters: {
        payTypeText(value) {
          return accountPayTypeAll.find(item => item.value === value).name
        },
    },
    data() {
        return {
            userInfo: null, // 用户信息
            list: [], // 余额列表
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
    onReachBottom() {
        if(this.page >= this.totalPages) {
            this.status = 'nomore';
            return;
        }
        this.status = 'loading';
        this.page = ++ this.page;
        setTimeout(() => {
            this.getDeposit(this.userId, this.page)
            if(this.page >= this.totalPages) {
                this.status = 'nomore';
            }
        }, 2000)
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
            this.userId = data.id;

            this.getDeposit(data.id, 1)
        })
    },
    methods: {
        async getDeposit(userId, page) {
            const res = await this.$getRequest(this.$url.getDepositList, 'POST', {
                // limit: 0,
                page,
                userId
            })
            this.list = this.list.concat(res.data.records)
            this.totalPages = res.data.pages
            this.page = res.data.current
            this.status = 'loadmore'
        }
    }
}
</script>
<style lang="scss" scoped>
    .deposit-list {
        padding: 0 32rpx;
        .item {
            background: #FFFFFF;
            box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.04);
            border-radius: 24rpx;
            margin-top: 24rpx;
            padding: 32rpx;
            .dark-info {
                font-size: 34rpx;
                line-height: 48rpx;
                color: #0A0F2D;
            }
            .light-info {
                font-size: 24rpx;
                line-height: 40rpx;
                color: rgba(10, 15, 45, 0.5);
            }
        }
    }
</style>
