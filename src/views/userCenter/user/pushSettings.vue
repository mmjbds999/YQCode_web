<template>
	<el-card shadow="never" header="消息通知">
		<el-form ref="form" label-width="180px" label-position="left" style="margin-top:20px;">
			<el-form-item label="系统消息">
				<el-checkbox v-model="form.system">系统推送</el-checkbox>
				<el-checkbox v-model="form.new_wx">短信通知</el-checkbox>
			</el-form-item>
			<el-form-item label="业务消息">
				<el-checkbox v-model="form.business">系统推送</el-checkbox>
				<el-checkbox v-model="form.timeout_wx">短信通知</el-checkbox>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					system: true,
					business: true
				}
			}
		}
	}
</script>

<style>
</style>
