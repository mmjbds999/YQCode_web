<template>
	<el-dialog title="添加模型分类" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form ref="dialogForm" :model="form" :rules="rules" label-position="top">
			<el-form-item label="类型名称" prop="name">
				<el-input clearable v-model="form.name" placeholder="请输入类型名称"></el-input>
			</el-form-item>
			<el-form-item label="简介" prop="desp">
				<el-input v-model="form.desp" maxlength="15" clearable placeholder="类型简介不超过15个字"></el-input>
			</el-form-item>
			<el-form-item label="父类型" prop="parent">
				<el-cascader v-model="form.parent" :options="modType" :props="modTypeProps" :show-all-levels="false" clearable></el-cascader>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="submitLoading" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				mode: "add",
				visible: false,
				//表单数据
				form: {
					name: '',
					desp: '',
					parent: ""
				},
				submitLoading: false,
				modType: [],
				modTypeProps: {
					value: "id",
					label: "name",
					emitPath: false,
					checkStrictly: true
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
			this.getModType()
		},
		methods: {
			//获取字典列表
			async getModType(){
				let res = await this.$API.system.modType.tree.get();
				this.modType = res.data;
			},
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this;
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						let res = await this.$API.system.modType.save.post(this.form);
						this.isSaveing = false;
						if(res.code === 200){
							this.$emit('success', res.data, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							await this.$alert(res.message, "提示", {type: 'error'})
						}
					}
				})
			},
			//表单注入数据
			setData(data){
				console.log(data)
				this.form.id = data.id
				this.form.name = data.name
				this.form.desp = data.desp
				this.form.parent = data.parent;
			}
		}
	}
</script>

<style>
</style>
