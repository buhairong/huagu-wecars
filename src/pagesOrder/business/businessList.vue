<template>
	<view class="page-wrap1">
		<view class="select-item" @click="openCityList">
			<view class="label">活动城市</view>
			<view class="content">
				<view v-if="cityName" class="value">{{cityName}}</view>
				<view v-else class="placeholder">请选择活动城市</view>
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		
		<!-- <view class="select-item" @click="openBusinessActivityTypeList">
			<view class="label">活动类型</view>
			<view class="content">
				<view v-if="cityName" class="value">{{businessActivityTypeName}}</view>
				<view v-else class="placeholder">请选择活动类型</view>
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view> -->
		
		
		<u-tabs ref="tabs" active-color="#0A0F2D" inactive-color="rgba(10, 15, 45, 0.8)" font-size="32" :list="tabList" :is-scroll="false" :current="businessActivityType" @change="change"></u-tabs>
		
		
		<view class="list">
			<view v-for="item in list" :key="item.id" class="card" @click="handleChange(item)">
				<view class="title">
					{{item.siteName}}
				</view>
				
				<view class="info">
					<view class="img_box" v-if="item.backImage">
						<image
							class="item-img"
							mode="aspectFill"
							:src="item.backImage"
						/>
					</view>
					<view class="right">
						<view class="left">
							
							
							<view class="custom-item">
								<view class="label">活动类型：</view>
								<view class="content">
									{{ BUSINESS_ACTIVITY_STATUS[item.businessActivityType] }}
								</view>
							</view>
							
							<view class="custom-item">
								<view class="label">活动价格：</view>
								<view class="content">
									{{ formatThousandNumber(item.money) }}元
								</view>
							</view>
							
							<view class="custom-item">
								<view class="label">活动地址：</view>
								<view class="content">
									{{ item.address }}
								</view>
							</view>
							
						</view>
						
						<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28"></u-icon>
					</view>
				</view>
				
				
			</view>
		</view>
		
		<u-empty v-if="list.length == 0" text="暂无商务活动" mode="list" margin-top="80"></u-empty>
		
		<view class="order-btn-wrap">
			<view class="order-btn" @click="handleCall">
				联系客服
			</view>
		</view>
		
		<u-select
			v-model="showCityList" 
			:list="cityList"
			@confirm="confirmCity"
		></u-select>
		
		<u-select
			v-model="showBusinessActivityTypeList" 
			:list="BUSINESS_ACTIVITY_LIST"
			@confirm="confirmBusinessActivityType"
		></u-select>
	</view>
</template>

<script>
	import { BUSINESS_ACTIVITY_STATUS,BUSINESS_ACTIVITY_LIST,sericeTel } from "@/constants"
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	
	export default {
		data() {
			return {
				BUSINESS_ACTIVITY_STATUS,
				BUSINESS_ACTIVITY_LIST,
				list: [],
				cityList: [],
				showCityList: false,
				cityId: 310100, // 城市ID
				cityName: '上海', // 城市名称
				businessActivityType: 0,
				businessActivityTypeName: '全部',
				showBusinessActivityTypeList: false,
				tabList: [
					{
						name: '高尔夫'
					},
					{
						name: '餐饮'
					},
					{
						name: '娱乐'
					},
					{
						name: '管家'
					},
				],
				current: 0,
			}
		},
		
		onLoad(option) {
			this.getAllCity()
			this.getList()
		},
		
		onShow() {
			
		},
		
		methods: {
			formatThousandNumber(price) {
				return formatThousandNumber(price)
			},
			
			getList() {
				uni.showLoading({
				  title: '加载中'
				});
				let businessActivityType = this.businessActivityType+1
				if (businessActivityType == 3) {
					businessActivityType = 4
				}
				this.$getRequest(this.$url.getMemberBusinessActivityList, "POST", {
				  cityId: this.cityId,
				  businessActivityType,
				  page: 1,
				  limit: 1000,
				}).then(res => {
					uni.hideLoading()
					this.list = res.data.records
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			change(index) {
				if(index == 3) {
					uni.navigateTo({
						url: `/pagesOrder/butler/butler?type=3&cityId=${this.cityId}`
					})
				} else {
					this.businessActivityType = index;
					
					this.getList()
				}
				
			},
			
			getAllCity() {
				this.$getRequest(this.$url.cityList, 'POST', {})
					.then((res) => {
						if(res.code == 0) {
							this.cityList = res.data
							this.cityList.forEach(item => {
								item.value = item.id
								item.label = item.city
							})
						}
					})
			},
			
			openCityList() {
				this.showCityList = true
			},
			
			confirmCity(e) {
				this.cityId = e[0].value
				this.cityName = e[0].label
				this.getList()
			},
			
			handleChange(item) {
				uni.navigateTo({
					url: `/pagesOrder/business/businessDetail?id=${item.id}`
				})
			},
			
			openBusinessActivityTypeList() {
				this.showBusinessActivityTypeList = true
			},
			
			confirmBusinessActivityType(e) {
				this.businessActivityType = e[0].value
				this.businessActivityTypeName = e[0].label
				this.getList()
			},
			
			handleCall() {
				uni.makePhoneCall({
					phoneNumber: sericeTel
				})
			},
			
			handleOrder() {
				uni.navigateTo({
					url: `/pagesOrder/butler/butler?type=2&cityId=${this.cityId}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.page-wrap1 {
	padding-bottom: 240rpx;
	.select-item {
		margin-top: 32rpx;
		height: 44rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		&:first-child {
			margin-top: 0;
		}
		.label {
			font-size: 30rpx;
			color: #0A0F2D;
			padding-right: 24rpx;
		}
		.content {
			display: flex;
			align-items: center;
			padding: 0;
			font-size: 28rpx;
			color: rgba(10, 15, 45, 0.8);
		}
	}
	
	::v-deep .u-tabs {
		margin-top: 24rpx;
		margin-left: -32rpx;
		font-size: 30rpx;
	}
	
	.list {
		margin-top: 32rpx;
		.card {
			
			.info {
				display: flex;
				align-items: center;
			}
			.title {
				line-height: 44rpx;
				font-size: 32rpx;
				color: #0A0F2D;
				font-weight: 600;
				margin-bottom: 24rpx;
			}
			.img_box {
				margin-right: 16rpx;
				width: 200rpx;
				height: 200rpx;
				.item-img {
					border-radius: 16rpx;
					width: 100%;
					height: 100%;
				}
			}
			.right {
				width: 0;
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.left {
				padding-right: 24rpx;
				width: 0;
				flex: 1;
			}
			
			.custom-item {
				line-height: 44rpx;
				display: flex;
				
				margin-top: 8rpx;
				&:first-child {
					margin-top: 0;
				}
				.label {
					font-size: 28rpx;
					color: #0A0F2D;
				}
				.content {
					width: 0;
					flex: 1;
					padding: 0;
					font-size: 28rpx;
					color: rgba(10, 15, 45, 0.8);
				}
			}
			
			.u-icon {
				margin-left: 24rpx;
			}
		}
	}
}
</style>
