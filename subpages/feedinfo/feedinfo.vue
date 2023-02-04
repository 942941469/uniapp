<template>
	<view>
		<view v-if="getRequestOK">
			<view class="feed-user">
				<u-avatar size="60" class="avatar" :src="feedInfo.avatar" />
				<view class="info">
					<text>{{ feedInfo.name }}</text>
				</view>
			</view>
			<view class="feed-info">
				<view class="title" v-if="feedInfo.feed_content">{{ feedInfo.feed_content }}</view>
				<image class="feed-imgs" mode="widthFix" v-for="(image, index) in feedInfo.images" :key="index"
					:src="image" @tap="previewImage(index)" />
				<view class="other">
					<text>{{ feedInfo.created_at }} 发布</text>
					<text>{{ feedInfo.feed_view_count }} 阅读 {{ feedInfo.like_count }} 点赞</text>
				</view>
			</view>
			<view class="line" />
			<comment :oneInfo="feedInfo" type="feed" />
		</view>
	</view>
</template>

<script>
	import {
		getFeedInfo
	} from '@/config/api.js'
	import comment from '@/components/comment.vue'
	export default {
		data() {
			return {
				// 动态详情
				feedInfo: {},
				// 数据请求状态
				getRequestOK: false,
			}
		},
		components: {
			comment
		},
		async onLoad(params) {
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			// #endif
			const feeds = await getFeedInfo(params)
			const images = feeds.images.map(item => {
				return 'http://ts.lagou.uieee.com/api/v2/files/' + item.file
			})
			this.feedInfo = {
				...feeds,
				name: feeds.user.name,
				avatar: feeds.user.avatar ? feeds.user.avatar.url : '/static/nopic.png',
				images
			}
			this.getRequestOK = true
		},
		methods: {
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.feedInfo.images
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.feed-user {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		margin: 20upx 0 0 25upx;

		.info {
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			justify-content: flex-end;
			align-items: left;
			margin-left: 20upx;
			font-size: 24upx;
			font-weight: bolder;
			color: #1f2046;
		}
	}

	.feed-info {
		width: 700upx;
		margin-top: 20upx;
		margin-left: 25upx;
		text-align: center;
		padding-bottom: 10upx;

		.title {
			font-size: 32upx;
			margin-bottom: 30upx;
			text-align: left;
			line-height: 52upx;
			color: #666;
		}

		.feed-imgs {
			margin: 5upx 0;
			width: 100%;
		}

		.other {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			align-content: center;
			padding: 40upx 0 20upx;
			font-size: 24upx;
			color: #888;

		}
	}

	.line {
		height: 30upx;
		width: 750upx;
		background-color: #f3f3f3;
	}
</style>
