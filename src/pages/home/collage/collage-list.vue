<template>
    <view class="collage-list">
        <view 
            v-for="activityItem in activityList"
            :key="activityItem.id"
            class="collage-list-item"
        >
            <collage-item :collage-detail-data="activityItem" />
        </view>
    </view>
</template>

<script>
import collageItem from "./collage-item.vue";

export default {
    name: "CollageList",
    components: {
        collageItem
    },
    props: {},
    data () {
        return {
          cityId: '',
            activityList: []
        };
    },
    onLoad (option) {
      this.cityId = option.cityId
        this.init();
    },
    methods: {
        init () {
            this.getActivityList();
        },
        // 团购列表
        async getActivityList() {
            const activityList = await this.$getRequest(
                this.$url.activityList,
                "POST",
                { cityId: this.cityId }
            );
            this.activityList = activityList.data.records;
        }
    }
};
</script>

<style lang="scss">

</style>
<style lang="scss" scoped>
.collage-list {
    &-item {
        padding: 12rpx 24rpx 0rpx;
    }
}
</style>
