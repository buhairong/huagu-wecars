<template>
  <view class="order-list">
    <u-sticky>
      <view style="width: 686rpx; padding-right: 32rpx">
        <u-tabs
          ref="tabs"
          :item-width="160"
          active-color="#0A0F2D"
          inactive-color="rgba(10, 15, 45, 0.8)"
          font-size="32"
          :list="tabList"
          :is-scroll="true"
          :current="current"
          @change="change"
        ></u-tabs>
      </view>
    </u-sticky>

    <view v-if="current == 0">
      <view v-if="list && list.length == 0">
        <u-gap height="200" bg-color="#FFFFFF" />
        <u-empty text="暂无订单" mode="list" />
      </view>
      <view class="list-wrap">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="card rental-item"
          @click="handleRentalDetail(item)"
        >
          <view class="card-header">
            <view class="car-info-wrap">
              <image
                class="img"
                :src="item.carTypeYearProductEntity.imageUrl"
              />
              <view class="car-info">
                <view class="brand">
                  <view class="brand-text"
                    >{{ item.carTypeYearProductEntity.carBrand }}
                    {{ item.carTypeYearProductEntity.carType }}</view
                  >
                  <view class="tag">{{ item.totalDay }}天</view>
                </view>
                <view class="product"
                  >{{ item.carTypeYearProductEntity.carTypeYear }}
                  {{ item.carTypeYearProductEntity.carTypeYearProduct }}</view
                >
              </view>
            </view>
            <view class="status-wrap">{{
              MEMBER_CAR_RENTAL_ORDER_STATUS[item.status]
            }}</view>
          </view>

          <view class="card-item">
            <view class="card-label">用车时间：</view>
            <view class="card-item-content"
              >{{ item.startDate }} 至 {{ item.endDate }}</view
            >
          </view>

          <view class="card-item">
            <view class="card-label">订单总额：</view>
            <view class="card-item-content"
              >¥ {{ item.totalPayment | $numFormat }}</view
            >
          </view>

          <view
            v-if="item.status == 3"
            class="del-btn"
            @click.stop="removeRentalOrder(item)"
            >删除订单</view
          >
        </view>
      </view>
    </view>
    <view v-if="current == 1">
      <view class="company-dropdown" v-if="companyList.length > 1">
        <u-dropdown>
          <u-dropdown-item
            @change="changeCompany"
            v-model="currentCompanyId"
            :title="currentCompanyLabel"
            :options="companyList"
            menu-icon
          >
          </u-dropdown-item>
        </u-dropdown>
      </view>
      <view v-if="companyOrderList && companyOrderList.length == 0">
        <u-gap height="200" bg-color="#FFFFFF" />
        <u-empty text="暂无订单" mode="list" />
      </view>
      <view class="list-wrap">
        <view
          v-for="(item, index) in companyOrderList"
          :key="index"
          class="card rental-item"
          @click="handleRentalDetail(item)"
        >
          <view class="card-header">
            <view class="car-info-wrap">
              <image
                class="img"
                :src="item.carTypeYearProductEntity.imageUrl"
              />
              <view class="car-info">
                <view class="brand">
                  <view class="brand-text"
                    >{{ item.carTypeYearProductEntity.carBrand }}
                    {{ item.carTypeYearProductEntity.carType }}</view
                  >
                  <view class="tag">{{ item.totalDay }}天</view>
                </view>
                <view class="product"
                  >{{ item.carTypeYearProductEntity.carTypeYear }}
                  {{ item.carTypeYearProductEntity.carTypeYearProduct }}</view
                >
              </view>
            </view>
            <view class="status-wrap">{{
              MEMBER_CAR_RENTAL_ORDER_STATUS[item.status]
            }}</view>
          </view>

          <view class="card-item">
            <view class="card-label">用车时间：</view>
            <view class="card-item-content"
              >{{ item.startDate }} 至 {{ item.endDate }}</view
            >
          </view>

          <view class="card-item">
            <view class="card-label">订单总额：</view>
            <view class="card-item-content"
              >¥ {{ item.totalPayment | $numFormat }}</view
            >
          </view>

          <view
            v-if="item.status == 3"
            class="del-btn"
            @click.stop="removeRentalOrder(item)"
            >删除订单</view
          >
        </view>
      </view>
    </view>
    <!-- <view v-if="current == 2">
		    <view v-if="businessOrderList.length == 0">
		      <u-gap
		          height="200"
		          bg-color="#FFFFFF"
		      />
		      <u-empty
		          text="暂无订单"
		          mode="list"
		      />
		    </view>
			<view class="list-wrap">
				
			</view>
		</view> -->
    <view v-if="current == 2">
      <view class="company-dropdown" v-if="companyList.length > 1">
        <u-dropdown>
          <u-dropdown-item
            @change="changeCompany"
            v-model="currentCompanyId"
            :title="currentCompanyLabel"
            :options="companyList"
            menu-icon
          >
          </u-dropdown-item>
        </u-dropdown>
      </view>
      <view v-if="companyBusinessOrderList.length == 0">
        <u-gap height="200" bg-color="#FFFFFF" />
        <u-empty text="暂无订单" mode="list" />
      </view>
      <view class="list-wrap">
        <view
          v-for="(item, index) in companyBusinessOrderList"
          :key="index"
          class="card rental-item"
          @click="handleBusinessOrderDetail(item)"
        >
          <view class="card-item">
            <view class="card-label">活动名称：</view>
            <view class="card-item-content">{{
              item.memberBusinessActivityEntity.siteName
            }}</view>
          </view>

          <view class="card-item">
            <view class="card-label">活动类型：</view>
            <view class="card-item-content">
              {{
                BUSINESS_ACTIVITY_STATUS[
                  item.memberBusinessActivityEntity.businessActivityType
                ]
              }}
            </view>
          </view>

          <view class="card-item">
            <view class="card-label">活动地点：</view>
            <view class="card-item-content">{{
              item.memberBusinessActivityEntity.address
            }}</view>
          </view>

          <view class="card-item">
            <view class="card-label">活动时间：</view>
            <view class="card-item-content"
              >{{ item.startDate }} 至 {{ item.endDate }}</view
            >
          </view>

          <view class="card-item">
            <view class="card-label">订单总额：</view>
            <view class="card-item-content"
              >¥ {{ item.money | $numFormat }}</view
            >
          </view>

          <view class="card-item">
            <view class="card-label">支付方式：</view>
            <view class="card-item-content">
              {{ BUSINESS_ORDER_PAY_WAY_STATUS[item.payWay] }}
            </view>
          </view>

          <view class="card-item">
            <view class="card-label">我的管家：</view>
            <view class="card-item-content">{{
              item.memberButlerEntity.name
            }}</view>
          </view>

          <view class="card-item">
            <view class="card-label">联系管家：</view>
            <view class="card-item-content">{{
              item.memberButlerEntity.mobile
            }}</view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="current == 3">
      <view v-if="subList && subList.length == 0">
        <u-gap height="200" bg-color="#FFFFFF" />
        <u-empty text="暂无订单" mode="list" />
      </view>
      <view class="list-wrap">
        <view
          v-for="(item, index) in subList"
          :key="index"
          class="item"
          @click="handleNewCarDetail(item)"
        >
          <view class="subStatus">
            <view class="status-text">
              {{ item.status | subOrderText }}
            </view>
          </view>
          <view class="u-flex">
            <view>
              <u-image width="90rpx" height="90rpx" :src="item.logoUrl" />
            </view>
            <view class="brand">
              <view class="u-flex">
                <view class="name">
                  {{ item.fullName }}
                </view>
              </view>
            </view>
          </view>
          <view class="order-list-info">
            <view class="u-flex u-col-top take-off">
              <view>待付：</view>
              <view>
                <view v-if="item.status === 2 || item.status === 4">{{
                  item.needPaymentMoney
                }}</view>
                <view v-else>-</view>
              </view>
            </view>
            <view class="u-flex u-col-top take-off">
              <view>状态：</view>
              <view>
                <view>{{ item.status | subOrderText }}</view>
              </view>
            </view>
            <view class="u-flex u-col-top pick-up" v-if="item.hasModify === 1">
              您订阅的车辆增配项信息已更新，请前往查看并确认。
            </view>
          </view>
		  
		  <view
		      v-if="item.status == 8"
		      class="del-btn"
		      @click.stop="removeNewCarOrder(item)"
		  >
			删除订单
		  </view>
        </view>
      </view>
      <u-loadmore
        v-if="subList.length"
        class="loadmore"
        :status="status"
        :load-text="loadText"
      />
    </view>
	<view v-if="current == 4">
	  <view v-if="longRentalOrderList && longRentalOrderList.length == 0">
	    <u-gap height="200" bg-color="#FFFFFF" />
	    <u-empty text="暂无订单" mode="list" />
	  </view>
	
	  <view class="list-wrap">
	    <view
	      v-for="(item, index) in longRentalOrderList"
	      :key="index"
	      class="card rental-item"
	      @click="handleLongRentalOrderDetail(item)"
	    >
	      <view class="card-header">
	        <view class="car-info-wrap">
	          <image class="img" :src="item.image" />
	          <view class="car-info">
	            <view class="brand">
	              <view class="brand-text"
	                >{{ item.carBrand }} {{ item.carType }}</view
	              >
	              <view
	                class="tag"
	                v-if="item.status === 100 || item.status === 120"
	                >{{ item.overDay }}天</view
	              >
	            </view>
	            <view class="product"
	              >{{ item.carTypeYear }} {{ item.carTypeYearProduct }}</view
	            >
	          </view>
	        </view>
	        <view
	          class="status-wrap"
	          :class="{ 'red-status': item.status === 120 }"
	          >{{ CAR_RENTAL_ORDER_STATUS[item.status] }}</view
	        >
	      </view>
	
	      <view class="card-item" v-if="item.status === 80">
	        <view class="card-label">接车信息：</view>
	        <view class="card-item-content"
	          >{{ item.startDate }} {{ item.pickUpAddress }}</view
	        >
	      </view>
	
	      <view class="card-item" v-else-if="item.status === 110">
	        <view class="card-label">还车信息：</view>
	        <view class="card-item-content"
	          >{{ item.endDate }} {{ item.returnAddress }}</view
	        >
	      </view>
	
	      <view class="card-item" v-else>
	        <view class="card-label">用车时间：</view>
	        <view class="card-item-content"
	          >{{ item.startDate }} 至 {{ item.endDate }}</view
	        >
	      </view>
	
	      <view class="card-item">
	        <view class="card-label">订单总额：</view>
	        <view class="card-item-content"
	          >¥ {{ item.totalMoney | $numFormat }}</view
	        >
	      </view>
	
	      <view
	        class="card-item"
	        v-if="item.status === 130 || item.status === 150"
	      >
	        <view class="card-label">退还押金：</view>
	        <view class="card-item-content"
	          >¥ {{ item.deposit | $numFormat }}</view
	        >
	      </view>
	
	      <view class="card-item" v-else-if="item.businessType === 1">
	        <view class="card-label">还款日期：</view>
	        <view class="card-item-content">每月{{ item.day }}日</view>
	      </view>
	
	      <view class="card-item">
	        <view class="card-label">订单编号：</view>
	        <view class="card-item-content">{{ item.orderNum }}</view>
	      </view>
		  
		  <view
		      v-if="item.status == 50"
		      class="del-btn"
		      @click.stop="removeLongRentalOrderOrder(item)"
		  >
		  			删除订单
		  </view>
	    </view>
	  </view>
	</view>
	  
    <view v-if="current == 5">
      <view v-if="rentalList && rentalList.length == 0">
        <u-gap height="200" bg-color="#FFFFFF" />
        <u-empty text="暂无订单" mode="list" />
      </view>
      <view class="list-wrap">
        <view
          v-for="(item, index) in rentalList"
          :key="index"
          class="card rental-item"
          @click="handleCustomerDetail(item)"
        >
          <view class="card-header">
            <view class="car-info-wrap">
              <view class="car-info" style="padding-left: 0">
                <view class="brand">
                  <view class="brand-text"
                    >{{ item.carTypeYearProduct.carBrand }}
                    {{ item.carTypeYearProduct.carType }}</view
                  >
                </view>
                <view class="product"
                  >{{ item.carTypeYearProduct.carTypeYear }}
                  {{ item.carTypeYearProduct.carTypeYearProduct }}</view
                >
              </view>
            </view>
          </view>

          <view class="card-item">
            <view class="card-label">融资年限：</view>
            <view class="card-item-content">{{
              SUBSCRIBE_PERIOD_STATUS[
                item.userCarFinanceLeaseSubscribe.subscriptionCycle
              ]
            }}</view>
          </view>

          <view class="card-item">
            <view class="card-label">签约主体：</view>
            <view class="card-item-content">{{ item.userEntity.name }}</view>
          </view>

          <view class="card-item">
            <view class="card-label">月供金额：</view>
            <view class="card-item-content"
              >{{
                item.userCarFinanceLeaseSubscribe.firstMonthMoney | $numFormat
              }}元</view
            >
          </view>
        </view>
      </view>
      <u-loadmore
        v-if="rentalList.length"
        class="loadmore"
        :status="status"
        :load-text="loadText"
      />
    </view>

    
  
  
  </view>
