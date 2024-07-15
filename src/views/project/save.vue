<template>
	<el-dialog title="创建项目" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form ref="form" :model="form" :rules="rules" label-position="top">
			<el-form-item label="项目名称" prop="name">
				<el-input clearable v-model="form.name" placeholder="请输入项目名称"></el-input>
			</el-form-item>
			<el-form-item label="英文名" prop="enName">
				<el-input clearable v-model="form.enName" placeholder="请输入英文名"></el-input>
			</el-form-item>
			<el-form-item label="LOGO">
				<sc-upload v-model="form.logo" icon="el-icon-picture" title="上传logo" :cropper="true" :compress="1" :aspectRatio="1/1"></sc-upload>
			</el-form-item>
			<el-form-item label="项目简介" prop="description">
				<el-input type="textarea" :rows="4" v-model="form.description" clearable placeholder="请输入项目简介"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				visible: false,
				isSaveing: false,
				//表单数据
				form: {
					name: '测试项目',
					enName: 'test',
					logo: '',
					description: '测试'
				},
				//验证规则
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
					]
				}
			}
		},
		mounted() {
		},
		methods: {
			//显示
			open(){
				this.visible = true;
				return this
			},
			//表单提交方法
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
			},
			//表单注入数据
			setData(data){
				Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
