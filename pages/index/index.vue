<template>
	<view>
		<uni-nav-bar status-bar v-if="navBarShowTag" :fixed="true" rightWidth="300px" leftWidth="300px" height="160rpx">
			<block slot="left">
				<view class="one-nav" :class="isShowLeft" @tap="swiperChange(0)">推荐
				</view>
			</block>
			<block slot="right">
				<view class="one-nav" :class="isShowRight" @tap="swiperChange(1)">
					资讯</view>
			</block>
		</uni-nav-bar>
		<view class="header-box">
			<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="item in swiperList" :key="item.id">
					<navigator open-type="navigate" :url="'/pages/webview/webview?url=' + encodeURI(item.data.link)">
						<image :src="item.data.image" mode="aspectFill" />
					</navigator>
				</swiper-item>
			</swiper>
			<image class="crile" src="@/static/crile.png" mode="aspectFill" />
			<view class="card-header">
				<view class="card-one" @tap="gotoTab('/pages/feeds/feeds')">
					<image class="img" src="@/static/coffee.png" mode="aspectFill" />
					<view class="title">精彩动态</view>
				</view>
				<view class="card-one" @tap="gotoTab('/pages/me/me')">
					<image class="img" src="@/static/ran.png" mode="aspectFill" />
					<view class="title">个人中心</view>
				</view>
			</view>
			<view class="tabs-box">
				<view class="one-nav" :class="isShowLeft" @tap="swiperChange(0)">推荐</view>
				<view class="one-nav" :class="isShowRight" @tap="swiperChange(1)">资讯</view>
			</view>
		</view>
		<swiper class="infoSwiper" :style='"height:" + swiperSliderHeight' :current="currentIndex"
			@animationfinish="swiperSlider">
			<swiper-item>
				<view class="feeds-box">
					<view class="feed" v-for="item in feedList" :key="item.id">
						<navigator :url="'/subpages/feedinfo/feedinfo?id=' + item.id">
							<image class="feed-img" :src="item.cover" mode="widthFix" :lazy-load="true" />
							<view class="content" v-if="item.feed_content">{{item.feed_content}}</view>
							<view class="feed-info">
								<view class="iview">
									<image class="avatar" :src="item.avatar" />
									<text class="name">{{item.name}}</text>
								</view>
								<view class="iview" @tap.stop="clickLike(item)">
									<image v-if="item.has_like" src="@/static/lover.png" class="micon" />
									<image v-else src="@/static/love.png" class="micon" />
									<text class="love-count" v-if="item.like_count>0">{{item.like_count}}</text>
								</view>
							</view>
						</navigator>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view v-for="item in newsList" :key="item.id" style="margin: 25upx;">
					<navigator class="news-box" :url="'/subpages/newinfo/newinfo?id=' + item.id">
						<view class="left">
							<view class="title">{{item.title}}</view>
							<view class="info">
								<text class="author">{{item.author}}</text>
								<text class="uptime">{{item.created_at}}发布</text>
							</view>
						</view>
						<view class="right">
							<image class="pic" :src="item.cover" mode="aspectFill"></image>
						</view>
					</navigator>
				</view>
			</swiper-item>
		</swiper>
		<gotoshare />
		<login ref="loginRef" v-if="!loginState" />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import likeMixin from '@/minxins/like.js'
	import {
		getAdvert,
		getFeeds,
		getNews
	} from '@/config/api.js'
	export default {
		mixins: [likeMixin],
		data() {
			return {
				//  轮播图数据
				swiperList: [],
				// 推荐咨询轮播序号
				currentIndex: 0,
				// 动态列表
				feedList: [],
				// 资讯列表
				newsList: [],
				// 瀑布流高度
				swiperSliderHeight: '2000px',
				// navbar是否显示
				navBarShowTag: false,
				// 记录滚动所在的位置
				oldFeedsScollTop: 0,
				oldNewsScollTop: 0
			}
		},
		computed: {
			// 是否显示左右边高亮
			isShowLeft() {
				return this.currentIndex === 0 ? 'nav-actived' : ''
			},
			isShowRight() {
				return this.currentIndex === 1 ? 'nav-actived' : ''
			},
			...mapState(['loginState'])
		},
		onLoad() {
			this.getAds()
			this.getFeedsList()
			this.getNewsList()
			uni.$on('indexUserLogin', () => {
				this.currentIndex = 0
				this.feedList = []
				this.getFeedsList()
			})
			uni.$on('indexUserLogout', () => {
				this.currentIndex = 0
				this.feedList = []
				this.getFeedsList()
			})
		},
		// 滚动判断顶部navbar显示
		onPageScroll(event) {
			if (this.currentIndex === 0) {
				this.oldFeedsScollTop = event.scrollTop
			} else {
				this.oldNewsScollTop = event.scrollTop
			}
			if (event.scrollTop > 220) {
				this.navBarShowTag = true
			} else {
				this.navBarShowTag = false
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getAds()
			if (this.currentIndex === 0) {
				this.feedList = []
				this.getFeedsList()
			} else {
				this.newsList = []
				this.getNewsList()
			}
		},
		// 到达底部获取新数据
		onReachBottom() {
			if (this.currentIndex === 0) {
				this.getFeedsList()
			} else {
				this.getNewsList()
			}
		},
		methods: {
			// 底部切换
			gotoTab(url) {
				uni.switchTab({
					url
				})
			},
			// 推荐资讯点击切换
			swiperChange(index) {
				this.currentIndex = index
				if (index === 0) {
					uni.pageScrollTo({
						duration: 0,
						scrollTop: this.oldFeedsScollTop
					})
				} else {
					uni.pageScrollTo({
						duration: 0,
						scrollTop: this.oldNewsScollTop
					})
				}
			},
			// 推荐资讯滑动切换
			swiperSlider(event) {
				this.currentIndex = event.detail.current
				if (event.detail.current === 0) {
					uni.pageScrollTo({
						duration: 0,
						scrollTop: this.oldFeedsScollTop
					})
				} else {
					uni.pageScrollTo({
						duration: 0,
						scrollTop: this.oldNewsScollTop
					})
				}
			},
			// 获取轮播图
			async getAds() {
				this.swiperList = await getAdvert()
			},
			// 获取动态
			async getFeedsList() {
				const feeds = await getFeeds()
				const feedList = feeds.feeds.map(item => {
					return {
						...item,
						cover: 'http://ts.lagou.uieee.com/api/v2/files/' + item.images[0].file,
						avatar: item.user.avatar ? item.user.avatar.url : '/static/nopic.png',
						name: item.user.name
					}
				})
				this.feedList = [...this.feedList, ...feedList]
			},
			// 获取咨询
			async getNewsList() {
				const news = await getNews()
				const newsList = news.map(item => {
					return {
						...item,
						cover: 'http://ts.lagou.uieee.com/api/v2/files/' + item.image.id
					}
				})
				this.newsList = [...this.newsList, ...newsList]
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep.one-nav {
		height: 80upx;
		width: 110upx;
		color: #9B9B9B;
		font-size: 36upx;
		text-align: center;
		font-weight: blod;
		line-height: 80upx;

		&.nav-actived {
			color: #0050FF;
		}
	}

	.header-box {
		position: relative;
		left: 0;
		height: 550upx;
		background-color: #f1f1f1;

		.swiper {
			width: 750upx;
			height: 400upx;
			position: absolute;
			left: 0;
			top: 0;
			text-align: center;
			z-index: 1;
		}

		.crile {
			width: 750upx;
			height: 50upx;
			position: absolute;
			left: 0;
			top: 355upx;
			z-index: 9;
		}

		.card-header {
			position: absolute;
			left: 0;
			top: 320upx;
			height: 160upx;
			z-index: 99;
			width: 710upx;
			margin-left: 20upx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;

			.card-one {
				width: 328upx;
				height: 96upx;
				border-radius: 49upx;
				background-color: #fff;
				margin: 0 10upx;
				box-shadow: 0 0 2px 0 rgb(188, 188, 188);
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: center;

				.img {
					width: 44upx;
					height: 44upx;
					margin-left: 50upx;
				}

				.title {
					margin-left: 30upx;
					font-size: 30upx;
					color: #001432;
				}
			}
		}

		.tabs-box {
			width: 750upx;
			position: absolute;
			z-index: 1;
			left: 0;
			top: 460upx;
			display: flex;
			flex-direction: row;
			justify-content: center;

			.one-nav {
				height: 80upx;
				width: 110upx;
				color: #9B9B9B;
				font-size: 36upx;
				text-align: center;
				font-weight: blod;
				line-height: 80upx;

				&.nav-actived {
					color: #0050FF;
				}
			}
		}
	}

	.infoSwiper {
		background-color: #f1f1f1;
		padding: 60upx 0 40upx;

		.feeds-box {
			width: 735upx;
			margin-left: 13upx;
			column-gap: 10px;
			column-count: 2;

			.feed {
				width: 358upx;
				margin-bottom: 12upx;
				background-color: #FFF;
				border-radius: 20upx;
				position: relative;

				.feed-img {
					width: 358upx;
					height: 300upx;
					border-radius: 10upx;
				}

				.feed-title {
					width: 350upx;
					margin-top: 15upx;
					margin-left: 10upx;
					font-size: 28upx;
					line-height: 40upx;
					color: #001432;
					text-align: left;
				}

				.feed-info {
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
					margin-top: 10upx;
					font-size: 20upx;
					color: #666;
					padding: 0 10upx 16upx;

					.iview {
						display: flex;
						flex-direction: row;
						flex-wrap: nowrap;
						justify-content: space-between;
						align-items: center;

						.ilike {
							display: flex;
							flex-direction: row;
							flex-wrap: nowrap;
							justify-content: space-between;
							align-items: center;
							height: 60upx;
							padding: 0 10upx;
							background-color: #FFFFFF;
						}
					}

					.avatar {
						margin-right: 10upx;
						height: 40upx;
						width: 40upx;
						border-radius: 50%;
						border: 1upx solid #eee;
					}

					.name {
						max-width: 120upx;
						color: #757474;
					}

					.micon {
						width: 32upx;
						height: 28upx;
					}

					.love-count {
						padding-left: 10upx;
						color: #757474;
					}
				}
			}
		}

		.news-box {
			height: 74px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: flex-start;
			align-content: center;
			padding: 10px 25upx;
			border-bottom: 1px solid #f1f1f1;
			background-color: #FFF;

			.left {
				width: 490upx;
				height: 140upx;
				text-align: left;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-start;

				.title {
					font-size: 30upx;
					line-height: 42upx;
					color: #001432;
					margin-top: 21upx;
				}

				.info {
					width: 490upx;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
					margin-top: 6upx;
					font-size: 20upx;
					color: #999;
				}
			}

			.right {
				width: 120upx;

				.pic {
					width: 120upx;
					height: 120upx;
					margin-top: 20upx;
					border-radius: 6upx;
				}
			}
		}
	}
</style>
