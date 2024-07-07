<template>
	<el-main>
		<el-card shadow="never" header="创建项目">
			<el-row>
				<el-col :lg="{span: 16, offset: 4}">
					<el-form ref="form" :model="form" :rules="rules" label-position="top">
						<el-form-item label="项目名称" prop="name">
							<el-input clearable v-model="form.name" placeholder="请输入项目名称"></el-input>
						</el-form-item>
						<el-form-item label="英文名" prop="enName">
							<el-input clearable v-model="form.enName" placeholder="请输入英文名"></el-input>
						</el-form-item>
<!--						<el-form-item label="包结构" prop="packageName">-->
<!--							<el-input placeholder="例:com.hy.yqcode" clearable v-model="form.packageName"></el-input>-->
<!--						</el-form-item>-->
						<el-form-item label="LOGO">
							<sc-upload v-model="form.logo" icon="el-icon-picture" title="上传logo" :cropper="true" :compress="1" :aspectRatio="1/1"></sc-upload>
						</el-form-item>
						<el-form-item label="项目简介" prop="description">
							<el-input type="textarea" :rows="4" v-model="form.description" clearable placeholder="请输入项目简介"></el-input>
						</el-form-item>
					</el-form>
					<el-button type="primary" @click="submit" :loading="submitLoading">创建</el-button>
				</el-col>
			</el-row>
		</el-card>
	</el-main>
</template>

<script>
	export default {
		name: 'create',
		data() {
			return {
				submitLoading: false,
				form: {
					name: '测试项目',
					enName: 'test',
					// packageName: 'com.hy.test',
					logo: '',
					description: '测试'
				},
				rules: {
					name: [
						{
							required: true,
							message: '请输入项目名称',
						}
					],
					enName: [
						{
							required: true,
							message: '请输入英文名',
						}
					],
					// packageName: [
					// 	{
					// 		required: true,
					// 		message: '请输入包结构',
					// 	}
					// ]
				}
			}
		},
		mounted() {

		},
		methods: {
			//提交
			submit(){
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.submitLoading = true
						this.$API.business.project.save.post(this.form).then(res => {
							if(res.code === 200){
								this.submitLoading = false
								this.$message.success('创建成功')
								// this.$router.push('/project/list')
							}
						})
					}else{
						return false
					}
				})
			}
		}
	}
</script>

<style scoped>

</style>
