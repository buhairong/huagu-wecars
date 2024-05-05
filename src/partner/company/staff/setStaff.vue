<template>
	<view class="page-wrap">
		<view>
			<view class="item-wrap">
				<view class="item-title">员工姓名</view>
				<view class="item-content">
					<input
						v-model="name"
						class="input"
						maxlength="10"
						placeholder="请输入员工姓名"
						placeholder-style="font-size:14px;color:#A4AEBB;"
						:disabled="type == 2"
					/>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">员工电话</view>
				<view class="item-content">
					<input
						v-model="mobile"
						class="input"
						type="digit"
						inputmode="numeric"
						placeholder="请输入员工电话"
						placeholder-style="font-size:14px;color:#A4AEBB;"
						:disabled="type == 2"
					/>
				</view>
			</view>
			
			<view class="item-wrap">
				<view class="item-title">员工角色</view>
				<view class="item-content">
					<view class="role" @click="openRoleList">
						<view class="role-name">
							{{rodeId ? partnerCompanyRoleStatus[rodeId] : '请选择员工角色'}}
						</view>
						<view style="margin-left:8rpx;" v-if="status != 2">
							<u-icon name="arrow-down" color="#D8D8D8" size="32"></u-icon>
						</view>
					</view>
				</view>
			</view>
			
			<u-popup border-radius="14" mode="bottom" v-model="showRoleList">
				<view class="popup-wrap">
					<view class="popup-title">选择角色</view>
					<view class="popup-list">
						<view v-for="item in roleList" :key="item.value" class="role" :class="{'acitve-role': item.value === rodeId}" @click="changeRole(item)">
							<view class="role-name">{{item.label}}</view>
							<view v-if="item.value === rodeId">
								<u-icon name="checkbox-mark" color="#4170EE" size="32"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		
		<view class="fixed-buttom-disabled-btn" @click="addStaff" v-if="type == 1">
			<button>确认添加</button>
		</view>
		<view class="fixed-buttom-disabled-btn" @click="inviteAgain" v-if="type == 2 && status == 2">
			<button>重新邀请</button>
		</view>
		<view class="fixed-buttom-disabled-btn-group" v-else-if="type == 2">
			<button @click="delStaff">移除员工</button>
			<button class="save-btn" @click="editStaff">保存</button>
		</view>
		
		
	</view>
</template>

<script>
import { partnerCompanyRoleList, partnerCompanyRoleStatus } from '@/constants'	

export default {
	data() {
		return {
			partnerCompanyRoleStatus,
			staffInfo: {},
			type: null, // 1.添加 2.编辑
			roleList: [],
			showRoleList: false,
			rodeId: null,
			name: '',
			mobile: '',
			status: '',
			userId: '',
			partnerCompanyId: '',
		}
	},
	
	onLoad(options) {
		this.type = options.type
		
		const staffInfo = uni.getStorageSync('staffInfo')
		if (staffInfo) {
			this.staffInfo = staffInfo
			this.roleList = partnerCompanyRoleList.filter(item => item.value > staffInfo.userInfo.roleId)
			
			if (this.type == 2) {
				this.name = this.staffInfo.name
				this.mobile = this.staffInfo.mobile
				this.rodeId = this.staffInfo.role
				this.status = this.staffInfo.status
				this.userId = this.staffInfo.userId
				this.partnerCompanyId = this.staffInfo.partnerCompanyId
			}
		}
	},
	
	methods: {
		openRoleList() {
			if (this.status == 2) {
				return
			}
			this.showRoleList = true
		},
		
		changeRole(item) {
			this.rodeId = item.value
			this.showRoleList = false
		},
		
		async addStaff() {
			if(!this.name.trim()) {
				uni.showToast({
					title: '请输入员工姓名',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.mobile) {
				uni.showToast({
					title: '请输入员工电话',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.rodeId) {
				uni.showToast({
					title: '请选择员工角色',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				partnerCompanyId: this.staffInfo.userInfo.partnerCompanyId,
				name: this.name,
				mobile: this.mobile,
				role: this.rodeId,
				createdBy: this.staffInfo.userInfo.id,
			}
			
			const res = await this.$getRequest(this.$url.addPartnerCompanyUser, "POST", params)
			
			uni.hideLoading()
			
			if (res.code == 0) {
				uni.showToast({
					title: '保存成功',
					duration: 2000,
					icon: "none"
				})
				
				uni.navigateBack({
					delta: 1
				})
			} else {
				uni.showToast({
					title: res.msg,
					duration: 2000,
					icon: "none"
				})
			}
			
			
		},
		
		async editStaff() {
			if(!this.rodeId) {
				uni.showToast({
					title: '请选择员工角色',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			const params = {
				id: this.staffInfo.id,
				role: this.rodeId,
				updatedBy: this.staffInfo.userInfo.id,
			}
			
			uni.showLoading({
				title: '加载中'
			})
			
			const res = await this.$getRequest(this.$url.updatePartnerCompanyUser, "POST", params)
			
			if (res.code == 0) {
				uni.showToast({
					title: '保存成功',
					duration: 2000,
					icon: "none"
				})
				
				uni.navigateBack({
					delta: 1
				})
			}
			
			uni.hideLoading()
		},
		
		delStaff() {
			uni.showModal({
				title: '提示',
				content: '确定要移除这个员工吗？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中'
						})
						
						const params = {
							id: this.staffInfo.id,
						}
						
						const res = await this.$getRequest(this.$url.deletePartnerCompanyUser, "GET", params)
						
						if (res.code == 0) {
							uni.showToast({
								title: '保存成功',
								duration: 2000,
								icon: "none"
							})
							
							uni.navigateBack({
								delta: 1
							})
						}
						
						uni.hideLoading()
					}
				}
			})
		},
		
		async inviteAgain() {
			const params = {
				userId: this.userId,
				partnerCompanyId: this.partnerCompanyId,
				status: 0,
			}
			
			const res = await this.$getRequest(this.$url.invitePartnerCompanyUser, "GET", params)
			
			if (res.code === 0) {
				uni.showToast({
					title: '已重新邀请',
					duration: 2000,
					icon: "none"
				})
				
				uni.navigateBack({
					delta: 1
				})
			}
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.item-wrap {
		padding: 16px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: inset 0px -1px 0px 0px rgba(10, 15, 45, 0.04);
		.item-title {
			padding-left: 32rpx;
			font-size: 14px;
			color: #86909C;
		}
		.item-content {
			width: 0;
			flex: 1;
			.role {
				width: 100%;
				padding-left: 20rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
			.role-name {
				color: #A4AEBB;
				font-size: 14px;
				line-height: 44rpx;
			}
		}
		.input {
			text-align: right;
			background: transparent;
		}
	}
}

.popup-wrap {
	width: 100vw;
	padding: 20px 40rpx 60px;
	.popup-title {
		height: 42rpx;
		font-size: 16px;
		line-height: 42rpx;
		color: rgba(0, 0, 0, 0.9);
		margin-bottom: 16px;
		text-align: center;
	}
	.role {
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: rgba(26, 26, 26, 0.8);
		font-size: 14px;
		border-bottom: 2rpx solid #F2F3F5;
	}
	.acitve-role {
		color: #4170EE;
	}
}
</style>
