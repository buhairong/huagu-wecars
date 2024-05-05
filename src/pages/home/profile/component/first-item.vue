<!--
 * @Author: your name
 * @Date: 2021-11-12 23:21:25
 * @LastEditTime: 2022-01-12 15:47:57
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-wc/src/pages/profile/index.vue
-->

<template>
  <view class="fiPage">
    <!-- <view :class="!showMore? 'hiddenmore' : 'showmore'"> -->
	<view :class="showMore? 'hiddenmore' : 'showmore'">
		<view v-for="(item,index) in carDetailData.templateRespVO" :key="index" class="card" :class="index>1? 'more-item' : ''" >
		  <u-row class="m-info-row">
			<u-col span="8"><text class="m-col-title-title">{{item.templateName}}</text></u-col>
			<u-col span="4"><text class="m-col-title" @click="gotoDetail(item.templateId,item.templateName)">更多商户方案</text><image class="m-col-val-img" src="https://image.51cheyaoshi.com/xcx/app/static/img/返回.png"></image></u-col>
		    
			<u-col span="3"><text class="m-col-title-txt">订阅费用：</text></u-col>
			<u-col span="7">
				<text>{{item.paymentType==0?item.payOffPrice:item.monthPay | $numFormat}}元{{item.paymentType==0?'':'/月'}}</text>
				<u-icon class='info-circle' name="info-circle" @click="showTrue()"></u-icon>
			</u-col>
		  </u-row>
		  <!-- 选择项目 -->
		  <view>
		    <u-row class="m-info-row">
		     <u-col span="3"><text class="m-col-title-txt">订阅周期：</text></u-col>
		     <u-col span="7">
					6个月
		     </u-col>
		    </u-row>
			<u-row class="m-info-row">
			  <u-col span="3"><text class="m-col-title-txt" style="word-spacing: 3px;">期末选择：</text></u-col>
			  <u-col span="7">
				  <view  style='display: flex;'>
					  <view class="endItem">
					  	<view class="endItemImg">
					  		<image class="itemImg" src="https://image.51cheyaoshi.com/xcx/app/static/maiduan.png" mode=""></image>
					  	</view>
					  	<text class="itemText">买断车辆</text>
					  </view>
					  <view class="endItem" style="margin-left:16px ;">
					  	<image class="itemImg" src="https://image.51cheyaoshi.com/xcx/app/static/wusun.png" mode=""></image>
					  	<text class="itemText">无损退车{{isShowTrue}}</text>
					  </view>
				  </view>
				</u-col>
			</u-row>
		  </view>
		</view>
	</view>

    <view v-if="showNote" class="card">
      <view class="process">
        <view class="process-t">
            「新车订阅」流程
        </view>
        <view class="process-list">
            <view class="process-list-t">
                <text />1.订阅产品
            </view>
            <text class="process-list-text">
                选择适合您的订阅方案及商户，在线支付订金。您还可以为爱车个性化定制颜色和增配项；
            </text>
        </view>
        <view class="process-list">
            <view class="process-list-t">
                <text />2.资质认证
            </view>
            <text class="process-list-text">
                资金方将对您的身份进行认证，审核通过即可在线签约；
            </text>
        </view>
        <view class="process-list">
            <view class="process-list-t">
                <text />3.签约付款
            </view>
            <text class="process-list-text">
               您在线签订订阅合约，并支付订阅费用后，我们将通知商户为您准备车辆；
            </text>
        </view>
        <view class="process-list">
            <view class="process-list-t">
                <text />4.喜提爱车
            </view>
            <text class="process-list-text">
			商户完成车辆采购、落地上牌流程后，我们会与您预约具体交车时间，原则上车辆准备周期不超过30天，特殊车型或其他情况除外；
            </text>
        </view>
		<view class="process-list">
		    <view class="process-list-t">
		        <text />5.期末选择
		    </view>
		    <text class="process-list-text">
		       订阅期结束前30天，您可以选择订阅结束后全款或分期购买车辆，也可将车辆无损退回。
		    </text>
		</view>
      </view>
    </view>
        <u-gap
            v-if="showNote"
            height="190"
            margin-top="50"
            bg-color="#FFFFFF"
        />
        <!-- pop -->
        <u-popup v-if="serPop" v-model="serPop" mode="center" width="320px" height="auto" border-radius="8">
          <view class="u-margin-bottom-40 u-margin-top-40 u-margin-left-40 u-margin-right-40 u-text-center">
            <view class="u-text-center m-ser-pop-title">服务费包含</view>
            <u-row class="m-info-row">
              <u-col span="4"><text class="m-col-title-txt">订阅周期：</text></u-col>
              <u-col span="8">
                <u-radio-group v-model="periodType" active-color="#0A0F2D" @change="changePeriodGroup">
                  <u-radio
                    v-for="(item,key,index) in minProductEntity.productGroup"
                    :key="index"
                    shape="square" 
                    :name="key" 
                    icon-size="14" 
                    label-size="28" 
                    @change="changePeriodType"
                  >
                    {{ key }}期
                  </u-radio>
                </u-radio-group>
              </u-col>
            </u-row>
            <u-row class="m-info-row">
              <u-col span="4"><text class="m-col-title-txt">车辆使用费：</text></u-col>
              <u-col span="8"><text class="m-col-val-txt">{{ popData.usedFee | $numFormat }}元/月</text></u-col>
            </u-row>
            <u-row class="m-info-row">
              <u-col span="4"><text class="m-col-title-txt">车牌占用费：</text></u-col>
              <u-col span="8"><text class="m-col-val-txt">{{ popData.plateFee | $numFormat }}元/月</text></u-col>
            </u-row>
            <u-row class="m-info-row">
              <u-col span="4"><text class="m-col-title-txt">保障服务费：</text></u-col>
              <u-col span="8"><text class="m-col-val-txt">{{ popData.serviceFee | $numFormat }}元/月</text></u-col>
            </u-row>
            <u-row class="m-info-row">
              <u-col span="4"><text class="m-col-title-txt">维保服务项：</text></u-col>
              <u-col span="8"><text class="m-col-val-txt">含用车期间免费保养、服务费范围内 免费上门取送车、7×24小时道路救援</text></u-col>
            </u-row>
          </view>
          <u-row class="m-info-row m-btn-row u-text-center ">
            <u-col span="6"><view class="m-btn-col-left u-text-center" @click="serPop = false">取消</view></u-col>
            <u-col span="6"><view class="m-btn-col-right u-text-center" @click="confirmSubType">确定</view></u-col>
          </u-row>
        </u-popup>
        
		<u-popup class='popupClass'  border-radius="14" closeable=true mode="bottom" v-model="isShowTrue">
			<view class="popupClassTop"> 
				<text>汽车订阅</text>
			</view>
			<view class="popupClassBom">
			    汽车订阅是一种让您买车可以「后悔」的全新汽车消费模式。
				您仅需支付一笔订阅费用，即可开走车辆。订阅期结束前30天，
				您再决定是否买断车辆，届时您可以通过全款或分期的方式支付尾款购买车辆，也可将车辆退回。
			</view>
		</u-popup>
    </view>
