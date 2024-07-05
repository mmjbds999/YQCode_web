<template>
	<el-dialog title="密码重置" v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false" width="500px">
		<el-form ref="dialogForm" :model="form" :rules="rules" label-width="100px" label-position="left">
			<el-form-item label="新密码" prop="password">
				<el-input type="password" v-model="form.password" clearable show-password></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="password2">
				<el-input type="password" v-model="form.password2" clearable show-password></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="saveStatus" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
export default {
	emits: ['closed'],
	data() {
		return {
			ids:[],
			visible:false,
			saveStatus:false,
			form:{},
			rules: {
				password: [
					{required: true, message: '请输入登录密码'}
				],
				password2: [
					{required: true, message: '请再次输入密码'},
					{validator: (rule, value, callback) => {
						if (value !== this.form.password) {
							callback(new Error('两次输入密码不一致!'));
						}else{
							callback();
						}
					}}
				],
			},
		}
	},
	methods: {
		open(ids){
			this.ids = ids;
			this.visible = true;
			return this;
		},
		async submit(){
			let params = {
				ids: this.ids,
				password: this.form.password
			}
			let res = await this.$API.system.user.resetPassword.post(params);
			if(res.code === 200){
				this.$message.success('密码重置成功');
				this.visible = false;
			}else{
				this.$message.error(res.message);
			}
		}
	}
}
</script>

<style scoped>

</style>
