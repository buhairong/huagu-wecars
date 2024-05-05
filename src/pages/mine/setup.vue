<template>
    <view class="setup">
				<view class="img-wrap">
					<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					  <image class="avatar" :src="imgUrl"></image>
					</button> 
				</view>
				
        <view
            v-for="(item) in list"
            :key="item.index"
            class="cell u-flex u-row-between u-border-bottom"
            @click="handleRoute(item)"
        >
            <view class="cell-v">
                {{ item.name }}
            </view>
            <view class="cell-b">
							<text
							    class="default-t"
							>
							    {{ item.default }}
							</text>
							<u-icon
								v-if="item.index === 0"
								name="arrow-right"
								color="rgba(10, 15, 45, 0.3)"
								size="32"
							/>
                <!-- <view v-if="item.default == 1">
                    <u-image
                        width="66rpx"
                        height="66rpx"
                        mode="aspectFit"
                        shape="circle"
                        :src="userInfo.imageUrl"
                    />
                </view>
                <text
                    v-else
                    class="default-t"
                >
                    {{ item.default }}
                </text> -->
            </view>
        </view>
        <!-- <view class="cell u-flex u-row-between u-border-bottom">
            <view class="cell-v">
                手机号
            </view>
            <view class="cell-b">
                <text class="default-t">
                    未绑定
                </text>
            </view>
        </view>
        <view class="cell u-flex u-row-between u-border-bottom">
            <view class="cell-v">
                身份认证
            </view>
            <view class="cell-b">
                <text class="default-t">
                    未绑定
                </text>
            </view>
        </view>
        <view class="cell u-flex u-row-between u-border-bottom">
            <view class="cell-v">
                驾照认证
            </view>
            <view class="cell-b">
                <text class="default-t">
                    未绑定
                </text>
            </view>
        </view>
        <view class="cell u-flex u-row-between u-border-bottom">
            <view class="cell-v">
                手机号
            </view>
            <view class="cell-b">
                <text class="default-t">
                    未绑定
                </text>
            </view>
        </view>
        <view class="cell u-flex u-row-between u-border-bottom">
            <view class="cell-v">
                手机号
            </view>
            <view class="cell-b">
                <text class="default-t">
                    未绑定
                </text>
            </view>
        </view>
        <view class="cell u-flex u-row-between u-border-bottom">
            <view class="cell-v">
                手机号
            </view>
            <view class="cell-b">
                <text class="default-t">
                    未绑定
                </text>
            </view>
        </view>
        <view class="cell u-flex u-row-between u-border-bottom">
            <view class="cell-v">
                手机号
            </view>
            <view class="cell-b">
                <text class="default-t">
                    未绑定
                </text>
            </view>
        </view> -->
				
				<SetNickPopup
					:show.sync="showSetNickPopup"
					:userId="userInfo.id"
					@save="saveNickName"
				/>
    </view>
</template>
<script>
import { statusName } from '@/constants'
import SetNickPopup from './components/SetNickPopup.vue'

const app = getApp()
export default {
    name: 'SetUp',
		
		components: {
			SetNickPopup
		},
		
    data() {
        return {
            userInfo: null,
            list: [
                {name: '昵称',  default: '', index: 0},
                {name: '手机号',  default: '未绑定', index: 1},
                {name: '身份认证',  default: '待认证', index: 2},
                // {name: '驾照认证',  default: '待认证', index: 3},
                // {name: '绑定微信',  default: '未绑定', index: 4},
                // {name: '收货地址',  default: '未添加', index: 5},
            ],
						imgUrl: '',
						showSetNickPopup: false,
        }
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            this.userInfo = data
            if(data) {
                this.list[2].default = statusName[data.riskAuditStatus]
                this.list[1].default = data.mobile
								this.list[0].default = data.nickname || '请设置昵称'
								this.imgUrl = data.imageUrl || 'https://image.51cheyaoshi.com/xcx/app/static/home/default-avatar.png'
            }

        })
    },
    methods: {
        handleRoute(item) {
					if(item.index == 0) {
						this.showSetNickPopup = true
					}
        },
				
				saveNickName(nickName) {
					this.userInfo.nickname = nickName
					this.list[0].default = nickName
				},
				
				async onChooseAvatar(e) {
					uni.showLoading({
					  title: '上传中'
					})
					
					const { avatarUrl } = e.detail 
					
					const upload = await this.$getFileUpload(this.$url.upload, [avatarUrl])
					if(upload.code !== 0) {
					  uni.showToast({
					    title: '上传失败',
					    duration: 2000,
					    icon: 'none'
					  })
						uni.hideLoading()
					  return false
					}
					
					const data = {
						id: this.userInfo.id,
						imageUrl: upload.data.src,
					}
					
					this.$getRequest(this.$url.saveNickNameOrImg, "POST", data).then(res => {
						if (res.code === 0) {
							uni.showToast({
								title: '上传成功',
								duration: 2000,
								icon: 'none',
							})
							this.imgUrl = upload.data.src
							app.globalData.userInfo.imageUrl = upload.data.src
						} else {
							uni.showToast({
								title: '上传失败',
								duration: 2000,
								icon: 'none',
							})
						}
					}).catch(err => {
						uni.showToast({
							title: '上传失败',
							duration: 2000,
							icon: 'none',
						})
					}).finally(() => {
						uni.hideLoading()
					})
				}
    }
}
</script>
<style lang="scss" scoped>
.img-wrap {
	margin: 16px 0;
	display: flex;
	justify-content: center;
	.avatar-wrapper {
		width: 160rpx;
		height: 160rpx;
		padding: 0;
		border-radius: 50%;
		border: none;
		background: transparent;
		.avatar {
			width: 100%;
			height: 100%;
		}
	}
}
.setup {
		padding: 0 40rpx;
		.cell {
				padding: 32rpx 0;
				.cell-v {
						font-size: 30rpx;
						color: #0A0F2D;
				}
				.cell-b {
						.default-t {
								color: rgba(10, 15, 45, 0.3);
								font-size: 30rpx;
						}
				}
		}
}
</style>