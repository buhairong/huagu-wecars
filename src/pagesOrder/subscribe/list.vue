<template>
	<view class="wrap">
		<CustomOrderBtn showTopCustomBtn />
		
		<view class="container">
			<view class="header">
				<scroll-view
					scroll-x="true" 
					class="scroll-X" 
				>
					<view 
						v-for="item in powerModeAllTag"
						:key="item.value"
						class="tag"
						:class="{'active-tag': item.value === search.powerMode}"
						@click="changeTag(item.value)"
					>
						{{item.name}}
					</view>
				</scroll-view>
				
				<view class="filter-wrap" @click="handleSearch">
					<view>条件筛选</view>
					<image src="https://image.51cheyaoshi.com/xcx/app/static/home/rou.png" style='width: 20rpx; height: 20rpx;' >
				</view>
			</view>
			
			<scroll-view
				scroll-y="true" 
				class="scroll-Y" 
				@scrolltolower="handleListBottom"
			>
				<view class="list-wrap">
					<view
						v-for="(item, index) in carSubscribeData"
						:key="index"
						class="item"
					>
						<NewCarListItem 
							:item="item"
							:cityId="search.cityId"
						/>
					</view>
				</view>
				<u-empty v-if="carSubscribeData.length == 0" text="暂无车源" mode="list"></u-empty>
				<u-loadmore
					v-show="status && totalPages > 0"
					:status="status"
					:load-text="loadText"
				/>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { powerModeAllTag } from '@/constants'
import NewCarListItem from '../components/NewCarListItem.vue'
import CustomOrderBtn from '../components/CustomOrderBtn.vue'

export default {
	components: {
	  NewCarListItem,
		CustomOrderBtn,
	},
	
	data() {
		return {
			powerModeAllTag,
			search: {
				page: 1,
				powerMode: '',
				cityId: 310100,
			},
			carSubscribeData: [],
			totalPages: 0,
			status: 'loading',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
		}
	},
	onLoad(options) {
		this.search.cityId = options.cityId
		this.fetchCarSubscribe()
	},
	
	methods: {
		changeTag(value) {
			this.search.powerMode = value
			this.search.page = 1
			this.carSubscribeData = []
			this.fetchCarSubscribe()
		},
		
		async fetchCarSubscribe() {
			const carSubscribe = await this.$getRequest(
				this.$url.getCarSubscribe,
				"POST",
				this.search
			)
				
			carSubscribe.data.records.forEach(item => {
				item.finalSelectStr = ''
				const tempArr = []
				if (item.finalSelect) {
					let finalSelect = JSON.parse(item.finalSelect)
					finalSelect.forEach(item => {
						if (item == 0) {
							tempArr.push('买断')
						} else if (item == 1) {
							tempArr.push('退回')
						} else if (item == -1) {
							tempArr.push('续订')
						}
					})
					item.finalSelectStr = tempArr.join('、')
				}
			})
				
			this.carSubscribeData = this.carSubscribeData.concat(carSubscribe.data.records)
			this.totalPages = carSubscribe.data.pages
			this.page = carSubscribe.data.current
			if (this.totalPages === 0) {
				this.status = ''
			} else if (this.page >= this.totalPages) {
				this.status = 'nomore'
			} else {
				this.status = 'loadmore'
			}
		},
		
		handleListBottom() {
			if(this.search.page >= this.totalPages) {
				this.status = 'nomore'
				return
			}
			this.status = 'loading'
			++this.search.page
			
			this.fetchCarSubscribe()
		},
		
		handleSearch() {
			uni.navigateTo({
				url: `/pages/home/search/slip-condition?cityId=${this.cityId}&powerMode=${this.search.powerMode}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 0 40rpx 40rpx;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	.container {
		height: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		.header {
			height: 60rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.scroll-X {
				width: 0;
				flex: 1;
				white-space: nowrap;
				.tag {
					display: inline-block;
					margin-right: 16rpx;
					padding: 0 16rpx;
					height: 60rpx;
					line-height: 60rpx;
					border-radius: 4rpx;
					background: rgba(10, 15, 45, 0.04);
					color: rgba(10, 15, 45, 0.8);
					font-size: 24rpx;
				}
				.active-tag {
					font-weight: 400;
					background: rgba(10, 235, 125, 0.6);
				}
			}
			.filter-wrap {
				padding-left: 16rpx;
				display: flex;
				align-items: center;
				color: #393D3F;
				font-size: 28rpx;
			}
		}
	}
	.scroll-Y {
		padding-top: 40rpx;
		height: 0;
		flex: 1;
	}
	.list-wrap {
		padding-bottom: 40rpx;
	}
	.item {
		margin-bottom: 32rpx;
	}
}
</style>