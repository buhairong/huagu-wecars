<!--
import { async } from 'q';
 * @Author: your name
 * @Date: 2021-11-18 19:38:11
 * @LastEditTime: 2022-01-22 17:52:50
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /new-superev-wechat/src/pages/mine/identity/list.vue
-->

<template>
    <view class="maintain">
        <view class="u-padding-top-56">
            <u-section
                title="添加保养基础信息"
                :right="false"
                line-color="#0A0F2D"
            />
        </view>
        <view class="u-padding-top-12">
            <view
                class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 "
                @click="isDate = true"
            >
                <view>保养日期</view>
                <view
                    class="u-text-right"
                    :class="{'default-text': !form.userCarMaintainLogEntity.maintainTime}"
                >
                    {{ form.userCarMaintainLogEntity.maintainTime || '请选择' }}
                </view>
            </view>
         
            <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
                <view>里程数</view>
                <view class="u-text-right">
                    <u-input
                        v-model="form.userCarMaintainLogEntity.maintainMileage"
                        :custom-style="{
                            textAlign: 'right'
                        }"
                        placeholder="请输入里程数"
                    />
                </view>
            </view>
        </view>
        <view class="u-padding-top-56">
            <u-section
                title="添加保养项目"
                :right="false"
                line-color="#0A0F2D"
            />
        </view>
        <view class="maintain-list u-flex u-row-between u-flex-wrap u-padding-top-24">
            <view
                v-for="(item, index) in list"
                :key="index"
                class="item"
                :class="{'item-active': item.checked}"
                @click="handleCheck(item)"
            >
                {{ item.name }}
            </view>
        </view>
        <u-gap
            height="260"
            bg-color="#FFFFFF"
        />
        <view
            class="foot-but u-flex-1 but but-bg "
        >
            <view
                class="foot-but-r u-text-center"
                @click="handleSubmit"
            >
                提交信息
            </view>
        </view>
        <u-picker
            v-model="isDate"
            mode="time"
            @confirm="handleDate"
        />
    </view>
</template>
<script>
// saveIDCardLicenseFile
import dayjs from 'dayjs';
import { statusName } from '@/constants'
export default {
    name: 'AddMaintain',
    data() {
        return {
            isDate: false,
            userInfo: {},
            list: [
                {name: '放油螺栓', id: 1, checked: false},
                {name: '水箱防锈保护', id: 2, checked: false},
                {name: '小保养服务', id: 3, checked: false},
                {name: '小保养服务', id: 4, checked: false},
                {name: '小保养服务', id: 5, checked: false},
            ],
            form: {
                userCarMaintainLogEntity: {
                    maintainTime: '',
                    maintainMileage: '',
                    userCarId: '',
                },
                userCarMaintainLogItemEntityList: []
            },

        }
    },
    onLoad(option) {
        this.form.userCarMaintainLogEntity.userCarId = option.id
        this.init();
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
          
        })
    },
    methods: {
        async init() {
            const {data} = await this.$getRequest(this.$url.getMaintainItem, 'POST', {

            })
            this.list = data.map((item) => {
                item.checked = false;
                return item;
            });
            console.log(data)
        },
        handleDate(val) {
            this.form.userCarMaintainLogEntity.maintainTime = `${val.year}-${val.month}-${val.day} 00:00:00`
        },
        handleCheck(item) {
            uni.vibrateShort();
            item.checked = !item.handleCheck
        },
        async handleSubmit() {
        
            if(!this.form.userCarMaintainLogEntity.maintainTime) {
                uni.showToast({
                    title: '请选择保养日期',
                    duration: 2000,
                    icon: 'none'
                });
                return false;
            }
            if(!this.form.userCarMaintainLogEntity.maintainMileage) {
                uni.showToast({
                    title: '请输入里程数',
                    duration: 2000,
                    icon: 'none'
                });
                return false;
            }
            const arr = [];
            // const obj = {carMaintainConfigId: ''}
            const list = this.list.filter((item) => {
                return item.checked == true
            })
            console.log(list)
            if(list.length == 0) {
                uni.showToast({
                    title: '请输入保养项',
                    duration: 2000,
                    icon: 'none'
                });
                return false;
            }
            list.map((item) => {
                var obj = {
                    carMaintainConfigId: item.id
                }
                arr.push(obj)
            })
            
            console.log(arr)
            
            this.form.userCarMaintainLogItemEntityList = arr;
          
     
            uni.showLoading({
                title: '提交中'
            });
            const { code } = await this.$getRequest(this.$url.updateMaintain, 'POST', this.form)
            uni.hideLoading()
            if(code != 0) {
                return false;
            }
            uni.showToast({
                title: '提交成功',
                duration: 2000
            });
            this.$u.route({
                type: 'navigateBack',
                delta: 1
            })
            
           
        },
 
        // 获取用户身份证信息
        async getUserInfo(userId) {
            const userInfo =  await this.$getRequest(this.$url.userInfo, 'POST', {userId})
            console.log(userInfo, 'userInfo')
            if (userInfo.data) {
                // this.form.endTime = dayjs(userInfo.data.idcardValidityTimeEnd).format('YYYYMMDD')
            }
        }

    }
}
</script>
<style lang="scss" scoped>
    .maintain {
        padding: 0 40rpx;
        .maintain-list {
            .item {
                width: 49%;
                background: rgba(10, 15, 45, 0.04);
                border-radius: 4px;
                margin: 12rpx 0;
                padding: 16rpx 0;
                text-align: center;
                color: rgba(10, 15, 45, 0.8);
                font-size: 24rpx;
                border: 2px #e6e6e60a solid;
            }
            .item-active {
                color: rgba(10, 15, 45, 0.8);
                font-weight: 500;
                border: 2px #000 solid;
            }
        }
        .identity-box {
            background: rgba(10, 15, 45, 0.04);
            border-radius: 16rpx;
            margin: 16rpx 0;
        }
        .identity-foot {
            margin-top: 130rpx;
            text-align: center;
            .but {
                margin-top: 44rpx;
            }
        }
 
        .identity-card {
            background: #FAFAFB;
            border-radius: 16rpx;
            height: 410rpx;
            line-height: 410rpx;
            text-align: center;
            margin-top: 27rpx;
        }
        .default-text {
            color: #b0b0b3;
        }
    }
    .foot-but {
        position: fixed;
        left: 40rpx;
        right: 40rpx;
        z-index: 1;
        margin: 0 auto;
        z-index: 111;
        bottom: 60rpx;
    }

</style>
