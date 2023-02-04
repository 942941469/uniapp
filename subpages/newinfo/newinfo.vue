<template>
	<view v-if="getRequestOK">
		<uni-nav-bar :fixed="true" :statusBar="true" background-color="#007AFF" :title="newInfo.cutTitle">
			<view slot="left">
				<image class="hicon" src="/static/home.png" mode="" @tap="goHome" />
			</view>
		</uni-nav-bar>
		<helang-blur :params="{width: '750rpx',height: '520rpx',image: newInfo.cover,blur: 'xs'}" />
		<view class="info-content">
			<mp-html :content="newInfo.content" />
		</view>
		<view class="info-header">
			<text>{{ newInfo.created_at }}发布</text>
			<text>{{ newInfo.views_count }}阅读</text>
		</view>
		<view class="line" />
		<comment :oneInfo="newInfo" type="info" />
	</view>
</template>

<script>
	import {
		getNewInfo
	} from "@/config/api.js"
	import helangBlur from "@/components/helang-blur/helang-blur.vue"
	import comment from '@/components/comment.vue'
	export default {
		data() {
			return {
				// 当前资讯信息
				newInfo: {},
				getRequestOK: false,
			}
		},
		components: {
			helangBlur,
			comment
		},
		async onLoad(params) {
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			// #endif
			const news = await getNewInfo(params)
			this.newInfo = {
				...news,
				cutTitle: news.title.length > 11 ? news.title.substring(0, 11) + "..." : news.title,
				cover: 'http://ts.lagou.uieee.com/api/v2/files/' + news.image.id,
				userId: news.user_id,
				views_count: news.hits
			}
			this.getRequestOK = true;
		},
		methods: {
			// 返回首页
			goHome() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hicon {
		height: 36upx;
		width: 36upx;
		padding-left: 30upx;
		padding-top: 10upx;
	}

	.model {
		width: 750upx;
		height: 520upx;
		position: absolute;
		background-color: rgba($color: #364161, $alpha: 0.2);
		z-index: 1;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-end;

		.mtitle {
			margin-top: 20upx;
			width: 700upx;
			margin-left: 25upx;
			font-size: 44upx;
			color: #fff;
			line-height: 64upx;
		}


		.info-user {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;
			align-content: center;
			margin-top: 30upx;
			margin-left: 5upx;
			margin-bottom: 30upx;

			.info {
				display: flex;
				flex-direction: column;
				flex-wrap: wrap;
				justify-content: flex-end;
				align-items: left;
				margin-left: 20upx;
				font-size: 24upx;
				font-weight: bolder;
				color: #fff;
			}
		}
	}


	.info-content {
		width: 680upx;
		text-align: left;
		margin-top: 40upx;
		// #ifdef MP-WEIXIN
		margin-left: 35upx;
		// #endif
		// #ifndef MP-WEIXIN
		margin-left: 0;
		// #endif
	}

	.info-header {
		margin: 10upx 25upx;
		color: #999;
		font-size: 22upx;
		justify-content: space-between;
		display: flex;

	}

	.line {
		height: 30upx;
		width: 750upx;
		background-color: #f3f3f3;
	}
</style>
