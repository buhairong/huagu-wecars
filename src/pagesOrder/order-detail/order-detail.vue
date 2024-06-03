<template>
	<view class="order-detail" v-if="orderInfo.userCarSubscribeEntity">
		<view class="o-head">
			<view class="o-head-car">
				<view class="car-info">
					<image mode="widthFix" :src="detailInfo.imageUrl"></image>
					<view class="o-head-car-text">
						<view class="title">
							<text>{{detailInfo.carBrand || ''}} {{detailInfo.carType || ''}}</text>
						</view>
						<view class="subtitle">
							<text>{{detailInfo.carTypeYear || ''}} {{detailInfo.carTypeYearProduct || ''}}</text>
						</view>
					</view>
				</view>
				<view class="order-status" v-if="paymentStatus && paymentStatus!=0">
					<view v-if="showNeedUploadAccount">待审核</view>
					<view v-else-if="paymentStatus == 16 || paymentStatus == 17">
						审核通过，等待合同生成
					</view>
					<view v-else-if="paymentStatus == 1  && orderInfo.carSubscribeContract && orderInfo.carSubscribeContract.isUserSign == 1">
						<view v-if="orderInfo.carSubscribeContract.isMerchantSign == 1">
							等待担保人签约
						</view>
						<view v-else>
							等待商家签约
						</view>
					</view>
					<view v-else-if="paymentStatus == 13 && userCarSubscribeEntity.predictPlateTime">待提车</view>
					<view v-else>{{purchaseOrderStatus[paymentStatus]}}</view>
					<view v-if="paymentStatus === 2 && !showNeedUploadAccount" style="font-size:12px;">{{signToCancelTimeStr}}</view>
				</view>
			</view>
		</view>
		
		<!-- 订阅方案 -->
		<view>
			<view class="subscribing" v-if="paymentStatus == 6 || paymentStatus == 7">
				<view class="subscribing-item">
					<view class="subscribing-date" v-if="userCarSubscribeEntity.startDate">{{userCarSubscribeEntity.startDate}}</view>
					<view class="line" v-else></view>
					<view class="text">开始订阅</view>
				</view>
				
				<view class="subscribing-item" style="transform:translateY(8rpx)">
					<view class="tag">{{userCarSubscribeEntity.monthTotal}}个月</view>
					<image
						style="width:154rpx;height:12rpx;margin-top:12px;"
						src="https://image.51cheyaoshi.com/xcx/app/static/days.png"
					/>
				</view>
				
				<view class="subscribing-item">
					<view class="subscribing-date" v-if="userCarSubscribeEntity.endDate">{{userCarSubscribeEntity.endDate}}</view>
					<view class="line" v-else></view>
					<view class="text">订阅结束</view>
				</view>
			</view>
			
			<view class="o-content" v-if="paymentStatus > 0">
				<view class="o-c-t">
					<view class="o-content-title">合约信息</view>
				</view>
				
				<view class="card-container">
					<template v-if="orderInfo.orderType === 1">
						<view class="item">
							<view class="item-title">姓名</view>
							<view class="item-content">
								{{orderInfo.orderPrincipal.userName}}
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">身份证件号</view>
							<view class="item-content">
								{{orderInfo.orderPrincipal.userIdNum}}
							</view>
						</view>
					</template>
					
					<template v-if="orderInfo.orderType === 2">
						<view class="item">
							<view class="item-title">企业名称</view>
							<view class="item-content">
								{{orderInfo.orderPrincipal.companyName}}
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">企业信用代码</view>
							<view class="item-content">
								{{orderInfo.orderPrincipal.corporationTaxNumber}}
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">用车人姓名</view>
							<view class="item-content">
								{{orderInfo.orderPrincipal.userName}}
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">用车人身份证件号</view>
							<view class="item-content">
								{{orderInfo.orderPrincipal.userIdNum}}
							</view>
						</view>
					</template>
					
					<view class="item" v-if="orderInfo.userConfirmStatus === 1">
						<view class="item-title">补充材料</view>
						<view class="item-content" @click="goAddCertificationPage('preview')">
							{{orderInfo.certificationRespVo.certificationRespVos.length}}
							<view class="arrow">
								<u-icon
									name="arrow-up-fill" 
									color="rgba(10, 15, 45, 0.8)" 
									size="16"
								></u-icon>
							</view>
						</view>
					</view>
					
					<view class="text-link" @click="goElectronicContractPage" v-if="orderInfo.contractInfoRespVos && orderInfo.contractInfoRespVos.length">
						查看电子合约
					</view>
					
				</view>
			</view>
			
			<view class="o-content">
				<view class="o-c-t">
					<view class="o-content-title">方案信息</view>
				</view>
				<view class="card-container">
					<view class="item">
						<view class="item-title">用车城市</view>
						<view class="item-content">
							{{userCarSubscribeEntity.cityName}}
						</view>
					</view>
					
					<view class="item">
						<view class="item-title">订阅押金</view>
						<view class="item-content">
							￥{{userCarSubscribeEntity.deposit | $numFormat}}
						</view>
					</view>
					
					<!-- <view class="item" v-if="userCarSubscribeEntity.hasDepositFree === 2">
						<view class="item-title">违章押金</view>
						<view class="item-content">¥{{violationDeposit | $numFormat}}</view>
					</view> -->
					
					<view class="item">
						<view class="item-title">订阅周期</view>
						<view class="item-content">{{userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4 ? 12 : userCarSubscribeEntity.monthTotal}}个月</view>
					</view>
					
					<view class="item">
						<view class="item-title">支付方式</view>
						<view class="item-content">{{paymentTypeAll2[userCarSubscribeEntity.paymentType]}}</view>
					</view>
					
					<view class="item">
						<view class="item-title">订阅费用</view>
						<view class="item-content" @click="togglePaymentBlock(1)">
							￥{{(userCarSubscribeEntity.mouthPayment + (carPlate && carPlate.plateMonthPrice || 0)) | $numFormat}}/月
							<u-icon
								style="padding-left: 8rpx;"
								:name="showPaymentBlock1 ? 'arrow-down' : 'arrow-up'" 
								color="rgba(10, 15, 45, 0.8)" 
								size="28"
							></u-icon>
						</view>
					</view>
					
					<view class="card-container total-payment" v-if="showPaymentBlock1">
						<view class="item">
							<view class="item-title">1-{{userCarSubscribeEntity.monthTotal}}个月</view>
							<view class="item-content">
								￥{{(userCarSubscribeEntity.mouthPayment + (carPlate && carPlate.plateMonthPrice || 0))*userCarSubscribeEntity.monthTotal | $numFormat}}
							</view>
						</view>
						<view class="item" v-if="userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4">
							<view class="item-title">7-12个月</view>
							<view class="item-content">￥{{(userCarSubscribeEntity.mouthPayment + (carPlate && carPlate.plateMonthPrice || 0))*userCarSubscribeEntity.monthTotal | $numFormat}}</view>
						</view>
					</view>
					
					<view class="item has-center-item" style="margin-top:0">
						<view class="center-item">注：订阅费用已包含保险费<span v-if="carPlate && carPlate.plateMonthPrice">及牌租费</span></view>
					</view>
					
					<!-- <view class="item has-center-item">
						<view class="item-title">保险费用</view>
						<view class="center-item">￥{{userCarSubscribeEntity.premium | $numFormat}} x {{`${userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4 ? 12 : userCarSubscribeEntity.monthTotal}`}}个月</view>
						<view class="item-content">
							{{ userCarSubscribeEntity.premium ? `￥${formatThousandNumber(userCarSubscribeEntity.premium*(userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4 ? 12 : userCarSubscribeEntity.monthTotal))}` : 0 }} -->
							<!-- <u-icon
								v-if="userCarSubscribeEntity.premium"
								style="padding-left: 8rpx;"
								:name="showPaymentBlock2 ? 'arrow-down' : 'arrow-up'" 
								color="rgba(10, 15, 45, 0.8)" 
								size="28"
							></u-icon> -->
						<!-- </view>
					</view> -->
					
					<!-- <view class="card-container total-payment" v-if="showPaymentBlock2 && userCarSubscribeEntity.premium">
						<view class="item">
							<view class="item-title">1-{{userCarSubscribeEntity.monthTotal}}个月</view>
							<view class="item-content">￥{{userCarSubscribeEntity.premium*userCarSubscribeEntity.monthTotal | $numFormat}}</view>
						</view>
						<view class="item" v-if="userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4">
							<view class="item-title">7-12个月</view>
							<view class="item-content">￥{{userCarSubscribeEntity.premium*userCarSubscribeEntity.monthTotal | $numFormat}}</view>
						</view>
					</view> -->
					
					<!-- <view class="item has-center-item">
						<view class="item-title">牌照费用</view>
						<view class="center-item" v-if="carPlate && carPlate.plateMonthPrice">￥{{carPlate.plateMonthPrice | $numFormat}} x {{`${userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4 ? 12 : userCarSubscribeEntity.monthTotal}`}}个月</view>
						<view class="item-content">
							{{ carPlate && carPlate.plateMonthPrice ? `￥${formatThousandNumber(carPlate.plateMonthPrice*(userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4 ? 12 : userCarSubscribeEntity.monthTotal))}` : 0 }} -->
							<!-- <u-icon
								v-if="carPlate"
								style="padding-left: 8rpx;"
								:name="showPaymentBlock3 ? 'arrow-down' : 'arrow-up'" 
								color="rgba(10, 15, 45, 0.8)" 
								size="28"
							></u-icon> -->
						<!-- </view>
					</view> -->
					
					<!-- <view class="card-container total-payment" v-if="showPaymentBlock3 && carPlate && carPlate.plateMonthPrice">
						<view class="item">
							<view class="item-title">1-{{userCarSubscribeEntity.monthTotal}}个月</view>
							<view class="item-content">￥{{carPlate.plateMonthPrice*userCarSubscribeEntity.monthTotal | $numFormat}}</view>
						</view>
						<view class="item" v-if="userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4">
							<view class="item-title">7-12个月</view>
							<view class="item-content">￥{{carPlate.plateMonthPrice*userCarSubscribeEntity.monthTotal | $numFormat}}</view>
						</view>
					</view> -->
					
					<view class="item">
						<view class="item-title" @click="showPop">
							限定里程
							<u-icon class="icon" name="info-circle"></u-icon>
						</view>
						<view class="item-content">{{(userCarSubscribeEntity.limitMileage-0)*((userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4 ? 12 : userCarSubscribeEntity.monthTotal)/6) | $numFormat}}公里</view>
					</view>
				</view>
			</view>
			
			<view class="o-content" v-if="orderInfo.carEntity">
				<view class="o-c-t">
					<view class="o-content-title">车辆信息</view>
					<view class="plate"></view>
				</view>
				<view class="card-container">
					<view class="item">
						<view class="item-title">外观颜色</view>
						<view class="item-content">{{orderInfo.carEntity.carColor}}</view>
					</view>
					
					<view class="item">
						<view class="item-title">内饰颜色</view>
						<view class="item-content">{{orderInfo.carEntity.trimColor}}</view>
					</view>
					
					<template v-if="picList.length">
						<view class="item">
							<view class="item-title">车辆照片</view>
						</view>
						
						<view class="item">
							<view class="item-content pic-list">
								<view class="pic-wrap" v-for="(item, index) in picList" :key="index">
									<image
										class="img"
										:src="item"
										mode="aspectFill"
										@click="preview(index, picList)"
									/>
								</view>
							</view>
						</view>
					</template>
				</view>
			</view>
			
			<view class="o-content" v-if="configList && configList.length">
				<view class="o-c-t">
					<view class="o-content-title">车辆增配项（共计: {{(totalConfigMoney) | $numFormat}}元）</view>
					<view class="icon-box" @click="delConfig" v-if="paymentStatus == 10 || paymentStatus == 1">
						<image
							class="img"
							src="https://image.51cheyaoshi.com/xcx/app/static/home/delete-icon.png"
							mode="widthFix"
						/>
					</view>
				</view>
				
				<view class="card-container">
					<view class="item" v-for="(item, index) in configList" :key="index">
						<view class="item-title">{{ item.detailName }}</view>
						<view class="item-content">{{item.money | $numFormat}}元</view>
					</view>
				</view>
				
				<template v-if="paymentStatus == 10 || paymentStatus == 1">
					<view class="comfirm-btn" @click="comfirmConfig(1)" v-if="orderInfo.otherConfigHasConfirm === 1">确认</view>
					<view class="config-text-link" @click="goConfigDetailPage" v-else>修改增配项</view>
				</template>
			</view>
			
			<view class="o-content" v-if="userCarSubscribeEntity.decorateDtoList && userCarSubscribeEntity.decorateDtoList.length">
				<view class="o-c-t">
					<view class="o-content-title">精品/装潢（共计: {{(decorateMoney-0) | $numFormat}}元）</view>
					<view class="icon-box" @click="delDecorate" v-if="paymentStatus == 10 || paymentStatus == 1">
						<image
							class="img"
							src="https://image.51cheyaoshi.com/xcx/app/static/home/delete-icon.png"
							mode="widthFix"
						/>
					</view>
				</view>
				
				<view class="card-container">
					<view class="item" v-for="(item, index) in userCarSubscribeEntity.decorateDtoList" :key="index">
						<view class="item-title">{{ item.decorateName }}</view>
					</view>
				</view>
				
				<template v-if="paymentStatus == 10 || paymentStatus == 1">
					<view class="comfirm-btn" @click="comfirmConfig(2)" v-if="orderInfo.decorateHasConfirm === 1">确认</view>
				</template>
			</view>
			
			<!-- <view class="o-content">
				<view class="o-c-t">
					<view class="o-content-title">车辆上牌</view>
					<view class="plate" @click="goPlatePage" v-if="paymentStatus == 0 && userCarSubscribeEntity.usePlate === 1">
						修改
						<view class="arrow">
							<u-icon
								name="arrow-up-fill" 
								color="rgba(10, 15, 45, 0.8)" 
								size="16"
							></u-icon>
						</view>
					</view>
				</view>
				<view class="o-content-self" style="padding:0;">
					<view class="plate-content self-plate" v-if="curPlate == 1">
						<view class="o-content-title">
							「{{userCarSubscribeEntity.plateCityName}}」牌照
						</view>
						<view class="price" v-if="carPlate && carPlate.plateMonthPrice">
							￥{{`${formatThousandNumber(carPlate.plateMonthPrice)}`}} x {{userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4 ? 12 : userCarSubscribeEntity.monthTotal}}个月
						</view>
						<view class="plate-total-price">
							<template v-if="carPlate">
								{{`￥${formatThousandNumber(carPlate.plateTotalPrice)}`}}
							</template>
							<template v-else>￥0</template>
						</view>
					</view>
					
					<view class="plate-content third-plate" v-else>
						<view class="o-content-title" @click="showPop(2)">
							{{plateList[curPlate].contentText}}
							<u-icon class="icon" name="info-circle" v-if="carPlate.certificationName.length!=0"></u-icon>
						</view>
						<view class="plate-total-price">
							￥0
						</view>
					</view>
				</view>
			</view> -->
			
			<view class="o-content" v-if="serviceStr">
				<view class="o-c-t">
					<view class="o-content-title">赠送服务</view>
				</view>
				<view class="service card-container">
					{{serviceStr}}
				</view>
			</view>
			
			<view class="o-content">
				<view class="o-c-t">
					<view class="o-content-title">期末选择</view>
					<view class="plate" @click="goFinalOptionPage">
						重新选择
						<view class="arrow" v-if="orderInfo.canChangeFinalSelector === 1">
							<u-icon
								name="arrow-up-fill" 
								color="rgba(10, 15, 45, 0.8)" 
								size="16"
							></u-icon>
						</view>
					</view>
				</view>
				
				<view class="card-container">
					<view class="item">
						<view class="item-title">已选方案</view>
						<view class="item-content">{{final[orderInfo.carSubscribeFinalChooseRespVo.finalSelect].text}}</view>
					</view>
					
					<template v-if="orderInfo.carSubscribeFinalChooseRespVo.finalSelect === 1">
						<view class="item">
							<view class="item-title">买断金额</view>
							<view class="item-content">
								¥{{userCarSubscribeEntity.buyoutsFee | $numFormat}}
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">支付方式</view>
							<view class="item-content">全款买断、金融分期</view>
						</view>
					</template>
					
					<template v-if="orderInfo.carSubscribeFinalChooseRespVo.finalSelect === 3">
						<view class="item">
							<view class="item-title">
								订阅周期
								<view class="title-tip">
									（{{(userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4 ? 12 : userCarSubscribeEntity.monthTotal)+1}}-{{(userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4 ? 12 : userCarSubscribeEntity.monthTotal)+6}}个月)
								</view>
							</view>
							<view class="item-content">
								6期
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">
								订阅费用
								<view class="title-tip">
									（一次性支付 ¥{{orderInfo.carSubscribeFinalChooseRespVo.nextSubscribeMouthPayment*6 | $numFormat}}）
								</view>
							</view>
							<view class="item-content">
								 ¥{{orderInfo.carSubscribeFinalChooseRespVo.nextSubscribeMouthPayment | $numFormat}}/月
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">
								限定里程
								<view class="title-tip">（6个月）</view>
							</view>
							<view class="item-content">{{(userCarSubscribeEntity.limitMileage-0) | $numFormat}}公里</view>
						</view>
						
						<view class="item" v-if="userCarSubscribeEntity.overMileageFee">
							<view class="item-title">超出里程</view>
							<view class="item-content">￥{{userCarSubscribeEntity.overMileageFee}}/公里</view>
						</view>
					</template>
					
					<template v-if="orderInfo.carSubscribeFinalChooseRespVo.finalSelect === 0 && userCarSubscribeEntity.limitMileage">
						<view class="item">
							<view class="item-title">
								限定里程
								<view class="title-tip">（{{userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4 ? 12 : userCarSubscribeEntity.monthTotal}}个月）</view>
							</view>
							<view class="item-content">
								{{(userCarSubscribeEntity.limitMileage-0)*((userCarSubscribeEntity.monthTotal === 6 && userCarSubscribeEntity.paymentType === 4 ? 12 : userCarSubscribeEntity.monthTotal)/6) | $numFormat}}公里
							</view>
						</view>
						
						<view class="item" v-if="userCarSubscribeEntity.overMileageFee">
							<view class="item-title">超出里程</view>
							<view class="item-content">￥{{userCarSubscribeEntity.overMileageFee}}/公里</view>
						</view>
						
					</template>
					
				</view>
			</view>
			
			
			
			<view class="o-content" v-if="(paymentStatus === 13 && userCarSubscribeEntity.predictPlateTime) || paymentStatus === 5 || paymentStatus === 6 || paymentStatus === 7">
				<view class="o-c-t">
					<view class="o-content-title">提车信息</view>
				</view>
				
				<view class="card-container">
					<view class="item">
						<view class="item-title">
							提车人
							<text style="color:#BFBFBF;"> （提车时务必携带本人驾照）</text>
						</view>
						<view class="item-content">
							{{orderInfo.orderPrincipal.userName}}
						</view>
					</view>
					
					<view class="item">
						<view class="item-title">提车门店</view>
						<view class="item-content">
							 {{orderInfo.carDeliveryInfoRespVo.shopName}}
						</view>
					</view>
					
					<view class="item">
						<view class="item-title">提车地址</view>
						<view class="item-content">
							 {{orderInfo.carDeliveryInfoRespVo.merchantAddress}}
						</view>
					</view>
					
					<view class="item">
						<view class="item-title">提车时间</view>
						<view class="item-content" style="display:flex;align-items: center;">
							 {{userCarSubscribeEntity.carDeliveryTime || ''}}
							 <view style="color: #0256FF;padding-left:12rpx;" @click="openPickCarDateList" v-if="paymentStatus === 13">
								{{ userCarSubscribeEntity.carDeliveryTime ? '修改时间' : '预约提车时间'}}
							 </view>
						</view>
					</view>
					
					
				</view>
			</view>
			
			<view class="o-content" v-if="userCarSubscribeEntity.emergencyContactName">
				<view class="o-c-t">
					<view class="o-content-title">备用联系人</view>
				</view>
				
				<view class="card-container">
					<view class="item">
						<view class="item-title">备用联系人关系</view>
						<view class="item-content">
							{{userCarSubscribeEntity.emergencyContactRelation}}
						</view>
					</view>
					
					<view class="item">
						<view class="item-title">备用联系人姓名</view>
						<view class="item-content">
							{{userCarSubscribeEntity.emergencyContactName}}
						</view>
					</view>
					
					<view class="item">
						<view class="item-title">备用联系人联系方式</view>
						<view class="item-content">
							 {{userCarSubscribeEntity.emergencyContactPhone}}
						</view>
					</view>
				</view>
			</view>
			
			<view class="o-content" v-if="paymentStatus === 6 || paymentStatus === 7">
				<view class="o-c-t">
					<view class="o-content-title">验车信息</view>
					<view class="plate" @click="confirmCarPhotos('preview')">
						查看详情
						<view class="arrow">
							<u-icon
								name="arrow-up-fill" 
								color="rgba(10, 15, 45, 0.8)" 
								size="16"
							></u-icon>
						</view>
					</view>
				</view>
				
				<view class="card-container">
					<view class="item">
						<view class="item-title">验车日期</view>
						<view class="item-content">
							{{orderInfo.confirmedSubscribeTime}}
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="tel">客服电话：{{serviceTel}}</view>
		
		<view class="o-footer" v-if="paymentStatus == 1">
			<view>签订合约即代表您已阅读并认同<text @click="showProtocol">《车要试用车服务协议》</text></view>
		</view>
		
		<view class="footer-btn" v-if="paymentStatus == 0">
			<view
				class="sign-btn"
				@click="openIdentityDialog"
			>
				立即订车
			</view>
		</view>
		<view class="footer-btn" v-if="paymentStatus == 1 && orderInfo.userCarSubscribeOtherConfigId && (!orderInfo.carSubscribeContract || orderInfo.carSubscribeContract.isUserSign == 0)">
			<view
				class="sign-btn"
				@click="contractFn"
			>
				线上签约
			</view>
		</view>
		<view class="footer-btn" v-if="showAddCertificationBtn">
			<view
				class="sign-btn"
				@click="addCertification"
			>
				补充材料
			</view>
		</view>
		<view class="sign-btn-wrap" v-if="(paymentStatus === 1 || paymentStatus === 10) && orderInfo.carSubscribeCarSelectConfigRespVo.hasSkip !== 1 && orderInfo.carSubscribeCarSelectConfigRespVo.hasPersonalizationConfig !== 1">
			<view
				class="sign-btn"
				@click="goCustomizedPage"
			>
				选配
			</view>
		</view>
		<view class="footer-btn" v-if="paymentStatus == 13 && userCarSubscribeEntity.predictPlateTime && !userCarSubscribeEntity.carDeliveryTime">
			<view
				class="sign-btn"
				@click="openPickCarDateList"
			>
				预约提车时间
			</view>
		</view>
		<view class="footer-btn" v-if="paymentStatus == 5 && userCarSubscribeEntity.hasCheckInfo === 1 && !orderInfo.hasCarConfirmed">
			<view
				class="sign-btn"
				@click="confirmCarPhotos('edit')"
			>
				查看验车信息
			</view>
		</view>
		
		<view class="footer-btn" v-if="paymentStatus == 6 && orderInfo.canChangeFinalSelector === 1">
			<view
				class="sign-btn"
				@click="goFinalOptionPage"
			>
				期末选择
			</view>
		</view>
		
		<view
		  v-if="paymentStatus == 10 || paymentStatus == 1"
		  class="btu"
		  @click="handleCancel"
		>
		  取消订单
		</view>
		
		
		<u-gap
				v-if="paymentStatus == 0 || paymentStatus == 10 || paymentStatus == 1 || paymentStatus == 2 || paymentStatus == 4 || paymentStatus == 5 || paymentStatus == 6 || paymentStatus == 13 || paymentStatus == 14"
		    height="190"
		    margin-top="50"
		/>
		
		<u-gap
				v-if="paymentStatus == 3 || paymentStatus == 8 || paymentStatus == 12 || paymentStatus == 14 || paymentStatus == 16 || paymentStatus == 17"
		    height="190"
		/>
		
		<view 
			v-if="paymentStatus == 2 || paymentStatus == 4 || paymentStatus == 14 || paySubscribeFree"
			class="footer-btn"
		>
			<view
				v-if="showNeedUploadAccount"
				class="sign-btn"
				@click="goEndPayPage"
			>
				{{hasNoUploadBillRecord ? '上传银行转账凭证' : '查看支付明细'}}
			</view>
			<view class="btn" v-else>
				<view class="left">
					<view class="price-wrap">
						<view class="pay-type" v-if="paymentStatus == 2">订阅押金：</view>
						<view class="pay-type" v-else-if="paymentStatus == 4 || paySubscribeFree">合计费用：</view>
						<view class="pay">
							<view class="unit">¥</view>
							<view class="price" v-if="paymentStatus == 2">{{depositAboutNoPay.remainMoney | $numFormat}}</view>
							<view class="price" v-else-if="paymentStatus == 4 || paySubscribeFree">{{subscribeFreeAboutNoPay.remainMoney | $numFormat}}</view>
						</view>
						<template v-if="paymentStatus == 2 || paymentStatus == 4 || paySubscribeFree">
							<!-- <view style="margin-left:10rpx;" @click.stop="showPayPop(1)" v-if="paymentStatus == 2 && depositAboutNoPay.isFirst == 1">
								<u-icon name="info-circle" color="#fff" size="28"></u-icon>
							</view> -->
							<view style="margin-left:10rpx;" @click.stop="showPayPop(2)" v-if="(paymentStatus == 4 || paySubscribeFree) && subscribeFreeAboutNoPay.isFirst == 1">
								<u-icon name="info-circle" color="#fff" size="28"></u-icon>
							</view>
						</template>
						
					</view>
					<view class="tip" v-if="paymentStatus == 0">订金可在签约或取消后原路退回</view>
				</view>
				<view class="right" @click="addPay">
					<view class="btn-text" v-if="paymentStatus == 0">立即订车</view>
					<view class="btn-text" v-else-if="paymentStatus == 2 || paymentStatus == 4 || paySubscribeFree">
						<template v-if="paymentStatus == 2">
							<view v-if="depositAboutNoPay.isFirst == 1">
								支付
							</view>
							<view v-else>
								继续支付
							</view>
						</template>
						<template v-if="paymentStatus == 4 || paySubscribeFree">
							<view v-if="subscribeFreeAboutNoPay.isFirst == 1">
								支付
							</view>
							<view v-else>
								继续支付
							</view>
						</template>
					</view>
					<image
						class="detail-arrow"
						src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
					/>
				</view>
			</view>
		</view>
		
		<u-popup 
			v-model="isAddedDeposit" 
			mode="bottom"
			border-radius="12"
			closeable="true"
			close-icon-color="#0A0F2D">
			<view class="addedDeposit-popup">
				<view class="title-added">加收车辆押金</view>
				<view class="added-text">
					金融方基于风险评估，需加收{{addedDeposit | $numFormat}}元车辆押金，该车辆押金可在期末买断车辆时抵扣尾款，也可在车辆无损退回时原路退回给您
				</view>
			</view>
		</u-popup>
		
		
		<u-popup
			v-model="showPopup" 
			mode="bottom"
			border-radius="12"
			closeable="true"
			close-icon-color="#0A0F2D"
		>
			<view class="popup-wrap">
				<view class="reserve-rule">
					<view class="title">限定里程</view>
					<view class="content">
						退回车辆时，超出限定里程部分计费标准为{{userCarSubscribeEntity.overMileageFee}}元/公里，如期末留购车辆则无里程数限制。
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-modal 
			v-model="showAddedDepositModal"
			title="加收车辆押金"
			:show-cancel-button="true"
			confirm-text="同意"
			cancel-text="拒绝"
			@confirm="confirmAddedDepositModal"
			@cancel="cancelAddedDepositModal"
		>
			<view class="slot-content">
				<view class="model-content">
					基于风险评估，需要向您加收车辆押金，车辆押金在订阅结束时根据您的期末选择可在期末买断车辆时抵扣尾款或原路退回
				</view>
			</view>
		</u-modal>
		
		<u-modal
			v-model="showCertificationModal"
			title="补充材料"
			:show-cancel-button="true"
			:mask-close-able="true"
			confirm-text="同意"
			cancel-text="拒绝"
			@confirm="confirmCertificationModal"
			@cancel="cancelCertificationModal"
		>
			<view class="slot-content">
				<view class="model-content">
					<view>金融方基于风险评估，需要您补充以下材料：</view>
					<view v-for="(item, index) in certificationList" :key="item.id">
						{{index+1}}.{{item.certificationName}}
					</view>
				</view>
			</view>
		</u-modal>
		
		<u-modal
			v-model="showConfirmCarPhotos"
			title="确认交接车辆"
			confirm-text="查看验车照片"
			@confirm="confirmCarPhotos('edit')"
		>
			<view class="slot-content">
				<view class="model-content" style="padding-bottom: 32px">
					<view>为了您的用车权益，请仔细核对验车照片。</view>
					<view>阅读并同意《用车规则确认书》</view>
				</view>
			</view>
		</u-modal>
		
		<DepositPayPopup
			v-if="showDepositPay"
			:deposit="userCarSubscribeEntity.deposit"
			:addedDeposit="addedDeposit"
			@close="showDepositPay = false"
		/>
		
		<SubscribeFreePayPopup
			v-if="showSubscribeFreePay"
			:totalPayment="userCarSubscribeEntity.totalPayment"
			:carPlatePay="carPlatePay"
			:premiumPay="premiumPay"
			:configTotalMoney="configTotalMoney"
			:decorateMoney="decorateMoney-0"
			@close="showSubscribeFreePay = false"
		/>
		
		<IdentityDialog
			v-if="showIdentityDialog"
			:show.sync="showIdentityDialog"
			:identityDialogParams="identityDialogParams"
			@identity="identity"
		/>
		
		<u-picker mode="multiSelector" v-model="showPickCarDateList" :range="pickCarDateList" @confirm="confirmPickCarDate"></u-picker>
		
		<u-modal
			v-model="showModal"
			title="提车时间"
			:show-cancel-button="true"
			:mask-close-able="true"
			confirm-text="确定"
			cancel-text="取消"
			@confirm="bindCarPlateNum"
			@cancel="closeModal"
		>
			<view class="modal-content">
				<view class="modal-tip">您约定的提车时间为</view>
				<view class="modal-car-plate-date">{{confirmPickCarDateTip}}</view>
			</view>
		</u-modal>
		
		<u-modal
			v-model="showConfigComfirmModal" 
			title="确定车辆增配项" 
			:content="totalConfigMoney < 10000 ? '您的增配项费用将打包至车价中，会导致您的订阅费用发生改变。' : '您选择的增配项总费用超过10,000元，订阅将至少为12个月。您的增配项费用将打包至车价中，会导致您的订阅费用发生改变。'"
			:confirm-text="totalConfigMoney < 10000 ? '确定' : '切换为12期'"
			cancel-text="查看增配项"
			confirm-color="#576B95"
			:show-cancel-button="true"
			@confirm="confirmConfigModal"
			@cancel="goConfigDetailPage"
		></u-modal>
		
		<u-modal
			v-model="showComfirmPaymentModal"
			title="订阅费用"
			confirm-text="确定"
			@confirm="comfirmPayment"
		>
			<view class="modal-content">
				<view class="payment-wrap">
					<view class="payment-container" :style="{transform: `translateY(${paymentTranslateY}rpx)`}">
						<view class="payment">{{userCarSubscribeEntity.mouthPayment | $numFormat}}元/月</view>
						<view class="payment">{{changePayment | $numFormat}}元/月</view>
					</view>
				</view>
			</view>
		</u-modal>
		
		<u-modal
			v-model="showDepositFreeModel" 
			title="提示" 
			:content="`抱歉，您的车辆免押金申请未能通过。您可以在${depositFreeValidDate}后重新提交申请。如果您想继续该订单，请选择支付车辆押金或取消订单，感谢您的理解与支持。`"
			confirm-text="支付车辆押金"
			confirm-color="#576B95"
			show-cancel-button
			cancel-text="取消订单"
			@confirm="cancelNotice(1, userInfo.id)"
			@cancel="handleCancel"
		></u-modal>
	</view>
