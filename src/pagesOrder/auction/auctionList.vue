<template>
	<view class="wrap">
		<u-empty v-if="errMsg" :text="errMsg" mode="list" margin-top="40"></u-empty>
		<view class="list" v-else-if="list.length">
			<MyAuctionListItem 
				v-for="item in list"
				:key="item.id"
				:item="item"
			/>
		</view>
		<u-loadmore
			v-show="status"
			:status="status"
			:load-text="loadText"
		/>
	</view>
</template>

<script>
import MyAuctionListItem from './components/MyAuctionListItem.vue'

export default {
	components: {
	  MyAuctionListItem,
	},
	
	data() {
		return {
			userInfo: null,
			userId: null,
			list: [],
			status: '',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			errMsg: '',
		}
	},
	
	onLoad(option) {
		this.userId = option.userId
	},
	
	onShow() {
		this.getList()
	},
	
	methods: {
		async getList () {
		  uni.showLoading({
		    title: '加载中'
		  })
			
		  const res = await this.$getRequest(this.$url.getMyAuctionList, "GET", {
				userId: this.userId,
		  })
			
			if (res.code === 0 && res.data && res.data.length) {
				this.list = res.data
				this.status = 'nomore'
			} else {
				this.errMsg = '您还没有参加过竞拍'
			}
		  
		  uni.hideLoading()
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40rpx 40rpx 80rpx;
}
</style>