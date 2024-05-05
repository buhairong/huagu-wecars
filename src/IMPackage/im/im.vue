<template>
	<view>
		<IMComp 
			:userId="userId"
		/>
	</view>
</template>

<script>
import IMComp from '../components/IM/IMComp.vue'

export default {
	components: {
		IMComp,
	},
	
	data() {
		return {
			userId: '',
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
	},
	
	methods: {
		
	}
}
</script>

<style lang="scss" scoped>

</style>