</template>
<script>
import {
  orderStatus,
  orderStatusOptions,
  CAR_RENTAL_ORDER_STATUS,
  SUBSCRIBE_PERIOD_STATUS,
  MEMBER_CAR_RENTAL_ORDER_STATUS,
  BUSINESS_ACTIVITY_STATUS,
  BUSINESS_ORDER_PAY_WAY_STATUS,
} from "@/constants";
import { subOrderStatusOptions } from "@/constants/order";

export default {
  name: "OrderList",

  filters: {
    orderText(value) {
      return orderStatusOptions.find((item) => item.value === value).text;
    },
    subOrderText(value) {
      let res = "";
      const findItem = subOrderStatusOptions.find(
        (item) => item.value === value
      );
      if (findItem) {
        res = findItem.name;
      }
      return res;
    },
  },

  data() {
    return {
      SUBSCRIBE_PERIOD_STATUS,
      CAR_RENTAL_ORDER_STATUS,
      MEMBER_CAR_RENTAL_ORDER_STATUS,
      BUSINESS_ACTIVITY_STATUS,
      BUSINESS_ORDER_PAY_WAY_STATUS,
      tabList: [
        {
          name: "会员租车",
        },
        {
          name: "企业租车",
        },
        {
          name: "商务活动",
        },
        {
          name: "新车订阅",
        },
		{
		  name: "折扣长租",
		}
      ],
      current: 0,
      subList: [],
      subStatus: "loadmore", // 加载更多 状态
      subPage: 0, // 第N页
      subTotalPages: 0, // 总页数
      userInfo: null, // 用户信息
      userId: null, // 用户id
      list: [],
      status: "loadmore", // 加载更多 状态
      page: 0, // 第N页
      totalPages: 0, // 总页数
      loadText: {
        loadmore: "轻轻上拉",
        loading: "努力加载中",
        nomore: "实在没有了",
      },
      rentalList: [],
      currentCompanyId: "",
      companyList: [],
      currentCompanyLabel: "",
      companyOrderList: [],
      businessOrderList: [],
      companyBusinessOrderList: [],
      longRentalOrderList: [],
    };
  },

  onShow() {
    this.subList = [];
    this.subPage = 0;
    this.subTotalPages = 0;
    this.list = [];
    this.page = 0;
    this.totalPages = 0;
    getApp().globalData.getUserInfo((data) => {
      this.userInfo = data;
      this.userId = data.id;
      this.list = [];
      //this.getBusinessOrderList(data.id)
      this.getCompanyList();
      this.getSubscribeOrderList();
      this.getOrderList(data.id, 1);
      this.getLongRentalOrderList();
      this.getRentalOrderList(data.id, 1);
    });
  },

  onReachBottom() {
    // if(this.current == 1) {
    //   if(this.page >= this.totalPages) {
    //       this.status = 'nomore';
    //       return;
    //   }
    //   this.status = 'loading';
    //   this.page = ++ this.page;
    //   setTimeout(() => {
    //       this.getOrderList(this.userId, this.page)
    //       if(this.page >= this.totalPages) {
    //           this.status = 'nomore';
    //       }
    //   }, 2000)
    // } else if(this.current == 0) {
    //   if(this.subPage >= this.subTotalPages) {
    //       this.subStatus = 'nomore';
    //       return;
    //   }
    //   this.subStatus = 'loading';
    //   this.subPage = ++ this.subPage;
    //   setTimeout(() => {
    //       this.getSubscribeOrderList(this.userId, this.subPage)
    //       if(this.subPage >= this.subTotalPages) {
    //           this.subStatus = 'nomore';
    //       }
    //   }, 2000)
    // }
  },

  methods: {
    change(index) {
      this.current = index;
    },
    handleNewCarDetail(item) {
      let orderType = "subscribe";
      uni.setStorageSync(
        "orderDetail",
        `pagesOrder/order-detail/order-detail?orderId=${item.id}`
      );
      this.$u.route(`/pagesOrder/order-detail/order-detail?orderId=${item.id}`);
    },

    handleCustomerDetail(item) {
      let orderType = "rent";
      uni.navigateTo({
        url: `/pagesOrder/customer/order/detail?orderId=${item.userCarFinanceLeaseSubscribe.id}`,
      });
    },
    handleDetail(item) {
      let orderType = this.current === 3 ? "subscribe" : "rent";
      if (this.current == 3) {
        uni.setStorageSync(
          "orderDetail",
          `pagesOrder/order-detail/order-detail?orderId=${item.id}`
        );
        this.$u.route(
          `/pagesOrder/order-detail/order-detail?orderId=${item.id}`
        );
      } else if (this.current == 4) {
        uni.navigateTo({
          url: `/pagesOrder/customer/order/detail?orderId=${item.userCarFinanceLeaseSubscribe.id}`,
        });
      } else if (this.current == 5) {
        uni.navigateTo({
          url: `/pagesOrder/rental/order/detail?orderId=${item.userCarRentalSubscribeId}`,
        });
      }
    },

    handleRentalDetail(item) {
      uni.navigateTo({
        url: `/pagesOrder/rental/order/rentalOrderDetail?from=list&id=${item.id}&userId=${this.userId}`,
      });
    },
	
	handleLongRentalOrderDetail(item) {
		uni.navigateTo({
		  url: `/pagesOrder/rental/order/detail?orderId=${item.userCarRentalSubscribeId}`,
		});
	},

    handleBusinessOrderDetail(item) {
      uni.navigateTo({
        url: `/pagesOrder/rental/order/businessOrderDetail?id=${item.id}&userId=${this.userId}`,
      });
    },

    async getBusinessOrderList(userId) {
      const res = await this.$getRequest(
        this.$url.getMemberBusinessActivityOrderList,
        "POST",
        {
          ordertype: 1,
          userId,
          page: 1,
          limit: 1000,
        }
      );
      this.businessOrderList = res.data.records;
    },

    async getLongRentalOrderList() {
      const res = await this.$getRequest(
        this.$url.getCarRentalOrderList,
        "GET",
        {
          userId: this.userId,
          page: 1,
          limit: 1000,
        }
      );
      this.longRentalOrderList = res.data;
    },
	
	removeLongRentalOrderOrder(item) {
		uni.showModal({
		  title: "提示",
		  content: `确定要删除这个订单吗？`,
		  success: (res) => {
		    if (res.confirm) {
		      uni.showLoading({
		        title: "加载中",
		      });
		
		      this.$getRequest(this.$url.deleteLongRentalOrderOrder, "GET", {
		        id: item.userCarRentalSubscribeId,
		      })
		        .then((res) => {
		          uni.hideLoading();
		          if (res.code == 0) {
		            uni.showToast({
		              title: "删除成功",
		              duration: 2000,
		              icon: "none",
		            });
		            this.getLongRentalOrderList();
		          } else {
		            uni.showToast({
		              title: res.msg,
		              duration: 2000,
		              icon: "none",
		            });
		          }
		        })
		        .catch(() => {
		          uni.hideLoading();
		        });
		    }
		  },
		});
	},
	
	removeNewCarOrder(item) {
		uni.showModal({
		  title: "提示",
		  content: `确定要删除这个订单吗？`,
		  success: (res) => {
		    if (res.confirm) {
		      uni.showLoading({
		        title: "加载中",
		      });
		
		      this.$getRequest(this.$url.deleteNewCarOrder, "GET", {
		        id: item.id,
		      })
		        .then((res) => {
		          uni.hideLoading();
		          if (res.code == 0) {
		            uni.showToast({
		              title: "删除成功",
		              duration: 2000,
		              icon: "none",
		            });
		            this.getSubscribeOrderList();
		          } else {
		            uni.showToast({
		              title: res.msg,
		              duration: 2000,
		              icon: "none",
		            });
		          }
		        })
		        .catch(() => {
		          uni.hideLoading();
		        });
		    }
		  },
		});
	},

    removeRentalOrder(item) {
      uni.showModal({
        title: "提示",
        content: `确定要删除这个订单吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: "加载中",
            });

            this.$getRequest(this.$url.deleteMemberUserRentalOrder, "GET", {
              id: item.id,
            })
              .then((res) => {
                uni.hideLoading();
                if (res.code == 0) {
                  uni.showToast({
                    title: "删除成功",
                    duration: 2000,
                    icon: "none",
                  });
                  this.getOrderList();
                  this.getCompanyOrderList();
                } else {
                  uni.showToast({
                    title: res.msg,
                    duration: 2000,
                    icon: "none",
                  });
                }
              })
              .catch(() => {
                uni.hideLoading();
              });
          }
        },
      });
    },

    async getCompanyBusinessOrderList() {
      const res = await this.$getRequest(
        this.$url.getMemberBusinessActivityOrderList,
        "POST",
        {
          ordertype: 2,
          companyId: this.currentCompanyId,
          page: 1,
          limit: 1000,
        }
      );
      this.companyBusinessOrderList = res.data.records;
    },

    async getRentalOrderList(userId, page) {
      const res = await this.$getRequest(
        this.$url.getCustomerRentalOrderList,
        "GET",
        {
          userId,
        }
      );
      this.rentalList = res.data;
      this.status = "nomore";
    },

    async getOrderList() {
      const res = await this.$getRequest(
        this.$url.getMemberUserRentalOrderList,
        "POST",
        {
          ordertype: 1,
          userId: this.userId,
          page: 1,
          limit: 1000,
        }
      );
      this.list = res.data.records;
      // this.totalPages = res.data.pages
      // this.page = res.data.current
      // this.status = 'nomore'
    },

    async getCompanyOrderList() {
      const res = await this.$getRequest(
        this.$url.getMemberUserRentalOrderList,
        "POST",
        {
          ordertype: 2,
          companyId: this.currentCompanyId,
          page: 1,
          limit: 1000,
        }
      );
      this.companyOrderList = res.data.records;
    },

    getCompanyList() {
      uni.showLoading({
        title: "加载中",
      });
      this.$getRequest(this.$url.getCompanyList, "GET", {
        userId: this.userId,
        page: 1,
        limit: 100,
      })
        .then((res) => {
          uni.hideLoading();
          this.companyList = res.data.map((item) => {
            return {
              label: item.userCompanyEntity.companyName,
              value: item.companyId,
            };
          });

          this.currentCompanyId = this.companyList[0].value;
          this.currentCompanyLabel = this.companyList[0].label;
          this.getCompanyOrderList();
          this.getCompanyBusinessOrderList();
        })
        .catch(() => {
          uni.hideLoading();
        });
    },

    changeCompany(e) {
      this.currentCompanyId = e;

      const findItem = this.companyList.find((item) => item.companyId == e);
      if (findItem) {
        this.currentCompanyLabel = findItem.label;
      }

      this.getCompanyOrderList();
    },

    async getSubscribeOrderList() {
      const res = await this.$getRequest(
        this.$url.getSubscribeOrderList,
        "POST",
        {
          page:1,
          userId:this.userId,
          limit: 1000,
        }
      );
      this.subList = res.data.records;
      this.subTotalPages = res.data.pages;
      this.subPage = res.data.current;
      this.subStatus = "nomore";
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .u-tab-item {
  padding: 0 8rpx !important;
}
.order-list {
  padding: 0 32rpx;
  padding-bottom: 40rpx;
  .item {
    background: #ffffff;
    box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
      0px 8px 24px rgba(10, 15, 45, 0.04);
    border-radius: 24rpx;
    margin-top: 24rpx;
    padding: 36rpx 30rpx;
    position: relative;
	
    .brand {
      margin-left: 20rpx;
      .name {
        font-size: 34rpx;
        color: #0a0f2d;
        font-weight: 500;
      }
      .rest-day {
        font-weight: 500;
        font-size: 24rpx;
        line-height: 40rpx;
        padding: 1rpx 8rpx;
        background: rgba(10, 15, 45, 0.04);
        border-radius: 8rpx;
        margin-left: 8rpx;
        text-align: center;
      }
      .model {
        font-size: 24rpx;
        font-weight: 500;
        line-height: 40rpx;
        color: rgba(10, 15, 45, 0.8);
      }
    }
    .order-list-info {
      font-size: 24rpx;
      line-height: 40rpx;
      border-left: 4rpx rgba(10, 15, 45, 0.04) solid;
      padding-left: 16rpx;
      margin-top: 40rpx;
      color: #64696f;
      .take-off {
        margin-bottom: 24rpx;
      }
    }
    .status {
      position: absolute;
      right: 32rpx;
      top: 32rpx;
      z-index: 1;
      border: 1px solid #5f19f5;
      border-radius: 16rpx;
      padding: 8rpx 16rpx;
      text-align: center;
      color: #5f19f5;
      .status-text {
        font-weight: 500;
        font-size: 30rpx;
        line-height: 44rpx;
      }
      .rest-time {
        font-size: 24rpx;
        line-height: 28rpx;
      }
    }
    .subStatus {
      position: absolute;
      right: 32rpx;
      bottom: 120rpx;
      z-index: 1;
      border: 1px solid #5f19f5;
      border-radius: 16rpx;
      padding: 8rpx 16rpx;
      text-align: center;
      color: #5f19f5;
      .status-text {
        font-weight: 500;
        font-size: 30rpx;
        line-height: 44rpx;
      }
      .rest-time {
        font-size: 24rpx;
        line-height: 28rpx;
      }
    }
  }
}
.list-wrap {
  padding-bottom: 40rpx;
}

.rental-item {
  margin-top: 24rpx;
  position: relative;
  
  .card-header {
    margin-bottom: 32rpx;
    display: flex;
    justify-content: space-between;
    .car-info-wrap {
      width: 0;
      flex: 1;
      display: flex;
      align-items: center;
      .img {
        width: 90rpx;
        height: 90rpx;
      }
      .car-info {
        padding: 0 24rpx;
        .brand {
          display: flex;
          .brand-text {
            font-size: 30rpx;
            line-height: 44rpx;
            color: rgba(10, 15, 45, 0.8);
            font-weight: 500;
          }
          .tag {
            margin-left: 8rpx;
            height: 44rpx;
            line-height: 44rpx;
            border-radius: 8rpx;
            padding: 0px 4px;
            background: rgba(10, 15, 45, 0.04);
            font-size: 24rpx;
            color: #0a0f2d;
          }
        }
        .product {
          font-size: 24rpx;
          line-height: 40rpx;
          letter-spacing: 0px;
          color: rgba(10, 15, 45, 0.8);
        }
      }
    }
    .status-wrap {
      padding: 0 16rpx;
      height: 88rpx;
      border-radius: 16rpx;
      border: 2rpx solid #5f19f5;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30rpx;
      color: #5f19f5;
      font-weight: 500;
    }
    .red-status {
      border-color: #ea0000;
      color: #ea0000;
    }
  }
  .card-item {
    margin-top: 16rpx;
    line-height: 44rpx;
    font-size: 24rpx;
    color: #64696f;
    display: flex;
    .card-item-content {
      width: 0;
      flex: 1;
    }
    &:first-child {
      margin-top: 0;
    }
  }
}
.del-btn {
    position: absolute;
    right: 32rpx;
    bottom: 26rpx;
    z-index: 100;
    padding: 0 16rpx;
    height: 56rpx;
    border-radius: 8rpx;
    border: 1rpx solid #f51a4e;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    color: #f51a4e;
    font-weight: 500;
  }
.company-dropdown {
  margin-top: 24rpx;
}
</style>
