<template>
	<view>
		<view class="container" :style="{height:editorHeight+'px'}">
			<editor id="editor" class="ql-container" :placeholder="placeholder" @statuschange="onStatusChange" :show-img-resize='true'
				@ready="onEditorReady" @input='textChange'>
			</editor>
		</view>

		<view class="toolbar" @touchend.stop="format" :hidden="keyboardHeight > 0 ? false : true"
			:style="{bottom: isIOS ? keyboardHeight : '0px'}">
			<i class="iconfont icon-charutupian" @touchend.stop="insertImage"></i>
			<i class="iconfont icon-format-header-2 " :class="formats.header === 2 ? 'text-blue' : ''"
				data-name="header" :data-value="2"></i>
			<i class="iconfont icon-format-header-3 " :class="formats.header === 3 ? 'text-blue' : ''"
				data-name="header" :data-value="3"></i>
			<i class="iconfont icon-zitijiacu" :class="formats.bold ? 'text-blue' : ''" data-name="bold"></i>
			<i class="iconfont icon-zitixieti " :class="formats.italic ? 'text-blue' : ''" data-name="italic"></i>
			<i class="iconfont icon-zitixiahuaxian" :class="formats.underline ? 'text-blue' : ''"
				data-name="underline"></i>
			<i class="iconfont icon--checklist" data-name="list" data-value="check"></i>
			<i class="iconfont icon-youxupailie" :class="formats.list === 'ordered' ? 'text-blue' : ''" data-name="list"
				data-value="ordered"></i>
			<i class="iconfont icon-wuxupailie " :class="formats.list === 'bullet' ? 'text-blue' : ''" data-name="list"
				data-value="bullet"></i>
		</view>
	</view>
</template>

<script>
	export default {
		name: "RichTextEditor",
		props:{
			value:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				formats: {},
				readOnly: false,
				placeholder: '开始输入...',
				editorHeight: 0,
				keyboardHeight: 0,
				isIOS: false,
				richText:''
			};
		},
		mounted() {
			const platform = uni.getSystemInfoSync().platform
			this.isIOS = platform === 'ios'
			this.updatePosition(0)
			let keyboardHeight = 0
			uni.onKeyboardHeightChange(res => {
				if (res.height === keyboardHeight) return
				const duration = res.height > 0 ? res.duration * 1000 : 0
				keyboardHeight = res.height
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 0,
						success: () => {
							this.updatePosition(keyboardHeight)
							this.editorCtx.scrollIntoView()
						}
					})
				}, duration)

			})
		},
		methods: {
			readOnlyChange() {
				// 切换为只读状态
				this.readOnly = !this.data.readOnly
			},
			updatePosition(keyboardHeight) {
				// 键盘弹出修改位置
				const toolbarHeight = 50
				const {
					windowHeight,
					platform
				} = uni.getSystemInfoSync()
				this.editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
				this.keyboardHeight = keyboardHeight
			},
			onEditorReady() {
				// 富文本节点渲染完成
				const query = uni.createSelectorQuery().in(this)
				query.select('#editor').context((res) => {
					this.editorCtx = res.context
					if(this.value){
						this.editorCtx.setContents({
							html:this.value
						})
					}
				}).exec(this)
			},
			textChange(e){
				// 输入文本
				this.richText = e.detail.html
				this.$emit('input',e.detail.html)
			},
			format(e) {
				// 格式化编辑器
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				// console.log('format', name, value)
				this.editorCtx.format(name, value)

			},
			onStatusChange(e) {
				this.formats = e.detail
			},
			insertImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.editorCtx.insertImage({
							src: res.tempFilePaths[0],
							data: {
								id: 'abcd',
								role: 'god'
							},
							width: '80%',
							success: function() {
								console.log('insert image success')
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "./lib/weui.css";
	@import "./lib/iconfont.css";

	.container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.ql-container {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		font-size: 16px;
		line-height: 1.5;
		overflow: auto;
		padding: 10px 10px 20px 10px;
		border: 1px solid #ECECEC;
	}

	.iconfont {
		display: inline-block;
		width: 30px;
		height: 30px;
		cursor: pointer;
		font-size: 20px;
	}

	.toolbar {
		box-sizing: border-box;
		padding: 0 10px;
		height: 50px;
		width: 100%;
		position: fixed;
		left: 0;
		right: 100%;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid #ECECEC;
		border-left: none;
		border-right: none;
	}
</style>
