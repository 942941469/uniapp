<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad(optipons) {
			this.url = decodeURI(optipons.url)
		}
	}
</script>

<style>

</style>