</template>

<script>
// import { paymentTypeAll } from "@/constants"
export default {
  name: "FirstItem",
  onLoad() {
  },
  data () {
    return {
	  isShowTrue:false,
      showLoading: true,
      serPop: false,
      popData: {
        usedFee: this.minProductEntity.totalCarUsedFee,
        serviceFee: this.minProductEntity.totalServiceFee,
        plateFee: this.minProductEntity.totalPlateNumFee,
        deposit: this.minProductEntity.deposit,
        monthTotal: this.minProductEntity.monthTotal,
        monthPayment: this.minProductEntity.monthPayment,
        reserveFee: this.minProductEntity.reserveFee
      },
      subType: 0,
      periodType: '',
      paymentTypeAll: ['月付','季付','年付','全款'],
      changeProId: '',
      changePayment: '',
	  showMore: false,
    };
  },
  props: {
    minProductEntity: {
      type: Object,
      default: () => {
          return { productGroup: [] };
      }
    },
    carDetailData: {
      type: Object,
      default: () => {
          return {};
      }
    },
    showNote: {
      type: Boolean,
      default: true
    },
    userInfo: {
      type: Object,
      default: () => {
          return {};
      }
    },
  	isShowTrue: {
  	  type: Boolean,
  	  default: true
  	},
  	cityId: String
  },
  watch: {
    minProductEntity: function(data) {
      console.log('minProductEntity', data)
    },
  },
  computed: {

  },
  mounted() {
    const pageThis = this
	console.log(this,231);
    setTimeout(function(){
      console.log(pageThis.minProductEntity.id)
      pageThis.subType = pageThis.minProductEntity.id
      for(const key in pageThis.minProductEntity.productGroup) {
        for(const item of pageThis.minProductEntity.productGroup[key]) {
          if(item.id === pageThis.minProductEntity.id) {
            pageThis.periodType = key
            pageThis.popData.usedFee = item.totalCarUsedFee
            pageThis.popData.plateFee = item.totalPlateNumFee
            pageThis.popData.serviceFee = item.totalServiceFee
            pageThis.popData.deposit = item.deposit
            pageThis.popData.monthTotal = item.monthTotal
            pageThis.popData.monthPayment = item.monthPayment
            pageThis.popData.reserveFee = item.reserveFee
          }
        }
      }
      // uni.hideLoading()
    }, 100)
  },
  methods: {
	showTrue:function(){
		// this.isShowTrue=true
		// console.log(this.isShowTrue);
		this.$emit('getPor',true)
	},
    showServicePop() {
      this.serPop = true
    },
    changeSubType(index) {
    },
    changeSubTypeGroup(index) {
      for(const key in this.minProductEntity.productGroup) {
        for(const item of this.minProductEntity.productGroup[key]) {
          if(item.id == index) {
            this.changeProId = item.id
            this.changePayment = item.monthPayment
            this.popData.usedFee = item.totalCarUsedFee
            this.popData.plateFee = item.totalPlateNumFee
            this.popData.serviceFee = item.totalServiceFee
            this.popData.deposit =item.deposit
            this.popData.monthTotal = item.monthTotal
            this.popData.monthPayment = item.monthPayment
            this.popData.reserveFee = item.reserveFee
          }
        }
      }
      this.$emit('changeProductId', this.changeProId)
      this.$emit('changePayment', this.changePayment)
    },
    changePeriodGroup(index) {
      const oldPopData = JSON.parse(JSON.stringify(this.popData))
      this.popData.usedFee = 0
      this.popData.plateFee = 0
      this.popData.serviceFee = 0
      this.popData.deposit = 0
      this.popData.monthTotal = 0
      this.popData.monthPayment = 0
      
      // 默认勾选
      const item = this.minProductEntity.productGroup[index][0]
      this.subType = item.id
      this.changeProId = item.id
      this.changePayment = item.monthPayment
      this.popData.usedFee = item.totalCarUsedFee
      this.popData.plateFee = item.totalPlateNumFee
      this.popData.serviceFee = item.totalServiceFee
      this.popData.deposit =item.deposit
      this.popData.monthTotal = item.monthTotal
      this.popData.monthPayment = item.monthPayment
      this.popData.reserveFee = item.reserveFee
      
      this.$emit('changeProductId', this.changeProId)
      this.$emit('changePayment', this.changePayment)
    },
    changePeriodType(index) {
    },
    confirmSubType() {
      this.popData.id = this.changeProId
      this.serPop = false
    },
    async handleBookCar() {
      this.$emit('click')
    },
    getBuyMode (field, obj) {
      const val = obj ? obj[field] : undefined;
      if (!val) {
          return [];
      } else {
          return JSON.parse(val);
      }
    },
	toggleMore() {
	    this.showMore = !this.showMore
	},
	gotoDetail(id,title) {
		// console.log("carDetailData",this.carDetailData)
		console.log(this.carDetailData.carTypeYearProductEntity.id,309);
		var carTypeYearId = this.carDetailData.carTypeYearProductEntity.id
		uni.navigateTo({
			url:'./detail?templateId='+id+'&cityId='+this.cityId+'&carTypeYearProductId='+carTypeYearId + '&title='+title
		})
	},
	// 在线咨询
	gotoNews() {
		uni.showToast({
			title: '此功能暂未向用户开放',
			icon:"none"
		})
	}
  },
};
</script>
<style lang="scss" scoped>
.f-center {
	display: flex;
	align-items: center;
}
.hiddenmore .more-item {
  display: none;
}
.popupClass{
	.popupClassTop{
		width: 100%;
		text-align: center;
		margin: 24px 0;
		height: 21px;
		font-family: PingFangSC-Medium;
		font-size: 15px;
		font-weight: 500;
		line-height: 21px;
		letter-spacing: 0px;
		
		/* BW Alpha 0/0.9 */
		color: rgba(0, 0, 0, 0.9);
	}
	.popupClassBom{
		margin:  28px;

		width: 327px;
		height: 104px;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		font-weight: normal;
		line-height: 22px;
		letter-spacing: 0px;
		color: rgba(10, 15, 45, 0.8);
	}
}
.more{
	margin-top:32rpx;
	text-align: center;
	position: relative;
	.more-text{
		font-size: 28rpx;
	}
	.more-show-text:before{
		position: absolute;
		content: "";
		width: 0;
		height: 0;
		top: 6px;
		right: 126px;
		border-right: solid 10rpx transparent;
		border-left: solid 10rpx transparent;
		border-top: solid 16rpx black;
	}
	.more-hide-text:before{
		position: absolute;
		content: "";
		width: 0;
		height: 0;
		top: 6px;
		right: 152px;
		border-right: solid 10rpx transparent;
		border-left: solid 10rpx transparent;
		border-bottom: solid 16rpx black;
	}
}
.m-col{
	margin-top: 10rpx;
}
.card {
    font-family: PingFang SC;
    margin: 0 32rpx;
    margin-top: 24rpx;
    background: #ffffff;
    box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
        0px 8px 24px rgba(10, 15, 45, 0.06);
    border-radius: 24rpx;
    padding: 36rpx 32rpx;
    .m-info-row {
		.m-col-title{
			position: relative;
			top: -18rpx;
			right: -4px;
			font-size: 12px;
		}
      .m-col-title-txt {
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        color: #64696F;
		margin-left:6rpx;
      }
      .m-col-val-txt {
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        color: #0A0F2D;
		
      }
	  .m-col-val-img{
		  width: 48rpx;
		  height: 48rpx;
	  }
	  .m-col-title-title{
		  font-size: 32rpx;
		  font-weight: 600;
	  }
	  .m-col-left-head{
		  width: 44rpx;
		  height: 44rpx;
		  margin-right: 6rpx;
	  }
	  .m-col-val-news-img{
		  width: 33rpx;
		  height: 33rpx;
		  margin-right: 3rpx;
	  }
		.payOff{
			color: #000;
			opacity: 0.5;
			font-size: 12px;
			margin-left:4px;
		}
    }
    .car-mode-info {
        position: relative;
        margin-bottom: 32rpx;
        padding-bottom: 32rpx;
        .car-brand-logo {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            width: 88rpx;
            height: 88rpx;
            display: inline-block;
        }
        .mode-info-head {
            margin-left: 112rpx;
            .mode-info-brand {
                font-size: 30rpx;
                font-weight: 500;
            }
            .mode-info-p {
                margin-top: 40rpx;
                .divider-x {
                    &:after {
                        right: 60rpx;
                    }
                }
            }
        }
    }
    .car-des {
        color: rgba(10, 15, 45, 0.5);
        &-t {
            margin: 12rpx 40rpx 12rpx 0;
            line-height: 40rpx;
            font-size: 24rpx;
            display: flex;
            flex-direction: row;
            // align-items: center;
            &-label {
                width: 146rpx;
            }
            &-content {
                flex: 1;
            }
        }
        &-end {
            &-label {
                margin: 12rpx 0;
                line-height: 40rpx;
                font-size: 24rpx;
            }
            .col {
                &-content {
                    margin: 6rpx 0rpx;
                    box-sizing: border-box;
                    background: #FFFFFF;
                    border: 2rpx solid rgba(10, 15, 45, 0.04);
                    border-radius: 24rpx;
                    box-shadow: 0rpx -4rpx 64rpx rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.04);
                    line-height: 48rpx;
                }
            }
        }
    }
}
.endItem{
	display: flex;
	align-items: center;
	.endItemImg{
		width: 18px;
		height: 18px;
		background: #FDF7DF;
		border-radius: 50%;
		.itemImg{
			width: 10px;
			height: 10px;
			margin-bottom: 2rpx;
			margin-left: 7rpx;
		}
	}
	.itemImg{
		width: 20px;
		height: 20px;
	}
	.itemText{
		margin-left: 8px;
		font-size: 14px;
		color: #0A0F2D;
		opacity: 0.8;
		// position: relative;
		// top: 1px;
	}
	.btnText{
		font-size: 12px;
		font-weight: 500;
		color: #0A0F2D;
		margin-right: 5px;
	}
		
}
						
.info-circle{
	width: 13.5px;
	height: 13.5px;
	margin-left: 6rpx;
}
.process {
    .process-t {
        font-size: 30rpx;
        color: #0a0f2d;
        margin-top: 10rpx;
        text-align: center;
        font-weight: 500;
    }
    .process-list {
        margin-top: 40rpx;
        .process-list-t {
            font-size: 28rpx;
            margin-bottom: 8rpx;
            font-weight: 500;
            text {
                width: 24rpx;
                height: 23rpx;
                background: url("https://image.51cheyaoshi.com/xcx/app/static/icon4.png") no-repeat;
                background-size: 100%;
                display: inline-block;
                margin-right: 8rpx;
            }
        }
        .process-list-text {
            color: #666666;
            font-size: 24rpx;
            display: inline-block;
            margin-left: 40rpx;
            line-height: 40rpx;
        }
    }
}
</style>
