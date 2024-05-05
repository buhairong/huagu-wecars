<!--
 * @Author: your name
 * @Date: 2021-11-12 23:29:22
 * @LastEditTime: 2022-01-09 21:34:58
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-wc/src/pages/index/search/index.vue
-->

<template>
    <view class="content">
        <view class="slip">
            <view
                v-if="checkList && checkList.length"
                class="scroll-box"
            >
                <scroll-view
                    class="tag-box"
                    scroll-x
                >
                    <template v-for="(item, index) in leftList">
                        <template v-for="(items, i) in item.foods">
                            <u-tag
                                v-if="items.check"
                                :key="i"
                                :text="items.tagName"
                                class="item u-font-24"
                                mode="dark"
                                bg-color="#fff"
                                color="#0A0F2D"
                                closeable
                                @close="tagClick(items, index)"
                            />
                        </template>
                    </template>
                </scroll-view>
                <view
                    v-if="isEmpty"
                    class="reset"
                    @click="handleReset"
                >
                    重置
                </view>
            </view>
            <view class="u-menu-wrap">
                <scroll-view
                    scroll-y
                    scroll-with-animation
                    class="u-tab-view menu-scroll-view"
                    :scroll-top="scrollTop"
                >
                    <template v-for="(item, index) in leftList">
                        <view
                            :key="index"
                            class="u-tab-item"
                            :class="[current == index ? 'u-tab-item-active' : '']"
                            :data-current="index"
                            @tap.stop="swichMenu(index)"
                        >
                            <text class="u-line-1">
                                {{ item.name }}
                            </text>
                        </view>
                    </template>
                </scroll-view>
                <view class="right">
                    <!-- <block > -->
                    <scroll-view
                        scroll-y
                        :scroll-with-animation="true"
                        class="right-box"
                        :scroll-into-view="target"
                        @scroll="scroll"
                    >
                        <view
                            v-for="(item, index) in leftList"
                            :key="index"
                            class="page-view"
                        >
                            <view
                                :id="'item-' + index"
                                class="class-item"
                            >
                                <template v-if="item.k == 'brandList'">
                                    <view
                                        v-for="(items, idx) in item.foods"
                                        :key="idx"
                                    >
                                        <view
                                            v-if="items.letters"
                                            class="brand-list-letter"
                                        >
                                            {{ items.letters }}
                                        </view>
                                        <view
                                            class="brand-list-name"
                                            :class="{'brand-active' : items.check }"
                                            @click="handleItemFoods(items, index, idx, item)"
                                        >
																						<view class="brand-name-wrap">
																							<view class="logo">
																								<image
																									style="width: 100%;height:100%;"
																									:src="items.logoUrl"
																								/>
																							</view>
																							<view class="brand-name">{{ items.brandName }}</view>
																						</view>
                                        </view>
                                    </view>
                                </template>
                                <template v-else>
                                    <view class="item-title">
                                        <text>{{ item.name }}</text>
                                    </view>
                                    <view class="item-container">
                                        <u-row gutter="16">
                                            <!-- :class="item.k == 'brandList' ? 'search-brand-list' : ''" -->
                                            <u-col
                                                v-for="(items, i) in item.foods"
                                                :key="i"
                                                
                                                :span="item.k == 'brandList' ? 24 : 4"
                                            >
                                                <!-- <view
                                                    v-if="item.k == 'brandList'"
                                                    class="letters"
                                                >
                                                    {{ items.letters }}
                                                </view> -->
                                                <view
                                                    class="thumb-box"
                                                    :class="items.check ? 'active-box' : ''"
                                                    @click="handleItemFoods(items, index, i, item)"
                                                >
                                                    {{ items.tagName }}
                                                </view>
                                            </u-col>
                                        </u-row>
                                    </view>
                                </template>
                            </view>
                        </view>
                    </scroll-view>
                    <!-- </block> -->
                </view>
            </view>
        </view>
        <view
            class="foot-but u-flex u-row-between"
            @click="handleModel"
        >
            <!-- :class="carList.length == 0 ? 'foot-but-disabled' : ''" -->
            <view
                class="foot-but-r u-flex-1 u-text-center"
            >
							查询
               <!-- 查看<text class="color-base">
                    {{ ` ${carList.length} ` }}
                </text>款车型 -->
                <text class="icon-r" />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
          cityId: '',
            target: "",
            leftList: [
                { name: "品牌", id: 0, foods: [], k: 'brandList', param: 'brandList' },
                { name: "车型", id: 0, foods: [], k: 'mold', param: 'mold' },
                { name: "价格", id: 0, foods: [], k: 'guidancePrice', param: 'guidancePriceRange'  },
                { name: "能源", id: 0, foods: [], k: 'powerMode', param: 'powerMode' },
                { name: "驱动", id: 0, foods: [], k: 'drive', param: 'drive' },
                { name: "排量", id: 0, foods: [], k: 'dischargeRange', param: 'dischargeRange' },
                { name: "马力", id: 0, foods: [], k: 'horsepower', param: 'horsepowerRange' },
                { name: "结构", id: 0, foods: [], k: 'structure', param: 'structure' },
            ],
            foods: {},
            scrollTop: 100, //tab标题的滚动条位置
            current: 0, // 预设当前项的值
            menuHeight: 0, // 左边菜单的高度
            menuItemHeight: 0, // 左边菜单item的高度
            height: [],
            checkList: [],
            carList: [],
            brandRow: {},
            search: {
                dischargeRange: '',
                drive: '',
                guidancePriceRange: '',
                horsepowerRange: '',
                limit: 9999,
                mold: '',
                powerMode: '',
                page: 1,
                structure: '',
                carBrandId: '',
                cityId: ''
            },
            carBrandId: '',
            mold: '',
            guidancePriceRange: '',
            isEmpty: null

        };
    },
    onLoad(options) {
      // options.cityId
        this.search.carBrandId = options.carBrandId || ''
				this.search.powerMode = options.powerMode || ''

        if(options && options.mold) {
            this.mold = 'mold'
            this.search.mold = options.mold || ''
        }
        if(options && options.guidancePriceRange) {
            this.guidancePriceRange = 'guidancePriceRange'
            this.search.guidancePriceRange = options.guidancePriceRange || ''
        }
        this.search.guidancePriceRange = options.guidancePriceRange || ''
        
        this.search.cityId =options.cityId|| uni.getStorageSync('cityId')

        this.init();
    },
    watch: {
        'carList': function(val) {
            console.log(val);
        },
    },
    methods: {
        handleBrandRow(row) {
            console.log(row);
            this.brandRow = row;
            if(this.checkList && this.checkList.length) {
                this.checkList.map(() => {
                    
                })
            }
        },
        async getList() {
            // const result =  await this.$getRequest(this.$url.searchCarTypeYearProduct, 'POST', this.search)
            // this.carList = result.data.records
            // console.log(this.carList)
        },
        someIsEmpty() {
            this.isEmpty = false;
            this.leftList.map((item) => {
                item.foods.map((items) => {
                    if(items.check ) {
                        this.isEmpty = true
                    }
                })
            })
        },
        tagClick(row, index) {
            console.log(row);
            this.leftList.map((item) => {
                item.foods.map((items) => {
                    if(items.tagName == row.tagName) {
                        items.check = false
                    }
                })
            })
            this.someIsEmpty();
            // this.checkList.splice(index, 1)
            this.search[row.type]  = '';
            this.getList();
            
        },
        handleReset() {
            uni.vibrateShort({})
            // this.checkList = [];
            this.leftList.map((item) => {
                item.foods.map((items) => {
                    items.check = false
                })
            })

            for(let i in this.search) {
                if(i == 'limit' || i == 'page' || i == 'cityId') {
                    // 1
                }  else {
                    this.search[i] = '';
                }
            }

            
            this.someIsEmpty();

            this.getList();
        },
        handleItemFoods(items, index, i, item) {
           
            uni.vibrateShort({})
            
                
           
            item.foods.map((row) => {
                if(!item.foods[i].check) {
                    row.check = false
                }
                return row
            })
            
           

            item.foods[i].check = item.foods[i].check ? false: true

            if(item.foods[i].check) {
                this.checkList.push(items)
                this.search[items.type] = items.tagValue
            } else {
                this.search[items.type] = ''
             
            }
            this.getList()
            this.someIsEmpty()
						
						if(item.k == 'brandList') {
							this.handleModel()
						}
        },
        checkFun() {
            this.checkList = [];
            // for(let i = 0; i < this.leftList.length; i++) {
            //     for(let j = 0 ; j < this.leftList[i].length; j++) {
            //         console.log(this.leftList[i][j].check)
            //         if(this.leftList[i][j].check) {
            //             this.checkList.push(this.leftList[i][j])
            //         }
            //     }
            // }
            // this.leftList.map((item) => {
            //     item.foods.map((items) => {
            //         if(items.check) {
            //             this.checkList.push(items)
            //         }
            //     })
            // })
            console.log(this.checkList)
        },
        handleModel() {
            // this.checkList
						console.log(this.leftList,'this.leftList----');
            // if(this.carList && this.carList.length == 0) {
            //     uni.showToast({
            //         title: '请重新搜索车型',
            //         duration: 2000,
            //         icon: 'none'
            //     });
            //     return false;
            // }

            
            this.checkList = [];
            this.leftList.map((item) => {
                item.foods.map((items) => {
                    if(items.check) {
                        this.checkList.push(items)
                    }
                })
            })
						if(this.checkList.length==0){
							uni.showToast({
								title: '至少选择一种条件',
								duration: 2000,
								icon: 'none'
							});
							return
						}
						console.log('this.checkList123', this.checkList)
						const id = this.checkList[0].id
            uni.setStorageSync('searchData', this.checkList);
						let url = `/pages/home/search/list?cityId=${this.search.cityId}`
						if (id) {
							url += `&id=${id}`
						}
            this.$u.route(url)
        },
        async init() {
            this.getList();
            const data = await this.$getRequest(
                this.$url.getCarTypeCondition,
                "POST",
                {}
            );

            const result = data.data ;
            let brandObj = [];
            let letter = [];
            for( let i in result ) {
                this.leftList.map((item) => {
                    if(i == item.k) {
                        item.foods = result[i].map((items) => {
                            items.check = false
                            items.type = item.param
                            
                            if(Array.isArray(items)) {
                                items.map((row, index) => {
                                    row.tagName = row.brandName;
                                    row.tagValue = row.id;

                                    if(letter.indexOf(row.letter) == -1) {
                                        row.letters = row.letter;
                                    } else {
                                        row.letters = '';
                                    }
                                    letter.push(row.letter)
                                    row.check = false
																		
                                    row.type = 'carBrandId';
                                    if(item.k == 'brandList') {
                                        brandObj.push(row)
                                    }
                                    if(this.search.carBrandId == row.id) {
                                        row.check = true;
                                        this.checkList.push(row)
                                    }
                                    return row
                                })
                            }
                            if(item.param == this.mold && this.search.mold == items.tagValue) {
                                items.check = true;
                                this.checkList.push(items)
                            }
                            if(item.param == this.guidancePriceRange && this.search.guidancePriceRange == items.tagValue) {
                                items.check = true;
                                this.checkList.push(items)
                            }
														if(item.param == 'powerMode' && this.search.powerMode == items.tagValue) {
														    items.check = true;
														    this.checkList.push(items)
														}
                            return items
                        })
                        if(item.k == 'brandList') {
                            item.foods = brandObj;
                        }
                    }
                    
                })
            }
            this.someIsEmpty();
            const query = uni.createSelectorQuery()
            const self = this
            let arr = []
            let s = 0
            this.$nextTick(() => {
                query.selectAll('.page-view').boundingClientRect(function (rect) {
                    rect.forEach((res) => {
                        s += res.height
                        arr.push(s)
                    })
                    self.height = arr
                }).exec()

            })
        },
        // 点击左边的栏目切换
        async swichMenu(index) {
            uni.vibrateShort({})
            this.target = `item-${index}`;
            console.log(this.target);
            if (index == this.current) return;
            this.current = index;
            // 如果为0，意味着尚未初始化
            if (this.menuHeight == 0 || this.menuItemHeight == 0) {
                await this.getElRect("menu-scroll-view", "menuHeight");
                await this.getElRect("u-tab-item", "menuItemHeight");
            }
            // 将菜单菜单活动item垂直居中
            this.scrollTop =
                index * this.menuItemHeight +
                this.menuItemHeight / 2 -
                this.menuHeight / 2;
        },
        scroll(event) {
            let scrollTop = event.detail.scrollTop
            for (let i = 0; i < this.height.length; i++) {
                if (scrollTop >= 0 && scrollTop < this.height[0]) {
                    this.navActive = 0
                } else if (scrollTop >= this.height[i]) {
                    this.current = i + 1
                }
            }

        },
        // 获取一个目标元素的高度
        getElRect(elClass, dataVal) {
            new Promise((resolve, reject) => {
                const query = uni.createSelectorQuery().in(this);
                query
                    .select("." + elClass)
                    .fields({ size: true }, (res) => {
                        // 如果节点尚未生成，res值为null，循环调用执行
                        if (!res) {
                            setTimeout(() => {
                                this.getElRect(elClass);
                            }, 10);
                            return;
                        }
                        this[dataVal] = res.height;
                    })
                    .exec();
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.content {
    padding: 0;
    .foot-but-disabled {
        background: #0a0f2db5;
    }
    .slip {
        padding-bottom: 150rpx;
    }
    .scroll-box {
        position: relative;
        padding: 24rpx 32rpx;
        padding-right: 100rpx;
        background: rgba(43, 46, 66, 0.04);

        .tag-box {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            
            .item {
                margin: 0 6rpx;
                font-size: 24rpx;
            }
        }
        .reset {
            position: absolute;
            right: 20rpx;
            top: 30rpx;
            z-index: 2;
            font-size: 24rpx;
            color: rgba(10, 15, 45, 0.8);
        }
    }

    .u-wrap {
        height: calc(100vh);
        /* #ifdef H5 */
        height: calc(100vh - var(--window-top));
        /* #endif */
        display: flex;
        flex-direction: column;
    }
    .page-view {
        .thumb-box {
            background: rgba(10, 15, 45, 0.04);
            font-size: 24rpx;
            text-align: center;
            color: rgba(10, 15, 45, 0.8);
            padding: 16rpx 0;
            margin: 10rpx 0;
            border-radius: 8rpx;
            border: 2px solid rgba(10, 15, 45, 0);
            font-weight: 400;
        }
        .active-box {
            font-weight: 500;
            color: #0A0F2D;
            border-radius: 8rpx;
            background: rgba(10, 235, 125, 0.6);
        }
    }

    .u-search-box {
        padding: 18rpx 30rpx;
    }

    .u-menu-wrap {
        position: relative;
        flex: 1;
        display: flex;
        overflow: hidden;
        height: 100vh;
        .right {
            width: 100%;
            .right-box {
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                height: 100%;
                position: absolute;
                left: 160rpx;
                top: 0;
                .page-view {
                    &:last-child {
                        padding-bottom: 700rpx;
                    }
                }
            }
        }
    }

    .u-search-inner {
        background-color: rgb(234, 234, 234);
        border-radius: 100rpx;
        display: flex;
        align-items: center;
        padding: 10rpx 16rpx;
    }

    .u-search-text {
        font-size: 26rpx;
        color: $u-tips-color;
        margin-left: 10rpx;
    }

    .u-tab-view {
        width: 200rpx;
        height: 100%;
        background: #f6f6f6;
    }

    .u-tab-item {
        height: 110rpx;
        background: #f6f6f6;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        color: #64696f;
        font-weight: 500;
        line-height: 1;
    }

    .u-tab-item-active {
        position: relative;
        color: #0a0f2d;
        font-size: 34rpx;
        font-weight: 500;
        background: #fff;
    }

    .u-tab-item-active::before {
        content: "";
        position: absolute;
        border-left: 4px solid $uni-color-success;
        height: 100%;
        left: 0;
        top: 0;
        border-radius: 0 10rpx 10rpx 0;
    }

    .u-tab-view {
        height: 100%;
    }
    .item-container {
        padding-right: 160rpx;
    }

    .class-item {
        margin-bottom: 30rpx;
        background-color: #fff;
        padding: 16rpx;
        border-radius: 8rpx;
    }
    .brand-list {
        width: 100%;
    }
    .brand-list-letter {
        font-size: 24rpx;
        color: rgba(10, 15, 45, 0.5);
        margin-top: 22rpx;
        margin-left: 35rpx;
        font-weight: 400;
        color: rgba(10, 15, 45, 0.5);;
        
    }
    .brand-list-name {
				display: flex;
        margin-left: 10rpx;
				align-items: center;
				margin-bottom: 14px;
				.brand-name-wrap {
					padding: 0 26rpx;
					display: flex;
					align-items: center;
				}
				.logo {
					width: 60rpx;
					height: 60rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-right: 18rpx;
				}
        .brand-name {
						color: rgba(10, 15, 45, 0.8);
						height: 36px;
						line-height: 36px;
            font-size: 15px;
        }
    }
    .brand-active {
			.brand-name-wrap {
				font-weight: 500;
				color: #0A0F2D;
				border-radius: 8rpx;
				background: rgba(10, 235, 125, 0.6);
			}
    }

    .item-title {
        font-size: 30rpx;
        color: $u-main-color;
        font-weight: bold;
        margin-bottom: 24rpx;
    }
    .foot-but {
        position: fixed;
        bottom: 50rpx;
        width: 88%;
        z-index: 111;
        left: 0;
        right: 0;
        margin: 0 auto;
    }
}

</style>