</template>

<script>
import { contractUrl, paymentTypeAll1, finalSelect, purchaseOrderStatus, serviceTel, paymentTypeAll2, violationDeposit } from "@/constants"
import { formatTenThousandNumber, formatThousandNumber, getDeposit } from '@/utils/index.js'
import DepositPayPopup from '../components/DepositPayPopup.vue'
import SubscribeFreePayPopup from '../components/SubscribeFreePayPopup.vue'
import IdentityDialog from '../components/IdentityDialog.vue'

const dayList = ['日', '一', '二', '三', '四', '五', '六']
const hourList = ['08点', '09点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点']
const minList = ['00分', '10分', '20分', '30分', '40分', '50分']
const dayTimer = 24 * 60 * 60 * 1000

export default {
	components: {
		DepositPayPopup,
		SubscribeFreePayPopup,
		IdentityDialog,
	},
	
	data() {
		return {
			violationDeposit,
			paymentTypeAll2,
			purchaseOrderStatus,
			show: false,//费用明细弹窗
			isAddedDeposit:false,
			orderDetailData: {},
			carPlanId:'',
			userInfo: null,
			userCarSubscribeIds: '',
			orderSuccessInfo: '',
			index: null, // 3.订阅方案 4.分期方案
			detailInfo: {},
			subscribeItem: {},
			stagingItem: {},
			subscribeId: '', // 订阅方案ID
			showPopup: false,
			popupIndex: 1, // 1.订单提示
			paymentTypeAll: paymentTypeAll1, // 支付方式
			cartype: null, // 1.新车 2.二手车
			nowPaymentDeposit: true,
			userCouponIds: [],
			paymentStatus: null,
			orderId: null,
			orderPayStatusName: '',
			carPlate: null, //车牌信息
			plateList: {
				"1": {
					titleText: '使用自备牌照',
					contentText: '第三方牌照',
				},
				"0": {
					titleText: '使用第三方牌照',
					contentText: '自备牌照',
				},
				
			},
			curPlate: 1, // 0.使用自备牌照 1.使用第三方牌照
			plateCityId: null,
			plateCityName: null,
			addedDeposit: 0,
			isShowPopUp:'',
			isShowPopUpTrue:false,
			subPrice:0,
			reserveFee:'',//订金
			userCarSubscribeEntity:{},//订单数据
			priceSub: null,//订阅费用
			orderType: null,
			showAddedDepositModal: false,
			isShowAddedDepositPopUp: null,
			addDepositOrderType: null,
			showCertificationModal: false,
			isShowCertificationPopUp: null,
			isShowContinueUpload: null,
			certificationList: [],
			applyService: 1, // 1.省心订阅 2.轻松订阅this.period = options.period
			period: null,
			plateMonthPrice: null,
			cityId: null,
			serviceStr: '',
			orderInfo: {},
			final: {
				'3': 	{
					text: '继续订阅',
					text1: '期末续订车辆',
				},
				'1': 	{
					text: '留购车辆',
					text1: '期末买断车辆',
				},
				'0': 	{
					text: '退回车辆',
					text1: '期末退回车辆',
				},
			},
			esignInfo: {},
			from: '',
			depositAboutNoPay: {}, // 组合支付 — 押金未支付金额
			subscribeFreeAboutNoPay: {}, // 组合支付 — 订阅费用未支付金额
			showDepositPay: false,
			showSubscribeFreePay: false,
			serviceTel,
			carPlatePay: 0,
			showConfirmCarPhotos: false,
			showIdentityDialog: false,
			identityDialogParams: getApp().globalData.userInfo || {},
			signToCancelTime: 0,
			signToCancelTimeStr: '',
			signToCancelTimer: null,
			showPickCarDateList: false,
			pickCarDateList: [],
			pickCarDateParamsList: [],
			confirmPickCarDateTip: '',
			showModal: false,
			configTotalMoney: 0,
			configList: [],
			decorateMoney: 0,
			showConfigComfirmModal: false,
			showComfirmPaymentModal: false,
			changePayment: 0,
			paymentTranslateY: 0,
			carTypeYearProductId: '',
			depositFreeValidDate: '',
			showDepositFreeModel: false,
			showPaymentBlock1: true,
			showPaymentBlock2: true,
			showPaymentBlock3: true,
			premiumPay: 0,
			picList: [],
		}
	},
	onShow() {
		getApp().globalData.userInfo = null;
		getApp().globalData.getUserInfo((data) => {
			this.userInfo = data
			// this.showNotice(data.id)
			
			if (this.from === 'faceIdentity') {
				const esignInfo = uni.getStorageSync('esignInfo')
				if (esignInfo) {
					this.esignInfo = esignInfo
					this.esign()
				}
			} else {
				if (this.orderId) {
					this.getSubscribeInfo()
					this.selectCarPicsList()
				} else {
					this.createSubscribeOrder()
				}
			}
			
		})
	},
	
	onLoad(options) {
		if (options) {
			this.carPlanId = options.id
			this.index = options.index
			this.cartype = options.cartype
			uni.setStorageSync('orderId',options.orderId)
			this.orderId = options.orderId
			this.orderType = options.orderType
			this.cityId = options.cityId
			this.from = options.from
			this.curPlate = options.curPlate
			this.plateCityId = options.plateCityId || ''
			this.plateCityName = options.plateCityName || ''
			this.carTypeYearProductId = options.carTypeYearProductId
			
			if (this.orderId) {
				this.selectDepositAboutNoPay() // 押金费用
				this.selectSubscribeFreeAboutNoPayFn() // 订阅总费用
			}
		}
		
		this.getSubscriptionPrice()
	},
	
	onHide() {
		clearInterval(this.signToCancelTimer)
		this.signToCancelTimer = null
	},
	
	onUnload() {
		clearInterval(this.signToCancelTimer)
		this.signToCancelTimer = null
	},
	
	computed: {
		totalConfigMoney() {
			let res = 0
			
			if (this.configList.length) {
				res = this.configList.reduce((sum, cur) => {
					return sum + cur.money
				}, 0)
			}
			
			return res
		},
		
		showNote() {
			let res = false
			if (this.paymentStatus == 0 || this.paymentStatus == 2) {
				res = true
			}
			return res
		},
		
		paySubscribeFree() {
			let res =  false
			
			if (this.paymentStatus == 3 || this.paymentStatus == 4 || this.paymentStatus == 5  
			|| this.paymentStatus == 13 || this.paymentStatus == 14 || this.paymentStatus == 15) {
				res = true
			}
			
			return res
		},
		
		showNeedUploadAccount() {
			let res = false
			
			if (this.paymentStatus == 2) {
				if (this.depositAboutNoPay.remainMoney == 0 && this.depositAboutNoPay.hasBankPay == 1) {
					res = true
				}
			} else if (this.paymentStatus == 4 || this.paymentStatus == 14 || this.paySubscribeFree) {
				if (this.subscribeFreeAboutNoPay.remainMoney == 0 && this.subscribeFreeAboutNoPay.hasBankPay == 1) {
					res = true
				}
			}
			 
			// else if (this.paymentStatus == 5 && this.orderInfo.hasCarConfirmed) {
			// 	if (this.subscribeFreeAboutNoPay.remainMoney == 0 && this.subscribeFreeAboutNoPay.hasBankPay == 1) {
			// 		res = true
			// 	}
			// }
			
			return res
		},
		
		
		
		hasNoUploadBillRecord() {
			let res = false
			
			if (this.paymentStatus == 2) {
				if (this.depositAboutNoPay.remainMoney == 0 && this.depositAboutNoPay.hasNoUploadBillRecord == 1) {
					res = true
				}
			} else if (this.paymentStatus == 4 || this.paymentStatus == 14 || this.paySubscribeFree) {
				if (this.subscribeFreeAboutNoPay.remainMoney == 0 && this.subscribeFreeAboutNoPay.hasNoUploadBillRecord == 1) {
					res = true
				}
			}
			
			return res
		},
		
		showAddCertificationBtn() {
			let res = false
			
			if (this.paymentStatus === 10) {
				if (this.orderInfo.userConfirmStatus !== 2) {
					if (this.orderInfo.isShowPopUp === 1) {
						res = true
					} else if (this.isShowCertificationPopUp === 1) {
						res = true
					} else if (this.isShowContinueUpload === 1) {
						res = true
					}
				}
			}
			
			return res
		},
		
		
		
		showSubscribeFreeAboutNoPayBtn() {
			let res = true
			
			if (!this.orderInfo.needShowSubscribeButton) {
				res = false
			}
			
			if (this.paymentStatus == 13 && !this.userCarSubscribeEntity.carDeliveryTime) {
				res = false
			}
			
			if (this.paymentStatus == 5 && this.userCarSubscribeEntity.hasCheckInfo == 0) {
				res = false
			}
			
			if (this.paymentStatus == 5 && this.userCarSubscribeEntity.hasCheckInfo == 1 && !this.orderInfo.hasCarConfirmed) {
				res = false
			}
			
			return res
		},
	},
	
	methods: {
		preview(current, urls) {
			uni.previewImage({
				current,
				urls,
			})
		},
		
		async selectCarPicsList(){
			const params = {
				 id: this.orderId,
			}
			const result = await this.$getRequest(this.$url.selectCarPicsList, 'GET', params)
			if(result.code == 0){
				this.picList = result.data.checkCarPicList.map(item => {
					return item.carPics[0].url
				})
			}
		},
		
		togglePaymentBlock(index) {
			this['showPaymentBlock'+index] = !this['showPaymentBlock'+index]
		},
		
		async showNotice(userId) {
			const params = {
				userId
			}
			const res = await this.$getRequest(this.$url.selectHasModifyOtherConfig, "GET", params)
			if (res.code === 0 && res.data) {
				if (res.data.hasGuarantorNotice === 2) {
					uni.showModal({
						title: '提示',
						content: '很抱歉，您所添加的担保人已拒绝为您提供担保。您可以重新添加其他担保人。',
						confirmText: '查看',
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								this.cancelNotice(2, userId)
							}
						},
						fail: (err) => {
							console.log('fail', err)
						}
					})
				} else if (res.data.hasDepositFreeApplyNotice === 1) {
					uni.showModal({
						title: '恭喜您',
						content: `您申请的车辆免押金已获批准。车辆免押金截止日期为 ${res.data.validDate}。`,
						confirmText: '我知道了',
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								this.cancelNotice(1, userId)
							}
						},
						fail: (err) => {
							console.log('fail', err)
						}
					})
				} else if (res.data.hasDepositFreeApplyNotice === 2) {
					this.depositFreeValidDate = res.data.validDate
					this.showDepositFreeModel = true
				}
			}
		},
		
		cancelNotice(type, userId) {
			const params = {
				userId,
				type,
			}
			
			this.$getRequest(this.$url.cancelNotice, "GET", params).then(res => {
				if (res.code === 0) {
					if (type === 2) {
						uni.navigateTo({
							url: `/pagesOrder/depositFree/guarantorRefuse?userId=${userId}`
						})
					}
				}
			})
		},
		
		goElectronicContractPage() {
			uni.setStorageSync('ElectronicContract', this.orderInfo.contractInfoRespVos)
			uni.navigateTo({
				url: '/pagesOrder/order-detail/electronicContract'
			})
		},
		
		confirmCarPhotos(operator = 'edit') {
			uni.navigateTo({
				url: `/pagesOrder/order-detail/comfirmCarCheck?orderId=${this.orderId}&idNum=${this.userInfo.userInfoEntity.idcard}&username=${this.userInfo.name}&operator=${operator}`
			})
		},
		
		addContact() {
			uni.navigateTo({
				url: `/pagesOrder/order-detail/contact?orderId=${this.orderId}`
			})
		},
		
		goEndPayPage() {
			uni.navigateTo({
				url: `/pagesOrder/pay/depositPayEnd?orderId=${this.orderId}&paymentStatus=${this.paymentStatus}&userId=${this.userInfo.id}&openid=${this.userInfo.xcxOpenid}`
			})
		},
		
		async selectDepositAboutNoPay(){
			const params = {
				 businessId: this.orderId
			}
			const result = await this.$getRequest(this.$url.selectDepositAboutNoPay, 'GET', params)
			if(result.code == 0){
				this.depositAboutNoPay = result.data
			}
		},
		
		async selectSubscribeFreeAboutNoPayFn(){
			const params = {
				 businessId: this.orderId
			}
			const result = await this.$getRequest(this.$url.selectSubscribeFreeAboutNoPay, 'GET', params)
			if(result.code == 0){
				this.subscribeFreeAboutNoPay = result.data
			}
		},
		
		goFaceIdentityPage() {
			//this.contractFn()
			uni.setStorageSync('orderDetailPage',`/pagesOrder/order-detail/order-detail?orderId=${this.orderId}&from=faceIdentity`)
			uni.navigateTo({
				url: '/pagesOrder/identity/face-identity-tip'
			})
		},
		
		async contractFn(){
			uni.showModal({
				title: '提示',
				content: '在进行线上签约之前，请您先完成订单信息确认操作。',
				confirmText: '我知道了',
				showCancel: false,
				success: (res) => {
					if (res.confirm) {
						const esignInfo = {
							orderId: this.orderId,
							contractUrl: this.orderInfo.carSubscribeContract.contractUrl
						}
						uni.setStorageSync('esignInfo', esignInfo)
						
						uni.navigateTo({
							url: `/pagesOrder/identity/face-identity-tip?from=sign&idNum=${this.userInfo.userInfoEntity.idcard}&username=${this.userInfo.name}`
						})
					}
				},
				fail: (err) => {
					console.log('fail', err)
				}
			})
		},
		
		async esign(v){
			//let orderDetail = uni.getStorageSync('orderDetail')
			const redirectUrl = `/pagesOrder/order-detail/order-detail?orderId=${this.orderId}`
			let params={
				  companyId: "2",
				  companyName: "上海画毂汽车有限公司",
				  creator: this.esignInfo.creator,
				  idNumber: "310101199007070577",
				  idType: "CRED_PSN_CH_IDCARD",
				  idTypeByOrg: "CRED_ORG_USCC",
				  name: this.userInfo.name,  
				  redirectUrl,
				  // redirectUrl: `http://events.jianshu.io/p/bf31fa3285dd`,
				  userCarSubscribeId: this.orderId,
				  userPhone: this.userInfo.mobile,
			}
			const result = await this.$getRequest(this.$url.esign, 'POST', params)
			if(result.code==0){
				this.from = ''
				uni.setStorageSync('url', result.data.contractUrl || result.data)
				this.$u.route(`/pages/home/profile/wxbview`)
			}
		},
		addedDepositFn(){
			this.isAddedDeposit=true
		},
		
		async createSubscribeOrder() {	// 订阅方案创建订单
			uni.showLoading({// 1. 订阅订单创建
			    title: '订单创建中'
			})
			let params = {
				carSubscribeId: this.carPlanId,
				userId: this.userInfo.id,
				hasDepositFree: this.userInfo.hasDepositFree,
				cityId: this.cityId,
			}
			
			const MerchantMiniAPP = uni.getStorageSync('MerchantMiniAPP')
			if (MerchantMiniAPP) {
				params = {
					...params,
					...MerchantMiniAPP,
				}
			}
			
			const PartnerMiniAPP = uni.getStorageSync('PartnerMiniAPP')
			if (PartnerMiniAPP && this.carTypeYearProductId == PartnerMiniAPP.carTypeYearProductId) {
				params = {
					...params,
					...PartnerMiniAPP,
				}
			}
			
			uni.removeStorageSync('PartnerMiniAPP')
			
			const result = await this.$getRequest(this.$url.createSubscribeOrder, 'POST', params)
			if(result.code != '0') {
			    uni.showToast({
			        title: result.msg,
			        duration: 2000,
			        icon: 'none'
			    });
			    return false;
			}
			uni.hideLoading()
			// uni.showToast({
			//     title: '订单创建成功',
			//     duration: 2000
			// });
			this.orderId = result.data.id
			this.getSubscribeInfo()
			//this.changePlate()
			
		},
		
		delDecorate() {
			uni.showModal({
				title: '提示',
				content: '您确定删除全部精品/装潢？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '保存中',
							icon: 'none'
						})
						
						const params = {
							ordId: this.orderId,
						}
						
						this.$getRequest(this.$url.deleteDecorate, 'GET', params).then(res => {
							if (res.code === 0) {
								this.getSubscribeInfo()
							}
						}).finally(() => {
							uni.hideLoading()
						})
					}
				}
			})
		},
		
		delConfig() {
			uni.showModal({
				title: '提示',
				content: '您确定删除全部车辆增配项？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '保存中',
							icon: 'none'
						})
						
						const params = {
							userCarSubscribeId: this.orderId,
							otherConfigVo: [
								{
									details: [],
									function: ''
								}
							],
						}
						
						this.$getRequest(this.$url.saveOtherConfig, 'POST', params).then(res => {
							if (res.code === 0) {
								this.getSubscribeInfo()
							}
						}).finally(() => {
							uni.hideLoading()
						})
					}
				}
			})
		},
		
		// 1. 增配项 2.装潢
		comfirmConfig(operateType) {
			if (operateType === 1) {
				this.showConfigComfirmModal = true
			} else {
				uni.showModal({
					title: '确定精品/装潢',
					content: '精品/装潢费用需在您提车前一次性支付。如果您需要修改精品/装潢内容，请联系销售人员进行修改。',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '保存中',
								icon: 'none'
							})
							
							const params = {
								ordId: this.orderId,
								operateType,
							}
							
							this.$getRequest(this.$url.updateConfirm, 'GET', params).then(res => {
								if (res.code === 0) {
									this.getSubscribeInfo()
								}
							}).finally(() => {
								uni.hideLoading()
							})
						}
					},
					fail: (err) => {
						console.log('fail', err)
					}
				})
			}
		},
		
		confirmConfigModal() {
			uni.showLoading({
				title: '保存中',
				icon: 'none'
			})
			
			const params = {
				ordId: this.orderId,
				operateType: 1,
			}
			
			this.$getRequest(this.$url.updateConfirm, 'GET', params).then(res => {
				if (res.code === 0) {
					this.changePayment = res.data
					this.showComfirmPaymentModal = true
					
					setTimeout(() => {
						this.paymentTranslateY = '-48'
					}, 1000)
					
					this.getSubscribeInfo()
				}
			}).finally(() => {
				uni.hideLoading()
			})
		},
		
		comfirmPayment() {
			this.showComfirmPaymentModal = false
		},
		
		goConfigDetailPage() {
			const configList = JSON.stringify(this.orderInfo.otherConfigs[0].details)
			uni.navigateTo({
				url: `/pagesOrder/order-detail/setOrderConfigInfo?orderId=${this.orderId}&configList=${configList}`
			})
		},
		
		async getSubscribeInfo() {// 订阅方案 查询订单
			uni.showLoading({
			    title: '加载中'
			});
			const orderInfo = await this.$getRequest(this.$url.getSubscribeInfo, 'POST', {
			    id: this.orderId,
				// id: this.carPlanId,
			    nowPaymentDeposit: this.nowPaymentDeposit ? 0 : 1,
			    usedUserProductId: '', //天次id
			    userCouponIds: this.userCouponIds,//优惠券id
					userId: this.userInfo.id  
			})
			this.orderInfo = orderInfo.data
			
			this.isShowAddedDepositPopUp = orderInfo.data.isShowPopUp
			this.addedDeposit = orderInfo.data.addedDeposit
			this.detailInfo.logoImageUrl = orderInfo.data.productDetail.logoImageUrl
			this.detailInfo.merchantName = orderInfo.data.productDetail.merchantName
			this.detailInfo.imageUrl = orderInfo.data.productDetail.carTypeDetailVO.photoUrl
			this.detailInfo.carBrand = orderInfo.data.productDetail.carTypeDetailVO.carBrand
			this.detailInfo.carType = orderInfo.data.productDetail.carTypeDetailVO.carType
			this.detailInfo.carTypeYear = orderInfo.data.productDetail.carTypeDetailVO.carTypeYear
			this.detailInfo.carTypeYearProduct = orderInfo.data.productDetail.carTypeDetailVO.carTypeYearProduct
			this.carPlate = orderInfo.data.carPlatePriceRespVo
			
			if (orderInfo.data.otherConfigs && orderInfo.data.otherConfigs[0] && orderInfo.data.otherConfigs[0].details) {
				this.configList = orderInfo.data.otherConfigs[0].details.filter(item => item.hasCheck)
			}
			
			
			if (this.carPlate) {
				this.carPlatePay = this.carPlate.plateTotalPrice || 0
			}
			
			this.userCarSubscribeEntity = orderInfo.data.userCarSubscribeEntity // 订单详情
			
			if (this.userCarSubscribeEntity.premium) {
				this.premiumPay = this.userCarSubscribeEntity.premium * this.userCarSubscribeEntity.monthTotal
			}
			
			this.decorateMoney = this.userCarSubscribeEntity.decorateMoney || 0	
			
			// this.userCarSubscribeEntity.hasDepositFree = 0
			
			// if (this.userCarSubscribeEntity.hasDepositFree === 2) {
			// 	this.userCarSubscribeEntity.deposit = 0
			// }
			
			if (this.userCarSubscribeEntity.startDate) {
				const month = this.userCarSubscribeEntity.startDate.slice(5, 7)
				const day = this.userCarSubscribeEntity.startDate.slice(8, 10)
				this.userCarSubscribeEntity.startDate = `${month}月${day}日`
			}
			
			if (this.userCarSubscribeEntity.endDate) {
				const month = this.userCarSubscribeEntity.endDate.slice(5, 7)
				const day = this.userCarSubscribeEntity.endDate.slice(8, 10)
				this.userCarSubscribeEntity.endDate = `${month}月${day}日`
			}
			
			
			if(orderInfo.data.userCarSubscribeEntity.usePlate || orderInfo.data.userCarSubscribeEntity.usePlate == 0) {
				this.curPlate = orderInfo.data.userCarSubscribeEntity.usePlate
			}
			
			this.orderDetailData = orderInfo.data.productDetail
			
			this.paymentStatus = orderInfo.data.userCarSubscribeEntity.status
			
			//this.paymentStatus = 6
			
			this.orderPayStatusName = orderInfo.data.userCarSubscribeEntity.statusStr
			this.reserveFee=orderInfo.data.userCarSubscribeEntity.reserveFee
			
			this.cartype = orderInfo.data.userCarSubscribeEntity.newType
			
			this.isShowCertificationPopUp = orderInfo.data.certificationRespVo.isShowConfirm
			this.isShowContinueUpload = orderInfo.data.certificationRespVo.isShowContinueUpload
			this.certificationList = orderInfo.data.certificationRespVo.certificationRespVos
			this.carPlanId = orderInfo.data.userCarSubscribeEntity.carSubscribeId
			this.cityId = orderInfo.data.userCarSubscribeEntity.cityId
			
			let tempArr = []
			
			if (orderInfo.data.productDetail.safeguardServiceList && orderInfo.data.productDetail.safeguardServiceList.length) {
				tempArr = orderInfo.data.productDetail.safeguardServiceList.map(item => {
					return item == 1 ? '免费送车上门' : '24小时道路救援'
				})
			}
			
			if (orderInfo.data.productDetail.carSubscribeFreeServiceToWeb && orderInfo.data.productDetail.carSubscribeFreeServiceToWeb.length) {
				tempArr = [...tempArr, ...orderInfo.data.productDetail.carSubscribeFreeServiceToWeb]
			}
			
			this.serviceStr = tempArr.join('、')
			const apportionRateCalculateResultList = {
				apportionRateCalculateResultList: orderInfo.data.apportionRateCalculateResultList,
				finalSelectToWeb: orderInfo.data.productDetail.finalSelectToWeb
			}
			uni.setStorageSync("apportionRateCalculateResultList", apportionRateCalculateResultList)
			
			uni.setStorageSync("addCertificationInfo", this.certificationList)
			
			
			
			if (this.paymentStatus === 5) {
				//this.showConfirmCarPhotos = true
			}
			
			if (this.paymentStatus === 13 && orderInfo.data.userCarSubscribeEntity.predictPlateTime) {
				const predictPlateTimer = (new Date(orderInfo.data.userCarSubscribeEntity.predictPlateTime)).getTime()
				const day1 = new Date(predictPlateTimer + dayTimer)
				const day1Month = (day1.getMonth()+1+'').padStart(2, '0')
				const day1Day = (day1.getDate()+'').padStart(2, '0')
				const day1Str = `${day1Month}月${day1Day}日 周${dayList[day1.getDay()]}`
				
				const day2 = new Date(predictPlateTimer + dayTimer*2)
				const day2Month = (day2.getMonth()+1+'').padStart(2, '0')
				const day2Day = (day2.getDate()+'').padStart(2, '0')
				const day2Str = `${day2Month}月${day2Day}日 周${dayList[day2.getDay()]}`
				
				const day3 = new Date(predictPlateTimer + dayTimer*3)
				const day3Month = (day3.getMonth()+1+'').padStart(2, '0')
				const day3Day = (day3.getDate()+'').padStart(2, '0')
				const day3Str = `${day3Month}月${day3Day}日 周${dayList[day3.getDay()]}`
				this.pickCarDateList = [
					[day1Str, day2Str, day3Str],
					hourList,
					minList,
				]
				this.pickCarDateParamsList = [
					{
						year: day1.getFullYear(),
						month: day1Month,
						day: day1Day,
						str: day1Str,
					},
					{
						year: day2.getFullYear(),
						month: day2Month,
						day: day2Day,
						str: day2Str,
					},
					{
						year: day3.getFullYear(),
						month: day3Month,
						day: day3Day,
						str: day3Str,
					},
				]
			}
			
			
			if (this.paymentStatus === 2 && this.depositAboutNoPay.isFirst == 1) {
				this.signToCancelTime = this.orderInfo.signToCancelTime
				if (this.signToCancelTime > 0) {
					this.countdown()
					this.signToCancelTimer = setInterval(() => {
						this.signToCancelTime = this.signToCancelTime - 60000
						this.countdown()
					}, 60000)
				}
			}
			
			if (orderInfo.data.hasRejectAccount) {
				uni.showModal({
					title: '支付凭证审核未通过',
					content: '很抱歉，您所上传的支付凭证未能通过审核，请核实您的付款信息后重新上传正确的支付凭证。',
					confirmText: '查看凭证',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							this.goEndPayPage()
						}
					},
					fail: (err) => {
						console.log('fail', err)
					}
				})
			}
			
			if (this.paymentStatus === 2 && (!this.userCarSubscribeEntity.emergencyContactName || !this.userCarSubscribeEntity.emergencyContactPhone)) {
				uni.showModal({
					title: '提示',
					content: '请先添加备用联系人',
					confirmText: '添加',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: `/pagesOrder/order-detail/contact?orderId=${this.orderId}`
							})
						}
					},
					fail: (err) => {
						console.log('fail', err)
					}
				})
			}
			
			if (orderInfo.data.carSubscribeCarSelectConfigRespVo && orderInfo.data.carSubscribeCarSelectConfigRespVo.totalMoney) {
				this.configTotalMoney = orderInfo.data.carSubscribeCarSelectConfigRespVo.totalMoney
			}
			
			if (this.paymentStatus === 10) {
				let tip = ''
				if(orderInfo.data.hasGuarantor === 1){
					tip = '请添加担保人'
				}
				
				if(orderInfo.data.guarantorIsAgree === 2){
					tip = '很抱歉，您所添加的担保人已拒绝为您提供担保。您可以重新添加其他担保人。'
				}
				
				if(orderInfo.data.guarantorStatus === 2){
					tip = '很抱歉，您所添加的担保人审核失败。您可以重新添加其他担保人。'
				}
				
				if(tip) {
					uni.showModal({
							title: '提示',
							content:tip,
							confirmText: "确定",
							cancelText:"取消",
							success: (res) => {
									if (res.confirm) {
										console.log('tip', tip)
										uni.navigateTo({
											url: `/pagesOrder/order-detail/addGuarantor?userId=${this.userInfo.id}&orderId=${this.orderId}`
										})
									}
							}
					})
				}
			}
			
			this.addCertification()
			
			uni.hideLoading()
		},
		
		openPickCarDateList() {
			this.showPickCarDateList = true
		},
		
		confirmPickCarDate(e) {
			const key1 = e[0] || 0
			const key2 = e[1] || 0
			const key3 = e[2] || 0
			this.confirmPickCarDateTip = `${this.pickCarDateParamsList[key1].year}年${this.pickCarDateParamsList[key1].str} ${hourList[key2].slice(0,2)}:${minList[key3].slice(0,2)}`
			this.deliveryTime = `${this.pickCarDateParamsList[key1].year}-${this.pickCarDateParamsList[key1].month}-${this.pickCarDateParamsList[key1].day} ${hourList[key2].slice(0,2)}:${minList[key3].slice(0,2)}`
			this.showModal = true
		},
		
		closeModal() {
			this.showModal = false
		},
		
		async bindCarPlateNum() {
			const params = {
				orderId: this.orderId,
				deliveryTime: this.deliveryTime,
			}
			
			const res = await this.$getRequest(this.$url.updateDeliveryTime, "POST", params)
			
			if (res.code == 0) {
				this.getSubscribeInfo()
				this.closeModal()
			}
		},
		
		countdown() {
			if (this.signToCancelTime > 0) {
				const oneH = 60 * 60 * 1000
				const h = Math.floor(this.signToCancelTime / oneH) + ''
				const m = Math.floor((this.signToCancelTime % oneH) / (60 * 1000)) + ''
				this.signToCancelTimeStr = h.padStart(2, '0') + ':' + m.padStart(2, '0')
			} else {
				clearInterval(this.signToCancelTimer)
				this.signToCancelTimer = null
				this.getSubscribeInfo()
			}
		},
		
		addCertification() {
			if (this.paymentStatus === 10) {
				if (this.orderInfo.userConfirmStatus !== 2) {
					if (this.orderInfo.isShowPopUp === 1) {
						this.baozhengjin(0)
					} else if (this.isShowCertificationPopUp === 1) {
						this.showCertificationPopUp()
					} else if (this.isShowContinueUpload === 1) {
						uni.showModal({
								title: '提示',
								content:`是否继续提交补充材料`,
								confirmText: "确定",//这块是确定按钮的文字
								cancelText:"取消",//这块是取消的文字
								success: (res) => {
										if (res.confirm) {
											this.goAddCertificationPage()
										}
								}
						})
					}
				}
			}
		},
		
		handleCancel() {// 取消订单
			uni.showModal({
				title: '提示',
				content: '是否确定取消订单',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '请求中'
						});
						
						let url = ''
						let params = {}
						let method = 'POST'
						if (this.index == 4) {
							url = this.$url.cancelPurchaseOrder
							params = {
								id: this.orderId,
								userId: this.userInfo.id
							}
							method = 'PUT'
						} else {
							url = this.$url.cancelSubscribeOrder
							params = {
								id: this.orderId,
								updateBy: this.userInfo.updatedBy
							}
						}
						
						const result = await this.$getRequest(url, method, params)

						if(result.code == 0) {
							this.cancelNotice(1, this.userInfo.id)
							uni.hideLoading()
							uni.showToast({
								title: '订单已取消',
								duration: 2000
							})
							
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/home/choose-index'
								})
								// this.$u.route({
								// 	type: 'navigateBack',
								// 	delta: 1
								// })
							}, 500)
						}
					} else if (res.cancel) {
							console.log('用户点击取消');
					}
				}
			})
		},
		addPay(){//判断是跳转页面还是微信支付
			let price
			if (this.orderDetailData.paymentType == 0) {
				price = this.orderDetailData.payOffPrice
			} else if (this.orderDetailData.paymentType == 1) {
				price = this.orderDetailData.monthPayment
			}
			let addPrice
			if(this.curPlate==1&&this.carPlate!=null&& this.carPlate.plateTotalPrice!=''&&this.carPlate.plateTotalPrice!=null){
				addPrice=this.subPrice*1+this.addedDeposit*1+this.carPlate.plateTotalPrice*1
			}else{
				addPrice=this.subPrice*1+this.addedDeposit*1
			}
			let plateTotalPrice=0
			if(this.carPlate!=null&&this.curPlate == 1){
				if(this.carPlate.plateTotalPrice!=null){
					plateTotalPrice=this.carPlate.plateTotalPrice
				}
			}
			
			if(this.paymentStatus == 2 || this.paymentStatus == 4 || this.paySubscribeFree){		
				let data={
					price:addPrice,
					userId:this.userInfo.id,
					businessId:this.orderId,
					businessType:2,
					openid:this.userInfo.xcxOpenid,
					payType:8,
					addedDeposit:this.addedDeposit,//加收保证金
					payOffPrice:price,//订阅费用
					plateTotalPrice:plateTotalPrice,//牌照价格
					configTotalMoney: this.configTotalMoney,
				}
				uni.setStorageSync("weChat",data)
				
				let businessType = 2
				
				if (this.userCarSubscribeEntity.newType === 2) {
					businessType = 3
				}
				
				if (this.paymentStatus == 2) {
					uni.navigateTo({
						url: `/pagesOrder/pay/chooseDepositPay?orderId=${this.orderId}&price=${this.depositAboutNoPay.remainMoney}&deposit=${this.userCarSubscribeEntity.deposit}&addedDeposit=${this.addedDeposit}&openid=${this.userInfo.xcxOpenid}&userId=${this.userInfo.id}&businessType=${businessType}`
					})
				} else if (this.paymentStatus == 4 || this.paySubscribeFree) {
					uni.navigateTo({
						url: `/pagesOrder/pay/chooseSubscribeFreePay?orderId=${this.orderId}&price=${this.subscribeFreeAboutNoPay.remainMoney}&openid=${this.userInfo.xcxOpenid}&userId=${this.userInfo.id}&totalPayment=${this.userCarSubscribeEntity.totalPayment}&premiumPay=${this.premiumPay}&carPlatePay=${this.carPlatePay}&configTotalMoney=${this.configTotalMoney}&decorateMoney=${this.decorateMoney}&businessType=${businessType}`
					})
				}
			}
			
		},
		async handlePay() {//去支付
			// 1.拉起微信支付
			uni.showToast({
				title: '微信支付中',
				duration: 2000,
				icon: 'loading'
			})
			
			let businessType // 0充值、1长租产品、2新车订阅、3购买二手车、4团购、5会员、6、购买服务
			let payType // 0余额、1押金、2订金、3尾款、4长租费用（包月或季）、6二手车、7支付年费、8订阅费用
			
			if (this.index == 4) {
				payType = '3'
			} else {
				payType = '2'
			}
			
			if (this.paymentStatus == 0) {
				businessType = 2
			}
			
			// 2.创建微信订单
			this.$requestPayment({
				businessId: this.orderId, // 订单ID
				businessType, // 支付类型
				openid: this.userInfo.xcxOpenid,
				payType, // 业务类型
				total: this.reserveFee, // TODO 0.01
				userId: this.userInfo.id,
			}, (res) => {
				if(res == 'success') {
					
					// 支付成功 刷新数据
					if (this.index == 4) {
						this.getPurchaseOrders()
					} else {
						this.getSubscribeInfo()
					}
					
					const userInfo = getApp().globalData.userInfo
					const identityPath = `/pagesOrder/custom-order/order-pay?id=${this.orderId}&planId=${this.carPlanId}&stagingId=${this.stagingItem.stagingId}&index=${this.index}&cartype=${this.cartype}&orderType=${this.orderInfo.orderType}`
					uni.setStorageSync("identityPath", identityPath)
					
					if (userInfo.riskAuditStatus == 5 || userInfo.riskAuditStatus == 6) {
						uni.navigateTo({
							url: identityPath
						})
					} else {
						this.$u.route('/pagesOrder/identity/person-identity?type=5')
					}
				}
			})
			
			uni.hideLoading()
		},
		
		openIdentityDialog() {
			let identityPath = `/pagesOrder/custom-order/order-pay?id=${this.orderId}&planId=${this.orderInfo.userCarSubscribeEntity.carSubscribeId}&index=3&cartype=${this.orderInfo.userCarSubscribeEntity.newType}&configId=${this.orderInfo.userCarSubscribeOtherConfigId}`
			
			if (this.cartype == 2) {
				identityPath = `/pagesOrder/custom-order/order-pay?id=${this.orderId}`
			}
			
			uni.setStorageSync("identityPath", identityPath)
			
			let riskAuditStatus = ''
			if (this.userInfo.riskAuditStatus) {
				riskAuditStatus = this.userInfo.riskAuditStatus
			}
			
			let idcard = ''
			let issue = ''
			if (this.userInfo.userInfoEntity) {
				idcard = this.userInfo.userInfoEntity.idcard || ''
				issue = this.userInfo.userInfoEntity.issue || ''
			}
			
			let depositFreeType = ''
			if (this.userInfo.depositFreeType) {
				depositFreeType = this.userInfo.depositFreeType
			}
			
			let companyName = ''
			if (this.userInfo.userCompanyEntity && this.userInfo.userCompanyEntity.companyName) {
				companyName = this.userInfo.userCompanyEntity.companyName
			}
			
			uni.navigateTo({
				url: `/pagesOrder/identity/choose-identity?riskAuditStatus=${riskAuditStatus}&id=${this.orderId}&idNum=${idcard}&username=${this.userInfo.name}&userId=${this.userInfo.id}&hasDepositFree=${this.userInfo.hasDepositFree}&cityId=${this.orderInfo.userCarSubscribeEntity.cityId}&cityName=${this.orderInfo.userCarSubscribeEntity.cityName}&issue=${issue}&depositFreeType=${depositFreeType}&companyName=${companyName}`
			})
		},
		
		async identity(orderType) {
			const params = {
				 id: this.orderId,
				 status: 1,
				 orderType,
			}
			const result = await this.$getRequest(this.$url.updateUserSubscribeStatus, 'GET', params)
			if(result.code == 0){
				uni.reLaunch({
					url: `/pagesOrder/custom-order/order-pay?id=${this.orderId}&planId=${this.orderInfo.userCarSubscribeEntity.carSubscribeId}&index=3&cartype=${this.orderInfo.userCarSubscribeEntity.newType}&configId=${this.orderInfo.userCarSubscribeOtherConfigId}`
				})
			}
		},
		
		goCustomizedPage()  {
			uni.navigateTo({
				url: `/pagesOrder/custom-order/order-pay?id=${this.orderId}&planId=${this.orderInfo.userCarSubscribeEntity.carSubscribeId}&index=3&cartype=${this.orderInfo.userCarSubscribeEntity.newType}&configId=${this.orderInfo.userCarSubscribeOtherConfigId}`
			})
		},
		
		async handleBookCar() {
			uni.vibrateShort({})
			if(!getApp().globalData.userInfo) {
			    this.$u.route("/pages/sign/sign")
			    return false
			}
			
			// if(getApp().globalData.userInfo.riskAuditStatus != 1 && getApp().globalData.userInfo.riskAuditStatus != 5) {
			//     uni.showModal({
			//         title: '提示',
			//         content: '身份认证后可用车',
			//         // showCancel: false,
			// 		showCancel: '取消',
			//         confirmText: '去认证',
			//         success: (res) => {
			//             if(res.confirm) {
			//                 this.$u.route('/pages/mine/identity/identity')
			//             }
			//         }
			//     });
			//     return false;
			// }
			
			// 1. 订阅订单创建
			// uni.vibrateShort({})
			uni.showLoading({
			    title: '订单创建中'
			});
			
			 var params = {
				carSubscribeId: this.orderDetailData.id,
				userId: this.userInfo.id,
				orderType: this.orderType,
			 }
			const result = await this.$getRequest(this.$url.createSubscribeOrder, 'POST', params)
			if(result.code != '0') {
			    uni.showToast({
			        title: result.msg,
			        duration: 2000,
			        icon: 'none'
			    });
			    return false;
			}
			uni.hideLoading()
			uni.showToast({
			    title: '订单创建成功',
			    duration: 2000
			});
			this.orderSuccessInfo = result.data.id
			
			uni.navigateTo({
				url: '../../ordered/sub-order-info?id='+result.data.id+'&userId='+result.data.userId
			})
			uni.setStorageSync('order-detail-id',result.data.id)
			
			
			
			// 仅为了测试支付用的
			// this.$u.route(`/pages/ordered/sub-order-info?id=${result.data.id}`)
			// uni.request({
			//     url: 'http://api-test.51cheyaoshi.com:6999/app/appuser/createdRechargeCompleteUserAccountDetailToLock',
			//     method: 'POST',
			// 	data: {
			// 	   businessId: result.data.id,
			// 	   businessType: '2',
			// 	   orderNum: '123456',
			// 	   wxOrderNum: '654321',
			// 	   userId: result.data.userId,
			// 	   total: result.data.reserveFee,
			// 	   payType: '3'
			//     },
			//     header: {
			// 	    'authorization': '25a32705-b678-4d33-84a1-bbf5b2402b5e' //自定义请求头信息
			//     },
			//     success: (res) => {
			// 	  this.userCarSubscribeIds = res.data.data.businessId
			// 	  this.getqwer()
			//     },
			// 	fail:(err) => {
			// 		uni.showToast({
			// 			title:err.msg,
			// 			icon:"none"
			// 		})
			// 	}
			// });
			// uni.navigateTo({
			// 	url: './order-pay'
			// })
		},
		// getqwer() {
		// 	uni.request({
		// 	    url: 'http://api-test.51cheyaoshi.com:6999/app/userCarSubscribe/updateUserCarSubscribeToPayment', 
		// 	    method: 'GET',
		// 		data: {
		// 			userCarSubscribeId: this.userCarSubscribeIds
		// 	    },
		// 	    header: {
		// 	        'authorization': '6w772l609Je6p590Qc3EpBs1gMQN7Y60#1' //自定义请求头信息
		// 	    },
		// 	    success: (res) => {
		// 			uni.showToast({
		// 				title: '支付成功'
		// 			})
		// 			uni.navigateTo({
		// 				url: './order-pay?orderSuccessInfo=' + this.orderSuccessInfo
		// 			})
		// 	    },
		// 		fail: (err) => {
		// 			uni.showToast({
		// 				title: err.msg,
		// 				icon: 'error'
		// 			})
		// 		}
		// 	});
		// },
		getOrderDetailData() {
			var that = this;
			uni.showLoading({
				title: '加载中'
			})
			var params = {
				id: that.carPlanId,
				userId:this.userInfo.id
			}
			that.$getRequest(that.$url.getOrderDetail, 'GET', params).then((data) => {
				uni.hideLoading()
				if(data.code == 0) {
					this.orderDetailData = data.data
				}
			})
		},
		
		// 1.订金提示 3.返还积分提示
		showPop() {
			this.showPopup = true
		},
		
		// 1.押金 2.订阅费用
		showPayPop(index) {
			if (index == 1) {
				this.showDepositPay = true
			} else if (index == 2) {
				this.showSubscribeFreePay = true
			}
		},
		
		formatTenThousandNumber(number, unit1, unit2) {
			return formatTenThousandNumber(number, unit1, unit2)
		},
		formatThousandNumber(num) {
			if (num) {
				return formatThousandNumber(num)
			}
			return 0
		},
		getSubscriptionPrice() {// 计算订阅费用
			let price
			if (this.orderDetailData.paymentType == 0) {
				price = this.orderDetailData.payOffPrice
			} else if (this.orderDetailData.paymentType == 1) {
				price = this.orderDetailData.monthPayment
			}
			this.subPrice=price
			if (price || price == 0) {
				this.subPrice=price
				return `￥${formatThousandNumber(price)}`
			}
			return '-'
		},
		getDeposit() {// 保证金
			return getDeposit(this.orderDetailData.deposit)
		},
		showProtocol() {// 跳转协议页面
		  this.$goHtml(contractUrl, '')
		},
		
		// changeCity .切换城市 
		goPlatePage(from = '') {
			if(this.paymentStatus == 0) {
				this.$u.route(`/pagesOrder/chooseCarPlate/restrictedCityCarPlate?id=${this.carPlanId}&cityId=${this.cityId}&cityName=${this.userCarSubscribeEntity.cityName}&orderId=${this.orderId}&index=3&cartype=${this.cartype}&from=${from}`)
			}
		},
		
		goFinalOptionPage() {
			if (this.orderInfo.canChangeFinalSelector === 1) {
				const overMileageFee = this.userCarSubscribeEntity.overMileageFee || ''
				
				uni.navigateTo({
					url: `/pagesOrder/custom-order/end-eriod-option?id=${this.orderId}&planId=${this.carPlanId}&cartype=${this.cartype}&configId=${this.orderInfo.userCarSubscribeOtherConfigId}&limitMileage=${this.userCarSubscribeEntity.limitMileage}&overMileageFee=${overMileageFee}`
				})
			}
		},
		
		changePlate() {// 牌照切换
			this.$getRequest(this.$url.updatePlateScheme, 'POST', {
				id: this.orderId,
				cityId: this.cityId,
				plateCityId: this.plateCityId,
				plateCityName: this.plateCityName,
			}).then((res) => {
				if(res.code == 0) {
					this.getSubscribeInfo()
				}
			})
		},
		
		// 确认或拒绝 加收保证金
		async addDepositFn(accessOrReject,orderType) {
			uni.showLoading({
				title: '加载中'
			})
			
			let params={
				accessOrReject:accessOrReject,
				orderId:this.orderId,
				orderType:orderType
			}
			
			await this.$getRequest(this.$url.addDeposit, 'GET', params).then((data) => {
				if(data.code == 0) {
					if (this.isShowCertificationPopUp && accessOrReject === 1) {
						this.showCertificationPopUp()
					} else {
						this.getSubscribeInfo()
					}
				}
			})
			
			uni.hideLoading()
		},
		
		// 确认或拒绝 提交补充材料 1接受，0拒绝
		async addCertificationFn(accessOrReject) {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				accessOrReject,
				orderId: this.orderId,
			}
			
			await this.$getRequest(this.$url.addCertification, 'GET', params).then((data) => {
				if(data.code == 0) {
					if (accessOrReject === 1) {
						this.goAddCertificationPage()
					} else {
						this.getSubscribeInfo()
					}
				}
			})
			
			uni.hideLoading()
		},
		
		confirmCertificationModal() {
			this.addCertificationFn(1)
		},
		
		cancelCertificationModal() {
			uni.showModal({
					title: '拒绝订单将被关闭',
					content:`订金会在5个工作日原路返回`,
					confirmText: "取消",//这块是确定按钮的文字
					cancelText:"拒绝",//这块是取消的文字
					success: (res)=> {
								if (res.confirm) {
									this.showCertificationPopUp()
								} else if (res.cancel) {
									this.addCertificationFn(0)
								}
						}
			})
		},
		
		showCertificationPopUp() {
			this.showCertificationModal = true
		},
		
		confirmAddedDepositModal() {
			this.addDepositFn(1, this.addDepositOrderType)
		},
		
		cancelAddedDepositModal() {
			uni.showModal({
					title: '拒绝订单将被关闭',
					content:`订金会在5个工作日原路返回`,
					confirmText: "取消",//这块是确定按钮的文字
					cancelText:"拒绝",//这块是取消的文字
					success: (res)=> {
								if (res.confirm) {
									this.baozhengjin(this.addDepositOrderType)
								} else if (res.cancel) {
									this.addDepositFn(2, this.addDepositOrderType)
								}
						}
			})
		},
		
		baozhengjin(v){//加收保证金弹窗
			const that=this
			this.addDepositOrderType = v
			if(this.addedDeposit!=null){
				this.showAddedDepositModal = true
			}
		},
		
		goAddCertificationPage(type = 'add') {
			uni.navigateTo({
				url: `/pagesOrder/order-detail/add-certification?orderId=${this.orderId}&userId=${this.userInfo.id}&type=${type}`
			})
		},
		
		// 复制订单号
		copyOrder(orderNum) {
			uni.setClipboardData({
				data: orderNum,
			})
		},
		
		openCarDatePopup() {
			this.showCarDatePopup = true
		},
	}
}
</script>

