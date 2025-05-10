<template>
	<view class="commonBox">
		<view class="commonList">
			<u-collapse @change="change" @close="close" @open="open">
				<u-collapse-item v-for="item in textContentList" :title="item.title" name="Docs guide" :key="item.id">
					<text class="u-collapse-content commonText">{{item.content}}</text>
				</u-collapse-item>
			</u-collapse>
		</view>
	</view>
</template>

<script>
	import {CommonProList} from "../../../utils/request/gather.js"
	export default {
		data() {
			return {
				textContentList:[], // 内容列表
			}
		},
		onLoad() {
			this.getTextContentList() // 获取内容列表
		},
		methods: {
			getTextContentList(){ // 获取内容列表
			let that = this
				CommonProList().then(res => {
					that.textContentList = res.data.data
				})
			},
			open(e) {
				// console.log('open', e)
			},
			close(e) {
				// console.log('close', e)
			},
			change(e) {
				// console.log('change', e)
			}
		}
	}
</script>

<style>
	page {
		background: #f8f8fa;
	}
</style>
<style lang="scss" scoped>
	.commonBox {
		width: 100%;
		height: auto;

		.commonList {
			width: 100%;
			height: auto;
			background: #fff;
			
			
		}
	}
</style>
