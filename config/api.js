const http = uni.$u.http
// 获取广告轮播图
export const getAdvert = params => http.get('/advertisingspace/advertising?space=1,2,3')
// 获取动态列表
export const getFeeds = params => http.get('/feeds', params)
// 获取资讯列表
export const getNews = params => http.get('/news', params)
// 获取动态详情
export const getFeedInfo = params => http.get(`/feeds/${params.id}`)
// 获取资讯详情
export const getNewInfo = params => http.get(`/news/${params.id}`)
// 获取动态评论
export const getFeedComments = params => http.get(`/feeds/${params.id}/comments`)
// 获取资讯评论
export const getNewComments = params => http.get(`/news/${params.id}/comments`)
// 获取手机号码登录验证码
export const getLoginCode = params => http.post('/verifycodes/register', params)
// 登录
export const userLogin = params => http.post('/auth/login', params)
// 注册
export const userRegister = params => http.post('/users', params)
// 查找用户信息
export const findUser = params => http.get(`/users/${params.name}`)
// 获取用户信息
export const getUserMsg = () => http.get('/user/counts')
// 点赞动态
export const likeThisFeed = params => http.post('/feeds/' + params.id + '/like')
// 取消点赞动态
export const unlikeThisFeed = params => http.delete('/feeds/' + params.id + '/unlike')
// 点赞资讯
export const likeThisNew = params => http.post('/news/' + params.id + '/likes')
// 取消点赞资讯
export const unlikeThisNew = params => http.delete('/news/' + params.id + '/likes')
// 评论一条动态
export const commentOneFeed = params => http.post('/feeds/' + params.id + '/comments', {
	body: params.body
})
// 评论一条资讯
export const commentOneInfo = params => http.post('/news/' + params.id + '/comments', {
	body: params.body
})
// 发布一条动态
export const postOneFeed = params => http.post('/feeds', params)
export const uploadFile = async file => {
	// 将文件写入后台系统系统
	let ufile = await uni.uploadFile({
		url: vm.$u.http.config.baseUrl + '/files',
		header: {
			Authorization: "Bearer " + uni.getStorageSync("token"),
		},
		name: 'file',
		file: rfile,
		filePath: file.path
	});
	console.log(JSON.parse(ufile[1].data))
	return JSON.parse(ufile[1].data)
}
