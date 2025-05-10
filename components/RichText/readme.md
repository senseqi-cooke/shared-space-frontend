## 介绍
uniapp-editor是一个用于uniapp开发的微信小程序使用的富文本编辑器，基于微信小程序官方文档提供的案例改造的
## 使用方式
在需要使用富文本的页面引入组件，通过`v-model`绑定富文本内容即可

```javascript
// example.vue
<template>
	<view>
		<rich-text-editor v-model="richText"></rich-text-editor>
	</view>
</template>

<script>
	import RichTextEditor from "@/components/RichText/RichTextEditor.vue"
	export default {
		components:{
			RichTextEditor
		},
		data() {
			return {
				richText:'这里是初始内容'
			};
		},
		watch:{
			richText(){
				console.log(this.richText)
			}
		}
	}
</script>

<style lang="scss">

</style>

```
