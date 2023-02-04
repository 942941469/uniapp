import {
	unlikeThisFeed,
	likeThisFeed
} from '@/config/api.js'
let likeMixin = {
	methods: {
		async clickLike(item) {
			if (!this.loginState) {
				this.$refs.login.openLogin()
				return
			}
			// 动态点赞
			if (item.has_like) {
				--item.like_count;
				item.has_like = false;
				await unlikeThisFeed({
					id: item.id,
				});
				uni.showToast({
					title: "取消点赞",
					icon: "success",
					duration: 1000,
				});
			} else {
				++item.like_count;
				item.has_like = true;
				await likeThisFeed({
					id: item.id,
				});
				uni.showToast({
					title: "点赞成功",
					icon: "success",
					duration: 1000,
				});
			}
		}
	}
}
export default likeMixin
