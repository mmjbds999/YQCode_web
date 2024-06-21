<template>

	<el-main style="padding:0 20px;">
		<el-descriptions :column="1" border size="small">
			<el-descriptions-item label="请求接口">{{data.url}}</el-descriptions-item>
			<el-descriptions-item label="请求方法">{{data.method}}</el-descriptions-item>
			<el-descriptions-item label="状态代码">{{data.code}}</el-descriptions-item>
			<el-descriptions-item label="日志名">{{data.title}}</el-descriptions-item>
			<el-descriptions-item label="日志时间">{{data.createTime}}</el-descriptions-item>
		</el-descriptions>
		<el-collapse v-model="activeNames" style="margin-top: 20px;">
			<el-collapse-item title="错误描述" name="1">
				<el-alert :title="data.err" :type="typeMap[data.code==='200'?'info':'error']" :closable="false"></el-alert>
			</el-collapse-item>
			<el-collapse-item title="错误详情" name="2">
				<div class="code">
					{{data.errMsg}}
				</div>
			</el-collapse-item>
		</el-collapse>
	</el-main>
</template>

<script>
	export default {
		data() {
			return {
				data: {},
				activeNames: ['1','2'],
				typeMap: {
					'info': "info",
					'warn': "warning",
					'error': "error"
				}
			}
		},
		methods: {
			setData(data){
				this.data = data
			}
		}
	}
</script>

<style scoped>
	.code {background: #848484;padding:15px;color: #fff;font-size: 12px;border-radius: 4px;}
</style>