<style lang="scss" scoped>
	::v-deep .u-mode-center-box {
		width: 320px !important;
	}
	
	.addedDeposit-popup{
		width: 100%;
		height: 200px;
		border-radius: 12px 12px 0px 0px;
		background: #FFFFFF;
		.title-added{
			width: 100%;
			height: 64px;
			border-radius: 12px 12px 0px 0px;
			background: #FFFFFF;
			font-family: PingFangSC-Medium;
			font-size: 15px;
			font-weight: 500;
			line-height: 64px;
			text-align: center;
			letter-spacing: 0px;
			color: rgba(0, 0, 0, 0.9);
		}
		.added-text{
			margin-top: 12px;
			padding: 0 24px;
			box-sizing: border-box;
			width: 100%;
			height: 66px;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			font-weight: normal;
			line-height: 22px;
			letter-spacing: 0px;
			color: rgba(10, 15, 45, 0.8);
		}
	}
	.f-right {
		float: right;
		text-align: right;
	}
	.order-detail {
		padding: 0;
		margin: 36rpx 32rpx;
		.o-head {
			margin-bottom: 12px;
			.o-head-info {
				display: flex;
				align-items: center;
				image {
					width: 24rpx;
					height: 24rpx;
				}
				text {
					font-size: 24rpx;
					margin-left: 8rpx;
				}
			}
			.o-head-car {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20rpx;
				.car-info {
					flex: 1;
					display: flex;
					align-items: center;
				}
				image {
					width: 234rpx;
				}
				.o-head-car-text {
					flex: 1;
					margin-left: 10rpx;
					.title {
						font-size: 30rpx;
						font-weight: 500;
						line-height: 44rpx;
						color: rgba(10, 15, 45, 0.8);
					}
					.subtitle {
						font-size: 24rpx;
						line-height: 40rpx;
						color: rgba(10, 15, 45, 0.8);
					}
				}
				
				.order-status {
					margin-left: 20rpx;
					width: 120rpx;
					min-height: 108rpx;
					padding: 8rpx;
					border-radius: 16rpx;
					border: 2rpx solid #5F19F5;
					font-size: 30rpx;
					font-weight: 500;
					color: #5F19F5;
					line-height: 44rpx;;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
			}
		}
		.o-content {
			padding: 20px 32rpx;
			margin-bottom: 12px;
			border-radius: 24rpx;
			box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
			    0px 8px 24px rgba(10, 15, 45, 0.06);
			.o-c-t{
				display:flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 16px;
				.o-content-title {
					font-size: 17px;
					position: relative;
					padding-left: 20rpx;
					color: #0A0F2D;
					font-weight: 500;
				}
				.plate {
					margin-right: -4rpx;
					height: 22px;
					font-size: 14px;
					line-height: 22px;
					color: rgba(10, 15, 45, 0.8);
					display: flex;
					align-items: center;
					.arrow {
						margin-left: 8rpx;
						transform: rotate(90deg);
					}
				}
				
				.o-content-self {
					padding: 0 5px;
					display:flex;
					justify-content: space-between;
					align-items: center;
				}
				
				.o-content-title:before {
					content: "";
					position: absolute;
					width: 4rpx;
					height: 28rpx;
					border-radius: 4rpx;
					background-color: #0AEB7D;
					top: 10rpx;
					left: 4rpx;
				}
				
				.icon-box {
					padding-left: 32rpx;
					display: flex;
					align-items: center;
					.img {
						width: 32rpx;
					}
				}
			}
			.plate-content {
				display:flex;
				justify-content: space-between;
				align-items: center;
				position: relative;
				.o-content-title {
					padding-left: 20rpx;
					display:flex;
					align-items: center;
					.icon {
						margin-left: 8rpx;
					}
				}
			}
			.price {
				font-size: 14px;
				color: #BFBFBF;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			.o-content-self {
				margin-bottom: 20rpx;
				padding: 20rpx 0 0rpx 16rpx;
				.o-content-row {
					line-height: 2.2;
					.o-content-title{
						font-size: 28rpx;
						color: rgba(10, 15, 45, 0.8);
					}
					.o-content-text{
						font-size: 28rpx;
						color: #0A0F2D;
					}
				}
			}
		}
		
		.purchase-content {
			margin-top: 40rpx;
		}
		
		.o-footer {
			font-size: 24rpx;
			margin-top:38rpx;
			text {
				color: #197EF5;
			}
		}
		
		.foot-but-l {
			display: flex;
			align-items: center;
			.icon-wrap {
				padding-left: 12rpx;
				width: 100rpx;
				height: 100%;
				display: flex;
				align-items: center;
			}
		}
	}
	.btnTextPrice{
		width: 100%;
		height: 100%;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.popup-wrap {
		.reserve-rule {
			.content {
				font-size: 28rpx;
				line-height: 44rpx;
				color: rgba(10, 15, 45, 0.8);
				padding: 66rpx 0 200rpx;
			}
		}
		.plate {
			.plate-content {
				margin-top: 33px;
				.content-title {
					height: 22px;
					font-size: 14px;
					font-weight: 500;
					line-height: 22px;
					color: #0A0F2D;
				}
				.certification-list {
					margin-top: 16px;
					margin-bottom: 40px;
					.certification {
						margin-bottom: 8px;
						height: 22px;
						font-size: 14px;
						line-height: 22px;
						color: #3D3D3D;
					}
				}
			}
		}
	}
	
	.btu {
		background: rgba(10, 15, 45, 0.04);
		border-radius: 16rpx;
		text-align: center;
		color: #0A0F2D;
		font-weight: 500;
		font-size: 30rpx;
		padding: 26rpx 0;
		margin: 16px 8rpx 0;
	}
	.popupView{
		width: 297px;
		height: 258px;
		border-radius: 12px;
		background: #FFFFFF;
		padding: 32px 25px;
		box-sizing: border-box;
		.popup-title{
			display: flex;
			justify-content: center;
			width: 100%;
			margin-bottom: 32px;
			font-family: PingFangSC-Medium;
			font-size: 20px;
			font-weight: 500;
			line-height: 30px;
			letter-spacing: 0px;
			color: #141414;
		}
		.popup-list{
			width: 100%;
			margin-bottom: 8px;
			border-bottom: 1px solid #EEEEEE;
			view{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 8px;
			}
		}
		.list-title{
			font-family: PingFangSC-Regular;
			font-size: 14px;
			font-weight: normal;
			line-height: 22px;
			letter-spacing: 0px;
			color: #64696F;
		}
		.list-price{
			font-family: PingFangSC-Regular;
			font-size: 14px;
			font-weight: normal;
			line-height: 22px;
			letter-spacing: 0px;
			color: #141414;
		}
	}
	
.model-content {
	padding: 16px 40rpx;
	line-height: 44rpx;
	font-size: 14px;
	color: rgba(10, 15, 45, 0.8);
}

.item {
	margin-top: 12px;
	display: flex;
	justify-content: space-between;
	font-size: 14px;
	color: rgba(10, 15, 45, 0.8);
	
	position: relative;
	.item-title {
		display: flex;
		height: 44rpx;
		line-height: 44rpx;
		.icon {
			margin-left: 8rpx;
			color: rgba(10, 15, 45, 0.5);
		}
	}
	.center-deposit {
		font-size: 28rpx;
		text-decoration: line-through;
		color: rgba(191, 191, 191, 0.8);
	}
	.item-content {
		line-height: 44rpx;
		display: flex;
		flex:1;
		width:0;
		padding-left: 24rpx;
		justify-content: flex-end;
		text-align: right;
		.arrow {
			margin-left: 8rpx;
			transform: rotate(90deg);
		}
	}
	.pic-list {
		width: 100%;
		display: flex;
		justify-content: space-between;
		.pic-wrap {
			width: 23%;
			.img {
				width: 100%;
				height: 120rpx;
			}
		}
	}
}

.has-center-item {
	.center-item {
		font-size: 28rpx;
		color: rgba(191, 191, 191, 0.8);
	}
	.item-content {
		flex: none;
		width: unset;
	}
}

.card-container {
	padding-left: 20rpx;
	.split-line {
		width: 100%;
		height: 2rpx;
		background: rgba(10, 15, 45, 0.04);
		margin: 16px 0;
	}
}

.service {
	font-size: 14px;
	line-height: 60rpx;
	color: rgba(10, 15, 45, 0.8);
}

.footer-btn {
	width: 100%;
	padding: 0 40rpx;
	position: fixed;
	bottom: 40px;
	left: 0;
	z-index: 100;
	.btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #fff;
		padding: 0 32rpx;
		.left {
			.price-wrap {
				height: 40rpx;
				display: flex;
				align-items: center;
				.pay-type {
					font-size: 12px;
				}
				.pay {
					display: flex;
					align-items: flex-end;
					.unit {
						font-size: 12px;
						transform: translateY(-6rpx);
					}
					.price {
						font-size: 20px;
					}
				}
			}
			.tip {
				margin-top: 4px;
				height: 32rpx;
				font-size: 10px;
				line-height: 32rpx;
				color: rgba(255, 255, 255, 0.8);
			}
		}
		.right {
			display: flex;
			align-items: center;
			.detail-arrow {
				margin-left: 12rpx;
				width: 24rpx;
				height: 24rpx;
			}
		}
	}
}

.sign-btn-wrap {
	margin-top: 20px;
}

.sign-btn {
	width: 100%;
	height: 116rpx;
	border-radius: 16rpx;
	background: #0A0F2D;
	font-size: 17px;
	color: #FFFFFF;
	display: flex;
	justify-content: center;
	align-items: center;
}

.tel {
	margin-top: 20px;
	height: 44rpx;
	font-size: 12px;
	line-height: 44rpx;
	color: #A1A1A1;
	text-align: center;
}

.subscribing {
	margin-bottom: 16px;
	display: flex;
	justify-content: space-between;
	.subscribing-item {
		width: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		.subscribing-date {
			height: 64rpx;
			font-size: 24px;
			line-height: 64rpx;
			color: #000000;
		}
		.line {
			margin-bottom: 16px;
			width: 30rpx;
			height: 4rpx;
			background: #000000;
		}
		.text {
			height: 44rpx;
			font-size: 14px;
			line-height: 44rpx;
			color: rgba(10, 15, 45, 0.5);
		}
		.tag {
			width: 126rpx;
			height: 44rpx;
			border-radius: 22rpx;
			background: rgba(10, 15, 45, 0.04);
			font-size: 14px;
			color: rgba(10, 15, 45, 0.8);
			font-weight: 500;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}

.modal-content {
	width: 640rpx;
	padding: 30px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	.modal-tip {
		height: 42rpx;
		font-size: 15px;
		line-height: 42rpx;
		color: #8A8A8A;
	}
	.modal-car-plate-date {
		margin-top: 30px;
		height: 44rpx;
		font-size: 20px;
		line-height: 44rpx;
		color: #3D3D3D;
	}
}

.text-link {
	margin-top: 12px;
	height: 44rpx;
	font-size: 14px;
	line-height: 44rpx;
	text-decoration: underline;
	color: #3446AA;
	text-align: center;
}

.block {
	margin-top: 12px;
	padding: 0 36rpx 12px;
	border-radius: 4rpx;
	background: #F9F9F9;
	font-size: 14px;
	color: rgba(10, 15, 45, 0.8);
	line-height: 44rpx;
	.block-item {
		padding-top: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.block-item-title {
			display: flex;
			align-items: center;
		}
	}
}

.comfirm-btn {
	margin-top: 40rpx;
	width: 100%;
	height: 88rpx;
	border-radius: 16rpx;
	background: #0A0F2D;
	font-size: 14px;
	color: #FFFFFF;
	display: flex;
	justify-content: center;
	align-items: center;
}

.config-text-link {
	margin-top: 40rpx;
	height: 44rpx;
	font-size: 28rpx;
	line-height: 44rpx;
	text-decoration: underline;
	color: #3446AA;
	text-align: center;
}

.payment-wrap {
	height: 48rpx;
	overflow: hidden;
	.payment-container {
		transition: transform 1s;
	}
	.payment {
		height: 48rpx;
		line-height: 48rpx;
		color: #3D3D3D;
		font-size: 46rpx;
	}
}

.link-text {
	font-size: 28rpx;
	text-decoration: underline;
	color: #3446AA;
}

.yellow-text {
	font-size: 28rpx;
	color: #FFD13C;
}

.title-tip {
	font-size: 12px;
	color: #6E6F77;
}

.plan-title {
	height: 96rpx;
	line-height: 96rpx;
	text-align: center;
	font-size: 40rpx;
	color: #0A0F2D;
	font-weight: 500;
}

.total-payment {
	margin-top: 16rpx;
	padding: 24rpx 24rpx 0;
	border-radius: 8rpx;
	background: #F5F6F7;
	.item {
		margin-top: 0;
		padding-bottom: 24rpx;
	}
}
</style>