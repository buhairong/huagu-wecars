<!--
 * @Author: lufeng
 * @Date: 2021-11-01 17:52:29
 * @LastEditTime: 2022-01-09 20:36:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /butler-super/src/pages/index/index.vue
-->
<template>
    <view class="place-order">
        <view class="place-order-image">
            <u-image
                v-show="currentTab == 0"
                class=""
                src="https://image.51cheyaoshi.com/xcx/tab_1.png"
                width="100%"
                height="100%"
            />
            <u-image
                v-show="currentTab == 1"
                class=""
                src="https://image.51cheyaoshi.com/xcx/tab_2.png"
                width="100%"
                height="100%"
            />
        </view>

        <view
            class="card"
        >
            <view class="card-tab u-flex">
                <view
                    :class="['item', 'u-flex-1', { 'item-active': currentTab === 0 }]"
                    @click="changeTab(0)"
                >
                    随用随还
                </view>
                <view
                    :class="['item', 'u-flex-1', { 'item-active': currentTab === 1 }]"
                    @click="changeTab(1)"
                >
                    折扣长租
                </view>
            </view>
            
            <place-order-info
								class='place-order-info'
                place="order"
                :current-tab="currentTab"
                update="0"
                @click="handleSave"
            />
        </view>
				
				<AgreeMentPopup :show.sync="showFirstPageAgreeMentPopup" @agree="handleAgree"/>
    </view>
</template>

<script>
import PlaceOrderInfo from "./common/placeOrderInfo.vue";
import dayjs from "dayjs"
import AgreeMentPopup from '@/pages/agreement/components/AgreeMentPopup.vue'

export default {
  onShareAppMessage(res) {
    return {
      title: '车要试 让有车生活 · 更简单',
      desc: '',
      path: '/pages/ordered/place-order',
      imageUrl: '', // ./../..https://image.51cheyaoshi.com/xcx/app/static/logo.png
    }
  },
  onShareTimeline(res) {
    
  },
    name: "PlaceOrder",
    components: {
        PlaceOrderInfo,
				AgreeMentPopup,
    },
    data() {
        return {
						showFirstPageAgreeMentPopup: false,
            userInfo: null,
            currentTab: 0,
            listTabs: [
                { name: "随用随还" },
                { name: "折扣长租" },
            ],
        };
    },
    onLoad() {

    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
        })
    },
    methods: {
				handleAgree() {
					this.getLocation()
				},
			
        countUsedDay(endStamp, startStamp) {
            // 用车天数
            let m1 = dayjs(endStamp);
            let m2 =  dayjs(startStamp);
            console.log(m1)
            let hours = m1.diff(m2, 'hours');
            if(hours <= 24) {
                return 1;
            }  else {
                if(String(hours / 24).indexOf('.') == -1) {
                    return hours / 24
                } else {
                    if(String(hours/24)[(String(hours/ 24).indexOf('.') + 1)] >= 5)  {
                        return Math.ceil(hours / 24)
                    } else {
                        return parseInt(hours / 24)+'.5'
                    }
                }
            }

        },
        handleSave(data) {
						uni.vibrateShort({})
            data.orderDays = this.countUsedDay(data.returnTime, data.sendTime);
            uni.setStorageSync('usedOrderData', data);
            this.$u.route({
                url: "pages/ordered/selectCar"
            });
        },
        changeTab (tab) {
            this.currentTab = tab;
        },

				getLocation() {
					uni.getLocation({
				    type: 'wgs84',
				    success: async (res) => {
				      console.log('getLocation', res)
							uni.setStorageSync("locationAddress", res.result)
				    },
				    fail: async (err) =>{
							console.log('fail', err)
				    }
				  });
				},
    },
};
</script>

<style lang="scss" scoped>
	.place-order-info{
		transform: translateY(-200px);
	}
.place-order {
	position: relative;
	overflow: hidden;
    height: 100vh;
    .place-order-image {
        height: 576rpx;
    }


    .card {
        position: relative;
        z-index: 1;
        margin: 0 32rpx;
        margin-top: -170rpx;
        border-radius: 24rpx;
        background: #ffffff;
        box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
            0px 8px 24px rgba(10, 15, 45, 0.04);
        overflow: hidden;
        padding-bottom: 48rpx;
        margin-bottom: 20rpx;
        &-tab {
            background: #fff;
            .item {
                width: 50%;
                height: 112rpx;
                padding: 26rpx 0;
                text-align: center;
                background: #ffffff;
                background: rgb(245, 245, 247);
                font-style: normal;
                font-weight: 500;
                font-size: 40rpx;
                line-height: 60rpx;
                color: rgba(10, 15, 45, 0.5);
                border-radius: 0 0 25rpx 25rpx;
                 
                
            }
            .item-active {
               
                color: #0A0F2D;
                background: #fff;
                border-radius: 0;
                // border-radius: 0 0 25rpx 25rpx;
            }
        }
    }


    .foot-but {
        margin: 80rpx 40rpx 56rpx;
    }
}
</style>