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
        <!-- 左前轮胎 -->
        <view class="u-padding-top-56">
            <u-section
                title="左前轮胎更换"
                :right="false"
                line-color="#0A0F2D"
            />
        </view>
        <view class="u-padding-top-12">
            <view
                class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 "
                @click="tyreType('leftFrontTireUpdateTime')"
            >
                <view>更换日期</view>
                <view
                    class="u-text-right"
                >
                    <view>
                        {{ form.leftFrontTireUpdateTime || '请选择' }}
                    </view>
                </view>
            </view>
         
            <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
                <view>里程数</view>
                <view class="u-text-right">
                    <u-input
                        v-model="form.leftFrontTireUpdateMileage"
                        :custom-style="{
                            textAlign: 'right'
                        }"
                        placeholder="请输入里程数"
                    />
                </view>
            </view>
        </view>
        <!-- 左后轮胎  -->
        <view class="u-padding-top-56">
            <u-section
                title="左后轮胎更换"
                :right="false"
                line-color="#0A0F2D"
            />
        </view>
        <view class="u-padding-top-12">
            <view
                class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 "
                @click="tyreType('leftRearTireUpdateTime')"
            >
                <view>更换日期</view>
                <view
                    class="u-text-right"
                >
                    <view>
                        {{ form.leftRearTireUpdateTime || '请选择' }}
                    </view>
                </view>
            </view>
         
            <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
                <view>里程数</view>
                <view class="u-text-right">
                    <u-input
                        v-model="form.leftRearTireUpdateMileage"
                        :custom-style="{
                            textAlign: 'right'
                        }"
                        placeholder="请输入里程数"
                    />
                </view>
            </view>
        </view>
        <!-- 右前轮胎  -->
        <view class="u-padding-top-56">
            <u-section
                title="右前轮胎更换"
                :right="false"
                line-color="#0A0F2D"
            />
        </view>
        <view class="u-padding-top-12">
            <view
                class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 "
                @click="tyreType('rightFrontTireUpdateTime')"
            >
                <view>更换日期</view>
                <view
                    class="u-text-right"
                >
                    <view>
                        {{ form.rightFrontTireUpdateTime || '请选择' }}
                    </view>
                </view>
            </view>
         
            <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
                <view>里程数</view>
                <view class="u-text-right">
                    <u-input
                        v-model="form.rightFrontTireUpdateMileage"
                        :custom-style="{
                            textAlign: 'right'
                        }"
                        placeholder="请输入里程数"
                    />
                </view>
            </view>
        </view>

        <!-- 右后轮胎  -->
        <view class="u-padding-top-56">
            <u-section
                title="右后轮胎更换"
                :right="false"
                line-color="#0A0F2D"
            />
        </view>
        <view class="u-padding-top-12">
            <view
                class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 "
                @click="tyreType('rightRearTireUpdateTime')"
            >
                <view>更换日期</view>
                <view
                    class="u-text-right"
                >
                    <view>
                        {{ form.rightRearTireUpdateTime || '请选择' }}
                    </view>
                </view>
            </view>
         
            <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
                <view>里程数</view>
                <view class="u-text-right">
                    <u-input
                        v-model="form.rightRearTireUpdateMileage"
                        :custom-style="{
                            textAlign: 'right'
                        }"
                        placeholder="请输入里程数"
                    />
                </view>
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
            str: '',
            userInfo: {},
            form: {
                leftFrontTireUpdateTime: '', // 左前
                leftFrontTireUpdateMileage: '',
                leftRearTireUpdateTime: '', // 左后
                leftRearTireUpdateMileage: '',
                rightFrontTireUpdateTime: '', //右前
                rightFrontTireUpdateMileage: '',
                rightRearTireUpdateTime: '', //右后
                rightRearTireUpdateMileage: '',
                userCarId: '',
            }
        }
    },
    onLoad(option) {
        this.form.userCarId = option.id
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
            this.form.id = data.id
          
        })
    },
    methods: {
        handleCheck(item) {
            uni.vibrateShort();
            item.checked = !item.handleCheck
        },
        tyreType(str) {
            this.str = str;
            this.isDate = true;
        },
        handleDate(val) {
            console.log(val)
            this.form[this.str] = `${val.year}-${val.month}-${val.day} 00:00:00`
            console.log(this.form)
        },
        async handleSubmit() {
        
            
            for(let i in this.form) {
                if(this.form[i] == '') {
                    uni.showToast({
                        title: '请输入',
                        duration: 2000
                    });
                    return false;
                }
            }
          
     
            uni.showLoading({
                title: '提交中'
            });
            const {code} = await this.$getRequest(this.$url.updateTyre, 'POST', this.form)
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
            uni.hideLoading()
           
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
