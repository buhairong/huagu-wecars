<template>
	<u-popup border-radius="14" mode="center" v-model="show" @close="close">
		<view class="wrap">
			<view class="title">昵称</view>
			<input type="nickname" class="weui-input" placeholder="请输入昵称" v-model="nickname" @input="handleInput" @change="handleChange"/>
			<view class="btn" @click="save">确认</view>
		</view>
	</u-popup>
</template>

<script>
const app = getApp()
export default {
	props: {
		show: {
			type: Boolean,
			required: true,
		},
		
		userId: {
			type: Number,
			required: true,
		},
	},
	
	data() {
		return {
			nickname: '',
		}
	},
	
	methods: {
		close() {
			this.$emit('update:show', false)
		},
		
		handleInput(e) {
			this.nickname = e.detail.value
		},
		
		handleChange(e) {
			this.nickname = e.detail.value
		},
		
		save() {
			const nickName = this.nickname.trim()
			if(!nickName) {
				uni.showToast({
					title: '请输入昵称',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			const data = {
				id: this.userId,
				nickName,
			}
			
			
			this.$getRequest(this.$url.saveNickNameOrImg, "POST", data).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: '保存成功',
						duration: 2000,
						icon: 'none',
					})
					this.close()
					this.$emit('save', nickName)
					app.globalData.userInfo.nickname = nickName
				} else {
					uni.showToast({
						title: '保存失败',
						duration: 2000,
						icon: 'none',
					})
				}
			}).catch(err => {
				uni.showToast({
					title: '保存失败',
					duration: 2000,
					icon: 'none',
				})
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 640rpx;
	padding: 32px 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.title {
		margin-bottom: 24px;
		height: 24px;
		font-size: 17px;
		line-height: 24px;
		color: rgba(0, 0, 0, 0.9);
	}
	.weui-input {
		width: 100%;
		border: 2rpx solid #B5B5B5;
		padding: 10px;
	}
	.btn {
		margin-top: 60px;
		width: 100%;
		height: 86rpx;
		border-radius: 43rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 16px;
	}
}
</style>