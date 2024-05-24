<template>
	<el-card shadow="hover" header="版权" class="item-background">
		<p>
			版权所有 (c) 2024 <a href="https://github.com/mmjbds999" style="color: #53a7ff">[mmjbds999]</a>。保留所有权利。
		</p>

	</el-card>
</template>

<script>
	export default {
		title: "进度环",
		icon: "el-icon-odometer",
		description: "进度环原子组件演示",
		data() {
			return {

			}
		}
	}
</script>

<style scoped>
	.progress {text-align: center;}
	.progress .percentage-value {font-size: 28px;}
	.progress .percentage-label {font-size: 12px;margin-top: 10px;}
	.item-background p {color: #999;margin-top:10px;line-height: 1.8;}
</style>
