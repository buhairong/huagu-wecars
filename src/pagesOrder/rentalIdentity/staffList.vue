<template>
	<view class="page-wrap1">
		<view class="company-name">{{companyName}}</view>
		
		<view class="card" v-for="item in list" :key="item.id">
			<view class="left">
				<view class="info">
					{{item.userEntity.name}}
				</view>
				<view class="mobile">
					手机号：{{item.userEntity.mobile}}
				</view>
			</view>
			
			<view class="right">
				<view v-if="userId == item.userId" class="right-text">
					本人
				</view>
				<view v-else-if="relation == 1" class="edit-btn" @click="delStaff(item)">
					移除员工
				</view>
			</view>
		</view>
		
		<u-empty v-if="list.length == 0" text="暂无员工" mode="list" margin-top="40"></u-empty>
		
		<view v-if="relation == 1" class="order-btn-wrap">
			<view class="order-btn" @click="addStaff">
				邀请员工加入
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			userId: '',
			companyId: '',
			companyName: '',
			relation: '',
			list: [],
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
		this.companyId = options.companyId
		this.companyName = options.companyName
		this.relation = options.relation
	},
	
	onShow() {
		this.getUserList()
	},
	
	methods: {
		async getUserList() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				companyId: this.companyId,
				limit: 1000,
				page: 1,
			}
			
			const res = await this.$getRequest(this.$url.companyUserList, "GET", params)
			
			if (res.code == 0 && res.data) {
				this.list = res.data
			}
			
			uni.hideLoading()
		},
		
		async delStaff(item) {
			uni.showModal({
				title: '提示',
				content: '确定要移除这个员工吗？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中'
						})
						
						const params = [this.staffInfo.id]
						
						const res = await this.$getRequest(this.$url.delUser, "POST", params)
						
						if (res.code == 0) {
							uni.showToast({
								title: '删除成功',
								duration: 2000,
								icon: "none"
							})
							
							this.getUserList()
						}
						
						uni.hideLoading()
					}
				}
			})
		},
		
		// 1.添加 2.编辑
		goSetStaffPage(type, item) {
			if (item) {
				uni.setStorageSync("staffInfo", item)
			}
			
			uni.navigateTo({
				url: `/pages/staff/setStaff?type=${type}`
			})
		},
		
		addStaff() {
			uni.navigateTo({
				url: `/pagesOrder/qrcode/qrcode?type=3&userId=${this.userId}&companyId=${this.companyId}&companyName=${this.companyName}`
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap1 {
	padding-bottom: 240rpx;
}

.company-name {
	line-height: 44rpx;
	font-size: 32rpx;
	color: #0A0F2D;
	font-weight: 500;
	margin-bottom: 32rpx;
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
			font-size: 16px;
			.tag {
				margin-left: 16rpx;
				height: 36rpx;
				line-height: 36rpx;
				border-radius: 4rpx;
				background: #E8F3FF;
				color: #4170EE;
				font-size: 11px;
				padding: 0 8rpx;
			}
		}
		.mobile {
			margin-top: 10rpx;
			height: 36rpx;
			font-size: 12px;
			line-height: 36rpx;
			color: #86909C;
		}
	}
	.right {
		.right-text {
			font-size: 12px;
			color: #4170EE;
		}
		.edit-btn {
			width: 128rpx;
			height: 56rpx;
			border-radius: 8rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 2rpx solid rgba(65, 112, 238, 0.8);
			color: #4170EE;
			font-size: 12px;
		}
	}
}

</style>
