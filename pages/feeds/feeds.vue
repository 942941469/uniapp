<template>
	<view class="rfeeds">
		<view class="one-feeds-box" v-for=" (feedsList, i) in showFeedsList " :key="i">
			<view v-for=" (item, k) in feedsList " :key="item.id" class="one-feed"
				:class="k % 6 == 0 ? ( i%2==0 ? 'feed-big-left' :'feed-big-right' ) : '' ">
				<navigator :url="'/subpages/feedinfo/feedinfo?id=' + item.id">
					<image :src="item.cover" class="feed-content" mode="aspectFill" :lazy-load="true" />
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getFeeds
	} from "@/config/api.js"
	export default {
		data() {
			return {
				// 动态列表数据
				feedsList: [],
				showFeedsList: []
			};
		},
		onLoad() {
			this.getFeedsList()
		},
		onPullDownRefresh() {
			this.feedsList = []
			this.showFeedsList = []
			this.getFeedsList()
		},
		onReachBottom() {
			this.getFeedsList()
		},
		methods: {
			// 获取动态数据并处理
			async getFeedsList() {
				const feeds = await getFeeds()
				const feedsList = feeds.feeds.map(item => {
					return {
						id: item.id,
						cover: 'http://ts.lagou.uieee.com/api/v2/files/' + item.images[0].file
					}
				})
				this.feedsList = [...this.feedsList, ...feedsList]
				let showList = []
				this.feedsList.filter((item, index) => {
					let num = index + 1
					if ((num + 1) % 6 === 0) {
						showList.push(this.feedsList.slice(num, num + 6))
					}
				})
				this.showFeedsList = showList
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rfeeds {
		background-color: #FFFFFF;
		padding-bottom: 20upx;

		.one-feeds-box {
			width: 704upx;
			margin: 4upx 22upx 0 22upx;
			// 定义栅格布局
			display: grid;
			// 定义栅格每一列的宽度
			grid-template-columns: 232upx 232upx 232upx;
			// 定义栅格每一行的高度
			grid-template-rows: 232upx 232upx 232upx;
			// grid-row-gap属性设置行与行的间隔（行间距），grid-column-gap属性设置列与列的间隔（列间距）
			grid-row-gap: 4upx;
			grid-column-gap: 4upx;
			background-color: #DADADA;

			.one-feed {
				position: relative;

				.feed-content {
					width: 232upx;
					height: 232upx;
					border: 1px solid #EEEEEE;
					border-radius: 4upx;
				}

				&.feed-big-left {
					grid-column-start: 1;
					grid-column-end: 3;
					grid-row-start: 1;
					grid-row-end: 3;
					background-color: #DADADA;

					.feed-content {
						width: 466upx;
						height: 466upx;
						border: 1px solid #EEEEEE;
					}
				}

				&.feed-big-right {
					grid-column-start: 2;
					grid-column-end: 4;
					grid-row-start: 1;
					grid-row-end: 3;
					background-color: #DADADA;

					.feed-content {
						width: 466upx;
						height: 466upx;
						border: 1px solid #EEEEEE;
					}
				}
			}
		}
	}
</style>
