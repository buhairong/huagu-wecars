<template>
	<view class="wechat">
		<div class="header">
			<div class="left">
					<image 
						class="logo" :src="info.logoImageUrl"
					/>
					<div class="info">
							<div class="shop-name">{{info.shopName}}</div>
							<div class="addr">{{info.city}}{{info.district}}{{info.detailAddress}}</div>
					</div>
			</div>
			<div class="right" @click="handlerTelClick">
					<image 
						style="width:28rpx"
						src="https://image.51cheyaoshi.com/xcx/app/static/home/tel.png"
						mode="widthFix"
					/>
			</div>
		</div>
		<div class="introduce">
			{{info.introduce}}
			<image 
				class="block"
				src="https://image.51cheyaoshi.com/xcx/app/static/home/block.png"
				mode="widthFix"
			/>
		</div>
		<div class="item">
				<div class="item-title">联系电话</div>
				<div class="item-content">{{info.districtNum}}-{{info.tel}}</div>
		</div>
		<div class="item">
				<div class="item-title">营业时间</div>
				<div class="item-content">
						{{info.startDate}}至{{info.endDate}} {{info.districtNum}}-{{info.tel}}
				</div>
		</div>
		<div class="item photo-item">
			<div class="item-title">门店照片</div>
			<div class="item-content">
					<div class="photo-wrap">
							<div class="text">展厅</div>
							<image 
								:src="info.shopHallPic"
								mode="widthFix"
							></image>
					</div>
					<div class="photo-wrap">
							<div class="text">门头</div>
							<image 
								:src="info.shopHeadPic"
								mode="widthFix"
							></image>
					</div>
					<div class="photo-wrap">
							<div class="text">环境</div>
							<image 
								:src="info.shopEnvironmentPic"
								mode="widthFix"
							></image>
					</div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
				companyId: null,
				pageNum: null,
			}
		},
		
		onLoad(options) {
			this.companyId = options.companyId
			this.pageNum = options.pageNum
		},
		
		onShow() {
			this.getDIYConfig()
		},
		
		methods: {
			async getDIYConfig() {
				uni.showLoading({
					title: '加载中'
				})
				
				const res = await this.$getRequest(this.$url.getDIYConfig, "GET", {
				    companyId: this.companyId,
				    pageNum: this.pageNum,
				})
				
				if (res.code == 0 && res.data && res.data.config) {
					const config = JSON.parse(res.data.config)
					for (const item of config.widgetList) {
						if (item.widget === 'shopInfo') {
							this.info = item.config.info
						}
					}
				}
				
				console.log('this.config', this.config)
				
				uni.hideLoading()
			},
			
			handlerTelClick() {
				uni.makePhoneCall({
					phoneNumber: `${this.info.districtNum}-${this.info.tel}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.wechat {
	padding: 0 20px;
	.header {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20px 0;
			box-sizing: border-box;
			.left {
					margin-right: 18px;
					flex: 1;
					display: flex;
					align-items: center;
					.logo {
							width: 50px;
							height: 50px;
							margin-right: 12px;
					}
					.info {
							flex: 1;
							width: 0;
							.shop-name {
									height: 22px;
									font-size: 14px;
									font-weight: 500;
									line-height: 22px;
									color: #1D2129;
									@include text-overflow;
							}
							.addr {
									margin-top: 8px;
									height: 18px;
									font-size: 12px;
									line-height: 18px;
									color: #4E5969;
									@include text-overflow;
							}
					}
			}
	}
	.introduce {
			margin-bottom: 30px;
			padding: 16px 20px;
			box-sizing: border-box;
			border-radius: 4px;
			background: #F2F3F5;
			font-size: 12px;
			line-height: 22px;
			color: #4E5969;
			text-indent: 2em;
			position: relative;
			.block {
				width: 24rpx;
				position: absolute;
				top: 20px;
				left: 20px;
				z-index: 100;
			}
	}

	.item {
			margin-bottom: 13px;
			height: 22px;
			line-height: 22px;
			display: flex;
			.item-title {
					margin-right: 16px;
					font-size: 14px;
					color: #86909C;
			}
			.item-content {
					font-size: 14px;
					color: #1D2129;
			}
	}

	.photo-item {
			height: auto;
			align-items: flex-start;
			.item-title {
					height: 32px;
					line-height: 32px;
			}
			.item-content {
					display: flex;
					justify-content: space-between;
					.photo-wrap {
							margin-right: 10px;
							display: flex;
							flex-direction: column;
							align-items: center;
							image {
									width: 140rpx;
							}
							.text {
									height: 32px;
									font-size: 12px;
									line-height: 32px;
									color: #4E5969;
							}
					}
			}
	}
	}
</style>
