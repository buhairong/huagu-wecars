<template>
	<view class="page-wrap" v-if="list.length">
		<view class="card" v-for="item in list" :key="item.id">
			<view class="left">
				<view class="info">
					{{item.name}}
					<view class="tag">{{partnerCompanyRoleStatus[item.role]}}</view>
				</view>
				<view class="mobile">
					电话：{{item.mobile}}
				</view>
			</view>
			
			<view class="right">
				<view class="right-text" v-if="userInfo.id === item.userId">
					本人
				</view>
				<view v-else>
					<view class="right-text status" :class="{'red': item.status == 2}" v-if="item.status == 0 || item.status == 2">
						{{statusObj[item.status] || ''}}
					</view>
					<view class="edit-btn" @click="goSetStaffPage(2, item)" v-if="userInfo.roleId <= item.role">
						管理员工
					</view>
				</view>
			</view>
		</view>
		
		<view class="fixed-buttom-disabled-btn" v-if="isManager">
			<button @click="goSetStaffPage(1)">
				添加员工
			</button>
		</view>
		
	</view>
</template>

<script>
import { partnerCompanyRoleStatus } from '@/constants'	
	
export default {
	data() {
		return {
			partnerCompanyRoleStatus,
			list: [],
			userInfo: {},
			isManager: false,
			statusObj: {
				0: '邀请中',
				2: '拒绝邀请',
			}
		}
	},
	
	onLoad(options) {
		
	},
	
	onShow() {const isLogin = uni.getStorageSync('isLogin')
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				this.userInfo = data
				
				this.isManager = this.userInfo.roleId <= 20
				this.getUserList()
			})
		}
		
	},
	
	methods: {
		async getUserList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				limit: 1000,
				page: 1,
				partnerCompanyId: this.userInfo.partnerCompanyId,
			}
			
			const res = await this.$getRequest(this.$url.getPartnerCompanyUserList, "POST", params)
			
			if (res.code == 0 && res.data && res.data.records) {
				this.list = res.data.records
			}
			
			uni.hideLoading()
		},
		
		// 1.添加 2.编辑
		goSetStaffPage(type, item) {
			let staffInfo = {
				userInfo: this.userInfo,
			}
			if (item) {
				staffInfo = {
					...staffInfo,
					...item,
				}
			}
			
			uni.setStorageSync("staffInfo", staffInfo)
			
			uni.navigateTo({
				url: `/partner/company/staff/setStaff?type=${type}`
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	min-height: 100vh;
	padding-bottom: 280rpx;
}

.card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		.info {
			height: 48rpx;
			display: flex;
			align-items: center;
			color: #1D2129;
			font-size: 32rpx;
			.tag {
				margin-left: 16rpx;
				height: 36rpx;
				line-height: 36rpx;
				border-radius: 4rpx;
				background: rgba(10, 15, 45, 0.9);
				color: #FFFFFF;
				font-size: 24rpx;
				padding: 0 8rpx;
			}
		}
		.mobile {
			margin-top: 10rpx;
			height: 36rpx;
			font-size: 24rpx;
			line-height: 36rpx;
			color: #86909C;
		}
	}
	.right {
		.status {
			margin-bottom: 10rpx;
			text-align: right;
		}
		.right-text {
			font-size: 24rpx;
			color: #848795;
		}
		.red {
			color: #FF0000;
		}
		.edit-btn {
			width: 128rpx;
			height: 56rpx;
			border-radius: 8rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 2rpx solid rgba(49, 195, 123, 0.8);
			color: #31C37B;
			font-size: 24rpx;
		}
	}
}

</style>
