export default {
	data() {
		return {
			share: {
				title: '程序名称',
				path: '/pages/xxx',
				imageUrl: '分享显示的图片链接',
				desc: '简介'
			}
		}
	},
	// 分享到微信好友功能
	onShareAppMessage(res:any) {
		return {
			title: this.share.title,
			path: this.share.path,
			desc: this.share.desc,
			imageUrl: this.share.imageUrl,
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		}
	},
	// 分享到朋友圈功能
	onShareTimeline(res:any) {
		return {
			title: this.share.title,
			path: this.share.path,
			desc: this.share.desc,
			imageUrl: this.share.imageUrl,
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		}
	},
}