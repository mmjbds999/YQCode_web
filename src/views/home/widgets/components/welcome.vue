<template>
	<el-card shadow="hover" header="欢迎">
		<div class="welcome">
			<div class="logo">
				<img :src="$CONFIG.APP_LOGO">
				<h2>欢迎使用 {{$CONFIG.APP_NAME}} </h2>
			</div>
			<div class="tips">
<!--				<div class="tips-item">-->
<!--					<div class="tips-item-icon"><el-icon><el-icon-menu/></el-icon></div>-->
<!--					<div class="tips-item-message">这里是项目控制台，你可以点击右上方的“自定义”按钮来添加移除或者移动部件。</div>-->
<!--				</div>-->
				<div class="tips-item">
					<div class="tips-item-icon"><el-icon><el-icon-promotion/></el-icon></div>
					<div class="tips-item-message">{{$CONFIG.APP_DESC}}</div>
				</div>
<!--				<div class="tips-item">-->
<!--					<div class="tips-item-icon"><el-icon><el-icon-milk-tea/></el-icon></div>-->
<!--					<div class="tips-item-message">目前项目实现了快速的中后台系统0代码、低代码开发，后期预计会持续加入客户端的低代码开发!</div>-->
<!--				</div>-->
			</div>
<!--			<div class="actions">-->
<!--				<el-button type="primary" icon="el-icon-check" size="large" @click="godoc">文档</el-button>-->
<!--			</div>-->
		</div>
	</el-card>
</template>

<script>
	export default {
		title: "欢迎",
		icon: "el-icon-present",
		description: "项目特色以及文档链接",
		data() {
			return {

			}
		},
		methods: {
			godoc(){
				window.open("https://github.com/mmjbds999/YQCode")
			}
		}
	}
</script>

<style scoped>
	.welcome {}
	.welcome .logo {text-align: center;}
	.welcome .logo img {vertical-align: bottom;width: 100px;height: 100px;margin-bottom: 20px;}
	.welcome .logo h2 {font-size: 30px;font-weight: normal;display: flex;align-items: center;justify-content: center;}

	.tips {margin-top: 20px;padding:0 40px;}
	.tips-item {display: flex;align-items: center;justify-content: center;padding:7.5px 0;}
	.tips-item-icon {width: 40px;height:40px;display: flex;align-items: center;justify-content: center;border-radius: 50%;font-size: 18px;margin-right: 20px;color: var(--el-color-primary);background: rgba(180,180,180,0.1);}
	.tips-item-message {flex: 1;font-size: 14px;}

	.actions {text-align: center;margin: 40px 0 20px 0;}
</style>
