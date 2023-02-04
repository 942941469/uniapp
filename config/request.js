module.exports = (vm) => {
	uni.$u.http.setConfig((config) => {
		// #ifdef H5
		config.baseURL = '/api';
		// #endif
		// #ifndef H5
		config.baseURL = 'http://ts.lagou.uieee.com/api/v2';
		// #endif
		return config
	})
	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => {
		const token = uni.getStorageSync('token')
		config.header.Authorization = 'Bearer ' + token
		config.header.Accept = 'application/json'
		return config
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		if (response.statusCode == 200) {
			return response.data
		}
	})
}
