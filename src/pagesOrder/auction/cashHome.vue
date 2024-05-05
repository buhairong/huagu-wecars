<template>
	<view class="page-wrap">
		<view class="search-header">
			<view class="tabs">
				<view 
					v-for="tab in tabs"
					:key="tab.id"
					class="tab"
					:class="{'tab-active': tab.id === activeTab}"
					@click="changeTab(tab.id)"
				>
					<view class="line" v-if="tab.id == activeTab"></view>
					{{tab.label}}
				</view>
			</view>
		</view>
		
		<view class="container">
			<Account v-if="activeTab === 1" :detail="newCarList" :account="account" @search="getNewCarList" @scroll="handleScroll" />
		</view>
		
	</view>
</template>

<script>
import Account from './components/Account.vue'
	
export default {
	components: {
		Account,
	},
	
	data() {
		return {
			tabs: [
				{id: 1, label: '竞价保证金'},
			],
			activeTab: 1,
			newCarScrollTop: 0,
			newCarList: {
				scrollTop: 0,
				list: [],
				pageSize: 10,
				page: 1,
				totalPage: 0,
				errMsg: '',
				status: 'loadmore',
			},
			
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			userId: '',
			account: {},
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
	},
	
	onShow() {
		this.newCarList.list = []
		this.getNewCarList()
		this.getBankAndBalance()
	},
	
	methods: {
		changeTab(id) {
			this.activeTab = id
			this.$nextTick(() => {
				if (id === 1) {
					this.newCarList.scrollTop = this.newCarScrollTop
				}
			})
		},
		
		async getNewCarList(pageIndex=1) {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				fromSys: 1,
				limit: this.newCarList.pageSize,
				pageIndex,
				userId: this.userId,
			}
			
			const res = await this.$getRequest(this.$url.getTurnoverRecord, "GET", params)
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.newCarList.list = [...this.newCarList.list, ...res.data.records]
					if(this.newCarList.page >= this.newCarList.totalPages) {
						this.newCarList.status = 'nomore'
					}
				}
				if (res.data.pages) {
					this.newCarList.totalPages = res.data.pages
				} else {
					this.newCarList.errMsg = '暂无记录'
				}
			} else {
				this.newCarList.errMsg = '暂无记录'
			}
			
			uni.hideLoading()
		},
		
		handleScroll(e) {
			this.newCarList.scrollTop = e
		},
		
		async getBankAndBalance() {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				fromSys: 1,
				userId: this.userId,
			}
			
			const res = await this.$getRequest(this.$url.getBankAndBalance, "GET", params)
			uni.hideLoading()
			if (res.code === 0) {
				this.account = res.data
			}
		},
		
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	padding-bottom: 80rpx;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.container {
		height: 0;
		flex: 1;
		.car-list {
			height: 100%;
			display: flex;
			flex-direction: column;
			.scroll-Y {
				height: 0;
				flex: 1;
			}
		}
	}
}
.model-content {
	height: 700rpx;
	overflow: auto;
	padding: 32rpx 40rpx;
	line-height: 44rpx;
	font-size: 28rpx;
	color: rgba(10, 15, 45, 0.8);
	.model-title {
		padding-top: 60rpx;
		padding-bottom: 32rpx;
		color: rgba(10, 15, 45, 1);
	}
	.model-item {
		padding-bottom: 24rpx;
	}
}
</style>
